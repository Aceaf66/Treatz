-- Treatz Initial Seed Data Migration

-- Insert Categories
INSERT INTO public.categories (id, name, species, icon, description) VALUES
('dog-dry-food', 'Dry Food', 'dog', 'Bone', 'Crunchy, nutrient-rich kibble designed for canine vitality'),
('dog-wet-food', 'Wet Food & Gravy', 'dog', 'Soup', 'Hydrating, protein-packed slow-simmered meals'),
('dog-treats', 'Treats & Chews', 'dog', 'Cookie', 'Rewarding treats for training and dental chewing happiness'),
('dog-supplements', 'Supplements', 'dog', 'HeartPulse', 'Vet-approved joint, coat, and gut wellness formulas'),
('dog-dental-care', 'Dental Care', 'dog', 'Sparkles', 'Plaque-fighting chews and freshening breath remedies'),
('cat-dry-food', 'Dry Food', 'cat', 'Fish', 'Hairball control and urinary tract health kibble'),
('cat-wet-food', 'Wet Food & Broths', 'cat', 'Soup', 'Tender shreds in savoury gravy for finicky felines'),
('cat-treats', 'Crunch & Creamy Treats', 'cat', 'Sparkles', 'Lickable purees and freeze-dried salmon bites'),
('cat-litter', 'Litter & Hygiene', 'cat', 'Layers', 'Ultra-clumping, low-dust, odor-locking natural litter'),
('cat-supplements', 'Supplements & Care', 'cat', 'ShieldPlus', 'Omega-3 oils, calming treats, and digestive prebiotics')
ON CONFLICT (id) DO NOTHING;

-- Insert Sample Coupons
INSERT INTO public.coupons (id, code, title, points_cost, discount_amount, min_spend, expires_at) VALUES
('v-100', 'TREATZ100', '₹100 Off On Your Order', 100, 100.00, 999.00, '2026-12-31 23:59:59+00'),
('v-250', 'TREATZ250', '₹250 Off Premium Food', 250, 250.00, 1999.00, '2026-12-31 23:59:59+00'),
('v-500', 'TREATZ500', '₹500 VIP Pet Parent Voucher', 500, 500.00, 3499.00, '2026-12-31 23:59:59+00')
ON CONFLICT (id) DO NOTHING;
