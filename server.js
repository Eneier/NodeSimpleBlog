const express = require('express');
const path = require('path'); //helper for paths
const morgan = require('morgan'); //logger
const mongoose = require('mongoose'); // helper for mongo DB
const methodOverride = require('method-override');
const Post = require('./models/post'); //scheme
const Contacts = require('./models/contacts'); //scheme
const Petuhs = require('./models/contact'); //scheme

const app = express();

app.set('view engine', 'ejs');

const PORT = 3000;
const db = 'mongodb+srv://Eneier:1902831983vtIpo@eneier01.582kn.mongodb.net/eneier-node?retryWrites=true&w=majority';

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true }) //connection to mongo DV via mongoose
  .then((res) => console.log('Connected to DB'))
  .catch((error) => console.log(error));

// ALL methods
// Post.find()
// Post.deleteOne()
// Post.findById()
// Post.get()
// Post.findByIdAndDelete()
// Post.findByIdAndUpdate()

const createPath = (page) => path.resolve(__dirname, 'ejs-views', `${page}.ejs`);

app.listen(PORT, (error) => {
  error ? console.log(error) : console.log(`listening port ${PORT}`);
});

app.use(express.urlencoded({ extended: false })); //parsing incoming request - for PUT and POST only

app.use(morgan(':method :url :status :res[content-length] - :response-time ms')); //Logger - server console

app.use(express.static('styles')); //to make folder public

app.use(methodOverride('_method')); //trigger for PUT method/flag

//MAIN PAGE=================
app.get('/', (req, res) => {
  const title = 'Home';
  res.render(createPath('index'), { title });
});

//GET CONTACTS==============
app.get('/contact', (req, res) => {
  const title = 'Contact';
    Petuhs
    .find()
    .then((contact) => res.render(createPath('contact'), { contact, title }))
    .catch((error) => {
      console.log(error);
      res.render(createPath('error'), { title: 'Error' });
    });
});

app.get('/contacts', (req, res) => {
    const title = 'Contacts';
    Contacts
        .find()
        .then((contacts) => res.render(createPath('contacts'), { contacts, title }))
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), { title: 'Error' });
        });
});

//GET LIST POSTS================
app.get('/posts/:id', (req, res) => {
  const title = 'Post';
  Post
    .findById(req.params.id)
    .then(post => res.render(createPath('post'), { post, title }))
    .catch((error) => {
      console.log(error);
      res.render(createPath('error'), { title: 'Error' });
    });
});

//DELETE POST===================
app.delete('/posts/:id', (req, res) => {
  Post
    .findByIdAndDelete(req.params.id)
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(error);
      res.render(createPath('error'), { title: 'Error' });
    });
});

//FIND AND EDIT POST=================
app.get('/edit/:id', (req, res) => {
  const title = 'Edit Post';
  Post
    .findById(req.params.id)
    .then(post => res.render(createPath('edit-post'), { post, title }))
    .catch((error) => {
      console.log(error);
      res.render(createPath('error'), { title: 'Error' });
    });
});

//EDIT AND UPDATE POST==================
app.put('/edit/:id', (req, res) => {
  const { title, author, text } = req.body;
  const { id } = req.params;
  Post
    .findByIdAndUpdate(id, { title, author, text })
    .then((result) => res.redirect(`/posts/${id}`))
    .catch((error) => {
      console.log(error);
      res.render(createPath('error'), { title: 'Error' });
    });
});

//GET ALL POSTS=================
app.get('/posts', (req, res) => {
  const title = 'Posts';
  Post
    .find()
    .sort({ createdAt: -1 }) // sorting by  -Date
    .then(posts => res.render(createPath('posts'), { posts, title }))
    .catch((error) => {
      console.log(error);
      res.render(createPath('error'), { title: 'Error' });
    });
});

//GET NEW POST PAGE===================
app.get('/add-post', (req, res) => {
  const title = 'Add Post';
  res.render(createPath('add-post'), { title });
});

//POST AND SAVE NEW POST=============
app.post('/add-post', (req, res) => {
  const { title, author, text } = req.body;
  const post = new Post({ title, author, text }); //connection scheme from mongoose
  post
    .save() // method save - saving all DATA in BD
    .then((result) => res.redirect('/posts'))
    .catch((error) => {
      console.log(error);
      res.render(createPath('error'), { title: 'Error' });
    });
});


app.use((req, res) => {
  const title = 'Error Page';
  res
    .status(404)
    .render(createPath('error'), { title });
});
