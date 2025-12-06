const express = require("express");
const router = express.Router();
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const bcrypt = require('bcryptjs');
const userModule = require("../models/usermodule.js");
const mealkitModule = require("../models/mealkitModel.js");

// index.js
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
     key: process.env.MAILGUN_KEY,
     username: "api",

});


router.get('/', async (req, res) => {
     const featuredMealKits = await mealkitModule.mealkitModel.find({
          featuredMealKit: true
     });
     res.render('home', {
          title: 'Home',
          featuredMealKits: featuredMealKits
     });
});

router.post('/log-in', async (req, res) => {
     const { email, password } = req.body;
     const userRole = req.body['user-role'];
     const errors = {};

     if (!userRole || (userRole !== 'customer' && userRole !== 'clerk')) {
          errors.userRole = 'Please select a user type';
     }

     if (!email || email === null) {
          errors.email = 'Please enter an email';
     }

     if (!password || password === null) {
          errors.password = 'Please enter a password';
     }

     //re render with data to add errors
     if (Object.keys(errors).length > 0) {
          return res.render('log-in', {
               title: 'Login',
               errors,
               email,
               password,
               userRole: userRole || 'customer'
          });
     }

     try {
          const user = await userModule.userModel.findOne({ email: email });
          const valid = await bcrypt.compare(password, user.password);

          if (!user || !valid) {
               errors.general = 'Sorry, you entered an invalid email or password';
               return res.render('log-in', {
                    title: 'Login',
                    errors,
                    email,
                    password,
                    userRole: userRole || 'customer'
               });
          }

          //create new session
          req.session.user = {
               firstName: user.firstName,
               email: user.email,
               role: userRole
          };

          res.locals.user = req.session.user;

          //user is valid, log in
          if (userRole === 'customer')
               res.redirect('cart');
          else
               res.redirect("mealkits/list");
     } catch (error) {
          errors.general = 'Error occured' + error;
     }
});

router.post('/sign-up', async (req, res) => {
     const { firstName, lastName, email, password } = req.body;
     const errors = {};

     if (!firstName || firstName.trim() === '') {
          errors.firstName = 'Please enter your first name';
     }

     if (!lastName || lastName.trim() === '') {
          errors.lastName = 'Please enter your last name';
     }

     if (!email || email.trim() === '') {
          errors.email = 'Please enter an email';
     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          errors.email = 'Please enter a valid email address';
     }

     if (!password || password.trim() === '') {
          errors.password = 'Please enter a password';
     } else if (password.length < 8 || password.length > 12) {
          errors.password = 'Password must be 8-12 characters and contain at least one lowercase letter, uppercase letter, number, and symbol';
     } else if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
          errors.password = 'Password must be 8-12 characters and contain at least one lowercase letter, uppercase letter, number, and symbol';
     }


     //re render with data to add errors, use object.keys because errors is object with fields
     if (Object.keys(errors).length > 0) {
          return res.render('sign-up', {
               title: 'Sign Up',
               errors,
               firstName,
               lastName,
               email,
               password
          });
     }


     //save to db, hash password and check email unique
     try {
          const existingUser = await userModule.userModel.findOne({ email: email });

          if (existingUser) {
               errors.email = "Email already exists";
               return res.render('sign-up', {
                    title: 'Sign Up',
                    errors,
                    firstName,
                    lastName,
                    email,
                    password
               });
          }

          const hashed = await bcrypt.hash(password, 10);
          const user = new userModule.userModel({
               email: email,
               firstName: firstName,
               lastName: lastName,
               password: hashed
          });
          await user.save();


          console.log('Sending email to:', email);
          console.log('Domain:', process.env.MAILGUN_DMN);

          // Send welcome email
          await mg.messages.create(process.env.MAILGUN_DMN, {
               from: `Meal Planner <postmaster@${process.env.MAILGUN_DMN}>`,
               to: [email],
               subject: 'Welcome to Our Website!',
               text: `Hi ${firstName} ${lastName},\n\nWelcome to our website! By Bilal Umar.\n\nBest regards from Meal Planner.`


          });

          //fix this!
          req.session.user = {
               firstName: user.firstName,
               email: user.email
          };


          res.redirect("welcome");

     } catch (error) {
          console.error('Registration error:', error);
          errors.general = 'An error occurred during registration';
          return res.render('sign-up', {
               title: 'Sign Up',
               errors,
               firstName,
               lastName,
               email,
               password
          });
     }
});


