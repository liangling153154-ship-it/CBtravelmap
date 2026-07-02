// itinerary-v2-data.js — destinations, distance matrix, presets, road SVG
const HOMESTAY = {x:544, y:301};
const DAY_COLORS = ['#E76F51','#52B788','#F4B860','#84a9d4','#885AB7'];

const LIBRARY = [
  {id:'home',                      name:"Sen's Homestay",               cat:'stay',    km:0,    img:'images/homestay.jpg',                          sx:544, sy:301, maps:'https://maps.app.goo.gl/PQXqThDmfQtj135CA'},
  {id:'blacksmith',                name:'Blacksmith Village',            cat:'craft',   km:32.3, img:'images/places/blacksmith.jpg',                 sx:650, sy:301,                  region:'east', maps:'https://maps.app.goo.gl/i59gAWAHYFwmf3TMA'},
  {id:'ba-quang',                  name:'Ba Quang Panorama',            cat:'nature',  km:68.2, img:'images/places/ba-quang.jpg',                   sx:764, sy:297, iconic:true, overnight:true,  region:'east', maps:'https://maps.app.goo.gl/u34WeRJym6qau61BA'},
  {id:'nguom-ngao',                name:'Nguom Ngao Cave',              cat:'nature',  km:83.5, img:'images/places/nguom-ngao.jpg',                 sx:801, sy:212, tag:'cave', iconic:true, region:'east', maps:'https://maps.app.goo.gl/cbi4wK8gWubkjGKS6'},
  {id:'stone-village',             name:'Stone Village (Khuoi Ky)',            cat:'culture', km:81.7, img:'images/places/stone-village.jpg',              sx:796, sy:216, overnight:true,  region:'east', maps:'https://maps.app.goo.gl/fwJ37eFqSRSDfErf6'},
  {id:'ban-gioc',                  name:'Ban Gioc Waterfall',                cat:'nature',  km:84.6, img:'images/places/ban-gioc.jpg',                   sx:819, sy:207, iconic:true,     region:'east', maps:'https://maps.app.goo.gl/gyWXajPY783VWbYRA'},
  {id:'thoongot',                  name:'Thoong Got Viewpoint',               cat:'nature',  km:70.7, img:'images/places/thoongot.jpg',                   sx:756, sy:220,                  region:'east', maps:'https://maps.app.goo.gl/NMmEz9uQupietzm36'},
  {id:'phat-tich',                 name:'Phat Tich Pagoda',     cat:'culture', km:83.5, img:'images/places/phat-tich.jpg',                  sx:811, sy:210,                  region:'east', maps:'https://maps.app.goo.gl/aqcQssDgcGJYH9HQ6'},
  {id:'eye-mountain',              name:'Eye Mountain Angel',                 cat:'nature',  km:26.5, img:'images/places/eye-mountain.jpg',               sx:592, sy:258, iconic:true,     region:'east', maps:'https://maps.app.goo.gl/RHmtCPCC7nrTbKcm7'},
  {id:'thang-hen',                 name:'Thang Hen Lake',               cat:'nature',  km:28.2, img:'images/places/thang-hen.jpg',                  sx:582, sy:264, overnight:true,  region:'east', maps:'https://maps.app.goo.gl/Vw7fLEnYAZUcYExaA'},
  {id:'lung-luong',                name:'Lung Luong Valley',            cat:'nature',  km:46.4, img:'images/places/lung-luong.jpg',                 sx:465, sy:156,                  region:'west', maps:'https://maps.app.goo.gl/H4yuti4Z2HXgUiqh6'},
  {id:'pac-bo',                    name:'Pac Bo - Lenin Stream',           cat:'history', km:50.4, img:'images/places/pac-bo.jpg',                     sx:444, sy:145, secondaryCat:'nature', iconic:true,                  region:'west', maps:'https://maps.app.goo.gl/CbrfWz1GHAASczcm9'},
  {id:'kim-dong',                  name:'Kim Dong Historical',          cat:'history', km:44.6, img:'images/places/kim-dong.jpg',                   sx:440, sy:164,                  region:'west', maps:'https://maps.app.goo.gl/yzf3SmD1Ch8d6ohSA'},
  {id:'khau-coc-cha',              name:'Khau Coc Cha Pass',            cat:'nature',  km:87.9, img:'images/places/khau-coc-cha.jpg',               sx:305, sy:169, tag:'14 turns', iconic:true,    region:'west', maps:'https://maps.app.goo.gl/2aMpTG8VB2NJbous5'},
  {id:'bamboo',                    name:'Nguyen Binh Bamboo',         cat:'nature',  km:68.1, img:'images/places/bamboo.jpg',                     sx:335, sy:296,                  region:'west', maps:'https://maps.app.goo.gl/38ibUAVzZFtbFi4dA'},
  {id:'phia-oac',                  name:'Phia Oac Peak',                cat:'nature',  km:63.4, img:'images/places/phia-oac.jpg',                   sx:363, sy:348,                  region:'west', maps:'https://maps.app.goo.gl/psHFoHu77Bmb4vkv9'},
  {id:'kolia-tea',                 name:'Kolia Tea Hills',                cat:'craft',   km:69.7, img:'images/places/kolia-tea.jpg',                  sx:352, sy:366, overnight:true,  region:'west', maps:'https://maps.app.goo.gl/mk9rtcNMpH4z66yUA'},
  {id:'phia-thap-village-incense', name:'Phia Thap Village - Incense',        cat:'craft',   km:35,   img:'images/places/phia-thap-village-incense.jpg',  sx:625, sy:291,                  region:'east', maps:''},
  {id:'dia-tren-village-paper',    name:'Dia Tren Village - Paper',          cat:'craft',   km:28.5, img:'images/places/dia-tren-village-paper.jpg',     sx:638, sy:279,                  region:'east', maps:''},
  {id:'swimming-quay-son-river',   name:'Swimming Quay Son River',       cat:'swim',    km:83,   img:'images/places/swimming-quay-son-river.jpg',    sx:803, sy:197,                  region:'east', maps:''},
  {id:'pac-nga-hanging-bridge',    name:'Pac Nga Hanging Bridge',            cat:'nature',  km:92.5, img:'images/places/pac-nga-hanging-bridge.jpg',     sx:724, sy:183,                  region:'east', maps:''},
  {id:'pi-pha-viewpoint',          name:'Pi Pha Viewpoint',             cat:'nature',  km:95.2, img:'images/places/pi-pha-viewpoint.jpg',           sx:736, sy:191, iconic:true,     region:'east', maps:''},
];

