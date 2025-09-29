/*
Bilal Umar
185499233
WEB322 NEE
*/

const path = require("path");
const express = require('express');
const ejs = require('ejs');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mealkitData = require('./modules/mealkit-util');


app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" folder
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
    const categorizedMealKits = mealkitData.getMealKitsByCategory(allMealKits);
    res.render('on-the-menu', {
        title: 'On The Menu',
        mealKitsByCategory: categorizedMealKits
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


// This use() will add an error handler function to
// catch all errors.


// Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8080;

// Call this function after the http server starts listening for requests.
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

// Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
app.listen(HTTP_PORT, onHttpStart);