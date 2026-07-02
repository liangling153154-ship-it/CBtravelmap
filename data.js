/* =====================================================================
   CAO BANG TRAVEL MAP — DATA
   ---------------------------------------------------------------------
   Edit this file to add / move / remove places. No build step needed.

   Fields:
     id        unique slug
     name      English display name
     localName Vietnamese name (shown small — useful to show drivers)
     category  one of CATEGORIES keys below
     tier      "province" (shown when zoomed out) | "city" (zoom >= 12)
     lat, lng  WGS84 coordinates  (open index.html?edit and click the
               map to copy exact coordinates to your clipboard)
     minZoom   optional — hide the pin below this zoom (declutters)
     desc      1–2 line English description
     distance  optional — travel info line (province tier)
     img       optional — photo URL (falls back to a styled header)
     bookUrl   optional — shows a "Book now" button
     phone     optional — shows a "Call" button
     approx    true = coordinates are approximate, please fine-tune
     featured  true = highlighted pin with a star badge
   ===================================================================== */

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
  cityImg: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Thanhphocaobang2024.jpg/330px-Thanhphocaobang2024.jpg"
};

var POIS = [

  /* ================= PROVINCE — East: Ban Gioc route ================= */
  {
    id: "ban-gioc", name: "Ban Gioc Waterfall", localName: "Thác Bản Giốc",
    category: "sights", tier: "province", lat: 22.8536, lng: 106.7240,
    desc: "Southeast Asia's widest waterfall, thundering in tiers on the Chinese border. Best flow Sep–Nov; bamboo rafts run right into the spray.",
    distance: "85 km east of the city · ~2 h by car or motorbike",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Bangioc9tam.jpg/330px-Bangioc9tam.jpg",
    featured: true
  },
  {
    id: "nguom-ngao", name: "Nguom Ngao Cave", localName: "Động Ngườm Ngao",
    category: "sights", tier: "province", lat: 22.8266, lng: 106.7050, minZoom: 10,
    desc: "A 2 km walk-through cave of golden stalactites, 10 minutes from Ban Gioc. Cool inside all year — perfect midday escape.",
    distance: "82 km east · pairs with Ban Gioc",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/%C4%90%E1%BB%99ng_Ng%C6%B0%E1%BB%9Dm_Ngao.jpg/330px-%C4%90%E1%BB%99ng_Ng%C6%B0%E1%BB%9Dm_Ngao.jpg"
  },
  {
    id: "khuoi-ky", name: "Khuoi Ky Stone Village", localName: "Làng đá Khuổi Ky",
    category: "culture", tier: "province", lat: 22.8380, lng: 106.7075, minZoom: 11, approx: true,
    desc: "400-year-old Tày village of stone stilt houses between Ban Gioc and Nguom Ngao. Several families run homestays."
  },
  {
    id: "lans-homestay", name: "Lan's Homestay", localName: "Homestay Làng đá Khuổi Ky",
    category: "stay", tier: "province", lat: 22.8385, lng: 106.7068, minZoom: 12, approx: true,
    desc: "The best-known stone-house homestay in Khuoi Ky — rice-paddy views and family dinners. Book ahead in autumn."
  },
  {
    id: "yen-nhi-homestay", name: "Yen Nhi Homestay", localName: "Homestay Yến Nhi",
    category: "stay", tier: "province", lat: 22.8470, lng: 106.7150, minZoom: 12, approx: true,
    desc: "Simple, friendly homestay minutes from the falls — handy for a sunrise visit before the tour buses arrive."
  },
  {
    id: "phat-tich-pagoda", name: "Phat Tich Truc Lam Pagoda", localName: "Chùa Phật Tích Trúc Lâm Bản Giốc",
    category: "culture", tier: "province", lat: 22.8500, lng: 106.7180, minZoom: 11, approx: true,
    desc: "Hillside pagoda with the classic panorama over Ban Gioc falls. Free entry, short climb, best light in the afternoon."
  },
  {
    id: "trung-khanh", name: "Trung Khanh Town", localName: "Thị trấn Trùng Khánh",
    category: "food", tier: "province", lat: 22.8290, lng: 106.5180, minZoom: 10, approx: true,
    desc: "Last proper town before Ban Gioc — noodle lunches, fuel and ATMs. Famous for roasted chestnuts in Oct–Nov.",
    distance: "62 km east · natural lunch stop"
  },
  {
    id: "ma-phuc", name: "Ma Phuc Pass", localName: "Đèo Mã Phục",
    category: "sights", tier: "province", lat: 22.7220, lng: 106.3230, minZoom: 10, approx: true,
    desc: "Seven switchbacks squeezed between twin limestone walls on the road to Ban Gioc. Pull over at the top viewpoint.",
    distance: "22 km east · on QL3 to Ban Gioc"
  },
  {
    id: "quang-uyen", name: "Quang Uyen Roast Duck", localName: "Vịt quay 7 vị Quảng Uyên",
    category: "food", tier: "province", lat: 22.6990, lng: 106.4440, minZoom: 10, approx: true,
    desc: "Classic lunch stop on the Ban Gioc run: seven-spice roast duck. Every 5th day a hill-tribe market floods the main street.",
    distance: "37 km east · halfway to Ban Gioc"
  },
  {
    id: "phia-thap", name: "Phia Thap Incense Village", localName: "Làng hương Phia Thắp",
    category: "culture", tier: "province", lat: 22.6900, lng: 106.4000, minZoom: 11, approx: true,
    desc: "Nùng An village where every yard dries fans of pink incense sticks made from wild bee-tree bark. Combine with Quang Uyen."
  },

  /* ================= PROVINCE — Northeast: lakes ================= */
  {
    id: "thang-hen", name: "Thang Hen Lake", localName: "Hồ Thang Hen",
    category: "sights", tier: "province", lat: 22.7570, lng: 106.3060, approx: true,
    desc: "A chain of 36 karst lakes that rise and fall with underground rivers. Kayak rental and stilt-house lodges on the shore.",
    distance: "30 km northeast · ~45 min"
  },
  {
    id: "mat-than", name: "Angel Eye Mountain", localName: "Núi Mắt Thần",
    category: "sights", tier: "province", lat: 22.7450, lng: 106.3150, minZoom: 11, approx: true,
    desc: "A karst peak pierced by a giant circular 'eye', ringed by meadows and grazing horses. Cao Bang's favourite picnic and camping spot.",
    distance: "36 km northeast · short walk from the road"
  },

  /* ================= PROVINCE — North: Pac Bo ================= */
  {
    id: "pac-bo", name: "Pac Bo Cave", localName: "Khu di tích Pác Bó",
    category: "culture", tier: "province", lat: 22.9520, lng: 106.0330,
    desc: "The border cave where Ho Chi Minh returned to Vietnam in 1941, beside the impossibly jade Lenin Stream. Easy boardwalk trails.",
    distance: "52 km north · ~1 h 15 min",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/P%C3%A1c_B%C3%B3.jpg/330px-P%C3%A1c_B%C3%B3.jpg",
    featured: true
  },

  /* ================= PROVINCE — Southwest: Phia Oac ================= */
  {
    id: "phia-oac", name: "Phia Oac Peak", localName: "Vườn quốc gia Phia Oắc – Phia Đén",
    category: "sights", tier: "province", lat: 22.5620, lng: 105.8700, approx: true,
    desc: "1,931 m cloud-forest summit famous for winter frost and abandoned French villas. Part of the UNESCO Global Geopark.",
    distance: "75 km southwest · ~2 h",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Rung_suong_mu_Phia_Oac.JPG/330px-Rung_suong_mu_Phia_Oac.JPG"
  },
  {
    id: "kolia", name: "Kolia Tea Farm & Lodge", localName: "Nông trại Kolia, Phia Đén",
    category: "stay", tier: "province", lat: 22.5560, lng: 105.8830, minZoom: 11, approx: true,
    desc: "Organic tea terraces at 1,200 m with rooms, farm-to-table meals and sunrise cloud-hunting on Phia Oac's slopes.",
    distance: "70 km southwest"
  },
  {
    id: "hoai-khao", name: "Hoai Khao Village", localName: "Xóm Hoài Khao",
    category: "culture", tier: "province", lat: 22.6350, lng: 105.9600, minZoom: 10, approx: true,
    desc: "Quiet Dao Tien village doing community homestays — indigo dyeing, beeswax batik and forest walks. En route to Phia Oac.",
    distance: "60 km southwest"
  },

  /* ================= PROVINCE — Far west: Bao Lac ================= */
  {
    id: "bao-lac", name: "Bao Lac", localName: "Thị trấn Bảo Lạc",
    category: "stay", tier: "province", lat: 22.9530, lng: 105.6760, approx: true,
    desc: "Riverside market town — the classic overnight stop when riding on to the Ha Giang Loop. Lively ethnic market on Sundays.",
    distance: "134 km west · ~3 h 30 min"
  },
  {
    id: "khau-coc-cha", name: "Khau Coc Cha Pass", localName: "Đèo Khau Cốc Chà (Mẻ Pia)",
    category: "sights", tier: "province", lat: 22.8600, lng: 105.7800, minZoom: 10, approx: true,
    desc: "Vietnam's wildest road: 15 stacked switchbacks climbing out of the Bao Lac valley. The photo viewpoint is a 40-min hike above the road.",
    distance: "Near Bao Lac · far west"
  },

  /* ======================= CITY — Stay ======================= */
  {
    id: "sens-homestay", name: "Sen's Homestay", localName: "Sen Nghỉ Giờ",
    category: "stay", tier: "city", lat: 22.6663, lng: 106.2568, approx: true,
    desc: "Cosy private rooms in the centre with big-screen projectors — book by the hour to rest between road trips, or stay the night.",
    bookUrl: "https://sen-nghi-gio-production.up.railway.app/book",
    phone: "0822946888",
    featured: true
  },
  {
    id: "hoa-an-hotel", name: "Hoa An Hotel", localName: "Khách sạn Hòa An",
    category: "stay", tier: "city", lat: 22.6680, lng: 106.2555, approx: true,
    desc: "Dependable mid-range hotel in the centre — an easy walk to the market and the riverside."
  },
  {
    id: "max-boutique", name: "Max Boutique Hotel", localName: "Khách sạn Max Boutique",
    category: "stay", tier: "city", lat: 22.6641, lng: 106.2542, approx: true,
    desc: "One of the smarter addresses in town — modern rooms, breakfast included, helpful tour desk."
  },
  {
    id: "bang-giang-hotel", name: "Bang Giang Hotel", localName: "Khách sạn Bằng Giang",
    category: "stay", tier: "city", lat: 22.6693, lng: 106.2618, approx: true,
    desc: "Old landmark by the bridge over the Bang Giang river — simple but central, with easy parking."
  },
  {
    id: "primrose-homestay", name: "Primrose Homestay", localName: "Primrose Homestay Cao Bằng",
    category: "stay", tier: "city", lat: 22.6650, lng: 106.2600, approx: true,
    desc: "Backpacker favourite: dorms and doubles, motorbike rental and honest route advice for the Ban Gioc loop."
  },

  /* ======================= CITY — Food & Café ======================= */
  {
    id: "banh-cuon-row", name: "Banh Cuon Breakfast Row", localName: "Bánh cuốn canh",
    category: "food", tier: "city", lat: 22.6656, lng: 106.2556, approx: true,
    desc: "Cao Bang's signature breakfast: silky rice rolls served in pork-bone broth instead of dipping sauce. Stalls fire up from 6 am."
  },
  {
    id: "pho-chua", name: "Pho Chua Stalls", localName: "Phở chua Cao Bằng",
    category: "food", tier: "city", lat: 22.6667, lng: 106.2590, approx: true,
    desc: "The city's famous 'sour noodles' — roast duck, peanuts and a tangy dressing. Find them around the market before noon."
  },
  {
    id: "ap-chao", name: "Ap Chao Corner", localName: "Bánh áp chao",
    category: "food", tier: "city", lat: 22.6648, lng: 106.2568, approx: true,
    desc: "Winter street snack of duck fried inside a crispy rice-flour shell — vendors appear at dusk from October to February."
  },
  {
    id: "vuon-cam", name: "Vuon Cam Food Street", localName: "Phố ăn vặt Vườn Cam",
    category: "food", tier: "city", lat: 22.6634, lng: 106.2547, approx: true,
    desc: "Evening snack street: grilled skewers, sugarcane juice and sweet soups. Liveliest between 5 and 10 pm."
  },
  {
    id: "riverside-cafes", name: "Riverside Cafés", localName: "Cà phê ven sông Bằng",
    category: "food", tier: "city", lat: 22.6685, lng: 106.2605, approx: true,
    desc: "Balcony coffee with a view over the Bang Giang river, near the bridge. Order a Vietnamese egg coffee at sunset."
  },

  /* ======================= CITY — Nightlife ======================= */
  {
    id: "walking-street", name: "Kim Dong Walking Street", localName: "Phố đi bộ Kim Đồng",
    category: "nightlife", tier: "city", lat: 22.6660, lng: 106.2580, approx: true,
    desc: "Friday and Saturday nights the centre closes to traffic: street food, live music and a very local crowd."
  },
  {
    id: "bia-hoi", name: "Bia Hoi Gardens", localName: "Bia hơi",
    category: "nightlife", tier: "city", lat: 22.6702, lng: 106.2612, approx: true,
    desc: "Fresh draft beer by the glass with grilled snacks — open-air joints fill up from 6 pm. Just point at what looks good."
  },
  {
    id: "karaoke-row", name: "Karaoke Row", localName: "Karaoke",
    category: "nightlife", tier: "city", lat: 22.6638, lng: 106.2535, approx: true,
    desc: "Private-room KTV — the classic local night out. Rooms by the hour; a few venues keep English song lists."
  },

  /* ======================= CITY — Shopping ======================= */
  {
    id: "green-market", name: "Green Market", localName: "Chợ Xanh",
    category: "shopping", tier: "city", lat: 22.6667, lng: 106.2595, approx: true,
    desc: "The central market: produce, mountain herbs, kitchenware and a superb food corner. Go in the morning."
  },
  {
    id: "specialty-shops", name: "Local Specialty Shops", localName: "Đặc sản Cao Bằng",
    category: "shopping", tier: "city", lat: 22.6658, lng: 106.2545, approx: true,
    desc: "Take-home Cao Bang: roasted chestnuts, miến dong glass noodles, cassava cakes, forest honey and highland tea."
  },
  {
    id: "winmart", name: "WinMart Supermarket", localName: "Siêu thị WinMart",
    category: "shopping", tier: "city", lat: 22.6622, lng: 106.2532, approx: true,
    desc: "Modern supermarket for water, snacks, sunscreen and SIM top-ups before heading into the hills."
  },

  /* ======================= CITY — Services ======================= */
  {
    id: "banks-atms", name: "Banks & ATMs", localName: "Ngân hàng · ATM",
    category: "services", tier: "city", lat: 22.6672, lng: 106.2578, approx: true,
    desc: "Vietcombank, BIDV and Agribank branches with 24 h ATMs. Exchange USD/EUR at bank counters on weekdays — the last reliable ATMs before the border districts."
  },
  {
    id: "motorbike-rental", name: "Motorbike Rental", localName: "Thuê xe máy",
    category: "services", tier: "city", lat: 22.6652, lng: 106.2588, approx: true,
    desc: "Semi-autos and manuals for the Ban Gioc loop (~150–200k VND/day). Hotels and Primrose Homestay can arrange bikes — test the brakes."
  },
  {
    id: "petrol-station", name: "Petrolimex Fuel Station", localName: "Cây xăng Petrolimex",
    category: "services", tier: "city", lat: 22.6712, lng: 106.2502, approx: true,
    desc: "Fill the tank before leaving town — stations get sparse on mountain roads. Attendant service, cash preferred."
  },
  {
    id: "moto-repair", name: "Motorbike Repair Row", localName: "Sửa xe máy",
    category: "services", tier: "city", lat: 22.6645, lng: 106.2610, approx: true,
    desc: "Punctures, oil and chain fixes in minutes. Any shop with a 'sửa xe máy' sign will sort you out cheaply."
  },

  /* ======================= CITY — Health ======================= */
  {
    id: "provincial-hospital", name: "Provincial General Hospital", localName: "Bệnh viện Đa khoa tỉnh Cao Bằng",
    category: "health", tier: "city", lat: 22.6560, lng: 106.2470, approx: true,
    desc: "The province's main hospital with a 24/7 emergency room. For anything serious, transfer to Hanoi (~7 h) is usually advised."
  },
  {
    id: "pharmacies", name: "Pharmacy Row", localName: "Nhà thuốc",
    category: "health", tier: "city", lat: 22.6660, lng: 106.2560, approx: true,
    desc: "Well-stocked pharmacies for the basics — motion-sickness pills, rehydration salts, insect repellent. Most sell without prescription."
  },

  /* ======================= CITY — Transport ======================= */
  {
    id: "bus-station", name: "Cao Bang Bus Station", localName: "Bến xe khách Cao Bằng",
    category: "transport", tier: "city", lat: 22.6480, lng: 106.2380, approx: true,
    desc: "Sleeper buses to Hanoi (~7 h, several daily) plus local buses toward Trung Khanh / Ban Gioc and Bao Lac."
  },
  {
    id: "taxi-point", name: "Taxi & Ride Point", localName: "Điểm đón taxi",
    category: "transport", tier: "city", lat: 22.6661, lng: 106.2601, approx: true,
    desc: "Metered taxis wait near the market — or ask your hotel to call one. Ride-hailing apps barely cover Cao Bang; agree day-trip fares up front."
  }
];
