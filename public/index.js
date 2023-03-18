"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var faker_1 = require("@faker-js/faker");
var json_server_1 = __importDefault(require("json-server"));
var port = process.env.PORT || 4000;
var nProducts = process.env.COUNT || "20";
var db = {
    products: generateProducts(parseInt(nProducts))
};
var server = json_server_1.default.create();
var router = json_server_1.default.router(db);
var middlewares = json_server_1.default.defaults();
server.use(middlewares);
server.get('/echo', function (req, res) {
    res.jsonp(req.query);
});
server.use(router);
server.listen(port, function () {
    console.log('JSON Server is running');
});
function generateProducts(count) {
    var products = [];
    for (var i = 0; i < count; i++) {
        var product = {
            id: i + 1,
            name: faker_1.faker.commerce.productName(),
            price: parseFloat(faker_1.faker.commerce.price(10, 500)),
            description: faker_1.faker.lorem.sentence(),
            imageUrl: faker_1.faker.image.imageUrl(640, 480, 'fashion', true)
        };
        products.push(product);
    }
    return products;
}
;
