export const SEED_CATEGORIES = [
  {
    id: "cat-polos",
    name: "Luxury Polos",
    slug: "polos",
    description: "Tailored from double-mercerized Egyptian cotton with structured collars.",
    image_url: "/products/polo_navy.jpg",
    display_order: 1
  },
  {
    id: "cat-crew-neck",
    name: "Supima Crew Necks",
    slug: "crew-neck",
    description: "Extra-long staple American Supima cotton for unmatched softness and drape.",
    image_url: "/products/tee_white.jpg",
    display_order: 2
  },
  {
    id: "cat-henleys",
    name: "Mercerized Henleys",
    slug: "henleys",
    description: "Mother-of-pearl plackets with custom ribbing for distinguished casual elegance.",
    image_url: "/products/tee_black.jpg",
    display_order: 3
  },
  {
    id: "cat-oversized",
    name: "Modern Relaxed & Oversized",
    slug: "oversized",
    description: "Contemporary silhouettes in 280 GSM heavyweight structured organic jersey.",
    image_url: "/products/tee_olive.jpg",
    display_order: 4
  }
,
  {
    "id": "cat-graphic-art",
    "name": "Artisan & Graphic Editions",
    "slug": "graphic-art",
    "description": "Architectural graphics, silkscreened art motifs, and high-density typography prints.",
    "image_url": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=900&auto=format&fit=crop",
    "display_order": 5
  },
  {
    "id": "cat-custom-bespoke",
    "name": "Bespoke & Custom Studio",
    "slug": "custom-bespoke",
    "description": "Customized embroidery, private client monograms, and made-to-order bespoke silhouettes.",
    "image_url": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=900&auto=format&fit=crop",
    "display_order": 6
  }];

