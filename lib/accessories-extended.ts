/**
 * SCX Studio - Universal Accessory & Posing Library
 * Bu kütüphane; Gözlük, Kemer, Yüzük, Halhal ve Kulaklık gibi aksesuarların 
 * milimetrik pozisyon ve görünürlük ayarlarını içerir.
 */

export const UNIVERSAL_ACCESSORIES = {
  belts: {
    id: 'belts',
    name: 'Kemer Reyonu',
    styles: [
      { id: 'full', name: 'Tam Görünüm', prompt: 'fully visible belt, shirt tucked in' },
      { id: 'semi', name: 'Yarım Kapalı (French Tuck)', prompt: 'partially covered by shirt, stylish tuck' },
      { id: 'hidden', name: 'Ceket Altı', prompt: 'belt visible under open jacket or cardigan' }
    ],
    models: [
      { id: 'leather_gold', name: 'Deri & Altın Toka', prompt: 'luxury black leather belt with a polished gold buckle' },
      { id: 'minimalist_silver', name: 'Minimalist Gümüş', prompt: 'sleek slim brown belt with minimalist silver buckle' }
    ]
  },
  rings: {
    id: 'rings',
    name: 'Yüzük & Takı',
    positions: [
      { id: 'index', name: 'İşaret Parmağı', prompt: 'worn on the index finger' },
      { id: 'pinky', name: 'Serçe Parmak (Mühür)', prompt: 'chunky signet ring on pinky finger' },
      { id: 'midi', name: 'Eklem Yüzüğü', prompt: 'midi ring positioned above the knuckle' }
    ],
    models: [
      { id: 'diamond_band', name: 'Pırlanta Sıra', prompt: 'thin platinum band with small pavé diamonds' },
      { id: 'gold_signet', name: 'Altın Mühür', prompt: 'vintage 18k gold signet ring' }
    ]
  },
  anklets: {
    id: 'anklets',
    name: 'Halhal Vitrini',
    styles: [
      { id: 'barefoot', name: 'Çıplak Ayak', prompt: 'delicate gold chain on bare ankle' },
      { id: 'sneaker', name: 'Spor Ayakkabı Üstü', prompt: 'stylish silver anklet resting above white sneakers' }
    ]
  }
};
