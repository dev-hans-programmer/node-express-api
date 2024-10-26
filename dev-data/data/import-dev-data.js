const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../src/models/tourModel');
require('dotenv').config();

const connectDB = () => mongoose.connect(process.env.DB_URI);

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

async function importData() {
  try {
    console.log('Data import start');
    await Tour.create(tours);
    console.log('Data import finished');
  } catch (err) {
    console.log(err);
  }
  process.exit();
}

async function deleteData() {
  try {
    await Tour.deleteMany();
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
