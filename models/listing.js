const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./reviews.js");
const reviews = require("./reviews.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required : true
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  location: String,
  country: String,
  reviews:[
    {
      type:Schema.Types.ObjectId,
       ref: "Review"
    }
  ],
  owner:
  {
    type: Schema.Types.ObjectId,
     ref: "User"
  },
  category:{
    type:String,
    enum:["Trending", "Rooms", "Mountains", "Pools", "Iconic-Cities", "Sky-Shows", "Nature", "Paradise", "Camping", "Business", "Adventure"]
  }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
await reviews.deleteMany({_id: {$in: listing.reviews}});
  }
})


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;