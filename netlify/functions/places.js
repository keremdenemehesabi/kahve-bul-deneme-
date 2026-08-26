// Bu fonksiyon Netlify'ın sunucusunda çalışır, tarayıcıya hiç gönderilmez.
// Google API anahtarı burada değil; Netlify site ayarlarındaki
// GOOGLE_PLACES_API_KEY ortam değişkeninden okunur (bkz. README.md).

exports.handler = async (event) => {
  const key = process.env.GOOGLE_PLACES_API_KEY;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  if (!key) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Sunucuda GOOGLE_PLACES_API_KEY tanımlı değil. Netlify site ayarlarından ekle.' })
    };
  }

  const params = event.queryStringParameters || {};
  const action = params.action;

  try {
    if (action === 'nearby') {
      const lat = parseFloat(params.lat);
      const lon = parseFloat(params.lon);
      const radius = parseFloat(params.radius || '1500');

      if (Number.isNaN(lat) || Number.isNaN(lon)) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'lat/lon gerekli' }) };
      }

      const res = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': key,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.location,places.formattedAddress,places.priceLevel,places.currentOpeningHours.openNow'
        },
        body: JSON.stringify({
          includedTypes: ['cafe'],
          maxResultCount: 20,
          locationRestriction: {
            circle: { center: { latitude: lat, longitude: lon }, radius }
          }
        })
      });

      const data = await res.json();
      return { statusCode: res.status, headers, body: JSON.stringify(data) };
    }

    if (action === 'geocode') {
      const address = params.address;
      if (!address) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'address gerekli' }) };
      }

      const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        encodeURIComponent(address) + '&key=' + key;
      const res = await fetch(url);
      const data = await res.json();
      return { statusCode: res.status, headers, body: JSON.stringify(data) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Bilinmeyen action: ' + action }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: String(e) }) };
  }
};
