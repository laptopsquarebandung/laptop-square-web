"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { supabase } from "../lib/supabase";
import { Product, UsageCategory } from "../lib/types";
import { parseSpecs } from "../lib/specsParser";
import HeroWebGLCanvas from "../components/HeroWebGLCanvas";
import WireframeChassisCanvas from "../components/WireframeChassisCanvas";
import {
  Search,
  X,
  MapPin,
  ShieldCheck,
  Cpu,
  HardDrive,
  Layers,
  Monitor,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Laptop,
  MessageCircle,
  RotateCcw,
  ArrowUpDown,
  Check,
  Plus,
  Minus,
  ShoppingBag,
  ExternalLink,
  Clock,
  Sun,
  Moon,
} from "lucide-react";

const MAPS_URL =
  "https://www.google.com/maps/place/Laptop+Square+BEC/@-6.9078216,107.6087898,17z/data=!3m1!4b1!4m6!3m5!1s0x2e68e638090867fd:0x5b1dfccd504a25c5!8m2!3d-6.9078216!4d107.6087898!16s%2Fg%2F1pzwhkpd7?entry=ttu";
const WA_PHONE = "6282110898948";

interface CartItem {
  product: Product;
  quantity: number;
}

const FINISH_SWATCHES = [
  {
    id: "silver",
    name: "Titanium Silver",
    hex: "#B4BAC4",
    filter: "none",
  },
  {
    id: "obsidian",
    name: "Obsidian Black",
    hex: "#1D2026",
    filter: "saturate(0.8) brightness(0.76) contrast(1.16)",
  },
  {
    id: "cobalt",
    name: "Space Cobalt",
    hex: "#2563EB",
    filter: "hue-rotate(15deg) saturate(1.22) contrast(1.06)",
  },
];

const HERO_GALLERY = [
  {
    title: "Lenovo Yoga Slim 7 OLED",
    tag: "Ultrabook Flagship",
    image:
      "https://mugcnbapivtaplnjzuvq.supabase.co/storage/v1/object/public/products/lenovo-yoga-slim-7-83qm002gid-luna-grey.jpg",
  },
  {
    title: "Apple MacBook M-Series",
    tag: "Creator Reference",
    image:
      "https://mugcnbapivtaplnjzuvq.supabase.co/storage/v1/object/public/products/apple-macbook-neo-mhfa4id-a-silver.jpg",
  },
  {
    title: "ASUS Business & Pro Series",
    tag: "Enterprise Grade",
    image:
      "https://mugcnbapivtaplnjzuvq.supabase.co/storage/v1/object/public/products/asus-pm3406chap-ly7152ws.jpg",
  },
  {
    title: "Colorful EVOL P15 RTX",
    tag: "Gaming Workstation",
    image:
      "https://mugcnbapivtaplnjzuvq.supabase.co/storage/v1/object/public/products/colorful-evol-p15-hk55f-white.png",
  },
];

const SHOWCASE_STAGES = [
  {
    title: "Workstation Meja Studio",
    subtitle:
      "Sasis aluminium presisi dengan pendinginan senyap untuk kompilasi, desain, dan render harian.",
    badge: "01 · STUDIO",
    image:
      "https://mugcnbapivtaplnjzuvq.supabase.co/storage/v1/object/public/products/lenovo-yoga-slim-7-83qm002gid-luna-grey.jpg",
  },
  {
    title: "Layar Akurasi Kreator",
    subtitle:
      "Panel OLED terkalibrasi pabrik 100% DCI-P3 untuk warna tajam, desain arsitektur, dan sinema.",
    badge: "02 · OLED DISPLAY",
    image:
      "https://mugcnbapivtaplnjzuvq.supabase.co/storage/v1/object/public/products/hp-omnibook-3-14-hu0044tu-glacier-silver.jpg",
  },
  {
    title: "Mobilitas Sepanjang Hari",
    subtitle:
      "Bobot ringkas dengan efisiensi daya tinggi untuk produktivitas di kampus, kafe, maupun perjalanan.",
    badge: "03 · MOBILITAS",
    image:
      "https://mugcnbapivtaplnjzuvq.supabase.co/storage/v1/object/public/products/apple-macbook-neo-mhfa4id-a-silver.jpg",
  },
  {
    title: "Performa RTX & Konektivitas",
    subtitle:
      "Kartu grafis diskrit bertenaga, port Thunderbolt berkecepatan tinggi, dan garansi resmi Indonesia.",
    badge: "04 · PERFORMA",
    image:
      "https://mugcnbapivtaplnjzuvq.supabase.co/storage/v1/object/public/products/colorful-evol-p15-hk55f-white.png",
  },
];

