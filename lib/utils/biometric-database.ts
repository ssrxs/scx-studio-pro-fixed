/**
 * SCX Studio - Biometric Database v12.0 (Ultimate Consolidated Edition)
 * Tüm etnik yapılar, anatomik sınırlar, makyaj, saç, sakal ve vücut yasaları.
 */

// --- GÖZ YAPILARI (EYE STRUCTURES) ---
export const EYE_SHAPES = [
  { id: 'almond', label: 'Almond (Badem)', desc: 'Dengeli, hafif yukarı canthus.' },
  { id: 'monolid', label: 'Monolid', desc: 'Asya tipi, katlanma çizgisi yok.' },
  { id: 'hooded', label: 'Hooded', desc: 'Düşük kapak, gizemli bakış.' },
  { id: 'upturned', label: 'Upturned', desc: 'Dinamik, kedi gözü formu.' },
  { id: 'downturned', label: 'Downturned', desc: 'Melankolik ifade.' },
  { id: 'round', label: 'Round', desc: 'Geniş sclera, meraklı.' }
];

export const EYE_COLORS_ETHNIC = [
  { id: 'obsidian', label: 'Deep Obsidian', desc: 'Siyah/Koyu Kahve.' },
  { id: 'amber_ring', label: 'Amber', desc: 'Kehribar ve koyu halka.' },
  { id: 'steel_blue', label: 'Steel Blue', desc: 'Çelik mavisi.' },
  { id: 'icy_grey', label: 'Icy Grey', desc: 'Buz grisi.' },
  { id: 'emerald_green', label: 'Emerald', desc: 'Zümrüt yeşili.' }
];

// --- KADIN VÜCUT VE GÖĞÜS DİNAMİKLERİ ---
export const BREAST_TYPES = [
  { id: 'teardrop', label: 'Damla (Natural)', desc: 'Doğal yerçekimi kavisli.' },
  { id: 'round', label: 'Yuvarlak', desc: 'Tam simetrik ve dolgun.' },
  { id: 'bell', label: 'Çan (Bell)', desc: 'Alt pol oldukça hacimli.' },
  { id: 'relaxed', label: 'Relaxed (Doğal Sarkma)', desc: 'Grade 1-3 doku gevşekliği.' }
];

export const BRA_EFFECTS = [
  { id: 'none', label: 'Doğal / Serbest', desc: 'Sütyensiz, gerçek yerçekimi.' },
  { id: 'push_up', label: 'Push-up', desc: 'Merkeze ve yukarı itilmiş.' },
  { id: 'balconette', label: 'Balconette', desc: 'Raf etkisi, üst dolgunluk.' },
  { id: 'bralette', label: 'Bralette', desc: 'Yumuşak destek, doğal form.' }
];

// --- KALÇA VE POPOLAR ---
export const HIP_SHAPES = [
  { id: 'hourglass', label: 'Hourglass (Kum Saati)', desc: 'İnce bel, dengeli kalça.' },
  { id: 'pear', label: 'Pear (Armut)', desc: 'Geniş alt kalça ve uyluk.' },
  { id: 'round', label: 'Round (O-Shape)', desc: 'Tam dairesel ve çıkık.' },
  { id: 'square', label: 'Square (H-Shape)', desc: 'Düz ve atletik yan hatlar.' },
  { id: 'inverted_triangle', label: 'Inverted Triangle', desc: 'Daralan alt yapı.' }
];

// --- BACAK ANATOMİSİ VE ÇORAP OPTİĞİ ---
export const HOSIERY_TYPES = [
  { id: 'sheer_15', label: 'İnce (15 Denier)', desc: 'Ten %80 görünür, parlak (sheen).' },
  { id: 'opaque_40', label: 'Opak (40 Denier)', desc: 'Mat ve örtücü doku.' },
  { id: 'fishnet', label: 'File (Fishnet)', desc: 'Ciltte geometrik baskı.' },
  { id: 'stay_up', label: 'Jartiyer (Stay-up)', desc: 'Üst bacakta karakteristik sıkışma.' }
];

