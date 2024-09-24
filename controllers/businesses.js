import { Business } from "../models/business.js"
import { Profile } from "../models/profile.js"

// Fetch businesses for the current user (Store Owners & Admins)
async function index(req, res) {
  try {
    const profile = await Profile.findById(req.user.profile._id).populate('myStores')
    
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" })
    }

    if (profile.authorizationLevel >= 200) {
      // If the user is a Store Owner or Admin, fetch their businesses
      return res.status(200).json({
        message: "Businesses fetched successfully",
        businesses: profile.myStores,
      })
    } else {
      return res.status(403).json({ message: "Unauthorized to view businesses" })
    }
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

// Admin can create a new business/store
async function create(req, res) {
  try {
    const profile = await Profile.findById(req.user.profile._id)

    if (profile.authorizationLevel !== 101) { // Check if user is Admin
      return res.status(403).json({
        message: "Only Admins can create new businesses",
      })
    }

    // Set the owner as the admin creating the business
    req.body.owner = profile._id
    req.body.authorizationLevel = 200 // Store Owner level for the created business

    const business = await Business.create(req.body)
    profile.myStores.push(business)
    await profile.save()

    return res.status(201).json({
      message: "Business created successfully",
      business,
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

// Show specific business details (Store Owners & Admins)
async function show(req, res) {
  try {
    const business = await Business.findById(req.params.businessId)
    if (!business) {
      return res.status(404).json({ message: "Business not found" })
    }
    return res.status(200).json({
      message: "Business details fetched successfully",
      business,
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

// Store Owner or Admin can edit a business
async function edit(req, res) {
  try {
    const business = await Business.findById(req.params.businessId)
    if (!business) {
      return res.status(404).json({ message: "Business not found" })
    }
    return res.status(200).json({
      message: "Business fetched for editing",
      business,
      daysEnum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

// Admin can approve a business
async function approveBusiness(req, res) {
  try {
    if (req.user.profile.authorizationLevel !== 101) {
      return res.status(403).json({ message: "Only Admins can approve businesses" })
    }
    const business = await Business.findById(req.params.businessId).populate("owner")
    if (!business) {
      return res.status(404).json({ message: "Business not found" })
    }
    const profile = await Profile.findById(business.owner._id)
    profile.authorizationLevel = 201
    await profile.save()
    business.authorizationLevel = 201
    await business.save()
    return res.status(200).json({
      message: "Business approved successfully",
      business,
      profile,
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

// Admin can deny a business
async function denyBusiness(req, res) {
  try {
    if (req.user.profile.authorizationLevel !== 101) {
      return res.status(403).json({ message: "Only Admins can deny businesses" })
    }
    const business = await Business.findById(req.params.businessId).populate("owner")
    if (!business) {
      return res.status(404).json({ message: "Business not found" })
    }
    const profile = await Profile.findById(business.owner._id)
    profile.authorizationLevel = 299
    await profile.save()
    business.authorizationLevel = 299
    await business.save()
    return res.status(200).json({
      message: "Business denied successfully",
      business,
      profile,
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

// Admin can update business account details
async function updateBusinessAccount(req, res) {
  try {
    if (req.user.profile.authorizationLevel !== 101) {
      return res.status(403).json({ message: "Only Admins can update business account details" })
    }
    const business = await Business.findByIdAndUpdate(req.params.businessId, req.body, { new: true })
    if (!business) {
      return res.status(404).json({ message: "Business not found" })
    }
    return res.status(200).json({
      message: "Business account details updated successfully",
      business,
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

// Store Owners can update their business profile
async function updateBusinessProfile(req, res) {
  try {
    if (req.user.profile.authorizationLevel !== 201) {
      return res.status(403).json({ message: "Only Store Owners can update their business profile" })
    }
    const business = await Business.findByIdAndUpdate(req.params.businessId, req.body, { new: true })
    if (!business) {
      return res.status(404).json({ message: "Business not found" })
    }
    return res.status(200).json({
      message: "Business profile updated successfully",
      business,
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

// Admin can delete a business
async function deleteBusiness(req, res) {
  try {
    if (req.user.profile.authorizationLevel !== 101) {
      return res.status(403).json({ message: "Only Admins can delete businesses" })
    }
    const business = await Business.findById(req.params.businessId)
    if (!business) {
      return res.status(404).json({ message: "Business not found" })
    }
    await business.deleteOne()
    return res.status(200).json({ message: "Business deleted successfully" })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

export {
  index,
  create,
  show,
  edit,
  approveBusiness,
  denyBusiness,
  updateBusinessAccount,
  updateBusinessProfile,
  deleteBusiness as delete,
}
