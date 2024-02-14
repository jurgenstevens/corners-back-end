
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
    Product.create(req.body)
    .then(product => [
      res.json(product)
    ])
    
  } catch(err) {
    console.log(err)
    res.status(500).json(err)
  }
}




export {
  index,
  create
}