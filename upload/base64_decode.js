// const fs = require('fs');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  // Get the base64 data from the uploaded file
  const base64Data = req.file.buffer.toString('base64');

  // Save the base64 data to the product_image field
  Product.update({ product_image: base64Data }, { where: { id: productId } })
    .then(() => {
      // Image uploaded and saved successfully
      res.status(200).json({ message: 'Image uploaded and saved successfully' });
    })
    .catch((error) => {
      // Handle the error if the image upload fails
      res.status(500).json({ error: 'Failed to upload and save the image' });
    });
});