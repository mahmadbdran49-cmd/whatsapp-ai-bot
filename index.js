const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { Ollama } = require('ollama');

const ollama = new Ollama();

// =========================================================================
// 📝 معلومات مصلحة Shark Vision وتعليمات الرد
// =========================================================================
const businessContext = `
أنت موظف خدمة العملاء لمحل نظارات اسمه "shark vision".

تفاصيل المحل والمنتجات:
- اسم المحل: shark vision
- المنتج: نظارة فخمة وقوية مصنوعة من النحاس، وتأتي مع علبة مميزة.
- الألوان المتوفرة: أسود، أزرق غامق، بني، أزرق فاتح.
- العروض والأسعار الخاصة:
  * النظارة الواحدة: 100 شيكل (أو 150 شيكل شامل التوصيل للقدس / 170 شيكل شامل التوصيل للشمال).
  * عرض النظارتين: 180 شيكل (تنتين بـ 180).
- عند تأكيد الطلب: اطلب من الزبون إرسال كلمة "تم" أو تفاصيل عنوانه ورقم تلفونه لتثبيت الطلب والتوصيل 🚚.

قواعد وأسلوب الرد الحازمة:
1. رُد باختصار شديد جداً (جملة واحدة أو أسلوب دردشة مباشر).
2. إذا رحب بك الزبون (مثل: مرحبا، السلام عليكم)، رُد مباشرة: "هلا اخوي تفضل".
3. إذا سأل عن السعر أو العرض، أعطه العرض بأسلوب سليم ومباشر (مثال: "النظارة 100 والتنتين 180").
4. لا ترسل نصاً طويلاً دفعة واحدة أبداً، واجعل الرد يبدو كأنك شخص حقيقي يدردش.
`;
// =========================================================================

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
            '--disable-gpu'
        ],
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('امسح رمز الـ QR عبر الواتساب لتسجيل الدخول:');
});

client.on('ready', () => {
    console.log('البوت جاهز ويعمل الآن بنجاح مع بيانات Shark Vision!');
});

client.on('message', async (msg) => {
    if (msg.fromMe) return;

    try {
        console.log(`رسالة قادمة: ${msg.body}`);
        
        const response = await ollama.chat({
            model: 'qwen2.5:3b',
            messages: [
                { 
                    role: 'system', 
                    content: businessContext 
                },
                { role: 'user', content: msg.body }
            ],
            options: {
                num_predict: 60 // تحديد عدد الكلمات لضمان رد قصير وسريع جداً
            }
        });

        await msg.reply(response.message.content);
        console.log(`تم الرد: ${response.message.content}`);
    } catch (error) {
        console.error('حدث خطأ أثناء معالجة الرسالة:', error);
    }
});

client.initialize();