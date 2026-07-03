/* =====================================================================
   CAO BANG TRAVEL MAP — DATA
   ---------------------------------------------------------------------
   Edit this file to add / move / remove places. No build step needed.
   Every place below comes from Sen's own lists:
     · SEN WEB OTA - main/itinerary-v2/itinerary-v2-data.js  (sights)
     · SEN WEB OTA - main/food.html                          (restaurants)
     · Sen's services (rooms, motorbike rental, Ban Gioc bus)

   Fields:
     id        unique slug
     name      English display name
     localName Vietnamese name (shown small — useful to show drivers)
     category  one of CATEGORIES keys below (chips only appear for
               categories that are actually used)
     tier      "province" (shown when zoomed out) | "city" (zoom >= 12)
     lat, lng  WGS84 coordinates  (open index.html?edit and click the
               map to copy exact coordinates to your clipboard)
     minZoom   optional — hide the pin below this zoom (declutters)
     desc      1–2 line English description
     distance  optional — travel info line (province tier)
     price     optional — price hint, shown next to distance
     img       optional — photo path/URL (falls back to styled header)
     maps      optional — the place's real Google Maps link (the "Google
               Maps" button opens it — reviews, hours, photos)
     mapsName  optional — the place's registered Google Maps name; makes the
               "Directions" button route to the exact business (not a bare pin)
     bookUrl   optional — shows a "Book now" button
     guideUrl  optional — shows a guide button (label = guideLabel)
     phone     optional — shows a "Call" button
     pick      true = "Sen's pick" badge on the card
     veg       true = "Veg-friendly" badge on the card
     approx    true = coordinates are approximate, please fine-tune
     featured  true = highlighted pin with a star badge

   Photos live in the "SEN WEB OTA - main" folder — deploy it together
   with the map (paths below are relative, case-sensitive on Linux!).
   ===================================================================== */

var ASSETS = "SEN WEB OTA - main/";

var CATEGORIES = {
  sights:    { label: "Sights & Nature",   color: "#0E9F6E", icon: "mountain" },
  culture:   { label: "Culture & History", color: "#D97706", icon: "landmark" },
  stay:      { label: "Stay",              color: "#6366F1", icon: "bed" },
  food:      { label: "Food & Café",       color: "#EA580C", icon: "food" },
  nightlife: { label: "Nightlife",         color: "#DB2777", icon: "wine" },
  shopping:  { label: "Shopping",          color: "#9333EA", icon: "bag" },
  services:  { label: "Services",          color: "#475569", icon: "wrench" },
  health:    { label: "Health",            color: "#DC2626", icon: "health" },
  transport: { label: "Transport",         color: "#0284C7", icon: "bus" }
};

var MAP_CONFIG = {
  cityCenter: [22.666, 106.2575],
  cityZoom: 15,
  cityThreshold: 12,          // city-tier pins appear at this zoom
  provinceCenter: [22.75, 106.20],
  provinceZoom: 9,
  maxBounds: [[21.85, 104.90], [23.45, 107.40]],
  cityImg: ASSETS + "images/hero/hero-main.jpg",
  cityPinImg: ASSETS + "images/homestay.jpg"   // photo shown in the city's map pin
};

