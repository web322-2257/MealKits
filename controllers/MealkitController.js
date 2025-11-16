const express = require("express");
const router = express.Router();

const mealkitData = require('../modules/mealkit-util.js');
router.get('/', (req, res) => {
     const allMealKits = mealkitData.getAllMealKits();
     const mealKitsByCategory = mealkitData.getMealKitsByCategory(allMealKits);
     res.render('on-the-menu', {
          title: 'On The Menu',
          mealKitsByCategory: mealKitsByCategory
     });

});

router.get('/list', (req, res) => {
     // check session
     if (!req.session.user) {
          return res.status(401).render('error', {
               title: 'Unauthorized',
               statusCode: 401,
               errorMessage: 'You are not authorized to view this page'
          });
     }

     // check role
     if (req.session.user.role !== 'clerk') {
          return res.status(401).render('error', {
               title: 'Unauthorized',
               statusCode: 401,
               errorMessage: 'You are not authorized to view this page'
          });
     }

     res.render('mealkitlist', {
          title: 'Meal Kit List'
     });
});
module.exports = router;

