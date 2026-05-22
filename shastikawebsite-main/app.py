
from flask import Flask, render_template, send_from_directory, request, jsonify, session, redirect, url_for, abort
from pymongo import MongoClient
from dotenv import load_dotenv
load_dotenv()
import os

# ==============================
# APP CONFIG
# ==============================

app = Flask(__name__, static_folder="static", template_folder="templates")
app.secret_key = os.getenv("FLASK_SECRET_KEY", "SHASTIKA_ADMIN_PANEL_KEY_2025")

# ==============================
# MONGODB CONNECTION
# ==============================

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://shastikaAdmin:shastika123@cluster0.wfhd0hm.mongodb.net/shastika?retryWrites=true&w=majority&appName=Cluster0")

client = MongoClient(MONGO_URI)

try:
    client.admin.command("ping")
    print("[OK] MongoDB Connected Successfully")
except Exception as e:
    print("[ERROR] MongoDB Connection Failed:", e)

db = client["shastikaDB"]
contact_collection = db["contact_messages"]
enquiry_collection = db["product_enquiries"]

# ==============================
# PRODUCT DETAILS
# ==============================

PRODUCT_CATALOG = {
    "tendercoconut": {
        "name": "Tender Coconut",
        "title_top": "Tender",
        "title_accent": "Coconut",
        "kicker": "Premium Export Grade",
        "image": "tendercoconut-pd.webp",
        "description": "Shastika Global's Premium Tender Coconuts are harvested at the ideal young stage to deliver refreshing water and soft jelly-like kernel. Carefully selected for export markets demanding freshness and nutrition.",
        "cards": [
            {"title": "Physical Attributes", "icon": "fa-solid fa-seedling", "items": ["Weight: 0.9 - 1.5 kg", "Type: Diamond & Polish", "Shelf Life: 2 Months"]},
            {"title": "Quality Profile", "icon": "fa-solid fa-award", "items": ["Volume: 400-550 ml", "Color: Translucent", "Taste: Naturally Sweet"]},
            {"title": "Packing", "icon": "fa-solid fa-box-open", "items": ["9 Pieces Per Carton", "Custom Packing Available", "Delivery: 2-5 Days"]},
            {"title": "Shipping", "icon": "fa-solid fa-truck", "items": ["40ft RF: 18,540 pcs", "20ft RF: 8,010 pcs", "100% Fresh Selection"]},
        ],
    },
    "greencoconut": {
        "name": "Green Coconut",
        "title_top": "Green",
        "title_accent": "Coconut",
        "kicker": "Premium Export Grade",
        "image": "greencoconut-pd.webp",
        "description": "Shastika Global's Green Coconuts are harvested at the ideal early maturity stage to preserve naturally sweet coconut water and soft kernel. Carefully selected for export markets demanding consistent freshness, quality, and superior taste.",
        "cards": [
            {"title": "Grade-A Selection", "icon": "fa-solid fa-seedling", "items": ["Weight: 800-1200 grams", "Shape: Diamond Polished", "Freshness: 100% Guaranteed"]},
            {"title": "Internal Profile", "icon": "fa-solid fa-medal", "items": ["Water: 400-550 ml", "Taste: Naturally Sweet", "Shelf Life: 60 Days"]},
            {"title": "Packing", "icon": "fa-solid fa-box-open", "items": ["9 Pieces Per Carton", "Custom Packing Available", "Delivery: 2-5 Days"]},
            {"title": "Shipping", "icon": "fa-solid fa-truck", "items": ["40ft RF: 18,540 pcs", "20ft RF: 8,010 pcs", "100% Fresh Selection"]},
        ],
    },
    "huskedcoconut": {
        "name": "Husked Coconut",
        "title_top": "Husked",
        "title_accent": "Coconut",
        "kicker": "Matured Export Grade",
        "image": "husked-pd.webp",
        "description": "Shastika Global's Premium Husked Coconuts are harvested at full maturity and supplied with the natural fibrous husk intact, ensuring extended freshness and maximum protection during transit. Selected for consistent size and superior oil content, they are ideal for large-scale export, food processing, and industrial applications worldwide.",
        "cards": [
            {"title": "Physical Specs", "icon": "fa-solid fa-seedling", "items": ["Colour: Brown (Well Matured)", "Weight: 500gms to 600gms", "Size: 14 - 15 Inches"]},
            {"title": "Internal Quality", "icon": "fa-solid fa-medal", "items": ["Oil Content: 60 to 63% Min", "Texture: Pure & Fine", "Status: 100% Fresh & Well Matured"]},
            {"title": "Logistics", "icon": "fa-solid fa-box-open", "items": ["Packing: 25 Pieces Per Bag", "Shelf Life: 6 Months", "Safety: Tamper-proof Packaging"]},
            {"title": "Applications", "icon": "fa-solid fa-truck", "items": ["Commercial: Hotels & Oil Factories", "Retail: Departmental Stores", "Home: Domestic Edible Use"]},
        ],
    },
    "semihuskedcoconut": {
        "name": "Semi Husked Coconut",
        "title_top": "Semi",
        "title_accent": "Husked",
        "kicker": "Premium Export Grade",
        "image": "semihusked-pd.webp",
        "description": "Shastika Global's Premium Semi-Husked Coconuts are carefully processed to retain a protective layer of husk while reducing bulk weight for efficient export. Selected from well-matured, high-quality coconuts, they deliver superior shelf life, consistent sizing, and excellent suitability for global food processing and retail markets.",
        "cards": [
            {"title": "Technical Specs", "icon": "fa-solid fa-seedling", "items": ["Weight: 500g - 600g", "Colour: Natural Brown", "Size: 14 - 15 Inches"]},
            {"title": "Quality & Features", "icon": "fa-solid fa-medal", "items": ["Oil Content: 60-63% Min", "Texture: Pure & Fine", "Status: 100% Fresh & Well Matured"]},
            {"title": "Logistics", "icon": "fa-solid fa-box-open", "items": ["Packing: 25 Pieces Per Bag", "Shelf Life: 6 Months", "Safety: Tamper-proof Packaging"]},
            {"title": "Applications", "icon": "fa-solid fa-truck", "items": ["Commercial: Hotels & Oil Factories", "Retail: Departmental Stores", "Home: Domestic Edible Use"]},
        ],
    },
    "dehusked": {
        "name": "Dehusked Coconut",
        "title_top": "Dehusked",
        "title_accent": "Coconut",
        "kicker": "Premium Export Grade",
        "image": "dehusked-pd.webp",
        "description": "Shastika Global's Premium Dehusked Coconuts are carefully processed to remove the outer husk while preserving natural freshness, moisture, and shell integrity. Selected from mature, high-quality coconuts, they offer superior shelf life, uniform size, and excellent suitability for bulk export.",
        "cards": [
            {"title": "Technical Specs", "icon": "fa-solid fa-seedling", "items": ["Colour: Brown (Well Matured)", "Weight: 500gms - 600gms", "Size: 14 - 15 Inches"]},
            {"title": "Quality & Features", "icon": "fa-solid fa-medal", "items": ["Oil Content: 60-63% Min", "Texture: Pure & Fine Texture", "Status: 100% Fresh & Well Matured"]},
            {"title": "Logistics", "icon": "fa-solid fa-box-open", "items": ["Packing: 25 Pieces Per Bag", "Shelf Life: 6 Months", "Safety: Tamper-proof Packaging"]},
            {"title": "Applications", "icon": "fa-solid fa-truck", "items": ["Commercial: Hotels & Oil Factories", "Retail: Departmental Stores", "Home: Domestic Edible Use"]},
        ],
    },
    "freshorganic": {
        "name": "Fresh Organic Coconut",
        "title_top": "Fresh",
        "title_accent": "Organic",
        "kicker": "Premium Export Grade",
        "image": "freshorganic-pd.webp",
        "description": "Shastika Global's Fresh Organic Coconuts are sourced exclusively from certified organic farms, grown without synthetic fertilizers or chemicals. Carefully harvested and processed to preserve natural purity, superior taste, and full nutritional integrity.",
        "cards": [
            {"title": "Physical Specs", "icon": "fa-solid fa-seedling", "items": ["Colour: Brown (Well Matured)", "Weight: 500gms - 600gms", "Size: 14 - 15 Inches"]},
            {"title": "Internal Quality", "icon": "fa-solid fa-medal", "items": ["Oil Content: 60-63% Min", "Texture: Pure & Fine", "Status: 100% Fresh & Organic"]},
            {"title": "Logistics", "icon": "fa-solid fa-box-open", "items": ["Packing: 25 Pieces Per Bag", "Shelf Life: 6 Months", "Safety: Tamper-proof Packaging"]},
            {"title": "Applications", "icon": "fa-solid fa-truck", "items": ["Commercial: Hotels & Oil Factories", "Retail: Organic & Health Stores", "Home: Domestic Edible Use"]},
        ],
    },
    "tomato": {
        "name": "Organic Tomato",
        "title_top": "Organic",
        "title_accent": "Tomato",
        "kicker": "Premium Export Grade",
        "image": "tomato-pd.webp",
        "description": "Shastika Global's premium fresh tomatoes are cultivated under controlled farming conditions and harvested at optimal ripeness. Carefully selected for export markets demanding freshness, firmness, and natural flavor, our tomatoes add a burst of freshness and natural goodness to every dish.",
        "cards": [
            {"title": "Physical Attributes", "icon": "fa-solid fa-seedling", "items": ["Weight: 80 - 150g", "Color: Bright Red", "Shelf Life: 15-20 Days"]},
            {"title": "Quality Profile", "icon": "fa-solid fa-award", "items": ["Grade: A Export", "Texture: Firm & Juicy", "Taste: Naturally Rich"]},
            {"title": "Packing", "icon": "fa-solid fa-box-open", "items": ["5 KG Per Carton", "Custom Packing Available", "Delivery: 3-7 Days"]},
            {"title": "Shipping", "icon": "fa-solid fa-truck", "items": ["40ft RF: Available", "20ft RF: Available", "100% Fresh Selection"]},
        ],
    },
    "watermelon": {
        "name": "Organic Watermelon",
        "title_top": "Organic",
        "title_accent": "Watermelon",
        "kicker": "Premium Export Grade",
        "image": "watermelon-pd.webp",
        "description": "Shastika Global's Premium Fresh Watermelons are grown under optimal climatic conditions and harvested at peak maturity to ensure crisp texture, deep red flesh and naturally high sweetness. Cultivated in certified organic Indian farms, they are chemical-free, nutrient-rich, and packed for global export markets.",
        "cards": [
            {"title": "Purity & Source", "icon": "fa-solid fa-seedling", "items": ["Origin: Certified Organic Indian Farms", "Chemicals: 100% Chemical-Free", "Quality: Deep Red & Nutrient-Rich"]},
            {"title": "Quality Grade", "icon": "fa-solid fa-award", "items": ["Grade: A Export Quality", "Shape: Uniform & Consistent", "Sweetness: High Brix Level"]},
            {"title": "Export Packaging", "icon": "fa-solid fa-box-open", "items": ["Sizes: 5kg, 10kg, 15kg & 20kg", "Cartons: Export Grade", "Safety: Tamper-proof Packaging"]},
            {"title": "Logistics & Origin", "icon": "fa-solid fa-truck", "items": ["Supply: Farm-to-Port Direct", "Region: Fertile Agri Belt", "Transit: Cold Chain Available"]},
        ],
    },
    "blackwatermelon": {
        "name": "Black Diamond Watermelon",
        "title_top": "Black",
        "title_accent": "Diamond",
        "kicker": "Premium Export Grade",
        "image": "blackwatermelon-pd.webp",
        "description": "Shastika Global's Black Diamond Watermelons are a rare and highly sought-after variety, grown under optimal climatic conditions and harvested at peak maturity. With their distinctive dark rind, crisp deep-red flesh and naturally high sweetness, they command premium value in international markets.",
        "cards": [
            {"title": "Purity & Source", "icon": "fa-solid fa-seedling", "items": ["Origin: Certified Organic Indian Farms", "Variety: Black Diamond (Rare)", "Chemicals: 100% Chemical-Free"]},
            {"title": "Quality Grade", "icon": "fa-solid fa-award", "items": ["Grade: A Premium Export", "Flesh: Deep Red & Crisp", "Taste: High Natural Sweetness"]},
            {"title": "Export Packaging", "icon": "fa-solid fa-box-open", "items": ["Sizes: 5kg, 10kg, 15kg & 20kg", "Cartons: Export Grade", "Safety: Tamper-proof Packaging"]},
            {"title": "Logistics & Origin", "icon": "fa-solid fa-truck", "items": ["Supply: Farm-to-Port Direct", "Freight: Sea & Air Available", "Transit: Cold Chain Available"]},
        ],
    },
    "yellowpumpkin": {
        "name": "Yellow Pumpkin",
        "title_top": "Yellow",
        "title_accent": "Pumpkin",
        "kicker": "Premium Export Grade",
        "image": "pumpkin-pd.webp",
        "description": "Shastika Global's Premium Yellow Pumpkins are cultivated and harvested at optimal maturity, ensuring vibrant colour, firm texture, and rich nutritional value for export markets worldwide.",
        "cards": [
            {"title": "Physical Specs", "icon": "fa-solid fa-seedling", "items": ["Vibrant Yellow Colour", "Firm Texture", "Fully Mature Harvest"]},
            {"title": "Quality", "icon": "fa-solid fa-award", "items": ["A Grade Export Quality", "Organic Farm Source", "Chemical Free"]},
            {"title": "Logistics", "icon": "fa-solid fa-box-open", "items": ["Export Carton Packing", "Farm to Port Supply", "Safe Packaging"]},
            {"title": "Applications", "icon": "fa-solid fa-truck", "items": ["Hotels", "Food Processing", "Retail Stores"]},
        ],
    },
    "whitepumpkin": {
        "name": "White Pumpkin",
        "title_top": "White",
        "title_accent": "Pumpkin",
        "kicker": "Premium Export Grade",
        "image": "whitepumpkin-pd.webp",
        "description": "Shastika Global's Premium White Pumpkins are harvested at ideal maturity, ensuring firm flesh, uniform size and excellent shelf life for international export markets.",
        "cards": [
            {"title": "Technical Specs", "icon": "fa-solid fa-seedling", "items": ["Weight: 2-8 kg", "Round or Oblong Shape", "Firm Orange Flesh"]},
            {"title": "Storage", "icon": "fa-solid fa-award", "items": ["Up to 3 Months Shelf Life", "Controlled Temperature", "Export Ready"]},
            {"title": "Packaging", "icon": "fa-solid fa-box-open", "items": ["Export Cartons", "Crates & Net Bags", "Secure Packing"]},
            {"title": "Shipping", "icon": "fa-solid fa-truck", "items": ["Sea Freight", "Air Shipment", "Phytosanitary Certified"]},
        ],
    },
    "yellowcucumber": {
        "name": "Yellow Cucumber",
        "title_top": "Yellow",
        "title_accent": "Cucumber",
        "kicker": "Premium Export Grade",
        "image": "cucumber-pd.webp",
        "description": "Shastika Global's Premium Fresh Cucumbers are cultivated under hygienic farming conditions and harvested at optimal maturity to ensure crisp texture, uniform shape, and vibrant green color. Carefully graded and packed for export, our cucumbers offer excellent shelf life and freshness, making them ideal for international markets that demand consistent quality and reliable supply.",
        "cards": [
            {"title": "Variety & Color", "icon": "fa-solid fa-seedling", "items": ["Type: Long/Round", "Color: Vibrant Light Green", "Coating: Natural Wax Layer"]},
            {"title": "Grading & Size", "icon": "fa-solid fa-award", "items": ["Grading: 2 - 12 kg", "Standards: International Retail", "Availability: Multiple Sizes"]},
            {"title": "Longevity", "icon": "fa-solid fa-box-open", "items": ["Shelf Life: 30 - 60 Days", "Freshness: Extended Preserved", "Shipping: Long-distance Capable"]},
            {"title": "Global Logistics", "icon": "fa-solid fa-truck", "items": ["Freight: Sea & Air Available", "Supply: Year-round Available", "Compliance: Phytosanitary & HACCP"]},
        ],
    },
    "banana": {
        "name": "Cavendish Banana",
        "title_top": "Cavendish",
        "title_accent": "Banana",
        "kicker": "Premium Export Grade",
        "image": "banana-pd.webp",
        "description": "Cavendish Bananas are the most widely traded banana variety in global markets. Known for their uniform size, smooth texture, bright peel colour, and naturally sweet flavour. Preferred by global importers and retailers, they maintain consistent quality and strong consumer demand.",
        "cards": [
            {"title": "Fruit Characteristics", "icon": "fa-solid fa-seedling", "items": ["Average Weight: 180 - 250g", "Length: 18 - 25 cm", "Shape: Well Curved Finger"]},
            {"title": "Quality", "icon": "fa-solid fa-award", "items": ["Pulp: Creamy White", "Taste: Naturally Sweet", "Grade: Export Quality"]},
            {"title": "Packaging", "icon": "fa-solid fa-box-open", "items": ["Cartons: Corrugated Export Boxes", "Weight: 13kg / 18kg", "Protection: Foam + Liners"]},
            {"title": "Storage", "icon": "fa-solid fa-truck", "items": ["Temperature: 13-14 C", "Humidity: 90-95%", "Transport: Refrigerated Container"]},
        ],
    },
    "babybanana": {
        "name": "Baby Banana",
        "title_top": "Baby",
        "title_accent": "Banana",
        "kicker": "Premium Export Grade",
        "image": "babybanana-pd.webp",
        "description": "Shastika Global's Premium Baby Bananas are naturally sweet, nutrient-rich, and harvested from carefully selected farms. Known for their smooth texture and delightful taste, these bananas are ideal for fresh consumption and international export markets.",
        "cards": [
            {"title": "Fruit Quality", "icon": "fa-solid fa-seedling", "items": ["Taste: Naturally Sweet", "Texture: Soft & Creamy", "Status: 100% Fresh"]},
            {"title": "Nutritional Value", "icon": "fa-solid fa-award", "items": ["Rich in Potassium", "High Energy Source", "Natural Dietary Fiber"]},
            {"title": "Packaging", "icon": "fa-solid fa-box-open", "items": ["Packing: Export Cartons", "Protection: Damage-Free Transit", "Shelf Life: Fresh Supply"]},
            {"title": "Applications", "icon": "fa-solid fa-truck", "items": ["Retail Supermarkets", "Hotels & Restaurants", "Fresh Consumption"]},
        ],
    },
    "nendranbanana": {
        "name": "Nendran Banana",
        "title_top": "Nendran",
        "title_accent": "Banana",
        "kicker": "Premium Export Grade",
        "image": "nendranbanana-pd.webp",
        "description": "Shastika Global's Premium Nendran Bananas are Kerala's most prized variety, celebrated for their distinct rich flavour, thick peel, and high starch content. Harvested at peak maturity from traditional farms, they are widely sought for cooking, chips manufacturing, and direct consumption.",
        "cards": [
            {"title": "Physical Specs", "icon": "fa-solid fa-seedling", "items": ["Length: 12 - 14 cm", "Weight: 200 - 350g per Fruit", "Colour: Golden Yellow on Ripening"]},
            {"title": "Fruit Quality", "icon": "fa-solid fa-award", "items": ["Taste: Rich & Distinctly Sweet", "Texture: Dense & Starchy", "Status: 100% Farm Fresh"]},
            {"title": "Packaging", "icon": "fa-solid fa-box-open", "items": ["Packing: Export Cartons", "Protection: Damage-Free Transit", "Shelf Life: Up to 3 Weeks"]},
            {"title": "Applications", "icon": "fa-solid fa-truck", "items": ["Banana Chips Manufacturing", "Hotels & Restaurants", "Fresh Retail & Consumption"]},
        ],
    },
    "redbanana": {
        "name": "Red Banana",
        "title_top": "Red",
        "title_accent": "Banana",
        "kicker": "Premium Export Grade",
        "image": "redbanana-pd.webp",
        "description": "Red Bananas are a premium banana variety known for their reddish-purple peel, soft creamy texture, and naturally sweet flavor. Widely valued in international markets for their rich taste, nutritional value, and attractive appearance.",
        "cards": [
            {"title": "Product Specifications", "icon": "fa-solid fa-seedling", "items": ["Type: Fresh Red Banana", "Average Weight: 150 - 220g", "Finger Length: 16 - 20 cm", "Peel Color: Reddish Purple"]},
            {"title": "Taste & Texture", "icon": "fa-solid fa-award", "items": ["Pulp: Creamy Soft", "Taste: Naturally Sweet", "Maturity: Export Stage", "Appearance: Uniform Fingers"]},
            {"title": "Nutritional Highlights", "icon": "fa-solid fa-box-open", "items": ["Rich in Vitamin C", "High Potassium", "Natural Antioxidants", "Supports Digestion"]},
            {"title": "Packaging & Logistics", "icon": "fa-solid fa-truck", "items": ["Export Cartons: 13kg / 18kg", "Protective Liners", "Custom Labeling", "Refrigerated Transport"]},
        ],
    },
}

