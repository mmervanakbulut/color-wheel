---
trigger: always_on
---

# Kredi Tasarrufu ve Yazılım Mimarisi Kuralları (SOLID / DRY / KISS)

1. **Önce İndeksi Kontrol Et:** Projede değişiklik yapmadan önce `AGENTS.md` ve `PROJECT_MAP.md` dosyalarını kontrol et.
2. **İlgisiz Klasörleri Okuma:** İstenen değişiklikle ilgisi olmayan `src/activities/*` klasörlerini asla okuma. Yalnızca ilgili etkinliğin ilgili alt dosyasını oku ve `edit_file` ile hedefli düzenleme yap.
3. **Dosya Boyutu Sınırı (Max ~250 Satır) & Tek Sorumluluk (SRP):** Yeni oluşturulan hiçbir `.jsx`, `.js` veya `.css` dosyası 250 satırı geçmemelidir. Her etkinlik kendi içinde `config.js`, alt sahne bileşenleri (`*Stage.jsx`, `*Modal.jsx`) ve ana kabuk (`*Activity.jsx`) olarak ayrılmalıdır.
4. **DRY (Kendini Tekrar Etme) & Tam İzolasyon:**
   - Ortak ses efektleri için `src/utils/sound.js`, tam ekran ve konfeti için `src/utils/ui.js`, ortak üst/alt bar stilleri için `src/styles/activity-shell.css` kullanılır.
   - Hiçbir etkinlik başka bir etkinliğin klasöründen dosya import edemez.
5. **Dokümantasyon Senkronizasyonu:** Yeni bir etkinlik, bileşen veya fonksiyon eklendiğinde `PROJECT_MAP.md`, `AGENTS.md` ve `README.md` dosyalarını aynı işlem turunda güncelle.
