import jwt from 'jsonwebtoken'

import { User } from '../models/user.js'
import { Profile } from '../models/profile.js'

// Patron signup function
async function patronSignUp(req, res) {
  try {
    if (!process.env.SECRET || !process.env.CLOUDINARY_URL) {
      throw new Error('Missing required environment variables')
    }

    const user = await User.findOne({ email: req.body.email })
    if (user) throw new Error('Account already exists')

    // Patron-specific authorization level
    const authorizationLevel = 100

    const newProfile = await Profile.create({
      ...req.body,
      authorizationLevel,
    })

    req.body.profile = newProfile._id
    const newUser = await User.create(req.body)

    const token = createJWT(newUser)
    res.status(200).json({ token })
  } catch (err) {
    console.error(err)

    // Rollback profile creation if user creation fails
    if (req.body.profile) {
      await Profile.findByIdAndDelete(req.body.profile)
    }
    res.status(500).json({ error: err.message })
  }
}

// Store Owner signup function
async function storeOwnerSignUp(req, res) {
  try {
    if (!process.env.SECRET || !process.env.CLOUDINARY_URL) {
      throw new Error('Missing required environment variables')
    }

    const user = await User.findOne({ email: req.body.email })
    if (user) throw new Error('Account already exists')

    // Store owner-specific authorization level
    const authorizationLevel = 200

    // Ensure store name and other store-related fields are present
    if (!req.body.storeName) {
      throw new Error('Store name is required for store owners')
    }

    const newProfile = await Profile.create({
      ...req.body,
      authorizationLevel,
      businessName: req.body.businessName, // Specific field for store owners
    })

    req.body.profile = newProfile._id
    const newUser = await User.create(req.body)

    const token = createJWT(newUser)
    res.status(200).json({ token })
  } catch (err) {
    console.error(err)

    // Rollback profile creation if user creation fails
    if (req.body.profile) {
      await Profile.findByIdAndDelete(req.body.profile)
    }
    res.status(500).json({ error: err.message })
  }
}

// async function signup(req, res) {
//   try {
//     if (!process.env.SECRET) throw new Error('no SECRET in back-end .env')
//     if (!process.env.CLOUDINARY_URL) {
//       throw new Error('no CLOUDINARY_URL in back-end .env file')
//     }

//     const user = await User.findOne({ email: req.body.email })
//     if (user) throw new Error('Account already exists')

//     let authorizationLevel;
//     if (req.body.isStoreOwner) {
//       authorizationLevel = 200 
//     } else {
//       authorizationLevel = 100 
//     }

//     const newProfile = await Profile.create({
//       ...req.body,
//       authorizationLevel,
//     })
    
//     req.body.profile = newProfile._id
//     const newUser = await User.create(req.body)

//     const token = createJWT(newUser)
//     res.status(200).json({ token })
//   } catch (err) {
//     console.log(err)
//     try {
//       if (req.body.profile) {
//         await Profile.findByIdAndDelete(req.body.profile)
//       }
//     } catch (err) {
//       console.log(err)
//       return res.status(500).json({ err: err.message })
//     }
//     res.status(500).json({ err: err.message })
//   }
// }

async function login(req, res) {
  try {
    if (!process.env.SECRET) throw new Error('no SECRET in back-end .env')
    if (!process.env.CLOUDINARY_URL) {
      throw new Error('no CLOUDINARY_URL in back-end .env')
    }

    const user = await User.findOne({ email: req.body.email })
    if (!user) throw new Error('User not found')

    const isMatch = await user.comparePassword(req.body.password)
    if (!isMatch) throw new Error('Incorrect password')

    const token = createJWT(user)
    res.json({ token })
  } catch (err) {
    handleAuthError(err, res)
  }
}

async function changePassword(req, res) {
  try {
    const user = await User.findById(req.user._id)
    if (!user) throw new Error('User not found')

    const isMatch = await user.comparePassword(req.body.password)
    if (!isMatch) throw new Error('Incorrect password')

    user.password = req.body.newPassword
    await user.save()

    const token = createJWT(user)
    res.json({ token })
    
  } catch (err) {
    handleAuthError(err, res)
  }
}

/* --== Helper Functions ==-- */
function handleAuthError(err, res) {
  console.log(err)
  const { message } = err
  if (message === 'User not found' || message === 'Incorrect password') {
    res.status(401).json({ err: message })
  } else {
    res.status(500).json({ err: message })
  }
}

function createJWT(user) {
  return jwt.sign({ user }, process.env.SECRET, { expiresIn: '24h' })
}

export { patronSignUp, storeOwnerSignUp, login, changePassword }
