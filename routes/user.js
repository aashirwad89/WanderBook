const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const listController = require("../controllers/user")

router.get("/signup",listController.signupForm)

router.post("/signup", wrapAsync (listController.renderPost))

router.get("/login", listController.loginForm)

router.post("/login",
  saveRedirectUrl,
  passport.authenticate
  ("local", {failureRedirect: '/login',
    failureFlash: true,
  })
    , (listController.loginForm2)
)

router.get("/logout", listController.logoutForm);

module.exports = router; 