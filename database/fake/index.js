const mysql = require('mysql');
const fakeData = require('./fakeData.js');
const faker = require('faker');
const util = require('util');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'reviewsDB'
});

connection.connect((err) => {
  if (err) {
    console.error(error);
  }
});

// don't forget to use ? to escape from sql injections

const seedFakeData = async function (n) {
  const dataSeed = fakeData(n);
  console.log('HERES THE DATASEED: ' + JSON.stringify(dataSeed));
  for (let product of dataSeed.products) {
    let queryString = 'INSERT INTO products (product_name, department) VALUES(?, ?);';
    let params = [product.productName, product.productImage, product.department];
    await connection.query(queryString, params);
  }
  for (let review of dataSeed.reviews) {
    let queryString = 'INSERT INTO reviews (body, helpfulness_score) VALUES(?, ?);';
    console.log('HERES REVIEW ITSELF: ' + review);
    let params = [review, 0];
    await connection.query(queryString, params);
  }
  for (let attribute of dataSeed.attributes) {
    let queryString = 'INSERT INTO rateable_attributes (attributeName) VALUES (?);';
    await connection.query(queryString, [attribute]);
  }
  for (let user of dataSeed.users) {
    let queryString = 'INSERT INTO users (username) VALUES (?);';
    await connection.query(queryString, [user]);
  }
  var i = 1;
  for (let image of dataSeed.images) { // currently, 1 image per product. considerably more per product and a fairly even by variable distribution is eventual goal
    let queryString = 'INSERT INTO images (prod_id, loc) VALUES (?, ?);';
    // let nextId;
    // nextId = await connection.query('SELECT COUNT(*) AS total FROM products;');
    // console.log(typeof nextId);
    // console.log('THE NEXT ID: ' + Object.keys(nextId));
    // nextId++;
    await connection.query(queryString, [i, image]);
    i++;
  }
  connection.end();
};

seedFakeData(30);

// prolly just serve up static files with S3

// return {username: result[0], title: result[1], body: result[2], rating: result[3]};

