# WonderCraft 🎨✨
### Çocuklar İçin Kişiselleştirilmiş Boyama Kitabı Oluşturucu & İnteraktif Tuval

WonderCraft, çocukların hayal güçlerine uygun tematik boyama sayfaları oluşturan, interaktif boyama tuvali sunan ve yazdırılabilir/paylaşılabilir PDF boyama kitapları üreten full-stack bir web uygulamasıdır.

---

## 🚀 GitHub'a Güncel Kodları Yükleme (Push)

Projenizi bilgisayarınızda bir klasöre alıp GitHub deponuza (`github.com/sosyalilgi/WonderCraft`) göndermek için şu adımları izleyin:

```bash
# 1. Proje klasörünüze gidin
cd /projenizin/bulundugu/klasor

# 2. Değişiklikleri Git'e ekleyin
git add .

# 3. Commit mesajı yazın
git commit -m "Fix Dokploy port conflict (use 3050) and dependency resolution"

# 4. GitHub main (veya master) dalına push edin
git push origin main
```

*(Eğer henüz bir git deposu başlatmadıysanız)*:
```bash
git init
git remote add origin https://github.com/sosyalilgi/WonderCraft.git
git branch -M main
git add .
git commit -m "WonderCraft İlk Sürüm"
git push -u origin main --force
```

---

## 🐳 Dokploy ile Kendi Sunucunuzda Yayınlama

Dokploy panelinizde yaşadığınız:
> `Bind for 0.0.0.0:3000 failed: port is already allocated`

hatası, **Dokploy'un kendi yönetim panelinin de varsayılan olarak sunucudaki 3000 portunu kullanmasından** kaynaklanıyordu.

Bu sorunu çözmek için `docker-compose.yml` dosyasında sunucu dış portu varsayılan olarak **`3050`** olarak ayarlandı (`3050:3000`).

### Dokploy'da Kurulum Adımları:

1. **GitHub Deponuzu Dokploy'a Bağlayın**:
   - Dokploy paneline girin -> **Projects** -> Projenizi seçin.
   - **Create Service** -> **Compose** veya **Application** seçeneğini seçin.
   - Kaynak olarak **GitHub** seçin: `sosyalilgi/WonderCraft`.
   - Dal (Branch): `main`.

2. **Ortam Değişkenlerini (Environment Variables) Ekleyin**:
   Dokploy panelinde **Environment** sekmesine gidin ve şunları ekleyin:
   ```env
   NODE_ENV=production
   PORT=3000
   HOST_PORT=3050
   GEMINI_API_KEY=AIzaSy...SizinGeminiAnahtariniz...
   ```

3. **Yayınla (Deploy)**:
   - **Deploy** butonuna tıklayın.
   - Dokploy Docker imajını hatasız derleyecek ve konteyneri başlatacaktır.

4. **Erişim**:
   - Doğrudan IP ile: `http://SUNUCU_IP_ADRESINIZ:3050`
   - **Alan Adı (Domain) ile**: Dokploy'da **Domains** sekmesine gidin, alan adınızı girin ve konteyner portu olarak **`3000`** belirtin (Dokploy'un Traefik ters vekili otomatik SSL sertifikası alarak `https://alanadiniz.com` üzerinden yönlendirecektir).

---

## 🛠️ Yerel Geliştirme (Local Development)

```bash
# Bağımlılıkları yükleyin
npm install --legacy-peer-deps

# Geliştirici sunucusunu başlatın (Port 3000)
npm run dev

# Üretim derlemesi oluşturun
npm run build
```
