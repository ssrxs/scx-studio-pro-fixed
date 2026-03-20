/**
 * SCX Studio - Magic Photo Shortcuts
 * Işık, Mevsim ve Odak gibi hızlı fotoğraf Düzenleme komutları.
 */

export const MAGIC_SHORTCUTS = {
  seasons: [
    { id: 'winter', name: 'Kış Yap', prompt: 'covered in thick snow, freezing winter atmosphere, soft cold daylight', icon: 'Snowflake' },
    { id: 'autumn', name: 'Sonbahar', prompt: 'vibrant autumn leaves, golden hour, warm orange and red colors', icon: 'Leaf' },
    { id: 'spring', name: 'İlkbahar', prompt: 'blooming cherry blossoms, fresh green grass, bright spring sunlight', icon: 'Flower' }
  ],
  lighting: [
    { id: 'studio', name: 'Stüdyo Işığı', prompt: 'professional studio portrait lighting, soft shadows, high-end flash', icon: 'Lightbulb' },
    { id: 'noir', name: 'Siyah Beyaz (Noir)', prompt: 'dramatic black and white, high contrast, film noir shadows', icon: 'Moon' },
    { id: 'neon', name: 'Neon/Siber', prompt: 'cyberpunk neon lighting, blue and magenta rim lights, futuristic glow', icon: 'Zap' }
  ],
  focus: [
    { id: 'bokeh', name: 'Derinlik (Blur)', prompt: 'extremely blurred background, f/1.2 aperture, sharp focus on subject, professional bokeh', icon: 'Focus' }
  ]
};

