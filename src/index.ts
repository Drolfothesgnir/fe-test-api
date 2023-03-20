import { faker } from "@faker-js/faker";
import jsonServer from "json-server";

const port = process.env.PORT || 4000;
const nProducts = process.env.COUNT || "20";

const tagTypes = [
  faker.commerce.department,
  faker.commerce.product,
  faker.commerce.productAdjective,
  faker.commerce.productMaterial,
];

type CategorySet = { [key: string]: boolean };

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  color: string;
  categories: CategorySet;
  brand: string;
  available: boolean;
  rating: number;
}
const products = generateProducts(parseInt(nProducts));

const db = {
  products,
  categories: getPropList(products, "categories"),
  colors: getPropList(products, "color"),
  brands: getPropList(products, 'brand')
};

const server = jsonServer.create();
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.get("/echo", (req, res) => {
  res.jsonp(req.query);
});

server.use("/api/shop/", router);

server.listen(port, () => {
  console.log("JSON Server is running");
});

function generateProducts(count: number): Product[] {
  const products: Product[] = [];

  for (let i = 0; i < count; i++) {
    const product: Product = {
      id: i + 1,
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price(10, 500)),
      description: faker.commerce.productDescription(),
      imageUrl: faker.image.fashion(640, 480, true),
      color: faker.color.human(),
      categories: generateProductTags(),
      brand: faker.company.name(),
      available: !!bernRandomValue(0.7),
      rating: +(Math.random() * 5).toPrecision(2),
    };

    products.push(product);
  }

  return products;
}

function generateProductTags() {
  const n = Math.floor(Math.random() * 6) + 1;
  const result: CategorySet = {};
  for (let i = 0; i < n; i++) {
    const j = Math.floor(Math.random() * tagTypes.length);
    const key = tagTypes[j]();
    result[key] = true;
  }
  return result;
}

function discreteRandomValue<T>(outcomes: T[], probabilities: number[]): T {
  // Check that the arrays have the same length
  if (outcomes.length !== probabilities.length) {
    throw new Error("The arrays must have the same length");
  }

  // Calculate the cumulative probabilities
  const cumulativeProbs: number[] = [];
  let sum = 0;
  for (let i = 0; i < probabilities.length; i++) {
    sum += probabilities[i];
    cumulativeProbs.push(sum);
  }

  // Generate a random number between 0 and 1
  const rand = Math.random();

  // Find the outcome that corresponds to the random number
  for (let i = 0; i < cumulativeProbs.length; i++) {
    if (rand < cumulativeProbs[i]) {
      return outcomes[i];
    }
  }

  // This should never happen
  throw new Error("Error generating discrete probability distribution");
}

function bernRandomValue(p: number) {
  if (p < 0 || p > 1) {
    throw new Error("p must be between 0 and 1");
  }

  return discreteRandomValue([1, 0], [p, 1 - p]);
}

function getPropList(arr: Product[], prop: keyof Product) {
  const mapped = arr.map((item) => item[prop]);
  const isObj = typeof mapped[0] === "object";
  let reduced = mapped;
  if (isObj) {
    reduced = (mapped as CategorySet[])
      .map((item) => Object.keys(item))
      .reduce((acc, item) => acc.concat(item));
  }
  const set = new Set(reduced);
  return Array.from(set.values());
}
