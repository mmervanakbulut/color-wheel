# 🎲 Etkileşimli Sınıf Etkinlikleri Portalı (React + Vite + Tailwind CSS)

Akıllı tahta ve sınıf içi kullanım için tasarlanmış, **GridView (Izgara)** ana ekranlı etkileşimli etkinlikler web uygulaması.

---

## ✨ Özellikler

- **🏠 Sade GridView Ana Ekran:** Tüm etkinlikler büyük ikonları ve isimleriyle tek bir ızgara ekranda listelenir. Karta tıklandığında ilgili etkinlik tam ekran açılır, sol üstteki `🏠 Etkinlikler` tuşuyla tek tıkla ana ekrana dönülür.
- **🔊 Web Audio Ses Efektleri:** Tıklama, çark dönme (tik-tak), doğru/yanlış eşleştirme ve bitirme/konfeti ses efektleri (sesli okuma / TTS içermez).
- **🧱 1. Etkinlik — Lego Renkleri (`lego-colors`):**
  1. **🖐️ Parmak Lego:** Sol/sağ/iki el, elin üstü/avuç içi yönü, parmak sırası ve çarklı/çarksız renk seçimi.
  2. **🧱 Lego Kule:** 3–10 kat arası üst üste Lego dizme.
  3. **🧩 3 Seçenekli Eşleştirme:** 1'li, 2'li, 3'lü, 4'lü, 5'li, 6'lı rastgele Lego soruları ve 3 seçenek kartı.
  4. **♾️ Sonsuz Akış & `🏆 Bitir` Tuşu:** Etkinlikler öğretmen `🏆 Bitir` tuşuna basana kadar kesintisiz yeni turlarla devam eder.
- **😄 2. Etkinlik — Duygu Zarı & Çarkı (`emotion-dice`):**
  1. **🎲 3D Zar Modu:** 6 yüzünde 6 farklı duygu ifadesi (*Mutlu, Üzgün, Sinirli, Şaşırmış, Endişeli, Bu İş Oldu!*) bulunan 3 boyutlu küp zar. **Tek Zar** veya **Çift Zar (2'li taklit)** seçeneği.
  2. **🎡 Duygu Çarkı Modu:** Dilimlerinde duygu görselleri bulunan çark ve yanında dev taklit kartı.
  3. **🧩 Duygu Eşleştirme Modu:** Üstte çıkan duygu ifadesinin aynısını alttaki 3 seçenek arasından bulup eşleştirme.
  4. **👧 Kız / 👦 Erkek Seçimi:** Üst çubuktan tek tıkla kız veya erkek karakter görsellerine geçiş.

---

## 🚀 Kurulum ve Çalıştırma

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Web'de yayınlamak (Vercel / Netlify / Cloudflare Pages) için derle
npm run build
```

---

## ➕ Yeni Etkinlik Nasıl Eklenir?

1. `src/activities/<yeni-etkinlik-adi>/` klasöründe React bileşenini oluşturun.
2. `src/data/activities.js` içindeki `ACTIVITIES` dizisine yeni etkinliğin kart bilgisini ekleyin.
3. Kredi tasarrufu için `AGENTS.md` ve `PROJECT_MAP.md` indeksini güncelleyin.
