var db = require('../config/connection')
var collections = require('../config/collections')
const { response } = require('express')
var ObjectId = require('mongodb').ObjectId
const { resolve, reject } = require('promise')

module.exports = {

    addProduct : (product,callback)=>{
     
        db.get().collection('product').insertOne(product).then((data)=>{
            callback(data.insertedId)
       })
      
    },
    getAllProducts : ()=>{
        return new Promise(async(resolve,reject)=>{
            let product =await db.get().collection(collections.PRODUCT_COLLECTION).find().toArray()
            resolve(product)
        })
    },
    deleteProduct:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.PRODUCT_COLLECTION).deleteOne({_id:ObjectId(proId)}).then((response)=>{
                resolve(response)
                console.log(response)
            })
        })
    },
    getProductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            let product = db.get().collection(collections.PRODUCT_COLLECTION).findOne({_id:ObjectId(proId)})
            resolve(product)
        })
    },
    updateProducts:async (proId,proDetails)=>{
        return new Promise( (resolve, response) => {
             db.get().collection(collections.PRODUCT_COLLECTION).updateOne({ _id: ObjectId(proId) }, {
                $set: {
                    Name: proDetails.Name,
                    Description: proDetails.Description,
                    Category: proDetails.Category,
                    Price: proDetails.Price
                }
            }).then((response)=>{
                resolve()
            })
        })
    }

    
}