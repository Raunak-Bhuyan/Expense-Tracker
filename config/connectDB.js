const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`Database successfully connected. Server running on ${mongoose.connection.host}`.bgGreen.white);
    }catch(error){
        console.log(`${error}`.bgRed)
    }
}

module.exports = connectDB