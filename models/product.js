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
    required: false
  },
  outOfStock: {
    type: Boolean,
    required: false
  }
})

const Product = mongoose.model('Product', productSchema)

export { Product }