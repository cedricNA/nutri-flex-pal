
-- Clear existing sample data and add comprehensive food database
DELETE FROM public.foods;

-- Insert comprehensive food database with real nutritional data and proper images
INSERT INTO public.foods (name, category, calories, protein, carbs, fat, fiber, unit, image) VALUES
-- Fruits
('Pomme', 'fruits', 52, 0.3, 13.8, 0.2, 2.4, '100g', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=150&h=150&fit=crop'),
('Banane', 'fruits', 89, 1.1, 22.8, 0.3, 2.6, '100g', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=150&h=150&fit=crop'),
('Orange', 'fruits', 47, 0.9, 11.8, 0.1, 2.4, '100g', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=150&h=150&fit=crop'),
('Fraises', 'fruits', 32, 0.7, 7.7, 0.3, 2.0, '100g', 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=150&h=150&fit=crop'),
('Avocat', 'fruits', 160, 2.0, 8.5, 14.7, 6.7, '100g', 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=150&h=150&fit=crop'),
('Myrtilles', 'fruits', 57, 0.7, 14.5, 0.3, 2.4, '100g', 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=150&h=150&fit=crop'),
('Ananas', 'fruits', 50, 0.5, 13.1, 0.1, 1.4, '100g', 'https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=150&h=150&fit=crop'),

-- Légumes
('Brocoli', 'vegetables', 34, 2.8, 7.0, 0.4, 2.6, '100g', 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=150&h=150&fit=crop'),
('Épinards', 'vegetables', 23, 2.9, 3.6, 0.4, 2.2, '100g', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=150&h=150&fit=crop'),
('Carottes', 'vegetables', 41, 0.9, 9.6, 0.2, 2.8, '100g', 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=150&h=150&fit=crop'),
('Tomates', 'vegetables', 18, 0.9, 3.9, 0.2, 1.2, '100g', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=150&h=150&fit=crop'),
('Courgettes', 'vegetables', 17, 1.2, 3.1, 0.3, 1.0, '100g', 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=150&h=150&fit=crop'),
('Poivrons rouges', 'vegetables', 31, 1.0, 7.3, 0.3, 2.5, '100g', 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=150&h=150&fit=crop'),
('Aubergines', 'vegetables', 25, 1.0, 5.9, 0.2, 3.0, '100g', 'https://images.unsplash.com/photo-1564694202779-bc908c327862?w=150&h=150&fit=crop'),

-- Protéines
('Poulet (blanc)', 'proteins', 165, 31.0, 0, 3.6, 0, '100g', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=150&h=150&fit=crop'),
('Saumon', 'proteins', 208, 25.4, 0, 12.4, 0, '100g', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=150&h=150&fit=crop'),
('Thon', 'proteins', 144, 25.4, 0, 4.9, 0, '100g', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=150&h=150&fit=crop'),
('Œufs', 'proteins', 155, 13.0, 1.1, 11.0, 0, '100g', 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=150&h=150&fit=crop'),
('Tofu', 'proteins', 76, 8.0, 1.9, 4.8, 0.3, '100g', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop'),
('Lentilles', 'proteins', 116, 9.0, 20.1, 0.4, 7.9, '100g', 'https://images.unsplash.com/photo-1509731490302-d5a0e82bee3e?w=150&h=150&fit=crop'),
('Quinoa', 'proteins', 120, 4.4, 21.3, 1.9, 2.8, '100g', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop'),

-- Céréales et féculents
('Riz brun', 'grains', 111, 2.6, 23.0, 0.9, 1.8, '100g', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=150&h=150&fit=crop'),
('Avoine', 'grains', 389, 16.9, 66.3, 6.9, 10.6, '100g', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=150&h=150&fit=crop'),
('Pâtes complètes', 'grains', 124, 4.6, 25.0, 1.4, 3.5, '100g', 'https://images.unsplash.com/photo-1621996346565-e3dbc353d30e?w=150&h=150&fit=crop'),
('Pain complet', 'grains', 247, 13.0, 41.0, 4.2, 7.0, '100g', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&h=150&fit=crop'),
('Pommes de terre', 'grains', 77, 2.0, 17.5, 0.1, 2.2, '100g', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=150&h=150&fit=crop'),

-- Produits laitiers
('Yaourt grec', 'dairy', 59, 10.0, 3.6, 0.4, 0, '100g', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=150&h=150&fit=crop'),
('Lait écrémé', 'dairy', 34, 3.4, 5.0, 0.1, 0, '100ml', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=150&h=150&fit=crop'),
('Fromage blanc 0%', 'dairy', 40, 7.5, 3.2, 0.2, 0, '100g', 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=150&h=150&fit=crop'),
('Mozzarella', 'dairy', 280, 28.0, 2.2, 17.0, 0, '100g', 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=150&h=150&fit=crop'),

-- Matières grasses et noix
('Huile d''olive', 'fats', 884, 0, 0, 100, 0, '100ml', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=150&h=150&fit=crop'),
('Amandes', 'fats', 579, 21.2, 21.6, 49.9, 12.5, '100g', 'https://images.unsplash.com/photo-1508736793122-f516e3ba5569?w=150&h=150&fit=crop'),
('Noix', 'fats', 654, 15.2, 13.7, 65.2, 6.7, '100g', 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=150&h=150&fit=crop'),
('Graines de tournesol', 'fats', 584, 20.8, 20.0, 51.5, 8.6, '100g', 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=150&h=150&fit=crop'),
('Beurre de cacahuète', 'fats', 588, 25.8, 20.0, 50.4, 8.5, '100g', 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=150&h=150&fit=crop'),

-- Collations saines
('Barre protéinée', 'snacks', 450, 20.0, 40.0, 25.0, 5.0, '1 barre', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop'),
('Smoothie vert', 'snacks', 95, 2.1, 22.0, 0.8, 3.2, '250ml', 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=150&h=150&fit=crop');
