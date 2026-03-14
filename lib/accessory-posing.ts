/**
 * SCX Studio - Advanced Accessory Posing System
 * Aksesuarların kafa ve vücut duruşuna göre farklı takılma stilleri.
 */

export const WEAR_STYLES = {
  eyewear: [
    { id: 'standard', name: 'Tam Takılı', prompt_suffix: 'perfectly fitted on the bridge of the nose' },
    { id: 'low_nose', name: 'Burun Ucunda', prompt_suffix: 'slid down to the tip of the nose, eyes looking over the rims' },
    { id: 'on_head', name: 'Kafa Üstünde', prompt_suffix: 'pushed up onto the forehead, resting on hair' },
    { id: 'hanging', name: 'Yaka Askısı', prompt_suffix: 'hanging from the shirt collar' }
  ],
  headwear: [
    { id: 'straight', name: 'Düz', prompt_suffix: 'worn straight and centered' },
    { id: 'tilted', name: 'Yana Eğik', prompt_suffix: 'tilted stylishly to one side' },
    { id: 'backwards', name: 'Arkaya Dönük', prompt_suffix: 'worn backwards, street fashion style' },
    { id: 'low_brow', name: 'Gözlere Kadar', prompt_suffix: 'pulled down low over the eyebrows' }
  ],
  jewelry: [
    { id: 'over_clothes', name: 'Dışarıda', prompt_suffix: 'resting prominently over the clothing' },
    { id: 'under_collar', name: 'Yaka Altında', prompt_suffix: 'tucked slightly under the shirt collar' }
  ]
};

export const ACCESSORY_MODELS = [
  {
    category: 'eyewear',
    label: 'Gözlük Standı',
    models: [
      { id: 'aviator', name: 'Gold Aviator', prompt: 'luxury gold aviator sunglasses, reflective lenses' },
      { id: 'wayfarer', name: 'Black Wayfarer', prompt: 'classic black matte wayfarer glasses' },
      { id: 'rimless', name: 'Çerçevesiz', prompt: 'modern rimless optical glasses, minimalist' }
    ]
  },
  {
    category: 'headwear',
    label: 'Şapka Askısı',
    models: [
      { id: 'fedora', name: 'Fötr Şapka', prompt: 'vintage wool fedora hat' },
      { id: 'cap', name: 'Beyzbol Kep', prompt: 'modern athletic baseball cap' },
      { id: 'beanie', name: 'Örgü Bere', prompt: 'warm knit oversized beanie' }
    ]
  }
];
