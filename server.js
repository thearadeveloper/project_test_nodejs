const express = require('express');
const { User } = require('./model/models_user.js');
const { Product } = require('./model/models_product.js');
const app = express();
const port = 3000;

// Parse JSON request bodies
app.use(express.json());

// Define API routes

// Get all users
// app.get('/users', async (req, res) => {
//   try {
//     const users = await User.findAll();
//     res.json( {'code':200,
//     'data':users});
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });
// // Create a new user
// app.post('/users', async (req, res) => {
//     try {
//       const user = await User.create(req.body);
//       res.status(201).json(user);
//     } catch (error) {
//       console.error('Error creating user:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });
//   // Update a user
// app.put('/users/:id', async (req, res) => {
//     try {
//       const userId = req.params.id;
//       const { firstName, lastName, email } = req.body;
  
//       const user = await User.findByPk(userId);
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }
  
//       user.firstName = firstName;
//       user.lastName = lastName;
//       user.email = email;
//       await user.save();
  
//       res.json(user);
//     } catch (error) {
//       console.error('Error updating user:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });
//   // Delete a user
// app.delete('/users/:id', async (req, res) => {
//     try {
//       const userId = req.params.id;
  
//       const user = await User.findByPk(userId);
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }
  
//       await user.destroy();
  
//       res.json({ message: 'User deleted successfully' });
//     } catch (error) {
//       console.error('Error deleting user:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });



// Get all Product

app.get('/product', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);

    // Validate and sanitize user input for page and limit
    if (!Number.isInteger(page) || !Number.isInteger(limit) || page <= 0 || limit <= 0) {
      return res.status(400).json({ error: 'Invalid parameters for pagination.' });
    }

    const offset = (page - 1) * limit;

    const products = await Product.findAll({
      offset: offset,
      limit: limit,
      order: [
        ['id', 'DESC'],
    ],
    });

    // Check if there are more results
    const hasMore = (page * limit) < (await Product.count());

    // Modify the product data to include direct image URLs
    const productsWithImageURLs = products.map(product => {
      // Assuming product_image is stored as an image path
      const imagePath = product.product_image;
      const imageUrl = `${imagePath}`;
      return { ...product.toJSON(), product_image: imageUrl };
    });

    res.json({
      products: productsWithImageURLs,
      currentPage: page,
      totalPages: Math.ceil(await Product.count() / limit),
      hasMore: hasMore,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new product
app.post('/product', async (req, res) => {
    try {
      const product = await Product.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  // Update a product
app.put('/product/:id', async (req, res) => {
    try {
      const productId = req.params.id;
      const { product_name, price, color, qty ,qr_code,product_image} = req.body;
  
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      product.product_name = product_name;
      product.price = price;
      product.color = color;
      product.qty = qty;
      product.qr_code = qr_code;
      product.product_image = product_image;
      await product.save();
      res.json(product);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  // Delete a user
app.delete('/product/:id', async (req, res) => {
    try {
      const productId = req.params.id;
  
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      await product.destroy();
  
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting Product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

const multer = require('multer');
const sharp = require('sharp'); 
const fs = require('fs').promises;
const path = require('path');

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.post('/upload', upload.single('product_image'), async (req, res) => {
  try {
    // Generate a unique filename, or use some logic to create a unique identifier
    const uniqueFilename = `${Date.now()}_temp.png`;

    // Convert the uploaded image to PNG format using sharp
    const convertedImageBuffer = await sharp(req.file.buffer)
      .toFormat('png')
      .toBuffer();

    // Save the converted image to the 'public' directory
    const publicDir = path.join(__dirname, 'public');
    const imagePath = path.join(publicDir, uniqueFilename);
    await fs.writeFile(imagePath, convertedImageBuffer);

    // Respond with a success message and image URL
    res.status(200).json({ status: 'success', imagePath: uniqueFilename });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const jwt = require('jsonwebtoken');

// Register a new user
app.post('/register', async (req, res) => {
  try {
    const { username, password, email, gender, phoneNumber, avatar } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
      gender,
      phoneNumber,
      avatar,
    });

    // Generate and sign a token
    const token = jwt.sign({ userId: newUser.id }, 'your-secret-key', { expiresIn: '1h' });

    res.status(201).json({
      message: 'User registered successfully.',
      userId: newUser.id,
      token,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Log in a user
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Passwords match, generate and sign a token
      const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });

      return res.json({
        message: 'Login successful.',
        userId: user.id,
        token,
      });
    } else {
      // Passwords do not match
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch user info
app.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }, // Exclude password from the response
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update user info
app.put('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { newUsername, email, gender, phoneNumber, avatar } = req.body;

    if (!newUsername) {
      return res.status(400).json({ error: 'New username is required.' });
    }

    const existingUser = await User.findOne({ where: { username: newUsername } });

    if (existingUser && existingUser.id !== userId) {
      return res.status(400).json({ error: 'Username is already taken.' });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Update username and other user info fields
    user.username = newUsername;
    user.email = email || user.email;
    user.gender = gender || user.gender;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.avatar = avatar || user.avatar;

    await user.save();

    res.json({ message: 'User info updated successfully.' });
  } catch (error) {
    console.error('Error updating user info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});