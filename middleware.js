const Listing = require("./models/listing");
const Review = require("./models/reviews");


const ExpressError = require("./utils/ExpressError");
const {listingSchema} = require("./schema")
const { reviewSchema} = require("./schema")

module.exports.isLoggedIn = (req, res, next) =>{
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to make changes")
      return  res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings/home");
    }

    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

// ✅ Review Authorization
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};


module.exports.validateListing = (req, res, next)=>{
        let {error} =  listingSchema.validate(req.body);
       
       if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg)
       }else{
        next();
       }
    }
    
    module.exports.validateReview = (req, res, next)=>{
        let {error} =  reviewSchema.validate(req.body);
       if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg)
       }else{
        next();
       }
    }
    