PRODUCT_ALIASES = {
    "cavendish-banana": "banana",
    "Cavendish-Banana": "banana",
}

# ==============================
# WEBSITE ROUTES
# ==============================

@app.route("/")
def final():
    return render_template("home.html")

@app.route("/home")
def home():
    return render_template("home.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/products")
def products():
    return render_template("products.html")

@app.route("/countries")
def countries():
    return render_template("countries.html")

@app.route('/widget/<path:filename>')
def widget_files(filename):
    return send_from_directory('widget', filename)

@app.route("/awards")
def awards():
    return render_template("awards.html")

@app.route("/team")
def team():
    return render_template("team.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/location")
def location():
    return render_template("location.html")

@app.route("/gallery")
def gallery():
    return render_template("gallery.html")

@app.route("/australia")
def australia():
    return render_template("australia.html")

@app.route("/cocobot")
def cocobot():
    return render_template("cocobot.html")

# ==============================
# DYNAMIC PRODUCT PAGES
# ==============================

@app.route("/product/<product_name>")
def product_page(product_name):
    product_key = PRODUCT_ALIASES.get(product_name, product_name)
    product = PRODUCT_CATALOG.get(product_key)
    if not product:
        abort(404)
    return render_template("product_detail.html", product=product)

# ==============================
# CONTACT FORM API
# ==============================

