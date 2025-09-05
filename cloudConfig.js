const cloudinary = require('cloudinary').v2;
const {CLoudinaryStorage, CloudinaryStorage} = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_APIKEY,
    api_secret: process.env.CLOUD_APISECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder: 'WanderBook_dev',
        allowedFormats: ["png, jpg, jpeg"],
    },
});


module.exports = {
    cloudinary,
    storage
}