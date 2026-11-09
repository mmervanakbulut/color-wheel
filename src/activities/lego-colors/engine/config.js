/**
 * @file js/config.js
 * @description Sabit yapılandırmalar, varsayılan Lego renkleri ve parmak tanımları.
 *              Sunucusuz (file://) akıllı tahta çalışması için window.LegoApp altında tanımlanır.
 */

window.LegoApp = window.LegoApp || {};

window.LegoApp.DEFAULT_COLORS = [
  { id: 'yellow', name: 'Sarı',    hex: '#FFD600', border: '#CCA800', textHex: '#1E293B', active: true },
  { id: 'blue',   name: 'Mavi',    hex: '#1E88E5', border: '#1565C0', textHex: '#FFFFFF', active: true },
  { id: 'red',    name: 'Kırmızı', hex: '#E53935', border: '#B71C1C', textHex: '#FFFFFF', active: true },
  { id: 'green',  name: 'Yeşil',   hex: '#43A047', border: '#2E7D32', textHex: '#FFFFFF', active: false },
  { id: 'orange', name: 'Turuncu', hex: '#FB8C00', border: '#EF6C00', textHex: '#FFFFFF', active: false },
  { id: 'purple', name: 'Mor',     hex: '#8E24AA', border: '#6A1B9A', textHex: '#FFFFFF', active: false },
  { id: 'pink',   name: 'Pembe',   hex: '#EC407A', border: '#AD1457', textHex: '#FFFFFF', active: false },
  { id: 'white',  name: 'Beyaz',   hex: '#F8FAFC', border: '#94A3B8', textHex: '#1E293B', active: false }
];

/**
 * Parmak tanımları (0: Başparmak -> 4: Serçe Parmak)
 * Koordinatlar (x, y) standart Sağ El (El Üstü - Başparmak Solda) 400x450 SVG kutusuna göredir.
 */
window.LegoApp.FINGER_DEFINITIONS = [
  { index: 0, id: 'thumb',  name: 'Başparmak',      shortName: '1. Başparmak', x: 72,  y: 205, angle: -28 },
  { index: 1, id: 'index',  name: 'İşaret Parmağı', shortName: '2. İşaret',    x: 145, y: 78,  angle: -8  },
  { index: 2, id: 'middle', name: 'Orta Parmak',    shortName: '3. Orta',      x: 215, y: 52,  angle: 0   },
  { index: 3, id: 'ring',   name: 'Yüzük Parmağı',  shortName: '4. Yüzük',     x: 282, y: 78,  angle: 8   },
  { index: 4, id: 'pinky',  name: 'Serçe Parmak',   shortName: '5. Serçe',     x: 342, y: 142, angle: 20  }
];

window.LegoApp.DEFAULT_SETTINGS = {
  activity: 'hand',           // 'hand' (Parmak Lego) | 'tower' (Üst Üste Kule) | 'quiz' (3 Seçenekli Eşleştirme)
  towerHeight: 5,             // Kule modunda üst üste konulacak Lego sayısı (3 - 10 arası)
  quizLength: 1,              // Eşleştirme (Quiz) modunda kaçlı Lego sorulacağı (1 - 6 arası: 1'li, 2'li, 3'lü, 4'lü...)
  quizLayout: 'vertical',     // 'vertical' (Üst Üste Kule) | 'horizontal' (Yan Yana Sıra)
  quizAutoNext: false,        // Doğru bilince otomatik sonraki soruya geçsin mi? (false = Sıradaki tuşuyla, true = 1.5sn otomatik)
  gameMode: 'both',           // 'both' (Çark + Hedef) | 'finger-only' (Sadece Hedef Üzerinde Döngü) | 'wheel-only' (Sadece Çark)
  handType: 'right',          // 'left' (Sol El) | 'right' (Sağ El) | 'both' (İki El - 10 Parmak)
  handView: 'back',           // 'back' (Elin Üstü / Tırnak Yönü) | 'palm' (Avuç İçi)
  fingerOrder: 'thumb-first', // 'thumb-first' (Başparmaktan) | 'pinky-first' (Serçeden) | 'random' (Rastgele)
  durationSec: 3,             // Döngü / Çark dönüş süresi (saniye: 1 - 15)
  soundEnabled: true,         // Ses efektleri açık/kapalı
  voiceEnabled: false,        // Türkçe sesli okuma (Web Speech API) açık/kapalı
  noRepeatAdjacent: false     // Yan yana iki parmakta / üst üste iki katta aynı renk çıkmasın opsiyonu
};
