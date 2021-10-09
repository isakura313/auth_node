const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("token");
  if (!token) return res.status(401).json({ message: "Ошибка авторизации" });

  try {
    const decoded = jwt.verify(token, "paul123"); // вероятно здесь надо написать что то нормальное по  paul123
    req.user = decoded.user; // кодируем юзера
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Неправильный токен" });
  }
};
