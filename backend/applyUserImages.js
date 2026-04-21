const fs = require('fs');
const { execSync } = require('child_process');

const diffData = `INSERT INTO foods (name, description, price, image_url, category_id) VALUES 
-- Main Courses
('Nyama Choma', 'Roasted goat meat, a quintessential Kenyan delicacy.', 350, 'https://imgs.search.brave.com/Pw30G0RYPMV3yUkhqxcdpJJT0m2DQLiwTZpir3BKV5c/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS1jZG4udHJpcGFk/dmlzb3IuY29tL21l/ZGlhL3Bob3RvLW8v/MDgvNWEvNDYvNzAv/bWFhbnpvbmktbG9k/Z2UuanBn', 1),
('Pilau', 'Spiced rice cooked with beef, bursting with coastal flavors.', 250, 'https://imgs.search.brave.com/l-AIWls-Fm6YjBRKsN7cs4U6YFuhwPa4GfeRhWLUMKs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90b2Fz/dGVyZGluZy5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMjQv/MDUvaW1hZ2UtMzQu/cG5n', 1),
('Githeri', 'A hearty traditional mixture of boiled maize and beans.', 150, 'https://imgs.search.brave.com/_8aN-0YNM0WZyBe3yeN-prv4fmtTDxCycrVFYmpIVjg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Y2hlZnNwZW5jaWwu/Y29tL3dwLWNvbnRl/bnQvdXBsb2Fkcy9n/aXRoZXJpLTY0MHg2/NDAuanBn', 1),
('Kuku choma', 'Chicken cooked in a rich, spiced coconut curry.', 300, 'https://imgs.search.brave.com/7dwVErr61MPoDdKXHDoPBc6JxpQv2ob4KNr8N0cJnd0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hcnQu/d2hpc2suY29tL2lt/YWdlL3VwbG9hZC9m/bF9wcm9ncmVzc2l2/ZSxoXzI2NCx3XzIx/NCxjX2ZpbGwsZHBy/XzIuMC92MTY1Nzk3/MDczMi9yZWNpcGUv/ZTIyYmM4OTRhMzE3/M2FkNzM2Y2I0Njg4/MDcyYWYxZWQuanBn', 1),
('Tilapia Wet Fry', 'Fresh Victoria tilapia pan-fried and stewed in tomatoes and onions.', 400, 'https://imgs.search.brave.com/pxEiNVT7uEKy4AUeBocLI5cv-_B0o-Pfw-iE1rngVA0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTYy/ODkzNzU3L3Bob3Rv/L2JlbHRzdmlsbGUt/bWQtdGhlLWZyaWVk/LXRpbGFwaWEtZGlz/aC1mZWF0dXJlcy1h/LW1hc2FsYS1zYXVj/ZS13aXRoLW9uaW9u/cy10b21hdG8tZ2Fy/bGljLWJlbGwuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPUtM/aDU3UXdLUTk1aVNQ/WTc0UUVELVdBSU1p/cGxrQ2NFRElTRU1T/c0F2YlE9', 1),
('Omena', 'Small silver cyprinid fish stewed with onions and tomatoes.', 150, 'https://imgs.search.brave.com/c6yHqpOYOrwLCN-2qCZPoT48CofbDOtY9Z0PTxuzbcc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWct/Z2xvYmFsLmNwY2Ru/LmNvbS9zdGVwcy9j/YWI5YThjOTM4Njll/YWQyLzE2MHgxMjhj/cTgwL29tZW5hLXdl/dC1mcnktcmVjaXBl/LXN0ZXAtNC1waG90/by5qcGc', 1),
('Biryani', 'A robust Swahili dish of fragrant rice and heavily spiced meat.', 250, 'https://imgs.search.brave.com/a_xL3ZO2Z-Q5lAFW0NWtBc3uU66H3qpUxyGTG_5jeS8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGV4ZWxzLmNv/bS9waG90b3MvMTYw/MjA1NzMvcGV4ZWxz/LXBob3RvLTE2MDIw/NTczL2ZyZWUtcGhv/dG8tb2YtcmljZS1h/bmQtY2hpY2tlbi1t/ZWFsLW9uLXRoZS1w/bGF0ZS5qcGVnP2F1/dG89Y29tcHJlc3Mm/Y3M9dGlueXNyZ2Im/ZHByPTEmdz01MDA', 1),
('Kienyeji Chicken', 'Free-range chicken stewed slowly to tender perfection.', 500, 'https://imgs.search.brave.com/wKarAFd1cOfGfZJAZH-e4w3g8jRTsrrNsaduHqlESkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9ob21l/bWFkZS1zbW9rZWQt/Y2hpY2tlbi1kcnVt/c3RpY2stcGxhdGUt/MTQ5Mjc1NDkuanBn', 1),
('Matoke', 'Savory green bananas mashed or stewed with meat.', 150, 'https://imgs.search.brave.com/9f-VBniLrLLrtUJpb6arHz99szM2_Ug85ZySXaxGCoE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jdWx0/dXJlZGN1aXNpbmUu/Y28udWsvd3AtY29u/dGVudC91cGxvYWRz/LzIwMjQvMDUvU2Ny/ZWVuc2hvdF8yMDI0/MDUxMy0xNDM2NDFf/Q2hyb21lLTEwMjR4/OTg5LmpwZw', 1),
('Mukimo', 'Mashed potatoes, pumpkin leaves, corn, and beans.', 120, 'https://imgs.search.brave.com/O79byiIE4uIk90Gkzz0jU47yt7Tq12avRXbfgijZ7qM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbnN0/YXBpbGF1LmNvbS9t/ZWRpYS9wcm9kdWN0/cy8yMDI1LzUvMjAv/b3JpZ2luYWxfOTZj/M2RjNzBlMmEyNDU1/ZWI5OWUzMDhkZTQ2/ZDBiNjcuanBn', 1),

-- Street Food & Snacks
('Mutura', 'Kenyan sausage filled with spiced minced meat and blood, grilled over charcoal.', 80, 'https://imgs.search.brave.com/ZaTmNPjDZ80QI-8rcUmf2tdXpAjnTtTWaH7FDwjGSZA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9uYWly/b2JpbXVzc2luZ3Mu/d29yZHByZXNzLmNv/bS93cC1jb250ZW50/L3VwbG9hZHMvMjAx/Ni8wNi9tdXR1cmEx/LmpwZz93PTY2MA', 2),
('Chips Mayai', 'A legendary street food combining french fries baked inside an omelet.', 100, 'https://imgs.search.brave.com/RCyHc2otxhFFSmGF49SgBAhCe9unrexW2yD9SVRJumE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9jaGlw/c2ktbWF5YWktY2hp/cHMtZWdncy1jb21t/b24tZm9vZC1mb3Vu/ZC10YW56YW5pYS1l/YXN0LWFmcmljYS1t/b3N0LWJhc2ljLWZv/cm0tY2hpcHNpLW1h/eWFpLXNpbXBsZS1w/b3RhdG8tZWdnLW9t/ZWxldHRlLTE2OTU4/NDcyMi5qcGc', 2),
('Samosa', 'Crispy triangular pastries stuffed with spiced minced beef.', 60, 'https://imgs.search.brave.com/mPSS4RsADN3cEYBAo0eM3O2QDa-fh4TV9BNXEYFNpfQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9nb2xk/ZW4tc2Ftb3Nhcy1w/bGF0ZS1jcmlzcHkt/c2VydmVkLWdhcm5p/c2gtZXZva2luZy1k/ZWxpY2lvdXMtZmxh/dm9ycy0zMDYyMjQ1/ODMuanBn', 2),
('Smokie', 'Grilled smokie sausage split and filled with kachumbari.', 70, 'https://imgs.search.brave.com/FcXcmGM1Z2nvWY7vIeQf4vAengA14qhcfHz1whr_jgk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9raXRj/aGVuZnVud2l0aG15/M3NvbnMuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDE5LzEx/L2xpdHRsZS1zbW9r/aWVzLWZlYXR1cmUt/NDAweDQwMC5qcGc', 2),
('Mandazi', 'Soft, slightly sweet, deep-fried triangular dough.', 50, 'https://imgs.search.brave.com/gCwSjT_StMDjZJwIuAyQPt--8Lvxs8uVXw1HGOT7BcU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c2h1dHRlcnN0b2Nr/LmNvbS9pbWFnZS1w/aG90by9tYW5kYXpp/LWFmcmljYW4tZG91/Z2hudXQtY2xvc2Ut/dXAtMjYwbnctNjk1/NDMzMjI5LmpwZw', 2),
('Mahamri', 'Swahili hollow doughnuts flavored with cardamom and coconut milk.', 60, 'https://imgs.search.brave.com/M3wUVzqcto8njMW250k_ivQ2KgE1oIqdI_I3swAyoUA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/Zm9vZGFuZG1lYWwu/Y29tL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIzLzA5LzI5LjIt/MS5qcGc_c3RyaXA9/YWxs', 2),
('Bhajia', 'Thinly sliced potatoes battered in seasoned chickpea flour and fried.', 80, 'https://imgs.search.brave.com/DZmOrTNQOk4eNvR1zCkVqWlT3SjykXSmf1Ok8pFTr3o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/amNvb2tpbmdvZHlz/c2V5LmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyNi8wMi9t/YXJ1LWJoYWppYS0x/NTB4MTUwLmpwZw', 2),
('Mahindi Choma', 'Fire-roasted corn on the cob rubbed with lemon and salt.', 50, 'https://imgs.search.brave.com/R_jd4uz2dioL1yFO7i0C-PHJKzBJyfooiAQ-fJ46dpI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuY2l0aXplbi5k/aWdpdGFsLzQzNTcz/L2NvbnZlcnNpb25z/L01haGluZGktQ2hv/bWEtb2dfaW1hZ2Uu/d2VicA', 2),
('Mishkaki', 'Tender marinated beef skewers grilled over an open flame.', 90, 'https://imgs.search.brave.com/y5RqL76T-G3_rFV95uOVSuS8XuX7zgyvt81Z7-QxWcc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzk3LzJj/LzdiLzk3MmM3YmI1/MGEwNDg0OTk2MDUw/MmE2MjQ4MjgzYzkw/LmpwZw', 2),
('Viazi Karai', 'Deep-fried boiled potatoes coated in turmeric batter.', 80, 'https://imgs.search.brave.com/7MhMXca_uE7k9tAy9X7U7G9RjkGpf1sxaeNKIYl5rAI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly95YW5u/YS1yZXNzZS5uZXRs/aWZ5LmFwcC9zdGF0/aWMvYmE5ODM3ODJk/MmFmMTU5MjkyNjJl/Njc2MjRjYjhlZDkv/ZTUxNjYvdmlhemlf/a2FyYWktMS5qcGc', 2),

-- Sides & Accompaniments
('Ugali', 'The staple firm maize flour porridge, perfect for stews.', 60, 'https://imgs.search.brave.com/ETp6jLfNkkEGb2rcF_zGh1RvtaUZLWo0PolTsByOzm4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cmVtaXRseS5jb20v/YmxvZy93cC1jb250/ZW50L3VwbG9hZHMv/MjAyMy8wOS9rZW55/YS11Z2FsaS1zY2Fs/ZWQtMS0xMDI0eDY4/My5qcGc', 3),
('Sukuma Wiki', 'Collard greens sautéed with onions and tomatoes.', 50, 'https://imgs.search.brave.com/u3b-BEDs-mPDEuiFKVs16zFTWSK56SI8HGszFVCcumg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9mb3Jl/aWduZm9yay5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMjMv/MDgvU3VrdW1hLVdp/a2ktMTUuanBn', 3),
('Chapati', 'Soft, layered, pan-fried flatbread.', 50, 'https://imgs.search.brave.com/x03ZlA_hMdgffq13zLPPAULYpVVPc25hDpeBM63Gq5o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9taW5p/c3RyeW9mY3Vycnku/Y29tL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDI1LzA5L2NoYXBh/dGktMy5qcGc', 3),
('Kachumbari', 'Fresh tomato, onion, and cilantro salsa.', 60, 'https://imgs.search.brave.com/bc0oGaafpFv-9UNJ4sywFIUakYocjz754QXY7Tw4qkc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzEwLzkzLzI2LzUw/LzM2MF9GXzEwOTMy/NjUwNDBfejFxcmQy/bEJyQ2o2V1ZiNWNO/NVg4dmtnMzRYeWUx/bG0uanBn', 3),
('Maharagwe', 'Red kidney beans stewed in a rich, savory coconut sauce.', 150, 'https://imgs.search.brave.com/llaFvK93p6Wu9ZQSAOb_usGez3j7nhDnB3MeRPFBXdE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9yZWQt/YmVhbnMtYm9pbGVk/LXBsYXRlLWNvb2tl/ZC1jYW5uZWQtY29t/bW9uLWtpZG5leS12/YXJpZXR5LWJlYW4t/cGhhc2VvbHVzLXZ1/bGdhcmlzLXZlZ2V0/YXJpYW4tc3RhcGxl/LWZvb2QtMzc3NTEy/MzU0LmpwZw', 3),
('Wali wa Nazi', 'Fragrant rice simmered gently in coconut milk.', 100, 'https://imgs.search.brave.com/uSx4vn8A2JLa2Feo20Zk4_8F4THIM-3MResvb7VqDmw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMDYv/ODQyLzYwOC9zbWFs/bC9yaWNlLW9uLXdo/aXRlLXBsYXRlLW92/ZXItYmxhY2stYmFj/a2dyb3VuZC1zdHVk/aW8tZnJlZS1waG90/by5qcGc', 3),
('Nduma', 'Boiled arrowroot, a healthy and filling traditional side.', 80, 'https://imgs.search.brave.com/7lEeeNFJ8pl98FwCzV-ZJ6SdX6ZiQyNd0_cnzTu4F8M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWct/Z2xvYmFsLmNwY2Ru/LmNvbS9yZWNpcGVz/Lzk3OWY4MDBiNzA4/NDJiYzEvMTMweDE2/MGNxNTAvYm9pbGVk/LWFycm93LXJvb3Rz/LW5kdW1hLXJlY2lw/ZS1tYWluLXBob3Rv/LmpwZw', 3),
('Ngwaci', 'Boiled sweet potatoes, popular for breakfast with tea.', 80, 'https://imgs.search.brave.com/DFpI-nSwvZNu8lvOxxwvcrQ7YL_dN17-jtkrz45toB8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbnN0/YXBpbGF1LmNvbS9t/ZWRpYS9wcm9kdWN0/cy8yMDI1LzUvMTQv/b3JpZ2luYWxfMzM3/YzljZmE4MjE4NDFh/MDk0MTI2ZjdmZjI5/MjA4ZGMuanBn', 3),

-- Beverages
('Kenyan Tea (Chai)', 'Rich, sweet milk tea brewed with high-quality Kenyan tea leaves.', 50, 'https://imgs.search.brave.com/Qu-CeyH4yHrOhuA9P35ys2uvY4x3VU8-NGtG0lKGtL0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90YXJh/c211bHRpY3VsdHVy/YWx0YWJsZS5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMTcv/MDUvQ2hhaS1ZYS1U/YW5nYXdpemktS2Vu/eWFuLUdpbmdlci1U/ZWEtMi1vZi0zLTEt/MTAyNHg2ODMuanBn', 4),
('Uji', 'Traditional fermented millet or maize porridge, warming and nutritious.', 70, 'https://imgs.search.brave.com/WCyh-J9uVGRM4RcXTUuyvn5WIgqoFU85Zty-Qca1WX0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vaGVhbHRo/eWxpdmluZ2tlbnlh/LndvcmRwcmVzcy5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MTcvMTIvMTA5ODM0/MzFfMTAyMDU5MjI2/NzA4NDg3OTRfNTMy/OTc2NzIyMjkwOTIy/NDcyNF9uLmpwZz93/PTM0NyZoPTE5NSZz/c2w9MQ', 4);
`;

