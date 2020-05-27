//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

//array for the item
let items = ['Buy Food', 'Cook Food', 'Eat Food'];

//set the ejs
app.set('view engine', 'ejs');

//use the body parser for get user input
app.use(bodyParser.urlencoded({
    extended: true
}));

//so we can use the css and all in the public folder
app.use(express.static('public'));


app.get('/', (req, res) => {

    //day function
    let today = new Date();

    let option = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };

    let day = today.toLocaleDateString('en-UK', option);

    //passing to ejs
    res.render('index', {
        day: day,
        items: items
    });

});

//post function
app.post('/', (req, res) => {
    //grab the value when user type
    let item = req.body.newItem;
    //push it to array
    items.push(item);
    //scope
    res.redirect('/');
});

app.listen(port, () => console.log('Server started on port 3000'));