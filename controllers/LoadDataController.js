const express = require("express");
const router = express.Router();
const mealkitModule = require("../models/mealkitModel.js");

//sample data
const mealKits = [
     {
          title: "Sautéed Ground Pork over Jasmine Rice",
          includes: "Toasted Peanuts & Quick-Pickled Cucumber Salad",
          description: "Gingery pork, crunchy cucumbers, and toasty peanuts.",
          category: "Classic Meals",
          price: 19.99,
          cookingTime: 25,
          servings: 2,
          imageUrl: "/imgs/groundpork.jpg",
          featuredMealKit: true
     },
     {
          title: "Lemon Herb Chicken with Roasted Potatoes",
          includes: "Green Beans & Garlic Aioli",
          description: "Juicy chicken with zesty lemon and crispy potatoes.",
          category: "Classic Meals",
          price: 21.99,
          cookingTime: 35,
          servings: 2,
          imageUrl: "/imgs/lemonchicken.jpg",
          featuredMealKit: false
     },
     {
          title: "Spaghetti Bolognese",
          includes: "Parmesan Cheese & Garlic Bread",
          description: "Rich tomato and beef sauce over spaghetti pasta.",
          category: "Classic Meals",
          price: 18.99,
          cookingTime: 30,
          servings: 2,
          imageUrl: "/imgs/placeholder.jpg",
          featuredMealKit: true
     },
     {
          title: "Beef Stir-Fry with Vegetables",
          includes: "Soy Garlic Sauce & Rice Noodles",
          description: "Tender beef strips tossed with crunchy veggies.",
          category: "Classic Meals",
          price: 20.49,
          cookingTime: 28,
          servings: 2,
          imageUrl: "/imgs/beefstir.jpg",
          featuredMealKit: false
     },
     {
          title: "Vegan Buddha Bowl",
          includes: "Chickpeas, Quinoa & Tahini Dressing",
          description: "Protein-packed vegan bowl with fresh veggies.",
          category: "Vegan Meals",
          price: 17.99,
          cookingTime: 22,
          servings: 2,
          imageUrl: "/imgs/veganbowl.jpg",
          featuredMealKit: true
     },
     {
          title: "Tofu Stir-Fry with Broccoli",
          includes: "Sesame Sauce & Rice",
          description: "Crispy tofu with stir-fried broccoli and sesame sauce.",
          category: "Vegan Meals",
          price: 16.49,
          cookingTime: 26,
          servings: 2,
          imageUrl: "/imgs/tofu.png",
          featuredMealKit: false
     },
     {
          title: "Edamame with Rice",
          includes: "Edamame & Rice",
          description: "Crispy fried edamame with freshly seasoned rice.",
          category: "Vegan Meals",
          price: 12.49,
          cookingTime: 16,
          servings: 1,
          imageUrl: "/imgs/edamame.png",
          featuredMealKit: false
     }
];

router.get('/mealkits', async (req, res) => {

     if (!req.session.user || req.session.user.role !== 'clerk') {
          return res.status(403).render('error', {
               title: 'Forbidden',
               statusCode: 403,
               errorMessage: 'You are not authorized to add meal kits'
          });
     }

     try {
          // Check if data already exists
          const count = await mealkitModule.mealkitModel.countDocuments();

          if (count > 0) {
               // Data already loaded
               return res.render('load-data-result', {
                    title: 'Data Already Loaded',
                    success: false,
                    message: 'Meal kits have already been added to the database'
               });
          }

          // Load the data
          await mealkitModule.mealkitModel.insertMany(mealKits);

          // Show success
          res.render('load-data-result', {
               title: 'Success',
               success: true,
               message: 'Added meal kits to the database'
          });

     } catch (error) {
          console.error('Load data error:', error);
          res.status(500).render('error', {
               title: 'Error',
               statusCode: 500,
               errorMessage: 'An error occurred while loading data'
          });
     }
});

router.get('/load-data-result', (req, res) => {
     res.render('load-data-result', { title: '', success: false, message: '' });
});

module.exports = router;

