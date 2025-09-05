if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })


// Database connect
const dbUrl = process.env.ATLAS_DB_URL;
main()
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
}

// View engine + static files + parsers
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Session config

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
    secret : process.env.SECRET
  },
  touchAfter: 24*3600,
})
store.on("error", ()=>{
  console.log("ERROR in Mongo session store" , err)
})
const sessionOption = {
   store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


app.use(session(sessionOption));




// Flash
app.use(flash());

// Passport setup (AFTER session)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global middleware (locals for views)
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Routes
const review = require("./routes/review");
const listings = require("./routes/listings");
const user = require("./routes/user");



app.use("/listings", listings);
app.use("/listings/:id/reviews", review);
app.use("/", user);

// Error handling (should always be last)
app.use((err, req, res, next) => {
  let { status = 500, msg = "Something went wrong!" } = err;
  res.status(status).render("Error.ejs", { msg });
});

app.listen(8080, () => {
  console.log("App is listening on port 8080");
});
