/*************************************************************************************
* WEB322 - 2257 Project
* I declare that this assignment is my own work in accordance with the Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* Student Name  : Bilal Umar
* Student ID    : 185499233
* Student Email : bumar@myseneca.ca
* Course/Section: WEB322/NEE
*
**************************************************************************************/


const path = require("path");
const express = require('express');
const app = express();

const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const mealkitData = require('./modules/mealkit-util');


app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('views', path.join(__dirname, 'views'));

// use public for static imgs
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    const allMealKits = mealkitData.getAllMealKits();
    const featuredMealKits = mealkitData.getFeaturedMealKits(allMealKits);
    res.render('home', {
        title: 'Home',
        featuredMealKits: featuredMealKits
    });
});

app.get('/on-the-menu', (req, res) => {
    const allMealKits = mealkitData.getAllMealKits();
    const mealKitsByCategory = mealkitData.getMealKitsByCategory(allMealKits);
    res.render('on-the-menu', {
        title: 'On The Menu',
        mealKitsByCategory: mealKitsByCategory
    });

});

app.get('/sign-up', (req, res) => {
    res.render('sign-up', { title: 'Sign Up' });
});

app.get('/log-in', (req, res) => {
    res.render('log-in', { title: 'Log In' });
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

app.get('/headers', (req, res) => {
    res.json(req.headers);
});


// *** DO NOT MODIFY THE LINES BELOW ***

// Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8080;

// Call this function after the http server starts listening for requests.
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

// Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
app.listen(HTTP_PORT, onHttpStart);