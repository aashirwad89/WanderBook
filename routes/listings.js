const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, validateListing, isOwner } = require("../middleware");
const listControllers = require("../controllers/listing")
const multer  = require('multer')
const {storage} = require("../cloudConfig");
const Listing = require("../models/listing");
const upload = multer({ storage });


// INDEX ROUTE (all listings)
router.get("/", wrapAsync(listControllers.index));


// NEW ROUTE (form to create listing)
router.get("/new", isLoggedIn, listControllers.renderNewForm);



// CREATE ROUTE (add new listing)
router.post(
  "/", 
  isLoggedIn,
  upload.single("listing[image]"),  // multer first
  validateListing,                  // schema validation
  wrapAsync(listControllers.renderCreate) // controller last
);




// SHOW ROUTE (details of one listing)
router.get("/:id", wrapAsync(listControllers.renderShow));


// EDIT ROUTE (form to edit listing)
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listControllers.renderEdit));


// UPDATE ROUTE (update listing in DB)
router.put("/:id",
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    isOwner,
    wrapAsync(listControllers.renderUpdate)
);

// DELETE ROUTE (remove listing)
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listControllers.renderDelete));


module.exports = router;
