const express = require("express");
const router = express.Router({mergeParams:true});
const listController = require("../controllers/reviews")
const wrapAsync = require("../utils/wrapAsync")
const {validateReview, isLoggedIn , isReviewAuthor} =  require("../middleware")




//reviews route  - post method
router.post("/",isLoggedIn, validateReview, wrapAsync(listController.renderReviewPost ))



// review route - delete 
router.delete("/:reviewId", isReviewAuthor,isLoggedIn, wrapAsync(listController.renderDeleteReview))



module.exports = router;