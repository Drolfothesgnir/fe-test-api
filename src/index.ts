
import { faker } from '@faker-js/faker';
import jsonServer from 'json-server'

const port = process.env.PORT || 4000;
const nProducts = process.env.COUNT || "20"
const db = {
  products: generateProducts(parseInt(nProducts))
}

const server = jsonServer.create()
const router = jsonServer.router(db)
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(router)
server.listen(port, () => {
  console.log('JSON Server is running')
})

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

function generateProducts (count: number): Product[] {
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
