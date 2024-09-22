import mongoose from 'mongoose'

const Schema = mongoose.Schema

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: true
    },
    author: { type: Schema.Types.ObjectId, ref: 'Profile' }
  },
  { timestamps: true }
)

const productSchema = new Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  brandName: {
    type: String,
    required: true,
    trim: true
  },
  countryOfOrigin: {
    type: String,
    trim: true,
    default: null
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  sku: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  images: {
    type: [String],
    default: []
  },
  tags: {
    type: [String],
    default: []
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
    type: boolean
  },
  reviews: [commentSchema],
  }, {
  timestamps: true
})

const Product = mongoose.model('Product', productSchema)

export { Product }