@app.route("/submit_contact", methods=["POST"])
def submit_contact():
    data = request.json
    contact_collection.insert_one({
        "name": data.get("name"),
        "email": data.get("email"),
        "phone": data.get("phone"),
        "subject": data.get("subject"),
        "message": data.get("message")
    })
    return jsonify({"status": "success"})

# ==============================
# PRODUCT ENQUIRY API
# ==============================

@app.route("/submit_enquiry", methods=["POST"])
def submit_enquiry():
    data = request.json
    enquiry_collection.insert_one({
        "product": data.get("product"),
        "name": data.get("name"),
        "country": data.get("country"),
        "phone": data.get("phone"),
        "email": data.get("email")
    })
    return jsonify({"status": "success"})

# ==============================
# ADMIN LOGIN
# ==============================

@app.route("/admin_login", methods=["POST"])
def admin_login():
    data = request.json
    ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@shastika.com")
    ADMIN_PASS = os.getenv("ADMIN_PASS", "Admin@123")
    if data.get("email") == ADMIN_EMAIL and data.get("password") == ADMIN_PASS:
        session["admin"] = True
        return jsonify({"status": "ok"})
    return jsonify({"status": "fail"}), 401

# ==============================
# ADMIN PANEL
# ==============================

@app.route("/admin")
def admin_panel():
    return render_template("admin.html")

