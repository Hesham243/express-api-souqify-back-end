const mongoose = require('mongoose')


const storeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  logo: { 
    type: String 
  },
  category: { 
    type: String, 
    enum: ['electronics', 'toys', 'books', 'sports', 'fashion', 'health_beauty'], 
    required: true 
  },

  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

}, { timestamps: true })



const Store = mongoose.model('Store', storeSchema)
module.exports = Store