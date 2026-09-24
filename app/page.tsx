"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isImageZoomed, setIsImageZoomed] = useState(false); // State untuk kontrol besar gambar
  const [currentSlide, setCurrentSlide] = useState(0);

  const mapsUrl = "https://www.google.com/maps/place/Laptop+Square+BEC/@-6.9078216,107.6087898,17z/data=!3m1!4b1!4m6!3m5!1s0x2e68e638090867fd:0x5b1dfccd504a25c5!8m2!3d-6.9078216!4d107.6087898!16s%2Fg%2F1pzwhkpd7?entry=ttu";

  const brands = ['ALL', 'Lenovo', 'HP', 'Acer', 'ASUS', 'MSI', 'Apple', 'Axioo', 'Advan', 'Zyrex', 'Colorful'];

  const banners = [
    {
      type: "image",
      mediaUrl: "", 
      title: "PROMO SPESIAL LAPTOP SQUARE BEC",
      subtitle: "Bebas Pilih Bonus Aksesoris & Garansi Resmi!",
      tag: "PROMO BEC",
      bg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      accent: "#38bdf8"
    },
    {
      type: "image",
      mediaUrl: "", 
      title: "PUSAT SERVICE & UPGRADE LAPTOP BANDUNG",
      subtitle: "Pengerjaan Cepat, Transparan & Bergaransi",
      tag: "SERVICE CENTER BEC",
      bg: "linear-gradient(135deg, #0284c7 0%, #0f172a 100%)",
      accent: "#facc15"
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
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    async function getProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error("Gagal mengambil data:", error);
      } else if (data && data.length > 0) {
        setAllProducts(data);
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        setDisplayedProducts(shuffled.slice(0, 8));
      }
      setLoading(false);
    }
    getProducts();
  }, []);

  const handleSelectBrand = (brand: string) => {
    setSelectedBrand(brand);
    if (brand === 'ALL') {
      const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
      setDisplayedProducts(shuffled.slice(0, 8));
    } else {
      const filtered = allProducts.filter(p => p.brand?.toLowerCase() === brand.toLowerCase());
      setDisplayedProducts(filtered);
    }
  };

  const renderSpecs = (specsData: any) => {
    if (!specsData) return "Hubungi tim Laptop Square untuk detail ketersediaan varian spesifikasi lengkap.";
    let specsText = typeof specsData === 'string' ? specsData : String(specsData);
    const items = specsText.split('/').map(item => item.trim()).filter(Boolean);

    return (
      <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map((item, idx) => (
          <li key={idx} style={{ fontSize: '13px', color: '#334155', lineHeight: '1.4' }}>
            {item}
          </li>
        ))}
      </ul>
    );
  };

  const getProductImage = (product: any) => {
    if (product.image_url) return product.image_url;
    if (product.slug) {
      return `https://mugcnbapivtaplnjzuvq.supabase.co/storage/v1/object/public/products/${product.slug}.jpg`;
    }
    return null;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif', paddingBottom: '60px' }}>
      
      {/* 1. TOP MARQUEE BANNER */}
      <div style={{ backgroundColor: '#0284c7', color: 'white', fontSize: '12px', fontWeight: '500', overflow: 'hidden', whiteSpace: 'nowrap', padding: '6px 0' }}>
        <div style={{ display: 'inline-block', paddingLeft: '100%', animation: 'marquee 25s linear infinite' }}>
          🔥 Laptop Square Istana BEC Lantai 1 Blok H16 Bandung | Promo Cicilan 0% | Free Bonus Tas & Install Aplikasi 🚀
        </div>
      </div>
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-100%, 0); }
        }
      `}</style>

      {/* HEADER */}
      <header style={{ backgroundColor: '#0f172a', color: 'white', padding: '16px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img 
              src="https://mugcnbapivtaplnjzuvq.supabase.co/storage/v1/object/public/products/logo%20ls.jpg" 
              alt="Logo Laptop Square" 
              style={{ width: '55px', height: '55px', borderRadius: '8px', objectFit: 'contain' }} 
            />
            <div>
              <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#38bdf8' }}>LAPTOP SQUARE</h1>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ margin: '2px 0 0 0', color: '#94a3b8', fontSize: '11px', textDecoration: 'none' }}>
                📍 Istana BEC Lantai 1 Blok H16, Bandung <span style={{ color: '#38bdf8' }}>(Klik Maps)</span>
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '8px 12px', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>
              🗺️ Google Maps
            </a>
            <a href="https://wa.me/6282110898948?text=Halo%20Laptop%20Square" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#25d366', color: 'white', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>
              💬 WhatsApp
            </a>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '20px auto 0 auto', padding: '0 20px' }}>
        
        {/* 2. ROLLING BANNER */}
        <section style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', marginBottom: '30px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
          {banners[currentSlide].mediaUrl ? (
            banners[currentSlide].type === "video" ? (
              <video src={banners[currentSlide].mediaUrl} autoPlay loop muted style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
            ) : (
              <img src={banners[currentSlide].mediaUrl} alt="Banner Promo" style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
            )
          ) : (
            <div style={{ background: banners[currentSlide].bg, color: 'white', padding: '40px 30px', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: banners[currentSlide].accent, width: 'fit-content', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', marginBottom: '12px' }}>
                {banners[currentSlide].tag}
              </span>
              <h2 style={{ fontSize: '28px', margin: '0 0 8px 0', fontWeight: '800' }}>{banners[currentSlide].title}</h2>
              <p style={{ color: '#cbd5e1', fontSize: '15px', margin: '0 0 20px 0' }}>{banners[currentSlide].subtitle}</p>
              <a href="https://wa.me/6282110898948?text=Halo%20Laptop%20Square,%20mau%20tanya%20promo" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: banners[currentSlide].accent, color: '#0f172a', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', width: 'fit-content', fontSize: '13px' }}>
                Klaim Promo Sekarang 🚀
              </a>
            </div>
          )}
          
          <div style={{ position: 'absolute', bottom: '15px', right: '20px', display: 'flex', gap: '6px' }}>
            {banners.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentSlide(idx)}
                style={{ width: idx === currentSlide ? '24px' : '8px', height: '8px', borderRadius: '4px', border: 'none', backgroundColor: idx === currentSlide ? '#38bdf8' : '#64748b', cursor: 'pointer', transition: 'all 0.3s' }}
              />
            ))}
          </div>
        </section>

        {/* 3. HIGHLIGHT 3 GOOGLE REVIEWS */}
        <section style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', marginBottom: '35px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ textAlign: 'center', paddingRight: '15px', borderRight: '2px solid #f1f5f9' }}>
                <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#0f172a', display: 'block', lineHeight: '1' }}>4.9</span>
                <span style={{ color: '#f59e0b', fontSize: '16px' }}>★★★★★</span>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>BAGUS SEKALI</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>Berdasarkan ulasan pelanggan asli di <strong>Google Reviews</strong></p>
              </div>
            </div>

            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>
              Lihat Semua Ulasan Google ↗
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
            {googleReviews.map((rev, idx) => (
              <div key={idx} style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#0284c7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                      {rev.name[0]}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '12px', fontWeight: 'bold', color: '#0f172a' }}>{rev.name}</h4>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>{rev.time}</span>
                    </div>
                  </div>
                  <span style={{ color: '#f59e0b', fontSize: '12px' }}>★★★★★</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: '1.4', fontStyle: 'italic' }}>
                  "{rev.text}"
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. KATALOG PRODUK */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#0f172a' }}>⭐ Produk Pilihan & Rekomendasi</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                {selectedBrand === 'ALL' ? 'Menampilkan 8 produk rekomendasi acak' : `Menampilkan produk merek ${selectedBrand}`}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px', maxWidth: '100%' }}>
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => handleSelectBrand(brand)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '16px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: selectedBrand === brand ? '#0f172a' : 'white',
                    color: selectedBrand === brand ? 'white' : '#475569',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '12px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#64748b', margin: '40px 0' }}>Memuat produk...</p>
          ) : displayedProducts.length === 0 ? (
            <div style={{ textAlign: 'center', backgroundColor: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <p style={{ color: '#64748b', margin: 0 }}>Belum ada produk untuk merek {selectedBrand}.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '20px' }}>
              {displayedProducts.map((product) => {
                const img = getProductImage(product);
                return (
                  <div 
                    key={product.id} 
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsImageZoomed(false);
                    }}
                    style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
                  >
                    <div style={{ height: '140px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', borderBottom: '1px solid #f1f5f9' }}>
                      {img ? (
                        <img src={img} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 'bold' }}>{product.brand}</span>
                      )}
                    </div>

                    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#0284c7', textTransform: 'uppercase' }}>{product.brand}</span>
                        <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', margin: '4px 0 8px 0', lineHeight: '1.3' }}>{product.name}</h4>
                      </div>

                      <div>
                        <p style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 10px 0' }}>
                          Rp {Number(product.price).toLocaleString('id-ID')}
                        </p>
                        <button style={{ width: '100%', backgroundColor: '#0f172a', color: 'white', padding: '8px', borderRadius: '6px', border: 'none', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                          Lihat Detail & Promo
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>

      {/* MODAL SPESIFIKASI DENGAN GAMBAR INTERAKTIF ZOOM */}
      {selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', maxWidth: '520px', width: '100%', padding: '24px', boxShadow: '0 20px 25px rgba(0, 0, 0, 0.3)', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <button 
              onClick={() => {
                setSelectedProduct(null);
                setIsImageZoomed(false);
              }} 
              style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 'bold', color: '#64748b', fontSize: '14px', zIndex: 10 }}
            >
              ✕
            </button>

            {/* KOTAK GAMBAR PRODUK - DIKLIK UNTUK DIZOOM / DIPERBESAR */}
            <div 
              onClick={() => setIsImageZoomed(!isImageZoomed)}
              style={{ 
                width: '100%', 
                height: isImageZoomed ? '320px' : '180px', // Otomatis membesar saat diklik
                backgroundColor: '#ffffff', 
                borderRadius: '12px', 
                border: isImageZoomed ? '2px solid #38bdf8' : '1px solid #e2e8f0', 
                display: 'flex', 
                alignItems: 'center', 
                justify: 'center', 
                padding: isImageZoomed ? '20px' : '10px', 
                marginBottom: '16px', 
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s ease-in-out',
                boxShadow: isImageZoomed ? '0 10px 20px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              {getProductImage(selectedProduct) ? (
                <>
                  <img 
                    src={getProductImage(selectedProduct)!} 
                    alt={selectedProduct.name} 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%', 
                      objectFit: 'contain',
                      transform: isImageZoomed ? 'scale(1.05)' : 'scale(1)',
                      transition: 'transform 0.3s ease-in-out'
                    }} 
                  />
                  <span style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(15, 23, 42, 0.7)', color: 'white', fontSize: '10px', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                    {isImageZoomed ? '🔍 Klik untuk Mengecilkan' : '🔍 Klik untuk Membesar'}
                  </span>
                </>
              ) : (
                <span style={{ color: '#94a3b8', fontSize: '16px', fontWeight: 'bold' }}>{selectedProduct.brand}</span>
              )}
            </div>

            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#0284c7', textTransform: 'uppercase' }}>{selectedProduct.brand}</span>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', margin: '4px 0 8px 0' }}>{selectedProduct.name}</h2>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb', margin: '0 0 16px 0' }}>
              Rp {Number(selectedProduct.price).toLocaleString('id-ID')}
            </p>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#0f172a', fontWeight: 'bold' }}>📋 Spesifikasi Utama:</h4>
              {renderSpecs(selectedProduct.specs)}
            </div>

            <a 
              href={`https://wa.me/6282110898948?text=Halo%20Laptop%20Square,%20saya%20tertarik%20dengan%20${encodeURIComponent(selectedProduct.name)}%20(Rp%20${Number(selectedProduct.price).toLocaleString('id-ID')}).%20Apakah%20stok%20ready%20di%20BEC?`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', textAlign: 'center', backgroundColor: '#25d366', color: 'white', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}
            >
              💬 Tanya Stok & Beli via WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}