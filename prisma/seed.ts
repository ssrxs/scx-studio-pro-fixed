import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PROMPT_TEMPLATES = [
  {
    collection: "Fashion",
    originalPrompt: "A person wearing a luxury black tuxedo, standing in a modern penthouse, cinematic lighting",
    template: "[SUBJECT] wearing [OUTFIT], [POSE] in [BACKGROUND], cinematic lighting, photorealistic, 8k",
    defaults: JSON.stringify({
      SUBJECT: "a person",
      OUTFIT: "luxury black tuxedo",
      POSE: "standing confidently",
      BACKGROUND: "a modern penthouse with city view",
      HAIR_STYLE: "slicked back",
      HAIR_COLOR: "dark"
    }),
    explanation: "Lüks moda fotoğrafı için ideal şablon.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500",
    isRefined: true
  },
  {
    collection: "Fashion",
    originalPrompt: "A person in elegant white summer dress, walking on a tropical beach at golden hour",
    template: "[SUBJECT] wearing [OUTFIT], [POSE] at [BACKGROUND], golden hour lighting, dreamy atmosphere",
    defaults: JSON.stringify({
      SUBJECT: "a person",
      OUTFIT: "elegant white summer dress",
      POSE: "walking gracefully",
      BACKGROUND: "a tropical beach at golden hour",
      HAIR_STYLE: "flowing",
      HAIR_COLOR: "blonde"
    }),
    explanation: "Yaz tatili ve plaj fotoğrafları için.",
    imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=500",
    isRefined: true
  },
  {
    collection: "Portrait",
    originalPrompt: "Professional headshot of a person, neutral background, studio lighting",
    template: "Professional headshot of [SUBJECT] with [HAIR_STYLE] [HAIR_COLOR] hair, [OUTFIT], neutral background, studio lighting, sharp focus",
    defaults: JSON.stringify({
      SUBJECT: "a professional",
      OUTFIT: "business casual attire",
      POSE: "looking directly at camera",
      BACKGROUND: "clean neutral background",
      HAIR_STYLE: "neat",
      HAIR_COLOR: "natural"
    }),
    explanation: "LinkedIn ve CV fotoğrafları için profesyonel portre.",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=500",
    isRefined: true
  },
  {
    collection: "Cyberpunk",
    originalPrompt: "A person in cyberpunk armor, neon-lit Tokyo street at night, rain reflections",
    template: "[SUBJECT] wearing [OUTFIT], [POSE] in [BACKGROUND], neon lights, rain reflections, cyberpunk aesthetic, cinematic",
    defaults: JSON.stringify({
      SUBJECT: "a warrior",
      OUTFIT: "cyberpunk neon armor with LED details",
      POSE: "standing heroically",
      BACKGROUND: "neon-lit Tokyo street at night with rain",
      HAIR_STYLE: "undercut",
      HAIR_COLOR: "neon blue"
    }),
    explanation: "Siber punk ve fütüristik tema için.",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500",
    isRefined: true
  },
  {
    collection: "Nature",
    originalPrompt: "A person in casual hiking clothes, standing on a mountain peak, vast landscape",
    template: "[SUBJECT] wearing [OUTFIT], [POSE] on [BACKGROUND], natural light, epic landscape photography",
    defaults: JSON.stringify({
      SUBJECT: "an adventurer",
      OUTFIT: "casual hiking clothes and boots",
      POSE: "standing triumphantly",
      BACKGROUND: "a mountain peak with vast landscape",
      HAIR_STYLE: "natural",
      HAIR_COLOR: "natural"
    }),
    explanation: "Doğa ve macera fotoğrafları için.",
    imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=500",
    isRefined: true
  },
  {
    collection: "Luxury",
    originalPrompt: "A person in designer clothes, sitting in a luxury car, dramatic lighting",
    template: "[SUBJECT] wearing [OUTFIT], [POSE] in [BACKGROUND], dramatic lighting, luxury lifestyle photography",
    defaults: JSON.stringify({
      SUBJECT: "a sophisticated person",
      OUTFIT: "designer suit and luxury watch",
      POSE: "sitting elegantly",
      BACKGROUND: "a luxury sports car interior",
      HAIR_STYLE: "styled",
      HAIR_COLOR: "dark"
    }),
    explanation: "Lüks yaşam tarzı fotoğrafları için.",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=500",
    isRefined: true
  },
  {
    collection: "Art",
    originalPrompt: "A person in Renaissance painting style, dramatic chiaroscuro lighting",
    template: "[SUBJECT] with [HAIR_STYLE] [HAIR_COLOR] hair, wearing [OUTFIT], [POSE], Renaissance painting style, dramatic chiaroscuro, oil painting texture",
    defaults: JSON.stringify({
      SUBJECT: "a noble figure",
      OUTFIT: "Renaissance era clothing",
      POSE: "seated in a classical pose",
      BACKGROUND: "dark dramatic background",
      HAIR_STYLE: "long flowing",
      HAIR_COLOR: "auburn"
    }),
    explanation: "Sanatsal ve tarihi portreler için.",
    imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=500",
    isRefined: false
  },
  {
    collection: "Street",
    originalPrompt: "A person in streetwear, urban environment, graffiti wall background",
    template: "[SUBJECT] wearing [OUTFIT], [POSE] in [BACKGROUND], street photography style, urban aesthetic",
    defaults: JSON.stringify({
      SUBJECT: "a young person",
      OUTFIT: "trendy streetwear with sneakers",
      POSE: "leaning against a wall",
      BACKGROUND: "urban street with graffiti",
      HAIR_STYLE: "casual",
      HAIR_COLOR: "natural"
    }),
    explanation: "Sokak moda ve urban fotoğraflar için.",
    imageUrl: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=500",
    isRefined: true
  }
];

async function main() {
  
  
  // Mevcut şablonları temizle
  await prisma.promptTemplate.deleteMany({});
  
  // Yeni şablonları ekle
  for (const template of PROMPT_TEMPLATES) {
    await prisma.promptTemplate.create({ data: template });
  }
  
  
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());


