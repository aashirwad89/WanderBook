const Listing = require("../models/listing")


module.exports.index = async (req, res) => {
    const { q } = req.query;
  let allListing;

  if (q) {
    // Regex search on title + location + country
    allListing = await Listing.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { country: { $regex: q, $options: "i" } }
      ]
    });
  } else {
    allListing = await Listing.find({});
  }

    res.render("listings/index", { allListing, query: q || "" });
}


module.exports.renderNewForm =  (req, res) => {
    console.log(req.user);
    res.render("listings/new");
}

module.exports.renderCreate = async (req, res, next) => {
    const newList = new Listing(req.body.listing);
    newList.owner = req.user._id;

    if (req.file) {
        newList.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await newList.save();
    req.flash("success", "New Listing created!");
    res.redirect("/listings");
};



    module.exports.renderShow = async (req, res) => {
        let { id } = req.params;
       const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author" }
      })
      .populate("owner");
    
        if (!listing) {
            req.flash("error", "Listing you requested does not exist");
            return res.redirect("/listings");
        }
    
        res.render("listings/show", { listing });
    }

    module.exports.renderEdit = async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing you requested does not exist");
            return res.redirect("/listings");
        }
    
        res.render("listings/edit", { listing });
    }

    module.exports.renderUpdate = async (req, res) => {
        let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file !== "undefined"){
  let url = req.file.path;
let filename = req.file.filename;
listing.image = {url, filename};
await listing.save();
  }
        req.flash("success", "Listing updated!");
        res.redirect(`/listings/${id}`);
    }

    module.exports.renderDelete = async (req, res) => {
    let { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}
