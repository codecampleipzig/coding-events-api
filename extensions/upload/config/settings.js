if (process.env.NODE_ENV === 'production') {
  module.exports = {
    provider: 'cloudinary',
    providerOptions: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    },
  };
} else {
  // to use the default local provider you can return an empty configuration
  module.exports = {};
}