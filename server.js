const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let qrCodeData = '';
let isClientReady = false;
let botLogs = [];

function addLog(msg) {
    const time = new Date().toLocaleTimeString('ar-EG');
    botLogs.unshift(`[${time}] ${msg}`);
    if (botLogs.length > 50) botLogs.pop();
}

// إعداد عميل الواتساب
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

client.on('qr', (qr) => {
    isClientReady = false;
    qrcode.toDataURL(qr, (err, url) => {
        if (!err) {
            qrCodeData = url;
            addLog('تم توليد رمز QR جديد، بانتظار الكسح...');
        }
    });
});

client.on('ready', () => {
    isClientReady = true;
    qrCodeData = '';
    addLog('تم اتصال البوت بنجاح بالواتساب!');
});

client.on('authenticated', () => {
    addLog('تم التوثيق والتحقق من الجلسة بنجاح.');
});

client.on('auth_failure', (msg) => {
    isClientReady = false;
    addLog(`فشل التوثيق: ${msg}`);
});

client.on('disconnected', (reason) => {
    isClientReady = false;
    qrCodeData = '';
    addLog(`تم قطع الاتصال: ${reason}`);
    client.initialize();
});

client.on('message', async (msg) => {
    if (msg.from.endsWith('@g.us')) return; // تجاهل المجموعات

    addLog(`رسالة جديدة من ${msg.from}: ${msg.body}`);

    if (msg.body.toLowerCase() === 'مرحبا' || msg.body.toLowerCase() === 'هلا') {
        await msg.reply('أهلاً بك! أنا بوت Shark Vision الذكي، كيف يمكنني مساعدتك اليوم؟');
        addLog(`تم الرد تلقائياً على ${msg.from}`);
    }
});

app.get('/api/status', (req, res) => {
    res.json({
        ready: isClientReady,
        qr: qrCodeData,
        logs: botLogs
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    addLog(`السيرفر يعمل على المنفذ ${PORT}`);
    client.initialize();
});