// --- BURUN VE DUDAK (NOSE & LIP) ---
export const NOSE_SHAPES = [
  { id: 'aquiline', label: 'Aquiline (Kartal)', desc: 'Roma tipi kavisli.' },
  { id: 'grecian', label: 'Grecian (Düz)', desc: 'Dümdüz köprü.' },
  { id: 'button', label: 'Button (Düğme)', desc: 'Küçük, kalkık uçlu.' },
  { id: 'nubian', label: 'Nubian (Geniş)', desc: 'Geniş tabanlı.' },
  { id: 'bulbous', label: 'Bulbous (Etli)', desc: 'Geniş ve yuvarlak uçlu.' }
];

export const LIP_SHAPES = [
  { id: 'cupid', label: 'Cupid’s Bow', desc: 'V hatlı üst dudak.' },
  { id: 'full', label: 'Full Lips', desc: 'Dolgun ve hacimli.' },
  { id: 'thin', label: 'Thin Lips', desc: 'İnce hatlar.' },
  { id: 'wide', label: 'Wide Lips', desc: 'Geniş gülümseme hattı.' }
];

// --- KULAK VE ÇENE (EAR & JAW) ---
export const EAR_TYPES = [
  { id: 'prominent', label: 'Belirgin Helix', desc: 'Dışa doğru kavisli kıkırdak.' },
  { id: 'attached', label: 'Attached Lobe', desc: 'Yanağa birleşik kulak memesi.' },
  { id: 'detached', label: 'Free Lobe', desc: 'Sarkık ve özgür kulak memesi.' },
  { id: 'pointed', label: 'Pointed Tragus', desc: 'Keskin kanal önü çıkıntısı.' }
];

export const EAR_LOBES = [
  { id: 'detached', label: 'Detached (Ayrık)', desc: 'Sarkık ve özgür kulak memesi.' },
  { id: 'attached', label: 'Attached (Yapışık)', desc: 'Yanağa doğrudan birleşik.' }
];

export const JAWLINE_SHAPES = [
  { id: 'square', label: 'Kare (Maskülen)', desc: 'Geniş ve güçlü kemik hattı.' },
  { id: 'v_shape', label: 'V-Shape (Sivri)', desc: 'Çeneye doğru keskin daralma.' },
  { id: 'rounded', label: 'Yuvarlak (Soft)', desc: 'Yumuşak kemik geçişleri.' },
  { id: 'recessed', label: 'Geride (Weak)', desc: 'Profilde zayıf çene hattı.' }
];

// --- SAKAL VE BIYIK (FACIAL HAIR) ---
export const BEARD_DENSITY = [
  { id: 'vellus', label: 'Ayva Tüyü (Vellus)', desc: 'Şeffaf ve ince.' },
  { id: 'patchy', label: 'Patchy (Yamalı)', desc: 'Düzensiz, yeni çıkan.' },
  { id: 'sparse', label: 'Seyrek', desc: 'Cilt görünen.' },
  { id: 'dense', label: 'Gür (Terminal)', desc: 'Tam kapama.' }
];

export const BEARD_GROWTH_MM = [
  { id: 'shadow_05', label: '0.5mm (Gölge)', val: '0.5mm shadow' },
  { id: 'stubble_3', label: '3mm (Kirli)', val: '3mm heavy stubble' },
  { id: 'short_10', label: '10mm (Kısa)', val: '10mm business beard' },
  { id: 'medium_30', label: '3cm (Orta)', val: '3cm medium beard' },
  { id: 'long_50', label: '5cm+ (Gür)', val: '5cm+ full beard' }
];

