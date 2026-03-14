/**
 * SCX Studio - High Quality Background Library
 * Bu kütüphane, arka plan değiştirme özelliği için önceden tanımlanmış kategorileri ve 
 * yapay zeka için optimize edilmiş "World DNA" promptlarını içerir.
 */

export const BACKGROUND_CATEGORIES = [
  {
    id: 'travel',
    name: 'Dünya Turu',
    items: [
      { id: 'eiffel', name: 'Eyfel Kulesi', prompt: 'Eiffel Tower in Paris at sunset, cinematic lighting, wide shot, professional travel photography', thumbnail: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=500' },
      { id: 'santorini', name: 'Santorini', prompt: 'Santorini white houses with blue domes, overlooks the Aegean Sea, bright sunny day, crisp detail', thumbnail: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=500' },
      { id: 'tokyo', name: 'Tokyo Neon', prompt: 'Shinjuku Tokyo street at night, neon signs, rainy reflections on asphalt, cyberpunk aesthetic', thumbnail: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=500' },
      { id: 'ny', name: 'New York', prompt: 'Times Square New York City, towering skyscrapers, yellow cabs, bustling city life, high contrast', thumbnail: 'https://images.unsplash.com/photo-1485871901521-5b1fd3e71e07?q=80&w=500' }
    ]
  },
  {
    id: 'lifestyle',
    name: 'Yaşam Alanları',
    items: [
      { id: 'luxury_living', name: 'Lüks Salon', prompt: 'Modern luxury living room with floor-to-ceiling windows, minimalist furniture, warm afternoon sunlight', thumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=500' },
      { id: 'kitchen', name: 'Modern Mutfak', prompt: 'Ultra-modern kitchen with marble island, high-end appliances, bright morning light, clean aesthetic', thumbnail: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=500' },
      { id: 'office', name: 'CEO Ofisi', prompt: 'High-end executive office on a skyscraper top floor, panoramic city view, professional atmosphere', thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=500' },
      { id: 'bedroom', name: 'Boho Yatak Odası', prompt: 'Cozy bohemian style bedroom, plants, soft linen, fairy lights, warm and inviting atmosphere', thumbnail: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=500' }
    ]
  },
  {
    id: 'nature',
    name: 'Doğa ve Deniz',
    items: [
      { id: 'tropical_beach', name: 'Tropikal Plaj', prompt: 'Pristine tropical beach with white sand and turquoise water, palm trees, clear blue sky, Maldives style', thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500' },
      { id: 'forest', name: 'Gizemli Orman', prompt: 'Ancient forest with tall pine trees, sun rays piercing through the fog (volumetric fog), magical atmosphere', thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=500' },
      { id: 'snowy_mountains', name: 'Karlı Dağlar', prompt: 'Majestic snow-capped mountain range, Swiss Alps style, clear cold air, vast landscape', thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=500' }
    ]
  },
  {
    id: 'education',
    name: 'Okul ve Kütüphane',
    items: [
      { id: 'library', name: 'Klasik Kütüphane', prompt: 'Old grand library with dark wood bookshelves, thousands of books, vintage green lamps, dark academia aesthetic', thumbnail: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=500' },
      { id: 'classroom', name: 'Modern Sınıf', prompt: 'Bright modern university classroom, whiteboards, clean desks, daylight coming from side windows', thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=500' }
    ]
  }
];
