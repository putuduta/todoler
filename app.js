//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
//call the date module
const date = require(__dirname + '/date.js');

const app = express();
const port = 3000;

//array for the item
let items = ['Buy Food', 'Cook Food', 'Eat Food'];
let workItems = [];

//set the ejs
app.set('view engine', 'ejs');

//use the body parser for get user input
app.use(bodyParser.urlencoded({
    extended: true
}));

//so we can use the css and all in the public folder
app.use(express.static('public'));


app.get('/', (req, res) => {

    //call function on the date module
    let day = date.getDate();
    //passing to ejs
    res.render('index', {
        listTitle: day,
        items: items
    });

});

//post function
app.post('/', (req, res) => {

    //grab the value when user type
    let item = req.body.newItem;

    if (req.body.list === 'Work') {
        workItems.push(item);
        res.redirect('/work');
    } else {
        //push it to array
        items.push(item);
        res.redirect('/');
    }

});

app.get('/work', (req, res) => {

    res.render('index', {
        listTitle: 'Work List',
        items: workItems
    });

});


app.listen(port, () => console.log('Server started on port 3000'));