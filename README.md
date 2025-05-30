# Online Anket ve Oylama Sistemi

## 📝 Proje Açıklaması
Online Anket ve Oylama Sistemi, kullanıcıların online anketler oluşturmasına, yönetmesine ve katılmasına olanak sağlayan web tabanlı bir uygulamadır. Sistem, hem anket oluşturanlar hem de katılımcılar için kullanıcı dostu bir arayüz sunmaktadır.

## ✨ Özellikler
- Kullanıcı girişi ve yetkilendirme
- Anket oluşturma ve yönetme
- Farklı soru tipleri (çoktan seçmeli, tek seçimli, metin girişli)
- Anlık sonuç görüntüleme
- Anket paylaşımı
- Mobil uyumlu tasarım
- Güvenli veri depolama

## 🛠️ Kullanılan Teknolojiler
- Frontend: React.js, TypeScript, Tailwind CSS
- Backend: Node.js, Express.js
- Veritabanı: MySQL
- Kimlik Doğrulama: JWT

## 🚀 Kurulum

### Gereksinimler
- Node.js
- MySQL
- npm veya yarn

### Kurulum Adımları

1. Projeyi klonlayın
```bash
git clone https://github.com/kullaniciadi/OnlineSurveyVotingSystem.git
cd OnlineSurveyVotingSystem
```

2. Bağımlılıkları yükleyin
```bash
# Backend bağımlılıkları
cd backend
npm install

# Frontend bağımlılıkları
cd ../frontend
npm install
```

3. Veritabanı kurulumu
- MySQL sunucunuzu başlatın
- Proje klasöründeki `database.sql` dosyasını MySQL'de çalıştırın

4. Uygulamayı başlatın
```bash
# Backend sunucusunu başlatın
cd backend
npm run dev

# Frontend sunucusunu başlatın
cd ../frontend
npm start
```

## 📁 Proje Yapısı
```
OnlineSurveyVotingSystem/
├── frontend/          # React uygulaması
│   ├── src/          # Kaynak kodları
│   └── public/       # Statik dosyalar
├── backend/          # Node.js sunucusu
│   ├── controllers/  # Kontrolcüler
│   ├── models/       # Veritabanı modelleri
│   ├── routes/       # API rotaları
│   └── database.sql  # Veritabanı şeması
└── README.md         # Proje dokümantasyonu
```

## 🔒 Güvenlik
- JWT tabanlı kimlik doğrulama
- Şifre şifreleme
- Giriş doğrulama
- CORS koruması

## 📄 Lisans
Bu proje MIT Lisansı altında lisanslanmıştır.

## 👥 Geliştirici
- Bünyamin YUSUFOĞLU
