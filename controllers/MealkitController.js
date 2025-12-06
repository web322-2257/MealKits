const express = require("express");
const router = express.Router();
const mealkitModule = require("../models/mealkitModel.js");
const upload = require("../server.js");
const path = require('path');
const fs = require("fs").promises;


router.get('/', async (req, res) => {
     const allMealKits = await mealkitModule.mealkitModel.find();

     const mealKitsByCategory = [];
     const categoryMap = {};

     allMealKits.forEach(mealkit => {
          if (!categoryMap[mealkit.category]) {
               // Create new category object if not existing
               const categoryObj = {
                    categoryName: mealkit.category,
                    mealKits: []
               };
               categoryMap[mealkit.category] = categoryObj;
               mealKitsByCategory.push(categoryObj);
          }
          // Add mealkit to its category
          categoryMap[mealkit.category].mealKits.push(mealkit);
     });

     res.render('on-the-menu', {
          title: 'On The Menu',
          mealKitsByCategory: mealKitsByCategory
     });

});


router.get('/list', async (req, res) => {

     // check role and session
     if (!req.session.user || req.session.user.role !== 'clerk') {
          return res.status(401).render('error', {
               title: 'Unauthorized',
               statusCode: 401,
               errorMessage: 'You are not authorized to view this page'
          });
     }

     const mealKits = await mealkitModule.mealkitModel.find().sort({ title: 1 });

     res.render('mealkitlist', {
          title: 'Meal Kits List',
          mealKits: mealKits
     });
});

router.post('/add', async (req, res) => {
     // Check authorization
     if (!req.session.user || req.session.user.role !== 'clerk') {
          return res.status(401).render('error', {
               title: 'Unauthorized',
               statusCode: 401,
               errorMessage: 'You are not authorized to view this page'
          });
     }

     const errors = {};

     // Validate all fields
     if (!req.body.title || req.body.title.trim() === '') {
          errors.title = 'Title is required';
     }
     if (!req.body.includes || req.body.includes.trim() === '') {
          errors.includes = 'Includes is required';
     }
     if (!req.body.description || req.body.description.trim() === '') {
          errors.description = 'Description is required';
     }
     if (!req.body.category || req.body.category.trim() === '') {
          errors.category = 'Category is required';
     }
     if (!req.body.price || parseFloat(req.body.price) <= 0) {
          errors.price = 'Price must be greater than 0';
     }
     if (!req.body.cookingTime || parseInt(req.body.cookingTime) <= 0) {
          errors.cookingTime = 'Cooking time must be greater than 0';
     }
     if (!req.body.servings || parseInt(req.body.servings) <= 0) {
          errors.servings = 'Servings must be greater than 0';
     }
     if (!req.files || !req.files.image) {
          errors.image = 'Image is required';
     } else {
          const imageFile = req.files.image;
          const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
          const fileExtension = path.extname(imageFile.name).toLowerCase();

          if (!allowedExtensions.includes(fileExtension)) {
               errors.image = 'Only JPG, JPEG, PNG, and GIF images are allowed';
          }
     }
     // If there are errors, re-render form with errors
     if (Object.keys(errors).length > 0) {
          return res.render('add-mealkit', {
               title: 'Add Meal Kit',
               errors: errors,
               formData: req.body
          });
     }

     try {
          const imageFile = req.files.image;

          const uniqueFilename = Date.now() + '-' + imageFile.name;
          const uploadPath = path.join(__dirname, '../public/uploads', uniqueFilename);

          await imageFile.mv(uploadPath);

          const newMealkit = new mealkitModule.mealkitModel({
               title: req.body.title,
               includes: req.body.includes,
               description: req.body.description,
               category: req.body.category,
               price: parseFloat(req.body.price),
               cookingTime: parseInt(req.body.cookingTime),
               servings: parseInt(req.body.servings),
               imageUrl: '/uploads/' + uniqueFilename,
               featuredMealKit: req.body.featuredMealKit === 'on'
          });

          await newMealkit.save();

          res.redirect('/mealkits/list');

     } catch (error) {
          console.error('Add mealkit error:', error);
          errors.general = 'An error occurred while adding the meal kit';
          return res.render('add-mealkit', {
               title: 'Add Meal Kit',
               errors: errors,
               formData: req.body
          });
     }
});