export default function Home() {
  // Theme state
  const [isDark, setIsDark] = useState(false);

  // Catalog state
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  // Hero stage state
  const [activeFinish, setActiveFinish] = useState(0);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  // Showcase & Thermal Comparison state
  const [activeStage, setActiveStage] = useState(0);
  const [isStageTransitioning, setIsStageTransitioning] = useState(false);
  const [splitPct, setSplitPct] = useState(52);
  const comparisonRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);

  // Cart / Bag Drawer state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState<{
    id: string;
    name: string;
    total: number;
    count: number;
  } | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("ALL");
  const [usageCategory, setUsageCategory] = useState<UsageCategory>("ALL");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(50000000);
  const [highestCatalogPrice, setHighestCatalogPrice] = useState<number>(50000000);
  const [sortBy, setSortBy] = useState<"recommend" | "price-asc" | "price-desc" | "name-asc">(
    "recommend"
  );
  const [showCount, setShowCount] = useState<number>(24);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const brands = [
    "ALL",
    "Lenovo",
    "HP",
    "Acer",
    "ASUS",
    "MSI",
    "Apple",
    "Axioo",
    "Advan",
    "Zyrex",
    "Colorful",
  ];

  // Sync theme attribute on <html>
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [isDark]);

  // Fetch products from Supabase
  useEffect(() => {
    async function getProducts() {
      try {
        const { data, error } = await supabase.from("products").select("*");
        if (error) {
          console.error("Gagal mengambil data:", error);
        } else if (data && data.length > 0) {
          setAllProducts(data);
          const maxVal = Math.max(...data.map((p: any) => Number(p.price) || 0));
          const effectiveMax = maxVal > 0 ? maxVal : 50000000;
          setHighestCatalogPrice(effectiveMax);
          setMaxPrice(effectiveMax);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    getProducts();
  }, []);

  // Auto rotate hero laptop gallery gently
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % HERO_GALLERY.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    if (allProducts.length === 0) return [];
    let list = [...allProducts];

    if (selectedBrand !== "ALL") {
      list = list.filter((p) => p.brand?.toLowerCase() === selectedBrand.toLowerCase());
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.specs?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      );
    }

    list = list.filter((p) => {
      const price = Number(p.price) || 0;
      return price >= minPrice && price <= maxPrice;
    });

    if (usageCategory !== "ALL") {
      list = list.filter((p) => {
        const parsed = parseSpecs(p.specs, p.name, Number(p.price) || 0);
        if (usageCategory === "GAMING") return parsed.category === "GAMING";
        if (usageCategory === "OLED")
          return parsed.category === "OLED" || String(p.specs).toLowerCase().includes("oled");
        if (usageCategory === "STUDENT")
          return parsed.category === "STUDENT" || (Number(p.price) > 0 && Number(p.price) <= 8500000);
        if (usageCategory === "BUSINESS")
          return parsed.category === "BUSINESS" || p.brand?.toUpperCase() === "APPLE";
        return true;
      });
    }

    if (sortBy === "price-asc") {
      list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === "name-asc") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return list;
  }, [allProducts, selectedBrand, searchQuery, minPrice, maxPrice, usageCategory, sortBy]);

  useEffect(() => {
    setShowCount(24);
  }, [searchQuery, selectedBrand, usageCategory, minPrice, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedBrand("ALL");
    setUsageCategory("ALL");
    setMinPrice(0);
    setMaxPrice(highestCatalogPrice);
    setSortBy("recommend");
  };

  const isFilterActive =
    searchQuery.trim() !== "" ||
    selectedBrand !== "ALL" ||
    usageCategory !== "ALL" ||
    minPrice > 0 ||
    maxPrice < highestCatalogPrice ||
    sortBy !== "recommend";

  const visibleProducts = filteredProducts.slice(0, showCount);

  const getProductImage = (product: Product) => {
    if (product.image_url && !product.image_url.includes("placeholder")) {
      return product.image_url;
    }
    if (product.slug) {
      return `https://mugcnbapivtaplnjzuvq.supabase.co/storage/v1/object/public/products/${product.slug}.jpg`;
    }
    return null;
  };

  const getWhatsAppLink = (product: Product) => {
    const name = product.name || "";
    const price = `Rp ${Number(product.price).toLocaleString("id-ID")}`;
    const specs = typeof product.specs === "string" ? product.specs : String(product.specs || "-");
    const message = `Halo LaptopSquare Istana BEC,\n\nSaya tertarik dengan unit:\n*${name}*\nHarga: *${price}*\n\nSpesifikasi:\n${specs}\n\nApakah unit ready di toko BEC Lantai 1 Blok H16?`;
    return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;
  };

  // Cart helpers
  const totalBagCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalBagPrice = cart.reduce(
    (sum, item) => sum + (Number(item.product.price) || 0) * item.quantity,
    0
  );

  const addToCart = (product: Product) => {
    setConfirmedOrder(null);
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsBagOpen(true);
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.product.id === productId ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const orderNum = `#LS-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsSummary = cart
      .map(
        (i) =>
          `- ${i.product.name} (${i.quantity}x) : Rp ${(
            (Number(i.product.price) || 0) * i.quantity
          ).toLocaleString("id-ID")}`
      )
      .join("\n");

    const waMsg = `Halo LaptopSquare BEC! Saya ingin konfirmasi pesanan *${orderNum}*:\n\n${itemsSummary}\n\nTotal: *Rp ${totalBagPrice.toLocaleString(
      "id-ID"
    )}*\n\nData Pemesan:\nNama: ${customerName || "-"}\nWhatsApp: ${
      customerPhone || "-"
    }\nAlamat / Pengambilan: ${customerAddress || "Ambil di Istana BEC Lt. 1 Blok H16"}`;

    setConfirmedOrder({
      id: orderNum,
      name: customerName || "Pelanggan",
      total: totalBagPrice,
      count: totalBagCount,
    });

    window.open(`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(waMsg)}`, "_blank");
  };

  // Hero 3D tilt handler
  const handleHeroTilt = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: -ny * 10,
      ry: nx * 12,
    });
  };

  // Thermal comparison drag handler
  const updateSplitFromClientX = (clientX: number) => {
    const el = comparisonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSplitPct(Math.max(0, Math.min(100, pct)));
  };

  const handleStageSelect = (idx: number) => {
    if (idx === activeStage) return;
    setIsStageTransitioning(true);
    setTimeout(() => {
      setActiveStage(idx);
      setIsStageTransitioning(false);
    }, 160);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const googleReviews = [
    {
      name: "Aulia Azizah",
      time: "1 minggu lalu",
      text: "Pelayanan sangat bagus, ramah, dan cepat. Dapet rekomendasi laptop sesuai kebutuhan budget!",
    },
    {
      name: "Aninda Yuris",
      time: "2 minggu lalu",
      text: "Pembelian laptop di Laptop Square dibantu banget, ramah dan sangat membantu. Sukses terus!",
    },
    {
      name: "Hannzzz Gans",
      time: "1 bulan lalu",
      text: "Pusat laptop terlengkap di BEC Lantai 1. Pelayanan mantap, harga bersaing dan garansi resmi.",
    },
    {
      name: "Rizky Ramadhan",
      time: "1 bulan lalu",
      text: "Pelayanan toko offline di BEC ramah banget, dijelasin spek detail sampai tuntas dan dibantu install aplikasi lengkap gratis.",
    },
  ];

  const faqs = [
    {
      q: "Apakah seluruh unit laptop di LaptopSquare bergaransi resmi?",
      a: "Ya, 100% unit kami adalah produk baru tersegel dan bergaransi resmi brand Indonesia (ASUS, Lenovo, HP, Acer, MSI, Apple, Axioo, Advan). Klaim berlaku di seluruh Service Center Resmi Indonesia.",
    },
    {
      q: "Bagaimana cara mengajukan cicilan 0%?",
      a: "Kami mendukung cicilan 0% Kartu Kredit bank rekanan maupun cicilan non-kartu kredit (Kredivo, Akulaku, Home Credit, SPayLater) langsung di toko Istana BEC Lt. 1 Blok H16.",
    },
    {
      q: "Apakah sudah termasuk bonus tas dan instalasi software?",
      a: "Setiap pembelian unit mendapatkan gratis tas laptop baru serta gratis instalasi sistem operasi original, Microsoft Office, dan software esensial siap pakai.",
    },
    {
      q: "Apakah bisa kirim ke luar kota Bandung?",
      a: "Bisa. Pengiriman ke seluruh Indonesia menggunakan packing kayu tebal dan asuransi penuh 100% nilai barang.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-[var(--accent)] selection:text-white">
      {/* Subtle architectural dot grain overlay */}
      <div className="bg-grain-overlay" />

      {/* 1. FIXED ARCHITECTURAL HEADER (64px) */}
      <header
        className="fixed top-0 left-0 right-0 z-40 h-16 transition-colors"
        style={{
          backgroundColor: "var(--glass-bg)",
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 text-left cursor-pointer"
          >
            <span className="text-[19px] font-bold tracking-[-0.025em]">
              LaptopSquare
            </span>
            <span
              className="font-mono-tabular text-[10px] font-medium px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              BEC·H16
            </span>
          </button>

          {/* Zone 2: Nav Links */}
          <nav
            className="hidden md:flex items-center gap-7 text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            <button
              onClick={() => scrollToSection("showcase")}
              className="nav-link-line hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              Showcase
            </button>
            <button
              onClick={() => scrollToSection("thermal")}
              className="nav-link-line hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              Performa
            </button>
            <button
              onClick={() => scrollToSection("craft")}
              className="nav-link-line hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              Spesifikasi
            </button>
            <button
              onClick={() => scrollToSection("katalog")}
              className="nav-link-line hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              Katalog
            </button>
            <button
              onClick={() => scrollToSection("lokasi")}
              className="nav-link-line hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              Lokasi BEC
            </button>
          </nav>

          {/* Zone 3: Action CTA */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg transition-colors cursor-pointer"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
              aria-label="Toggle theme"
              title={isDark ? "Mode Terang" : "Mode Gelap"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsBagOpen(true)}
              className="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2 transition-all cursor-pointer hover:border-[var(--border-strong)]"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            >
              <span>Tas Belanja</span>
              <span
                className="font-mono-tabular font-bold"
                style={{ color: "var(--accent)" }}
              >
                ({totalBagCount})
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION WITH WEBGL2 TOPOGRAPHIC SHADER & 3D TILT STAGE */}
      <section
        id="hero"
        className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <HeroWebGLCanvas isDark={isDark} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Hero Left Copy */}
            <div className="lg:col-span-6 flex flex-col gap-5">
              <div
                className="font-mono-tabular text-[13px] font-medium tracking-tight"
                style={{ color: "var(--accent)" }}
              >
                laptopsquare.online · Istana BEC Lt. 1 Blok H16
              </div>

              <h1 className="text-4xl sm:text-6xl font-bold tracking-[-0.035em] leading-[1.04]">
                Presisi untuk setiap karya.
              </h1>

              <p
                className="text-base sm:text-lg leading-relaxed max-w-xl"
                style={{ color: "var(--text-secondary)" }}
              >
                Kurasi laptop flagship, workstation kreatif, gaming RTX, dan ultrabook
                generasi terbaru—dikalibrasi untuk kecepatan tinggi dengan garansi resmi
                Indonesia &amp; pengiriman berasuransi.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => scrollToSection("katalog")}
                  className="px-5 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer active:scale-[0.98]"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "var(--accent-text)",
                  }}
                >
                  Jelajahi Katalog ({allProducts.length || 374})
                </button>

                <button
                  onClick={() => scrollToSection("showcase")}
                  className="px-5 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer"
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid var(--border-strong)",
                    color: "var(--text-primary)",
                  }}
                >
                  Lihat Showcase
                </button>
              </div>

              {/* Proof Strip */}
              <div
                className="pt-5 mt-2 border-t flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-secondary)",
                }}
              >
                <span>Garansi Resmi 2 Tahun</span>
                <span>·</span>
                <span>Toko Fisik BEC Bandung</span>
                <span>·</span>
                <span>Cicilan 0%</span>
                <span>·</span>
                <span>4.9★ Google Reviews</span>
              </div>
            </div>

            {/* Hero Right 3D Tilt Stage & Finish Swatches */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div
                onPointerMove={handleHeroTilt}
                onPointerLeave={() => setTilt({ rx: 0, ry: 0 })}
                className="relative aspect-[4/3] w-full flex items-center justify-center rounded-xl overflow-hidden transition-shadow"
                style={{
                  perspective: "1200px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-tinted)",
                }}
              >
                {/* 3D Tilted Image */}
                <div
                  className="w-full h-full flex items-center justify-center p-6 sm:p-10 transition-transform duration-200 ease-out"
                  style={{
                    transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                  }}
                >
                  <img
                    src={HERO_GALLERY[activeHeroSlide].image}
                    alt={HERO_GALLERY[activeHeroSlide].title}
                    className="max-h-full max-w-full object-contain transition-all duration-500 drop-shadow-2xl"
                    style={{
                      filter: FINISH_SWATCHES[activeFinish].filter,
                    }}
                  />
                </div>

                {/* Dynamic Floor Shadow */}
                <div
                  className="absolute bottom-5 w-3/5 h-5 rounded-full blur-xl pointer-events-none transition-transform duration-200"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(0,0,0,0.38) 0%, transparent 72%)",
                    transform: `translateX(${-tilt.ry * 1.4}px) scale(${
                      1 - Math.abs(tilt.rx) * 0.01
                    })`,
                  }}
                />

                {/* Top-left series tag */}
                <div
                  className="absolute top-4 left-4 px-2.5 py-1 rounded-md text-[11px] font-mono-tabular font-medium"
                  style={{
                    backgroundColor: "var(--glass-bg)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {HERO_GALLERY[activeHeroSlide].tag} — {HERO_GALLERY[activeHeroSlide].title}
                </div>

                {/* Slide arrows */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      setActiveHeroSlide(
                        (prev) => (prev - 1 + HERO_GALLERY.length) % HERO_GALLERY.length
                      )
                    }
                    className="p-1.5 rounded-lg transition-colors cursor-pointer"
                    style={{
                      backgroundColor: "var(--glass-bg)",
                      border: "1px solid var(--border)",
                    }}
                    aria-label="Laptop sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setActiveHeroSlide((prev) => (prev + 1) % HERO_GALLERY.length)
                    }
                    className="p-1.5 rounded-lg transition-colors cursor-pointer"
                    style={{
                      backgroundColor: "var(--glass-bg)",
                      border: "1px solid var(--border)",
                    }}
                    aria-label="Laptop berikutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stage Toolbar: Swatches + Theme Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div
                  role="radiogroup"
                  aria-label="Pilih warna sasis"
                  className="inline-flex items-center gap-1 p-1 rounded-lg"
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {FINISH_SWATCHES.map((sw, idx) => {
                    const selected = activeFinish === idx;
                    return (
                      <button
                        key={sw.id}
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setActiveFinish(idx)}
                        className="px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
                        style={{
                          backgroundColor: selected ? "var(--bg)" : "transparent",
                          color: selected ? "var(--text-primary)" : "var(--text-secondary)",
                          boxShadow: selected ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                        }}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: sw.hex,
                            border: "1px solid rgba(128,128,128,0.4)",
                          }}
                        />
                        <span>{sw.name}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setIsDark(!isDark)}
                  className="px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                >
                  {isDark ? "Mode Terang" : "Mode Gelap"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MULTI-ANGLE SHOWCASE SECTION (#showcase) */}
      <section
        id="showcase"
        className="py-16 sm:py-24 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span
                className="font-mono-tabular text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--accent)" }}
              >
                01 · Arsitektur &amp; Desain
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] mt-1">
                Dibangun untuk performa tanpa kompromi.
              </h2>
            </div>
            <p
              className="text-sm max-w-md"
              style={{ color: "var(--text-secondary)" }}
            >
              Pilih sudut pandang di bawah untuk mengeksplorasi detail sasis, layar OLED,
              mobilitas, dan konektivitas unit pilihan LaptopSquare.
            </p>
          </div>

          {/* Cinematic Viewport Card */}
          <div
            className="relative rounded-xl overflow-hidden min-h-[420px] sm:min-h-[500px] flex flex-col justify-between p-6 sm:p-10"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-tinted)",
            }}
          >
            <div className="flex items-center justify-between relative z-10">
              <span
                className="font-mono-tabular text-xs font-medium px-2.5 py-1 rounded-md"
                style={{
                  backgroundColor: "var(--bg)",
                  border: "1px solid var(--border)",
                }}
              >
                {SHOWCASE_STAGES[activeStage].badge}
              </span>

              <button
                onClick={() => scrollToSection("katalog")}
                className="text-xs font-medium flex items-center gap-1 hover:underline cursor-pointer"
                style={{ color: "var(--accent)" }}
              >
                <span>Lihat Unit Ready di BEC</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Center Visual */}
            <div
              className={`my-auto py-8 flex items-center justify-center transition-all duration-300 ${
                isStageTransitioning ? "opacity-30 blur-sm scale-[0.98]" : "opacity-100 blur-0 scale-100"
              }`}
            >
              <img
                src={SHOWCASE_STAGES[activeStage].image}
                alt={SHOWCASE_STAGES[activeStage].title}
                className="max-h-64 sm:max-h-80 object-contain drop-shadow-2xl"
              />
            </div>

            {/* Bottom HUD Overlay: Caption + Dock */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
              <div
                className={`max-w-lg transition-all duration-300 ${
                  isStageTransitioning ? "opacity-40 blur-[2px]" : "opacity-100"
                }`}
              >
                <h3 className="text-2xl sm:text-3xl font-bold tracking-[-0.025em]">
                  {SHOWCASE_STAGES[activeStage].title}
                </h3>
                <p
                  className="text-sm mt-1.5 leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {SHOWCASE_STAGES[activeStage].subtitle}
                </p>
              </div>

              {/* Glass Dock Stage Switcher */}
              <div
                className="inline-flex items-center gap-2 p-2 rounded-xl self-start md:self-auto"
                style={{
                  backgroundColor: "rgba(11, 13, 17, 0.78)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {SHOWCASE_STAGES.map((stage, idx) => {
                  const isActive = idx === activeStage;
                  return (
                    <button
                      key={stage.badge}
                      onClick={() => handleStageSelect(idx)}
                      aria-label={stage.title}
                      className="h-2 rounded-full transition-all duration-300 cursor-pointer"
                      style={{
                        width: isActive ? "44px" : "24px",
                        backgroundColor: isActive ? "#3b82f6" : "rgba(241, 243, 246, 0.35)",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THERMAL & ACOUSTICS COMPARISON SLIDER (#thermal) */}
      <section
        id="thermal"
        className="py-16 sm:py-24 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Interactive Comparison Slider */}
            <div className="lg:col-span-6">
              <div
                ref={comparisonRef}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") setSplitPct((p) => Math.max(0, p - 5));
                  if (e.key === "ArrowRight") setSplitPct((p) => Math.min(100, p + 5));
                }}
                onPointerDown={(e) => {
                  isDraggingRef.current = true;
                  e.currentTarget.setPointerCapture(e.pointerId);
                  updateSplitFromClientX(e.clientX);
                }}
                onPointerMove={(e) => {
                  if (isDraggingRef.current) updateSplitFromClientX(e.clientX);
                }}
                onPointerUp={() => {
                  isDraggingRef.current = false;
                }}
                className="relative aspect-[4/3] rounded-xl overflow-hidden select-none cursor-ew-resize focus:outline-none"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-tinted)",
                }}
                aria-label="Perbandingan Mode Senyap dan Mode Studio"
              >
                {/* Base Layer (Mode Studio · 140W) */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex items-center justify-center p-8">
                  <img
                    src={HERO_GALLERY[3].image}
                    alt="Mode Studio 140W"
                    className="max-h-full max-w-full object-contain drop-shadow-2xl"
                  />
                  <span className="absolute bottom-4 right-4 px-3 py-1.5 rounded-md text-xs font-mono-tabular font-medium bg-slate-950/85 text-white border border-white/15">
                    Mode Studio · 140W
                  </span>
                </div>

                {/* Top Clipped Layer (Mode Senyap · 24 dB) */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-blue-50 flex items-center justify-center p-8"
                  style={{
                    clipPath: `inset(0 ${100 - splitPct}% 0 0)`,
                  }}
                >
                  <img
                    src={HERO_GALLERY[0].image}
                    alt="Mode Senyap 24 dB"
                    className="max-h-full max-w-full object-contain drop-shadow-xl"
                  />
                  <span className="absolute bottom-4 left-4 px-3 py-1.5 rounded-md text-xs font-mono-tabular font-medium bg-slate-900/85 text-white">
                    Mode Senyap · 24 dB
                  </span>
                </div>

                {/* Vertical Divider & Knob */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.45)] pointer-events-none"
                  style={{ left: `${splitPct}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-slate-950 text-white border border-white/40 flex items-center justify-center shadow-lg">
                    <span className="text-[11px] font-mono-tabular">&lt;&gt;</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Copy & Segmented Control */}
            <div className="lg:col-span-6 flex flex-col gap-5">
              <span
                className="font-mono-tabular text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--accent)" }}
              >
                02 · Termal &amp; Akustik
              </span>

              <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.03em] leading-[1.08]">
                Tetap dingin di beban puncak.
              </h2>

              <p
                className="text-sm sm:text-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Arsitektur vapor chamber tembaga menjaga suhu inti tetap stabil saat
                rendering 3D atau kompilasi kode besar, lalu senyap total ketika bekerja
                di kafe atau ruang rapat.
              </p>

              {/* Segmented Control */}
              <div
                className="inline-flex p-1 rounded-lg w-fit"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <button
                  onClick={() => setSplitPct(88)}
                  className="px-4 py-2 rounded-md text-xs font-medium transition-all cursor-pointer"
                  style={{
                    backgroundColor: splitPct >= 50 ? "var(--bg)" : "transparent",
                    color: splitPct >= 50 ? "var(--text-primary)" : "var(--text-secondary)",
                    boxShadow: splitPct >= 50 ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  Mode Senyap
                </button>
                <button
                  onClick={() => setSplitPct(12)}
                  className="px-4 py-2 rounded-md text-xs font-medium transition-all cursor-pointer"
                  style={{
                    backgroundColor: splitPct < 50 ? "var(--bg)" : "transparent",
                    color: splitPct < 50 ? "var(--text-primary)" : "var(--text-secondary)",
                    boxShadow: splitPct < 50 ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  Mode Studio
                </button>
              </div>

              {/* Metrics */}
              <div
                className="grid grid-cols-2 gap-6 pt-5 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <div>
                  <div className="font-mono-tabular text-3xl sm:text-4xl font-bold">
                    38°C
                  </div>
                  <div
                    className="text-xs mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Suhu sasis rata-rata
                  </div>
                </div>
                <div>
                  <div className="font-mono-tabular text-3xl sm:text-4xl font-bold">
                    24 dB
                  </div>
                  <div
                    className="text-xs mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Kebisingan kipas harian
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EDITORIAL BENTO GRID & 3D WIREFRAME CANVAS (#craft) */}
      <section
        id="craft"
        className="py-16 sm:py-24 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] mb-8">
            Dirancang untuk jangka panjang.
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Tile 1: Tall 7 cols x 2 rows */}
            <div
              className="lg:col-span-7 lg:row-span-2 relative rounded-xl overflow-hidden min-h-[380px] lg:min-h-[480px] flex flex-col justify-end p-6 sm:p-8"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <img
                src={HERO_GALLERY[2].image}
                alt="Port Lengkap & Garansi Resmi"
                className="absolute inset-0 w-full h-full object-contain p-10 opacity-95"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: isDark
                    ? "linear-gradient(to top, rgba(11,13,17,0.92) 0%, rgba(11,13,17,0.2) 55%, transparent 100%)"
                    : "linear-gradient(to top, rgba(17,19,24,0.86) 0%, rgba(17,19,24,0.12) 55%, transparent 100%)",
                }}
              />
              <div className="relative z-10 text-white">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Port Lengkap &amp; Garansi Resmi Indonesia
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-1.5 max-w-lg">
                  Dual Thunderbolt 4, HDMI 2.1, unit tersegel resmi, serta layanan
                  unboxing dan pengecekan fisik langsung di Istana BEC Bandung.
                </p>
              </div>
            </div>

            {/* Tile 2: Top Right 5 cols */}
            <div
              className="lg:col-span-5 relative rounded-xl overflow-hidden min-h-[220px] flex flex-col justify-end p-6"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <img
                src={HERO_GALLERY[1].image}
                alt="Keyboard & Layar OLED"
                className="absolute inset-0 w-full h-full object-contain p-6 opacity-95"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(11,13,17,0.88) 0%, rgba(11,13,17,0.15) 60%, transparent 100%)",
                }}
              />
              <div className="relative z-10 text-white">
                <h3 className="text-lg font-bold tracking-tight">
                  Keyboard Presisi &amp; Layar OLED
                </h3>
                <p className="text-xs text-slate-200 mt-1">
                  Panel warna akurat 100% DCI-P3, gratis instalasi Windows &amp; Office
                  siap pakai.
                </p>
              </div>
            </div>

            {/* Tile 3: Bottom Right 5 cols — Live 3D Wireframe Canvas */}
            <div
              className="lg:col-span-5 rounded-xl overflow-hidden min-h-[240px] flex flex-col justify-between p-6"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="h-44 w-full">
                <WireframeChassisCanvas isDark={isDark} />
              </div>

              <div className="flex items-end justify-between pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                <div>
                  <div className="font-mono-tabular text-xl font-bold">14,9 mm</div>
                  <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    1,24 kg bobot ringkas
                  </div>
                </div>
                <span
                  className="font-mono-tabular text-[11px] font-medium px-2.5 py-1 rounded-md"
                  style={{
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  CNC 6063 Aluminum
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LIVE SUPABASE CATALOG SECTION (#katalog) */}
      <main
        id="katalog"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-1"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span
              className="font-mono-tabular text-xs font-medium uppercase tracking-wider"
              style={{ color: "var(--accent)" }}
            >
              03 · Katalog Resmi Istana BEC
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] mt-1">
              Temukan unit sesuai spesifikasi Anda.
            </h2>
          </div>

          <div
            className="font-mono-tabular text-xs font-medium px-3 py-1.5 rounded-lg w-fit"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            {filteredProducts.length} unit tersedia
          </div>
        </div>

        {/* Architectural Filter Bar */}
        <div
          className="rounded-xl p-5 mb-8 flex flex-col gap-4"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Row 1: Search & Sort */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search
                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-secondary)" }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari model, prosesor (i5, Ryzen 7, Ultra 5), RAM 16GB, RTX, OLED..."
                className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm focus:outline-none transition-all"
                style={{
                  backgroundColor: "var(--bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 cursor-pointer"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-56">
                <ArrowUpDown
                  className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "var(--text-secondary)" }}
                />
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 rounded-lg text-xs font-medium appearance-none focus:outline-none cursor-pointer"
                  style={{
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="recommend">Urutan Rekomendasi</option>
                  <option value="price-asc">Harga: Termurah</option>
                  <option value="price-desc">Harga: Termahal</option>
                  <option value="name-asc">Nama: A - Z</option>
                </select>
                <ChevronDown
                  className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "var(--text-secondary)" }}
                />
              </div>

              {isFilterActive && (
                <button
                  onClick={handleResetFilters}
                  className="px-3.5 py-2.5 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                  style={{
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--border-strong)",
                    color: "var(--text-primary)",
                  }}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Usage Category Switcher */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
            <span className="text-xs font-medium mr-1" style={{ color: "var(--text-secondary)" }}>
              Kebutuhan:
            </span>
            {(
              [
                { id: "ALL", label: "Semua" },
                { id: "STUDENT", label: "Kuliah (< 8.5 Jt)" },
                { id: "BUSINESS", label: "Ultrabook & Kerja" },
                { id: "GAMING", label: "Gaming & RTX" },
                { id: "OLED", label: "Layar OLED" },
              ] as { id: UsageCategory; label: string }[]
            ).map((cat) => {
              const active = usageCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setUsageCategory(cat.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                  style={{
                    backgroundColor: active ? "var(--accent)" : "var(--bg)",
                    color: active ? "var(--accent-text)" : "var(--text-secondary)",
                    border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Row 3: Brand Pills + Budget Chips */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {brands.map((brand) => {
                const active = selectedBrand === brand;
                return (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className="px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer"
                    style={{
                      backgroundColor: active ? "var(--text-primary)" : "var(--bg)",
                      color: active ? "var(--bg)" : "var(--text-secondary)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {brand}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {[
                { label: "Semua Harga", min: 0, max: highestCatalogPrice },
                { label: "< 6 Jt", min: 0, max: 6000000 },
                { label: "6 - 10 Jt", min: 6000000, max: 10000000 },
                { label: "10 - 18 Jt", min: 10000000, max: 18000000 },
                { label: "> 18 Jt", min: 18000000, max: highestCatalogPrice },
              ].map((b) => {
                const active = minPrice === b.min && maxPrice === b.max;
                return (
                  <button
                    key={b.label}
                    onClick={() => {
                      setMinPrice(b.min);
                      setMaxPrice(b.max);
                    }}
                    className="font-mono-tabular text-[11px] px-2.5 py-1 rounded-md transition-all cursor-pointer"
                    style={{
                      backgroundColor: active ? "var(--accent)" : "var(--bg)",
                      color: active ? "var(--accent-text)" : "var(--text-secondary)",
                      border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                    }}
                  >
                    {b.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div
              className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
              style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
            />
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Memuat katalog LaptopSquare...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div
            className="rounded-xl p-12 text-center max-w-lg mx-auto my-8"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <h4 className="text-base font-bold mb-1">Tidak Ada Unit yang Sesuai</h4>
            <p className="text-xs mb-5" style={{ color: "var(--text-secondary)" }}>
              Coba ubah kata kunci pencarian atau rentang harga Anda.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-lg text-xs font-medium cursor-pointer"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-text)",
              }}
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {visibleProducts.map((product) => {
              const img = getProductImage(product);
              const specs = parseSpecs(
                product.specs,
                product.name,
                Number(product.price) || 0
              );
              const isReady = ![
                "habis",
                "kosong",
                "sold",
                "sold out",
                "empty",
                "out of stock",
              ].includes(String(product.stock_status || "Ready").toLowerCase());

              return (
                <div
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsImageZoomed(false);
                  }}
                  className="group rounded-xl overflow-hidden flex flex-col cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {/* Image Box */}
                  <div
                    className="relative h-48 flex items-center justify-center p-4 border-b overflow-hidden"
                    style={{
                      backgroundColor: "var(--bg)",
                      borderColor: "var(--border)",
                    }}
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={product.name}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center gap-1.5 opacity-70">
                        <Laptop className="w-10 h-10 stroke-[1.25]" />
                        <span className="font-mono-tabular text-[11px] font-medium uppercase">
                          {product.brand} Official
                        </span>
                      </div>
                    )}

                    <span
                      className="absolute top-3 left-3 font-mono-tabular text-[10px] font-medium px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: isReady ? "var(--accent)" : "var(--surface-elevated)",
                        color: isReady ? "var(--accent-text)" : "var(--text-secondary)",
                      }}
                    >
                      {isReady ? "READY BEC" : "KONFIRMASI"}
                    </span>

                    <span
                      className="absolute top-3 right-3 font-mono-tabular text-[10px] font-medium px-2 py-0.5 rounded uppercase"
                      style={{
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {product.brand}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                        {product.name}
                      </h4>

                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {specs.cpu && (
                          <span
                            className="font-mono-tabular text-[10px] px-2 py-0.5 rounded truncate max-w-full"
                            style={{
                              backgroundColor: "var(--bg)",
                              border: "1px solid var(--border)",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {specs.cpu}
                          </span>
                        )}
                        {specs.ram && (
                          <span
                            className="font-mono-tabular text-[10px] px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: "var(--bg)",
                              border: "1px solid var(--border)",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {specs.ram}
                          </span>
                        )}
                        {specs.storage && (
                          <span
                            className="font-mono-tabular text-[10px] px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: "var(--bg)",
                              border: "1px solid var(--border)",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {specs.storage}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                      <div className="font-mono-tabular text-base font-bold">
                        Rp {Number(product.price).toLocaleString("id-ID")}
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                          }}
                          className="py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                          style={{
                            backgroundColor: "var(--bg)",
                            border: "1px solid var(--border)",
                            color: "var(--text-primary)",
                          }}
                        >
                          Detail Spek
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className="py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                          style={{
                            backgroundColor: "var(--accent)",
                            color: "var(--accent-text)",
                          }}
                        >
                          + Tas
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredProducts.length > showCount && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowCount(showCount + 24)}
              className="px-6 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border-strong)",
                color: "var(--text-primary)",
              }}
            >
              Muat 24 Unit Lainnya ({filteredProducts.length - showCount} tersisa)
            </button>
          </div>
        )}
      </main>

      {/* 7. GOOGLE REVIEWS 4.9★ & ISTANA BEC LOCATION */}
      <section
        id="lokasi"
        className="py-16 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-14">
          {/* Reviews Row */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <span
                  className="font-mono-tabular text-xs font-medium uppercase tracking-wider"
                  style={{ color: "var(--accent)" }}
                >
                  4.9 ★ Google Reviews
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                  Dipercaya ribuan pembeli Bandung &amp; Nusantara.
                </h3>
              </div>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium flex items-center gap-1.5 hover:underline"
                style={{ color: "var(--accent)" }}
              >
                <span>Lihat di Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {googleReviews.map((rev, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-5 flex flex-col justify-between gap-4"
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    &ldquo;{rev.text}&rdquo;
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                    <div>
                      <div className="text-xs font-bold">{rev.name}</div>
                      <div className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
                        {rev.time}
                      </div>
                    </div>
                    <span className="font-mono-tabular text-xs font-bold text-amber-500">
                      5.0★
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BEC Store & Map Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 flex flex-col gap-4">
              <span
                className="font-mono-tabular text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--accent)" }}
              >
                Showroom Fisik
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Istana BEC Lantai 1 Blok H16, Bandung.
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Kunjungi langsung untuk unboxing unit baru tersegel, tes keyboard &amp;
                layar OLED, serta konsultasi spesifikasi gratis bersama tim kami.
              </p>

              <div
                className="rounded-xl p-4 flex flex-col gap-2.5 text-xs"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
                  <span>
                    Istana BEC Lt. 1 Blok H16, Jl. Purnawarman No. 13-15, Bandung
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 shrink-0" style={{ color: "var(--accent)" }} />
                  <span className="font-mono-tabular">
                    Buka Setiap Hari · 10:00 — 20:00 WIB
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "var(--accent-text)",
                  }}
                >
                  Buka Google Maps
                </a>
                <a
                  href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(
                    "Halo LaptopSquare, saya mau tanya stok dan arah ke toko di Istana BEC Lt. 1 Blok H16."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border-strong)",
                    color: "var(--text-primary)",
                  }}
                >
                  Chat WhatsApp CS
                </a>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div
                className="rounded-xl overflow-hidden p-1.5"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <iframe
                  title="Peta Lokasi Laptop Square BEC"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.8988631165785!2d107.6087898!3d-6.9078216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e638090867fd%3A0x5b1dfccd504a25c5!2sLaptop%20Square%20BEC!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                  width="100%"
                  height="320"
                  style={{ border: 0, borderRadius: "8px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Minimalist FAQ */}
          <div className="pt-8 border-t" style={{ borderColor: "var(--border)" }}>
            <h3 className="text-xl font-bold tracking-tight mb-5">
              Pertanyaan Umum (FAQ)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {faqs.map((faq, idx) => {
                const open = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl overflow-hidden"
                    style={{
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <button
                      onClick={() => setActiveFaq(open ? null : idx)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-3 text-sm font-bold cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {open && (
                      <div
                        className="px-5 pb-4 text-xs leading-relaxed border-t pt-3"
                        style={{
                          borderColor: "var(--border)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 8. MINIMALIST ARCHITECTURAL FOOTER */}
      <footer
        className="border-t py-8 text-xs"
        style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
            laptopsquare.online
          </div>
          <div className="text-center">
            Kurasi laptop flagship dengan garansi resmi Indonesia · Istana BEC Bandung
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="hover:underline cursor-pointer"
              style={{ color: "var(--text-primary)" }}
            >
              {isDark ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
            </button>
            <span className="font-mono-tabular">© 2026 LaptopSquare</span>
          </div>
        </div>
      </footer>

      {/* 9. PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div
          onClick={() => {
            setSelectedProduct(null);
            setIsImageZoomed(false);
          }}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="rounded-xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[92vh] overflow-y-auto my-auto"
            style={{
              backgroundColor: "var(--bg)",
              border: "1px solid var(--border-strong)",
              boxShadow: "var(--shadow-tinted)",
            }}
          >
            <button
              onClick={() => {
                setSelectedProduct(null);
                setIsImageZoomed(false);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center font-bold cursor-pointer"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
              aria-label="Tutup"
            >
              ✕
            </button>

            <div
              onClick={() => setIsImageZoomed(!isImageZoomed)}
              className={`w-full rounded-xl flex items-center justify-center p-6 mb-5 relative cursor-pointer transition-all duration-300 ${
                isImageZoomed ? "h-80" : "h-52"
              }`}
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              {getProductImage(selectedProduct) ? (
                <img
                  src={getProductImage(selectedProduct)!}
                  alt={selectedProduct.name}
                  className={`max-w-full max-h-full object-contain transition-transform duration-300 ${
                    isImageZoomed ? "scale-110" : "scale-100"
                  }`}
                />
              ) : (
                <div className="flex flex-col items-center gap-2 opacity-70">
                  <Laptop className="w-12 h-12" />
                  <span className="font-mono-tabular text-xs">{selectedProduct.brand}</span>
                </div>
              )}
            </div>

            <div className="font-mono-tabular text-xs uppercase" style={{ color: "var(--accent)" }}>
              {selectedProduct.brand} · Garansi Resmi
            </div>
            <h3 className="text-xl font-bold tracking-tight mt-1">
              {selectedProduct.name}
            </h3>
            <div className="font-mono-tabular text-2xl font-bold mt-2 mb-5">
              Rp {Number(selectedProduct.price).toLocaleString("id-ID")}
            </div>

            {/* Structured Specs */}
            <div
              className="rounded-xl p-4 mb-5"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              {(() => {
                const parsed = parseSpecs(
                  selectedProduct.specs,
                  selectedProduct.name,
                  Number(selectedProduct.price) || 0
                );
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {parsed.cpu && (
                      <div className="p-2.5 rounded-lg" style={{ backgroundColor: "var(--bg)" }}>
                        <span className="block text-[10px]" style={{ color: "var(--text-secondary)" }}>
                          Prosesor
                        </span>
                        <span className="font-mono-tabular font-medium">{parsed.cpu}</span>
                      </div>
                    )}
                    {parsed.ram && (
                      <div className="p-2.5 rounded-lg" style={{ backgroundColor: "var(--bg)" }}>
                        <span className="block text-[10px]" style={{ color: "var(--text-secondary)" }}>
                          Memori
                        </span>
                        <span className="font-mono-tabular font-medium">{parsed.ram}</span>
                      </div>
                    )}
                    {parsed.storage && (
                      <div className="p-2.5 rounded-lg" style={{ backgroundColor: "var(--bg)" }}>
                        <span className="block text-[10px]" style={{ color: "var(--text-secondary)" }}>
                          Penyimpanan
                        </span>
                        <span className="font-mono-tabular font-medium">{parsed.storage}</span>
                      </div>
                    )}
                    {parsed.display && (
                      <div className="p-2.5 rounded-lg" style={{ backgroundColor: "var(--bg)" }}>
                        <span className="block text-[10px]" style={{ color: "var(--text-secondary)" }}>
                          Layar
                        </span>
                        <span className="font-mono-tabular font-medium">{parsed.display}</span>
                      </div>
                    )}
                  </div>
                );
              })()}
              <div
                className="font-mono-tabular text-[11px] mt-3 pt-3 border-t"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              >
                {String(selectedProduct.specs || "-")}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="py-3 rounded-lg text-sm font-medium cursor-pointer"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "var(--accent-text)",
                }}
              >
                Tambah ke Tas Belanja
              </button>
              <a
                href={getWhatsAppLink(selectedProduct)}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 rounded-lg text-sm font-medium text-center flex items-center justify-center gap-2"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border-strong)",
                  color: "var(--text-primary)",
                }}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Tanya Stok via WA</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 10. SLIDE-OVER BAG DRAWER (#bag-drawer) */}
      {isBagOpen && (
        <div
          onClick={() => setIsBagOpen(false)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[4px] flex justify-end"
        >
          <aside
            id="bag-drawer"
            onClick={(e) => e.stopPropagation()}
            className="drawer-panel h-full flex flex-col justify-between p-6 overflow-y-auto"
            style={{
              width: "min(440px, 100vw)",
              backgroundColor: "var(--bg)",
              borderLeft: "1px solid var(--border)",
              boxShadow: "var(--shadow-tinted)",
            }}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  <h3 className="text-base font-bold">
                    Tas Belanja{" "}
                    <span className="font-mono-tabular" style={{ color: "var(--accent)" }}>
                      ({totalBagCount})
                    </span>
                  </h3>
                </div>
                <button
                  onClick={() => setIsBagOpen(false)}
                  className="p-1.5 rounded-lg cursor-pointer"
                  style={{ backgroundColor: "var(--surface)" }}
                  aria-label="Tutup tas"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {confirmedOrder ? (
                <div className="py-10 flex flex-col gap-4">
                  <span
                    className="font-mono-tabular text-xs font-medium px-2.5 py-1 rounded-md w-fit"
                    style={{
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border)",
                      color: "var(--accent)",
                    }}
                  >
                    Pesanan {confirmedOrder.id} Dikonfirmasi
                  </span>
                  <h4 className="text-2xl font-bold">
                    Terima kasih, {confirmedOrder.name}.
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {confirmedOrder.count} unit laptop dengan total{" "}
                    <span className="font-mono-tabular font-bold" style={{ color: "var(--text-primary)" }}>
                      Rp {confirmedOrder.total.toLocaleString("id-ID")}
                    </span>{" "}
                    telah diteruskan ke WhatsApp CS LaptopSquare Istana BEC Bandung.
                  </p>
                  <button
                    onClick={() => {
                      setCart([]);
                      setConfirmedOrder(null);
                      setIsBagOpen(false);
                    }}
                    className="mt-2 py-3 rounded-lg text-sm font-medium cursor-pointer"
                    style={{
                      backgroundColor: "var(--accent)",
                      color: "var(--accent-text)",
                    }}
                  >
                    Selesai
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="py-16 text-center flex flex-col items-center gap-4">
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Tas belanja Anda masih kosong.
                  </p>
                  <button
                    onClick={() => {
                      setIsBagOpen(false);
                      scrollToSection("katalog");
                    }}
                    className="px-4 py-2.5 rounded-lg text-xs font-medium cursor-pointer"
                    style={{
                      backgroundColor: "var(--accent)",
                      color: "var(--accent-text)",
                    }}
                  >
                    Pilih Laptop
                  </button>
                </div>
              ) : (
                <form id="bag-order-form" onSubmit={handleConfirmOrder} className="flex flex-col gap-5 mt-5">
                  <div className="flex flex-col gap-3">
                    {cart.map((item) => {
                      const img = getProductImage(item.product);
                      return (
                        <div
                          key={item.product.id}
                          className="p-3 rounded-xl flex items-center gap-3"
                          style={{
                            backgroundColor: "var(--surface)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          <div
                            className="w-16 h-14 rounded-lg flex items-center justify-center p-1.5 shrink-0"
                            style={{ backgroundColor: "var(--bg)" }}
                          >
                            {img ? (
                              <img
                                src={img}
                                alt={item.product.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <Laptop className="w-6 h-6 opacity-60" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold truncate">
                              {item.product.name}
                            </div>
                            <div className="font-mono-tabular text-xs mt-0.5" style={{ color: "var(--accent)" }}>
                              Rp {Number(item.product.price).toLocaleString("id-ID")}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => updateCartQty(item.product.id, -1)}
                              className="w-6 h-6 rounded flex items-center justify-center cursor-pointer"
                              style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)" }}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono-tabular text-xs w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQty(item.product.id, 1)}
                              className="w-6 h-6 rounded flex items-center justify-center cursor-pointer"
                              style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)" }}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Customer Details */}
                  <div className="flex flex-col gap-3 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                    <div>
                      <label className="block text-xs font-medium mb-1">Nama Lengkap</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Contoh: Bima Pratama"
                        className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none"
                        style={{
                          backgroundColor: "var(--surface)",
                          border: "1px solid var(--border)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Nomor WhatsApp</label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="0812-xxxx-xxxx"
                        className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none"
                        style={{
                          backgroundColor: "var(--surface)",
                          border: "1px solid var(--border)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Alamat Pengiriman / Ambil di Toko
                      </label>
                      <textarea
                        rows={2}
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="Jalan, Kota, atau tulis: Ambil di Istana BEC Bandung"
                        className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none"
                        style={{
                          backgroundColor: "var(--surface)",
                          border: "1px solid var(--border)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>
                  </div>
                </form>
              )}
            </div>

            {cart.length > 0 && !confirmedOrder && (
              <div className="pt-4 mt-6 border-t" style={{ borderColor: "var(--border)" }}>
                <div className="text-[11px] mb-2" style={{ color: "var(--text-secondary)" }}>
                  Gratis ongkir berasuransi penuh atau ambil langsung di Istana BEC Lt. 1 Blok H16
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">Total</span>
                  <span className="font-mono-tabular text-lg font-bold">
                    Rp {totalBagPrice.toLocaleString("id-ID")}
                  </span>
                </div>
                <button
                  type="submit"
                  form="bag-order-form"
                  className="w-full py-3 rounded-lg text-sm font-medium cursor-pointer"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "var(--accent-text)",
                  }}
                >
                  Konfirmasi Pesanan via WhatsApp
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
