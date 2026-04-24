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
('Nyama Choma', 'Roasted goat meat, a quintessential Kenyan delicacy.', 350, 'https://media-cdn.tripadvisor.com/media/photo-o/08/5a/46/70/maanzoni-lodge.jpg', 1),
('Pilau', 'Spiced rice cooked with beef, bursting with coastal flavors.', 250, 'https://toasterding.com/wp-content/uploads/2024/05/image-34.png', 1),
('Githeri', 'A hearty traditional mixture of boiled maize and beans.', 150, 'https://www.chefspencil.com/wp-content/uploads/githeri-640x640.jpg', 1),
('Kuku choma', 'Chicken cooked in a rich, spiced coconut curry.', 300, 'https://art.whisk.com/image/upload/fl_progressiveh_264w_214c_filldpr_2.0/v1657970732/recipe/e22bc894a3173ad736cb4688072af1ed.jpg', 1),
('Tilapia Wet Fry', 'Fresh Victoria tilapia pan-fried and stewed in tomatoes and onions.', 400, 'https://media.gettyimages.com/id/162893757/photo/beltsville-md-the-fried-tilapia-dish-features-a-masala-sauce-with-onions-tomato-garlic-bell.jpg?s=612x612&w=0&k=20&c=KLh57QwKQ95iSPY74QED-WAIMiplkCcEDISEMSsAvbQ=', 1),
('Omena', 'Small silver cyprinid fish stewed with onions and tomatoes.', 150, 'https://img-global.cpcdn.com/steps/cab9a8c93869ead2/160x128cq80/omena-wet-fry-recipe-step-4-photo.jpg', 1),
('Biryani', 'A robust Swahili dish of fragrant rice and heavily spiced meat.', 250, 'https://images.pexels.com/photos/16020573/pexels-photo-16020573/free-photo-of-rice-and-chicken-meal-on-the-plate.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', 1),
('Kienyeji Chicken', 'Free-range chicken stewed slowly to tender perfection.', 500, 'https://thumbs.dreamstime.com/b/homemade-smoked-chicken-drumstick-plate-14927549.jpg', 1),
('Matoke', 'Savory green bananas mashed or stewed with meat.', 150, 'https://culturedcuisine.co.uk/wp-content/uploads/2024/05/Screenshot_20240513-143641_Chrome-1024x989.jpg', 1),
('Mukimo', 'Mashed potatoes, pumpkin leaves, corn, and beans.', 120, 'https://instapilau.com/media/products/2025/5/20/original_96c3dc70e2a2455eb99e308de46d0b67.jpg', 1),

-- Street Food & Snacks
('Mutura', 'Kenyan sausage filled with spiced minced meat and blood, grilled over charcoal.', 80, 'https://nairobimussings.wordpress.com/wp-content/uploads/2016/06/mutura1.jpg?w=660', 2),
('Chips Mayai', 'A legendary street food combining french fries baked inside an omelet.', 100, 'https://thumbs.dreamstime.com/b/chipsi-mayai-chips-eggs-common-food-found-tanzania-east-africa-most-basic-form-chipsi-mayai-simple-potato-egg-omelette-169584722.jpg', 2),
('Samosa', 'Crispy triangular pastries stuffed with spiced minced beef.', 60, 'https://thumbs.dreamstime.com/b/golden-samosas-plate-crispy-served-garnish-evoking-delicious-flavors-306224583.jpg', 2),
('Smokie', 'Grilled smokie sausage split and filled with kachumbari.', 70, 'https://kitchenfunwithmy3sons.com/wp-content/uploads/2019/11/little-smokies-feature-400x400.jpg', 2),
('Mandazi', 'Soft, slightly sweet, deep-fried triangular dough.', 50, 'https://www.shutterstock.com/image-photo/mandazi-african-doughnut-close-up-260nw-695433229.jpg', 2),
('Mahamri', 'Swahili hollow doughnuts flavored with cardamom and coconut milk.', 60, 'https://cdn.foodandmeal.com/wp-content/uploads/2023/09/29.2-1.jpg?strip=all', 2),
('Bhajia', 'Thinly sliced potatoes battered in seasoned chickpea flour and fried.', 80, 'https://www.jcookingodyssey.com/wp-content/uploads/2026/02/maru-bhajia-150x150.jpg', 2),
('Mahindi Choma', 'Fire-roasted corn on the cob rubbed with lemon and salt.', 50, 'https://assets.citizen.digital/43573/conversions/Mahindi-Choma-og_image.webp', 2),
('Mishkaki', 'Tender marinated beef skewers grilled over an open flame.', 90, 'https://i.pinimg.com/originals/97/2c/7b/972c7bb50a04849960502a6248283c90.jpg', 2),
('Viazi Karai', 'Deep-fried boiled potatoes coated in turmeric batter.', 80, 'https://yanna-resse.netlify.app/static/ba983782d2af15929262e67624cb8ed9/e5166/viazi_karai-1.jpg', 2),

-- Sides & Accompaniments
('Ugali', 'The staple firm maize flour porridge, perfect for stews.', 60, 'https://www.remitly.com/blog/wp-content/uploads/2023/09/kenya-ugali-scaled-1-1024x683.jpg', 3),
('Sukuma Wiki', 'Collard greens sautéed with onions and tomatoes.', 50, 'https://foreignfork.com/wp-content/uploads/2023/08/Sukuma-Wiki-15.jpg', 3),
('Chapati', 'Soft, layered, pan-fried flatbread.', 50, 'https://ministryofcurry.com/wp-content/uploads/2025/09/chapati-3.jpg', 3),
('Kachumbari', 'Fresh tomato, onion, and cilantro salsa.', 60, 'https://t3.ftcdn.net/jpg/10/93/26/50/360_F_1093265040_z1qrd2lBrCj6WVb5cN5X8vkg34Xye1lm.jpg', 3),
('Maharagwe', 'Red kidney beans stewed in a rich, savory coconut sauce.', 150, 'https://thumbs.dreamstime.com/b/red-beans-boiled-plate-cooked-canned-common-kidney-variety-bean-phaseolus-vulgaris-vegetarian-staple-food-377512354.jpg', 3),
('Wali wa Nazi', 'Fragrant rice simmered gently in coconut milk.', 100, 'https://static.vecteezy.com/system/resources/thumbnails/006/842/608/small/rice-on-white-plate-over-black-background-studio-free-photo.jpg', 3),
('Nduma', 'Boiled arrowroot, a healthy and filling traditional side.', 80, 'https://img-global.cpcdn.com/recipes/979f800b70842bc1/130x160cq50/boiled-arrow-roots-nduma-recipe-main-photo.jpg', 3),
('Ngwaci', 'Boiled sweet potatoes, popular for breakfast with tea.', 80, 'https://instapilau.com/media/products/2025/5/14/original_337c9cfa821841a094126f7ff29208dc.jpg', 3),

-- Beverages
('Kenyan Tea (Chai)', 'Rich, sweet milk tea brewed with high-quality Kenyan tea leaves.', 50, 'https://tarasmulticulturaltable.com/wp-content/uploads/2017/05/Chai-Ya-Tangawizi-Kenyan-Ginger-Tea-2-of-3-1-1024x683.jpg', 4),
('Uji', 'Traditional fermented millet or maize porridge, warming and nutritious.', 70, 'https://i0.wp.com/healthylivingkenya.wordpress.com/wp-content/uploads/2017/12/10983431_10205922670848794_5329767222909224724_n.jpg?w=347&h=195&ssl=1', 4);
