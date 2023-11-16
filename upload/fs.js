const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Assuming you have an Express route for uploading the image
app.post('/upload', upload.single('image'), (req, res) => {
  // Handle the image upload here
});