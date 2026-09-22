"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    async function getProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error("Gagal mengambil data:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }
    getProducts();
  }, []);

  const brands = ['ALL', 'Lenovo', 'HP', 'Acer', 'ASUS', 'MSI', 'Apple'];
  const filteredProducts = selectedBrand === 'ALL' 
    ? products 
    : products.filter(p => p.brand?.toLowerCase() === selectedBrand.toLowerCase());

  const heroProduct = products[0];
  const mapsUrl = "https://www.google.com/maps/place/Laptop+Square+BEC/@-6.9078216,107.6087898,17z/data=!3m1!4b1!4m6!3m5!1s0x2e68e638090867fd:0x5b1dfccd504a25c5!8m2!3d-6.9078216!4d107.6087898!16s%2Fg%2F1pzwhkpd7?entry=ttu";

  // Helper untuk mengubah string spesifikasi dengan garis miring '/' menjadi daftar poin rapi
  const renderSpecs = (specsData: any) => {
    if (!specsData) return "Hubungi tim Laptop Square untuk detail ketersediaan varian spesifikasi lengkap.";
    
    let specsText = "";
    if (typeof specsData === 'string') {
      specsText = specsData;
    } else if (typeof specsData === 'object') {
      specsText = Object.entries(specsData).map(([key, val]) => `${key}: ${val}`).join(' / ');
    } else {
      specsText = String(specsData);
    }

    // Memecah teks spesifikasi berdasarkan pemisah '/'
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif', paddingBottom: '60px' }}>
      {/* Banner Berjalan (Marquee Info Promo) */}
      <div style={{ backgroundColor: '#0284c7', color: 'white', fontSize: '13px', fontWeight: '500', overflow: 'hidden', whiteSpace: 'nowrap', padding: '8px 0' }}>
        <div style={{ display: 'inline-block', paddingLeft: '100%', animation: 'marquee 25s linear infinite' }}>
          🔥 Selamat datang di Laptop Square BEC Bandung! | Cicilan 0% / Kredit Mudah | Free Install & Bonus Tas | Stok Ready & Bergaransi Resmi 🚀
        </div>
      </div>
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-100%, 0); }
        }
      `}</style>

      {/* Top Header dengan Logo & Maps */}
      <header style={{ backgroundColor: '#0f172a', color: 'white', padding: '16px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          {/* Logo & Nama Toko */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img 
                src="https://mugcnbapivtaplnjzuvq.supabase.co/storage/v1/object/public/products/logo%20ls.jpg" 
                alt="Logo Laptop Square" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
              />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#38bdf8', letterSpacing: '0.5px' }}>LAPTOP SQUARE</h1>
              <a 
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ margin: '2px 0 0 0', color: '#94a3b8', fontSize: '11px', textDecoration: 'none', display: 'block' }}
              >
                📍 Istana BEC Lantai 1 Blok H16, Bandung <span style={{ color: '#38bdf8', textDecoration: 'underline' }}>(Klik Peta)</span>
              </a>
            </div>
          </div>

          {/* Tombol Aksi Kanan (Maps & WA) */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <a 
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '9px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}
            >
              🗺️ Google Maps
            </a>
            <a 
              href="https://wa.me/6282110898948?text=Halo%20Laptop%20Square,%20saya%20mau%20tanya%20stok" 
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: '#25d366', color: 'white', padding: '9px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section style={{ backgroundColor: '#1e293b', color: 'white', padding: '40px 20px', marginBottom: '30px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 500px' }}>
            <span style={{ backgroundColor: '#0284c7', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Pusat Laptop & Gadget Bandung
            </span>
            <h2 style={{ fontSize: '32px', margin: '15px 0 10px 0', lineHeight: '1.2' }}>
              Temukan Laptop Impian Kerja, Gaming & Desain
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '15px', margin: '0 0 20px 0', lineHeight: '1.5' }}>
              Garansi resmi, pelayanan konsultasi ramah, dan siap ambil di BEC Lantai 1 Blok H16. Konsultasikan kebutuhan spesifikasi Anda langsung via WhatsApp.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a 
                href="https://wa.me/6282110898948?text=Halo%20Laptop%20Square,%20mau%20konsultasi%20pilih%20laptop" 
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: '#38bdf8', color: '#0f172a', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}
              >
                Konsultasi Sekarang
              </a>
              <a 
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid #475569', padding: '12px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}
              >
                Kunjungi Toko (BEC)
              </a>
            </div>
          </div>

          {/* Featured Showcase Card on Hero */}
          {heroProduct && (
            <div 
              onClick={() => setSelectedProduct(heroProduct)}
              style={{ flex: '0 1 300px', backgroundColor: 'white', color: '#0f172a', borderRadius: '12px', padding: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', cursor: 'pointer' }}
            >
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#0284c7', textTransform: 'uppercase' }}>Spotlight Produk (Klik Detail)</span>
              <div style={{ width: '100%', height: '140px', backgroundColor: '#ffffff', borderRadius: '8px', margin: '10px 0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', border: '1px solid #f1f5f9' }}>
                {heroProduct.image_url ? (
                  <img src={heroProduct.image_url} alt={heroProduct.name} style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain' }} />
                ) : (
                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>{heroProduct.brand}</span>
                )}
              </div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', lineHeight: '1.3' }}>{heroProduct.name}</h4>
              <p style={{ margin: '0 0 12px 0', fontWeight: 'bold', color: '#0f172a', fontSize: '15px' }}>
                Rp {Number(heroProduct.price).toLocaleString('id-ID')}
              </p>
              <button 
                style={{ width: '100%', backgroundColor: '#0f172a', color: 'white', padding: '8px', borderRadius: '6px', border: 'none', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Lihat Spesifikasi & Stok
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Container / Katalog */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Katalog Produk Pilihan</h3>
          
          {/* Filter Brand */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '16px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: selectedBrand === brand ? '#0f172a' : 'white',
                  color: selectedBrand === brand ? 'white' : '#475569',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px',
                  whiteSpace: 'nowrap'
                }}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Katalog */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#64748b', marginTop: '50px' }}>Memuat katalog produk...</p>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', backgroundColor: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <p style={{ color: '#64748b', margin: 0 }}>Belum ada produk untuk kategori merek ini.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '20px' }}>
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                onClick={() => setSelectedProduct(product)}
                style={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '10px', 
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ width: '100%', height: '150px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '10px', borderBottom: '1px solid #f1f5f9' }}>
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>{product.brand || 'Laptop'}</span>
                  )}
                </div>

                <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex 1, justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#0284c7', textTransform: 'uppercase' }}>
                      {product.brand || 'General'}
                    </span>
                    <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a', margin: '4px 0 8px 0', lineHeight: '1.3' }}>
                      {product.name}
                    </h3>
                  </div>

                  <div>
                    <p style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 10px 0' }}>
                      Rp {Number(product.price).toLocaleString('id-ID')}
                    </p>
                    <button 
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Lihat Detail & Stok
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* POP-UP MODAL SPESIFIKASI PRODUK */}
      {selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', maxWidth: '500px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            
            {/* Tombol Tutup X */}
            <button 
              onClick={() => setSelectedProduct(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 'bold', color: '#64748b', fontSize: '16px' }}
            >
              ✕
            </button>

            {/* Gambar Modal */}
            <div style={{ height: '200px', backgroundColor: '#ffffff', borderRadius: '8px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9', marginBottom: '16px' }}>
              {selectedProduct.image_url ? (
                <img src={selectedProduct.image_url} alt={selectedProduct.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              ) : (
                <span style={{ color: '#94a3b8' }}>{selectedProduct.brand}</span>
              )}
            </div>

            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#0284c7', textTransform: 'uppercase' }}>{selectedProduct.brand}</span>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', margin: '4px 0 10px 0' }}>{selectedProduct.name}</h2>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb', margin: '0 0 16px 0' }}>
              Rp {Number(selectedProduct.price).toLocaleString('id-ID')}
            </p>

            {/* Spesifikasi Teks */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#0f172a', fontWeight: 'bold' }}>📋 Spesifikasi Utama:</h4>
              {renderSpecs(selectedProduct.specs)}
            </div>

            {/* Tombol Aksi WA */}
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