const KM = {
  // ── home ──────────────────────────────────────────────────────────────────
  "home->ba-quang":68.2,"ba-quang->home":68.2,
  "home->bamboo":68.1,"bamboo->home":68.1,
  "home->ban-gioc":84.6,"ban-gioc->home":84.6,
  "home->blacksmith":32.3,"blacksmith->home":32.3,
  "home->dia-tren-village-paper":28.5,"dia-tren-village-paper->home":28.5,
  "home->eye-mountain":26.5,"eye-mountain->home":26.5,
  "home->khau-coc-cha":87.9,"khau-coc-cha->home":87.9,
  "home->kim-dong":44.6,"kim-dong->home":44.6,
  "home->kolia-tea":69.7,"kolia-tea->home":69.7,
  "home->lung-luong":46.4,"lung-luong->home":46.4,
  "home->nguom-ngao":83.5,"nguom-ngao->home":83.5,
  "home->pac-bo":50.4,"pac-bo->home":50.4,
  "home->pac-nga-hanging-bridge":92.5,"pac-nga-hanging-bridge->home":92.5,
  "home->phat-tich":83.5,"phat-tich->home":83.5,
  "home->phia-oac":63.4,"phia-oac->home":63.4,
  "home->phia-thap-village-incense":35,"phia-thap-village-incense->home":35,
  "home->pi-pha-viewpoint":95.2,"pi-pha-viewpoint->home":95.2,
  "home->stone-village":81.7,"stone-village->home":81.7,
  "home->swimming-quay-son-river":83,"swimming-quay-son-river->home":83,
  "home->thang-hen":28.2,"thang-hen->home":28.2,
  "home->thoongot":70.7,"thoongot->home":70.7,
  // ── ba-quang ──────────────────────────────────────────────────────────────
  "ba-quang->bamboo":135,"bamboo->ba-quang":135,
  "ba-quang->ban-gioc":16.4,"ban-gioc->ba-quang":16.4,
  "ba-quang->blacksmith":36,"blacksmith->ba-quang":36,
  "ba-quang->dia-tren-village-paper":38.5,"dia-tren-village-paper->ba-quang":38.5,
  "ba-quang->eye-mountain":51,"eye-mountain->ba-quang":51,
  "ba-quang->khau-coc-cha":155,"khau-coc-cha->ba-quang":155,
  "ba-quang->kim-dong":110,"kim-dong->ba-quang":110,
  "ba-quang->kolia-tea":140,"kolia-tea->ba-quang":140,
  "ba-quang->lung-luong":105,"lung-luong->ba-quang":105,
  "ba-quang->nguom-ngao":15.3,"nguom-ngao->ba-quang":15.3,
  "ba-quang->pac-bo":110,"pac-bo->ba-quang":110,
  "ba-quang->pac-nga-hanging-bridge":24.5,"pac-nga-hanging-bridge->ba-quang":24.5,
  "ba-quang->phat-tich":18,"phat-tich->ba-quang":18,
  "ba-quang->phia-oac":145,"phia-oac->ba-quang":145,
  "ba-quang->phia-thap-village-incense":33.2,"phia-thap-village-incense->ba-quang":33.2,
  "ba-quang->pi-pha-viewpoint":27,"pi-pha-viewpoint->ba-quang":27,
  "ba-quang->stone-village":18,"stone-village->ba-quang":18,
  "ba-quang->swimming-quay-son-river":17.5,"swimming-quay-son-river->ba-quang":17.5,
  "ba-quang->thang-hen":52,"thang-hen->ba-quang":52,
  "ba-quang->thoongot":10,"thoongot->ba-quang":10,
  // ── bamboo ────────────────────────────────────────────────────────────────
  "bamboo->ban-gioc":145,"ban-gioc->bamboo":145,
  "bamboo->blacksmith":100,"blacksmith->bamboo":100,
  "bamboo->dia-tren-village-paper":95.5,"dia-tren-village-paper->bamboo":95.5,
  "bamboo->eye-mountain":90,"eye-mountain->bamboo":90,
  "bamboo->khau-coc-cha":51.7,"khau-coc-cha->bamboo":51.7,
  "bamboo->kim-dong":90,"kim-dong->bamboo":90,
  "bamboo->kolia-tea":10,"kolia-tea->bamboo":10,
  "bamboo->lung-luong":95,"lung-luong->bamboo":95,
  "bamboo->nguom-ngao":148,"nguom-ngao->bamboo":148,
  "bamboo->pac-bo":95,"pac-bo->bamboo":95,
  "bamboo->pac-nga-hanging-bridge":160,"pac-nga-hanging-bridge->bamboo":160,
  "bamboo->phat-tich":145,"phat-tich->bamboo":145,
  "bamboo->phia-oac":15,"phia-oac->bamboo":15,
  "bamboo->phia-thap-village-incense":100,"phia-thap-village-incense->bamboo":100,
  "bamboo->pi-pha-viewpoint":163,"pi-pha-viewpoint->bamboo":163,
  "bamboo->stone-village":148,"stone-village->bamboo":148,
  "bamboo->swimming-quay-son-river":150,"swimming-quay-son-river->bamboo":150,
  "bamboo->thang-hen":91,"thang-hen->bamboo":91,
  "bamboo->thoongot":135,"thoongot->bamboo":135,
  // ── ban-gioc ──────────────────────────────────────────────────────────────
  "ban-gioc->blacksmith":54,"blacksmith->ban-gioc":54,
  "ban-gioc->dia-tren-village-paper":56,"dia-tren-village-paper->ban-gioc":56,
  "ban-gioc->eye-mountain":68,"eye-mountain->ban-gioc":68,
  "ban-gioc->khau-coc-cha":165,"khau-coc-cha->ban-gioc":165,
  "ban-gioc->kim-dong":120,"kim-dong->ban-gioc":120,
  "ban-gioc->kolia-tea":150,"kolia-tea->ban-gioc":150,
  "ban-gioc->lung-luong":120,"lung-luong->ban-gioc":120,
  "ban-gioc->nguom-ngao":4.5,"nguom-ngao->ban-gioc":4.5,
  "ban-gioc->pac-bo":125,"pac-bo->ban-gioc":125,
  "ban-gioc->pac-nga-hanging-bridge":14.5,"pac-nga-hanging-bridge->ban-gioc":14.5,
  "ban-gioc->phat-tich":4,"phat-tich->ban-gioc":4,
  "ban-gioc->phia-oac":155,"phia-oac->ban-gioc":155,
  "ban-gioc->phia-thap-village-incense":50,"phia-thap-village-incense->ban-gioc":50,
  "ban-gioc->pi-pha-viewpoint":17.5,"pi-pha-viewpoint->ban-gioc":17.5,
  "ban-gioc->stone-village":3,"stone-village->ban-gioc":3,
  "ban-gioc->swimming-quay-son-river":1.5,"swimming-quay-son-river->ban-gioc":1.5,
  "ban-gioc->thang-hen":69,"thang-hen->ban-gioc":69,
  "ban-gioc->thoongot":15,"thoongot->ban-gioc":15,
  // ── blacksmith ────────────────────────────────────────────────────────────
  "blacksmith->dia-tren-village-paper":6.5,"dia-tren-village-paper->blacksmith":6.5,
  "blacksmith->eye-mountain":19,"eye-mountain->blacksmith":19,
  "blacksmith->khau-coc-cha":120,"khau-coc-cha->blacksmith":120,
  "blacksmith->kim-dong":75,"kim-dong->blacksmith":75,
  "blacksmith->kolia-tea":105,"kolia-tea->blacksmith":105,
  "blacksmith->lung-luong":75,"lung-luong->blacksmith":75,
  "blacksmith->nguom-ngao":51,"nguom-ngao->blacksmith":51,
  "blacksmith->pac-bo":80,"pac-bo->blacksmith":80,
  "blacksmith->pac-nga-hanging-bridge":60.5,"pac-nga-hanging-bridge->blacksmith":60.5,
  "blacksmith->phat-tich":51,"phat-tich->blacksmith":51,
  "blacksmith->phia-oac":110,"phia-oac->blacksmith":110,
  "blacksmith->phia-thap-village-incense":2.5,"phia-thap-village-incense->blacksmith":2.5,
  "blacksmith->pi-pha-viewpoint":62.5,"pi-pha-viewpoint->blacksmith":62.5,
  "blacksmith->stone-village":51,"stone-village->blacksmith":51,
  "blacksmith->swimming-quay-son-river":53,"swimming-quay-son-river->blacksmith":53,
  "blacksmith->thang-hen":20,"thang-hen->blacksmith":20,
  "blacksmith->thoongot":41,"thoongot->blacksmith":41,
  // ── dia-tren-village-paper ────────────────────────────────────────────────
  "dia-tren-village-paper->eye-mountain":24.5,"eye-mountain->dia-tren-village-paper":24.5,
  "dia-tren-village-paper->khau-coc-cha":115.5,"khau-coc-cha->dia-tren-village-paper":115.5,
  "dia-tren-village-paper->kim-dong":64.5,"kim-dong->dia-tren-village-paper":64.5,
  "dia-tren-village-paper->kolia-tea":100.5,"kolia-tea->dia-tren-village-paper":100.5,
  "dia-tren-village-paper->lung-luong":65.5,"lung-luong->dia-tren-village-paper":65.5,
  "dia-tren-village-paper->nguom-ngao":55.5,"nguom-ngao->dia-tren-village-paper":55.5,
  "dia-tren-village-paper->pac-bo":70.5,"pac-bo->dia-tren-village-paper":70.5,
  "dia-tren-village-paper->pac-nga-hanging-bridge":66,"pac-nga-hanging-bridge->dia-tren-village-paper":66,
  "dia-tren-village-paper->phat-tich":55,"phat-tich->dia-tren-village-paper":55,
  "dia-tren-village-paper->phia-oac":105.5,"phia-oac->dia-tren-village-paper":105.5,
  "dia-tren-village-paper->phia-thap-village-incense":7,"phia-thap-village-incense->dia-tren-village-paper":7,
  "dia-tren-village-paper->pi-pha-viewpoint":69,"pi-pha-viewpoint->dia-tren-village-paper":69,
  "dia-tren-village-paper->stone-village":54,"stone-village->dia-tren-village-paper":54,
  "dia-tren-village-paper->swimming-quay-son-river":57,"swimming-quay-son-river->dia-tren-village-paper":57,
  "dia-tren-village-paper->thang-hen":25.5,"thang-hen->dia-tren-village-paper":25.5,
  "dia-tren-village-paper->thoongot":42.5,"thoongot->dia-tren-village-paper":42.5,
  // ── eye-mountain ──────────────────────────────────────────────────────────
  "eye-mountain->khau-coc-cha":110,"khau-coc-cha->eye-mountain":110,
  "eye-mountain->kim-dong":65,"kim-dong->eye-mountain":65,
  "eye-mountain->kolia-tea":95,"kolia-tea->eye-mountain":95,
  "eye-mountain->lung-luong":65,"lung-luong->eye-mountain":65,
  "eye-mountain->nguom-ngao":67,"nguom-ngao->eye-mountain":67,
  "eye-mountain->pac-bo":70,"pac-bo->eye-mountain":70,
  "eye-mountain->pac-nga-hanging-bridge":75,"pac-nga-hanging-bridge->eye-mountain":75,
  "eye-mountain->phat-tich":64,"phat-tich->eye-mountain":64,
  "eye-mountain->phia-oac":100,"phia-oac->eye-mountain":100,
  "eye-mountain->phia-thap-village-incense":20,"phia-thap-village-incense->eye-mountain":20,
  "eye-mountain->pi-pha-viewpoint":78,"pi-pha-viewpoint->eye-mountain":78,
  "eye-mountain->stone-village":67,"stone-village->eye-mountain":67,
  "eye-mountain->swimming-quay-son-river":68.5,"swimming-quay-son-river->eye-mountain":68.5,
  "eye-mountain->thang-hen":2,"thang-hen->eye-mountain":2,
  "eye-mountain->thoongot":56,"thoongot->eye-mountain":56,
  // ── khau-coc-cha ──────────────────────────────────────────────────────────
  "khau-coc-cha->kim-dong":110,"kim-dong->khau-coc-cha":110,
  "khau-coc-cha->kolia-tea":75,"kolia-tea->khau-coc-cha":75,
  "khau-coc-cha->lung-luong":115,"lung-luong->khau-coc-cha":115,
  "khau-coc-cha->nguom-ngao":168,"nguom-ngao->khau-coc-cha":168,
  "khau-coc-cha->pac-bo":115,"pac-bo->khau-coc-cha":115,
  "khau-coc-cha->pac-nga-hanging-bridge":180,"pac-nga-hanging-bridge->khau-coc-cha":180,
  "khau-coc-cha->phat-tich":165,"phat-tich->khau-coc-cha":165,
  "khau-coc-cha->phia-oac":80,"phia-oac->khau-coc-cha":80,
  "khau-coc-cha->phia-thap-village-incense":120,"phia-thap-village-incense->khau-coc-cha":120,
  "khau-coc-cha->pi-pha-viewpoint":183,"pi-pha-viewpoint->khau-coc-cha":183,
  "khau-coc-cha->stone-village":168,"stone-village->khau-coc-cha":168,
  "khau-coc-cha->swimming-quay-son-river":170,"swimming-quay-son-river->khau-coc-cha":170,
  "khau-coc-cha->thang-hen":111,"thang-hen->khau-coc-cha":111,
  "khau-coc-cha->thoongot":155,"thoongot->khau-coc-cha":155,
  // ── kim-dong ──────────────────────────────────────────────────────────────
  "kim-dong->kolia-tea":95,"kolia-tea->kim-dong":95,
  "kim-dong->lung-luong":6,"lung-luong->kim-dong":6,
  "kim-dong->nguom-ngao":123,"nguom-ngao->kim-dong":123,
  "kim-dong->pac-bo":6,"pac-bo->kim-dong":6,
  "kim-dong->pac-nga-hanging-bridge":134,"pac-nga-hanging-bridge->kim-dong":134,
  "kim-dong->phat-tich":120,"phat-tich->kim-dong":120,
  "kim-dong->phia-oac":100,"phia-oac->kim-dong":100,
  "kim-dong->phia-thap-village-incense":69,"phia-thap-village-incense->kim-dong":69,
  "kim-dong->pi-pha-viewpoint":137,"pi-pha-viewpoint->kim-dong":137,
  "kim-dong->stone-village":123,"stone-village->kim-dong":123,
  "kim-dong->swimming-quay-son-river":124,"swimming-quay-son-river->kim-dong":124,
  "kim-dong->thang-hen":66,"thang-hen->kim-dong":66,
  "kim-dong->thoongot":110,"thoongot->kim-dong":110,
  // ── kolia-tea ─────────────────────────────────────────────────────────────
  "kolia-tea->lung-luong":100,"lung-luong->kolia-tea":100,
  "kolia-tea->nguom-ngao":153,"nguom-ngao->kolia-tea":153,
  "kolia-tea->pac-bo":100,"pac-bo->kolia-tea":100,
  "kolia-tea->pac-nga-hanging-bridge":165,"pac-nga-hanging-bridge->kolia-tea":165,
  "kolia-tea->phat-tich":150,"phat-tich->kolia-tea":150,
  "kolia-tea->phia-oac":5,"phia-oac->kolia-tea":5,
  "kolia-tea->phia-thap-village-incense":105,"phia-thap-village-incense->kolia-tea":105,
  "kolia-tea->pi-pha-viewpoint":168,"pi-pha-viewpoint->kolia-tea":168,
  "kolia-tea->stone-village":153,"stone-village->kolia-tea":153,
  "kolia-tea->swimming-quay-son-river":155,"swimming-quay-son-river->kolia-tea":155,
  "kolia-tea->thang-hen":96,"thang-hen->kolia-tea":96,
  "kolia-tea->thoongot":140,"thoongot->kolia-tea":140,
  // ── lung-luong ────────────────────────────────────────────────────────────
  "lung-luong->nguom-ngao":123,"nguom-ngao->lung-luong":123,
  "lung-luong->pac-bo":4,"pac-bo->lung-luong":4,
  "lung-luong->pac-nga-hanging-bridge":135,"pac-nga-hanging-bridge->lung-luong":135,
  "lung-luong->phat-tich":120,"phat-tich->lung-luong":120,
  "lung-luong->phia-oac":105,"phia-oac->lung-luong":105,
  "lung-luong->phia-thap-village-incense":70,"phia-thap-village-incense->lung-luong":70,
  "lung-luong->pi-pha-viewpoint":138,"pi-pha-viewpoint->lung-luong":138,
  "lung-luong->stone-village":123,"stone-village->lung-luong":123,
  "lung-luong->swimming-quay-son-river":125,"swimming-quay-son-river->lung-luong":125,
  "lung-luong->thang-hen":66,"thang-hen->lung-luong":66,
  "lung-luong->thoongot":110,"thoongot->lung-luong":110,
  // ── nguom-ngao ────────────────────────────────────────────────────────────
  "nguom-ngao->pac-bo":128,"pac-bo->nguom-ngao":128,
  "nguom-ngao->pac-nga-hanging-bridge":18.5,"pac-nga-hanging-bridge->nguom-ngao":18.5,
  "nguom-ngao->phat-tich":2.5,"phat-tich->nguom-ngao":2.5,
  "nguom-ngao->phia-oac":158,"phia-oac->nguom-ngao":158,
  "nguom-ngao->phia-thap-village-incense":49.5,"phia-thap-village-incense->nguom-ngao":49.5,
  "nguom-ngao->pi-pha-viewpoint":21,"pi-pha-viewpoint->nguom-ngao":21,
  "nguom-ngao->stone-village":2,"stone-village->nguom-ngao":2,
  "nguom-ngao->swimming-quay-son-river":5,"swimming-quay-son-river->nguom-ngao":5,
  "nguom-ngao->thang-hen":68,"thang-hen->nguom-ngao":68,
  "nguom-ngao->thoongot":14.5,"thoongot->nguom-ngao":14.5,
  // ── pac-bo ────────────────────────────────────────────────────────────────
  "pac-bo->pac-nga-hanging-bridge":140,"pac-nga-hanging-bridge->pac-bo":140,
  "pac-bo->phat-tich":125,"phat-tich->pac-bo":125,
  "pac-bo->phia-oac":105,"phia-oac->pac-bo":105,
  "pac-bo->phia-thap-village-incense":75,"phia-thap-village-incense->pac-bo":75,
  "pac-bo->pi-pha-viewpoint":143,"pi-pha-viewpoint->pac-bo":143,
  "pac-bo->stone-village":128,"stone-village->pac-bo":128,
  "pac-bo->swimming-quay-son-river":130,"swimming-quay-son-river->pac-bo":130,
  "pac-bo->thang-hen":71,"thang-hen->pac-bo":71,
  "pac-bo->thoongot":115,"thoongot->pac-bo":115,
  // ── pac-nga-hanging-bridge ────────────────────────────────────────────────
  "pac-nga-hanging-bridge->phat-tich":18,"phat-tich->pac-nga-hanging-bridge":18,
  "pac-nga-hanging-bridge->phia-oac":170,"phia-oac->pac-nga-hanging-bridge":170,
  "pac-nga-hanging-bridge->phia-thap-village-incense":60,"phia-thap-village-incense->pac-nga-hanging-bridge":60,
  "pac-nga-hanging-bridge->pi-pha-viewpoint":3,"pi-pha-viewpoint->pac-nga-hanging-bridge":3,
  "pac-nga-hanging-bridge->stone-village":17.5,"stone-village->pac-nga-hanging-bridge":17.5,
  "pac-nga-hanging-bridge->swimming-quay-son-river":13,"swimming-quay-son-river->pac-nga-hanging-bridge":13,
  "pac-nga-hanging-bridge->thang-hen":76,"thang-hen->pac-nga-hanging-bridge":76,
  "pac-nga-hanging-bridge->thoongot":25,"thoongot->pac-nga-hanging-bridge":25,
  // ── phat-tich ─────────────────────────────────────────────────────────────
  "phat-tich->phia-oac":155,"phia-oac->phat-tich":155,
  "phat-tich->phia-thap-village-incense":49,"phia-thap-village-incense->phat-tich":49,
  "phat-tich->pi-pha-viewpoint":21,"pi-pha-viewpoint->phat-tich":21,
  "phat-tich->stone-village":2.5,"stone-village->phat-tich":2.5,
  "phat-tich->swimming-quay-son-river":5.5,"swimming-quay-son-river->phat-tich":5.5,
  "phat-tich->thang-hen":65,"thang-hen->phat-tich":65,
  "phat-tich->thoongot":12,"thoongot->phat-tich":12,
  // ── phia-oac ──────────────────────────────────────────────────────────────
  "phia-oac->phia-thap-village-incense":110,"phia-thap-village-incense->phia-oac":110,
  "phia-oac->pi-pha-viewpoint":173,"pi-pha-viewpoint->phia-oac":173,
  "phia-oac->stone-village":158,"stone-village->phia-oac":158,
  "phia-oac->swimming-quay-son-river":160,"swimming-quay-son-river->phia-oac":160,
  "phia-oac->thang-hen":101,"thang-hen->phia-oac":101,
  "phia-oac->thoongot":145,"thoongot->phia-oac":145,
  // ── phia-thap-village-incense ─────────────────────────────────────────────
  "phia-thap-village-incense->pi-pha-viewpoint":63,"pi-pha-viewpoint->phia-thap-village-incense":63,
  "phia-thap-village-incense->stone-village":48,"stone-village->phia-thap-village-incense":48,
  "phia-thap-village-incense->swimming-quay-son-river":51,"swimming-quay-son-river->phia-thap-village-incense":51,
  "phia-thap-village-incense->thang-hen":21,"thang-hen->phia-thap-village-incense":21,
  "phia-thap-village-incense->thoongot":36.5,"thoongot->phia-thap-village-incense":36.5,
  // ── pi-pha-viewpoint ──────────────────────────────────────────────────────
  "pi-pha-viewpoint->stone-village":20,"stone-village->pi-pha-viewpoint":20,
  "pi-pha-viewpoint->swimming-quay-son-river":16,"swimming-quay-son-river->pi-pha-viewpoint":16,
  "pi-pha-viewpoint->thang-hen":79,"thang-hen->pi-pha-viewpoint":79,
  "pi-pha-viewpoint->thoongot":28,"thoongot->pi-pha-viewpoint":28,
  // ── stone-village ─────────────────────────────────────────────────────────
  "stone-village->swimming-quay-son-river":4.5,"swimming-quay-son-river->stone-village":4.5,
  "stone-village->thang-hen":68,"thang-hen->stone-village":68,
  "stone-village->thoongot":15,"thoongot->stone-village":15,
  // ── swimming-quay-son-river ───────────────────────────────────────────────
  "swimming-quay-son-river->thang-hen":69.5,"thang-hen->swimming-quay-son-river":69.5,
  "swimming-quay-son-river->thoongot":16,"thoongot->swimming-quay-son-river":16,
  // ── thang-hen ─────────────────────────────────────────────────────────────
  "thang-hen->thoongot":57,"thoongot->thang-hen":57,
};

