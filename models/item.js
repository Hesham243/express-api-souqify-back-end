const mongoose = require('mongoose')


const reviewSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { 
    type: String, 
    required: true 
  },
  rating: { 
    type: Number, 
    enum: [1, 2, 3, 4, 5], 
    required: true, 
  },
}, { timestamps: true })


const itemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
  },
  description: { 
    type: String, 
  },
  price: { 
    type: Number, 
    required: true, 
  },
  image: { 
    type: String 
  },
  category: { 
    type: String, 
    enum: ['smartphones', 'laptops', 'clothing', 'furniture', 'kitchen', 'stationery', 'fitness'], 
    required: true, 
  },

  review: [reviewSchema],

}, { timestamps: true })



const Item = mongoose.model('Item', itemSchema)
module.exports = Item