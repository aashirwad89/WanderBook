const Listing = require("../models/listing");
const Review = require("../models/reviews");

module.exports.renderReviewPost = async(req, res)=>{
 let listings = await Listing.findById(req.params.id)
 let newReview = new Review(req.body.review);
 newReview.author = req.user._id; 
 listings.reviews.push(newReview)
//  console.log(newReview);

  await newReview.save();
await listings.save();
req.flash("success", " Review created!");
res.redirect(`/listings/${listings._id}`)
}


module.exports.renderDeleteReview = async(req, res)=>{
    let {id, reviewId} = req.params;
    
 await   Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted!");
  res.redirect(`/listings/${id}`);
}