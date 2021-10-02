const express = require("express");
const bodyParser = require("body-parser");
const user = require("./routes/user");
const file = require("./routes/file");
const InitiateMongoServer = require("./config/db");


InitiateMongoServer(); // Берем Монго сервер

const app = express();

// PORT
const PORT = process.env.PORT || 3081;

// Middleware
app.use(bodyParser.json());
app.use("/public", express.static("public")); //раздаем статику - возможно это будет nuxt
app.use("/files", file); /// раздаем файлы

app.get("/", (req, res) => {
  res.json({ message: "API запущен" });
});

/**
 * Router Middleware
 * Router - /user/*
 * Method - *
 */
app.use("/user", user);

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