export const MUSTACHE_STYLES = [
  { id: 'chevron', label: 'Chevron', desc: 'Kalın ve gür.' },
  { id: 'handlebar', label: 'Handlebar', desc: 'Kıvrımlı uçlar.' },
  { id: 'pencil', label: 'Pencil (İnce)', desc: 'İnce çizgi.' },
  { id: 'walrus', label: 'Walrus (Sarkık)', desc: 'Sarkık ve yoğun.' }
];

// --- SAÇ VE ETNİK YAPI (HAIR & ETHNICITY) ---
export const ETHNIC_HAIR_STRUCTURES = [
  { id: 'caucasian', label: 'Kafkas (Caucasian)', desc: 'Oval kıl, dalgalı.' },
  { id: 'african', label: 'Afrika (African)', desc: 'Elips kıl, sarmal.' },
  { id: 'asian', label: 'Asya (Asian)', desc: 'Yuvarlak kıl, sert/düz.' },
  { id: 'middle_eastern', label: 'Orta Doğu', desc: 'Yoğun ve koyu.' }
];

export const HAIR_TYPES_GRANULAR = [
  { id: '1A', label: 'Düz (İnce)', desc: 'Yumuşak ve parlak.' },
  { id: '1C', label: 'Düz (Sert)', desc: 'Kalın ve dirençli.' },
  { id: '2B', label: 'Dalgalı (Belirgin)', desc: 'S şeklinde bukleler.' },
  { id: '3B', label: 'Kıvırcık (Sık)', desc: 'Belirgin spiral bukleler.' },
  { id: '4C', label: 'Afro (Sıkı)', desc: 'En yoğun ve mat doku.' }
];

export const HAIR_COLORS = [
  { id: 'jet_black', label: 'Kuzguni Siyah', hex: '#0a0a0a' },
  { id: 'ash_brown', label: 'Küllü Kahve', hex: '#4b3a2f' },
  { id: 'platinum_blonde', label: 'Platin Sarışın', hex: '#e5e1d8' },
  { id: 'copper_red', label: 'Bakır Kızıl', hex: '#a5512b' },
  { id: 'silver_grey', label: 'Gümüş Gri', hex: '#c0c0c0' }
];

export const HAIR_STYLES_MEN = [
  { id: 'buzz_cut', label: '3 Numara (Buzz)', desc: 'Ultra kısa.' },
  { id: 'fade_undercut', label: 'Fade / Undercut', desc: 'Yanlar kısa, üst uzun.' },
  { id: 'pompadour', label: 'Pompadour', desc: 'Klasik hacimli üst.' },
  { id: 'man_bun', label: 'Topuz (Man Bun)', desc: 'Uzun saç, toplu.' }
];

export const HAIR_STYLES_WOMEN = [
  { id: 'pixie', label: 'Pixie', desc: 'Modern kısa kesim.' },
  { id: 'bob_cut', label: 'Küt (Bob)', desc: 'Çene hizasında düz.' },
  { id: 'beach_waves', label: 'Deniz Dalgası', desc: 'Doğal dalgalar.' },
  { id: 'high_ponytail', label: 'At Kuyruğu', desc: 'Sıkı ve yukarıdan.' }
];

export const HAIR_LOSS_SCALES = {
  male: [
    { id: 'n1', label: 'Norwood 1', desc: 'Kayıp yok.' },
    { id: 'n3', label: 'Norwood 3', desc: 'M-şekli, başlangıç.' },
    { id: 'n5', label: 'Norwood 5', desc: 'Tepe açılması.' },
    { id: 'n7', label: 'Norwood 7', desc: 'Tam kellik.' }
  ],
  female: [
    { id: 'l1', label: 'Ludwig 1', desc: 'Hafif seyrelme.' },
    { id: 'l3', label: 'Ludwig 3', desc: 'Tam tepe dökülmesi.' }
  ]
};

// --- CİLT VE YAŞLANMA (SKIN & AGING) ---
export const SKIN_CONDITIONS = [
  { id: 'clear', label: 'Pürüzsüz', desc: 'Kusursuz doku.' },
  { id: 'porous', label: 'Gözenekli', desc: 'Belirgin gözenekler.' },
  { id: 'acne_minor', label: 'Hafif Akne', desc: 'Küçük kızarıklıklar.' },
  { id: 'freckles', label: 'Çilli', desc: 'Doğal çiller.' }
];

