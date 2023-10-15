import mongoose from 'mongoose'

const Schema = mongoose.Schema

const productSchema = new Schema({
  productName: {
    type: String,
    required: true
  },
  productCategory: {
    type: String,
    required: true
  },
  requestCount: {
    type: String,
    required: true
  },
  outOfStock: {
    type: Boolean,
    required: true
  }
})

const Product = mongoose.model('Product', productSchema)

export { Product }