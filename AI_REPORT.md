# AI Report: Cao Bang Travel Map — Lịch Sử Thay Đổi

> **Dành cho AI tiếp theo:** Đây là tài liệu tổng hợp tất cả những gì đã được thực hiện trên dự án này. Đọc kỹ trước khi chỉnh sửa bất kỳ thứ gì.

---

## 📁 Cấu Trúc Dự Án

```
CAO BANG SUPER MAP/
├── index.html       — Trang chính, import tất cả JS/CSS
├── app.js           — Logic bản đồ chính (Leaflet), hàm refresh(), visibility
├── data.js          — Dữ liệu POI (địa điểm), MAP_CONFIG, cấu hình ngưỡng zoom
├── highways.js      — [MỚI] Dữ liệu toạ độ các tuyến đường nổi bật (main roads)
├── trips.js         — Dữ liệu các lịch trình du lịch (itinerary polylines)
├── style.css        — CSS chính
├── AI_REPORT.md     — [MỚI] File này — báo cáo cho AI
├── START-ADMIN.bat  — [MỚI] Launcher cho admin panel
└── admin/           — [MỚI] Panel quản trị
    ├── index.html
    ├── server.js
    └── backups/
```

---

## 🛠️ Thay Đổi Đã Thực Hiện (theo thứ tự thời gian)

---

### 1. Sửa Toạ Độ Tuyến Đường Màu Hồng (Pink) — `pacbo-khaucoc`

**Vấn đề:** Tuyến đường màu hồng từ Pác Bó đến Khâu Cốc Chà bị vẽ sai, có các đoạn đường đi lùi lại (backtracking loops) khiến đường trông bị rối.

**Cách sửa:** Dùng OSRM routing để lấy toạ độ đường đi thực tế theo tuyến đường chính từ hang Pác Bó đến đèo Khâu Cốc Chà.

- **ID:** `pacbo-khaucoc`
- **Màu:** `#EC4899` (Pink)
- **Khoảng cách:** ~60 km, 127 điểm toạ độ
- **Điểm đầu:** `[22.90437, 105.85041]` (Pác Bó)
- **Điểm cuối:** `[22.92637, 105.7832]` (Khâu Cốc Chà)

---

### 2. Sửa Toạ Độ Tuyến Đường Màu Xanh Lá (Green) — `pacbo-road`

**Vấn đề:** Tuyến đường màu xanh từ Thành phố Cao Bằng đến Pác Bó có một đoạn thừa nhô ra gần Nước Hai.

**Cách sửa:** Reroute thẳng từ Thành phố Cao Bằng đến hang Pác Bó theo đường chính QL3, bỏ đoạn vòng vèo.

- **ID:** `pacbo-road`
- **Màu:** `#22C55E` (Green)
- **Khoảng cách:** ~51 km, 29 điểm toạ độ
- **Điểm đầu:** `[22.666, 106.255]` (Thành phố Cao Bằng)
- **Điểm cuối:** `[22.90437, 105.85041]` (Pác Bó)

---

### 3. Reroute Tuyến Đường Màu Đỏ (Red) — `baquang-bangioc`

**Vấn đề:** Tuyến đường đỏ cần:
- Kết nối thêm Thang Hen Lake và Angel Eye Mountain (trước Ba Quang)
- Đi từ Ba Quang ra **Lý Quốc** (dọc biên giới), KHÔNG phải đi về Thoong Got
- Từ Lý Quốc nối thẳng vào Thác Bản Giốc

**Lộ trình mới:**
`Thành phố Cao Bằng → Thang Hen Lake → Angel Eye Mountain → Ba Quang → Lý Quốc → Thác Bản Giốc`

- **ID:** `baquang-bangioc`
- **Màu:** `#EF4444` (Red)
- **Khoảng cách:** ~151 km, 130 điểm toạ độ
- **Tên hiển thị:** `"City → Thang Hen → Angel Eye → Ba Quang → Ly Quoc → Ban Gioc"`

