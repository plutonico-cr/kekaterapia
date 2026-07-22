const SUPABASE_URL = 'https://ciddpvkcdoevfprlzhtg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_F10DXS9eoGkfmLuzf5J2lQ_T8jf2oLJ';

async function cargarPromociones() {
  console.log('📡 Cargando promociones desde Supabase...');
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/promociones?activa=eq.true&order=orden.asc`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        }
      }
    );
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const promociones = await response.json();
    console.log('✅ Promociones cargadas:', promociones.length);
    
    window.promos = promociones;
    
    // Reconstruir track
    const track = document.getElementById('promo-track');
    if (track) {
      track.innerHTML = '';
      const colorMap = {
        sage: { bg: 'bg-brand-sage', text: 'text-white', badge: 'bg-white/20' },
        lavender: { bg: 'bg-brand-lavender', text: 'text-white', badge: 'bg-white/20' },
        rose: { bg: 'bg-brand-rose', text: 'text-brand-charcoal', badge: 'bg-brand-charcoal/10' }
      };
      
      promociones.forEach(p => {
        const c = colorMap[p.color] || colorMap.sage;
        const slide = document.createElement('div');
        slide.className = `promo-slide ${c.bg} ${c.text}`;
        slide.innerHTML = `
          <div class="flex flex-col md:flex-row items-center gap-8 p-10 md:p-16 min-h-[280px]">
            <div class="text-7xl md:text-8xl flex-shrink-0">${p.emoji}</div>
            <div class="text-center md:text-left">
              <span class="inline-block ${c.badge} text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4">Promoción especial</span>
              <h3 class="text-3xl md:text-4xl font-serif font-semibold mb-2">${p.titulo}</h3>
              <p class="text-5xl md:text-6xl font-bold font-serif mb-4 promo-badge">${p.descuento}</p>
              <p class="text-lg font-light opacity-90 mb-4 max-w-md">${p.descripcion}</p>
              <p class="text-sm opacity-60 mb-6">⏰ ${p.vence}</p>
              <button onclick="openBooking()" class="bg-white/90 text-brand-charcoal px-8 py-3 rounded-full font-semibold hover:bg-white transition-colors shadow-lg">
                Aprovechar promo →
              </button>
            </div>
          </div>
        `;
        track.appendChild(slide);
      });
      
      // Reconstruir dots
      const dots = document.getElementById('promo-dots');
      if (dots) {
        dots.innerHTML = '';
        promociones.forEach((_, i) => {
          const dot = document.createElement('button');
          dot.className = `w-2.5 h-2.5 rounded-full transition-all ${i === 0 ? 'bg-brand-sage w-6' : 'bg-brand-sage/30'}`;
          dot.onclick = () => goToPromo(i);
          dots.appendChild(dot);
        });
      }
      
      console.log('✨ Slider reconstruido con', promociones.length, 'promos');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', cargarPromociones);
} else {
  setTimeout(cargarPromociones, 500);
}
setInterval(cargarPromociones, 5 * 60 * 1000);
console.log('🔗 Script Supabase cargado');
