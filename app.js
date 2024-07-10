const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./database');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    db.readItems((err, items) => {
        if (err) {
            res.send("Error encountered while displaying.");
            return console.error(err.message);
        }
        res.render('index', { items: items });
    });
});

app.post('/add', (req, res) => {
    const { name, description } = req.body;
    db.createItem(name, description, (err) => {
        if (err) {
            return console.error(err.message);
        }
        res.redirect('/');
    });
});

app.post('/update', (req, res) => {
    const { id, name, description } = req.body;
    db.updateItem(id, name, description, (err) => {
        if (err) {
            return console.error(err.message);
        }
        res.redirect('/');
    });
});

app.post('/delete', (req, res) => {
    const { id } = req.body;
    db.deleteItem(id, (err) => {
        if (err) {
            return console.error(err.message);
        }
        res.redirect('/');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});