// ============================================================================
// 📸 BẢNG LINK HÌNH ẢNH MÓN ĂN - BẠN CÓ THỂ DỄ DÀNG ĐỔI LINK ẢNH TẠI ĐÂY
// ============================================================================
// Hướng dẫn: Để thay đổi ảnh của món bất kỳ, bạn chỉ cần thay link trong dấu ngoặc kép ''
// bằng link ảnh bạn muốn (link web ảnh như Unsplash, Pinterest, Imgur, Facebook, Google Drive direct link...).

export const FOOD_IMAGES: Record<string, string> = {
  // ─── 🍜 1. MÓN CHÍNH (20 món) ───────────────────────────────────────────
  'com-ga': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80', // Cơm gà
  'com-tam': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80', // Cơm tấm
  'com-chien-duong-chau': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=80', // Cơm chiên Dương Châu
  'com-cuon-han-quoc': 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=500&auto=format&fit=crop&q=80', // Cơm cuộn Hàn Quốc
  'mi-y-sot-bo-bam': 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?w=500&auto=format&fit=crop&q=80', // Mì Ý sốt bò bằm
  'mi-y-sot-kem': 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=500&auto=format&fit=crop&q=80', // Mì Ý sốt kem
  'tokbokki-main': 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500&auto=format&fit=crop&q=80', // Tokbokki
  'ga-sot-cay-han-quoc': 'https://images.unsplash.com/photo-1527477265882-261546748530?w=500&auto=format&fit=crop&q=80', // Gà sốt cay Hàn Quốc
  'ga-ran': 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=80', // Gà rán
  'ga-sot-mat-ong': 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop&q=80', // Gà sốt mật ong
  'bun-thit-nuong': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80', // Bún thịt nướng
  'bun-bo-hue': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&auto=format&fit=crop&q=80', // Bún bò Huế
  'pho-bo': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&auto=format&fit=crop&q=80', // Phở bò
  'pho-ga': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80', // Phở gà
  'bun-cha': 'https://images.unsplash.com/photo-1594998893017-36147cbcae05?w=500&auto=format&fit=crop&q=80', // Bún chả
  'mien-tron': 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&auto=format&fit=crop&q=80', // Miến trộn
  'kimbap-main': 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=500&auto=format&fit=crop&q=80', // Kimbap
  'sushi-main': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=80', // Sushi
  'lau-thai': 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?w=500&auto=format&fit=crop&q=80', // Lẩu Thái
  'lau-tokbokki': 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500&auto=format&fit=crop&q=80', // Lẩu tokbokki

  // ─── 🍓 2. ĂN VẶT / MÓN NHẸ (20 món) ─────────────────────────────────────
  'khoai-tay-chien': 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80', // Khoai tây chiên
  'khoai-lang-lac': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80', // Khoai lang lắc
  'ca-vien-chien': 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=500&auto=format&fit=crop&q=80', // Cá viên chiên
  'xuc-xich-chien': 'https://images.unsplash.com/photo-1597393353415-b3730f3719fe?w=500&auto=format&fit=crop&q=80', // Xúc xích chiên
  'pho-mai-que': 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=500&auto=format&fit=crop&q=80', // Phô mai que
  'banh-trang-tron': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80', // Bánh tráng trộn
  'banh-trang-cuon': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80', // Bánh tráng cuốn
  'banh-trang-nuong': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&auto=format&fit=crop&q=80', // Bánh tráng nướng
  'nem-chua-ran': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80', // Nem chua rán
  'goi-cuon': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80', // Gỏi cuốn
  'ha-cao': 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=500&auto=format&fit=crop&q=80', // Há cảo
  'xiu-mai': 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=500&auto=format&fit=crop&q=80', // Xíu mại
  'takoyaki': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=80', // Takoyaki
  'tokbokki-snack': 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500&auto=format&fit=crop&q=80', // Tokbokki
  'bap-xao': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500&auto=format&fit=crop&q=80', // Bắp xào
  'chan-ga-sot-thai': 'https://images.unsplash.com/photo-1527477265882-261546748530?w=500&auto=format&fit=crop&q=80', // Chân gà sốt Thái
  'kho-ga': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80', // Khô gà
  'rong-bien-cuon': 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=500&auto=format&fit=crop&q=80', // Rong biển cuộn
  'banh-gao-lac-pho-mai': 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500&auto=format&fit=crop&q=80', // Bánh gạo lắc phô mai
  'trung-cut-xao-me': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80', // Trứng cút xào me

  // ─── ☕ 3. ĐỒ UỐNG (22 món) ──────────────────────────────────────────────
  'tra-sua-tran-chau': 'https://images.unsplash.com/photo-1558857563-b371f31ca704?w=500&auto=format&fit=crop&q=80', // Trà sữa trân châu
  'tra-sua-matcha': 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=80', // Trà sữa matcha
  'tra-dao': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80', // Trà đào
  'tra-dao-cam-sa': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80', // Trà đào cam sả
  'tra-vai': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=80', // Trà vải
  'tra-tac': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80', // Trà tắc
  'tra-chanh': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80', // Trà chanh
  'matcha-latte': 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=80', // Matcha latte
  'matcha-da-xay': 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=500&auto=format&fit=crop&q=80', // Matcha đá xay
  'cacao-da': 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=500&auto=format&fit=crop&q=80', // Cacao đá
  'cacao-nong': 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=500&auto=format&fit=crop&q=80', // Cacao nóng
  'ca-phe-sua': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80', // Cà phê sữa
  'bac-xiu': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80', // Bạc xỉu
  'caramel-macchiato': 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500&auto=format&fit=crop&q=80', // Caramel macchiato
  'cappuccino': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&auto=format&fit=crop&q=80', // Cappuccino
  'latte': 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500&auto=format&fit=crop&q=80', // Latte
  'nuoc-ep-cam': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80', // Nước ép cam
  'nuoc-ep-dua-hau': 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=500&auto=format&fit=crop&q=80', // Nước ép dưa hấu
  'nuoc-ep-oi': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=80', // Nước ép ổi
  'sinh-to-dau': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=80', // Sinh tố dâu
  'sinh-to-bo': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80', // Sinh tố bơ
  'yakult-da': 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=500&auto=format&fit=crop&q=80', // Yakult đá

  // ─── 🍰 4. ĐỒ NGỌT (24 món) ─────────────────────────────────────────────
  'banh-su-kem': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80', // Bánh su kem
  'tiramisu': 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=80', // Tiramisu
  'cheesecake': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=80', // Cheesecake
  'banh-flan': 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&auto=format&fit=crop&q=80', // Bánh flan
  'banh-crepe': 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=500&auto=format&fit=crop&q=80', // Bánh crepe
  'crepe-sau-rieng': 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=500&auto=format&fit=crop&q=80', // Crepe sầu riêng
  'waffle': 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&auto=format&fit=crop&q=80', // Waffle
  'pancake': 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=500&auto=format&fit=crop&q=80', // Pancake
  'brownie': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80', // Brownie
  'donut': 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=500&auto=format&fit=crop&q=80', // Donut
  'macaron': 'https://images.unsplash.com/photo-1569864321390-388e6e589417?w=500&auto=format&fit=crop&q=80', // Macaron
  'mochi': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=80', // Mochi
  'che-khuc-bach': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=80', // Chè khúc bạch
  'che-thai': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=80', // Chè thái
  'che-sau-rieng': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=80', // Chè sầu riêng
  'kem-dau': 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=80', // Kem dâu
  'kem-matcha': 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=80', // Kem matcha
  'kem-chocolate': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=80', // Kem chocolate
  'kem-vani': 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=80', // Kem vani
  'kem-dua': 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=80', // Kem dừa
  'bingsu': 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=500&auto=format&fit=crop&q=80', // Bingsu
  'pudding': 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&auto=format&fit=crop&q=80', // Pudding
  'yogurt-trai-cay': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=80', // Yogurt trái cây
  'dau-tay-phu-chocolate': 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=80', // Dâu tây phủ chocolate
};