// Suggested itineraries — curated by Sen
const ITINERARIES = [
  {
    id: '1d-highlights',
    title: 'CLASSIC ONE DAY',
    subtitle: 'The greatest hits — Ban Gioc, the cave, and the iconic Eye',
    days: 1,
    pace: 'Packed',
    vibe: 'Full of icons',
    cover: 'images/places/ban-gioc.jpg',
    plan: [
      ['blacksmith','nguom-ngao','stone-village','ban-gioc','phat-tich','eye-mountain','home']
    ]
  },
  {
    id: '2d-east-loop',
    title: 'Full East Loop 2D1N',
    subtitle: 'Ban Gioc & Quay Son river on day 1, viewpoints and Thang Hen on day 2',
    days: 2,
    pace: 'Balanced',
    vibe: 'Nature + viewpoints',
    cover: 'images/places/ban-gioc.jpg',
    plan: [
      ['blacksmith','ba-quang','ban-gioc','swimming-quay-son-river','stone-village'],
      ['phat-tich','pi-pha-viewpoint','pac-nga-hanging-bridge','eye-mountain','thang-hen','home']
    ]
  },
  {
    id: '3d-nature-history',
    title: 'Nature & History 3D2N',
    subtitle: 'Pac Bo & lakes on day 1, east villages overnight, Ban Gioc finale',
    days: 3,
    pace: 'Balanced',
    vibe: 'Nature + history',
    cover: 'images/places/pac-bo.jpg',
    plan: [
      ['pac-bo','lung-luong','eye-mountain','thang-hen','home'],
      ['blacksmith','ba-quang','nguom-ngao','stone-village'],
      ['phat-tich','ban-gioc','pi-pha-viewpoint','home']
    ]
  },
  {
    id: '3d-culture',
    title: 'Culture & Craft 4D3N',
    subtitle: 'Village artisans, history sites, and heritage stops',
    days: 3,
    pace: 'Easy',
    vibe: 'Culture',
    cover: 'images/places/blacksmith.jpg',
    plan: [
      ['blacksmith','phia-thap-village-incense','dia-tren-village-paper','eye-mountain'],
      ['pac-bo','kim-dong','lung-luong'],
      ['stone-village','phat-tich','ban-gioc']
    ]
  },
  {
    id: '4d-fullcircle',
    title: 'Full Circle 5D4N',
    subtitle: 'The complete Cao Bang — every region',
    days: 4,
    pace: 'Thorough',
    vibe: 'Everything',
    cover: 'images/places/khau-coc-cha.jpg',
    plan: [
      ['blacksmith','ba-quang','ban-gioc','phat-tich'],
      ['nguom-ngao','thoongot','eye-mountain','thang-hen','lung-luong'],
      ['pac-bo','kim-dong','khau-coc-cha'],
      ['bamboo','phia-oac','kolia-tea']
    ]
  }
];

