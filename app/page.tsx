"use client";

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Product, UsageCategory } from '../lib/types';
import { parseSpecs } from '../lib/specsParser';
import {
  Search,
  X,
  MapPin,
  ShieldCheck,
  Award,
  Sparkles,
  Cpu,
  HardDrive,
  Layers,
  Monitor,
  Star,
  CreditCard,
  PackageCheck,
  Clock,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Laptop,
  Zap,
  GraduationCap,
  Briefcase,
  Gamepad2,
  Palette,
  MessageCircle,
  RotateCcw,
  SlidersHorizontal,
  ArrowUpDown,
  Check
} from 'lucide-react';

const MAPS_URL = "https://www.google.com/maps/place/Laptop+Square+BEC/@-6.9078216,107.6087898,17z/data=!3m1!4b1!4m6!3m5!1s0x2e68e638090867fd:0x5b1dfccd504a25c5!8m2!3d-6.9078216!4d107.6087898!16s%2Fg%2F1pzwhkpd7?entry=ttu";
const WA_PHONE = "6282110898948";
const LOGO_URL = "https://mugcnbapivtaplnjzuvq.supabase.co/storage/v1/object/public/products/logo%20ls.jpg";

export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // FILTERS STATE
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [usageCategory, setUsageCategory] = useState<UsageCategory>('ALL');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(50000000);
  const [highestCatalogPrice, setHighestCatalogPrice] = useState<number>(50000000);
  const [sortBy, setSortBy] = useState<'recommend' | 'price-asc' | 'price-desc' | 'name-asc'>('recommend');
  const [showCount, setShowCount] = useState<number>(24);

  const brands = ['ALL', 'Lenovo', 'HP', 'Acer', 'ASUS', 'MSI', 'Apple', 'Axioo', 'Advan', 'Zyrex', 'Colorful'];

  const heroSlides = [
    {
      badge: "PROMO CICILAN 0%",
      title: "Pusat Laptop Resmi & Terlengkap di Bandung",
      highlight: "Cicilan 0% Hingga 24 Bulan",
      description: "Belanja aman dengan garansi resmi 100% brand. Nikmati fasilitas cicilan ringan dan bonus melimpah tas laptop serta instalasi software siap pakai.",
      ctaText: "Konsultasi Cicilan 0%",
      ctaLink: `https://wa.me/${WA_PHONE}?text=${encodeURIComponent("Halo Laptop Square BEC, saya mau konsultasi promo cicilan 0% dan rekomendasi laptop.")}`,
      bgGradient: "from-slate-950 via-slate-900 to-sky-950",
      accent: "text-sky-400",
      badgeBg: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    },
    {
      badge: "GAMING & CREATOR ZONE",
      title: "Performa Maksimal RTX & Layar OLED",
      highlight: "Laptop Gaming & Rendering Siap Libas",
      description: "Temukan ASUS TUF, Lenovo LOQ, MSI Cyborg & Katana, Acer Nitro dengan pendingin optimal dan refresh rate tinggi untuk produktivitas & kompetisi game.",
      ctaText: "Lihat Laptop Gaming",
      ctaAction: "GAMING",
      bgGradient: "from-slate-950 via-purple-950/60 to-slate-900",
      accent: "text-purple-400",
      badgeBg: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    },
    {
      badge: "PAKET HEMAT MAHASISWA & KANTOR",
      title: "Laptop Tipis, Baterai Awet & Siap Tugas",
      highlight: "Mulai 4 Jutaan Bergaransi Resmi",
      description: "Pilihan terbaik untuk kuliah, skripsi, dan kerja harian. Gratis instalasi Windows & Office siap pakai, bawa pulang langsung gas tugas tanpa ribet.",
      ctaText: "Pilih Laptop Pelajar",
      ctaAction: "STUDENT",
      bgGradient: "from-slate-950 via-emerald-950/60 to-slate-900",
      accent: "text-emerald-400",
      badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    }
  ];

  const googleReviews = [
    {
      name: "Aulia Azizah",
      time: "1 minggu lalu",
      rating: 5,
      text: "Pelayanan sangat bagus, ramah, dan cepat. Dapet rekomendasi laptop sesuai kebutuhan budget!"
    },
    {
      name: "Aninda Yuris",
      time: "2 minggu lalu",
      rating: 5,
      text: "Pembelian laptop di Laptop Square dibantu banget, ramah dan sangat membantu. Sukses terus!"
    },
    {
      name: "Hannzzz Gans",
      time: "1 bulan lalu",
      rating: 5,
      text: "Pusat laptop terlengkap di BEC Lantai 1. Pelayanan mantap, harga bersaing dan garansi resmi."
    },
    {
      name: "Rizky Ramadhan",
      time: "1 bulan lalu",
      rating: 5,
      text: "Pelayanan toko offline di BEC ramah banget, dijelasin spek detail sampai tuntas dan dibantu install aplikasi lengkap gratis."
    }
  ];

  const faqs = [
    {
      q: "Apakah seluruh unit laptop di Laptop Square bergaransi resmi?",
      a: "Ya, 100% unit kami adalah produk BARU dan BERGARANSI RESMI dari masing-masing brand (ASUS, Lenovo, HP, Acer, MSI, Apple, Axioo, Advan, dll.). Klaim garansi dapat dilakukan di seluruh Service Center Resmi di seluruh Indonesia."
    },
    {
      q: "Bagaimana cara mengajukan promo cicilan 0%?",
      a: "Kami menyediakan fasilitas cicilan 0% menggunakan Kartu Kredit (berbagai bank rekanan) serta opsi cicilan non-kartu kredit melalui mitra terpercaya (Kredivo, Akulaku, Home Credit, SPayLater). Tim kami di Istana BEC siap membantu proses pengajuan hingga disetujui."
    },
    {
      q: "Apakah sudah termasuk instalasi software dan aplikasi?",
      a: "Tentu! Setiap pembelian laptop di Laptop Square mendapatkan fasilitas GRATIS instalasi sistem operasi Windows original bawaan, Microsoft Office, browser, media player, PDF reader, dan software esensial lainnya sehingga siap pakai."
    },
    {
      q: "Apakah melayani pengiriman ke luar kota Bandung?",
      a: "Bisa. Kami melayani pengiriman aman ke seluruh kota di Indonesia menggunakan ekspedisi terpercaya dengan standar proteksi tinggi (bubble wrap tebal, asuransi penuh, dan opsi packing kayu)."
    },
    {
      q: "Bisakah saya datang langsung mengecek unit di toko fisik?",
      a: "Sangat bisa! Silakan kunjungi toko fisik kami di Istana BEC (Bandung Electronic Center) Lantai 1 Blok H16, Bandung. Buka setiap hari dari pukul 10:00 hingga 20:00 WIB untuk unboxing dan pengetesan unit langsung."
    }
  ];

  // Auto carousel slide timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Fetch products from Supabase
  useEffect(() => {
    async function getProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*');
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

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    if (allProducts.length === 0) return [];

    let list = [...allProducts];

    // 1. Brand filter
    if (selectedBrand !== 'ALL') {
      list = list.filter(p => p.brand?.toLowerCase() === selectedBrand.toLowerCase());
    }

    // 2. Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => {
        const nameMatch = p.name?.toLowerCase().includes(q);
        const specsMatch = p.specs?.toLowerCase().includes(q);
        const brandMatch = p.brand?.toLowerCase().includes(q);
        return nameMatch || specsMatch || brandMatch;
      });
    }

    // 3. Price range filter
    list = list.filter(p => {
      const price = Number(p.price) || 0;
      return price >= minPrice && price <= maxPrice;
    });

    // 4. Usage Category filter
    if (usageCategory !== 'ALL') {
      list = list.filter(p => {
        const parsed = parseSpecs(p.specs, p.name, Number(p.price) || 0);
        if (usageCategory === 'GAMING') return parsed.category === 'GAMING';
        if (usageCategory === 'OLED') return parsed.category === 'OLED' || String(p.specs).toLowerCase().includes('oled');
        if (usageCategory === 'STUDENT') return parsed.category === 'STUDENT' || (Number(p.price) > 0 && Number(p.price) <= 8500000);
        if (usageCategory === 'BUSINESS') return parsed.category === 'BUSINESS' || p.brand?.toUpperCase() === 'APPLE';
        return true;
      });
    }

    // 5. Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === 'name-asc') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return list;
  }, [allProducts, selectedBrand, searchQuery, minPrice, maxPrice, usageCategory, sortBy]);

  // Reset showCount on filter change
  useEffect(() => {
    setShowCount(24);
  }, [searchQuery, selectedBrand, usageCategory, minPrice, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedBrand('ALL');
    setUsageCategory('ALL');
    setMinPrice(0);
    setMaxPrice(highestCatalogPrice);
    setSortBy('recommend');
  };

  const isFilterActive =
    searchQuery.trim() !== '' ||
    selectedBrand !== 'ALL' ||
    usageCategory !== 'ALL' ||
    minPrice > 0 ||
    maxPrice < highestCatalogPrice ||
    sortBy !== 'recommend';

  const visibleProducts = filteredProducts.slice(0, showCount);

  // Helper image resolver
  const getProductImage = (product: Product) => {
    if (product.image_url && !product.image_url.includes('placeholder')) {
      return product.image_url;
    }
    if (product.slug) {
      return `https://mugcnbapivtaplnjzuvq.supabase.co/storage/v1/object/public/products/${product.slug}.jpg`;
    }
    return null;
  };

  // WhatsApp Message Generator
  const getWhatsAppLink = (product: Product) => {
    const name = product.name || '';
    const price = `Rp ${Number(product.price).toLocaleString('id-ID')}`;
    const specs = typeof product.specs === 'string' ? product.specs : String(product.specs || '-');
    const message = `Halo Laptop Square Istana BEC,\n\nSaya tertarik dengan unit:\n*${name}*\nHarga: *${price}*\n\nSpesifikasi Singkat:\n${specs}\n\nApakah unit ini ready di toko Istana BEC Lantai 1 Blok H16? Terima kasih!`;
    return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('katalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-sky-500 selection:text-white">
      
      {/* 1. TOP ANNOUNCEMENT TICKER */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-700 to-indigo-900 text-white text-xs font-medium py-2 px-4 shadow-sm border-b border-sky-600/30 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-semibold text-sky-200">
              <MapPin className="w-3.5 h-3.5 text-sky-300" />
              Istana BEC Lantai 1 Blok H16, Bandung
            </span>
            <span className="flex items-center gap-1.5 text-sky-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Produk Garansi Resmi Brand
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs mx-auto sm:mx-0">
            <span className="flex items-center gap-1 text-amber-300 font-semibold">
              <Zap className="w-3.5 h-3.5" />
              Promo Cicilan 0% & Free Bonus Tas + Install Software
            </span>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1 text-sky-200 hover:text-white underline underline-offset-2 transition-colors"
            >
              Lihat di Google Maps
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER & NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4">
            
            {/* BRAND LOGO & TITLE */}
            <div className="flex items-center gap-3">
              <div className="relative group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <img
                  src={LOGO_URL}
                  alt="Logo Laptop Square"
                  className="w-11 h-11 rounded-xl object-contain bg-slate-900 border border-slate-700 shadow-md transition-transform group-hover:scale-105"
                />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full" title="Toko Buka"></span>
              </div>
              <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center">
                    LAPTOP <span className="text-sky-400 ml-1">SQUARE</span>
                  </h1>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                    BEC
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                  Pusat Laptop Resmi Istana BEC Bandung
                </p>
              </div>
            </div>

            {/* DESKTOP NAVIGATION LINKS */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
              <button onClick={scrollToCatalog} className="hover:text-sky-400 transition-colors">
                Katalog Laptop
              </button>
              <a href="#kategori" className="hover:text-sky-400 transition-colors">
                Kategori Kebutuhan
              </a>
              <a href="#ulasan" className="hover:text-sky-400 transition-colors">
                Ulasan 4.9★
              </a>
              <a href="#lokasi" className="hover:text-sky-400 transition-colors">
                Lokasi Toko
              </a>
              <a href="#faq" className="hover:text-sky-400 transition-colors">
                FAQ
              </a>
            </nav>

            {/* HEADER ACTIONS */}
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all hover:border-slate-600"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Petunjuk BEC</span>
              </a>

              <a
                href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent("Halo Laptop Square BEC, saya ingin tanya ketersediaan stok laptop.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950 transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat CS BEC</span>
              </a>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Toggle navigation"
              >
                <span className="text-xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
              </button>
            </div>
          </div>

          {/* MOBILE NAVIGATION DRAWER */}
          {isMobileMenuOpen && (
            <div className="lg:hidden pt-4 pb-2 border-t border-slate-800 mt-3 flex flex-col gap-2 text-sm">
              <button
                onClick={() => {
                  scrollToCatalog();
                  setIsMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded-lg text-slate-200 hover:bg-slate-800 font-medium"
              >
                💻 Katalog Laptop
              </button>
              <a
                href="#kategori"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg text-slate-200 hover:bg-slate-800 font-medium"
              >
                🎯 Kategori Kebutuhan
              </a>
              <a
                href="#ulasan"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg text-slate-200 hover:bg-slate-800 font-medium"
              >
                ⭐ Ulasan Pelanggan 4.9
              </a>
              <a
                href="#lokasi"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg text-slate-200 hover:bg-slate-800 font-medium"
              >
                📍 Lokasi Toko BEC
              </a>
              <a
                href="#faq"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg text-slate-200 hover:bg-slate-800 font-medium"
              >
                ❓ Tanya Jawab (FAQ)
              </a>
            </div>
          )}
        </div>
      </header>

      {/* 3. HERO SECTION (HIGH CONVERSION) */}
      <section className="relative overflow-hidden bg-slate-950 text-white border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* HERO LEFT COPY */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sky-400 text-xs font-semibold w-fit shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Retail Resmi Laptop Istana BEC Bandung</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
                Pusat Laptop Resmi & Terlengkap di <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400">Bandung</span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                Temukan laptop idaman untuk kebutuhan kuliah, kerja, konten kreator, hingga gaming. Dapatkan konsultasi spesifikasi gratis, jaminan garansi resmi 100%, fasilitas cicilan 0%, dan bonus instalasi software siap pakai langsung di Istana BEC Lantai 1 Blok H16.
              </p>

              {/* QUICK CTA BUTTONS */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={scrollToCatalog}
                  className="px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-lg shadow-sky-500/25 transition-all hover:shadow-sky-500/40 flex items-center gap-2 active:scale-95"
                >
                  <Search className="w-4 h-4" />
                  <span>Jelajahi 370+ Laptop</span>
                </button>

                <a
                  href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent("Halo Laptop Square BEC, saya ingin konsultasi memilih laptop sesuai budget dan kebutuhan.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all flex items-center gap-2 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Konsultasi Spek via WA</span>
                </a>
              </div>

              {/* KEY STATS BAR */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">370+</div>
                  <div className="text-xs text-slate-400 font-medium">Unit Ready Stock</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400 flex items-center gap-1">
                    4.9 <span className="text-sm">★</span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">Rating Google Reviews</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-sky-400">100%</div>
                  <div className="text-xs text-slate-400 font-medium">Garansi Resmi Brand</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400">0%</div>
                  <div className="text-xs text-slate-400 font-medium">Opsi Promo Cicilan</div>
                </div>
              </div>

            </div>

            {/* HERO RIGHT INTERACTIVE PROMO CAROUSEL */}
            <div className="lg:col-span-5">
              <div className={`relative rounded-2xl p-6 sm:p-8 bg-gradient-to-br ${heroSlides[currentSlide].bgGradient} border border-slate-800 shadow-2xl overflow-hidden transition-all duration-700 min-h-[340px] flex flex-col justify-between`}>
                
                <div className="relative z-10 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${heroSlides[currentSlide].badgeBg}`}>
                      {heroSlides[currentSlide].badge}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      0{currentSlide + 1} / 0{heroSlides.length}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    {heroSlides[currentSlide].title}
                  </h3>

                  <div className={`text-sm sm:text-base font-bold ${heroSlides[currentSlide].accent}`}>
                    ✦ {heroSlides[currentSlide].highlight}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {heroSlides[currentSlide].description}
                  </p>
                </div>

                <div className="relative z-10 pt-6 flex items-center justify-between">
                  {heroSlides[currentSlide].ctaAction ? (
                    <button
                      onClick={() => {
                        setUsageCategory(heroSlides[currentSlide].ctaAction as UsageCategory);
                        scrollToCatalog();
                      }}
                      className="px-4 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span>{heroSlides[currentSlide].ctaText}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <a
                      href={heroSlides[currentSlide].ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span>{heroSlides[currentSlide].ctaText}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {/* Carousel Indicators */}
                  <div className="flex items-center gap-2">
                    {heroSlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-2 rounded-full transition-all ${
                          idx === currentSlide ? 'w-6 bg-sky-400' : 'w-2 bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Decorative background glow */}
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. TRUST & VALUE PERKS BAR */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">100% Garansi Resmi</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Unit baru original brand dengan garansi nasional resmi Indonesia.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Toko Fisik Istana BEC</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Bisa cek fisik, coba keyboard & layar langsung di BEC Lt. 1 Blok H16.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Free Bonus & Siap Pakai</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Gratis tas laptop baru + instalasi Windows & aplikasi esensial.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Cicilan 0% & Fleksibel</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Support cicilan kartu kredit, QRIS, transfer bank, & paylater terpercaya.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. KATEGORI KEBUTUHAN PEMBELI (SMART CATEGORY SHORTCUTS) */}
      <section id="kategori" className="py-10 bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                Panduan Memilih Cepat
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                Pilih Laptop Sesuai Kebutuhan Anda
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Klik kategori di bawah untuk memfilter rekomendasi produk secara instan
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            
            {/* 1. Mahasiswa / Pelajar */}
            <button
              onClick={() => {
                setUsageCategory('STUDENT');
                scrollToCatalog();
              }}
              className={`p-4 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between min-h-[120px] ${
                usageCategory === 'STUDENT'
                  ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/20'
                  : 'bg-white hover:bg-sky-50/50 text-slate-800 border-slate-200 hover:border-sky-300'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${usageCategory === 'STUDENT' ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-600'}`}>
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="mt-3">
                <div className="text-xs font-bold leading-tight">Kuliah & Sekolah</div>
                <div className={`text-[10px] mt-0.5 font-medium ${usageCategory === 'STUDENT' ? 'text-sky-100' : 'text-slate-500'}`}>
                  Budget hemat &lt; 8.5 Jt
                </div>
              </div>
            </button>

            {/* 2. Kerja & Bisnis */}
            <button
              onClick={() => {
                setUsageCategory('BUSINESS');
                scrollToCatalog();
              }}
              className={`p-4 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between min-h-[120px] ${
                usageCategory === 'BUSINESS'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                  : 'bg-white hover:bg-indigo-50/50 text-slate-800 border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${usageCategory === 'BUSINESS' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="mt-3">
                <div className="text-xs font-bold leading-tight">Kerja & Ultrabook</div>
                <div className={`text-[10px] mt-0.5 font-medium ${usageCategory === 'BUSINESS' ? 'text-indigo-100' : 'text-slate-500'}`}>
                  Bodi tipis, elegan, premium
                </div>
              </div>
            </button>

            {/* 3. Gaming & Heavy Tasks */}
            <button
              onClick={() => {
                setUsageCategory('GAMING');
                scrollToCatalog();
              }}
              className={`p-4 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between min-h-[120px] ${
                usageCategory === 'GAMING'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20'
                  : 'bg-white hover:bg-rose-50/50 text-slate-800 border-slate-200 hover:border-rose-300'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${usageCategory === 'GAMING' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'}`}>
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div className="mt-3">
                <div className="text-xs font-bold leading-tight">Gaming & Rendering</div>
                <div className={`text-[10px] mt-0.5 font-medium ${usageCategory === 'GAMING' ? 'text-rose-100' : 'text-slate-500'}`}>
                  GPU RTX & High Refresh
                </div>
              </div>
            </button>

            {/* 4. Layar OLED / Konten Kreator */}
            <button
              onClick={() => {
                setUsageCategory('OLED');
                scrollToCatalog();
              }}
              className={`p-4 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between min-h-[120px] ${
                usageCategory === 'OLED'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20'
                  : 'bg-white hover:bg-amber-50/50 text-slate-800 border-slate-200 hover:border-amber-300'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${usageCategory === 'OLED' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-600'}`}>
                <Palette className="w-5 h-5" />
              </div>
              <div className="mt-3">
                <div className="text-xs font-bold leading-tight">Layar OLED & Desain</div>
                <div className={`text-[10px] mt-0.5 font-medium ${usageCategory === 'OLED' ? 'text-amber-100' : 'text-slate-500'}`}>
                  Warna 100% akurat sRGB
                </div>
              </div>
            </button>

            {/* 5. Tampilkan Semua */}
            <button
              onClick={() => {
                setUsageCategory('ALL');
                scrollToCatalog();
              }}
              className={`p-4 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between min-h-[120px] ${
                usageCategory === 'ALL'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${usageCategory === 'ALL' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                <Laptop className="w-5 h-5" />
              </div>
              <div className="mt-3">
                <div className="text-xs font-bold leading-tight">Semua Kategori</div>
                <div className={`text-[10px] mt-0.5 font-medium ${usageCategory === 'ALL' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Total {allProducts.length} unit laptop
                </div>
              </div>
            </button>

          </div>
        </div>
      </section>

      {/* 6. MAIN CATALOG & FILTER SECTION */}
      <main id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        
        {/* FILTER BAR BOX */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-8">
          <div className="flex flex-col gap-4">
            
            {/* ROW 1: SEARCH & ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari model laptop, prosesor (i5, Ryzen 7, Ultra 5), RAM 16GB, RTX 4050, OLED..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* SORT DROPDOWN */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-56">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer"
                  >
                    <option value="recommend">🌟 Urutan Rekomendasi</option>
                    <option value="price-asc">💰 Harga: Termurah ke Termahal</option>
                    <option value="price-desc">💎 Harga: Termahal ke Termurah</option>
                    <option value="name-asc">🔤 Nama Produk: A - Z</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {isFilterActive && (
                  <button
                    onClick={handleResetFilters}
                    className="px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95"
                    title="Reset semua filter"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* ROW 2: BRAND PILLS FILTER */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <span className="text-xs font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3" /> Brand:
                </span>
                {brands.map((brand) => {
                  const isSelected = selectedBrand === brand;
                  return (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {brand}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ROW 3: PRICE RANGE SLIDER & QUICK BUDGET PILLS */}
            <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 mr-1">Budget Cepat:</span>
                <button
                  onClick={() => { setMinPrice(0); setMaxPrice(highestCatalogPrice); }}
                  className={`text-[11px] px-2.5 py-1 rounded-md font-medium border ${minPrice === 0 && maxPrice === highestCatalogPrice ? 'bg-sky-50 border-sky-300 text-sky-700 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  Semua
                </button>
                <button
                  onClick={() => { setMinPrice(0); setMaxPrice(6000000); }}
                  className={`text-[11px] px-2.5 py-1 rounded-md font-medium border ${minPrice === 0 && maxPrice === 6000000 ? 'bg-sky-50 border-sky-300 text-sky-700 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  &lt; 6 Juta
                </button>
                <button
                  onClick={() => { setMinPrice(6000000); setMaxPrice(10000000); }}
                  className={`text-[11px] px-2.5 py-1 rounded-md font-medium border ${minPrice === 6000000 && maxPrice === 10000000 ? 'bg-sky-50 border-sky-300 text-sky-700 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  6 - 10 Juta
                </button>
                <button
                  onClick={() => { setMinPrice(10000000); setMaxPrice(18000000); }}
                  className={`text-[11px] px-2.5 py-1 rounded-md font-medium border ${minPrice === 10000000 && maxPrice === 18000000 ? 'bg-sky-50 border-sky-300 text-sky-700 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  10 - 18 Juta
                </button>
                <button
                  onClick={() => { setMinPrice(18000000); setMaxPrice(highestCatalogPrice); }}
                  className={`text-[11px] px-2.5 py-1 rounded-md font-medium border ${minPrice === 18000000 && maxPrice === highestCatalogPrice ? 'bg-sky-50 border-sky-300 text-sky-700 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  &gt; 18 Juta
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="font-medium text-slate-500 whitespace-nowrap">Rentang:</span>
                <span className="font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200 whitespace-nowrap">
                  Rp {minPrice.toLocaleString('id-ID')} — Rp {maxPrice.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION HEADER RESULTS COUNT */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>Katalog Laptop Pilihan</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                {filteredProducts.length} unit
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Menampilkan {Math.min(showCount, filteredProducts.length)} dari {filteredProducts.length} produk
              {selectedBrand !== 'ALL' && ` • Brand: ${selectedBrand}`}
              {usageCategory !== 'ALL' && ` • Kategori: ${usageCategory}`}
              {searchQuery && ` • Kata kunci: "${searchQuery}"`}
            </p>
          </div>
        </div>

        {/* PRODUCT GRID */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-600">Memuat katalog resmi Laptop Square...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm my-8">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
              <Search className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">
              Tidak Ada Laptop yang Sesuai
            </h4>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Coba sesuaikan kata kunci pencarian, ubah rentang harga, atau pilih kategori brand lainnya.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {visibleProducts.map((product) => {
              const img = getProductImage(product);
              const specs = parseSpecs(product.specs, product.name, Number(product.price) || 0);
              const isReady = !['habis', 'kosong', 'sold', 'sold out', 'empty', 'out of stock'].includes(
                String(product.stock_status || 'Ready').toLowerCase()
              );
              const estimatedCicilan = Math.round((Number(product.price) || 0) / 12);

              return (
                <div
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsImageZoomed(false);
                  }}
                  className="group bg-white rounded-2xl border border-slate-200/90 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
                >
                  
                  {/* IMAGE CONTAINER */}
                  <div className="relative h-48 bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4 border-b border-slate-100 overflow-hidden">
                    
                    {img ? (
                      <img
                        src={img}
                        alt={product.name}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      /* SLEEK FALLBACK VISUAL LAPTOP IF NO IMAGE */
                      <div className="w-full h-full rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-4 flex flex-col justify-between text-white relative overflow-hidden shadow-inner">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>LAPTOP SQUARE</span>
                          <span className="text-sky-400 font-bold uppercase">{product.brand}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center my-auto">
                          <Laptop className="w-10 h-10 text-slate-400 stroke-[1.2] mb-1 group-hover:text-sky-400 transition-colors" />
                          <span className="text-[11px] font-bold text-slate-300 text-center line-clamp-1">
                            {product.brand} Official
                          </span>
                        </div>
                        <div className="text-[9px] text-slate-400 text-center font-medium">
                          Unit Garansi Resmi • Istana BEC
                        </div>
                      </div>
                    )}

                    {/* STATUS READY BADGE */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm ${
                        isReady
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-600 text-slate-200'
                      }`}>
                        {isReady ? '✓ READY BEC' : 'KONFIRMASI CS'}
                      </span>
                    </div>

                    {/* BRAND BADGE */}
                    <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-white/90 backdrop-blur-sm border border-slate-200 px-2 py-0.5 rounded-md">
                      {product.brand}
                    </span>
                  </div>

                  {/* PRODUCT DETAILS */}
                  <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                    <div>
                      {/* CATEGORY TAG */}
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-100">
                          {specs.category === 'GAMING' ? '🎮 Gaming' : specs.category === 'OLED' ? '🎨 Layar OLED' : specs.category === 'BUSINESS' ? '💼 Ultrabook' : specs.category === 'STUDENT' ? '🎓 Pelajar' : '💻 Laptop'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Garansi Resmi
                        </span>
                      </div>

                      {/* TITLE */}
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-sky-600 transition-colors">
                        {product.name}
                      </h4>

                      {/* SMART SPECS PILLS */}
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {specs.cpu && (
                          <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded flex items-center gap-1 max-w-full truncate">
                            <Cpu className="w-2.5 h-2.5 text-sky-600 shrink-0" />
                            <span className="truncate">{specs.cpu}</span>
                          </span>
                        )}
                        {specs.ram && (
                          <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded flex items-center gap-1">
                            <Layers className="w-2.5 h-2.5 text-indigo-600 shrink-0" />
                            <span>{specs.ram}</span>
                          </span>
                        )}
                        {specs.storage && (
                          <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded flex items-center gap-1">
                            <HardDrive className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                            <span>{specs.storage}</span>
                          </span>
                        )}
                        {specs.display && (
                          <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded flex items-center gap-1">
                            <Monitor className="w-2.5 h-2.5 text-purple-600 shrink-0" />
                            <span className="truncate">{specs.display}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* PRICING & CTA */}
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-xs text-slate-400 font-medium">Harga Resmi:</span>
                        {estimatedCicilan > 0 && (
                          <span className="text-[10px] font-semibold text-emerald-600">
                            Cicilan ~Rp {estimatedCicilan.toLocaleString('id-ID')}/bln
                          </span>
                        )}
                      </div>

                      <div className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        Rp {Number(product.price).toLocaleString('id-ID')}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                        }}
                        className="w-full mt-3 py-2 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <span>Lihat Detail & Bonus</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* LOAD MORE BUTTON */}
        {filteredProducts.length > showCount && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowCount(showCount + 24)}
              className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 mx-auto"
            >
              <span>Muat 24 Laptop Lainnya</span>
              <span className="text-xs font-normal opacity-80">
                (Tersisa {filteredProducts.length - showCount} unit)
              </span>
            </button>
          </div>
        )}

      </main>

      {/* 7. SOCIAL PROOF (GOOGLE REVIEWS 4.9★ HIGHLIGHT) */}
      <section id="ulasan" className="py-14 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="text-center px-4 py-2 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="text-4xl font-black text-amber-400 leading-none">4.9</div>
                  <div className="text-amber-400 text-xs mt-1">★★★★★</div>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    <Check className="w-3.5 h-3.5" /> Terverifikasi Google Reviews
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                    Dipercaya Pelanggan se-Bandung & Luar Kota
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Berdasarkan testimoni asli pembeli laptop di Laptop Square Istana BEC Lantai 1 Blok H16
                  </p>
                </div>
              </div>

              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 w-fit"
              >
                <span>Lihat Semua Ulasan di Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              </a>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
              {googleReviews.map((rev, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 text-white flex items-center justify-center font-bold text-xs">
                          {rev.name[0]}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{rev.name}</div>
                          <div className="text-[10px] text-slate-400">{rev.time}</div>
                        </div>
                      </div>
                      <span className="text-amber-400 text-xs">★★★★★</span>
                    </div>

                    <p className="text-xs text-slate-300 italic leading-relaxed">
                      "{rev.text}"
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                    <Check className="w-3 h-3 text-emerald-400" /> Pembeli Terverifikasi
                  </div>
                </div>
              ))}
            </div>

            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>

        </div>
      </section>

      {/* 8. TOKO FISIK BEC & PANDUAN PEMESANAN */}
      <section id="lokasi" className="py-14 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 flex flex-col gap-4">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                Kunjungi Toko Fisik Kami
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                Mau Cek & Tes Laptop Langsung? Datang ke Istana BEC Bandung!
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Anda bisa mencoba keyboard, mengecek keaslian garansi, dan berkonsultasi langsung dengan tim teknisi kami sebelum memutuskan membeli. Disediakan layanan unboxing bersama serta gratis instalasi software di tempat.
              </p>

              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200">
                  <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Alamat Lengkap Toko:</h5>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Istana BEC (Bandung Electronic Center) Lantai 1 Blok H16, Jl. Purnawarman No. 13-15, Babakan Ciamis, Kota Bandung.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200">
                  <Clock className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Jam Operasional:</h5>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Buka Setiap Hari (Senin — Minggu): 10:00 — 20:00 WIB.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>Buka Petunjuk Arah di Google Maps</span>
                </a>

                <a
                  href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent("Halo Laptop Square, saya mau tanya ancer-ancer lokasi toko di Istana BEC Lantai 1 Blok H16.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Tanya CS Lokasi Toko</span>
                </a>
              </div>
            </div>

            {/* GOOGLE MAPS EMBED OR CARD */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-slate-300 shadow-md bg-white p-2">
                <iframe
                  title="Peta Lokasi Laptop Square BEC"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.8988631165785!2d107.6087898!3d-6.9078216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e638090867fd%3A0x5b1dfccd504a25c5!2sLaptop%20Square%20BEC!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                  width="100%"
                  height="340"
                  style={{ border: 0, borderRadius: '12px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section id="faq" className="py-14 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
              Bantuan & Informasi
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Semua yang perlu Anda ketahui sebelum membeli laptop di Laptop Square Istana BEC
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 overflow-hidden transition-all bg-slate-50/50"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-sky-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-sky-600' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 10. PRODUCT DETAIL & ZOOM MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto border border-slate-200 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={() => {
                setSelectedProduct(null);
                setIsImageZoomed(false);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors font-bold z-20"
              aria-label="Tutup modal"
            >
              ✕
            </button>

            {/* MODAL IMAGE DISPLAY WITH ZOOM */}
            <div
              onClick={() => setIsImageZoomed(!isImageZoomed)}
              className={`w-full rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 flex items-center justify-center p-4 mb-6 relative cursor-pointer transition-all duration-300 ${
                isImageZoomed ? 'h-80 shadow-inner' : 'h-52'
              }`}
            >
              {getProductImage(selectedProduct) ? (
                <>
                  <img
                    src={getProductImage(selectedProduct)!}
                    alt={selectedProduct.name}
                    className={`max-w-full max-h-full object-contain transition-transform duration-300 ${
                      isImageZoomed ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  <span className="absolute bottom-3 right-3 text-[10px] font-bold px-2 py-1 rounded bg-slate-900/80 text-white backdrop-blur-sm">
                    {isImageZoomed ? '🔍 Perkecil Gambar' : '🔍 Klik untuk Memperbesar'}
                  </span>
                </>
              ) : (
                <div className="w-full h-full rounded-xl bg-slate-900 p-6 flex flex-col justify-between text-white">
                  <div className="text-xs font-mono text-slate-400">
                    LAPTOP SQUARE BEC • {selectedProduct.brand}
                  </div>
                  <div className="flex flex-col items-center">
                    <Laptop className="w-12 h-12 text-sky-400 mb-2" />
                    <span className="text-sm font-bold">{selectedProduct.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 text-center">
                    Unit Baru Garansi Resmi Indonesia
                  </div>
                </div>
              )}

              <span className="absolute top-3 left-3 text-[10px] font-black px-2.5 py-0.5 rounded-md bg-emerald-600 text-white">
                {String(selectedProduct.stock_status || 'Ready').toLowerCase() !== 'habis' ? '✓ READY STOCK BEC' : 'STATUS: KONFIRMASI'}
              </span>
            </div>

            {/* BRAND & PRODUCT TITLE */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                {selectedProduct.brand} Official
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                100% Garansi Resmi
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
              {selectedProduct.name}
            </h3>

            {/* PRICE & CICILAN */}
            <div className="flex flex-wrap items-baseline gap-3 my-3 pb-4 border-b border-slate-100">
              <div className="text-2xl sm:text-3xl font-black text-sky-600">
                Rp {Number(selectedProduct.price).toLocaleString('id-ID')}
              </div>
              <div className="text-xs font-bold text-slate-500">
                Simulasi Cicilan mulai <span className="text-emerald-600 font-extrabold">~Rp {Math.round((Number(selectedProduct.price) || 0) / 12).toLocaleString('id-ID')}/bln</span> (0%)
              </div>
            </div>

            {/* STRUCTURED SPECIFICATIONS GRID */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 mb-6">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-sky-600" />
                Spesifikasi & Kelengkapan:
              </h5>

              {(() => {
                const parsed = parseSpecs(selectedProduct.specs, selectedProduct.name, Number(selectedProduct.price) || 0);
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {parsed.cpu && (
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 font-medium block">Processor (CPU):</span>
                        <span className="font-bold text-slate-800">{parsed.cpu}</span>
                      </div>
                    )}
                    {parsed.ram && (
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 font-medium block">Memory (RAM):</span>
                        <span className="font-bold text-slate-800">{parsed.ram}</span>
                      </div>
                    )}
                    {parsed.storage && (
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 font-medium block">Penyimpanan (Storage):</span>
                        <span className="font-bold text-slate-800">{parsed.storage}</span>
                      </div>
                    )}
                    {parsed.display && (
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 font-medium block">Layar (Display):</span>
                        <span className="font-bold text-slate-800">{parsed.display}</span>
                      </div>
                    )}
                    {parsed.gpu && (
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 font-medium block">Kartu Grafis (GPU):</span>
                        <span className="font-bold text-slate-800">{parsed.gpu}</span>
                      </div>
                    )}
                    {parsed.os && (
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 font-medium block">Sistem Operasi / Office:</span>
                        <span className="font-bold text-slate-800">{parsed.os}</span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* RAW SPECS FALLBACK IF DETAILED */}
              <div className="mt-3 pt-3 border-t border-slate-200/80 text-[11px] text-slate-600 leading-relaxed font-mono">
                {String(selectedProduct.specs || '-')}
              </div>
            </div>

            {/* BONUS INFO */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
              <PackageCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900">
                <span className="font-bold block">Bonus Eksklusif Pembelian di Laptop Square BEC:</span>
                Gratis Tas Laptop Baru + Free Instalasi Windows Original & Software Siap Pakai (Office, Browser, PDF, Media Player).
              </div>
            </div>

            {/* WHATSAPP CTA ACTION */}
            <a
              href={getWhatsAppLink(selectedProduct)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Tanya Stok & Beli via WhatsApp</span>
            </a>

            <p className="text-[10px] text-slate-400 text-center mt-2.5">
              Unit bisa diambil langsung di Istana BEC Lantai 1 Blok H16 atau dikirim ke seluruh Indonesia.
            </p>
          </div>
        </div>
      )}

      {/* 11. FOOTER E-COMMERCE LENGKAP */}
      <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
            
            {/* BRAND PROFILE */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={LOGO_URL}
                  alt="Laptop Square"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800"
                />
                <span className="text-lg font-black text-white tracking-tight">
                  LAPTOP <span className="text-sky-400">SQUARE</span>
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-sm">
                Pusat retail laptop baru bergaransi resmi terlengkap di Bandung. Melayani pembelian offline di toko Istana BEC Lantai 1 Blok H16 dan online dengan pengiriman aman ke seluruh Nusantara.
              </p>
              <div className="text-[11px] text-slate-500">
                © {new Date().getFullYear()} LAPTOP SQUARE BEC. All rights reserved.
              </div>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h5 className="text-sm font-bold text-white mb-3">Tautan Cepat</h5>
              <ul className="flex flex-col gap-2">
                <li><button onClick={scrollToCatalog} className="hover:text-sky-400 transition-colors">Katalog Lengkap</button></li>
                <li><a href="#kategori" className="hover:text-sky-400 transition-colors">Panduan Memilih Laptop</a></li>
                <li><a href="#ulasan" className="hover:text-sky-400 transition-colors">Ulasan Pelanggan 4.9★</a></li>
                <li><a href="#lokasi" className="hover:text-sky-400 transition-colors">Lokasi Toko Istana BEC</a></li>
                <li><a href="#faq" className="hover:text-sky-400 transition-colors">Tanya Jawab (FAQ)</a></li>
              </ul>
            </div>

            {/* BRAND RESMI */}
            <div>
              <h5 className="text-sm font-bold text-white mb-3">Brand Resmi</h5>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {['ASUS', 'LENOVO', 'HP', 'ACER', 'APPLE', 'MSI', 'AXIOO', 'ADVAN', 'ZYREX', 'COLORFUL'].map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      setSelectedBrand(b);
                      scrollToCatalog();
                    }}
                    className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* STORE CONTACT & HOURS */}
            <div>
              <h5 className="text-sm font-bold text-white mb-3">Toko Fisik & Kontak</h5>
              <div className="flex flex-col gap-2 text-[11px] leading-relaxed">
                <p>
                  📍 <strong className="text-slate-300">Istana BEC Lantai 1 Blok H16</strong><br />
                  Jl. Purnawarman No. 13-15, Bandung
                </p>
                <p>
                  🕒 <strong className="text-slate-300">Buka Setiap Hari:</strong><br />
                  10:00 — 20:00 WIB
                </p>
                <p>
                  💬 <strong className="text-slate-300">WhatsApp CS:</strong><br />
                  <a href={`https://wa.me/${WA_PHONE}`} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">
                    +62 821-1089-8948
                  </a>
                </p>
              </div>
            </div>

          </div>

          {/* PAYMENT & TRUST BADGES */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-semibold text-slate-400">Metode Pembayaran:</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">QRIS</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">Transfer BCA / Mandiri / BRI</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">Kartu Kredit Cicilan 0%</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">PayLater Terpercaya</span>
            </div>
            <div>
              Designed with modern Next.js & Tailwind CSS for Laptop Square BEC
            </div>
          </div>

        </div>
      </footer>

      {/* 12. FLOATING WHATSAPP BUTTON (BOTTOM RIGHT) */}
      <a
        href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent("Halo Laptop Square BEC, saya butuh bantuan rekomendasi laptop.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 group flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-2xl shadow-emerald-950 transition-all hover:scale-105 active:scale-95"
        aria-label="Hubungi WhatsApp Laptop Square"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageCircle className="w-5 h-5 fill-white" />
        <span className="hidden sm:inline">Konsultasi CS BEC</span>
      </a>

    </div>
  );
}