---

### 4. Sửa Lỗi Highway Biến Mất Khi Zoom Vào — `app.js`

**Vấn đề:** Khi zoom đến level ≥ 12 (City View), tất cả các đường nổi bật (highwayLayer) bị ẩn hoàn toàn vì điều kiện `!cityVisible` trong hàm `refresh()`.

**Nguyên nhân gốc (app.js ~line 257):**
```javascript
// Code cũ — ẩn hoàn toàn khi zoom vào
var wantHw = highwaysToggle && !cityVisible && !activeTrip;
```

**Cách sửa (app.js lines 116–127 và 257–270):**

1. Thêm mảng `highwayLines[]` để theo dõi các polyline màu (ngoài `highwayCasings[]` đã có).
2. Thay điều kiện ẩn thành:
   ```javascript
   // Code mới — chỉ ẩn khi đang xem Trip
   var wantHw = highwaysToggle && !activeTrip;
   ```
3. Thêm logic fade động trong `refresh()`:
   ```javascript
   if (highwaysOn2) {
     var hwFaded = cityVisible;
     var casingW = hwFaded ? 4 : 8;
     var casingO = hwFaded ? 0.25 : 0.9;
     var lineW   = hwFaded ? 2.5 : 4.5;
     var lineO   = hwFaded ? 0.4 : 0.95;
     highwayCasings.forEach(c => c.setStyle({ weight: casingW, opacity: casingO }));
     highwayLines.forEach(l => l.setStyle({ weight: lineW, opacity: lineO }));
   }
   ```

**Kết quả:**
| Zoom | Nét viền (casing) | Nét màu (line) |
|---|---|---|
| Province (< 12) | 8px, opacity 90% | 4.5px, opacity 95% |
| City (≥ 12) | 4px, opacity 25% | 2.5px, opacity 40% |
| Trip mode | Ẩn hoàn toàn | Ẩn hoàn toàn |

---

### 5. Thêm Tuyến Đường Mới — Khâu Cốc Chà → Hà Giang (Mèo Vạc)

**Mục đích:** Hỗ trợ lộ trình mở rộng từ Cao Bằng sang tỉnh Hà Giang, tuyến phổ biến cho các du khách đi xe máy khám phá vùng Đông Bắc.

- **ID:** `khaucoc-hagiang`
- **Màu:** `#D946EF` (Fuchsia / Hồng cánh sen)
- **Khoảng cách:** ~91 km, 105 điểm toạ độ
- **Điểm đầu:** `[22.92637, 105.7832]` (Khâu Cốc Chà)
- **Điểm cuối:** `[23.164329, 105.405358]` (Mèo Vạc, Hà Giang)

---

### 6. Thêm Tuyến Đường Cảnh Quan — Thác Bản Giốc → Pi Phà → Pác Ngà → Trùng Khánh

**Mục đích:** Vẽ nổi bật tuyến đường cảnh quan đẹp dọc theo sông Quây Sơn từ Thác Bản Giốc đến các điểm ngắm cảnh và về Trùng Khánh.

**Lộ trình:**
`Thác Bản Giốc → Điểm ngắm cảnh Pi Phà → Cầu treo Pác Ngà → Thị trấn Trùng Khánh`

- **ID:** `bangioc-pipha-trungkhanh`
- **Màu:** `#14B8A6` (Teal / Xanh ngọc — tượng trưng sông Quây Sơn)
- **Khoảng cách:** ~39 km, 58 điểm toạ độ
- **Điểm đầu:** `[22.85436, 106.72427]` (Thác Bản Giốc)
- **Điểm cuối:** `[22.83514, 106.52496]` (Thị trấn Trùng Khánh)

---

## 📋 Tổng Hợp Tất Cả Tuyến Đường Trong `highways.js`

