// nhúng mongoose vào
const mongoose = require('mongoose');

module.exports.connect = async (URL) => {
  try{
    // chọt vào database path
    await mongoose.connect(URL);
    console.log(URL)
    console.log("connect database accept")
    
  }catch(error){
    console.log(error)
  }
}