const REGIONS = {
  east: {label:'East',  emoji:'🧭', bg:'#cce8ff', txt:'#003d7a', border:'#8ec8f5'},
  west: {label:'West',  emoji:'🧭', bg:'#c8f0d0', txt:'#1a5018', border:'#7ed4a0'},
};

// Lodging suggestions attached per overnight spot.
// Shared cluster arrays so spots in the same area show identical options.
const _KHUOI_KY_STAYS = [
  {name:'Lan Rừng Homestay', area:'in Khuoi Ky'},
  {name:'Yến Nhi Homestay',  area:'in Khuoi Ky'},
];
const _PAC_BO_STAYS = [
  {name:'Mế Farmstay',       area:'near Pac Bo'},
];
const _PHIA_OAC_STAYS = [
  {name:'Kolia Tea Hills',   area:'in Phia Oac'},
];

const SPOT_STAYS = {
  // ── Khuoi Ky / Ban Gioc cluster (east far) ──
  'stone-village':            _KHUOI_KY_STAYS,
  'ban-gioc':                 _KHUOI_KY_STAYS,
  'nguom-ngao':               _KHUOI_KY_STAYS,
  'phat-tich':                _KHUOI_KY_STAYS,
  'pi-pha-viewpoint':         _KHUOI_KY_STAYS,
  'pac-nga-hanging-bridge':   _KHUOI_KY_STAYS,
  'swimming-quay-son-river':  _KHUOI_KY_STAYS,
  'thoongot':                 _KHUOI_KY_STAYS,

  // ── Own on-site lodging ──
  'ba-quang':    [{name:'Ba Quang Panorama', area:'on site'}],
  'thang-hen':   [{name:'Thang Hen Lake',    area:'on site'}],
  'kolia-tea':   [{name:'Kolia Tea Hills',   area:'on site'}],

  // ── Eye Mountain → Thang Hen (2km) ──
  'eye-mountain': [{name:'Thang Hen Lake', area:'~2km away'}],

  // ── Pac Bo cluster (west north) ──
  'pac-bo':      _PAC_BO_STAYS,
  'kim-dong':    _PAC_BO_STAYS,
  'lung-luong':  _PAC_BO_STAYS,

  // ── Phia Oac cluster (west south) ──
  'phia-oac':       _PHIA_OAC_STAYS,
  'bamboo':         _PHIA_OAC_STAYS,
  'khau-coc-cha':   _PHIA_OAC_STAYS,
};

const CATS = [
  {id:'all',     label:'All',        emoji:'🗺️',  bg:'#2D6A4F', txt:'#ffffff'},
  {id:'nature',  label:'Nature',   emoji:'🌿',  bg:'#d4eedd', txt:'#1a4d2a'},
  {id:'craft',   label:'Craft villages', emoji:'🏺',  bg:'#fde8d0', txt:'#6b3300'},
  {id:'culture', label:'Culture',       emoji:'🏛️', bg:'#ead5f5', txt:'#3d1460'},
  {id:'history', label:'History',       emoji:'📜',  bg:'#fef0cc', txt:'#5c3800'},
  {id:'swim',    label:'Swimming',       emoji:'🏊',  bg:'#cce8ff', txt:'#003d7a'},
  {id:'stay',    label:'Stay',       emoji:'🌙',  bg:'#ffd6e0', txt:'#7a0028'},
  {id:'east',    label:'East',       emoji:'🧭',  bg:'#cce8ff', txt:'#003d7a'},
  {id:'west',    label:'West',       emoji:'🧭',  bg:'#c8f0d0', txt:'#1a5018'},
];

