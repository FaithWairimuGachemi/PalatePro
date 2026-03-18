USE palatepro_db;

-- 1. Insert Categories (IGNORE if exist)
INSERT IGNORE INTO categories (name, description) VALUES 
('Main Courses', 'Hearty traditional and modern Kenyan main dishes'),
('Street Food & Snacks', 'Quick, authentic bites found on the streets of Nairobi'),
('Sides & Accompaniments', 'Essential additions to any Kenyan meal'),
('Beverages', 'Refreshing drinks and traditional brews');

-- Delete old items to overwrite
DELETE FROM order_items;
DELETE FROM foods;

INSERT INTO foods (name, description, price, image_url, category_id) VALUES 
-- Main Courses
('Nyama Choma', 'Roasted goat meat, a quintessential Kenyan delicacy.', 350, '', 1),
('Pilau', 'Spiced rice cooked with beef, bursting with coastal flavors.', 250, '', 1),
('Githeri', 'A hearty traditional mixture of boiled maize and beans.', 150, '', 1),
('Kuku choma', 'Chicken cooked in a rich, spiced coconut curry.', 300, '', 1),
('Tilapia Wet Fry', 'Fresh Victoria tilapia pan-fried and stewed in tomatoes and onions.', 400, '', 1),
('Omena', 'Small silver cyprinid fish stewed with onions and tomatoes.', 150, '', 1),
('Biryani', 'A robust Swahili dish of fragrant rice and heavily spiced meat.', 250, '', 1),
('Kienyeji Chicken', 'Free-range chicken stewed slowly to tender perfection.', 500, '', 1),
('Matoke', 'Savory green bananas mashed or stewed with meat.', 150, '', 1),
('Mukimo', 'Mashed potatoes, pumpkin leaves, corn, and beans.', 120, '', 1),

-- Street Food & Snacks
('Mutura', 'Kenyan sausage filled with spiced minced meat and blood, grilled over charcoal.', 80, '', 2),
('Chips Mayai', 'A legendary street food combining french fries baked inside an omelet.', 100, '', 2),
('Samosa', 'Crispy triangular pastries stuffed with spiced minced beef.', 60, '', 2),
('Smokie', 'Grilled smokie sausage split and filled with kachumbari.', 70, '', 2),
('Mandazi', 'Soft, slightly sweet, deep-fried triangular dough.', 50, '', 2),
('Mahamri', 'Swahili hollow doughnuts flavored with cardamom and coconut milk.', 60, '', 2),
('Bhajia', 'Thinly sliced potatoes battered in seasoned chickpea flour and fried.', 80, '', 2),
('Mahindi Choma', 'Fire-roasted corn on the cob rubbed with lemon and salt.', 50, '', 2),
('Mishkaki', 'Tender marinated beef skewers grilled over an open flame.', 90, '', 2),
('Viazi Karai', 'Deep-fried boiled potatoes coated in turmeric batter.', 80, '', 2),

-- Sides & Accompaniments
('Ugali', 'The staple firm maize flour porridge, perfect for stews.', 60, '', 3),
('Sukuma Wiki', 'Collard greens sautéed with onions and tomatoes.', 80, '', 3),
('Chapati', 'Soft, layered, pan-fried flatbread.', 50, '', 3),
('Kachumbari', 'Fresh tomato, onion, and cilantro salsa.', 60, '', 3),
('Maharagwe', 'Red kidney beans stewed in a rich, savory coconut sauce.', 150, '', 3),
('Wali wa Nazi', 'Fragrant rice simmered gently in coconut milk.', 100, '', 3),
('Nduma', 'Boiled arrowroot, a healthy and filling traditional side.', 80, '', 3),
('Ngwaci', 'Boiled sweet potatoes, popular for breakfast with tea.', 80, '', 3),
('Mrenda', 'Jute mallow greens, famously slippery and nutritious.', 80, '', 3),
('Mbaazi za Nazi', 'Pigeon peas cooked in thick coconut cream.', 100, '', 3),

-- Beverages
('Kenyan Tea (Chai)', 'Rich, sweet milk tea brewed with high-quality Kenyan tea leaves.', 80, '', 4),
('Uji', 'Traditional fermented millet or maize porridge, warming and nutritious.', 80, '', 4),
('Madafu', 'Fresh, natural coconut water served straight from the shell.', 80, '', 4);
