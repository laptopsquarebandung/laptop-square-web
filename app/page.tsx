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
          height: isImageZoomed ? '340px' : '200px', // Otomatis membesar saat diklik
          backgroundColor: '#ffffff', 
          borderRadius: '12px', 
          border: isImageZoomed ? '2px solid #38bdf8' : '1px solid #e2e8f0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: isImageZoomed ? '20px' : '10px', 
          marginBottom: '16px', 
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.3s ease-in-out',
          boxShadow: isImageZoomed ? '0 10px 25px rgba(0,0,0,0.1)' : 'none'
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
                transform: isImageZoomed ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.3s ease-in-out'
              }} 
            />
            <span style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: 'rgba(15, 23, 42, 0.75)', color: 'white', fontSize: '11px', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold' }}>
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