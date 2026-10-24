# 🌾 Farmers Dictionary Zw
### *Duramazwi reVarimi • Isichazamazwi Sabalimi*
**Zimbabwe Smart Agro-Advisory, Climate-Smart Pfumvudza Suite & Trilingual Field Intelligence**

[![Streamlit Cloud](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://share.streamlit.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.x-purple.svg)](https://vitejs.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0-38bdf8.svg)](https://tailwindcss.com)

---

## 📖 Overview

**Farmers Dictionary Zw** is a comprehensive, climate-smart agricultural advisory platform designed specifically for Zimbabwean smallholder farmers, lead farmers, agricultural extension officers, and cooperatives across **Natural Regions I to V**.

The system bridges scientific agro-ecology with indigenous agricultural knowledge, providing trilingual terminology in **English**, **ChiShona** (*Duramazwi reVarimi*), and **isiNdebele** (*Isichazamazwi Sabalimi*). It features instant **WhatsApp field messaging** (with zero fake phone numbers or dead group links), an interactive **Pfumvudza/Intwasa basin calculator**, dekad rainfall onset indicators, and **dual deployment options** (full-stack React SPA + Python Streamlit Cloud edition).

---

## ✨ Core Features

### 1. 📖 Trilingual Agricultural Dictionary & Voice Search
- Comprehensive glossary covering conservation farming, soil chemistry, veterinary terms, and agro-chemicals.
- Native terms in ChiShona (*Guvha rePfumvudza*, *Nhokwe*, *Mhungu yeMauto*, *Chidhibhi*) and isiNdebele (*Umgodi we-Intwasa*, *Isivikelo se-Mulch*, *Isibungu seMpi*, *Dhibhi*).
- **Web Speech API Voice Search**: Speak inquiries hands-free in Shona, Ndebele, or English directly from the field.
- **Audio Synthesizer**: Text-to-speech pronunciations for farmers with varying literacy levels.

### 2. 🌱 Pfumvudza / Intwasa Precision Input Calculator
- Exact dosing calculations for standard $15\text{ cm} \times 15\text{ cm} \times 15\text{ cm}$ planting basins spaced at $75\text{ cm} \times 60\text{ cm}$ (or $75\text{ cm} \times 75\text{ cm}$).
- Basal fertilizer dosage (standard beer bottle cap / $5\text{ g}$ Compound D per basin).
- Ammonium Nitrate (AN) split top-dressing schedules.
- Mulch blanket coverage requirements ($100\%$ soil protection).
- Projected yield estimations in $50\text{ kg}$ bags and metric tonnes.

### 3. 🌦️ Zimbabwe Agro-Ecological Zones (Regions I – V) & Weather
- District telemetry covering all 10 provinces (Goromonzi, Mazowe, Mutare, Chivi, Gokwe, Lupane, Gwanda, Chiredzi, etc.).
- Dekad rainfall onset monitoring with effective planting rain thresholds ($25\text{ mm}+$ soaking rain).
- Variety matching (SC719/PAN53 for Region II, SC513/SC403 for Region III, SVT1 Sorghum and Pearl Millet for Regions IV & V).

### 4. 📲 Authentic WhatsApp Field Integration (Zero Fake Links)
- **Direct Extension Messaging**: Farmers can save their genuine local ward extension officer's contact in local storage for 1-tap inquiries.
- **Universal WhatsApp Broadcast**: 1-tap sharing of field advisories, daily bulletins, and dictionary terms to any contact, cooperative group, or WhatsApp Status (`https://api.whatsapp.com/send?text=...`).
- **Regional Agro-Climatic Networks**: Ready-to-broadcast community updates for Pfumvudza champions, high-yield maize, dryland small grains, horticulture, and livestock dipping.
- **Cooperative Group Manager**: Store your real ward cooperative or farmer association WhatsApp group link.

### 5. 🔬 AI Crop Diagnostic Vision Scanner
- Server-side Gemini Multimodal Vision proxy (`/api/diagnose`) for crop disease scouting, Fall Armyworm identification, and mineral deficiency detection.

### 6. 💰 Real-Time Market Benchmarks & Commodity Insights
- Farm-gate wholesale prices from Mbare Musika (Harare), Renkini (Bulawayo), and GMB standard grain purchase benchmarks.

### 7. 📱 Offline PWA & Formatted PDF Advisory Generator
- Fully installable Progressive Web App (PWA) with background service workers for offline rural field operations.
- 1-tap export of formatted PDF advisory reports for extension records.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Web Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Motion |
| **Backend / API** | Node.js, Express, `@google/genai` (Server-side Gemini proxy) |
| **Python Edition** | Python 3.10+, Streamlit 1.38+, Pandas |
| **PWA & Offline** | Vite PWA Plugin, Workbox Service Worker, Web App Manifest |
| **PDF Generation** | jsPDF |
| **Deployments** | Streamlit Community Cloud, Netlify, Vercel, Docker, Google Cloud Run |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Node.js** 20.x or higher
- **npm** or **bun**
- *(Optional for Python edition)* **Python** 3.10+

### Option A: Run Full-Stack React + Node.js (Recommended)
```bash
# 1. Clone repository
git clone https://github.com/<your-username>/farmers-dictionary-zw.git
cd farmers-dictionary-zw

# 2. Install dependencies
npm install

# 3. Create .env file with your Gemini API key (optional for AI diagnostics)
echo "GEMINI_API_KEY=your_key_here" > .env

# 4. Start local development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

### Option B: Run Python Streamlit Edition
```bash
# 1. Install Streamlit dependencies
pip install -r requirements.txt

# 2. Launch Streamlit app
streamlit run streamlit_app.py
```
Open **[http://localhost:8501](http://localhost:8501)** in your browser.

---

## 🌐 Deployment

### 1. Deploy to Streamlit Community Cloud (Free)
1. Fork or push this repository to GitHub.
2. Visit **[share.streamlit.io](https://share.streamlit.io)** and sign in with GitHub.
3. Click **"New app"** and fill in:
   - **Repository:** `<your-username>/farmers-dictionary-zw`
   - **Branch:** `main`
   - **Main file path:** `streamlit_app.py`
4. Click **"Deploy!"**
5. *(Optional)* Add `GEMINI_API_KEY` under **App Settings > Secrets**.

---

### 2. Deploy to Netlify
This repository contains a production-ready `netlify.toml`:
1. Connect your GitHub repository to [Netlify](https://www.netlify.com).
2. Netlify will automatically detect:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions:** `netlify/functions`
3. Add `GEMINI_API_KEY` under **Site configuration > Environment variables**.

---

### 3. Deploy to Docker / Google Cloud Run / Render
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📁 Repository Structure

```text
├── .streamlit/
│   └── config.toml                # Streamlit theme (Emerald agricultural styling)
├── netlify/
│   └── functions/                 # Netlify serverless functions
├── public/
│   ├── pwa-192x192.png            # PWA icons
│   └── pwa-512x512.png
├── src/
│   ├── components/                # Modular React UI components
│   │   ├── FarmersDictionaryAndWhatsApp.tsx  # Trilingual dictionary & WhatsApp hub
│   │   ├── WhatsAppConnectModal.tsx          # Direct & Universal WhatsApp modal
│   │   ├── ContentGenerator.tsx              # Farmer advisory broadcast builder
│   │   ├── SoilQualityAssessment.tsx         # Soil dosing & fertilizer advisor
│   │   ├── DekadPlantingAlertBanner.tsx      # Rainfall onset monitor
│   │   └── CropManualsLibrary.tsx            # Agricultural manuals
│   ├── context/
│   │   └── LanguageContext.tsx    # English / Shona / Ndebele localization
│   ├── data/
│   │   ├── farmersDictionaryData.ts   # Core dictionary & advisory networks
│   │   ├── zimbabweLocations.ts       # 60+ Zimbabwe districts & coordinates
│   │   └── allCropsDatabase.ts        # Agronomic crop requirements
│   ├── utils/
│   │   └── pdfAdvisoryGenerator.ts    # jsPDF advisory report generator
│   ├── App.tsx                    # Main app component & tab layout
│   └── main.tsx                   # React DOM root entry
├── index.html                     # HTML5 entry with PWA manifest & meta tags
├── netlify.toml                   # Netlify build & redirect rules
├── package.json                   # Node.js project manifest & scripts
├── requirements.txt               # Streamlit Python dependencies
├── server.ts                      # Express API proxy (Gemini API & Vite dev server)
├── streamlit_app.py               # Standalone Streamlit Cloud application
├── tsconfig.json                  # TypeScript compiler options
└── vite.config.ts                 # Vite bundler & PWA configuration
```

---

## 🤝 Contributing

Contributions from agronomists, extension officers, software engineers, and smallholder farmers are welcome!

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/NewAgroAdvisory`).
3. Commit your Changes (`git commit -m 'Add traditional grain advisory'`).
4. Push to the Branch (`git push origin feature/NewAgroAdvisory`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

**Empowering smallholder farmers across Zimbabwe through accessible, trilingual, and climate-smart agricultural technology.** 🇿🇼
