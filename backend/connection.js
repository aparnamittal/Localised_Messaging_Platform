const mongoose = require('mongoose');
require('dotenv').config();

const Connection = async () => {
  const url = `mongodb://localhost:27017/message-application`
  try {
    await mongoose.connect(url);
    console.log('Database Connected Succesfully');
  } catch (error) {
    console.log('Error: ', error.message);
  }

};

module.exports = Connection;
