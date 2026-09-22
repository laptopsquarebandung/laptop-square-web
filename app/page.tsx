"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('ALL');

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

      {/* Top Header dengan Logo */}
      <header style={{ backgroundColor: '#0f172a', color: 'white', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Logo Laptop Square (Ganti URL src dengan link logo online atau file /logo.png di folder public) */}
          <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img 
              src="https://mugcnbapivtaplnjzuvq.supabase.co/storage/v1/object/public/products/ok-dua-26.png" 
              alt="Logo" 
              style={{ width: '80%', height: '80%', objectFit: 'contain' }} 
              onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
            />
            {/* Fallback ikon huruf LS jika logo belum ada */}
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#38bdf8', position: 'absolute' }}>LS</span>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#38bdf8', letterSpacing: '0.5px' }}>LAPTOP SQUARE</h1>
            <p style={{ margin: '2px 0 0 0', color: '#94a3b8', fontSize: '12px' }}>Istana BEC Lantai 1 Blok H16, Bandung</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#cbd5e1', display: 'none' }} className="md:inline">📞 082110898948</span>
          <a 
            href="https://wa.me/6282110898948?text=Halo%20Laptop%20Square,%20saya%20mau%20tanya%20stok" 
            target="_blank"
            style={{ backgroundColor: '#25d366', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}
          >
            WhatsApp
          </a>
        </div>
      </header>

      {/* Hero Banner ala ELS / Store Besar */}
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
            <div style={{ display: 'flex', gap: '12px' }}>
              <a 
                href="https://wa.me/6282110898948?text=Halo%20Laptop%20Square,%20mau%20konsultasi%20pilih%20laptop" 
                target="_blank"
                style={{ backgroundColor: '#38bdf8', color: '#0f172a', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}
              >
                Konsultasi Sekarang
              </a>
            </div>
          </div>

          {/* Featured Showcase Card on Hero */}
          {heroProduct && (
            <div style={{ flex: '0 1 300px', backgroundColor: 'white', color: '#0f172a', borderRadius: '12px', padding: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#0284c7', textTransform: 'uppercase' }}>Spotlight Produk</span>
              <div style={{ width: '100%', height: '140px', backgroundColor: '#ffffff', borderRadius: '8px', margin: '10px 0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', border: '1px solid #f1f5f9', position: 'relative' }}>
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
              <a 
                href={`https://wa.me/6282110898948?text=Halo%20Laptop%20Square,%20saya%20tertarik%20dengan%20spotlight%20${encodeURIComponent(heroProduct.name)}`}
                target="_blank"
                style={{ display: 'block', textAlign: 'center', backgroundColor: '#0f172a', color: 'white', padding: '8px', borderRadius: '6px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}
              >
                Tanya Stok WA
              </a>
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
                style={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '10px', 
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ width: '100%', height: '150px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '10px', borderBottom: '1px solid #f1f5f9', position: 'relative' }}>
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>{product.brand || 'Laptop'}</span>
                  )}
                </div>

                <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
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
                    <a 
                      href={`https://wa.me/6282110898948?text=Halo%20Laptop%20Square,%20saya%20tertarik%20dengan%20${encodeURIComponent(product.name)}.%20Apakah%20ready?`}
                      target="_blank"
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      Tanya Stok via WA
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}