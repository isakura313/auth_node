const mongoose = require("mongoose"); // Mongoose представляет специальную ODM-библиотеку (Object Data Modelling) для работы с MongoDB, которая позволяет сопоставлять объекты классов и документы коллекций из базы данных.
const key = require("../key"); // добавляем ключ для доступа ко внешней базе данных

// Replace this with your MONGOURI.
// const MONGOURI = 'mongodb://mongo-db:27017' // uncomment this for docker
const MONGOURI = key.key;

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
    });
    console.log("Произошло подключение к базе данных");
  } catch (e) {
    console.log(e, "произошла ошибка подключения");
    throw e;
  }
};

module.exports = InitiateMongoServer;
