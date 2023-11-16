const { Product } = require('./model/models_product.js');
async function createProduct() {
  try {
    const product = await Product.create({
        product_name:"ok",
        price:100,
        color:"black",
        qty:1000,
        qr_code:"",
        product_name:""
    });
    console.log('Product created:', product.toJSON());
  } catch (error) {
    console.error('Error creating Product:', error);
  }
}
createProduct();