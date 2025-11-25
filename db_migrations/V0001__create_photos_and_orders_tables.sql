CREATE TABLE IF NOT EXISTS photos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_email VARCHAR(255),
    total_amount INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    photo_id INTEGER REFERENCES photos(id),
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL
);

INSERT INTO photos (title, price, image_url, category) VALUES 
('Горный закат', 990, 'https://cdn.poehali.dev/projects/b12bdc6a-2bcb-4f7f-aa16-08884c737943/files/34fdedb1-04dd-4bb4-ad24-3fae3a1f66f3.jpg', 'Природа'),
('Ночной город', 1290, 'https://cdn.poehali.dev/projects/b12bdc6a-2bcb-4f7f-aa16-08884c737943/files/febd228a-3226-4abe-a4d9-d4dc2b3a9349.jpg', 'Город'),
('Минимализм', 890, 'https://cdn.poehali.dev/projects/b12bdc6a-2bcb-4f7f-aa16-08884c737943/files/6a5839f3-8463-4345-8781-22d0c495a1f2.jpg', 'Натюрморт');
