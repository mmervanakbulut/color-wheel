/**
 * @file src/activities/step-sequence/stories.js
 * @description İşlem Sıralama etkinliği için 16 adet 3 adımlı (Kolay) ve 16 adet 4 adımlı (Usta) işlem hikayesi.
 */

export const EASY_SEQUENCES = [
  { id: 'flower3', title: 'Çiçek Büyütme', icon: '🌻', steps: [
    { step: 1, emoji: '🌰', label: 'Tohumu Ek' }, { step: 2, emoji: '💧', label: 'Can Suyu Ver' }, { step: 3, emoji: '🌻', label: 'Çiçek Açsın' },
  ]},
  { id: 'teeth3', title: 'Diş Fırçalama', icon: '🪥', steps: [
    { step: 1, emoji: '🧴', label: 'Macunu Sür' }, { step: 2, emoji: '🪥', label: 'Dişini Fırçala' }, { step: 3, emoji: '😁', label: 'Temiz Gülümse' },
  ]},
  { id: 'snowman3', title: 'Kardan Adam', icon: '⛄', steps: [
    { step: 1, emoji: '❄️', label: 'Kar Topu Yap' }, { step: 2, emoji: '🥕', label: 'Havuç Burun Tak' }, { step: 3, emoji: '⛄', label: 'Kardan Adam Hazır' },
  ]},
  { id: 'chick3', title: 'Civcivin Doğuşu', icon: '🐥', steps: [
    { step: 1, emoji: '🥚', label: 'Bütün Yumurta' }, { step: 2, emoji: '🐣', label: 'Yumurta Çatladı' }, { step: 3, emoji: '🐥', label: 'Civciv Çıktı' },
  ]},
  { id: 'cake3', title: 'Pasta Yapımı', icon: '🎂', steps: [
    { step: 1, emoji: '🥣', label: 'Hamuru Karıştır' }, { step: 2, emoji: '🔥', label: 'Fırında Pişir' }, { step: 3, emoji: '🎂', label: 'Pastayı Süsle' },
  ]},
  { id: 'butterfly3', title: 'Kelebek Oluşumu', icon: '🦋', steps: [
    { step: 1, emoji: '🐛', label: 'Acıkmış Tırtıl' }, { step: 2, emoji: '🫘', label: 'Kozaya Girer' }, { step: 3, emoji: '🦋', label: 'Kelebek Uçar' },
  ]},
  { id: 'hands3', title: 'El Yıkama', icon: '🧼', steps: [
    { step: 1, emoji: '💧', label: 'Elleri Islat' }, { step: 2, emoji: '🧼', label: 'Sabunla Köpürt' }, { step: 3, emoji: '✨', label: 'Tertemiz Kurula' },
  ]},
  { id: 'paint3', title: 'Resim Yapma', icon: '🎨', steps: [
    { step: 1, emoji: '📄', label: 'Boş Kağıt Al' }, { step: 2, emoji: '🖌️', label: 'Fırçayla Boya' }, { step: 3, emoji: '🖼️', label: 'Tabloyu As' },
  ]},
  { id: 'banana3', title: 'Muz Yeme', icon: '🍌', steps: [
    { step: 1, emoji: '🍌', label: 'Kabuklu Muz' }, { step: 2, emoji: '🙌', label: 'Kabuğunu Soy' }, { step: 3, emoji: '😋', label: 'Afiyetle Ye' },
  ]},
  { id: 'balloon3', title: 'Balon Şişirme', icon: '🎈', steps: [
    { step: 1, emoji: '🤏', label: 'Sönük Balon Al' }, { step: 2, emoji: '💨', label: 'Üfleyip Şişir' }, { step: 3, emoji: '🎈', label: 'İpini Bağla' },
  ]},
  { id: 'rain3', title: 'Yağmurda Çıkış', icon: '☂️', steps: [
    { step: 1, emoji: '🌧️', label: 'Yağmur Başladı' }, { step: 2, emoji: '🧥', label: 'Yağmurluk Giy' }, { step: 3, emoji: '☂️', label: 'Şemsiyeni Aç' },
  ]},
  { id: 'ice3', title: 'Buzun Erimesi', icon: '🧊', steps: [
    { step: 1, emoji: '🧊', label: 'Soğuk Buz Küpü' }, { step: 2, emoji: '☀️', label: 'Güneşte Isınır' }, { step: 3, emoji: '💧', label: 'Erir ve Su Olur' },
  ]},
  { id: 'crosswalk3', title: 'Karşıya Geçiş', icon: '🚦', steps: [
    { step: 1, emoji: '🔴', label: 'Kırmızıda Bekle' }, { step: 2, emoji: '🟢', label: 'Yeşil Işık Yandı' }, { step: 3, emoji: '🚶', label: 'Güvenle Geç' },
  ]},
  { id: 'sleep3', title: 'Uyku Zamanı', icon: '😴', steps: [
    { step: 1, emoji: '👕', label: 'Pijamanı Giy' }, { step: 2, emoji: '📖', label: 'Masal Dinle' }, { step: 3, emoji: '😴', label: 'Mışıl Mışıl Uyu' },
  ]},
  { id: 'gift3', title: 'Hediye Hazırlama', icon: '🎁', steps: [
    { step: 1, emoji: '🧸', label: 'Oyuncağı Seç' }, { step: 2, emoji: '📦', label: 'Kutuya Koy' }, { step: 3, emoji: '🎁', label: 'Kurdele Bağla' },
  ]},
  { id: 'juice3', title: 'Portakal Suyu', icon: '🍊', steps: [
    { step: 1, emoji: '🍊', label: 'Portakalı Kes' }, { step: 2, emoji: '🥣', label: 'Suyunu Sık' }, { step: 3, emoji: '🍹', label: 'Bardağa Doldur' },
  ]},
];

