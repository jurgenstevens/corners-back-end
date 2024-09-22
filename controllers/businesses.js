import { Business } from "../models/business.js";
import { Product } from "../models/product.js";


async function index(req, res) {
  try{
    const stores = await Business.find({})
    res.json(stores)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}


async function show(req, res) {
  try{
    const business = await Business.findById(req.params.id)
    .populate([
      {
        path: "businessOwnerName",
        populate: {
          path: "name"
        }
      },{
        path: "productsOnSale",
        populate: {
          path:"_id",
          model: "Product"
        }
      },
    ])
    
    res.json(business)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}


async function edit(req, res) {
  try{
    const business = Business.findById(req.params.id)
    if (business.businessOwnerName._id.equals(req.user.profile)) {
      const updatedBusiness = await Business.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new : true }
      )
      res.status(200).json(updatedBusiness)
    } else {
      res.status(401).json(err)
    }
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

    // const business = await Business.findById(req.params.id)
    // commented out until we have a way to sign in properly
    // if (business.businessOwnerName._id.equals(req.user.profile)) {
      const deletedBusiness = await  Business.findByIdAndDelete(req.params.id)
      res.json(deletedBusiness)
      console.log("this business was deleted: ", deleteBusiness)
    // }
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
    if (!business) {
      return res.status(404).json({ message: 'Business not found' })
    }
    const product = await Product.findByIdAndUpdate(req.body.itemId, { count: req.body.count }, { new: true })
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    const productIndex = business.productsOnSale.findIndex(item => item._id.toString() === req.body.itemId)
    if (productIndex !== -1) {
      business.productsOnSale[productIndex].count = req.body.count
    } else {
      business.productsOnSale.push({ _id: req.body.itemId, count: req.body.count })
    }
    const updatedBusiness = await business.save()
    await updatedBusiness.populate({
      path: 'productsOnSale.products',
      model: 'Product'
    })

    res.json(updatedBusiness)
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