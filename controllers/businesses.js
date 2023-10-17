import { Business } from "../models/business";

async function create(req, res) {
  try{
    req.body.businessOwnerName = req.user.profile.fullName
    Business.create(req.body)
    .then(business => {
      Business.findById(business._id)
      .populate([
        {
          path: "patrons"
        },{
          path: "customerProductOptions"
        },{
          path: "productsPendingApproval"
        },{
          path: "recentlyAddedProducts"
        },{
          path: "rejectedProducts"
        },{
          path: "productsOnSale"
        }
      ])
      .then(popBusiness => {
        res.json(popBusiness)
      })
    })
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}







export { create }