| ID | Tên | Màu | Khoảng cách |
|---|---|---|---|
| `pacbo-khaucoc` | Pac Bo ↔ Khau Coc Cha | 🩷 Pink `#EC4899` | ~60 km |
| `pacbo-road` | City ↔ Pac Bo | 💚 Green `#22C55E` | ~51 km |
| `baquang-bangioc` | City → Thang Hen → Angel Eye → Ba Quang → Ly Quoc → Ban Gioc | 🔴 Red `#EF4444` | ~151 km |
| `khaucoc-hagiang` | Khau Coc Cha → Ha Giang (Meo Vac) | 🟣 Fuchsia `#D946EF` | ~91 km |
| `bangioc-pipha-trungkhanh` | Ban Gioc → Pi Pha → Pac Nga → Trung Khanh | 🩵 Teal `#14B8A6` | ~39 km |

---

## 🔧 Cơ Chế Hoạt Động Quan Trọng (cần hiểu trước khi sửa)

### Hàm `refresh()` trong `app.js`

Đây là hàm trung tâm điều khiển hiển thị của bản đồ. Được gọi mỗi khi:
- Zoom thay đổi (sự kiện `zoomend`)
- Người dùng bấm nút Province / City / Trip

```javascript
// Ngưỡng zoom quan trọng
var cityVisible = zoom >= MAP_CONFIG.cityThreshold; // cityThreshold = 12 (data.js)
var activeTrip = ...; // true khi đang xem 1 lịch trình cụ thể
```

### Thứ tự ưu tiên hiển thị
1. **Trip mode (`activeTrip = true`):** Ẩn tất cả highway layers
2. **City zoom (zoom ≥ 12):** Highway vẫn hiển thị nhưng mờ + mỏng hơn
3. **Province zoom (zoom < 12):** Highway hiển thị đầy đủ nét

### `highways.js` — Cấu trúc dữ liệu
```javascript
var HIGHWAYS = [
  {
    id: "route-id",           // ID duy nhất
    name: "Tên hiển thị",     // Tên đường
    color: "#RRGGBB",         // Màu nét đường
    km: 60,                   // Khoảng cách (km)
    line: [[lat, lng], ...]   // Mảng toạ độ [latitude, longitude]
  },
  // ...
];
```

> ⚠️ **Lưu ý:** Toạ độ trong `line` theo thứ tự `[lat, lng]` (Leaflet convention), **KHÔNG phải** `[lng, lat]` (GeoJSON convention). OSRM trả về `[lng, lat]`, phải đảo lại khi import.

---

## 🚀 Git — Trạng Thái Hiện Tại

- **Branch:** `main`
- **Remote:** `https://github.com/liangling153154-ship-it/CBtravelmap.git`
- **Commit gần nhất:** `fb90729` — *"feat: add highway highlights, scenic routes, and fade behavior on zoom"*
- **Trạng thái:** ✅ Up to date với `origin/main`

---

## 🗺️ Toạ Độ Tham Khảo Các Địa Điểm Chính

| Địa điểm | Lat | Lng |
|---|---|---|
| Thành phố Cao Bằng | 22.666 | 106.255 |
| Hang Pác Bó | 22.90437 | 105.85041 |
| Đèo Khâu Cốc Chà | 22.92637 | 105.7832 |
| Mèo Vạc (Hà Giang) | 23.164329 | 105.405358 |
| Thác Bản Giốc | 22.85436 | 106.72427 |
| Điểm ngắm cảnh Pi Phà | 22.884 | 106.583 |
| Cầu treo Pác Ngà | 22.899 | 106.562 |
| Thị trấn Trùng Khánh | 22.83514 | 106.52496 |
| Thang Hen Lake | 22.718 | 106.425 |
| Angel Eye Mountain | 22.73 | 106.48 |
| Ba Quang | 22.77 | 106.6 |
| Lý Quốc (biên giới) | 22.84 | 106.67 |
