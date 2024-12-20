const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../src/models/tourModel');
const User = require('../../src/models/userModel');
const Review = require('../../src/models/reviewModel');
require('dotenv').config();

const connectDB = () => mongoose.connect(process.env.DB_URI);

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

async function importData() {
  try {
    console.log('Data import start');
    await Tour.create(tours);
    await User.create(users);
    await Review.create(reviews);
    console.log('Data import finished');
  } catch (err) {
    console.log(err);
  }
  process.exit();
}

async function deleteData() {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data deleted');
  } catch (err) {
    console.log(err);
  }
}

async function main() {
  await connectDB();
  await deleteData();
  await importData();
}

main().catch((err) => console.log(err));
