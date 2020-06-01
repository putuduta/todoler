//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//call the date module


const app = express();
const port = 3000;

//array for the item
// let items = ['Buy Food', 'Cook Food', 'Eat Food'];
// let workItems = [];

//set the ejs
app.set('view engine', 'ejs');

//use the body parser for get user input
app.use(bodyParser.urlencoded({
    extended: true
}));

//so we can use the css and all in the public folder
app.use(express.static('public'));

// Connect to mongodb
mongoose.connect('mongodb://localhost:27017/todolistDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const itemsScheema = {
    name: String
};

const Item = mongoose.model('Item', itemsScheema);

const item1 = new Item({
    name: "Welcome to  your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];


app.get('/', (req, res) => {

    Item.find({}, (err, foundItems) => {

        if (foundItems.length === 0) {

            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err);

                } else {
                    console.log('Succesfully insert the default');

                }
            });

            res.redirect('/');
        } else {
            //passing to ejs
            res.render('index', {
                listTitle: 'Today',
                items: foundItems
            });
        }

    });

});

//post function
app.post('/', (req, res) => {

    //grab the value when user type
    const itemName = req.body.newItem;

    const item = new Item({
        name: itemName
    });

    item.save();

    res.redirect('/');
});

app.post('/delete', (req, res) => {
    const checkedItemId = req.body.checkbox;

    Item.findByIdAndRemove(checkedItemId, (err) => {
        if(!err) {
            console.log('Succesfully deleted checked item.');
            res.redirect('/');
        }
    });
});

app.get('/work', (req, res) => {

    res.render('index', {
        listTitle: 'Work List',
        items: workItems
    });

});


app.listen(port, () => console.log('Server started on port 3000'));