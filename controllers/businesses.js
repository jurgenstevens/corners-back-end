import { Business } from "../models/business.js";

async function create(req, res) {
  try{
    //Skipping auth for now just want the functionality to work
    // console.log(req.user)
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







export { create }