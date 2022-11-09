var db = require('../config/connection')
var collections = require('../config/collections')
const bcrypt = require('bcrypt')
const { resolve, reject } = require('promise')
const { response } = require('express')
var ObjectId = require('mongodb').ObjectId

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10);
            db.get().collection(collections.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data.insertedId)
            })
        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let status = false
            let response = {}
            let user = await db.get().collection(collections.USER_COLLECTION).findOne({ Email: userData.Email })

            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        console.log('Login succes')
                        response.user = user
                        response.status = true
                        resolve(response)
                    }
                    else {
                        console.log('Login failed')
                        resolve({ status: false })
                    }
                })
            } else {
                console.log('login failed')
                resolve({ status: false })
            }
        })
    },
    addToCart: (proId, userId) => {
        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collections.CART_COLLECTION).findOne({ user: ObjectId(userId) })
            if (userCart) {
                console.log(userCart)
                db.get().collection(collections.CART_COLLECTION).updateOne({user:ObjectId(userId)},{
                    $push:{products:ObjectId(proId)}
                }).then(()=>{
                    resolve()
                })
            }
            else {
                let cartObj = {
                    user: ObjectId(userId),
                    products: [ObjectId(proId)]
                }
                db.get().collection(collections.CART_COLLECTION).insertOne(cartObj).then((response) => {
                    resolve(response)
    
                })
            } 
        })
    }
}