export const MASTER_SEQUENCES = [
  { id: 'appletree4', title: 'Elma Ağacı', icon: '🍎', steps: [
    { step: 1, emoji: '🌰', label: 'Tohum Ekilir' }, { step: 2, emoji: '🌱', label: 'Filiz Çıkar' },
    { step: 3, emoji: '🌳', label: 'Ağaç Büyür' }, { step: 4, emoji: '🍎', label: 'Elma Verir' },
  ]},
  { id: 'sandwich4', title: 'Sandviç Yapımı', icon: '🥪', steps: [
    { step: 1, emoji: '🍞', label: 'Ekmeği Al' }, { step: 2, emoji: '🧀', label: 'Peynir Koy' },
    { step: 3, emoji: '🍅', label: 'Domates Ekle' }, { step: 4, emoji: '🥪', label: 'Sandviç Hazır' },
  ]},
  { id: 'space4', title: 'Uzay Görevi', icon: '🚀', steps: [
    { step: 1, emoji: '🧑‍🚀', label: 'Kıyafetini Giy' }, { step: 2, emoji: '🚀', label: 'Rokete Bin' },
    { step: 3, emoji: '🔥', label: 'Uzaya Fırlat' }, { step: 4, emoji: '🌕', label: 'Aya İniş Yap' },
  ]},
  { id: 'house4', title: 'Ev İnşaatı', icon: '🏡', steps: [
    { step: 1, emoji: '🕳️', label: 'Temel Kazılır' }, { step: 2, emoji: '🧱', label: 'Duvar Örülür' },
    { step: 3, emoji: '🔺', label: 'Çatı Konulur' }, { step: 4, emoji: '🏡', label: 'Ev Tamamlanır' },
  ]},
  { id: 'rainbow4', title: 'Gökkuşağı Oluşumu', icon: '🌈', steps: [
    { step: 1, emoji: '☁️', label: 'Bulut Toplanır' }, { step: 2, emoji: '🌧️', label: 'Yağmur Yağar' },
    { step: 3, emoji: '🌤️', label: 'Güneş Açar' }, { step: 4, emoji: '🌈', label: 'Gökkuşağı Çıkar' },
  ]},
  { id: 'school4', title: 'Okula Hazırlık', icon: '🏫', steps: [
    { step: 1, emoji: '⏰', label: 'Sabah Uyan' }, { step: 2, emoji: '🍳', label: 'Kahvaltı Yap' },
    { step: 3, emoji: '🎒', label: 'Çantanı Tak' }, { step: 4, emoji: '🏫', label: 'Okula Git' },
  ]},
  { id: 'pizza4', title: 'Pizza Pişirme', icon: '🍕', steps: [
    { step: 1, emoji: '🫓', label: 'Hamuru Aç' }, { step: 2, emoji: '🧀', label: 'Malzeme Diz' },
    { step: 3, emoji: '🔥', label: 'Fırında Pişir' }, { step: 4, emoji: '🍕', label: 'Dilimle Ye' },
  ]},
  { id: 'frog4', title: 'Kurbağa Büyümesi', icon: '🐸', steps: [
    { step: 1, emoji: '🫧', label: 'Yumurta' }, { step: 2, emoji: '🐟', label: 'Yüzen İribaş' },
    { step: 3, emoji: '🦎', label: 'Ayaklı İribaş' }, { step: 4, emoji: '🐸', label: 'Yeşil Kurbağa' },
  ]},
  { id: 'robot4', title: 'Robotu Çalıştır', icon: '🤖', steps: [
    { step: 1, emoji: '🔌', label: 'Fişe Tak' }, { step: 2, emoji: '🔋', label: 'Pili Şarj Olsun' },
    { step: 3, emoji: '🟢', label: 'Başlat Tuşuna Bas' }, { step: 4, emoji: '🤖', label: 'Robot Yürüsün' },
  ]},
  { id: 'laundry4', title: 'Çamaşır Yıkama', icon: '🧺', steps: [
    { step: 1, emoji: '🧺', label: 'Kirlileri Topla' }, { step: 2, emoji: '🫧', label: 'Makinede Yıka' },
    { step: 3, emoji: '☀️', label: 'İpe As Kurusun' }, { step: 4, emoji: '👕', label: 'Katla Dolaba Koy' },
  ]},
  { id: 'honey4', title: 'Arının Bal Yapımı', icon: '🍯', steps: [
    { step: 1, emoji: '🌸', label: 'Çiçeğe Konar' }, { step: 2, emoji: '🐝', label: 'Çiçek Özü Toplar' },
    { step: 3, emoji: '🏠', label: 'Kovana Taşır' }, { step: 4, emoji: '🍯', label: 'Tatlı Bal Olur' },
  ]},
  { id: 'market4', title: 'Market Alışverişi', icon: '🛒', steps: [
    { step: 1, emoji: '📝', label: 'Liste Hazırla' }, { step: 2, emoji: '🛒', label: 'Sepete Doldur' },
    { step: 3, emoji: '💳', label: 'Kasada Öde' }, { step: 4, emoji: '🏠', label: 'Poşetleri Eve Taşı' },
  ]},
  { id: 'bike4', title: 'Bisiklet Sürme', icon: '🚲', steps: [
    { step: 1, emoji: '🪖', label: 'Kaskını Tak' }, { step: 2, emoji: '🚲', label: 'Bisiklete Bin' },
    { step: 3, emoji: '🦵', label: 'Pedalı Çevir' }, { step: 4, emoji: '🛣️', label: 'Keyifle Sür' },
  ]},
  { id: 'letter4', title: 'Mektup Gönderme', icon: '📮', steps: [
    { step: 1, emoji: '✍️', label: 'Mektubu Yaz' }, { step: 2, emoji: '✉️', label: 'Zarfa Koy' },
    { step: 3, emoji: '📮', label: 'Posta Kutusuna At' }, { step: 4, emoji: '📬', label: 'Adrese Ulaşsın' },
  ]},
  { id: 'bread4', title: 'Buğdaydan Ekmeğe', icon: '🍞', steps: [
    { step: 1, emoji: '🌾', label: 'Buğday Biçilir' }, { step: 2, emoji: '🥣', label: 'Un ve Hamur Yapılır' },
    { step: 3, emoji: '🔥', label: 'Fırında Pişer' }, { step: 4, emoji: '🍞', label: 'Sıcak Ekmek Olur' },
  ]},
  { id: 'daycycle4', title: 'Günün Zamanları', icon: '🌅', steps: [
    { step: 1, emoji: '🌅', label: 'Sabah Güneş Doğar' }, { step: 2, emoji: '☀️', label: 'Öğlen Tepede Parlar' },
    { step: 3, emoji: '🌇', label: 'Akşam Güneş Batar' }, { step: 4, emoji: '🌙', label: 'Gece Ay ve Yıldız' },
  ]},
];