router.post('/cart/add/:id', async (req, res) => {
     let message = '';
     let errors = {};


     // Check if user is a customer
     if (!req.session.user || req.session.user.role !== 'customer') {
          return res.status(401).render('error', {
               title: 'Unauthorized',
               statusCode: 401,
               errorMessage: 'Only customers can add items to cart'
          });
     }

     try {
          const mealkitId = req.params.id;

          let cart = req.session.cart = req.session.cart || [];

          const mealkit = await mealkitModule.mealkitModel.findById(mealkitId);

          let found = false;
          cart.forEach(cartItem => {
               if (cartItem.id === mealkitId) {
                    // Meal kit already in cart, increment quantity
                    found = true;
                    cartItem.qty++;
               }
          });

          if (!found) {
               // Meal kit not in cart, add it
               cart.push({
                    id: mealkitId,
                    qty: 1,
                    mealkit: mealkit
               });


               message = `"${mealkit.title}" was added to your cart`;
          } else {
               message = `"${mealkit.title}" quantity increased in your cart`;
          }

          res.redirect('/cart?message=' + encodeURIComponent(message));

     } catch (error) {
          console.error('Add to cart error:', error);
          errors.general = 'An error occurred while adding to cart';
          res.render('cart', {
               title: 'Shopping Cart',
               cart: req.session.cart || [],
               errors: errors
          });
     }
});

router.post('/cart/remove/:id', async (req, res) => {
     let message = '';
     let errors = {};


     // Check if user is a customer
     if (!req.session.user || req.session.user.role !== 'customer') {
          return res.status(401).render('error', {
               title: 'Unauthorized',
               statusCode: 401,
               errorMessage: 'Only customers can add items to cart'
          });
     }

     try {
          const mealkitId = req.params.id;

          let cart = req.session.cart = req.session.cart || [];

          const mealkit = await mealkitModule.mealkitModel.findById(mealkitId);

          const index = cart.findIndex(item => item.id === mealkitId);

          if (index !== -1) {
               cart.splice(index, 1);
          }

          message = `"${mealkit.title}" was removed`;


          res.redirect('/cart?message=' + encodeURIComponent(message));
     }

     catch (error) {
          console.error('Add to cart error:', error);
          errors.general = 'An error occurred while adding to cart';
          res.render('cart', {
               title: 'Shopping Cart',
               cart: req.session.cart || [],
               errors: errors
          });
     }
});

router.post('/cart/checkout', async (req, res) => {

     let cart = req.session.cart || [];

     let emailText = `Hi ${req.session.user.firstName},\nHere is your shopping cart:\n\n`;

     let total = 0;

     for (let item of cart) {
          let lineCost = item.mealkit.price * item.qty;
          total += lineCost;

          emailText += `${item.mealkit.title} (x${item.qty}) - $${lineCost}\n`;
     }

     await mg.messages.create(process.env.MAILGUN_DMN, {
          from: `Meal Planner <postmaster@${process.env.MAILGUN_DMN}>`,
          to: [req.session.user.email],
          subject: 'Welcome to Our Website!',
          text: emailText, total
     });

     req.session.cart = [];

     res.redirect('/cart');


});

router.get('/cart', (req, res) => {

     // Check if user is a customer
     if (!req.session.user || req.session.user.role !== 'customer') {
          return res.status(401).render('error', {
               title: 'Unauthorized',
               statusCode: 401,
               errorMessage: 'Only customers can view cart'
          });
     }

     const cart = req.session.cart || [];
     const message = req.query.message || '';

     // Calculate totals
     let subtotal = 0;
     cart.forEach(item => {
          subtotal += item.mealkit.price * item.qty;
     });

     const tax = subtotal * 0.10;
     const grandTotal = subtotal + tax;

     res.render('cart', {
          title: 'Shopping Cart',
          cart: cart,
          subtotal: subtotal,
          tax: tax,
          grandTotal: grandTotal,
          message: message,
          errors: {}
     });
});


router.get('/welcome', (req, res) => {
     res.render('welcome', { title: 'Welcome' });
});

router.get('/sign-up', (req, res) => {
     res.render('sign-up', {
          title: 'Sign Up', firstName: '', errors: {}, lastName: '', email: '', password: ''
     });
});

router.get('/logout', (req, res) => {
     //destroy session
     req.session.destroy();
     // go back to log in
     res.render('log-in', {
          title: 'Log In', errors: {}, email: '', password: '', userRole: 'customer'
     });
});



router.get('/log-in', (req, res) => {
     res.render('log-in', {
          title: 'Log In', errors: {}, email: '', password: '', userRole: 'customer'
     });
});



router.get('/cart', (req, res) => {
     // check session
     if (!req.session.user) {
          return res.status(401).render('error', {
               title: 'Unauthorized',
               statusCode: 401,
               errorMessage: 'You are not authorized to view this page'
          });
     }

     // check if valid customer
     if (req.session.user.role !== 'customer') {
          return res.status(401).render('error', {
               title: 'Unauthorized',
               statusCode: 401,
               errorMessage: 'You are not authorized to view this page'
          });
     }

     res.render('cart', {
          title: 'Shopping Cart'
     });
});

module.exports = router;