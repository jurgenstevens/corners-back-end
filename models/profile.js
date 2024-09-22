import mongoose from 'mongoose'

const Schema = mongoose.Schema

const profileSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  authorizationLevel: {
    type: Number,
    required: true,
    enum: [100, 200],
    default: 100
  },
  zipCode: {
    type: Number,
    required: true
  },
  myStores: [
    { type: Schema.Types.ObjectId, ref: 'Business' }
  ],
  productWishlist: [
    { type: Schema.Types.ObjectId, ref:'Products' }
  ]
},{
  timestamps: true,
})

const Profile = mongoose.model('Profile', profileSchema)

export { Profile }