export const SEED_PRODUCTS = [
  {
    id: "prod-supima-crew-classic",
    title: "The Sovereign Supima Crew Neck",
    slug: "sovereign-supima-crew-neck",
    tagline: "100% Extra-Long Staple American Supima® Cotton",
    description: "Engineered for connoisseurs of understated luxury. Crafted from rare, 100% American Supima® cotton, this tee offers a peerless featherlight drape, silk-like luster, and remarkable color retention through countless washes. Finished with our signature anti-curl neckline and discreet gold-threaded bar tacks.",
    fabric_details: "100% Extra-Long Staple American Supima Cotton (180 GSM). Double-dyed for color depth. Pre-shrunk bio-wash.",
    care_instructions: "Machine wash cold with like colours on delicate cycle. Lay flat to dry in shade. Warm iron if desired.",
    fit: "Tailored Fit",
    price: 1899,
    compare_at_price: 2499,
    category_id: "cat-crew-neck",
    is_featured: true,
    is_new: true,
    is_bestseller: true,
    rating: 4.9,
    reviews_count: 86,
    variants: [
      {
        id: "var-supima-navy-s",
        color_name: "Midnight Navy",
        color_hex: "#0c172d",
        size: "S",
        stock: 15,
        sku: "SF-SUP-NVY-S",
        image_url: "/products/tee_navy.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-supima-navy-m",
        color_name: "Midnight Navy",
        color_hex: "#0c172d",
        size: "M",
        stock: 24,
        sku: "SF-SUP-NVY-M",
        image_url: "/products/tee_navy.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-supima-navy-l",
        color_name: "Midnight Navy",
        color_hex: "#0c172d",
        size: "L",
        stock: 20,
        sku: "SF-SUP-NVY-L",
        image_url: "/products/tee_navy.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-supima-navy-xl",
        color_name: "Midnight Navy",
        color_hex: "#0c172d",
        size: "XL",
        stock: 5, // Low stock demo!
        sku: "SF-SUP-NVY-XL",
        image_url: "/products/tee_navy.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-supima-white-m",
        color_name: "Chalk White",
        color_hex: "#F8F8F8",
        size: "M",
        stock: 18,
        sku: "SF-SUP-WHT-M",
        image_url: "/products/tee_white.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-supima-white-l",
        color_name: "Chalk White",
        color_hex: "#F8F8F8",
        size: "L",
        stock: 14,
        sku: "SF-SUP-WHT-L",
        image_url: "/products/tee_white.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-supima-sand-m",
        color_name: "Desert Dune Sand",
        color_hex: "#D7C9B8",
        size: "M",
        stock: 12,
        sku: "SF-SUP-SND-M",
        image_url: "/products/tee_sand.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      }
    ]
  },
  {
    id: "prod-royal-mercerized-polo",
    title: "The Regal Mercerized Piqué Polo",
    slug: "regal-mercerized-pique-polo",
    tagline: "Double-Mercerized Giza 88 Egyptian Cotton",
    description: "Inspired by the refined courts of St. James. Cut from legendary Giza 88 long-staple yarn and treated to a dual mercerization process that imparts a subtle silky sheen, crisp hand-feel, and enduring structural fidelity. Features genuine Australian mother-of-pearl buttons and a non-rolling shirt-style collar.",
    fabric_details: "100% Mercerized Giza 88 Egyptian Cotton Piqué (220 GSM). Genuine Trochus shell buttons.",
    care_instructions: "Hand wash or gentle cold cycle with wool-safe detergent. Steam press lightly on reverse side.",
    fit: "Slim Tailored",
    price: 2999,
    compare_at_price: 3899,
    category_id: "cat-polos",
    is_featured: true,
    is_new: true,
    is_bestseller: true,
    rating: 4.95,
    reviews_count: 112,
    variants: [
      {
        id: "var-polo-navy-m",
        color_name: "Imperial Navy",
        color_hex: "#0F1A2E",
        size: "M",
        stock: 22,
        sku: "SF-POLO-IMP-M",
        image_url: "/products/tee_navy.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-polo-navy-l",
        color_name: "Imperial Navy",
        color_hex: "#0F1A2E",
        size: "L",
        stock: 19,
        sku: "SF-POLO-IMP-L",
        image_url: "/products/tee_navy.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-polo-navy-xl",
        color_name: "Imperial Navy",
        color_hex: "#0F1A2E",
        size: "XL",
        stock: 4, // Low stock demo!
        sku: "SF-POLO-IMP-XL",
        image_url: "/products/tee_navy.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-polo-burgundy-m",
        color_name: "Bordeaux Wine",
        color_hex: "#581825",
        size: "M",
        stock: 16,
        sku: "SF-POLO-BDX-M",
        image_url: "/products/tee_maroon.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-polo-olive-l",
        color_name: "Highland Pine",
        color_hex: "#2B3D2E",
        size: "L",
        stock: 14,
        sku: "SF-POLO-PINE-L",
        image_url: "/products/tee_olive.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      }
    ]
  },
  {
    id: "prod-mercerized-grandad-henley",
    title: "The Aristocrat Mercerized Henley",
    slug: "aristocrat-mercerized-henley",
    tagline: "4-Button Shell Placket with Silk Trim",
    description: "Bridging aristocratic heritage and off-duty leisure. Spun from 60s count compact combed cotton, featuring a four-button concealed placket with Italian silk piping on the inner band. The sleeves are finished with 1x1 French cuffs that hug the forearm gracefully.",
    fabric_details: "95% Mercerized Egyptian Cotton, 5% Elastane for movement (210 GSM). Custom dyed pearl buttons.",
    care_instructions: "Wash on delicate cycle inside out. Do not tumble dry. Reshape while damp.",
    fit: "Custom Fit",
    price: 2499,
    compare_at_price: 3299,
    category_id: "cat-henleys",
    is_featured: true,
    is_new: false,
    is_bestseller: true,
    rating: 4.88,
    reviews_count: 64,
    variants: [
      {
        id: "var-henley-charcoal-m",
        color_name: "Slate Charcoal",
        color_hex: "#2D3139",
        size: "M",
        stock: 18,
        sku: "SF-HEN-CHR-M",
        image_url: "/products/tee_grey.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-henley-charcoal-l",
        color_name: "Slate Charcoal",
        color_hex: "#2D3139",
        size: "L",
        stock: 22,
        sku: "SF-HEN-CHR-L",
        image_url: "/products/tee_grey.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-henley-white-m",
        color_name: "Alabaster Cream",
        color_hex: "#F4EFEA",
        size: "M",
        stock: 15,
        sku: "SF-HEN-ALB-M",
        image_url: "/products/tee_white.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      }
    ]
  },
  {
    id: "prod-heavyweight-oversized-tee",
    title: "The Minimalist Atelier Heavyweight Tee",
    slug: "minimalist-atelier-heavyweight-tee",
    tagline: "280 GSM Structured Compact Cotton",
    description: "The definitive contemporary luxury silhouette. Cut with architectural drop-shoulders and a boxy yet flattering drape. Knitted at 280 GSM, this garment holds its sculptural form without clinging, offering complete opacity and effortless sartorial confidence.",
    fabric_details: "100% Compact Organic Combed Cotton (280 GSM Heavyweight). Pre-washed with silicone softening.",
    care_instructions: "Machine wash cold. Turn inside out. Flat air dry. Do not bleach.",
    fit: "Relaxed Boxy Fit",
    price: 2199,
    compare_at_price: 2799,
    category_id: "cat-oversized",
    is_featured: true,
    is_new: true,
    is_bestseller: false,
    rating: 4.82,
    reviews_count: 47,
    variants: [
      {
        id: "var-over-olive-s",
        color_name: "Sage Moss",
        color_hex: "#4D5643",
        size: "S",
        stock: 10,
        sku: "SF-OVR-SGE-S",
        image_url: "/products/tee_olive.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-over-olive-m",
        color_name: "Sage Moss",
        color_hex: "#4D5643",
        size: "M",
        stock: 20,
        sku: "SF-OVR-SGE-M",
        image_url: "/products/tee_olive.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-over-olive-l",
        color_name: "Sage Moss",
        color_hex: "#4D5643",
        size: "L",
        stock: 15,
        sku: "SF-OVR-SGE-L",
        image_url: "/products/tee_olive.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-over-black-m",
        color_name: "Obsidian Black",
        color_hex: "#151515",
        size: "M",
        stock: 25,
        sku: "SF-OVR-OBS-M",
        image_url: "/products/tee_black.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      }
    ]
  },
  {
    id: "prod-textured-jacquard-knit-tee",
    title: "The Florentine Textured Jacquard Knit",
    slug: "florentine-textured-jacquard-knit",
    tagline: "Micro-Waffle Geometric Weave",
    description: "An homage to classic Italian resortwear. Knitted with an intricate dimensional waffle microstructure that encourages airflow while bestowing rich visual interest. Styled effortlessly under an unconstructed blazer or paired with tailored linen trousers.",
    fabric_details: "100% Mercerized Combed Long-Staple Cotton (230 GSM). Breathable micro-honeycomb knit.",
    care_instructions: "Gentle machine wash in washbag. Dry flat. Do not wring or tumble dry.",
    fit: "Regular European Fit",
    price: 2799,
    compare_at_price: 3499,
    category_id: "cat-crew-neck",
    is_featured: false,
    is_new: true,
    is_bestseller: false,
    rating: 4.91,
    reviews_count: 38,
    variants: [
      {
        id: "var-jac-cream-m",
        color_name: "Warm Ecru",
        color_hex: "#EFE8DC",
        size: "M",
        stock: 14,
        sku: "SF-JAC-ECR-M",
        image_url: "/products/tee_sand.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-jac-cream-l",
        color_name: "Warm Ecru",
        color_hex: "#EFE8DC",
        size: "L",
        stock: 12,
        sku: "SF-JAC-ECR-L",
        image_url: "/products/tee_sand.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-jac-slate-m",
        color_name: "Cobalt Slate",
        color_hex: "#1E2A3A",
        size: "M",
        stock: 16,
        sku: "SF-JAC-CBL-M",
        image_url: "/products/tee_navy.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      }
    ]
  },
  {
    id: "prod-tipping-collar-luxe-polo",
    title: "The Monogram Contrast-Tip Polo",
    slug: "monogram-contrast-tip-polo",
    tagline: "Subtle Gold Tipped Knit Collar & Cuffs",
    description: "The gold standard of country club panache. Detailed with a contrast champagne-gold tipping along the ribbed collar and sleeve cuffs. Fastened with bespoke metallic-rimmed buttons and finished with side vents bound in grosgrain ribbon.",
    fabric_details: "96% Supima Cotton, 4% Lycra (200 GSM). Contrast mercerized collar ribbing.",
    care_instructions: "Cold delicate wash. Iron inside out to protect tipping detail.",
    fit: "Athletic Tailored",
    price: 2599,
    compare_at_price: 3199,
    category_id: "cat-polos",
    is_featured: true,
    is_new: false,
    is_bestseller: true,
    rating: 4.89,
    reviews_count: 73,
    variants: [
      {
        id: "var-tip-black-m",
        color_name: "Black & Champagne",
        color_hex: "#111111",
        size: "M",
        stock: 20,
        sku: "SF-TIP-BLK-M",
        image_url: "/products/tee_black.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-tip-black-l",
        color_name: "Black & Champagne",
        color_hex: "#111111",
        size: "L",
        stock: 18,
        sku: "SF-TIP-BLK-L",
        image_url: "/products/tee_black.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      }
    ]
  },
  {
    id: "prod-sea-island-heritage-crew",
    title: "The Sovereign Sea Island Heritage Crew",
    slug: "sovereign-sea-island-heritage-crew",
    tagline: "Spun from Rare West Indian Sea Island Certified Cotton",
    description: "The pinnacle of textile provenance. Cultivated in the Caribbean microclimates, West Indian Sea Island cotton represents less than 0.0004% of global production. Silky to the touch with unrivaled staple length and tensile strength, handcrafted with blind-stitched hems.",
    fabric_details: "100% Certified West Indian Sea Island Cotton (170 GSM). Featherlight luxury single jersey.",
    care_instructions: "Hand wash cool or dry clean recommended. Lay flat in shade. Cool iron with cloth.",
    fit: "Tailored European Fit",
    price: 3499,
    compare_at_price: 4499,
    category_id: "cat-crew-neck",
    is_featured: true,
    is_new: true,
    is_bestseller: false,
    rating: 4.97,
    reviews_count: 51,
    variants: [
      {
        id: "var-seaisland-champagne-m",
        color_name: "Champagne Ivory",
        color_hex: "#F7F3E9",
        size: "M",
        stock: 15,
        sku: "SF-SEA-CHM-M",
        image_url: "/products/tee_white.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-seaisland-champagne-l",
        color_name: "Champagne Ivory",
        color_hex: "#F7F3E9",
        size: "L",
        stock: 12,
        sku: "SF-SEA-CHM-L",
        image_url: "/products/tee_white.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-seaisland-navy-m",
        color_name: "Savile Navy",
        color_hex: "#101D36",
        size: "M",
        stock: 14,
        sku: "SF-SEA-NVY-M",
        image_url: "/products/tee_navy.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      }
    ]
  },
  {
    id: "prod-monaco-grand-prix-polo",
    title: "The Riviera Monaco Knit Polo",
    slug: "riviera-monaco-knit-polo",
    tagline: "Open-Collar Resort Knit with Saddle-Stitch Shoulders",
    description: "Designed for Mediterranean afternoons and yacht club terraces. Features an Italian open Johnny collar without buttons, offering effortless nonchalance. Knitted from 2-ply long-staple combed cotton with subtle ribbed borders.",
    fabric_details: "100% Giza Long-Staple Combed Cotton (210 GSM). Breathable open-stitch knit.",
    care_instructions: "Cold gentle cycle inside a washbag. Dry flat. Never tumble dry.",
    fit: "Relaxed Tailored",
    price: 3199,
    compare_at_price: 3999,
    category_id: "cat-polos",
    is_featured: true,
    is_new: true,
    is_bestseller: true,
    rating: 4.93,
    reviews_count: 79,
    variants: [
      {
        id: "var-monaco-olive-m",
        color_name: "Portofino Olive",
        color_hex: "#344331",
        size: "M",
        stock: 18,
        sku: "SF-MNC-OLV-M",
        image_url: "/products/tee_olive.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-monaco-olive-l",
        color_name: "Portofino Olive",
        color_hex: "#344331",
        size: "L",
        stock: 16,
        sku: "SF-MNC-OLV-L",
        image_url: "/products/tee_olive.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-monaco-terracotta-m",
        color_name: "Tuscan Terracotta",
        color_hex: "#9E4733",
        size: "M",
        stock: 11,
        sku: "SF-MNC-TER-M",
        image_url: "/products/tee_maroon.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      }
    ]
  },
  {
    id: "prod-ottoman-ribbed-textured-tee",
    title: "The Ottoman Ribbed Architectural Tee",
    slug: "ottoman-ribbed-architectural-tee",
    tagline: "Horizontal Raised Ottoman Cord Structure",
    description: "A triumph of tactile textile architecture. Constructed with prominent horizontal ribs that drape with resolute structure while resisting wrinkling. Accented with twin-needle reinforced necklines and vented side splits.",
    fabric_details: "97% Combed Compact Cotton, 3% Elastane (260 GSM Heavyweight).",
    care_instructions: "Machine wash cold inside out. Flat air dry. Reshape while wet.",
    fit: "Structured Regular",
    price: 2699,
    compare_at_price: 3399,
    category_id: "cat-crew-neck",
    is_featured: false,
    is_new: true,
    is_bestseller: true,
    rating: 4.86,
    reviews_count: 42,
    variants: [
      {
        id: "var-ottoman-charcoal-m",
        color_name: "Anthracite Charcoal",
        color_hex: "#26282E",
        size: "M",
        stock: 20,
        sku: "SF-OTM-CHR-M",
        image_url: "/products/tee_grey.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-ottoman-charcoal-l",
        color_name: "Anthracite Charcoal",
        color_hex: "#26282E",
        size: "L",
        stock: 15,
        sku: "SF-OTM-CHR-L",
        image_url: "/products/tee_grey.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-ottoman-bone-m",
        color_name: "Bone Cream",
        color_hex: "#ECE6DC",
        size: "M",
        stock: 14,
        sku: "SF-OTM-BNE-M",
        image_url: "/products/tee_white.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      }
    ]
  },
  {
    id: "prod-artisanal-indigo-slub-tee",
    title: "The Kyoto Indigo Slub Artisan Tee",
    slug: "kyoto-indigo-slub-artisan-tee",
    tagline: "Rope-Dyed Natural Plant Indigo with Variable Slub Texture",
    description: "Imbued with Japanese wabi-sabi aesthetics. Spun with deliberate slub yarns that yield an organic, textured grain. Hand rope-dyed in authentic botanical indigo baths, this garment patinas gracefully with every wear, telling your unique sartorial story.",
    fabric_details: "100% Slub-Spun Organic Cotton (200 GSM). Plant indigo dip-dyed.",
    care_instructions: "Wash separately in cold water. Indigo may transfer during early wear. Air dry.",
    fit: "Relaxed Classic Fit",
    price: 2899,
    compare_at_price: 3699,
    category_id: "cat-crew-neck",
    is_featured: true,
    is_new: true,
    is_bestseller: false,
    rating: 4.9,
    reviews_count: 36,
    variants: [
      {
        id: "var-indigo-deep-m",
        color_name: "Aizome Deep Indigo",
        color_hex: "#1B3358",
        size: "M",
        stock: 16,
        sku: "SF-IND-DEP-M",
        image_url: "/products/tee_navy.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-indigo-deep-l",
        color_name: "Aizome Deep Indigo",
        color_hex: "#1B3358",
        size: "L",
        stock: 12,
        sku: "SF-IND-DEP-L",
        image_url: "/products/tee_navy.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      }
    ]
  },
  {
    id: "prod-highland-thermal-waffle-henley",
    title: "The Highland Thermal Waffle Henley",
    slug: "highland-thermal-waffle-henley",
    tagline: "320 GSM Heavy Waffle Knit with Horn Buttons",
    description: "Engineered for alpine comfort and country estates. Tailored from substantial 320 GSM honeycomb thermal jersey. Complete with genuine polished horn buttons, reinforced shoulder seams, and elongated ribbed cuffs that hold their shape.",
    fabric_details: "100% Carded Combed Cotton Heavy Honeycomb Waffle (320 GSM). Natural horn buttons.",
    care_instructions: "Delicate machine wash cold. Do not tumble dry. Reshape horizontally.",
    fit: "Tailored Thermal Fit",
    price: 3299,
    compare_at_price: 4199,
    category_id: "cat-henleys",
    is_featured: false,
    is_new: true,
    is_bestseller: true,
    rating: 4.94,
    reviews_count: 58,
    variants: [
      {
        id: "var-waffle-heather-m",
        color_name: "Highland Oatmeal",
        color_hex: "#D8CEC1",
        size: "M",
        stock: 14,
        sku: "SF-WAF-OAT-M",
        image_url: "/products/tee_sand.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-waffle-heather-l",
        color_name: "Highland Oatmeal",
        color_hex: "#D8CEC1",
        size: "L",
        stock: 18,
        sku: "SF-WAF-OAT-L",
        image_url: "/products/tee_sand.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-waffle-forest-m",
        color_name: "Caledonian Forest",
        color_hex: "#1F2F23",
        size: "M",
        stock: 10,
        sku: "SF-WAF-FOR-M",
        image_url: "/products/tee_olive.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      }
    ]
  },
  {
    id: "prod-savile-row-silk-vneck",
    title: "The Mayfair Silk-Cotton V-Neck",
    slug: "mayfair-silk-cotton-vneck",
    tagline: "70% Supima Cotton, 30% Mulberry Silk Blend",
    description: "An unhurried study in discreet luxury. Blending lustrous grade-6A Mulberry silk with extra-long staple Supima cotton creates a fabric with exceptional thermodynamic breathability and sublime softness against bare skin. Features a shallow, tasteful V-neckline framed by fine gauge ribbing.",
    fabric_details: "70% Supima Cotton, 30% Grade-6A Mulberry Silk (165 GSM).",
    care_instructions: "Hand wash cool with silk detergent. Dry flat in shade. Iron damp with warm iron.",
    fit: "Sartorial Slim Fit",
    price: 3699,
    compare_at_price: 4799,
    category_id: "cat-crew-neck",
    is_featured: true,
    is_new: false,
    is_bestseller: true,
    rating: 4.96,
    reviews_count: 67,
    variants: [
      {
        id: "var-silk-black-m",
        color_name: "Onyx Silk Black",
        color_hex: "#121212",
        size: "M",
        stock: 22,
        sku: "SF-SLK-BLK-M",
        image_url: "/products/tee_black.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-silk-black-l",
        color_name: "Onyx Silk Black",
        color_hex: "#121212",
        size: "L",
        stock: 19,
        sku: "SF-SLK-BLK-L",
        image_url: "/products/tee_black.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-silk-pearl-m",
        color_name: "Pearl Grey",
        color_hex: "#D0D3D4",
        size: "M",
        stock: 15,
        sku: "SF-SLK-PRL-M",
        image_url: "/products/tee_grey.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      }
    ]
  },
  {
    id: "prod-oversized-heavy-raw-slate-tee",
    title: "The Belgravia Drop-Shoulder Heavy Tee",
    slug: "belgravia-drop-shoulder-heavy-tee",
    tagline: "300 GSM Ultra-Structured Carded Cotton",
    description: "The apex of structured architectural streetwear tailoring. Woven with an ultra-dense 300 GSM count that creates sharp architectural drape and zero cling. Styled with clean seamless neck ribbing and drop shoulders.",
    fabric_details: "100% Raw Heavyweight Compact Cotton (300 GSM). Pre-shrunk silicone finish.",
    care_instructions: "Cold wash with gentle cycle. Hang dry or lay flat.",
    fit: "Boxy Oversized",
    price: 2499,
    compare_at_price: 3199,
    category_id: "cat-oversized",
    is_featured: false,
    is_new: true,
    is_bestseller: false,
    rating: 4.87,
    reviews_count: 33,
    variants: [
      {
        id: "var-bel-slate-m",
        color_name: "Slate Graphite",
        color_hex: "#383E45",
        size: "M",
        stock: 25,
        sku: "SF-BEL-SLT-M",
        image_url: "/products/tee_grey.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-bel-slate-l",
        color_name: "Slate Graphite",
        color_hex: "#383E45",
        size: "L",
        stock: 20,
        sku: "SF-BEL-SLT-L",
        image_url: "/products/tee_grey.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-bel-clay-m",
        color_name: "Baked Clay",
        color_hex: "#8B5241",
        size: "M",
        stock: 14,
        sku: "SF-BEL-CLY-M",
        image_url: "/products/tee_sand.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      }
    ]
  },
  {
    id: "prod-houndstooth-mercerized-polo",
    title: "The St. James Micro-Houndstooth Polo",
    slug: "st-james-micro-houndstooth-polo",
    tagline: "Jacquard Double-Mercerized Houndstooth Micro-Knit",
    description: "A sartorial masterpiece blending optical geometry with buttery Egyptian yarn. Knitted with an elusive micro-houndstooth jacquard pattern visible only at gentlemanly proximity. Finished with a semi-spread tailored collar and etched shell buttons.",
    fabric_details: "100% Double-Mercerized Egyptian Cotton (225 GSM). Australian Trochus shell buttons.",
    care_instructions: "Hand wash or gentle wool cycle in mesh bag. Lay flat to dry.",
    fit: "Tailored Royal Fit",
    price: 3399,
    compare_at_price: 4299,
    category_id: "cat-polos",
    is_featured: true,
    is_new: true,
    is_bestseller: true,
    rating: 4.95,
    reviews_count: 61,
    variants: [
      {
        id: "var-hnd-navy-m",
        color_name: "Regal Navy & Sky",
        color_hex: "#13213C",
        size: "M",
        stock: 17,
        sku: "SF-HND-NVY-M",
        image_url: "/products/tee_navy.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-hnd-navy-l",
        color_name: "Regal Navy & Sky",
        color_hex: "#13213C",
        size: "L",
        stock: 14,
        sku: "SF-HND-NVY-L",
        image_url: "/products/tee_navy.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      },
      {
        id: "var-hnd-burgundy-m",
        color_name: "Burgundy & Cream",
        color_hex: "#4F1E29",
        size: "M",
        stock: 12,
        sku: "SF-HND-BDX-M",
        image_url: "/products/tee_white.jpg",
        secondary_image_url: "/products/tee_white_hanger.jpg"
      }
    ]
  }
,
  {
    "id": "prod-bauhaus-monogram-tee",
    "title": "The Bauhaus Architectural Monogram Tee",
    "slug": "bauhaus-architectural-monogram-tee",
    "tagline": "240 GSM Structured Heavy Jersey with Debossed Chest Motif",
    "description": "An homage to modern structural minimalism. Sculpted from 240 GSM combed organic cotton with an architectural geometric deboss on the left chest. Engineered with drop shoulders and a firm high-gauge neckline that maintains its pristine geometric contour throughout wear.",
    "fabric_details": "100% Combed Organic Cotton (240 GSM). High-gauge compact spin for minimal pill. Micro-ribbed 1.25-inch collar.",
    "care_instructions": "Reverse wash on gentle cold cycle. Reshape while damp. Do not tumble dry. Low steam iron on reverse.",
    "fit": "Relaxed Boxy Fit",
    "price": 2199,
    "compare_at_price": 2899,
    "category_id": "cat-graphic-art",
    "is_featured": true,
    "is_new": true,
    "is_bestseller": false,
    "rating": 4.9,
    "reviews_count": 38,
    "variants": [
      {
        "id": "var-bauhaus-blk-m",
        "color_name": "Onyx Charcoal",
        "color_hex": "#1A1A1A",
        "size": "M",
        "stock": 22,
        "sku": "SF-BAU-BLK-M",
        "image_url": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=900&auto=format&fit=crop"
      },
      {
        "id": "var-bauhaus-blk-l",
        "color_name": "Onyx Charcoal",
        "color_hex": "#1A1A1A",
        "size": "L",
        "stock": 18,
        "sku": "SF-BAU-BLK-L",
        "image_url": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=900&auto=format&fit=crop"
      },
      {
        "id": "var-bauhaus-chalk-m",
        "color_name": "Antique Chalk",
        "color_hex": "#F2EFE9",
        "size": "M",
        "stock": 15,
        "sku": "SF-BAU-CHK-M",
        "image_url": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop"
      },
      {
        "id": "var-bauhaus-chalk-l",
        "color_name": "Antique Chalk",
        "color_hex": "#F2EFE9",
        "size": "L",
        "stock": 20,
        "sku": "SF-BAU-CHK-L",
        "image_url": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop"
      }
    ]
  },
  {
    "id": "prod-abstract-linear-tee",
    "title": "The Abstract Atelier Linear Graphic Tee",
    "slug": "abstract-atelier-linear-graphic-tee",
    "tagline": "Japanese High-Density Pigment Screen Print on 220 GSM Jersey",
    "description": "An expressive canvas for subtle artistic distinction. Features an archival continuous line drawing developed exclusively in our studio, applied through multi-pass water-based Japanese pigment ink that softens with age without cracking. Cut with clean tailored shoulders and side split hems.",
    "fabric_details": "100% Long-Staple Bio-Washed Cotton (220 GSM). Breathable, water-based non-toxic screen print.",
    "care_instructions": "Machine wash cold inside out. Tumble dry low or air dry in shade. Do not iron directly on print.",
    "fit": "Tailored Modern Fit",
    "price": 1999,
    "compare_at_price": 2599,
    "category_id": "cat-graphic-art",
    "is_featured": false,
    "is_new": true,
    "is_bestseller": true,
    "rating": 4.8,
    "reviews_count": 42,
    "variants": [
      {
        "id": "var-linear-ecru-m",
        "color_name": "Raw Ecru",
        "color_hex": "#EFECE6",
        "size": "M",
        "stock": 24,
        "sku": "SF-LIN-ECR-M",
        "image_url": "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=900&auto=format&fit=crop"
      },
      {
        "id": "var-linear-ecru-l",
        "color_name": "Raw Ecru",
        "color_hex": "#EFECE6",
        "size": "L",
        "stock": 19,
        "sku": "SF-LIN-ECR-L",
        "image_url": "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=900&auto=format&fit=crop"
      },
      {
        "id": "var-linear-blk-m",
        "color_name": "Noir Slate",
        "color_hex": "#22252A",
        "size": "M",
        "stock": 16,
        "sku": "SF-LIN-BLK-M",
        "image_url": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=900&auto=format&fit=crop"
      }
    ]
  },
  {
    "id": "prod-biella-pocket-tee",
    "title": "The Biella Heavyweight Boxy Pocket Tee",
    "slug": "biella-heavyweight-boxy-pocket-tee",
    "tagline": "280 GSM Structured Compact Cotton with Reinforced Chest Pocket",
    "description": "Designed in the spirit of Northern Italian utilitarian elegance. Constructed from an opulent 280 GSM heavyweight compact jersey that drapes with authoritative poise. Accompanied by an angular mitred chest pocket with double-needle edge stitching and twin needle hem finishes.",
    "fabric_details": "100% Compact Organic Cotton (280 GSM). Double-needle reinforcement at stress points. Anti-sag rib collar.",
    "care_instructions": "Cold wash with mild detergent. Reshape hem while wet. Do not bleach. Cool iron.",
    "fit": "Boxy Relaxed Cut",
    "price": 2299,
    "compare_at_price": 2999,
    "category_id": "cat-oversized",
    "is_featured": true,
    "is_new": true,
    "is_bestseller": false,
    "rating": 4.9,
    "reviews_count": 51,
    "variants": [
      {
        "id": "var-biella-sage-m",
        "color_name": "Tuscan Olive",
        "color_hex": "#434B3C",
        "size": "M",
        "stock": 18,
        "sku": "SF-BIE-OLV-M",
        "image_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=900&auto=format&fit=crop"
      },
      {
        "id": "var-biella-sage-l",
        "color_name": "Tuscan Olive",
        "color_hex": "#434B3C",
        "size": "L",
        "stock": 14,
        "sku": "SF-BIE-OLV-L",
        "image_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=900&auto=format&fit=crop"
      },
      {
        "id": "var-biella-navy-m",
        "color_name": "Maritime Indigo",
        "color_hex": "#121C30",
        "size": "M",
        "stock": 20,
        "sku": "SF-BIE-NVY-M",
        "image_url": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=900&auto=format&fit=crop"
      }
    ]
  },
  {
    "id": "prod-breton-stripe-tee",
    "title": "The Côte d'Azur Nautical Breton Stripe Tee",
    "slug": "cote-dazur-nautical-breton-stripe-tee",
    "tagline": "Yarn-Dyed 210 GSM Combed Cotton in Authentic French Maritime Ratio",
    "description": "The timeless uniform of Riviera royalty. Unlike printed stripes, each band is individually yarn-dyed before weaving on historic circular looms to ensure lifelong contrast sharpness. Finished with a boatneck crew collar and tonal anchor embroidery at the left hip.",
    "fabric_details": "100% Yarn-Dyed Combed Cotton (210 GSM). Pre-washed to prevent diagonal skewing.",
    "care_instructions": "Cold wash with similar hues. Iron inside out to protect embroidery. Line dry in shaded breeze.",
    "fit": "Classic European Fit",
    "price": 2499,
    "compare_at_price": 3299,
    "category_id": "cat-crew-neck",
    "is_featured": false,
    "is_new": true,
    "is_bestseller": true,
    "rating": 4.85,
    "reviews_count": 67,
    "variants": [
      {
        "id": "var-breton-navy-m",
        "color_name": "Navy & Chalk Stripe",
        "color_hex": "#1E2A44",
        "size": "M",
        "stock": 25,
        "sku": "SF-BRT-NVY-M",
        "image_url": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=900&auto=format&fit=crop"
      },
      {
        "id": "var-breton-navy-l",
        "color_name": "Navy & Chalk Stripe",
        "color_hex": "#1E2A44",
        "size": "L",
        "stock": 19,
        "sku": "SF-BRT-NVY-L",
        "image_url": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=900&auto=format&fit=crop"
      }
    ]
  },
  {
    "id": "prod-milano-mockneck-tee",
    "title": "The Milano Ribbed Architectural Mock-Neck T-Shirt",
    "slug": "milano-ribbed-architectural-mockneck-tee",
    "tagline": "Double-Knit Interlock Cotton with 1.75-Inch Sculpted Mock Collar",
    "description": "A commanding hybrid bridging high knitwear and tailored luxury tees. The 1.75-inch mock neck stands autonomously without choking, knitted with 4% elastane memory ribbing. Ideal when layered under bespoke unconstructed blazers or worn solo as a minimalist statement.",
    "fabric_details": "96% Mercerized Long-Staple Cotton, 4% Lycra (250 GSM). Double-knit interlock weave.",
    "care_instructions": "Machine wash cold delicate. Do not wring. Dry flat on luxury hanger.",
    "fit": "Sculpted Tailored Fit",
    "price": 2599,
    "compare_at_price": 3499,
    "category_id": "cat-crew-neck",
    "is_featured": true,
    "is_new": true,
    "is_bestseller": false,
    "rating": 4.95,
    "reviews_count": 29,
    "variants": [
      {
        "id": "var-mock-blk-m",
        "color_name": "Jet Midnight",
        "color_hex": "#111215",
        "size": "M",
        "stock": 17,
        "sku": "SF-MCK-BLK-M",
        "image_url": "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=900&auto=format&fit=crop"
      },
      {
        "id": "var-mock-blk-l",
        "color_name": "Jet Midnight",
        "color_hex": "#111215",
        "size": "L",
        "stock": 12,
        "sku": "SF-MCK-BLK-L",
        "image_url": "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=900&auto=format&fit=crop"
      },
      {
        "id": "var-mock-cream-m",
        "color_name": "Ivory Cream",
        "color_hex": "#F5F3ED",
        "size": "M",
        "stock": 15,
        "sku": "SF-MCK-CRM-M",
        "image_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=900&auto=format&fit=crop"
      }
    ]
  },
  {
    "id": "prod-versailles-botanical-tee",
    "title": "The Versailles Botanical Archival Graphic Tee",
    "slug": "versailles-botanical-archival-graphic-tee",
    "tagline": "Historic Engraving Artwork on Mineral Washed 210 GSM Cotton",
    "description": "Inspired by 18th-century French royal garden archives. Intricately etched botanical illustrations rendered in sepia tones onto vintage enzyme-treated cotton. Features hand-finished blind stitch hems and distressed inner collar label detailing.",
    "fabric_details": "100% Mineral Enzyme Washed Cotton (210 GSM). Breathable discharge print for zero hand-feel.",
    "care_instructions": "Wash cold inside out. Flat dry away from direct sunlight. Warm iron on reverse.",
    "fit": "Vintage Relaxed Fit",
    "price": 2199,
    "compare_at_price": 2799,
    "category_id": "cat-graphic-art",
    "is_featured": false,
    "is_new": true,
    "is_bestseller": false,
    "rating": 4.88,
    "reviews_count": 34,
    "variants": [
      {
        "id": "var-bot-sand-m",
        "color_name": "Dune Sand",
        "color_hex": "#D6CEBF",
        "size": "M",
        "stock": 21,
        "sku": "SF-BOT-SND-M",
        "image_url": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=900&auto=format&fit=crop"
      },
      {
        "id": "var-bot-sand-l",
        "color_name": "Dune Sand",
        "color_hex": "#D6CEBF",
        "size": "L",
        "stock": 16,
        "sku": "SF-BOT-SND-L",
        "image_url": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=900&auto=format&fit=crop"
      }
    ]
  },
  {
    "id": "prod-zurich-seamless-tee",
    "title": "The Zurich Zero-Torque Seamless T-Shirt",
    "slug": "zurich-zero-torque-seamless-tee",
    "tagline": "Circular Knit Tubular Cotton with Bonded Ultrasonic Hems",
    "description": "Swiss engineering applied to the classic tee. Circular-knitted with zero side seams to eliminate twisting and friction against the skin. Hems are precision bonded using heat-fused ultrasonic tape for an ultra-flat, razor-sharp edge that lies invisibly under garments.",
    "fabric_details": "100% Long-Staple Compact Ring-Spun Cotton (195 GSM). Seamless tubular construction.",
    "care_instructions": "Gentle machine wash cold. Do not dry clean. Low tumble dry or air dry.",
    "fit": "Slim Architectural Fit",
    "price": 2399,
    "compare_at_price": 3199,
    "category_id": "cat-crew-neck",
    "is_featured": false,
    "is_new": true,
    "is_bestseller": false,
    "rating": 4.92,
    "reviews_count": 47,
    "variants": [
      {
        "id": "var-zur-white-m",
        "color_name": "Optic White",
        "color_hex": "#FFFFFF",
        "size": "M",
        "stock": 28,
        "sku": "SF-ZUR-WHT-M",
        "image_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=900&auto=format&fit=crop"
      },
      {
        "id": "var-zur-white-l",
        "color_name": "Optic White",
        "color_hex": "#FFFFFF",
        "size": "L",
        "stock": 25,
        "sku": "SF-ZUR-WHT-L",
        "image_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=900&auto=format&fit=crop"
      },
      {
        "id": "var-zur-grey-m",
        "color_name": "Flint Grey",
        "color_hex": "#6B7280",
        "size": "M",
        "stock": 19,
        "sku": "SF-ZUR-GRY-M",
        "image_url": "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=900&auto=format&fit=crop"
      }
    ]
  },
  {
    "id": "prod-verona-washed-oversized-tee",
    "title": "The Verona Washed Vintage Oversized Tee",
    "slug": "verona-washed-vintage-oversized-tee",
    "tagline": "300 GSM Heavyweight Stone-Washed Jersey with Distressed Edges",
    "description": "A masterclass in effortless drape. Stone-washed for 4 hours with pumice mineral stones to achieve nuanced color fade around seams and necklines. Cut with exaggerated broad shoulders, wide sleeves, and a substantial 300 GSM hand that holds its street-tailored drape.",
    "fabric_details": "100% Heavy Organic French Jersey (300 GSM). Pumice stone enzyme wash. Pre-shrunk.",
    "care_instructions": "Wash separately in cold water on first wear. Tumble dry delicate. Do not iron collar.",
    "fit": "Exaggerated Oversized Fit",
    "price": 2499,
    "compare_at_price": 3399,
    "category_id": "cat-oversized",
    "is_featured": true,
    "is_new": true,
    "is_bestseller": true,
    "rating": 4.96,
    "reviews_count": 73,
    "variants": [
      {
        "id": "var-verona-char-m",
        "color_name": "Acid Washed Charcoal",
        "color_hex": "#2B2D31",
        "size": "M",
        "stock": 26,
        "sku": "SF-VRN-CHR-M",
        "image_url": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=900&auto=format&fit=crop"
      },
      {
        "id": "var-verona-char-l",
        "color_name": "Acid Washed Charcoal",
        "color_hex": "#2B2D31",
        "size": "L",
        "stock": 20,
        "sku": "SF-VRN-CHR-L",
        "image_url": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=900&auto=format&fit=crop"
      },
      {
        "id": "var-verona-char-xl",
        "color_name": "Acid Washed Charcoal",
        "color_hex": "#2B2D31",
        "size": "XL",
        "stock": 14,
        "sku": "SF-VRN-CHR-XL",
        "image_url": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=900&auto=format&fit=crop"
      }
    ]
  },
  {
    "id": "prod-custom-bespoke-embroidered-tee",
    "title": "The Custom Bespoke Atelier Embroidered Tee",
    "slug": "custom-bespoke-atelier-embroidered-tee",
    "tagline": "Personal Monogram or Custom Crest Embroidery on American Supima® (Call: 8310274918)",
    "description": "Your personal insignia, monogram, or bespoke artwork hand-embroidered by our master needleworkers. Crafted on our flagship 100% American Supima® blank canvas. Minimum order: 1 piece for personal luxury, or small atelier batches. Contact our Concierge directly on +91 8310274918 or WhatsApp to confirm your personalized design, thread shades, and placement.",
    "fabric_details": "100% American Extra-Long Staple Supima Cotton (190 GSM). High-precision Madeira metallic or tonal thread embroidery.",
    "care_instructions": "Delicate cold wash. Use wash pouch. Iron on reverse of embroidery.",
    "fit": "Tailored Bespoke Fit",
    "price": 2699,
    "compare_at_price": 3699,
    "category_id": "cat-custom-bespoke",
    "is_featured": true,
    "is_new": true,
    "is_bestseller": true,
    "rating": 5,
    "reviews_count": 88,
    "variants": [
      {
        "id": "var-cst-navy-m",
        "color_name": "Bespoke Navy",
        "color_hex": "#0F1A30",
        "size": "M",
        "stock": 50,
        "sku": "SF-CST-NVY-M",
        "image_url": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop"
      },
      {
        "id": "var-cst-navy-l",
        "color_name": "Bespoke Navy",
        "color_hex": "#0F1A30",
        "size": "L",
        "stock": 50,
        "sku": "SF-CST-NVY-L",
        "image_url": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop"
      },
      {
        "id": "var-cst-blk-m",
        "color_name": "Bespoke Noir",
        "color_hex": "#151515",
        "size": "M",
        "stock": 50,
        "sku": "SF-CST-BLK-M",
        "image_url": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=900&auto=format&fit=crop"
      },
      {
        "id": "var-cst-wht-m",
        "color_name": "Bespoke Chalk",
        "color_hex": "#FAFAFA",
        "size": "M",
        "stock": 50,
        "sku": "SF-CST-WHT-M",
        "image_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=900&auto=format&fit=crop"
      }
    ]
  },
  {
    "id": "prod-custom-corporate-heavy-tee",
    "title": "The Custom Corporate & Event Heavyweight Boxy Tee",
    "slug": "custom-corporate-event-heavyweight-boxy-tee",
    "tagline": "Made-to-Order Bulk Studio Orders (10 to 500+ Pcs • Direct WhatsApp: 8310274918)",
    "description": "The executive benchmark for company merchandise, luxury retreat uniforms, startup merch, and bespoke private events. Constructed in 240 GSM or 280 GSM heavyweight organic cotton with customizable screen printing, high-density puff printing, or embroidery. Volume tier pricing applied. Contact our Dedicated Corporate Concierge directly at +91 8310274918 or WhatsApp for sample swatches and rapid quotations.",
    "fabric_details": "100% Heavy Combed Cotton (240-280 GSM). Bio-polished and silicone washed for ultra-soft hand feel.",
    "care_instructions": "Commercial or standard laundry safe. High wash durability tested up to 60 washes.",
    "fit": "Modern Structured Boxy Fit",
    "price": 1699,
    "compare_at_price": 2499,
    "category_id": "cat-custom-bespoke",
    "is_featured": true,
    "is_new": true,
    "is_bestseller": true,
    "rating": 4.98,
    "reviews_count": 114,
    "variants": [
      {
        "id": "var-corp-blk-m",
        "color_name": "Signature Black",
        "color_hex": "#101010",
        "size": "M",
        "stock": 100,
        "sku": "SF-CRP-BLK-M",
        "image_url": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=900&auto=format&fit=crop"
      },
      {
        "id": "var-corp-blk-l",
        "color_name": "Signature Black",
        "color_hex": "#101010",
        "size": "L",
        "stock": 100,
        "sku": "SF-CRP-BLK-L",
        "image_url": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=900&auto=format&fit=crop"
      },
      {
        "id": "var-corp-wht-m",
        "color_name": "Signature White",
        "color_hex": "#FFFFFF",
        "size": "M",
        "stock": 100,
        "sku": "SF-CRP-WHT-M",
        "image_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=900&auto=format&fit=crop"
      },
      {
        "id": "var-corp-wht-l",
        "color_name": "Signature White",
        "color_hex": "#FFFFFF",
        "size": "L",
        "stock": 100,
        "sku": "SF-CRP-WHT-L",
        "image_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop",
        "secondary_image_url": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=900&auto=format&fit=crop"
      }
    ]
  }];

export const SEED_COUPONS = [
  {
    id: "coup-ship10",
    code: "SHIP10",
    discount_type: "percent",
    discount_percent: 10,
    discount_amount: 0,
    min_order_value: 999,
    usage_limit: 500,
    per_user_limit: 1,
    times_used: 14,
    expires_at: "2026-12-31T23:59:59Z",
    active: true,
    description: "10% privilege discount on orders above ₹999 (Max 1 use per patron)"
  },
  {
    id: "coup-luxe500",
    code: "LUXE500",
    discount_type: "fixed",
    discount_percent: 0,
    discount_amount: 500,
    min_order_value: 2499,
    usage_limit: 100,
    per_user_limit: 1,
    times_used: 8,
    expires_at: "2026-12-31T23:59:59Z",
    active: true,
    description: "Flat ₹500 discount on cart values exceeding ₹2,499"
  },
  {
    id: "coup-viproyal",
    code: "VIPROYAL",
    discount_type: "fixed",
    discount_percent: 0,
    discount_amount: 1000,
    min_order_value: 3999,
    usage_limit: 50,
    per_user_limit: 1,
    times_used: 3,
    expires_at: "2026-12-31T23:59:59Z",
    active: true,
    description: "Exclusive ₹1,000 privilege savings on luxury orders above ₹3,999"
  }
];

export const SEED_ADMIN_USER = {
  id: "usr-admin-director",
  name: "Master Tailor & Director",
  email: "admin@shipfold.com",
  role: "admin",
  status: "active",
  phone: "+91 800 900 7447",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
};

export const SEED_DEMO_USER = {
  id: "usr-demo-patron",
  name: "Alexander Wright",
  email: "alexander@shipfold.com",
  role: "customer",
  status: "active",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
};

export const SEED_DEMO_ADDRESS = {
  id: "addr-demo-default",
  user_id: "usr-demo-patron",
  full_name: "Alexander Wright",
  phone: "+91 98765 43210",
  street: "Penthouse 14B, The Regency Residences, Lavelle Road",
  apartment: "Floor 14",
  city: "Bengaluru",
  state: "Karnataka",
  postal_code: "560001",
  country: "India",
  is_default: true
};
