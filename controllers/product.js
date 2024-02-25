import { Product } from "../models/product.js"

async function index(req, res) {
  try{
    Product.find({})
    .then(products =>
      res.json(products)
    )

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



export {
  index,
  create
}