/**
 * @file src/activities/pixel-coding/patterns.js
 * @description 4x4 Kolay (16 desen) ve 5x5 Usta (16 desen) toplam 32 anlamlı piksel şablonu.
 * Renk kodları: 1=Kırmızı, 2=Mavi, 3=Sarı, 4=Yeşil, 5=Mor, 6=Turuncu
 */

export const EASY_PATTERNS = [
  {
    id: 'house4', title: 'Sevimli Ev', icon: '🏠',
    grid: [[0, 1, 1, 0], [1, 1, 1, 1], [0, 3, 3, 0], [0, 3, 2, 0]],
  },
  {
    id: 'robot4', title: 'Akıllı Robot', icon: '🤖',
    grid: [[0, 2, 2, 0], [2, 3, 3, 2], [2, 2, 2, 2], [0, 1, 1, 0]],
  },
  {
    id: 'flower4', title: 'Lale', icon: '🌷',
    grid: [[1, 3, 3, 1], [1, 1, 1, 1], [0, 4, 4, 0], [4, 4, 4, 4]],
  },
  {
    id: 'rocket4', title: 'Mini Roket', icon: '🚀',
    grid: [[0, 1, 1, 0], [0, 2, 2, 0], [1, 2, 2, 1], [6, 0, 0, 6]],
  },
  {
    id: 'crown4', title: 'Altın Taç', icon: '👑',
    grid: [[3, 0, 0, 3], [3, 3, 3, 3], [3, 1, 2, 3], [3, 3, 3, 3]],
  },
  {
    id: 'mushroom4', title: 'Mantar', icon: '🍄',
    grid: [[0, 1, 1, 0], [1, 3, 3, 1], [0, 6, 6, 0], [0, 6, 6, 0]],
  },
  {
    id: 'boat4', title: 'Yelkenli', icon: '⛵',
    grid: [[0, 1, 0, 0], [0, 3, 3, 0], [2, 2, 2, 2], [0, 2, 2, 0]],
  },
  {
    id: 'smile4', title: 'Gülen Yüz', icon: '😊',
    grid: [[3, 2, 2, 3], [3, 3, 3, 3], [1, 3, 3, 1], [0, 1, 1, 0]],
  },
  {
    id: 'duck4', title: 'Sarı Ördek', icon: '🐤',
    grid: [[0, 3, 3, 0], [0, 2, 3, 6], [3, 3, 3, 0], [0, 6, 6, 0]],
  },
  {
    id: 'car4', title: 'Kırmızı Araba', icon: '🚗',
    grid: [[0, 2, 2, 0], [1, 1, 1, 1], [1, 3, 3, 1], [0, 5, 5, 0]],
  },
  {
    id: 'tree4', title: 'Meyveli Ağaç', icon: '🌳',
    grid: [[0, 4, 4, 0], [4, 1, 4, 1], [4, 4, 4, 4], [0, 6, 6, 0]],
  },
  {
    id: 'cat4', title: 'Minik Kedi', icon: '🐱',
    grid: [[6, 0, 0, 6], [6, 4, 4, 6], [6, 1, 1, 6], [0, 6, 6, 0]],
  },
  {
    id: 'apple4', title: 'Kırmızı Elma', icon: '🍎',
    grid: [[0, 0, 4, 0], [1, 1, 1, 1], [1, 3, 1, 1], [0, 1, 1, 0]],
  },
  {
    id: 'gift4', title: 'Hediye Paketi', icon: '🎁',
    grid: [[0, 1, 1, 0], [5, 1, 1, 5], [1, 1, 1, 1], [5, 1, 1, 5]],
  },
  {
    id: 'sun4', title: 'Parlak Güneş', icon: '☀️',
    grid: [[6, 0, 0, 6], [0, 3, 3, 0], [0, 3, 3, 0], [6, 0, 0, 6]],
  },
  {
    id: 'fish4', title: 'Renkli Balık', icon: '🐟',
    grid: [[0, 2, 2, 0], [6, 2, 3, 2], [6, 2, 2, 0], [0, 6, 0, 0]],
  },
];