// Road SVG paths (as innerHTML for the <g id="roads">) — extracted from v1
const ROADS_SVG = "<g id=\"roads\" stroke=\"#E76F51\" stroke-width=\"2.5\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\" opacity=\"0.7\" pointer-events=\"none\">\n            <path d=\"M 374.0,324.0 C 374.5,323.7 378.0,321.7 379.0,321.0 C 380.0,320.3 383.5,317.9 384.0,317.0 C 384.5,316.1 383.5,312.7 384.0,312.0 C 384.5,311.3 388.0,310.1 389.0,310.0 C 390.0,309.9 392.9,310.8 394.0,311.0 C 395.1,311.2 398.9,311.9 400.0,312.0 C 401.1,312.1 404.0,311.8 405.0,312.0 C 406.0,312.2 408.9,313.7 410.0,314.0 C 411.1,314.3 414.9,315.3 416.0,315.0 C 417.1,314.7 419.9,311.4 421.0,311.0 C 422.1,310.6 425.9,311.2 427.0,311.0 C 428.1,310.8 431.0,309.2 432.0,309.0 C 433.0,308.8 435.9,308.8 437.0,309.0 C 438.1,309.2 441.9,311.0 443.0,311.0 C 444.1,311.0 447.0,309.4 448.0,309.0 C 449.0,308.6 451.9,307.4 453.0,307.0 C 454.1,306.6 457.9,305.1 459.0,305.0 C 460.1,304.9 463.0,306.2 464.0,306.0 C 465.0,305.8 467.9,303.2 469.0,303.0 C 470.1,302.8 473.9,303.8 475.0,304.0 C 476.1,304.2 479.0,304.7 480.0,305.0 C 481.0,305.3 483.9,306.7 485.0,307.0 C 486.1,307.3 489.9,307.8 491.0,308.0 C 492.1,308.2 494.9,308.8 496.0,309.0 C 497.1,309.2 500.9,310.1 502.0,310.0 C 503.1,309.9 506.0,308.3 507.0,308.0 C 508.0,307.7 510.9,307.2 512.0,307.0 C 513.1,306.8 516.9,306.3 518.0,306.0 C 519.1,305.7 522.0,304.4 523.0,304.0 C 524.0,303.6 526.9,302.6 528.0,302.0 C 529.1,301.4 533.1,298.7 534.0,298.0 C 534.9,297.3 536.7,295.3 537.0,295.0\"/>\n            <path d=\"M 704.0,218.0 C 706.0,217.8 714.0,216.5 716.0,217.0 C 720.0,218.0 726.0,222.0 728.0,223.0 C 732.0,224.0 738.0,222.0 740.0,222.0 C 744.0,222.2 750.0,224.0 752.0,224.0 C 756.0,224.3 762.0,224.0 764.0,224.0 C 768.0,223.3 775.0,219.0 776.0,218.0 C 779.0,216.3 784.0,211.0 785.0,210.0 C 788.0,208.3 794.0,204.5 796.0,204.0 C 800.0,203.0 807.0,203.3 808.0,204.0 C 812.0,205.0 818.0,208.5 820.0,210.0 C 824.0,212.5 831.0,219.0 832.0,221.0 C 835.0,224.0 838.0,230.0 838.0,232.0 C 840.0,235.0 844.5,241.0 844.0,242.0 C 843.0,244.5 837.0,246.0 835.0,246.0 C 832.0,247.0 825.0,247.5 823.0,248.0 C 820.0,249.0 812.0,253.5 811.0,255.0 C 809.0,257.5 812.0,265.0 811.0,266.0 C 810.0,267.5 802.0,267.5 800.0,268.0 C 797.0,269.0 790.0,272.0 790.0,273.0 C 789.5,275.0 796.0,281.5 796.0,283.0 C 796.5,285.5 795.0,292.5 794.0,293.0 C 792.0,294.5 784.0,294.0 782.0,293.0 C 779.0,292.5 772.0,289.5 770.0,289.0 C 767.0,288.3 760.0,287.5 758.0,287.0 C 755.0,286.5 748.0,286.0 746.0,286.0 C 743.0,285.5 736.0,283.5 734.0,284.0 C 731.0,285.0 726.0,293.0 724.0,294.0 C 721.0,296.0 714.0,298.5 712.0,298.0 C 709.0,298.2 702.0,296.0 700.0,295.0 C 697.0,294.0 690.0,290.0 688.0,289.0 C 685.0,288.0 677.0,285.5 676.0,285.0 C 673.0,283.8 671.0,282.0 671.0,282.0\"/>\n            <path d=\"M 341.0,306.0 C 340.0,304.5 338.0,302.0 338.0,301.0 C 337.0,299.0 338.5,297.0 338.0,296.0 C 337.0,294.5 333.5,293.0 333.0,292.0 C 332.0,290.5 328.5,288.5 328.0,288.0 C 327.0,287.0 323.5,285.5 323.0,285.0 C 322.0,284.5 317.5,285.0 317.0,285.0 C 316.0,285.0 313.5,282.5 313.0,282.0 C 312.0,281.0 309.5,277.5 309.0,277.0 C 308.0,276.0 304.5,276.0 304.0,276.0 C 303.0,275.5 301.5,272.0 301.0,271.0 C 300.0,269.5 298.5,266.5 298.0,266.0 C 297.5,265.0 297.0,262.0 297.0,261.0 C 296.5,260.0 296.0,257.5 296.0,257.0 C 295.5,256.0 295.0,252.5 295.0,252.0 C 294.5,251.0 291.5,247.5 291.0,247.0 C 290.5,246.0 288.5,243.5 288.0,243.0 C 287.0,242.0 293.0,239.0 293.0,239.0 C 293.5,238.5 296.5,234.5 297.0,234.0 C 297.5,233.5 298.5,229.5 299.0,229.0 C 299.5,228.0 301.0,224.5 301.0,224.0 C 301.5,223.0 305.0,220.0 305.0,220.0 C 305.5,219.5 309.0,216.0 309.0,216.0 C 309.5,215.5 315.0,215.0 315.0,215.0 C 315.5,215.0 320.0,213.0 320.0,213.0 C 320.5,212.5 324.0,208.0 324.0,208.0 C 324.5,207.5 326.0,204.0 326.0,204.0 C 326.5,203.5 326.0,200.0 326.0,199.0 C 325.5,198.0 325.0,195.0 325.0,194.0 C 324.5,193.0 325.0,190.0 325.0,189.0 C 324.5,188.0 323.0,185.5 323.0,185.0 C 322.5,184.0 320.0,180.5 320.0,180.0 C 319.5,179.0 319.0,177.5 319.0,177.0\"/>\n            <path d=\"M 451.0,171.0 C 452.0,170.5 456.0,169.0 456.0,169.0 C 457.0,168.5 461.5,167.0 461.0,167.0 C 462.0,166.5 463.5,163.5 463.0,163.0 C 463.5,162.0 466.5,159.5 466.0,159.0 C 467.0,158.0 470.5,156.0 470.0,156.0 C 471.0,155.5 475.5,157.5 475.0,158.0 C 476.0,158.5 479.5,160.5 479.0,161.0 C 480.0,161.5 484.5,164.5 484.0,165.0 C 485.0,165.5 489.5,168.5 489.0,169.0 C 490.0,169.5 494.5,170.0 494.0,170.0 C 495.0,170.0 498.5,169.5 498.0,169.0 C 499.0,168.5 503.5,167.5 503.0,167.0 C 504.0,166.5 508.5,167.0 508.0,167.0 C 509.0,167.0 513.0,167.0 512.0,167.0 C 513.0,167.0 517.5,170.0 517.0,170.0 C 518.0,170.0 522.5,167.5 522.0,167.0 C 523.0,166.5 526.5,167.0 526.0,167.0 C 527.0,167.0 531.5,167.5 531.0,168.0 C 532.0,168.5 536.5,170.5 536.0,171.0 C 537.0,171.5 540.5,175.5 540.0,176.0 C 541.0,176.5 542.5,179.5 542.0,180.0 C 543.0,180.5 546.5,183.5 546.0,184.0 C 547.0,184.5 550.5,187.5 550.0,188.0 C 551.0,188.5 554.5,191.5 554.0,192.0 C 555.0,192.5 559.5,195.5 559.0,196.0 C 560.0,196.5 564.5,199.5 564.0,200.0 C 565.0,200.5 569.5,202.5 569.0,203.0 C 570.0,203.5 573.5,205.0 573.0,205.0 C 574.0,205.5 578.5,207.5 578.0,208.0 C 579.0,208.5 583.5,210.0 583.0,210.0 C 584.0,210.5 588.0,213.5 587.0,214.0 C 588.0,214.5 592.5,217.5 592.0,218.0 C 593.0,218.5 597.5,220.0 597.0,220.0 C 598.0,220.5 599.5,220.5 599.0,221.0\"/>\n            <path d=\"M 451.0,172.0 C 452.0,172.5 454.5,175.5 454.0,176.0 C 455.0,176.5 459.5,178.5 459.0,179.0 C 460.0,179.5 463.5,181.5 463.0,182.0 C 464.0,182.5 467.5,184.0 467.0,184.0 C 468.0,184.5 471.5,187.5 471.0,188.0 C 472.0,188.5 475.5,191.5 475.0,192.0 C 476.0,192.5 480.5,195.5 480.0,196.0 C 481.0,196.5 485.5,200.0 485.0,200.0 C 486.0,200.5 488.5,203.5 488.0,204.0 C 489.0,204.5 492.5,207.5 492.0,208.0 C 493.0,208.5 495.5,211.5 495.0,212.0 C 496.0,212.5 500.5,216.5 500.0,217.0 C 501.0,217.5 498.5,220.5 498.0,221.0 C 499.0,221.5 494.5,223.5 494.0,224.0 C 495.0,224.5 489.5,226.5 489.0,227.0 C 490.0,227.5 484.5,229.5 484.0,230.0 C 485.0,230.5 484.5,233.5 484.0,234.0 C 485.0,234.5 485.5,237.5 485.0,238.0 C 486.0,238.5 487.5,241.5 487.0,242.0 C 488.0,242.5 487.5,245.5 487.0,246.0 C 488.0,246.5 491.5,250.5 491.0,251.0 C 492.0,251.5 494.5,254.5 494.0,255.0 C 495.0,255.5 497.5,258.5 497.0,259.0 C 498.0,259.5 501.5,262.5 501.0,263.0 C 502.0,263.5 506.5,266.5 506.0,267.0 C 507.0,267.5 510.5,270.5 510.0,271.0 C 511.0,271.5 515.5,275.5 515.0,276.0 C 516.0,276.5 518.5,279.5 518.0,280.0 C 519.0,280.5 522.5,283.5 522.0,284.0 C 523.0,284.5 527.5,287.5 527.0,288.0 C 528.0,288.5 532.5,290.0 532.0,290.0 C 533.0,290.5 536.5,293.5 536.0,294.0 C 537.0,294.5 537.5,294.5 537.0,295.0\"/>\n            <path d=\"M 671.0,282.0 C 673.0,282.8 682.0,285.5 683.0,286.0 C 686.0,287.0 695.0,292.5 695.0,293.0 C 697.0,294.0 706.0,297.0 707.0,297.0 C 710.0,297.5 719.0,296.5 719.0,296.0 C 721.0,295.5 728.0,289.5 729.0,288.0 C 732.0,286.5 741.0,285.5 741.0,285.0 C 744.0,285.0 753.0,286.5 753.0,287.0 C 756.0,287.5 765.0,288.0 765.0,288.0 C 768.0,288.5 777.0,292.0 777.0,292.0 C 780.0,292.5 790.0,294.5 790.0,293.0 C 792.0,292.0 798.5,289.5 798.0,288.0 C 798.5,286.5 792.0,278.5 792.0,277.0 C 792.5,275.5 795.0,270.0 795.0,268.0 C 795.5,266.5 806.0,268.5 807.0,268.0 C 809.0,267.5 809.5,261.5 809.0,260.0 C 810.0,258.5 817.0,252.5 818.0,251.0 C 820.0,249.5 829.0,247.0 830.0,246.0 C 832.0,245.0 841.0,246.5 842.0,246.0 C 844.0,245.5 842.0,237.5 840.0,236.0 C 839.0,234.5 838.0,226.5 836.0,225.0 C 834.5,223.5 825.0,215.5 824.0,214.0 C 822.5,212.5 814.0,207.5 813.0,206.0 C 811.5,204.5 802.0,203.5 801.0,203.0 C 799.0,202.5 790.0,205.5 789.0,206.0 C 787.0,206.5 782.0,214.5 781.0,216.0 C 780.0,217.5 770.0,222.0 769.0,222.0 C 768.0,222.5 758.0,225.5 757.0,225.0 C 756.0,224.5 746.0,222.5 745.0,222.0 C 744.0,221.5 734.0,222.5 733.0,223.0 C 732.0,223.5 722.0,219.5 721.0,219.0 C 720.0,218.5 710.0,218.5 708.0,218.0 C 706.0,217.5 704.5,218.0 704.0,218.0\"/>\n            <path d=\"M 537.0,295.0 C 536.5,294.5 533.0,292.0 532.0,291.0 C 531.0,290.5 528.5,289.0 528.0,288.0 C 527.0,287.5 523.5,285.5 523.0,285.0 C 522.0,284.5 519.5,281.0 519.0,280.0 C 518.0,279.5 516.5,277.0 516.0,276.0 C 515.0,275.5 511.5,273.0 511.0,272.0 C 510.0,271.5 506.5,269.0 506.0,268.0 C 505.0,267.5 502.5,265.0 502.0,264.0 C 501.0,263.5 498.5,261.0 498.0,260.0 C 497.0,259.5 494.5,256.0 494.0,255.0 C 493.0,254.5 491.5,252.0 491.0,251.0 C 490.0,250.5 488.5,248.0 488.0,247.0 C 487.0,246.5 487.5,243.5 487.0,243.0 C 486.0,242.5 485.5,240.0 485.0,239.0 C 484.0,238.5 485.5,236.0 485.0,235.0 C 484.0,234.5 483.5,231.0 484.0,230.0 C 485.0,229.0 488.0,228.0 488.0,227.0 C 489.0,226.5 493.0,226.0 493.0,225.0 C 494.0,224.5 498.0,222.0 498.0,221.0 C 499.0,220.5 500.5,218.0 500.0,217.0 C 500.5,216.0 497.0,214.0 496.0,213.0 C 495.0,212.5 492.5,210.0 492.0,209.0 C 491.0,208.5 489.5,206.0 489.0,205.0 C 488.0,204.5 485.5,202.0 485.0,201.0 C 484.0,200.5 481.5,197.0 481.0,196.0 C 480.0,195.5 476.5,194.0 476.0,193.0 C 475.0,192.5 472.5,190.0 472.0,189.0 C 471.0,188.5 468.5,186.0 468.0,185.0 C 467.0,184.5 464.5,183.0 464.0,182.0 C 463.0,181.5 459.5,181.0 459.0,180.0 C 458.0,179.5 455.5,178.0 455.0,177.0 C 454.0,176.5 451.5,174.0 451.0,173.0 C 450.0,172.5 451.0,172.0 451.0,172.0\"/>\n            <path d=\"M 537.0,295.0 C 536.5,295.5 533.0,299.0 532.0,299.0 C 531.0,299.5 527.5,303.0 527.0,303.0 C 526.0,303.5 522.5,305.0 522.0,305.0 C 521.0,305.5 516.5,306.0 516.0,306.0 C 515.0,306.5 511.5,308.0 511.0,308.0 C 510.0,308.5 506.5,309.0 506.0,309.0 C 505.0,309.5 500.5,310.0 500.0,310.0 C 499.0,310.5 495.5,309.0 495.0,309.0 C 494.0,309.5 490.5,308.0 490.0,308.0 C 489.0,308.5 484.5,307.0 484.0,307.0 C 483.0,307.5 479.5,305.0 479.0,305.0 C 478.0,305.5 473.5,303.0 473.0,303.0 C 472.0,303.5 468.5,304.0 468.0,304.0 C 467.0,304.0 463.5,306.5 463.0,307.0 C 462.0,307.5 457.5,305.0 457.0,305.0 C 456.0,305.5 452.5,307.5 452.0,308.0 C 451.0,308.5 447.5,309.5 447.0,310.0 C 446.0,310.5 441.5,310.5 441.0,311.0 C 440.0,311.5 436.5,308.0 436.0,308.0 C 435.0,308.5 431.5,309.5 431.0,310.0 C 430.0,310.5 425.5,310.5 425.0,311.0 C 424.0,311.5 420.5,311.5 420.0,312.0 C 419.0,312.5 415.5,313.5 415.0,314.0 C 414.0,314.5 409.5,313.5 409.0,313.0 C 408.0,312.5 404.5,311.5 404.0,312.0 C 403.0,312.5 398.5,310.5 398.0,311.0 C 397.0,311.5 393.5,309.5 393.0,310.0 C 392.0,310.5 388.5,309.5 388.0,310.0 C 387.0,310.5 385.0,312.5 385.0,313.0 C 384.0,313.5 383.0,317.5 383.0,318.0 C 382.0,318.5 378.5,321.5 378.0,322.0 C 377.0,322.5 374.5,323.8 374.0,324.0\"/>\n            <path d=\"M 537.0,295.0 C 537.5,295.0 540.5,295.0 540.0,295.0 C 541.0,295.5 545.5,297.5 545.0,298.0 C 546.0,298.5 548.5,299.0 548.0,299.0 C 549.0,299.5 553.5,299.0 553.0,299.0 C 554.0,299.5 558.5,299.0 558.0,299.0 C 559.0,299.5 561.5,298.0 561.0,298.0 C 562.0,298.5 564.5,297.5 564.0,297.0 C 565.0,296.5 567.5,295.5 567.0,295.0 C 568.0,294.5 569.5,291.0 569.0,290.0 C 570.0,289.0 572.5,287.0 572.0,286.0 C 573.0,285.5 575.5,284.5 575.0,284.0 C 576.0,283.5 580.5,285.0 580.0,285.0 C 581.0,285.0 585.5,285.0 585.0,285.0 C 586.0,285.0 591.5,285.0 591.0,285.0 C 592.0,285.0 596.5,285.0 596.0,285.0 C 597.0,285.0 599.5,285.0 599.0,285.0 C 600.0,285.0 601.5,283.0 601.0,282.0 C 602.0,281.0 605.5,278.0 605.0,277.0 C 606.0,276.0 607.5,275.5 607.0,275.0 C 608.0,274.5 609.5,272.5 609.0,272.0\"/>\n            <path d=\"M 449.0,171.0 C 448.0,171.5 445.5,172.5 445.0,173.0 C 444.0,173.5 441.5,172.5 441.0,173.0 C 440.0,173.5 437.5,173.5 437.0,174.0 C 436.0,174.5 433.5,172.5 433.0,173.0 C 432.0,173.5 429.5,170.5 429.0,170.0 C 428.0,169.5 425.5,167.5 425.0,167.0 C 424.0,166.5 421.5,165.5 421.0,165.0 C 420.0,164.5 417.5,164.5 417.0,164.0 C 416.0,163.5 412.5,162.5 412.0,162.0 C 411.0,161.5 408.5,162.0 408.0,162.0 C 407.0,162.0 404.5,162.0 404.0,162.0 C 403.0,162.0 400.5,162.0 400.0,162.0 C 399.0,162.0 395.5,163.5 396.0,164.0 C 395.0,164.5 391.5,165.5 392.0,166.0 C 391.0,166.5 387.5,166.5 388.0,167.0 C 387.0,167.5 383.5,168.5 384.0,169.0 C 383.0,169.5 379.5,170.5 380.0,171.0 C 379.0,171.5 375.5,173.5 376.0,174.0 C 375.0,174.5 371.5,175.5 372.0,176.0 C 371.0,176.5 367.5,176.5 368.0,177.0 C 367.0,177.5 363.5,176.5 364.0,177.0 C 363.0,177.5 359.5,176.5 360.0,176.0 C 359.0,175.5 356.5,175.5 356.0,175.0 C 355.0,174.5 352.5,173.5 352.0,173.0 C 351.0,172.5 348.5,170.5 348.0,170.0 C 347.0,169.5 344.5,167.5 344.0,167.0 C 343.0,166.5 340.5,165.5 340.0,165.0 C 339.0,164.5 336.5,164.5 336.0,164.0 C 335.0,163.5 333.5,166.5 333.0,167.0 C 332.0,167.5 329.5,169.5 329.0,170.0 C 328.0,170.5 325.5,170.5 325.0,171.0 C 324.0,171.5 321.5,173.5 321.0,174.0 C 320.0,174.5 319.5,175.5 319.0,176.0\"/>\n            <path d=\"M 703.0,218.0 C 702.0,217.5 700.0,217.0 700.0,217.0 C 699.0,216.5 693.0,217.0 693.0,217.0 C 692.0,216.5 690.0,215.5 690.0,215.0 C 689.0,214.5 686.0,214.5 686.0,214.0 C 685.0,213.5 680.5,213.5 680.0,214.0 C 679.0,214.5 676.5,216.5 676.0,217.0 C 675.0,217.5 670.5,216.0 670.0,216.0 C 669.0,216.5 666.5,218.0 666.0,218.0 C 665.0,218.5 660.5,218.0 660.0,218.0 C 659.0,218.5 656.5,220.0 656.0,220.0 C 655.0,220.5 650.5,223.0 650.0,223.0 C 649.0,223.5 643.5,222.0 643.0,222.0 C 642.0,222.5 636.5,222.0 636.0,222.0 C 635.0,222.5 633.5,224.0 633.0,224.0 C 632.0,224.5 626.5,221.0 626.0,221.0 C 625.0,221.5 623.5,221.0 623.0,221.0 C 622.0,221.5 619.5,218.0 619.0,218.0 C 618.0,218.5 617.5,215.0 617.0,215.0 C 616.0,215.5 615.5,212.0 615.0,212.0 C 614.0,212.5 611.5,210.0 611.0,210.0 C 610.0,210.5 608.0,211.0 608.0,211.0 C 607.0,211.5 607.5,213.5 607.0,214.0 C 606.0,214.5 605.5,216.5 605.0,217.0 C 604.0,217.5 602.5,220.0 602.0,220.0 C 601.0,220.5 600.5,220.5 600.0,221.0\"/>\n            <path d=\"M 600.0,222.0 C 600.5,222.5 601.0,225.5 601.0,226.0 C 601.5,227.0 601.0,227.5 601.0,228.0 C 601.5,229.0 603.0,230.0 603.0,230.0 C 603.5,231.0 606.5,234.5 607.0,235.0 C 607.5,237.0 607.5,238.5 607.0,239.0 C 607.5,240.0 608.0,244.0 608.0,245.0 C 608.5,246.0 609.0,247.0 609.0,247.0 C 609.5,248.0 609.0,251.0 608.0,251.0 C 607.5,252.5 605.5,252.0 605.0,253.0 C 604.0,253.5 603.5,255.0 603.0,255.0 C 602.5,256.5 602.0,258.5 602.0,259.0 C 602.5,260.5 603.0,263.0 603.0,264.0 C 603.5,265.5 604.5,268.0 606.0,270.0 C 607.0,271.0 609.0,272.0 609.0,272.0\"/>\n            <path d=\"M 319.0,177.0 C 319.5,178.5 321.0,180.5 321.0,182.0 C 321.5,185.0 323.0,190.0 323.0,192.0 C 324.0,195.0 326.0,200.0 326.0,201.0 C 326.5,203.0 323.5,210.0 322.0,211.0 C 320.5,213.0 313.5,213.5 312.0,215.0 C 310.5,216.5 308.5,217.0 307.0,217.0 C 305.5,218.0 303.5,221.5 303.0,222.0 C 302.0,223.5 300.5,226.0 299.0,227.0 C 297.5,228.5 298.5,231.5 298.0,232.0 C 297.5,233.5 295.5,235.0 295.0,236.0 C 294.5,237.5 292.5,239.0 291.0,240.0 C 289.5,241.5 288.5,243.5 288.0,245.0 C 287.5,247.0 293.0,248.0 293.0,249.0 C 293.5,251.0 296.5,254.0 296.0,259.0 C 296.5,264.5 300.0,267.0 300.0,268.0 C 301.0,270.0 306.0,276.0 307.0,277.0 C 309.0,279.0 314.0,284.0 315.0,285.0 C 317.0,287.0 324.0,286.0 325.0,286.0 C 327.0,286.5 330.0,289.0 331.0,290.0 C 333.0,292.0 335.0,293.0 336.0,294.0 C 338.0,296.0 338.5,298.0 338.0,299.0 C 338.5,301.0 339.0,303.0 339.0,304.0 C 339.5,305.5 341.0,306.0 341.0,306.0\"/>\n            <path d=\"M 670.0,282.0 C 670.0,281.0 670.5,276.0 670.0,277.0 C 670.5,278.0 671.0,273.0 671.0,272.0 C 671.5,271.0 672.5,268.0 672.0,267.0 C 672.5,265.5 674.0,265.0 674.0,265.0 C 674.5,263.5 675.5,261.0 674.0,262.0 C 674.5,260.0 679.0,258.0 678.0,258.0 C 679.0,257.5 682.5,256.0 681.0,256.0 C 682.0,255.5 686.0,255.0 684.0,255.0 C 685.0,254.5 691.5,252.0 689.0,252.0 C 690.5,251.5 696.5,250.5 694.0,251.0 C 695.5,250.5 700.5,248.5 697.0,250.0 C 698.5,249.5 703.5,247.5 700.0,248.0 C 701.5,247.5 703.5,243.0 702.0,245.0 C 703.5,243.5 705.5,240.0 703.0,243.0 C 704.5,241.5 706.0,238.0 704.0,240.0 C 705.5,238.5 706.0,235.0 705.0,236.0 C 705.5,234.5 705.5,238.5 705.0,238.0 C 704.5,238.0 704.0,234.0 704.0,233.0 C 704.5,232.0 701.5,229.0 701.0,229.0 C 701.5,228.0 701.0,226.0 700.0,224.0 C 700.5,222.5 703.5,221.0 700.0,224.0 C 701.5,222.0 703.5,220.0 703.0,219.0\"/>\n            <path d=\"M 373.0,324.0 C 372.5,324.5 369.5,326.5 369.0,326.0 C 368.0,325.5 365.5,325.0 363.0,325.0 C 361.0,325.0 358.5,326.5 357.0,327.0 C 355.5,328.5 357.5,331.0 356.0,331.0 C 354.5,332.0 357.0,333.0 356.0,333.0 C 355.0,334.0 358.0,336.0 358.0,336.0 C 358.5,337.5 359.0,340.0 359.0,340.0 C 359.5,341.0 358.5,343.5 358.0,343.0 C 357.5,344.5 357.5,345.0 356.0,345.0 C 355.5,346.5 355.0,347.0 355.0,347.0 C 354.5,348.5 354.5,350.0 354.0,349.0 C 354.5,351.5 354.5,352.5 354.0,351.0 C 354.5,353.5 354.5,354.5 354.0,354.0 C 353.5,355.5 352.0,357.0 353.0,356.0 C 352.0,357.5 351.5,358.0 351.0,358.0 C 350.5,358.5 349.5,358.0 349.0,358.0 C 348.5,358.5 347.5,359.0 347.0,359.0 C 346.5,359.5 345.5,360.0 345.0,360.0 C 344.5,360.5 343.5,361.0 343.0,361.0 C 342.5,361.5 341.5,362.0 341.0,362.0 C 340.5,362.5 340.5,364.0 340.0,364.0 C 339.5,365.0 340.5,366.0 340.0,366.0 C 339.5,367.0 340.5,368.0 340.0,368.0 C 339.5,369.0 340.5,370.0 340.0,370.0 C 339.5,371.0 339.5,371.0 339.0,371.0 C 338.5,372.0 337.5,373.0 337.0,373.0 C 336.5,373.5 336.5,373.0 336.0,373.0\"/>\n            <path d=\"M 609.0,272.0 C 608.5,272.5 607.5,271.5 607.0,271.0 C 606.5,271.0 605.5,270.5 605.0,270.0 C 604.5,269.5 604.5,268.5 604.0,268.0 C 603.5,267.5 603.5,266.5 603.0,266.0 C 602.5,265.5 603.5,264.5 603.0,264.0 C 602.5,263.5 602.5,262.5 602.0,262.0 C 601.5,261.5 602.5,260.5 602.0,260.0 C 601.5,259.5 602.5,258.5 602.0,258.0 C 601.5,257.5 602.5,256.5 602.0,256.0 C 601.5,255.5 604.0,255.0 604.0,254.0 C 605.0,253.0 608.0,252.5 608.0,251.0 C 609.0,250.0 609.0,248.0 609.0,247.0 C 609.5,246.0 609.5,246.0 608.0,245.0 C 607.0,244.0 609.0,243.0 608.0,242.0 C 607.0,241.0 607.5,240.0 607.0,239.0 C 606.5,238.0 607.5,237.0 607.0,236.0 C 606.5,235.0 605.5,234.5 605.0,233.0 C 604.5,232.0 603.5,231.0 603.0,230.0 C 602.5,229.5 601.5,228.5 601.0,228.0 C 600.5,227.5 601.5,226.5 601.0,226.0 C 600.5,225.5 600.5,224.5 600.0,224.0 C 599.5,223.5 600.0,223.0 600.0,222.0\"/>\n            <path d=\"M 609.0,272.0 C 608.5,272.5 605.5,276.0 605.0,277.0 C 604.5,278.5 603.5,281.5 603.0,282.0 C 602.5,283.0 599.5,284.0 599.0,284.0 C 598.5,284.5 595.5,285.0 594.0,285.0 C 592.5,285.0 589.5,285.0 588.0,285.0 C 586.5,285.0 583.5,285.0 582.0,285.0 C 580.5,285.0 577.5,285.0 576.0,284.0 C 574.5,283.5 572.0,284.0 571.0,285.0 C 570.0,286.5 569.5,289.0 569.0,290.0 C 568.5,292.0 568.5,294.0 568.0,294.0 C 567.5,294.5 565.5,296.0 564.0,296.0 C 562.5,297.0 560.5,298.5 559.0,299.0 C 557.5,300.0 554.5,299.0 554.0,299.0 C 553.5,299.5 551.5,299.0 551.0,299.0 C 550.5,299.5 548.5,299.0 548.0,299.0 C 547.5,299.5 546.5,299.0 546.0,298.0 C 545.5,297.5 543.5,297.0 543.0,296.0 C 542.5,295.5 540.5,296.0 540.0,295.0 C 539.5,294.5 537.5,295.0 537.0,295.0\"/>\n            <path d=\"M 609.0,272.0 C 609.5,272.0 611.5,272.0 611.0,272.0 C 612.0,272.5 614.5,273.5 614.0,274.0 C 615.0,274.5 615.5,276.5 615.0,277.0 C 616.0,277.5 618.5,280.0 619.0,280.0 C 620.0,280.5 621.5,282.0 621.0,282.0 C 622.0,282.5 624.5,285.0 625.0,286.0 C 626.0,286.5 627.5,288.0 627.0,288.0 C 628.0,288.5 630.5,290.0 631.0,290.0 C 632.0,290.5 633.5,291.5 633.0,291.0 C 634.0,291.5 636.5,293.0 637.0,293.0 C 638.0,293.5 639.5,294.5 639.0,294.0 C 640.0,294.5 642.5,295.5 643.0,295.0 C 644.0,295.5 645.5,296.5 645.0,296.0 C 646.0,296.5 648.5,296.5 649.0,295.0 C 650.0,295.5 651.5,294.0 651.0,293.0 C 652.0,293.5 653.5,292.5 653.0,292.0 C 654.0,292.5 656.5,292.0 657.0,292.0 C 658.0,292.5 659.5,293.0 659.0,293.0 C 660.0,293.5 662.5,292.5 663.0,293.0 C 664.0,293.0 664.5,291.0 664.0,291.0 C 665.0,291.0 663.5,288.5 664.0,289.0 C 664.5,288.5 665.5,287.5 666.0,288.0 C 666.5,287.5 666.5,285.5 667.0,286.0 C 667.5,285.5 667.5,283.5 668.0,284.0 C 668.5,283.5 669.5,282.5 670.0,283.0 C 670.5,282.5 669.5,281.5 670.0,282.0\"/>\n            <path d=\"M 249.0,156.0 C 252.0,156.0 256.0,157.0 260.0,158.0 C 264.0,158.0 268.0,159.0 272.0,160.0 C 276.0,160.0 280.0,162.0 284.0,162.0 C 288.0,161.0 292.0,165.0 296.0,168.0 C 300.0,168.0 304.0,168.0 308.0,171.0 C 312.0,173.0 316.0,176.0 318.0,177.0\"/>\n            <path d=\"M 318.0,177.0 C 319.0,177.5 320.0,177.5 319.0,177.0\"/>\n            <path d=\"M 342.0,306.0 C 343.0,305.5 345.5,304.0 346.0,303.0 C 347.0,302.5 349.0,302.0 348.0,302.0 C 349.0,302.0 352.0,303.0 352.0,303.0 C 353.0,303.5 356.0,305.0 356.0,305.0 C 357.0,305.5 358.0,307.0 358.0,307.0 C 359.0,307.5 360.5,309.0 360.0,309.0 C 361.0,309.5 362.5,311.0 362.0,311.0 C 363.0,311.5 364.0,313.0 364.0,313.0 C 365.0,313.5 365.0,314.0 364.0,314.0\"/>\n            <path d=\"M 373.0,323.0 C 372.5,322.5 372.0,322.0 372.0,321.0 C 371.5,320.5 370.0,319.0 370.0,318.0 C 369.5,317.5 368.0,317.0 368.0,317.0 C 367.0,316.5 366.0,315.0 366.0,315.0 C 365.0,314.5 364.0,314.0 364.0,314.0 C 363.0,313.5 362.0,312.0 362.0,312.0 C 361.0,311.5 360.0,310.0 360.0,310.0 C 359.0,309.5 358.5,308.0 358.0,308.0 C 357.5,307.5 356.0,306.0 356.0,306.0 C 355.5,305.5 354.0,305.0 354.0,305.0 C 353.0,304.5 352.0,304.0 352.0,304.0 C 351.0,303.5 350.0,303.0 350.0,303.0 C 349.0,302.5 348.5,302.5 348.0,302.0\"/>\n            <path d=\"M 449.0,140.0 C 449.0,143.0 449.0,145.0 449.0,148.0 C 448.0,150.0 447.0,152.0 447.0,153.0 C 446.0,154.5 445.0,155.0 445.0,155.0 C 445.5,156.0 445.5,157.5 445.0,158.0 C 445.5,159.0 446.0,160.0 447.0,160.0 C 447.5,161.5 449.0,162.0 449.0,162.0 C 449.0,163.5 449.0,165.0 449.0,166.0 C 449.0,167.5 449.0,168.5 449.0,170.0\"/>\n          </g>";

// Helpers
function getKm(a, b){
  if(a === b) return 0;
  const key = a + '->' + b;
  if(KM[key] !== undefined) return KM[key];
  const sp = LIBRARY.find(l=>l.id===b);
  return sp ? sp.km : 0;
}
function calcRouteKm(stops, withHome=true){
  if(stops.length === 0) return 0;
  const full = withHome ? ['home', ...stops, 'home'] : stops;
  let total = 0;
  for(let i=0; i<full.length-1; i++){
    total += getKm(full[i], full[i+1]);
  }
  return total;
}
function spotById(id){ return LIBRARY.find(l=>l.id===id); }