router.post('/edit/:id', async (req, res) => {
     // Check authorization
     if (!req.session.user || req.session.user.role !== 'clerk') {
          return res.status(401).render('error', {
               title: 'Unauthorized',
               statusCode: 401,
               errorMessage: 'You are not authorized to view this page'
          });
     }

     const errors = {};

     // Validate all fields
     if (!req.body.title || req.body.title.trim() === '') {
          errors.title = 'Title is required';
     }
     if (!req.body.includes || req.body.includes.trim() === '') {
          errors.includes = 'Includes is required';
     }
     if (!req.body.description || req.body.description.trim() === '') {
          errors.description = 'Description is required';
     }
     if (!req.body.category || req.body.category.trim() === '') {
          errors.category = 'Category is required';
     }
     if (!req.body.price || parseFloat(req.body.price) <= 0) {
          errors.price = 'Price must be greater than 0';
     }
     if (!req.body.cookingTime || parseInt(req.body.cookingTime) <= 0) {
          errors.cookingTime = 'Cooking time must be greater than 0';
     }
     if (!req.body.servings || parseInt(req.body.servings) <= 0) {
          errors.servings = 'Servings must be greater than 0';
     }

     // Validate image if uploaded 
     if (req.files && req.files.image) {
          const imageFile = req.files.image;
          const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
          const fileExtension = path.extname(imageFile.name).toLowerCase();

          if (!allowedExtensions.includes(fileExtension)) {
               errors.image = 'Only JPG, JPEG, PNG, and GIF images are allowed';
          }
     }

     // If there are errors, re-render form with errors
     if (Object.keys(errors).length > 0) {
          try {
               const mealkit = await mealkitModule.mealkitModel.findById(req.params.id);
               return res.render('mealkits/edit', {
                    title: 'Edit Meal Kit',
                    mealkit: mealkit,
                    errors: errors
               });
          } catch (error) {
               console.error('Error fetching mealkit:', error);
               return res.redirect('/mealkits/list');
          }
     }

     try {
          const updates = {
               title: req.body.title,
               includes: req.body.includes,
               description: req.body.description,
               category: req.body.category,
               price: parseFloat(req.body.price),
               cookingTime: parseInt(req.body.cookingTime),
               servings: parseInt(req.body.servings),
               featuredMealKit: req.body.featuredMealKit === 'on'
          };

          if (req.files && req.files.image) {
               const imageFile = req.files.image;

               const oldMealkit = await mealkitModule.mealkitModel.findById(req.params.id);

               // Delete old image file if it exists
               if (oldMealkit.imageUrl) {
                    const filePath = path.join(__dirname, '..', 'public', oldMealkit.imageUrl.replace(/^\//, ''));
                    await fs.rm(filePath, { force: true });
               }

               const uniqueFilename = Date.now() + '-' + imageFile.name;
               const uploadPath = path.join(__dirname, '../public/uploads', uniqueFilename);
               await imageFile.mv(uploadPath);

               updates.imageUrl = '/uploads/' + uniqueFilename;
          }

          // Update meal kit in database
          await mealkitModule.mealkitModel.findByIdAndUpdate(req.params.id, updates);

          res.redirect('/mealkits/list');

     } catch (error) {
          console.error('Edit mealkit error:', error);
          errors.general = 'An error occurred while updating the meal kit';

          const mealkit = await mealkitModule.mealkitModel.findById(req.params.id); //re render same page
          return res.render('edit-mealkit', {
               title: 'Edit Meal Kit',
               mealkit: mealkit,
               errors: errors
          });

     }
});

router.post('/delete/:id', async (req, res) => {
     const id = req.params.id;

     try {
          //remove associated img
          const mealkit = await mealkitModule.mealkitModel.findById(id);
          const filePath = path.join(__dirname, '..', 'public', mealkit.imageUrl.replace(/^\//, ''));
          await fs.rm(filePath, { force: true }); //find path and remove
          await mealkitModule.mealkitModel.findByIdAndDelete(id);

          res.redirect("/mealkits");

     } catch (error) {
          return res.status(404).render('error', {
               title: 'error',
               statusCode: 404,
               errorMessage: error
          });
     }
});

router.get('/edit/:id', async (req, res) => {
     if (!req.session.user || req.session.user.role !== 'clerk') {
          return res.status(401).render('error', {
               title: 'Unauthorized',
               statusCode: 401,
               errorMessage: 'You are not authorized to view this page'
          });
     }

     try {
          //load mealkit and embed in file
          const mealkit = await mealkitModule.mealkitModel.findById(req.params.id);

          if (!mealkit) {
               return res.status(404).render('error', {
                    title: 'Not Found',
                    statusCode: 404,
                    errorMessage: 'Meal kit not found'
               });
          }

          res.render('edit-mealkit', {
               title: 'Edit Meal Kit',
               mealkit: mealkit,
               errors: {}
          });

     } catch (error) {
          console.error('Edit page error:', error);
          res.status(500).render('error', {
               title: 'Error',
               statusCode: 500,
               errorMessage: 'An error occurred loading the edit page'
          });
     }
});


router.get('/add', (req, res) => {
     if (!req.session.user || req.session.user.role !== 'clerk') {
          return res.status(401).render('error', {
               title: 'Unauthorized',
               statusCode: 401,
               errorMessage: 'You are not authorized to view this page'
          });
     }

     res.render('add-mealkit', {
          title: 'Add Meal Kit',
          errors: {}
     });
});

module.exports = router;

