# iNews Project — Setup

Ab project mein 3 alag apps hain, ek hi backend use karte hain:

```
inews/
  server/   -> Backend API (Express + MongoDB) — port 5001
  client/   -> Main public website (readers) — port 3000
  admin/    -> Alag Admin Panel (Journalist/Editor/Advertiser/Admin) — port 3001
```

Admin panel mein jo bhi news/video/e-paper upload hoga, wo seedha backend
(`server/uploads`, MongoDB) mein save hota hai — aur wahi data `client`
(main website) `/api/...` se fetch karke turant dikha deta hai. Dono apps
same backend APIs use karte hain, isliye alag-alag chalane par bhi data
sync rehta hai.

## 1) Backend chalao

```bash
cd server
npm install
npm run dev        # ya: node server.js
```
Port 5001 pe chalega. `.env` mein MONGO_URI aur JWT_SECRET check kar lena.

## 2) Main website (readers ke liye)

```bash
cd client
npm install
npm run dev
```
http://localhost:3000 — News, Videos, E-Paper, Live TV sab yahin dikhega
(admin panel se upload hote hi yahan aa jaayega).

## 3) Admin Panel (alag website)

```bash
cd admin
npm install
npm run dev
```
http://localhost:3001 — sirf Journalist/Editor/Advertiser/Admin login kar
sakte hain. Yahan se:
- News likh/publish kar sakte ho (image/video file upload ke saath)
- Video Manager tab se video upload
- E-Paper Manager tab se PDF issue upload
- Users, Ads, Site Settings, Audit Logs (Admin role)

Reader account se admin panel mein login allowed nahi hai.

## Deploy karte waqt

Agar production mein alag domains pe deploy karoge (e.g.
`news.example.com` aur `admin.news.example.com`), to:
- `admin/src/components/AdminHeader.jsx` mein `MAIN_SITE_URL`
- `client/src/components/Header.jsx` mein `ADMIN_PANEL_URL`

in dono variables ko apne actual production URLs se update kar dena.
