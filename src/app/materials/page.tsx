import React from 'react'

const woods = [
  {
    name: 'Kayu Jati',
    image: '/images/jati.jpg',
    desc: 'Kayu jati terkenal sangat kuat, tahan cuaca, dan memiliki serat indah. Pilihan utama untuk furniture outdoor premium.'
  }
]

const rattans = [
  {
    name: 'Rotan Alami',
    image: '/images/rotan alami.jpg',
    desc: 'Rotan asli dari alam, serat kuat dan fleksibel, cocok untuk nuansa natural.'
  },
  {
    name: 'Rotan Sintetis',
    image: '/images/rotan sistesis.jpg',
    desc: 'Rotan buatan dari plastik khusus, tahan cuaca dan mudah dibersihkan.'
  }
]

const fabrics = [
  {
    name: 'Kain Parasit',
    image: '/images/Parasit.jpeg',
    desc: 'Kain parasit ringan, tipis, dan tahan air, cocok untuk pelapis luar.'
  },
  {
    name: 'Kain Kantata',
    image: '/images/Kantata.jpeg',
    desc: 'Kain kanvas tebal, kuat, dan tahan lama, cocok untuk outdoor.'
  },
  {
    name: 'Kain Unione',
    image: '/images/Union.jpeg',
    desc: 'Kain unione lembut, nyaman, dan memiliki tekstur halus.'
  },
  {
    name: 'Kain Nagata',
    image: '/images/Nagata.jpeg',
    desc: 'Kain nagata terkenal kuat, awet, dan banyak digunakan untuk seragam.'
  },
  {
    name: 'Kain SR 10',
    image: '/images/SR 10.jpeg',
    desc: 'Kain SR 10 adalah kain sintetis dengan daya tahan tinggi dan warna cerah.'
  }
]

export default function MaterialsPage() {
  return (
    <div className="materials-page">
        <div className="materials-hero">
          <div>
            <h1 className="materials-title" style={{fontSize: '3rem', marginBottom: '1rem'}}>Bahan & Material</h1>
            <p className="materials-subtitle" style={{fontSize: '1.2rem'}}>Pilih bahan terbaik untuk furniture outdoor Anda</p>
          </div>
        </div>
        
        <div className="materials-content" style={{padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto'}}>
          <section className="materials-section" style={{marginBottom: '4rem'}}>
            <h2 style={{textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem', color: '#333'}}>Kayu</h2>
            <div className="materials-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
              {woods.map(item => (
                <div className="material-card" key={item.name} style={{background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'transform 0.3s ease'}}>
                  <img src={item.image} alt={item.name} style={{width: '100%', height: '200px', objectFit: 'cover'}} />
                  <div style={{padding: '1.5rem'}}>
                    <h3 style={{marginBottom: '1rem', color: '#333', fontSize: '1.3rem'}}>{item.name}</h3>
                    <p style={{color: '#666', lineHeight: '1.6'}}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          <section className="materials-section" style={{marginBottom: '4rem'}}>
            <h2 style={{textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem', color: '#333'}}>Rotan</h2>
            <div className="materials-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
              {rattans.map(item => (
                <div className="material-card" key={item.name} style={{background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'transform 0.3s ease'}}>
                  <img src={item.image} alt={item.name} style={{width: '100%', height: '200px', objectFit: 'cover'}} />
                  <div style={{padding: '1.5rem'}}>
                    <h3 style={{marginBottom: '1rem', color: '#333', fontSize: '1.3rem'}}>{item.name}</h3>
                    <p style={{color: '#666', lineHeight: '1.6'}}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          <section className="materials-section">
            <h2 style={{textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem', color: '#333'}}>Kain</h2>
            <div className="materials-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
              {fabrics.map(item => (
                <div className="material-card" key={item.name} style={{background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'transform 0.3s ease'}}>
                  <img src={item.image} alt={item.name} style={{width: '100%', height: '200px', objectFit: 'cover'}} />
                  <div style={{padding: '1.5rem'}}>
                    <h3 style={{marginBottom: '1rem', color: '#333', fontSize: '1.3rem'}}>{item.name}</h3>
                    <p style={{color: '#666', lineHeight: '1.6'}}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
  );
}