@app.route("/admin/messages")
def admin_messages():
    if not session.get("admin"):
        return jsonify([]), 401
    msgs = contact_collection.find().sort("_id", -1)
    return jsonify([
        {"name": m.get("name"), "email": m.get("email"), "phone": m.get("phone"),
         "subject": m.get("subject"), "message": m.get("message")}
        for m in msgs
    ])

@app.route("/admin/enquiries")
def admin_enquiries():
    if not session.get("admin"):
        return jsonify([]), 401
    enqs = enquiry_collection.find().sort("_id", -1)
    return jsonify([
        {"product": e.get("product"), "name": e.get("name"), "country": e.get("country"),
         "phone": e.get("phone"), "email": e.get("email")}
        for e in enqs
    ])

@app.route("/admin_logout")
def admin_logout():
    session.clear()
    return redirect(url_for("admin_panel"))

# ==============================
# CUSTOM 404
# ==============================

@app.errorhandler(404)
def page_not_found(e):
    return "<h1>404 - Page Not Found</h1>", 404

# ==============================
# CHATBOT API
# ==============================

# ==============================
# CHATBOT RESPONSES
# ==============================

CHATBOT_DATA = {
    "en": {
        "welcome": "Welcome to Shastika! 🌿 How can I help you today?",
        "options": [
            "📦 Our Products",
            "🌍 Export Services",
            "💰 Get Quote",
            "📞 Contact Us"
        ]
    },
    "fr": {
        "welcome": "Bienvenue chez Shastika! 🌿 Comment puis-je vous aider?",
        "options": ["📦 Nos Produits", "🌍 Services d'Exportation", "💰 Obtenir un Devis", "📞 Nous Contacter"]
    }
}

