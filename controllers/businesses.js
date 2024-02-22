import { Business } from "../models/business.js";
import { Product } from "../models/product.js";


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
        path: "businessOwnerName",
        populate: {
          path: "fullName"
        }
      },{
        path: "productsOnSale",
        populate: {
          path:"_id",
          model: "Product"
        }
      },
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
    Business.findById(req.params.id)
    .then(business => {
      if (business.businessOwnerName._id.equals(req.user.profile)) {
        Business.findByIdAndUpdate(req.params.id, req.body, {new: true})
        .then(updatedBusiness => {
          res.json(updatedBusiness)
        })
      }
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
        // }
        ,{
          path: "productsOnSale"
        }
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

async function addProduct(req, res) {
  try{
    const business = await Business.findById(req.params.id)
    const product = await Product.findById(req.body)
    console.log(product)

    if (!business || !product) {
      return res.status(404).json({ message: 'Not found' })
    }

    business.productsOnSale.push(product)
    console.log(business)
    Business.findByIdAndUpdate(req.params.id, business, {new: true})
    .then(updatedBusiness => {
      updatedBusiness.populate([
        {
          path: "productsOnSale"
        },{
          path: "productsOnSale",
          populate : {
            path: "products",
            populate: {
              path: "productName"
            }
          }
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

async function clearProducts(req, res) {
  try{
    const business = await Business.findById(req.params.id)

    business.productsOnSale = []

    Business.findByIdAndUpdate(req.params.id, business, {new: true})
    .then(updatedBusiness => {
      res.json(updatedBusiness)
    })
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  } 
}

async function editStock(req, res) {
  try{
    const business = await Business.findById(req.params.id)
    const product = await Product.findById(req.body.itemId)

    if (!business || !product) {
      return res.status(404).json({ message: 'Not found' })
    }

    Product.findByIdAndUpdate(req.body.itemId, { count: req.body.count }, { new: true })
    .then(counted => {
      res.json(counted)
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
  edit,
  deleteBusiness as delete,
  addProduct,
  clearProducts,
  editStock
  }