const lines = diffData.split('\\n');
let newLines = [];
const regex = /https:\/\/imgs\.search\.brave\.com\/[^\/']+\/[^\/']+\/[^\/']+\/([^'"]+)/;

for (let line of lines) {
  const match = line.match(regex);
  if (match) {
    let b64 = match[1].replace(/\//g, '');
    try {
      let decoded = Buffer.from(b64, 'base64').toString('utf8');
      line = line.replace(match[0], decoded);
    } catch(e) {}
  }
  newLines.push(line);
}

const headerSql = \`USE palatepro_db;

-- 1. Insert Categories (IGNORE if exist)
INSERT IGNORE INTO categories (name, description) VALUES 
('Main Courses', 'Hearty traditional and modern Kenyan main dishes'),
('Street Food & Snacks', 'Quick, authentic bites found on the streets of Nairobi'),
('Sides & Accompaniments', 'Essential additions to any Kenyan meal'),
('Beverages', 'Refreshing drinks and traditional brews');

-- Delete old items to overwrite
DELETE FROM order_items;
DELETE FROM foods;

\`;

const fullSql = headerSql + newLines.join('\\n');
fs.writeFileSync('/home/wairimu/Desktop/PALATEPRO/backend/seed_kenyan_meals.sql', fullSql);
console.log('Successfully wrote decoded SQL to seed_kenyan_meals.sql');
// Re-seed DB
try {
  execSync('mysql -u root -proot palatepro_db < /home/wairimu/Desktop/PALATEPRO/backend/seed_kenyan_meals.sql');
  console.log('Database successfully re-seeded with user images!');
} catch (e) {
  console.error('MySQL Error:', e.message);
}
