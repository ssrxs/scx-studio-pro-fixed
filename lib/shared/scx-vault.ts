/**
 * SCX Studio - Unified Master Vault
 * Aksesuar koleksiyonu + API key yönetimi
 */

// â”€â”€â”€ Aksesuar & Kıyafet Kataloğu â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const SCX_VAULT = {
  women: {
    label: 'Kadın Koleksiyonu',
    categories: [
      {
        id: 'shoes', name: 'Ayakkabı',
        styles: [{
          id: 'classic', name: 'Klasik & Topuklu',
          items: [
            { id: 'stiletto_12', name: 'Stiletto (12cm)', prompt: '12cm high stiletto heels, luxury design', postureImpact: 'extreme_scurve' },
            { id: 'pumps_7', name: 'Klasik Pump (7cm)', prompt: 'elegant suede pumps, 7cm heel', postureImpact: 'moderate_scurve' },
            { id: 'ballerina', name: 'Prada Ballerina', prompt: 'luxury satin ballerina flats, thin straps', postureImpact: 'neutral' },
            { id: 'nike_vomero', name: 'Nike Vomero 18', prompt: 'Nike Vomero 18 running shoes, modern mesh' },
            { id: 'adidas_samba', name: 'Adidas Samba OG', prompt: 'classic Adidas Samba white and black' }
          ]
        }]
      },
      {
        id: 'jewelry', name: 'Takı & Mücevher',
        styles: [{
          id: 'luxury', name: 'Lüks Mücevher',
          items: [
            { id: 'diamond_ring', name: 'Tektaş Yüzük', prompt: 'sparkling diamond engagement ring' },
            { id: 'anklet_gold', name: 'Altın Halhal', prompt: 'delicate 18k gold anklet chain' },
            { id: 'pearl_earrings', name: 'İnci Küpeler', prompt: 'classic white pearl drop earrings' }
          ]
        }]
      }
    ]
  },
  men: {
    label: 'Erkek Koleksiyonu',
    categories: [
      {
        id: 'shoes', name: 'Ayakkabı',
        styles: [{
          id: 'classic', name: 'Klasik & Oxford',
          items: [
            { id: 'oxford_leather', name: 'Deri Oxford', prompt: 'polished black leather oxford dress shoes' },
            { id: 'loafer_luxury', name: 'Gucci Loafer', prompt: 'luxury leather loafers with horsebit detail' },
            { id: 'jordan_1', name: 'Air Jordan 1 High', prompt: 'Air Jordan 1 Retro High OG, classic colorway' },
            { id: 'nike_af1', name: 'Nike Air Force 1', prompt: 'classic all-white Nike Air Force 1 Low' }
          ]
        }]
      },
      {
        id: 'accessories', name: 'Aksesuar',
        styles: [{
          id: 'street', name: 'Sokak Stili',
          items: [
            { id: 'cap_newera', name: 'New Era Kep', prompt: 'classic 59FIFTY fitted baseball cap' },
            { id: 'watch_luxury', name: 'Rolex Submariner', prompt: 'luxury dive watch, oystersteel band' },
            { id: 'chain_silver', name: 'Gümüş Zincir', prompt: 'thick silver Cuban link chain necklace' }
          ]
        }]
      }
    ]
  },
  unisex: {
    label: 'Unisex & Diğer',
    categories: [
      {
        id: 'eyewear', name: 'Gözlük & Optik',
        styles: [{
          id: 'shades', name: 'Güneş Gözlüğü',
          items: [
            { id: 'aviator', name: 'Ray-Ban Aviator', prompt: 'classic gold aviator sunglasses' },
            { id: 'wayfarer', name: 'Classic Wayfarer', prompt: 'timeless black wayfarer shades' },
            { id: 'sport', name: 'Spor Gözlük', prompt: 'modern sport wrap-around sunglasses' }
          ]
        }]
      },
      {
        id: 'tech', name: 'Teknoloji',
        styles: [{
          id: 'audio', name: 'Kulaklık',
          items: [
            { id: 'airpods_max', name: 'AirPods Max', prompt: 'Apple AirPods Max, metallic finish, around neck' },
            { id: 'sony_xm5', name: 'Sony WH-1000XM5', prompt: 'Sony noise cancelling headphones, modern style' }
          ]
        }]
      }
    ]
  }
};

export function getPosturePrompt(impact: string) {
  switch (impact) {
    case 'extreme_scurve': return 'exaggerated lumbar lordosis, anterior pelvic tilt, arched back, S-curve posture';
    case 'moderate_scurve': return 'elegant posture, subtle pelvic tilt, defined leg muscles';
    default: return 'natural standing posture';
  }
}

// â”€â”€â”€ Vault Agent â€” API Key Yönetimi â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
class VaultAgent {
  private keys: Record<string, string | undefined>;
  constructor() {
    this.keys = {
      FAL_KEY: process.env.FAL_KEY,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };
  }
  getKey(name: 'FAL_KEY' | 'GEMINI_API_KEY' | 'SUPABASE_URL' | 'SUPABASE_ANON_KEY') {
    const key = this.keys[name];
    if (!key || key === '') { console.warn(`[Vault] ${name} eksik!`); return null; }
    return key;
  }
  isReadyForRealMode() { return !!this.keys.FAL_KEY && this.keys.FAL_KEY !== ''; }
  reportStatus() {
    const s: Record<string, string> = {};
    for (const [k, v] of Object.entries(this.keys)) s[k] = v ? `${v.slice(0,4)}****` : 'EKSIK';
    return s;
  }
}
export const vaultAgent = new VaultAgent();