PRODUCTS_INFO = {
    "coconut": "We offer premium coconuts: Tender Coconut, Green Coconut, and Dehusked Coconut. All organic and fresh!",
    "banana": "Our bananas include Cavendish, Red Banana, Baby Banana, and Nendran varieties - perfect for export.",
    "watermelon": "Premium watermelons and black watermelons - fresh and delicious, ready for global markets.",
    "tomato": "Farm-fresh tomatoes grown using sustainable methods.",
    "pumpkin": "White Pumpkin and Yellow Pumpkin - nutritious and versatile.",
    "cucumber": "Yellow cucumbers - fresh and crunchy.",
    "quote": "Please fill in the quotation form to get a price estimate.",
    "export": "We handle international export to multiple countries. Let's discuss your requirements!",
    "contact": "You can reach us via email, phone, or through our contact form."
}

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

@app.route("/", methods=["GET"])
def chatbot_welcome():
    lang = request.args.get("lang", "en")
    data = CHATBOT_DATA.get(lang, CHATBOT_DATA["en"])
    return jsonify(data)

@app.route("/chat", methods=["POST"])
def chatbot_message():
    data = request.get_json(silent=True) or {}
    user_message = data.get("message", "").lower()
    lang = data.get("lang", "en")
    
    # Simple keyword matching to generate responses
    response = "Thank you for your message! How else can I help you?"
    
    if any(word in user_message for word in ["coconut", "tender", "green", "husked"]):
        response = PRODUCTS_INFO.get("coconut", "")
    elif any(word in user_message for word in ["banana", "cavendish", "red", "nendran"]):
        response = PRODUCTS_INFO.get("banana", "")
    elif any(word in user_message for word in ["watermelon"]):
        response = PRODUCTS_INFO.get("watermelon", "")
    elif any(word in user_message for word in ["tomato"]):
        response = PRODUCTS_INFO.get("tomato", "")
    elif any(word in user_message for word in ["pumpkin", "cucumber"]):
        response = PRODUCTS_INFO.get("pumpkin", "")
    elif any(word in user_message for word in ["quote", "price", "quotation"]):
        response = PRODUCTS_INFO.get("quote", "")
        return jsonify({"response": response, "reply": "SHOW_QUOTE_FORM"})
    elif any(word in user_message for word in ["export", "international"]):
        response = PRODUCTS_INFO.get("export", "")
    elif any(word in user_message for word in ["contact", "phone", "email"]):
        response = PRODUCTS_INFO.get("contact", "")
    
    return jsonify({"response": response, "reply": response})

@app.route("/contact-submit", methods=["POST"])
def contact_submit():
    data = request.get_json(silent=True) or {}
    contact_collection.insert_one({
        "name": data.get("name"),
        "email": data.get("email"),
        "phone": data.get("phone"),
        "message": data.get("message", "")
    })
    return jsonify({"status": "success", "message": "Thank you! We'll contact you soon."})

@app.route("/quote-submit", methods=["POST"])
def quote_submit():
    data = request.get_json(silent=True) or {}
    enquiry_collection.insert_one({
        "company": data.get("company"),
        "product": data.get("product"),
        "quantity": data.get("quantity"),
        "destination": data.get("destination"),
        "phone": data.get("phone"),
        "whatsapp": data.get("whatsapp"),
        "timestamp": os.popen("date").read()
    })
    return jsonify({"status": "success", "message": "Quote request submitted!"})

# ==============================
# RUN SERVER
# ==============================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)