"""
Farmers Dictionary Zw - Streamlit Edition
Zimbabwe Smart Agro-Advisory, Pfumvudza Calculator & Trilingual Dictionary
Deployable to Streamlit Community Cloud (share.streamlit.io)
"""

import streamlit as st
import urllib.parse
from datetime import datetime

# Set page configuration
st.set_page_config(
    page_title="Farmers Dictionary Zw • Zimbabwe Smart Agro-Advisory",
    page_icon="🌾",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for agricultural branding
st.markdown("""
<style>
    .main-title {
        color: #064E3B;
        font-weight: 800;
        font-size: 2.2rem;
        margin-bottom: 0.2rem;
    }
    .sub-title {
        color: #047857;
        font-size: 1.05rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
    }
    .metric-card {
        background: #F0FDF4;
        border: 1px solid #BBF7D0;
        border-radius: 16px;
        padding: 16px;
        margin-bottom: 12px;
    }
    .advisory-box {
        background: #FEF3C7;
        border-left: 5px solid #F59E0B;
        padding: 14px;
        border-radius: 8px;
        color: #78350F;
        font-size: 0.95rem;
        margin: 12px 0;
    }
    .stButton>button {
        background-color: #047857;
        color: white;
        border-radius: 12px;
        font-weight: 700;
        border: none;
    }
    .stButton>button:hover {
        background-color: #065F46;
        color: white;
    }
</style>
""", unsafe_allow_html=True)

# Data: Zimbabwe Districts and Agro-Ecological Zones
ZIMBABWE_DISTRICTS = [
    {"name": "Goromonzi", "province": "Mashonaland East", "region": "IIa", "rainfall": "750 - 1000 mm", "soils": "Granitic sandy loam"},
    {"name": "Mazowe", "province": "Mashonaland Central", "region": "IIa", "rainfall": "800 - 1000 mm", "soils": "Red fersiallitic clay loam"},
    {"name": "Chinhoyi / Makonde", "province": "Mashonaland West", "region": "IIa", "rainfall": "750 - 900 mm", "soils": "Heavy red clay"},
    {"name": "Marondera", "province": "Mashonaland East", "region": "IIb", "rainfall": "700 - 850 mm", "soils": "Sandy clay loam"},
    {"name": "Gweru", "province": "Midlands", "region": "III", "rainfall": "650 - 800 mm", "soils": "Clay & grey sand"},
    {"name": "Gokwe South", "province": "Midlands", "region": "IV", "rainfall": "450 - 650 mm", "soils": "Kalahari sands & loams"},
    {"name": "Masvingo", "province": "Masvingo", "region": "IV", "rainfall": "450 - 600 mm", "soils": "Sandy loam & black basalt"},
    {"name": "Chivi", "province": "Masvingo", "region": "IV", "rainfall": "400 - 550 mm", "soils": "Granitic sandy soils"},
    {"name": "Mutare", "province": "Manicaland", "region": "IIb", "rainfall": "700 - 900 mm", "soils": "Red loam & mountain clay"},
    {"name": "Nyanga", "province": "Manicaland", "region": "I", "rainfall": "1000 - 1600 mm", "soils": "High-altitude acidic loam"},
    {"name": "Chipinge", "province": "Manicaland", "region": "I", "rainfall": "1100 - 1800 mm", "soils": "Rich volcanic loam"},
    {"name": "Bulawayo / Umguza", "province": "Matabeleland North", "region": "IV", "rainfall": "450 - 600 mm", "soils": "Sandy & clay loam"},
    {"name": "Lupane", "province": "Matabeleland North", "region": "IV", "rainfall": "450 - 600 mm", "soils": "Kalahari deep sands"},
    {"name": "Gwanda", "province": "Matabeleland South", "region": "V", "rainfall": "300 - 450 mm", "soils": "Shallow gravel & basalt"},
    {"name": "Beitbridge", "province": "Matabeleland South", "region": "V", "rainfall": "250 - 400 mm", "soils": "Arid lowveld sandy gravel"},
    {"name": "Chiredzi", "province": "Masvingo", "region": "V", "rainfall": "350 - 500 mm", "soils": "Deep alluvial lowveld clay"}
]

# Trilingual Farmers Dictionary Sample
DICTIONARY_ENTRIES = [
    {
        "term": "Pfumvudza / Intwasa Planting Basin",
        "shona": "Guvha rePfumvudza",
        "ndebele": "Umgodi we-Intwasa",
        "category": "Conservation Agriculture",
        "regions": "All (I - V)",
        "definition": "Standard 15cm x 15cm x 15cm basin dug at 75cm x 60cm spacing. Concentrates rainfall, manure, and basal fertilizer directly around crop roots.",
        "advisory": "Dig basins during the dry winter months (July-October) so you can plant immediately after the first 25-30mm soaking rain."
    },
    {
        "term": "Mulch Blanket",
        "shona": "Rukweza rweNhokwe / Uswa",
        "ndebele": "Isivikelo se-Mulch",
        "category": "Soil & Water",
        "regions": "All (I - V)",
        "definition": "Layer of dry grass, crop stover, or thatch covering at least 30% to 100% of the soil surface between planting basins.",
        "advisory": "Conserves up to 40% soil moisture, suppresses weed emergence, and lowers soil temperatures during heatwaves."
    },
    {
        "term": "Compound D Basal Fertilizer",
        "shona": "Fetereza yeChidyiro (Compound D)",
        "ndebele": "Isivundiso Sokuhlanyela (Compound D)",
        "category": "Fertilizers & Chemicals",
        "regions": "All (I - V)",
        "definition": "NPK formulation (7:14:7 + 6.5% S) applied in each basin before seed placement to build root architecture.",
        "advisory": "Measure one standard beer bottle cap (approx 5g) per basin. Cover with 2-3cm of soil before dropping seeds so fertilizer does not scorch the seed."
    },
    {
        "term": "Ammonium Nitrate (AN) Top Dressing",
        "shona": "Fetereza yeMushando (Top Dressing / AN)",
        "ndebele": "Isivundiso Sokukhulisa (AN)",
        "category": "Fertilizers & Chemicals",
        "regions": "Regions I, IIa, IIb, III",
        "definition": "High-nitrogen (34.5% N) chemical fertilizer used to drive rapid vegetative growth and grain filling in cereal crops.",
        "advisory": "Apply in splits: First split at 4-6 weeks after emergence (knee-height) when soil is thoroughly moist. Do not apply on dry or parched soil."
    },
    {
        "term": "Fall Armyworm (Spodoptera frugiperda)",
        "shona": "Mhungu yeMauto",
        "ndebele": "Isibungu seMpi",
        "category": "Crop Protection",
        "regions": "All (I - V)",
        "definition": "Invasive night-flying caterpillar pest feeding inside the whorls of young maize, sorghum, and wheat plants.",
        "advisory": "Scout weekly for sawdust-like frass and leaf windowing. Direct sprays early in the morning or late evening deep into the plant funnel."
    },
    {
        "term": "Theileriosis (January Disease)",
        "shona": "Chirwere cheMombe cheMadondore",
        "ndebele": "Umkhuhlane weZinkomo weNgqikili",
        "category": "Livestock & Animal Health",
        "regions": "Regions II, III, IV",
        "definition": "Fatal tick-borne cattle disease transmitted by the brown ear tick (Rhipicephalus appendiculatus) during wet summer months.",
        "advisory": "Maintain the strict 5-5-4 dipping regimen between November and April. Hand-dress cattle ears and tail brush with tick grease."
    }
]

# Helper for building universal WhatsApp share link
def build_whatsapp_share_url(text: str) -> str:
    encoded = urllib.parse.quote(text.strip())
    return f"https://api.whatsapp.com/send?text={encoded}"

# Helper for building direct WhatsApp officer chat link
def build_whatsapp_officer_url(phone: str, text: str) -> str:
    clean_phone = "".join(filter(str.isdigit, phone))
    encoded = urllib.parse.quote(text.strip())
    if clean_phone:
        return f"https://wa.me/{clean_phone}?text={encoded}"
    return f"https://api.whatsapp.com/send?text={encoded}"

# Sidebar Navigation & Location Setup
st.sidebar.image("https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80", use_container_width=True)
st.sidebar.title("🌾 Farmers Dictionary Zw")
st.sidebar.caption("Zimbabwe Smart Agro-Advisory • Streamlit Cloud")

app_mode = st.sidebar.radio(
    "Select Interface Mode:",
    ["🌱 Native Streamlit Agro-Advisory", "🖥️ Live Full Web App (Interactive Frame)", "🚀 How to Deploy on Streamlit Cloud"]
)

st.sidebar.markdown("---")
st.sidebar.subheader("📍 Location Settings")
district_names = [d["name"] for d in ZIMBABWE_DISTRICTS]
selected_district_name = st.sidebar.selectbox("Farming District:", district_names, index=0)
selected_district = next(d for d in ZIMBABWE_DISTRICTS if d["name"] == selected_district_name)

st.sidebar.info(f"""
**Province:** {selected_district['province']}  
**Natural Region:** Region {selected_district['region']}  
**Rainfall Expectation:** {selected_district['rainfall']}  
**Soil Character:** {selected_district['soils']}
""")

# ==========================================
# MODE 1: NATIVE STREAMLIT AGRO-ADVISORY
# ==========================================
if app_mode == "🌱 Native Streamlit Agro-Advisory":
    st.markdown('<div class="main-title">🌾 Farmers Dictionary Zw</div>', unsafe_allow_html=True)
    st.markdown(f'<div class="sub-title">Smart Agro-Advisory & Field Toolkit for <strong>{selected_district["name"]}</strong> (Natural Region {selected_district["region"]})</div>', unsafe_allow_html=True)

    tab1, tab2, tab3, tab4 = st.tabs([
        "📊 Pfumvudza Calculator", 
        "📖 Trilingual Dictionary", 
        "💬 WhatsApp Field Advisory", 
        "🌦️ Agro-Ecological Zones"
    ])

    # TAB 1: PFUMVUDZA CALCULATOR
    with tab1:
        st.subheader("🌱 Pfumvudza / Intwasa Precision Input Calculator")
        st.caption("Calculate exact seed, basal fertilizer, mulch, and split top-dressing for standardized 15x15x15cm basins.")

        col1, col2 = st.columns(2)
        with col1:
            plot_type = st.selectbox("Standard Plot Scale:", ["Standard Family Plot (1 Plot = 1,456 basins)", "Custom Basin Count"])
            if plot_type == "Standard Family Plot (1 Plot = 1,456 basins)":
                num_plots = st.slider("Number of Standard Plots:", min_value=1, max_value=10, value=1)
                total_basins = num_plots * 1456
            else:
                total_basins = st.number_input("Enter Total Basin Count:", min_value=50, max_value=50000, value=1456, step=100)

            crop_choice = st.selectbox("Target Cereal / Legume:", [
                "Maize (Medium/Early Hybrid - SC513/SC637)", 
                "Sorghum (Drought-Hardy SVT1)", 
                "Pearl Millet (Mhunga)", 
                "Soya Beans / Groundnuts"
            ])

        with col2:
            st.markdown('<div class="metric-card">', unsafe_allow_html=True)
            st.markdown(f"### 🧮 Requirements for **{total_basins:,} Basins**")
            
            # Formulas
            compound_d_kg = (total_basins * 5) / 1000  # 5g per basin
            an_kg = (total_basins * 5) / 1000          # 5g per basin split
            seed_kg = (total_basins * 2 * 0.35) / 1000 # 2 seeds per basin approx 7-10kg per ha
            expected_yield_bags = round((total_basins * 0.7) / 50, 1) # ~0.7kg per basin on good management

            st.write(f"• **Basal Fertilizer (Compound D):** `{compound_d_kg:.1f} kg` ({round(compound_d_kg/50, 1)} x 50kg bags)")
            st.write(f"• **Top Dressing (AN Splits):** `{an_kg:.1f} kg` ({round(an_kg/50, 1)} x 50kg bags)")
            st.write(f"• **Seed Required:** `{max(seed_kg, 1.5):.1f} kg`")
            st.write(f"• **Projected Yield (Pfumvudza Standard):** `~{expected_yield_bags} x 50kg bags` ({round(expected_yield_bags * 0.05, 2)} tonnes)")
            st.markdown('</div>', unsafe_allow_html=True)

        st.markdown(f"""
        <div class="advisory-box">
        <strong>💡 Field Recommendation for Region {selected_district['region']}:</strong><br>
        Ensure you receive at least <strong>25mm of effective planting rain</strong> (penetrating 15cm into the basin) before placing seed. Place 1 bottle cap (5g) of Compound D per basin, cover with 2cm soil, drop 2 seeds, and cover with loose soil. Apply 100% mulch blanket immediately.
        </div>
        """, unsafe_allow_html=True)

    # TAB 2: TRILINGUAL DICTIONARY
    with tab2:
        st.subheader("📖 Agricultural Trilingual Dictionary")
        st.caption("Bridging scientific agronomy with indigenous farming knowledge: ChiShona (*Duramazwi reVarimi*) and isiNdebele (*Isichazamazwi Sabalimi*).")

        search_query = st.text_input("🔍 Search term in English, Shona, or Ndebele:", placeholder="e.g. Pfumvudza, Nhokwe, Armyworm, Compound D, Dhibhi...")
        
        filtered_entries = DICTIONARY_ENTRIES
        if search_query.strip():
            q = search_query.strip().lower()
            filtered_entries = [
                e for e in DICTIONARY_ENTRIES 
                if q in e["term"].lower() or q in e["shona"].lower() or q in e["ndebele"].lower() or q in e["definition"].lower()
            ]

        for item in filtered_entries:
            with st.expander(f"🌱 {item['term']} • {item['shona']} / {item['ndebele']}"):
                col_a, col_b = st.columns([3, 1])
                with col_a:
                    st.markdown(f"**Category:** `{item['category']}` | **Applicable Regions:** `{item['regions']}`")
                    st.markdown(f"**Definition:** {item['definition']}")
                    st.info(f"💡 **Agronomic Guidance:** {item['advisory']}")
                with col_b:
                    share_text = f"📖 *FARMERS DICTIONARY ZW*\n🌱 *{item['term']}*\n🇿🇼 Shona: {item['shona']} | Ndebele: {item['ndebele']}\n{item['definition']}\n💡 {item['advisory']}"
                    wa_url = build_whatsapp_share_url(share_text)
                    st.link_button("📲 Share to WhatsApp", wa_url)

    # TAB 3: WHATSAPP FIELD ADVISORY
    with tab3:
        st.subheader("💬 WhatsApp Field Advisory & Inquiries")
        st.caption("Generate structured, formatted agricultural field inquiries with zero fake numbers or dead group links.")

        col_w1, col_w2 = st.columns(2)
        with col_w1:
            farmer_name = st.text_input("Farmer Name / Farm ID (Optional):", placeholder="e.g. Baba Tinashe / Plot 4")
            officer_phone = st.text_input("Local Extension Officer Phone Number:", placeholder="e.g. 077 123 4567 or 263771234567")
            st.caption("💡 Enter the real contact of your local ward extension officer, lead farmer, or seed agronomist.")
            
            inquiry_topic = st.selectbox("Inquiry Subject:", [
                "Sowing Window & Dekad Rain Onset",
                "Pfumvudza Basins & Mulch Management",
                "Fertilizer Dosing (Compound D & AN Splits)",
                "Fall Armyworm & Pest Scouting",
                "Livestock Dipping & January Disease",
                "Grain Moisture & Delivery Standards"
            ])
            inquiry_details = st.text_area("Specific Question or Crop Symptoms:", placeholder="e.g. Maize leaves show light green striping between veins. Basins were dug in September after 30mm rain...")

        with col_w2:
            st.markdown("### 📝 Message Preview")
            now_str = datetime.now().strftime("%d %b %Y")
            message_body = f"""🌾 *FARMERS DICTIONARY ZW • FIELD INQUIRY*
━━━━━━━━━━━━━━━━━━━━━
📅 *Date:* {now_str}
📍 *District:* {selected_district['name']} (Natural Region {selected_district['region']})
👤 *Farmer:* {farmer_name.strip() if farmer_name.strip() else 'Smallholder Farmer'}
📌 *Topic:* {inquiry_topic}

📝 *Field Query:*
{inquiry_details.strip() if inquiry_details.strip() else 'Please advise on optimal agronomic practices for current weather conditions.'}

━━━━━━━━━━━━━━━━━━━━━
_Sent via Farmers Dictionary Zw App_"""

            st.code(message_body, language="markdown")
            
            # Action Buttons
            send_url = build_whatsapp_officer_url(officer_phone, message_body)
            universal_url = build_whatsapp_share_url(message_body)
            
            b_col1, b_col2 = st.columns(2)
            with b_col1:
                st.link_button("📲 Open in WhatsApp", send_url)
            with b_col2:
                st.link_button("📤 Universal Share to Group", universal_url)

    # TAB 4: AGRO-ECOLOGICAL ZONES
    with tab4:
        st.subheader("🌦️ Zimbabwe Agro-Ecological Zones (Regions I - V)")
        
        region_info = {
            "I": "Specialized & Diversified. >1000mm rain. Highlands (Nyanga, Chimanimani, Honde Valley). Tea, coffee, macadamia, timber, seed potatoes.",
            "IIa": "Intensive Farming. 750-1000mm reliable rain. Mazowe, Goromonzi, Chinhoyi. Commercial maize, soya, tobacco, wheat.",
            "IIb": "Sub-Intensive. 680-850mm rain with mid-season dry spells. Marondera, Norton. Maize, groundnuts, sunflowers.",
            "III": "Semi-Intensive. 500-750mm erratic rain. Midlands, Gweru, Kadoma. Drought-tolerant maize (SC403/513), cotton, soya, cattle.",
            "IV": "Semi-Arid. 450-650mm rain with high temperatures. Masvingo, Chivi, Gokwe, Lupane. Sorghum (SVT1), Pearl Millet, Cowpeas, livestock.",
            "V": "Arid / Lowveld. <450mm low and erratic rain. Beitbridge, Chiredzi, Gwanda. Cattle ranching, goats, wildlife, irrigated sugar cane."
        }

        for r_code, r_desc in region_info.items():
            is_current = (r_code == selected_district['region'])
            prefix = "⭐ " if is_current else ""
            with st.expander(f"{prefix}Natural Region {r_code} {'(Your Selected District)' if is_current else ''}"):
                st.write(r_desc)

# ==========================================
# MODE 2: LIVE FULL WEB APP (IFRAME)
# ==========================================
elif app_mode == "🖥️ Live Full Web App (Interactive Frame)":
    st.markdown('<div class="main-title">🖥️ Full Interactive Web Application</div>', unsafe_allow_html=True)
    st.markdown("Access the complete React SPA with camera diagnostics, offline PWA, speech recognition, and audio voice synthesizer.")
    
    app_url = "https://ais-pre-iirwvujxhjhismccovw3wo-535649001550.europe-west2.run.app"
    
    col_top1, col_top2 = st.columns([3, 1])
    with col_top1:
        st.info(f"🔗 Hosting Target: `{app_url}`")
    with col_top2:
        st.link_button("↗️ Open in New Tab", app_url)

    st.components.v1.iframe(src=app_url, height=850, scrolling=True)

# ==========================================
# MODE 3: HOW TO DEPLOY ON STREAMLIT CLOUD
# ==========================================
else:
    st.markdown('<div class="main-title">🚀 How to Deploy on Streamlit Community Cloud</div>', unsafe_allow_html=True)
    st.markdown("Deploy this application for free on **Streamlit Community Cloud** (`share.streamlit.io`) in 3 minutes:")

    st.markdown("""
    ### 📋 Step-by-Step Instructions:
    
    1. **Push Code to GitHub:**
       - Ensure your repository contains:
         - `streamlit_app.py` (Main Python application)
         - `requirements.txt` (Python packages: `streamlit`, `pandas`, `requests`)
         - `.streamlit/config.toml` (Theme & server configuration)
         - The full React & Vite codebase (`package.json`, `src/`, etc.)
    
    2. **Log in to Streamlit Community Cloud:**
       - Go to [share.streamlit.io](https://share.streamlit.io) and log in with your GitHub account (`thulanitanaka144@gmail.com`).
    
    3. **Deploy New App:**
       - Click **"Create app"** (or **"New app"**).
       - Select your GitHub repository: `<your-username>/farmers-dictionary-zw`
       - Select branch: `main`
       - Enter Main file path: `streamlit_app.py`
       - Click **"Deploy!"**
    
    4. **(Optional) Configure Custom Subdomain:**
       - In app settings on Streamlit Cloud, you can choose a custom URL like:
         `farmers-dictionary-zw.streamlit.app`
    
    5. **(Optional) Secrets / Environment Variables:**
       - In Streamlit Cloud **App Settings > Secrets**, you can add any API keys if needed:
         ```toml
         GEMINI_API_KEY = "your_key_here"
         ```
    """)
    st.success("✅ Both `streamlit_app.py`, `requirements.txt`, and `.streamlit/config.toml` have been generated and configured in this repository!")