var POIS = [

  {
    id: "ban-gioc",
    name: "Ban Gioc Waterfall",
    localName: "Thác Bản Giốc",
    category: "sights",
    tier: "province",
    lat: 22.85436,
    lng: 106.72427,
    photoPin: true,
    zPriority: 700,
    featured: true,
    desc: "Southeast Asia's widest waterfall, thundering in tiers on the Chinese border. Best flow Sep–Nov; bamboo rafts run right into the spray.",
    distance: "84.6 km east · ~2 h drive",
    img: ASSETS + "images/places/ban-gioc.jpg",
    maps: "https://maps.app.goo.gl/gyWXajPY783VWbYRA",
    mapsName: "Thác Bản Giốc"
  },

  {
    id: "nguom-ngao",
    name: "Nguom Ngao Cave",
    localName: "Động Ngườm Ngao",
    category: "sights",
    tier: "province",
    lat: 22.84542,
    lng: 106.70585,
    minZoom: 10,
    desc: "A 2 km walk-through cave of golden stalactites, 10 minutes from Ban Gioc. Cool inside all year — perfect midday escape.",
    distance: "83.5 km east · pairs with Ban Gioc",
    img: ASSETS + "images/places/nguom-ngao.jpg",
    maps: "https://maps.app.goo.gl/cbi4wK8gWubkjGKS6"
  },

  {
    id: "khuoi-ky",
    name: "Khuoi Ky Stone Village",
    localName: "Làng đá Khuổi Ky",
    category: "culture",
    tier: "province",
    lat: 22.85485,
    lng: 106.70091,
    minZoom: 11,
    desc: "400-year-old Tày village of stone stilt houses between Ban Gioc and Nguom Ngao. Several families run homestays.",
    img: ASSETS + "images/places/stone-village.jpg",
    maps: "https://maps.app.goo.gl/fwJ37eFqSRSDfErf6"
  },

  {
    id: "phat-tich-pagoda",
    name: "Phat Tich Truc Lam Pagoda",
    localName: "Chùa Phật Tích Trúc Lâm Bản Giốc",
    category: "culture",
    tier: "province",
    lat: 22.85085,
    lng: 106.72313,
    minZoom: 11,
    desc: "Hillside pagoda with the classic panorama over Ban Gioc falls. Free entry, short climb, best light in the afternoon.",
    img: ASSETS + "images/places/phat-tich.jpg",
    maps: "https://maps.app.goo.gl/aqcQssDgcGJYH9HQ6"
  },

  {
    id: "quay-son-swim",
    name: "Quay Son River Swim Spot",
    localName: "Tắm sông Quây Sơn",
    category: "sights",
    tier: "province",
    lat: 22.856,
    lng: 106.708,
    minZoom: 12,
    approx: true,
    desc: "Jade-green swimming hole in the Quay Son river near Khuoi Ky village. Summer only — the water is glacial-clear and cold.",
    distance: "83 km east · 1.5 km from Ban Gioc",
    img: ASSETS + "images/places/swimming-quay-son-river.jpg"
  },

  {
    id: "pi-pha",
    name: "Pi Pha Viewpoint",
    localName: "Điểm ngắm cảnh Pì Phà",
    category: "sights",
    tier: "province",
    lat: 22.884,
    lng: 106.583,
    minZoom: 10,
    approx: true,
    desc: "Ridge-top panorama over the Phong Nam valley — rice paddies, jade river bends and karst towers. Best light at sunrise.",
    distance: "95 km east · 30 min beyond Ban Gioc",
    img: ASSETS + "images/places/pi-pha-viewpoint.jpg"
  },

  {
    id: "pac-nga-bridge",
    name: "Pac Nga Hanging Bridge",
    localName: "Cầu treo Pác Ngà",
    category: "sights",
    tier: "province",
    lat: 22.899,
    lng: 106.562,
    minZoom: 11,
    approx: true,
    desc: "Wooden hanging bridge swaying over the Quay Son river, deep in the Phong Nam rice-paddy valley. A photographers' favourite.",
    distance: "92.5 km east",
    img: ASSETS + "images/places/pac-nga-hanging-bridge.jpg"
  },

  {
    id: "ba-quang",
    name: "Ba Quang Hills",
    localName: "Đồi cỏ cháy Vinh Quý (Bả Quang)",
    category: "sights",
    tier: "province",
    lat: 22.67261,
    lng: 106.6175,
    photoPin: true,
    zPriority: 600,
    desc: "Bare golden hills with 360° panoramas — the famous 'burnt grass' look peaks in the dry season. Locals camp here for sunset.",
    distance: "68.2 km east · ~1 h 45 min",
    img: ASSETS + "images/places/ba-quang.jpg",
    maps: "https://maps.app.goo.gl/u34WeRJym6qau61BA"
  },

  {
    id: "thoongot",
    name: "Thoong Got Panorama",
    localName: "Thoong Gót",
    category: "sights",
    tier: "province",
    lat: 22.83006,
    lng: 106.61694,
    minZoom: 11,
    desc: "Roadside panorama over a horseshoe bend of the Quay Son river — an easy photo stop on the way to Ban Gioc.",
    distance: "70.7 km east · on the Ban Gioc road",
    img: ASSETS + "images/places/thoongot.jpg",
    maps: "https://maps.app.goo.gl/NMmEz9uQupietzm36"
  },

  {
    id: "blacksmith",
    name: "Pac Rang Forging Village",
    localName: "Làng rèn Pác Rằng, Phúc Sen",
    category: "culture",
    tier: "province",
    lat: 22.68546,
    lng: 106.42057,
    minZoom: 10,
    desc: "Nung An blacksmiths have hand-forged knives over coal fires here for 300+ years. Watch the sparks fly, then buy a blade.",
    distance: "32.3 km east · ~45 min",
    img: ASSETS + "images/places/blacksmith.jpg",
    maps: "https://maps.app.goo.gl/i59gAWAHYFwmf3TMA"
  },

  {
    id: "phia-thap",
    name: "Phia Thap Incense Village",
    localName: "Làng hương Phia Thắp",
    category: "culture",
    tier: "province",
    lat: 22.696,
    lng: 106.398,
    minZoom: 11,
    approx: true,
    desc: "Nùng An village where every yard dries fans of pink incense sticks made from wild bee-tree bark. Next door to the forging village.",
    distance: "35 km east · ~50 min",
    img: ASSETS + "images/places/phia-thap-village-incense.jpg"
  },

  {
    id: "dia-tren",
    name: "Dia Tren Paper Village",
    localName: "Làng giấy bản Dìa Trên",
    category: "culture",
    tier: "province",
    lat: 22.714,
    lng: 106.41,
    minZoom: 12,
    approx: true,
    desc: "Village still hand-making 'giay ban' bamboo paper the ancient way — soaking, pulping and sun-drying sheets in the yard.",
    distance: "28.5 km east",
    img: ASSETS + "images/places/dia-tren-village-paper.jpg"
  },

  {
    id: "thang-hen",
    name: "Thang Hen Lake",
    localName: "Hồ Thang Hen",
    category: "sights",
    tier: "province",
    lat: 22.759,
    lng: 106.2972,
    minZoom: 10,
    labelAbove: true,
    desc: "A chain of 36 karst lakes that rise and fall with underground rivers. Kayak rental and stilt-house lodges on the shore.",
    distance: "28.2 km northeast · ~45 min",
    img: ASSETS + "images/places/thang-hen.jpg",
    maps: "https://maps.app.goo.gl/Vw7fLEnYAZUcYExaA"
  },

  {
    id: "mat-than",
    name: "Angel Eye Mountain",
    localName: "Núi Mắt Thần",
    category: "sights",
    tier: "province",
    lat: 22.77421,
    lng: 106.31766,
    photoPin: true,
    zPriority: 800,
    labelAbove: true,
    desc: "A karst peak pierced by a giant circular 'eye', ringed by meadows and grazing horses. Cao Bang's favourite picnic and camping spot.",
    distance: "26.5 km northeast · short walk from the road",
    img: ASSETS + "images/places/eye-mountain.jpg",
    maps: "https://maps.app.goo.gl/RHmtCPCC7nrTbKcm7"
  },

  {
    id: "pac-bo",
    name: "Pac Bo Cave",
    localName: "Khu di tích Pác Bó",
    category: "culture",
    tier: "province",
    lat: 22.98708,
    lng: 106.0504,
    photoPin: true,
    zPriority: 500,
    featured: true,
    desc: "The border cave where Ho Chi Minh returned to Vietnam in 1941, beside the impossibly jade Lenin Stream. Easy boardwalk trails.",
    distance: "50.4 km north · ~1 h 15 min",
    img: ASSETS + "images/places/pac-bo.jpg",
    maps: "https://maps.app.goo.gl/CbrfWz1GHAASczcm9",
    mapsName: "Hang Cốc Bó"
  },

  {
    id: "kim-dong",
    name: "Kim Dong Memorial",
    localName: "Khu di tích Kim Đồng",
    category: "culture",
    tier: "province",
    lat: 22.93281,
    lng: 106.04641,
    minZoom: 10,
    desc: "Memorial of Kim Dong, the 14-year-old revolutionary messenger — a peaceful, shaded stop on the road to Pac Bo.",
    distance: "44.6 km north · on the Pac Bo road",
    img: ASSETS + "images/places/kim-dong.jpg",
    maps: "https://maps.app.goo.gl/yzf3SmD1Ch8d6ohSA"
  },

  {
    id: "lung-luong",
    name: "Lung Luong Stone Flowers",
    localName: "Cúc đá Lũng Luông",
    category: "sights",
    tier: "province",
    lat: 22.92765,
    lng: 106.06731,
    minZoom: 11,
    desc: "A hillside scattered with rare daisy-shaped 'stone flower' fossils above a quiet valley — combine with Pac Bo.",
    distance: "46.4 km north",
    img: ASSETS + "images/places/lung-luong.jpg",
    maps: "https://maps.app.goo.gl/H4yuti4Z2HXgUiqh6"
  },

  {
    id: "phia-oac",
    name: "Phia Oac Peak",
    localName: "Đỉnh Phia Oắc 1931 m",
    category: "sights",
    tier: "province",
    lat: 22.61527,
    lng: 105.86343,
    desc: "1,931 m cloud-forest summit famous for winter frost and abandoned French villas. Part of the UNESCO Global Geopark.",
    distance: "63.4 km southwest · ~2 h",
    img: ASSETS + "images/places/phia-oac.jpg",
    maps: "https://maps.app.goo.gl/psHFoHu77Bmb4vkv9"
  },

  {
    id: "kolia",
    name: "Kolia Tea Farm & Lodge",
    localName: "Đồn điền chè Kolia, Phia Đén",
    category: "stay",
    tier: "province",
    lat: 22.55935,
    lng: 105.86123,
    minZoom: 10,
    desc: "Organic tea terraces at 1,200 m with rooms, farm-to-table meals and sunrise cloud-hunting on Phia Oac's slopes.",
    distance: "69.7 km southwest",
    img: ASSETS + "images/places/kolia-tea.jpg",
    maps: "https://maps.app.goo.gl/mk9rtcNMpH4z66yUA"
  },

  {
    id: "bamboo-forest",
    name: "Nguyen Binh Bamboo Forest",
    localName: "Rừng trúc Nguyên Bình",
    category: "sights",
    tier: "province",
    lat: 22.68268,
    lng: 105.84408,
    minZoom: 10,
    desc: "A boardwalk winds through a silent forest of giant bamboo — cool, green and other-worldly, best in morning mist.",
    distance: "68.1 km southwest · ~2 h",
    img: ASSETS + "images/places/bamboo.jpg",
    maps: "https://maps.app.goo.gl/38ibUAVzZFtbFi4dA"
  },

  {
    id: "khau-coc-cha",
    name: "Khau Coc Cha Pass",
    localName: "Đèo Khau Cốc Chà (15 tầng)",
    category: "sights",
    tier: "province",
    lat: 22.92637,
    lng: 105.7832,
    photoPin: true,
    zPriority: 400,
    desc: "Vietnam's wildest road: 15 stacked switchbacks climbing out of the Bao Lac valley. The photo viewpoint is a short hike above the road.",
    distance: "87.9 km west · ~2 h 45 min",
    img: ASSETS + "images/places/khau-coc-cha.jpg",
    maps: "https://maps.app.goo.gl/2aMpTG8VB2NJbous5"
  },

  {
    id: "sens-homestay",
    name: "Sen's Homestay",
    localName: "Sen's Homestay – Tours & Motorbike Rental",
    category: "stay",
    tier: "city",
    lat: 22.67379,
    lng: 106.25561,
    minZoom: 12,
    zPriority: 300,
    featured: true,
    desc: "Cosy rooms with big-screen projectors, homemade breakfast & coffee, motorbike rental and honest local tips — book hourly or overnight.",
    img: ASSETS + "images/homestay.jpg",
    maps: "https://maps.app.goo.gl/PQXqThDmfQtj135CA",
    mapsName: "Sen’s Homestay – Tours & Motobike Rental",
    bookUrl: "https://sen-nghi-gio-production.up.railway.app/book",
    phone: "0822946888"
  },

  {
    id: "motorbike-rental",
    name: "Motorbike Rental at Sen's",
    localName: "Thuê xe máy — Sen's Homestay",
    category: "services",
    tier: "city",
    lat: 22.6739,
    lng: 106.256,
    minZoom: 13,
    desc: "Well-kept semi-autos, scooters and manuals for the Ban Gioc loop — helmets, rain gear and route advice included.",
    price: "180–550k₫/day",
    img: ASSETS + "images/bikes/bike-rental-hero.jpg",
    maps: "https://maps.app.goo.gl/PQXqThDmfQtj135CA",
    mapsName: "Sen’s Homestay – Tours & Motobike Rental",
    guideUrl: ASSETS + "motorbike.html",
    guideLabel: "Bikes & prices",
    phone: "0822946888"
  },

  {
    id: "ban-gioc-bus-stop",
    name: "Ban Gioc Bus Stop (at Sen's)",
    localName: "Xe buýt Hòa Bình đi Bản Giốc",
    category: "transport",
    tier: "city",
    lat: 22.6736,
    lng: 106.2552,
    minZoom: 13,
    desc: "The Hoa Binh public bus to Ban Gioc passes right in front of Sen's — flag it down from the pavement and pay on board. Best departures 7:25–8:00 am; last bus back from the falls at 5 pm.",
    img: ASSETS + "bus/bus-hero.jpg",
    guideUrl: ASSETS + "bus/ban-gioc-bus-guide.html",
    guideLabel: "Bus guide"
  },

  {
    id: "pho-chua-quyen",
    name: "Pho Chua Quyen",
    localName: "Phở Chua Gia Truyền Quyên",
    category: "food",
    tier: "city",
    lat: 22.66593,
    lng: 106.25623,
    minZoom: 13,
    pick: true,
    desc: "Cold rice-noodle salad with roast duck, crispy fried potato and a tangy sweet-sour dressing — a Cao Bang original you won't find elsewhere.",
    price: "from 35,000₫ · breakfast–lunch",
    img: ASSETS + "images/Food/pho-chua/1.jpg",
    maps: "https://maps.app.goo.gl/Bv9JXW63mBWqjyrBA",
    mapsName: "Phở Chua Gia Truyền Quyên",
    guideUrl: ASSETS + "food.html",
    guideLabel: "Food guide"
  },

  {
    id: "banh-cuon-phong-uyen",
    name: "Banh Cuon Phong Uyen",
    localName: "Bánh cuốn Phong Uyên (Phố Cũ)",
    category: "food",
    tier: "city",
    lat: 22.66418,
    lng: 106.25696,
    minZoom: 13,
    pick: true,
    desc: "Silky steamed rice rolls served Cao Bang-style: in hot pork-bone broth with a poached egg, not fish sauce.",
    price: "~35,000₫ · all day",
    img: ASSETS + "images/Food/banh-cuon/1.jpg",
    maps: "https://maps.app.goo.gl/MeTDqWwXvL1vTvSVA",
    mapsName: "Bánh cuốn Phố Cũ(bánh cuốn phong uyên)",
    guideUrl: ASSETS + "food.html",
    guideLabel: "Food guide"
  },

  {
    id: "pho-vit-dung-thinh",
    name: "Pho Vit Dung Thinh",
    localName: "Phở Vịt Dung Thịnh",
    category: "food",
    tier: "city",
    lat: 22.66423,
    lng: 106.26515,
    minZoom: 13,
    desc: "Roast-duck pho — duck marinated with mac mat forest leaves and roasted till the skin shatters. This branch roasts fresh in the evening.",
    price: "from 40,000₫ · dinner",
    img: ASSETS + "images/Food/pho-vit-quay/1.jpg",
    maps: "https://maps.app.goo.gl/uaWm8fFdpRFge5zb6",
    mapsName: "Phở Vịt Dung Thịnh - Đặc Sản Cao Bằng - Cao Bang Specialties",
    guideUrl: ASSETS + "food.html",
    guideLabel: "Food guide"
  },

  {
    id: "vit-quay-o-thoa",
    name: "Vit Quay Gion O Thoa",
    localName: "Vịt Quay Giòn O Thoa",
    category: "food",
    tier: "city",
    lat: 22.66205,
    lng: 106.25992,
    minZoom: 13,
    pick: true,
    desc: "Crispy roast duck and pork belly over fragrant rice or noodles — plus rare Hong Kong-style char siu, genuinely excellent.",
    price: "from 40,000₫ · lunch & dinner",
    img: ASSETS + "images/Food/vit-quay-gion/1.jpg",
    maps: "https://maps.app.goo.gl/rfJYvmaUDfKJ9LTy8",
    mapsName: "VỊT QUAY GIÒN O THOA",
    guideUrl: ASSETS + "food.html",
    guideLabel: "Food guide"
  },

  {
    id: "ap-chao-co-hac",
    name: "Ap Chao Co Hac",
    localName: "Áp chao vịt rán cô Hạc",
    category: "food",
    tier: "city",
    lat: 22.66996,
    lng: 106.25417,
    minZoom: 14,
    desc: "Deep-fried duck dumplings with a shattering crust — the street snack Cao Bang is famous for on cool evenings.",
    price: "7,000₫/piece · evening",
    img: ASSETS + "images/Food/ap-chao/1.jpg",
    maps: "https://maps.app.goo.gl/gbaghegtzEAn1Aah6",
    mapsName: "Áp chao vịt rán cô Hạc",
    guideUrl: ASSETS + "food.html",
    guideLabel: "Food guide"
  },

  {
    id: "nem-nuong-co-lo",
    name: "Nem Nuong Co Lo",
    localName: "Nem nướng Cô Lô",
    category: "food",
    tier: "city",
    lat: 22.6656,
    lng: 106.26172,
    minZoom: 14,
    desc: "Charcoal-grilled pork rolls you wrap yourself in rice paper with herbs and green mango — the warm shrimp dip is the star.",
    price: "40,000₫ · lunch & dinner",
    img: ASSETS + "images/Food/nem-nuong/1.jpg",
    maps: "https://maps.app.goo.gl/qvcCdVDPVsR4epGe9",
    mapsName: "Quan co lien",
    guideUrl: ASSETS + "food.html",
    guideLabel: "Food guide"
  },

  {
    id: "bun-cha-ha-thanh",
    name: "Bun Cha Ha Thanh",
    localName: "Bún chả Hà Thành",
    category: "food",
    tier: "city",
    lat: 22.65807,
    lng: 106.26712,
    minZoom: 14,
    desc: "Hanoi-style pork patties grilled over real charcoal, dunked in warm tangy broth with cold vermicelli and herbs.",
    price: "45,000₫ · breakfast–lunch",
    img: ASSETS + "images/Food/bun-cha/1.jpg",
    maps: "https://maps.app.goo.gl/PE3RL2QB63dm3PE29",
    mapsName: "Bún Chả Hà Thành",
    guideUrl: ASSETS + "food.html",
    guideLabel: "Food guide"
  },

  {
    id: "banh-mi-thu-thang",
    name: "Banh Mi Chao Thu Thang",
    localName: "Bánh mỳ chảo Thu Thắng",
    category: "food",
    tier: "city",
    lat: 22.66213,
    lng: 106.25998,
    minZoom: 14,
    desc: "A sizzling iron pan of eggs, grilled pork and rich meat sauce lands at your table — mop it all up with warm baguettes.",
    price: "from 45,000₫",
    img: ASSETS + "images/Food/banh-mi-chao/1.jpg",
    maps: "https://maps.app.goo.gl/J8HEs3XWh91UfQFp6",
    mapsName: "Bánh mỳ Thu Thắng",
    guideUrl: ASSETS + "food.html",
    guideLabel: "Food guide"
  },

  {
    id: "tiem-banh-trang",
    name: "Tiem Banh Trang",
    localName: "Tiệm Bánh Tráng",
    category: "food",
    tier: "city",
    lat: 22.66529,
    lng: 106.26134,
    minZoom: 15,
    veg: true,
    desc: "Grilled rice-paper 'street pizza', rice-paper salad and rolls — the perfect afternoon snack stop.",
    price: "~40,000₫ · snack",
    img: ASSETS + "images/Food/banh-trang/1.jpg",
    maps: "https://maps.app.goo.gl/Gr6YpBkR3HLWq4Mq5",
    mapsName: "Tiệm Bánh Tráng",
    guideUrl: ASSETS + "food.html",
    guideLabel: "Food guide"
  },

  {
    id: "pedros-pizza",
    name: "Pedro's Pizza",
    localName: "Pedro's Pizza",
    category: "food",
    tier: "city",
    lat: 22.66756,
    lng: 106.26157,
    minZoom: 13,
    veg: true,
    desc: "Hand-rolled thin-crust pizza from real Italian recipes — the town's western comfort-food hideout, with proper veggie options.",
    price: "from 150,000₫",
    img: ASSETS + "images/Food/pedros-pizza/1.jpg",
    maps: "https://maps.app.goo.gl/bEwd77hNN9HogEDU8",
    mapsName: "Pedro's Pizza",
    guideUrl: ASSETS + "food.html",
    guideLabel: "Food guide"
  },

  {
    id: "lela-vegan",
    name: "Lela Vegan Bistro",
    localName: "Lela Vegan",
    category: "food",
    tier: "city",
    lat: 22.6635,
    lng: 106.25954,
    minZoom: 13,
    pick: true,
    veg: true,
    desc: "The city's beloved vegan bistro — creative plant-based Vietnamese in a bright, modern room. Rare for northern Vietnam.",
    price: "from 40,000₫",
    img: ASSETS + "images/Food/lela-vegan/1.jpg",
    maps: "https://maps.app.goo.gl/ffGQ2KDsymptXf6x5",
    mapsName: "Lela Vegan Bistro Cao Bằng",
    guideUrl: ASSETS + "food.html",
    guideLabel: "Food guide"
  },

  {
    id: "duong-gio-tai",
    name: "Duong Gio Tai BBQ",
    localName: "Đồ nướng Dương Gió Tai",
    category: "food",
    tier: "city",
    lat: 22.66639,
    lng: 106.25336,
    minZoom: 14,
    pick: true,
    desc: "Chinese-spiced skewers grilled live in front of you — pick your own from the fridge and order a cold beer.",
    price: "from 50,000₫ · dinner",
    img: ASSETS + "images/Food/duong-gio-tai/1.jpg",
    maps: "https://maps.app.goo.gl/HMHDy85BgT2LGMeEA",
    mapsName: "Dương gió tai",
    guideUrl: ASSETS + "food.html",
    guideLabel: "Food guide"
  },

  {
    id: "handak-chicken",
    name: "Handak Korean Chicken",
    localName: "Handak Korean Chicken",
    category: "food",
    tier: "city",
    lat: 22.66334,
    lng: 106.25776,
    minZoom: 15,
    desc: "The only Korean fried chicken in town — crispy, saucy and a fun break from noodles.",
    price: "from 50,000₫",
    img: ASSETS + "images/Food/handak/1.jpg",
    maps: "https://maps.app.goo.gl/HZ4gnWVmdD6ZRikZ7",
    mapsName: "Handak korean chicken restaurant",
    guideUrl: ASSETS + "food.html",
    guideLabel: "Food guide"
  },

  {
    id: "tao-pho-lanh",
    name: "Tao Pho Lanh",
    localName: "Tào Phớ Lành",
    category: "food",
    tier: "city",
    lat: 22.66833,
    lng: 106.26081,
    minZoom: 15,
    veg: true,
    desc: "The creamiest tofu pudding in the city — longan, lotus seed or caramel toppings. Opens late afternoon.",
    price: "from 8,000₫ · dessert",
    img: ASSETS + "images/Food/tao-pho-lanh/1.jpg",
    maps: "https://maps.app.goo.gl/aCKapfavtxCNrim57",
    mapsName: "Tào Phớ Lành",
    guideUrl: ASSETS + "food.html",
    guideLabel: "Food guide"
  },

  {
    id: "che-pho",
    name: "Che Pho Dessert Bar",
    localName: "Chè Phố",
    category: "food",
    tier: "city",
    lat: 22.66384,
    lng: 106.2606,
    minZoom: 15,
    pick: true,
    veg: true,
    desc: "Thai sweet soups, avocado ice cream and fruit yogurts right on the walking street — something for everyone.",
    price: "from 20,000₫ · dessert",
    img: ASSETS + "images/Food/che-pho/1.jpg",
    maps: "https://maps.app.goo.gl/s2ab9RysFCkZ6V5X8",
    mapsName: "Chè Phố",
    guideUrl: ASSETS + "food.html",
    guideLabel: "Food guide"
  },

  {
    id: "fenice-caffe",
    name: "Fenice Caffè",
    localName: "Fenice Caffè – Tiệm Cafe & Bánh Ngọt",
    category: "food",
    tier: "city",
    lat: 22.66413,
    lng: 106.25944,
    minZoom: 14,
    pick: true,
    veg: true,
    desc: "Proper espresso and cappuccino with Italian desserts — home of the best tiramisu in Cao Bang.",
    price: "from 30,000₫ · café",
    img: ASSETS + "images/Food/fenice-caffe/1.jpg",
    maps: "https://maps.app.goo.gl/z8JzJAkx1Ur937ZY8",
    mapsName: "Fenice Caffè - Tiệm Cafe & Bánh Ngọt",
    guideUrl: ASSETS + "food.html",
    guideLabel: "Food guide"
  },

  {
    id: "with-us-coffee",
    name: "With Us Coffee",
    localName: "With Us Coffee",
    category: "food",
    tier: "city",
    lat: 22.66247,
    lng: 106.25896,
    minZoom: 14,
    pick: true,
    desc: "Premium matcha and good coffee alongside crispy local-style banh mi — a quick, reliable breakfast combo.",
    price: "from 20,000₫ · café",
    img: ASSETS + "images/Food/with-us-coffee/1.jpg",
    maps: "https://maps.app.goo.gl/Gv7oB79cdrhw2vGU8",
    mapsName: "With Us Coffee",
    guideUrl: ASSETS + "food.html",
    guideLabel: "Food guide"
  },

  {
    id: "yen-me-nau",
    name: "Yen — Ngon Nhu Me Nau",
    localName: "Yên - Ngon như mẹ nấu",
    category: "food",
    tier: "city",
    lat: 22.66538,
    lng: 106.25356,
    minZoom: 14,
    pick: true,
    desc: "Home-style Vietnamese family trays (com mam) and signature hotpots in a vintage room — the proper sit-down dinner in town.",
    price: "from 150,000₫ · lunch & dinner",
    img: ASSETS + "images/Food/yen-com-me-nau/1.jpg",
    maps: "https://maps.app.goo.gl/Hq7DbK77aLzs8pvUA",
    mapsName: "Yên - Ngon như mẹ nấu",
    guideUrl: ASSETS + "food.html",
    guideLabel: "Food guide"
  }
];