export const MASTER_PATTERNS = [
  {
    id: 'heart5', title: 'Kalp', icon: '❤️',
    grid: [[0, 1, 0, 1, 0], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [0, 1, 1, 1, 0], [0, 0, 1, 0, 0]],
  },
  {
    id: 'house5', title: 'Bahçeli Ev', icon: '🏡',
    grid: [[0, 0, 1, 0, 0], [0, 1, 1, 1, 0], [1, 1, 1, 1, 1], [0, 3, 2, 3, 0], [4, 3, 2, 3, 4]],
  },
  {
    id: 'flower5', title: 'Bahar Çiçeği', icon: '🌸',
    grid: [[0, 5, 0, 5, 0], [5, 5, 3, 5, 5], [0, 5, 5, 5, 0], [0, 0, 4, 0, 0], [0, 4, 4, 4, 0]],
  },
  {
    id: 'tree5', title: 'Çam Ağacı', icon: '🌲',
    grid: [[0, 0, 3, 0, 0], [0, 4, 4, 4, 0], [4, 4, 1, 4, 4], [0, 0, 6, 0, 0], [0, 0, 6, 0, 0]],
  },
  {
    id: 'rocket5', title: 'Uzay Roketi', icon: '🚀',
    grid: [[0, 0, 1, 0, 0], [0, 2, 3, 2, 0], [0, 2, 2, 2, 0], [1, 2, 2, 2, 1], [0, 6, 0, 6, 0]],
  },
  {
    id: 'butterfly5', title: 'Kelebek', icon: '🦋',
    grid: [[5, 3, 0, 3, 5], [5, 5, 2, 5, 5], [0, 5, 2, 5, 0], [6, 6, 2, 6, 6], [6, 0, 0, 0, 6]],
  },
  {
    id: 'smile5', title: 'Mutlu Yüz', icon: '😄',
    grid: [[0, 3, 3, 3, 0], [3, 2, 3, 2, 3], [3, 3, 3, 3, 3], [3, 1, 3, 1, 3], [0, 3, 1, 3, 0]],
  },
  {
    id: 'cat5', title: 'Sevimli Kedi', icon: '🐱',
    grid: [[6, 0, 0, 0, 6], [6, 6, 6, 6, 6], [6, 4, 6, 4, 6], [6, 6, 1, 6, 6], [0, 6, 6, 6, 0]],
  },
  {
    id: 'icecream5', title: 'Dondurma', icon: '🍦',
    grid: [[0, 0, 1, 0, 0], [0, 5, 5, 5, 0], [0, 3, 3, 3, 0], [0, 6, 6, 6, 0], [0, 0, 6, 0, 0]],
  },
  {
    id: 'umbrella5', title: 'Yağmur Şemsiyesi', icon: '☂️',
    grid: [[0, 0, 5, 0, 0], [0, 5, 3, 5, 0], [5, 3, 5, 3, 5], [0, 0, 6, 0, 0], [0, 6, 6, 0, 0]],
  },
  {
    id: 'trophy5', title: 'Şampiyon Kupası', icon: '🏆',
    grid: [[3, 3, 3, 3, 3], [6, 3, 1, 3, 6], [0, 3, 3, 3, 0], [0, 0, 3, 0, 0], [0, 6, 6, 6, 0]],
  },
  {
    id: 'ship5', title: 'Büyük Gemi', icon: '⛵',
    grid: [[0, 0, 1, 0, 0], [0, 3, 1, 3, 0], [0, 3, 1, 3, 0], [2, 2, 2, 2, 2], [0, 2, 2, 2, 0]],
  },
  {
    id: 'ladybug5', title: 'Uğur Böceği', icon: '🐞',
    grid: [[0, 2, 0, 2, 0], [0, 1, 2, 1, 0], [1, 2, 1, 2, 1], [1, 1, 1, 1, 1], [0, 1, 0, 1, 0]],
  },
  {
    id: 'snowman5', title: 'Kardan Adam', icon: '⛄',
    grid: [[0, 1, 1, 1, 0], [0, 2, 6, 2, 0], [0, 2, 2, 2, 0], [4, 2, 1, 2, 4], [0, 2, 2, 2, 0]],
  },
  {
    id: 'plane5', title: 'Mavi Uçak', icon: '✈️',
    grid: [[0, 0, 2, 0, 0], [0, 0, 2, 0, 0], [1, 2, 3, 2, 1], [0, 0, 2, 0, 0], [0, 1, 2, 1, 0]],
  },
  {
    id: 'crown5', title: 'Kral Tacı', icon: '👑',
    grid: [[3, 0, 3, 0, 3], [3, 3, 3, 3, 3], [3, 1, 2, 1, 3], [3, 3, 3, 3, 3], [0, 6, 6, 6, 0]],
  },
];
