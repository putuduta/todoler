//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();
const port = 3000;

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

//default item
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

const listSchema = {
    name: String,
    items: [itemsScheema]
};

const List = mongoose.model('List', listSchema);

app.get('/', (req, res) => {

    Item.find({}, (err, foundItems) => {

        //if there is no item
        if (foundItems.length === 0) {

            //insert item
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

app.get('/:customListName', (req, res) => {
    //case insensitive
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({
        name: customListName
    }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                //Create new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });

                list.save();

                res.redirect('/' + customListName);
            } else {
                //show an existing list
                res.render('index', {
                    listTitle: foundList.name,
                    items: foundList.items
                });

            }
        }
    });

});

//post function
app.post('/', (req, res) => {

    //grab the value when user type
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    //if the list in today
    if (listName === 'Today') {

        item.save();

        res.redirect('/');
    } else {
        List.findOne({
            name: listName
        }, (err, foundList) => {
            //push it in into foundList
            foundList.items.push(item);
            foundList.save();
            //redirect to the custom list
            res.redirect('/' + listName);
        });
    }
});

//delete
app.post('/delete', (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    //if the list  in today
    if (listName === 'Today') {
        Item.findByIdAndRemove(checkedItemId, (err) => {
            if (!err) {
                console.log('Succesfully deleted checked item.');
                res.redirect('/');
            }
        });
    } else {
        List.findOneAndUpdate({
            name: listName
        }, {
            $pull: {
                items: {
                    _id: checkedItemId
                }
            }
        }, (err, foundList) => {
            if (!err) {
                res.redirect('/' + listName);
            }
        });
    }


});

app.get('/work', (req, res) => {

    res.render('index', {
        listTitle: 'Work List',
        items: workItems
    });

});


app.listen(port, () => console.log('Server started on port 3000'));