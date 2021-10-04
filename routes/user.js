const express = require("express");
const { check, validationResult } = require("express-validator/check");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth");

const User = require("../model/User");

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

router.post(
  "/signup",
  [
    check("user", "Пожалуйста, введите валидное имя").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { user, email, password } = req.body;
    try {
      let user_name = await User.findOne({
        email, // ищем по почте
      });
      if (user_name) {
        return res.status(400).json({
          msg: "Пользователь с такой почтой уже существует!",
        });
      }

      user_name = new User({
        user,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10); // Генерируем  соль
      user_name.password = await bcrypt.hash(password, salt);

      await user_name.save();

      const payload = {
        user: {
          id: user_name.id,
        },
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 10000,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Ошибка при сохранении пользователя");
    }
  }
);

router.post(
  "/login",
  [
    check("email", "пожалуйста введите валидную почту").isEmail(),
    check(
      "password",
      "Пожалуйста введите пароль длинной не менее 6 символов"
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    try {
      let user_name = await User.findOne({
        email,
      });
      if (!user_name)
        return res.status(400).json({
          message: "Пользователь не найден!",
        });
      console.log(password);
      console.log(user_name.password);
      const isMatch = await bcrypt.compare(password, user_name.password);
      console.log(isMatch);
      if (!isMatch)
        return res.status(400).json({
          message: `Неправильный пароль !${password},${user_name.password}`,
        });

      const payload = {
        user: {
          id: user_name.id,
        },
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);

/**
 * @method - POST
 * @description - Get LoggedIn User
 * @param - /user/me
 */

router.get("/me", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user_name = await User.findById(req.user.id);
    res.json(user_name);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

module.exports = router;
