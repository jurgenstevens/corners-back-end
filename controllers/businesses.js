import { Business } from "../models/business.js";


async function index(req, res) {
  try{
    Business.find({})
    .then(stores => 
    res.json(stores)  
    )
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}


async function show(req, res) {
  try{
    Business.findById(req.params.id)
    .populate([
      {
      path: "businessOwnerName"
      },
      {
        path: "businessOwnerName.fullName"
      }
    ])
    .then(business => 
      res.json(business)
    )
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}


async function edit(req, res) {
  try{
    Business.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(updatedBusiness => {
      res.json(updatedBusiness)
    })
  } catch {
    console.log(err)
    res.status(500).json(err)
  }
}

async function create(req, res) {
  try{
    //Skipping auth for now just want the functionality to work
    // console.log(req.user)
    req.body.businessOwnerName = req.user.profile
    Business.create(req.body)
    .then(business => {
      Business.findById(business._id)
      .populate([
        {
          path: "patrons"
        }
        // commented out temporarly until needed
        //,{
        //   path: "customerProductOptions"
        // },{
        //   path: "productsPendingApproval"
        // },{
        //   path: "recentlyAddedProducts"
        // },{
        //   path: "rejectedProducts"
        // },{
        //   path: "productsOnSale"
        // }
      ])
      .then(popBusiness => {
        // console.log(popBusiness)
        res.json(popBusiness)
      })
    })
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function deleteBusiness(req, res) {
  try {
    Business.findById(req.params.id)
    .then(business => {
      if (business.businessOwnerName._id.equals(req.user.profile)) {
        Business.findByIdAndDelete(business._id)
        .then(deletedBusiness => {
          res.json(deletedBusiness)
          console.log("this was deleted:", deletedBusiness)
        })
      }
    })
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

export { 
  create,
  show,
  index,
  deleteBusiness as delete
  }