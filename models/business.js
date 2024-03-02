import mongoose from 'mongoose'

const Schema = mongoose.Schema

const businessSchema = new Schema({
  businessName: {
    type: String,
    required: true
  },
  businessOwnerName: { type: Schema.Types.ObjectId, ref: 'Profile' },
  storePhoneNumber: {
    type: String,
    required: true
  },
  storeEmail: {
    type: String,
    required: true
  }, 
  storeAddress: {
    type: String,
    required: true
  }, 
  storeZipcode: {
    type: Number,
    required: true
  }, 
  patrons: [{type: Schema.Types.ObjectId, ref: 'Profile' }], 
  customerProductOptions: [{type: Schema.Types.ObjectId, ref: 'Product' }], 
  productsPendingApproval: [{type: Schema.Types.ObjectId, ref: 'Product' }], 
  recentlyAddedProducts: [{type: Schema.Types.ObjectId, ref: 'Product' }], 
  rejectedProducts: [{type: Schema.Types.ObjectId, ref: 'Product' }], 
  productsOnSale: [{ products: {type: Schema.Types.ObjectId, ref: 'Product' }, count: Number}], 
  }, {
    timestamps: true,
})

const Business = mongoose.model('Business', businessSchema)

export { Business }