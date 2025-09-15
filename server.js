const path = require("path");
const express = require('express');
const ejs = require('ejs');
const app = express();

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
      res.render('home', { pageTitle: 'My Express App', name: 'World' }); //change this!
});

app.get('/sign-up', (req, res) => {
    res.render('sign-up', { pageTitle: 'My Express App', name: 'World' });  //change this!
});

app.get('/log-in', (req, res) => {
    res.render('log-in', { pageTitle: 'My Express App', name: 'World' });  //change this!
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});


app.get('/headers', (req, res) => {
    res.json(req.headers);
});


// This use() will add an error handler function to
// catch all errors.
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send("Something broke!")
});

// Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8080;

// Call this function after the http server starts listening for requests.
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

// Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
app.listen(HTTP_PORT, onHttpStart);