/**
 * @file src/activities/step-sequence/config.js
 * @description İşlem Sıralama ("Önce Hangisi?") etkinliği için 3 ve 4 adımlı algoritma hikayeleri.
 */

export const EASY_SEQUENCES = [
  {
    id: 'flower3', title: 'Çiçek Büyütme', icon: '🌻',
    steps: [
      { step: 1, emoji: '🌰', label: 'Tohumu Ek' },
      { step: 2, emoji: '💧', label: 'Can Suyu Ver' },
      { step: 3, emoji: '🌻', label: 'Çiçek Açsın' },
    ],
  },
  {
    id: 'teeth3', title: 'Diş Fırçalama', icon: '🪥',
    steps: [
      { step: 1, emoji: '🧴', label: 'Macunu Sür' },
      { step: 2, emoji: '🪥', label: 'Dişini Fırçala' },
      { step: 3, emoji: '😁', label: 'Temiz Gülümse' },
    ],
  },
  {
    id: 'snowman3', title: 'Kardan Adam', icon: '⛄',
    steps: [
      { step: 1, emoji: '❄️', label: 'Kar Topu Yap' },
      { step: 2, emoji: '🥕', label: 'Havuç Burun Tak' },
      { step: 3, emoji: '⛄', label: 'Kardan Adam Hazır' },
    ],
  },
  {
    id: 'chick3', title: 'Civcivin Doğuşu', icon: '🐥',
    steps: [
      { step: 1, emoji: '🥚', label: 'Bütün Yumurta' },
      { step: 2, emoji: '🐣', label: 'Yumurta Çatladı' },
      { step: 3, emoji: '🐥', label: 'Civciv Çıktı' },
    ],
  },
  {
    id: 'cake3', title: 'Pasta Yapımı', icon: '🎂',
    steps: [
      { step: 1, emoji: '🥣', label: 'Hamuru Karıştır' },
      { step: 2, emoji: '🔥', label: 'Fırında Pişir' },
      { step: 3, emoji: '🎂', label: 'Pastayı Süsle' },
    ],
  },
  {
    id: 'butterfly3', title: 'Kelebek Oluşumu', icon: '🦋',
    steps: [
      { step: 1, emoji: '🐛', label: 'Acıkmış Tırtıl' },
      { step: 2, emoji: '🫘', label: 'Kozaya Girer' },
      { step: 3, emoji: '🦋', label: 'Kelebek Uçar' },
    ],
  },
  {
    id: 'hands3', title: 'El Yıkama', icon: '🧼',
    steps: [
      { step: 1, emoji: '💧', label: 'Elleri Islat' },
      { step: 2, emoji: '🧼', label: 'Sabunla Köpürt' },
      { step: 3, emoji: '✨', label: 'Tertemiz Kurula' },
    ],
  },
  {
    id: 'paint3', title: 'Resim Yapma', icon: '🎨',
    steps: [
      { step: 1, emoji: '📄', label: 'Boş Kağıt Al' },
      { step: 2, emoji: '🖌️', label: 'Fırçayla Boya' },
      { step: 3, emoji: '🖼️', label: 'Tabloyu As' },
    ],
  },
];

export const MASTER_SEQUENCES = [
  {
    id: 'appletree4', title: 'Elma Ağacı', icon: '🍎',
    steps: [
      { step: 1, emoji: '🌰', label: 'Tohum Ekilir' },
      { step: 2, emoji: '🌱', label: 'Filiz Çıkar' },
      { step: 3, emoji: '🌳', label: 'Ağaç Büyür' },
      { step: 4, emoji: '🍎', label: 'Elma Verir' },
    ],
  },
  {
    id: 'sandwich4', title: 'Sandviç Yapımı', icon: '🥪',
    steps: [
      { step: 1, emoji: '🍞', label: 'Ekmeği Al' },
      { step: 2, emoji: '🧀', label: 'Peynir Koy' },
      { step: 3, emoji: '🍅', label: 'Domates Ekle' },
      { step: 4, emoji: '🥪', label: 'Sandviç Hazır' },
    ],
  },
  {
    id: 'space4', title: 'Uzay Görevi', icon: '🚀',
    steps: [
      { step: 1, emoji: '🧑‍🚀', label: 'Kıyafetini Giy' },
      { step: 2, emoji: '🚀', label: 'Rokete Bin' },
      { step: 3, emoji: '🔥', label: 'Uzaya Fırlat' },
      { step: 4, emoji: '🌕', label: 'Aya İniş Yap' },
    ],
  },
  {
    id: 'house4', title: 'Ev İnşaatı', icon: '🏡',
    steps: [
      { step: 1, emoji: '🕳️', label: 'Temel Kazılır' },
      { step: 2, emoji: '🧱', label: 'Duvar Örülür' },
      { step: 3, emoji: '🔺', label: 'Çatı Konulur' },
      { step: 4, emoji: '🏡', label: 'Ev Tamamlanır' },
    ],
  },
  {
    id: 'rainbow4', title: 'Gökkuşağı Oluşumu', icon: '🌈',
    steps: [
      { step: 1, emoji: '☁️', label: 'Bulut Toplanır' },
      { step: 2, emoji: '🌧️', label: 'Yağmur Yağar' },
      { step: 3, emoji: '🌤️', label: 'Güneş Açar' },
      { step: 4, emoji: '🌈', label: 'Gökkuşağı Çıkar' },
    ],
  },
  {
    id: 'school4', title: 'Okula Hazırlık', icon: '🏫',
    steps: [
      { step: 1, emoji: '⏰', label: 'Sabah Uyan' },
      { step: 2, emoji: '🍳', label: 'Kahvaltı Yap' },
      { step: 3, emoji: '🎒', label: 'Çantanı Tak' },
      { step: 4, emoji: '🏫', label: 'Okula Git' },
    ],
  },
  {
    id: 'pizza4', title: 'Pizza Pişirme', icon: '🍕',
    steps: [
      { step: 1, emoji: '🫓', label: 'Hamuru Aç' },
      { step: 2, emoji: '🧀', label: 'Malzeme Diz' },
      { step: 3, emoji: '🔥', label: 'Fırında Pişir' },
      { step: 4, emoji: '🍕', label: 'Dilimle Ye' },
    ],
  },
  {
    id: 'frog4', title: 'Kurbağa Büyümesi', icon: '🐸',
    steps: [
      { step: 1, emoji: '🫧', label: 'Yumurta' },
      { step: 2, emoji: '🐟', label: 'Yüzen İribaş' },
      { step: 3, emoji: '🦎', label: 'Ayaklı İribaş' },
      { step: 4, emoji: '🐸', label: 'Yeşil Kurbağa' },
    ],
  },
];

export function shuffleSteps(steps) {
  const copy = [...steps];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  // Tamamen doğru sırada gelirse ilk ikisini yer değiştir
  if (copy.every((item, idx) => item.step === idx + 1) && copy.length > 1) {
    [copy[0], copy[1]] = [copy[1], copy[0]];
  }
  return copy;
}

export function createSurpriseSequence(stepCount = 3) {
  const emojis = ['⭐', '🍎', '🎈', '🧱', '🐟', '🌸'];
  const sym = emojis[Math.floor(Math.random() * emojis.length)];
  const steps = Array.from({ length: stepCount }, (_, i) => ({
    step: i + 1,
    emoji: sym.repeat(i + 1),
    label: `${i + 1} Tane`,
  }));
  return {
    id: `surprise-seq-${Date.now()}`,
    title: 'Azdan Çoğa Sırala',
    icon: sym,
    steps,
  };
}
