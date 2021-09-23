const mongoose = require("mongoose"); // Mongoose представляет специальную ODM-библиотеку (Object Data Modelling) для работы с MongoDB, которая позволяет сопоставлять объекты классов и документы коллекций из базы данных. 
const key = require('../key') // добавляем ключ

// Replace this with your MONGOURI.
console.log(key.key)
const MONGOURI = key.key;

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true
    });
    console.log("Подключение к базе данных");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;