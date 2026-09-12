// التعامل مع الرسائل الواردة
client.on('message', async (msg) => {
    if (msg.from.endsWith('@g.us')) return; // تتجاهل المجموعات

    addLog(`رسالة جديدة من ${msg.from}: ${msg.body}`);

    // رد تلقائي تجريبي (يمكن ربطه مع API الذكاء الاصطناعي)
    if (msg.body.toLowerCase() === 'مرحبا' || msg.body.toLowerCase() === 'هلا') {
        await msg.reply('أهلاً بك! أنا بوت Shark Vision الذكي، كيف يمكنني مساعدتك اليوم؟');
        addLog(`تم الرد تلقائياً على ${msg.from}`);
    }
});

// API الداشبورد
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
