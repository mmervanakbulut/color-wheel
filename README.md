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
  1. **🎲 3D Zar Modu:** 6 yüzünde 6 farklı duygu ifadesi (*Mutlu, Üzgün, Sinirli, Şaşırmış, Endişeli, Bu İş Oldu!*) bulunan 3 boyutlu küp zar. **Tek Zar** veya **Çift Zar (1 Kız + 1 Erkek birlikte 2'li taklit)** seçeneği.
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
- **🚀 5. Etkinlik — Yönler Dünyası (`directions-world`):**
  1. **👀 Yöne Bak:** Roket, balık, uçak, uğur böceği veya dev okun hangi yöne (`Sağ, Sol, Yukarı, Aşağı`) gittiğini uzamsal artı düzeninde bulma (`4 Yön (Sağ-Sol-Yukarı-Aşağı)`, `Sağ-Sol` veya `Yukarı-Aşağı` filtresiyle).
  2. **🔍 Ters Yön:** 2×2 ızgarada diğerlerinden farklı yöne bakan nesneyi yakalama.
  3. **📍 Neresinde?:** Merkez nesnenin *Üstünde, Altında, Sağında, Solunda* konum kavramını bulma.
  4. **🎡 Hareket Çarkı:** 8 dilimli çark çevirip çıkan yöne göre tüm sınıfça bedensel hareket taklidi yapma.
- **🎨 6. Etkinlik — Piksel Kodlama (`pixel-coding`):**
  1. **🧩 Desen Kopyala:** `4×4 Kolay` (16 şablon) veya `5×5 Usta` (16 şablon; toplam **32 tanıdık desen**) örnek piksel deseni yanındaki boş ızgaraya birebir aktarma.
  2. **🔢 Kodla Boya:** Renk anahtarındaki sayı kodlarına (`1=Kırmızı`, `2=Mavi`...) bakarak gizli resmi ortaya çıkarma.
  3. **🎨 Renk Değiştir & 🎲 Akıllı Sürpriz Üretici:** Aynı şeklin renk/sayı kodlarını tek tıkla karıştırma (`🎨 Renk Değiştir`), kurallı simetrik **Piksel Karakter Yüzü / Geometrik Kodlama Motifi** üretme (`🎲 Sürpriz Desen`) ve **🎨 Serbest Tasarım**.
- **📋 7. Etkinlik — İşlem Sıralama (`step-sequence`):**
  1. **🌱 3 Adım (16 Hikaye) & 🚀 4 Adım (16 Hikaye — Toplam 32 İşlem):** Günlük yaşam, fen/doğa, trafik ve robot çalıştırma süreçlerini oluş sırasına göre dizme + 4 farklı modda (**Azdan Çoğa, Artan Sayı Zinciri, Kule İnşası, Ay Evreleri**) **🎲 Sürpriz Sıralama**.
- **🔓 8. Etkinlik — Sembol Şifre Çözücü (`symbol-cipher`):**
  1. **🔑 Şifre Anahtarı Okuma:** Sembollerin (`▲, ●, ■, ◆`) karşılık geldiği meyve, hayvan, uzay veya renk ikonlarını bularak 3 veya 4 haneli kilitleri açma.
- **🚦 9. Etkinlik — Eğer–İse Koşul Oyunu (`if-then-coding`):**
  1. **🌦️ 2 Koşul (Kolay) & 🚦 3 Koşul (Usta):** *Hava durumu, hayvan yuvası, renk ayırma, trafik lambası, taşıt yolu ve 5 ile sayı karşılaştırma* kurallarına göre koşullu karar verme.
- **🔁 10. Etkinlik — Döngü Atölyesi (`loop-coding`):**
  1. **Önce Yönleri Seç ➔ Sonra Tekrar Sayısıyla Grupla (`🔁 N× [ ... ]`):** Öğrenci önce bir veya birden fazla yön okuna (`➡️` veya `➡️ ⬇️`) basar, ardından kaç kez tekrar edeceğini (`1×..5×`) seçerek **`🔁 3× [ ➡️ ⬇️ ]`** şeklinde döngü grubunu oluşturur.
  2. **5×5 & 6×6 Haritalar ve 🎲 Sürpriz Harita:** Birden fazla döngü grubunu arka arkaya dizerek (`🔁 4× [ ➡️ ]` ➔ `🔁 3× [ ⬇️ ]`) veya merdiven gruplarıyla karakteri hedefe ulaştırma.
- **🐞 11. Etkinlik — Hata Ayıklama (`debug-coding`):**
  1. **Eksik (`❓`), Yanlış veya Fazla Adımı Düzeltme:** Karakterin hedefe ulaşması için önceden yazılmış yönergeyi **`▶️ YÖNERGEYİ DENE`** ile test etme; hatalı adıma (`🐞`) dokunup doğru yönle değiştirme, eksik **`❓`** boşluğunu doldurma, **`➕ Adım Ekle`** veya **`🗑️ Seçiliyi Sil`** ile bozuk kodu onarma.

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
