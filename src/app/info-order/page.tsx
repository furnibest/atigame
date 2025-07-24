import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyCheckAlt, faTruck, faCheckCircle, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

const steps = [
  { icon: faCheckCircle, title: 'Pilih Produk', desc: 'Pilih produk yang diinginkan dari halaman produk.' },
  { icon: faWhatsapp, title: 'Hubungi Admin', desc: 'Klik tombol WhatsApp di produk atau chat admin untuk konsultasi, tanya stok, atau custom order.' },
  { icon: faMoneyCheckAlt, title: 'Pembayaran', desc: 'Lakukan pembayaran sesuai instruksi admin.' },
  { icon: faCheckCircle, title: 'Konfirmasi', desc: 'Konfirmasi pembayaran ke admin via WhatsApp.' },
  { icon: faTruck, title: 'Pengiriman', desc: 'Produk diproses & dikirim ke alamat Anda.' }
]

export default function InfoOrderPage() {
  return (
      <div className="infoorder-page">
        <div 
          className="infoorder-hero" 
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url(/images/heroip.jpg)`,
            height: '100vh',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: 'white',
            paddingTop: '70px'
          }}
        >
          <div>
            <h1 className="infoorder-title" style={{fontSize: '3rem', marginBottom: '1rem'}}>Info Pemesanan</h1>
            <p className="infoorder-subtitle" style={{fontSize: '1.2rem'}}>Panduan lengkap cara memesan produk furniture outdoor di toko kami</p>
          </div>
        </div>
        
        <div className="infoorder-content" style={{padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto'}}>
          <section className="infoorder-section" style={{marginBottom: '4rem'}}>
            <h2 style={{textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem', color: '#333'}}>Langkah Pemesanan</h2>
            <div className="infoorder-steps-bar" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap'}}>
              {steps.map((step, idx) => (
                <div key={step.title} style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  <div className="infoorder-step" style={{textAlign: 'center', maxWidth: '200px'}}>
                    <div className="infoorder-step-icon" style={{fontSize: '2rem', color: '#8B4513', marginBottom: '1rem'}}>
                      <FontAwesomeIcon icon={step.icon} />
                    </div>
                    <div className="infoorder-step-title" style={{fontWeight: 'bold', marginBottom: '0.5rem', color: '#333'}}>{step.title}</div>
                    <div className="infoorder-step-desc" style={{fontSize: '0.9rem', color: '#666', lineHeight: '1.4'}}>{step.desc}</div>
                  </div>
                  {idx < steps.length-1 && (
                    <div className="infoorder-step-arrow" style={{fontSize: '1.5rem', color: '#8B4513', margin: '0 1rem'}}>→</div>
                  )}
                </div>
              ))}
            </div>
          </section>
          
          <div className="infoorder-card-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem'}}>
            <div className="infoorder-card" style={{background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
              <div className="infoorder-card-icon" style={{fontSize: '2rem', color: '#8B4513', marginBottom: '1rem'}}>
                <FontAwesomeIcon icon={faMoneyCheckAlt} />
              </div>
              <h3 style={{marginBottom: '1rem', color: '#333'}}>Pembayaran</h3>
              <ul style={{marginBottom: '1rem', paddingLeft: '1rem'}}>
                <li style={{marginBottom: '0.5rem'}}><b>Bank BCA</b> a.n. Yayuk Indah Ariyanti - <b>2470389349</b></li>
                <li><b>Bank BRI</b> a.n. Yayuk Indah Ariyanti - <b>589701021450539</b></li>
              </ul>
              <div className="infoorder-note" style={{fontSize: '0.9rem', color: '#666', fontStyle: 'italic'}}>
                * Pastikan transfer ke rekening atas nama PT. Atiga Furniture. Simpan bukti transfer untuk konfirmasi.
              </div>
            </div>
            
            <div className="infoorder-card" style={{background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
              <div className="infoorder-card-icon" style={{fontSize: '2rem', color: '#8B4513', marginBottom: '1rem'}}>
                <FontAwesomeIcon icon={faTruck} />
              </div>
              <h3 style={{marginBottom: '1rem', color: '#333'}}>Pengiriman</h3>
              <ul style={{paddingLeft: '1rem'}}>
                <li style={{marginBottom: '0.5rem'}}>Pengiriman dari Jepara, Jawa Tengah.</li>
                <li style={{marginBottom: '0.5rem'}}>Ekspedisi: ekspedisi lokal yang mengarah ke kota tujuan.</li>
                <li style={{marginBottom: '0.5rem'}}>Estimasi waktu pengiriman: 2-7 hari (tergantung kota tujuan).</li>
                <li>Produk dikemas aman dan diasuransikan.</li>
              </ul>
            </div>
            
            <div className="infoorder-card infoorder-card-contact" style={{background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
              <div className="infoorder-card-icon" style={{fontSize: '2rem', color: '#8B4513', marginBottom: '1rem'}}>
                <FontAwesomeIcon icon={faWhatsapp} />
              </div>
              <h3 style={{marginBottom: '1rem', color: '#333'}}>Butuh Bantuan?</h3>
              <p style={{marginBottom: '1rem', color: '#666'}}>
                Hubungi admin via WhatsApp:<br />
                <a href="https://wa.me/085291413603" target="_blank" rel="noopener noreferrer" style={{color: '#25D366', textDecoration: 'none'}}>
                  085291413603
                </a>
              </p>
              <div className="infoorder-card-icon" style={{fontSize: '2rem', color: '#8B4513', marginBottom: '1rem'}}>
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <p style={{color: '#666'}}>Email: atigameubel@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
  );
}