import { Product } from "../models/product.js"

async function index(req, res) {
  try{
    const products = await Product.find({})

    res.json(products)

  } catch (err){
    console.log(err)
    res.status(500).json(err)
  }
}

async function create(req, res) {
  try{
    const product = await Product.create(req.body)
    
    res.json(product)
    
  } catch(err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function deleteProduct(req, res){
  try{
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)
    res.json(deletedProduct)
    console.log("this product was deleted:", deletedProduct.productName)

  } catch(err) {
    console.log(err)
    res.status(500).json(err)
  }
}

export {
  index,
  create,
  deleteProduct as delete
}