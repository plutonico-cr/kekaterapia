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
    
    promos = promociones;
    promoIndex = 0;
    
    if (typeof buildPromos === 'function') {
      buildPromos();
      if (promos.length > 1 && typeof resetPromoInterval === 'function') {
        resetPromoInterval();
      }
    }
    console.log('✨ Slider reconstruido');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', cargarPromociones);
} else {
  cargarPromociones();
}
setInterval(cargarPromociones, 5 * 60 * 1000);
