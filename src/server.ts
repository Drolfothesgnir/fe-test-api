
import express from 'express';
import { faker } from '@faker-js/faker';

const app = express();
const port = 3000;

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

const generateProducts = (count: number): Product[] => {
  const products: Product[] = [];

  for (let i = 0; i < count; i++) {
    const product: Product = {
      id: i + 1,
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price(10, 500)),
      description: faker.lorem.sentence(),
      imageUrl: faker.image.imageUrl(640, 480, 'fashion', true)
    };

    products.push(product);
  }

  return products;
};

app.get('/products', (req, res) => {
  const count = parseInt(req.query.count as string, 10) || 10;
  const products = generateProducts(count);
  res.json(products);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});