const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Ошибка авторизации" });

  try {
    const decoded = jwt.verify(token, "randomString"); // вероятно здесь надо написать что то нормальное по  randomString
    req.user = decoded.user; // кодируем юзера
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Неправильный токен" });
  }
};
