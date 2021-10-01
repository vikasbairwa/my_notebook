const mongoose = require('mongoose');
const mongoURI = config.env.DATABASE;

const connectMongo= ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("connected to mongo successfully");
    })
}
module.exports = connectMongo