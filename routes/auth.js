const { User } = require("../models");
const router = require("express").Router();
const UnauthenticatedError = require("../errors/UnauthenticatedError");
const { auth } = require("../middlewares/auth.middleware");

router
  .post("/login", async (req, res, next) => {
    try {
      const { name, password } = req.body;

      if (!name || !password) {
        throw new UnauthenticatedError("Please provide name and password");
      }

      const user = await User.findOne({
        where: { name },
        attributes: { include: ["password"] },
      });

      if (!user) {
        throw new UnauthenticatedError("Invalid username or password");
      }

      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        throw new UnauthenticatedError("Invalid username or password");
      }

      const token = await user.generateAuthToken();
      res.cookie("token", token, { httpOnly: true });
      res.status(200).json({ user, token });
    } catch (error) {
      next(error);
    }
  })

  .post("/logout", auth, (req, res) => {
    res.clearCookie("token").status(200).json({ message: "See you!" });
  })

  .get("/me", auth, (req, res) => {
    res.status(200).json(req.user);
  });

module.exports = router;
