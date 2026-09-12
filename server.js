const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'bot_config.json');

if (!fs.existsSync(DATA_FILE)) {
    const defaultConfig = {
        businessContext: `اسم المحل: shark vision
المنتج: نظارة فخمة وقوية مصنوعة من النحاس، ومعها علبة.
الألوان: أسود، أزرق غامق، بني، أزرق فاتح.
الأسعار:
- النظارة الواحدة: 100 شيكل
- عرض النظارتين: 180 شيكل
التوصيل:
- القدس: 150 شيكل شامل التوصيل
- الشمال: 170 شيكل شامل التوصيل
أسلوب الرد: قصير ومباشر (جملة جملة).`,
        dictionary: [
            { word: "قديش الدليفري", meaning: "كم سعر التوصيل؟" },
            { word: "بدي اياها صيد", meaning: "توصيل سريع وتأكيد طلب" },
            { word: "تنتين", meaning: "عرض النظارتين بـ 180 شيكل" }
        ]
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultConfig, null, 2));
}

app.get('/api/config', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(data);
});

app.post('/api/config', (req, res) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
    res.json({ status: 'success', message: 'تم حفظ البيانات بنجاح!' });
});

app.listen(PORT, () => {
    console.log(`موقع لوحة التحكم يعمل الآن على البورت: ${PORT}`);
});