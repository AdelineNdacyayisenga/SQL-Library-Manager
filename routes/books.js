var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/** Handler function to wrap routes
 * params: callback function
*/ 

function asyncHandler(cb) {
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error) {
      res.status(500).send(error);
    }
  } 
}

/* GET books listing. */
router.get('/', asyncHandler(async(req, res, next) => {
  const books = await Book.findAll();
  res.render("index", { books: books, title: "Books" });
}));

/* Create a new book form*/
router.get('/new', (req, res) => {
  res.render("new-book", { book: {}, title: "New Book" });
});

/* POST create book*/
router.post('/new', asyncHandler(async(req, res, next) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } catch(error) {
    if(error.name === 'SequelizeValidationError'){
      book = await Book.build(req.body);
      res.render("new-book", { book, errors: error.errors, title: "New Book" });
    } else {
      throw error;
    }
  }
}));

/* GET individual book */
router.get("/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("show", { book, title: book.title });
  } else {
    res.sendStatus(404);
    // const err = new Error('Book not found');
    // err.status = 404;
    // throw err;
  }

}));

/* GET individual book detail form to edit */
router.get('/:id/edit', asyncHandler(async(req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("update-book", { book, title: "Update Book" });
  } else {
    const err = new Error('Book not found');
    err.status = 404;
    throw err;
  }
}));

/* POST updates book info into the database*/
router.post('/:id/edit', asyncHandler(async (req, res) => {
  let book;
  try{
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);// Check if not 'book'
      res.redirect("/books/" + book.id);
    } else {
      const err = new Error('Book not found');
      err.status = 404;
      res.status(404).render('page-not-found', { err });
    }
  } catch(error) {
    if(error.name === 'SequelizeValidationError'){
      book = await book.build(req.body);
      book.id = req.params.id; //make sure the correct book get updated
      res.render("update-book", {book, errors: error.errors, title: "Update book"})
    } else {
      throw error;
    }
  } 
}));

/* Delete book form */
router.get('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("delete", { book, title: "Delete Book" });
  } else {
    res.sendStatus(404);
  }
}));

/* Delete individual book.*/
router.post('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;