export const SKIN_MARKS = [
  { id: 'sun_kissed', label: 'Güneş Çilleri', desc: 'Burun ve yanak üstü hafif çil.' },
  { id: 'beauty_mark', label: 'Güzellik Beni', desc: 'Belirgin ben.' },
  { id: 'dimples', label: 'Gamzeler', desc: 'Yanak çukurları.' }
];

export const AGING_SIGNS = [
  { id: 'none', label: 'Genç (Smooth)', desc: 'Çizgisiz.' },
  { id: 'fine_lines', label: 'İnce Çizgiler', desc: 'Göz çevresi.' },
  { id: 'nasolabial', label: 'Gülme Çizgileri', desc: 'Burun-ağız hattı.' }
];

// --- PROFESYONEL MAKYAJ (MAKEUP LAB) ---
export const MAKEUP_STYLES = [
  { id: 'no_makeup', label: 'No-Makeup Look', desc: 'Doğal görünüm.' },
  { id: 'glass_skin', label: 'Glass Skin', desc: 'Aşırı parlak.' },
  { id: 'smokey_eye', label: 'Smokey Eye', desc: 'Dramatik gözler.' }
];

export const LIPSTICK_FINISHES = [
  { id: 'matte', label: 'Matte', desc: 'Parlamayan.' },
  { id: 'glossy', label: 'High-Shine Gloss', desc: 'Islak görünüm.' }
];

// --- ANATOMİK YASALAR VE ORANLAR ---
export const SKULL_TYPES = [
  { id: 'mesocephalic', label: 'Mesocephalic (Orta)', desc: 'Dengeli kafa yapısı.' },
  { id: 'dolichocephalic', label: 'Dolichocephalic (Uzun)', desc: 'Dar ve uzun.' },
  { id: 'brachycephalic', label: 'Brachycephalic (Geniş)', desc: 'Kısa ve geniş.' }
];

export const FACIAL_PROPORTIONS = {
  thirds: "1:1:1 vertical ratio",
  fifths: "1/5 horizontal symmetry"
};

export const BODY_RATIOS = {
  whr_ideal: "0.7 waist-to-hip ratio",
  legs_ratio: "45-50% of total height"
};

export const HAND_RULES = [
  "5 fingers including thumb",
  "defined knuckles",
  "visible lunula on fingernails"
];

export const TEETH_TYPES = [
  { id: 'hollywood', label: 'Hollywood Smile', desc: 'Ultra beyaz ve simetrik.' },
  { id: 'natural', label: 'Natural Alignment', desc: 'Gerçekçi doku.' }
];

// --- PHYSICS VE ADVANCED ANATOMY ---
export const EYE_DYNAMICS = {
  rotation: {
    horiz: "±50 degrees",
    vert: "±48 degrees"
  },
  specular: "tear film moisture",
  pupil_dilation: "2-8mm"
};

export const NECK_LAWS = {
  sternocleidomastoid: "visible tension lines",
  trapezius: "shoulder muscle definition",
  proportions: "1/8 of total head height"
};

export const SKIN_ZONE_PHYSICS = {
  face: "high sebum, fine pores",
  neck: "thinner epidermis, visible veins",
  hands: "age indicator, visible knuckles",
  decollete: "sun damage susceptibility"
};

export const FABRIC_PHYSICS = {
  silk: "drapes smoothly, light refraction",
  leather: "rigid structure, specular highlights",
  cotton: "natural wrinkles, matte finish",
  denim: "structured folds, worn edges"
};

export const BODY_RATIOS = {
  whr_ideal: "0.7 waist-to-hip ratio",
  legs_ratio: "45-50% of total height",
  head_body: "1:7.5 proportion"
};
