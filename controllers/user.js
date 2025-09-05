
const User = require("../models/User");

module.exports.renderPost = async (req, res)=>{

  try{
let {username , email, password} = req.body;
const newUser = new User({
    email , username
})
const registeredUser =  await User.register(newUser, password);
console.log(registeredUser);
req.login(registeredUser, (err)=>{
if(err){
  return next(err)
}
req.flash("success", "Welcome to WanderBook")
res.redirect("/listings")
})

  }catch(e){
    req.flash("error", e.message);
    res.redirect("/signup");
  }
  
}
module.exports.signupForm =  (req, res)=>{
res.render("user/signup.ejs")
}

module.exports.loginForm =  async(req, res)=>{
  res.render("user/login.ejs");
}
module.exports.loginForm2 = async(req, res)=>{
req.flash("success", "Welcome to WanderBook , You are logged In");
let redirectUrl  = res.locals.redirectUrl || "/listings";
res.redirect(redirectUrl);
}


module.exports.logoutForm = (req, res)=>{
  req.logout((err)=>{
    if(err){
      return next(err)
    }
    req.flash("success", "You are logged out");
    res.redirect("/listings")
  })
}