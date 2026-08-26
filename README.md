# Kahve Bul — Netlify + gizli API anahtarlı kurulum

Bu paket, kullanıcıların hiçbir API anahtarı girmesine gerek kalmadan
çalışan bir versiyon. Anahtar tarayıcıya hiç gitmiyor; Netlify'ın
sunucusunda çalışan küçük bir fonksiyon (`netlify/functions/places.js`)
üzerinden gizli tutuluyor.

## İçindekiler
- `index.html` — site (artık anahtar isteyen bir panel yok)
- `netlify/functions/places.js` — Google Places isteklerini arka planda yapan proxy
- `netlify.toml` — Netlify'a fonksiyonların nerede olduğunu söyler

## Kurulum adımları

1. **Bir Google Maps API anahtarı oluştur** (Google Cloud Console →
   APIs & Services → Credentials). Bu SENİN anahtarın, kullanıcılar
   görmeyecek.
   - Etkinleştirilmesi gerekenler: **Places API (New)** ve **Geocoding API**
   - Faturalandırmayı aç (Google'ın aylık ücretsiz kotası genelde
     normal kullanım için yeterli oluyor)
   - Bu anahtara **API kısıtlaması** ekle (sadece bu iki API'yi
     kullanabilsin, IP/HTTP referrer kısıtlaması ekleme — sunucudan
     çağrılacağı için buna gerek yok ve referrer olmadığı için
     engellenir)

2. **Bu klasörü bir GitHub reposuna yükle** (Netlify Functions'ın
   çalışması için bir repo bağlantısı gerekiyor, sadece dosya
   sürükle-bırak yetmiyor).

3. **Netlify'da "Add new site" → "Import an existing project"** ile bu
   repoyu bağla. Build ayarlarına dokunmana gerek yok, `netlify.toml`
   zaten fonksiyon klasörünü tanımlıyor.

4. **Site ayarlarında ortam değişkeni ekle:**
   `Site settings → Environment variables → Add a variable`
   - Key: `GOOGLE_PLACES_API_KEY`
   - Value: (senin Google API anahtarın)

5. Siteyi yeniden deploy et (env değişkeni eklemeden sonraki ilk
   deploy'da genelde otomatik yapılır, olmazsa "Trigger deploy").

Bu kadar. Artık kullanıcılar siteye girip direkt arama yapabiliyor,
hiçbir anahtar istemiyor. Google faturası tamamen sana (site
sahibine) ait olur — kaç kişi kullanırsa kullansın istekler senin
kotana sayılır, o yüzden çok yüksek trafik beklersen Google Cloud
Console'dan günlük istek kotası koymayı düşünebilirsin.
