const mongoose = require('mongoose');

const mealkitSchema = new mongoose.Schema({
     title: {
          type: String,
          required: true
     },
     includes: {
          type: String,
          required: true
     },
     description: {
          type: String,
          required: true
     },
     category: {
          type: String,
          required: true
     },
     price: {
          type: Number,
          required: true,
          min: 0
     },
     cookingTime: {
          type: Number,
          required: true,
          min: 0
     },
     servings: {
          type: Number,
          required: true,
          min: 0
     },
     imageUrl: {
          type: String,
          required: true
     },
     featuredMealKit: {
          type: Boolean,
          default: false
     }
});

const mealkitModel = mongoose.model("mealkits", mealkitSchema);

module.exports = {
     mealkitModel,
};