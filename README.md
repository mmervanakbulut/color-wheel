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
- **🧭 3. Etkinlik — Rota ve Algoritma (`route-game`):**
  1. **8×8 ve 5×5 Harita Seçeneği:** Üst çubuktan tek tıkla 8×8 veya 5×5 tahtaya geçiş.
  2. **4 Karakter & Dünya:** Minik Kedi (🐟), Sevimli Arı (🌻), Akıllı Robot (🔋), Uzay Kaşifi (🪐).
  3. **Tek Adım & Algoritma Modu:** Oklarla anında ilerleme veya kod sırası dizip `▶️ BAŞLAT` ile çalıştırma, komşu kareye dokunarak adım atma ve BFS onaylı **🎲 Sürpriz Harita**.
- **🚂 4. Etkinlik — Tren Vagonu Örüntü (`train-pattern`):**
  1. **Kolay & Usta Modları:** Anasınıfı için 1 boş vagon (`AB-AB`, `AA-BB`, `AAB`) veya 1. sınıf için 2 boş vagon (`ABC-ABC`, `ABCD`).
  2. **4 Vagon Teması:** Renkli Şekiller, Neşeli Meyveler, Sevimli Hayvanlar, Uzay Treni ve **🎲 Sürpriz Tren**.

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
