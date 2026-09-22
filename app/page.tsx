"use client"; // Baris ini penting agar halaman bisa mengambil data secara langsung

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // Memanggil jembatan yang kita buat tadi

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fungsi untuk mengambil data dari tabel 'products' di Supabase
    async function getProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        console.error("Gagal mengambil data:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false); // Selesai loading
    }

    getProducts();
  }, []);

  return (
    <main style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>LAPTOP SQUARE</h1>
      <p>Istana BEC Lantai 1 Blok H16, Bandung</p>
      <p>WhatsApp: 082110898948</p>

      <a 
        href="https://wa.me/6282110898948?text=Halo%20Laptop%20Square,%20saya%20mau%20tanya%20stok" 
        target="_blank"
        style={{
          display: 'inline-block',
          backgroundColor: '#25D366',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '5px',
          textDecoration: 'none',
          fontWeight: 'bold',
          marginTop: '10px',
          marginBottom: '30px'
        }}
      >
        Hubungi via WhatsApp
      </a>

      <h2>Katalog Laptop</h2>
      
      {loading ? (
        <p>Sedang memuat data laptop...</p>
      ) : products.length === 0 ? (
        <p>Belum ada laptop di database. Silakan tambah data di website Supabase.</p>
      ) : (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {products.map((product) => (
            <div key={product.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', width: '220px' }}>
              <h3 style={{ marginTop: '0' }}>{product.name}</h3>
              <p style={{ color: 'blue', fontWeight: 'bold' }}>
                Rp {Number(product.price).toLocaleString('id-ID')}
              </p>
              
              <a 
                href={`https://wa.me/6282110898948?text=Halo%20Laptop%20Square,%20saya%20tertarik%20dengan%20${product.name}.%20Apakah%20stoknya%20ready?`}
                target="_blank"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '8px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >
                Tanya Stok WA
              </a>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}