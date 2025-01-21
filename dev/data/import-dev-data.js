const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Trip = require('../../models/tripModel');
const User = require('../../models/userModel');
const Reviews = require('../../models/reviewModel');

dotenv.config({ path: './config.env' });

const db = process.env.DATABASE.replace(
  '<DATABASE_PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(db).then(() => {
  console.log('DB connection successful');
});

const trips = JSON.parse(
  fs.readFileSync(`${__dirname}/trips-with-location.json`, 'utf-8'),
);

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);

const importData = async () => {
  try {
    await Trip.create(trips);
    await User.create(users, { validateBeforeSave: false });
    await Reviews.create(reviews);
    console.log('data successfully loaded...');
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Trip.deleteMany();
    await User.deleteMany();
    await Reviews.deleteMany();
    console.log('data deleted successfully...');
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
}
if (process.argv[2] === '--delete') {
  deleteData();
}
