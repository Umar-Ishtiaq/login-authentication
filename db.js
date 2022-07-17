const Mongoose = require('mongoose')
require('dotenv').config()

const RemoteDB = process.env.DB_STRING
const connectDB = async ()=>{
    await Mongoose.connect(RemoteDB)
    .then(client =>{
        console.log('Connected to Database')
    })
}

module.exports = connectDB