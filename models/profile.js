import mongoose from 'mongoose'

const Schema = mongoose.Schema

const profileSchema = new Schema({
  fullName:{
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  authorizationLevel: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  myStores: [{type: Schema.Types.ObjectId, ref: 'Business'}],
  productWishlist: [{type: Schema.Types.ObjectId, ref:'Products'}],
  rating: {
    type: Number,
    required: false
  }
},{
  timestamps: true,
})

const Profile = mongoose.model('Profile', profileSchema)

export { Profile }
