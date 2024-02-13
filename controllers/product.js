
import { Product } from "../models/product"

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


export {
  index
}