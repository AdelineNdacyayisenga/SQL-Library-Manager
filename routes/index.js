var express = require('express');
var router = express.Router();
const Book = require('../models').Book; //access the book model

/* GET home page. */
router.get('/', async function(req, res, next) {
  //const books = await Book.findAll()
  //res.json(books);
  res.redirect("/books");
});

module.exports = router;
