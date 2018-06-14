'use strict';
var bookService = (function() {
  var BOOKS_KEY = 'appBookShop';

  var gSampleBooks = [
    { name: "You Don't Know JS: Up & Going", price: 18.9, img: 'ydnjs.jpg' },
    {
      name: 'Eloquent JavaScript',
      price: 20,
      img: 'eloquent_javascript.jpg',
      rate: 5
    },
    {
      name: 'JavaScript Allongé, the "Six" Edition',
      price: 8.5,
      img: 'allonge.jpeg',
      rate: 5
    },
    {
      name: 'Bootstrap - Responsive Web Development',
      price: 8.5,
      img: 'bootstrap.png',
      rate: 5
    },
    {
      name:
        "Professor Frisby's Mostly Adequate Guide to Functional Programming ",
      price: 8.5,
      img: 'mostly.png',
      rate: 5
    }
  ];
  var gSortByProp = {
    prop: 'title',
    dir: 'asc'
  };
  var gBooks;

  // private methods
  function createBook(name, price, img, rate) {
    return {
      id: makeId(),
      name: name,
      price: price,
      img: img,
      rate: rate
    };
  }

  function getBookIdxById(id) {
    return gBooks.findIndex(function(book) {
      return book.id === id;
    });
  }
  function saveBooks() {
    saveToStorage(BOOKS_KEY, gBooks);
  }

  function sortByProp(prop) {
    var dir = gSortByProp.dir === 'asc';
    return function(item1, item2) {
      var res = 0;
      if (item1[prop] > item2[prop]) res = 1;
      if (item1[prop] < item2[prop]) res = -1;
      return dir ? res : -res;
    };
  }

  function sortByName(books) {
    // var dir = gSortByProp.dir === 'asc';
    debugger;
    return books.sort(sortByProp('name'));
  }

  function sortByPrice(books) {
    var dir = gSortByProp.dir === 'asc';

    return books.sort(function(item1, item2) {
      var res = 0;
      if (item1.price > item2.price) res = 1;
      if (item1.price < item2.price) res = -1;
      return dir ? res : -res;
    });
  }

  // public methods
  function createBooks() {
    var books = loadFromStorage(BOOKS_KEY);
    if (!books || books.length === 0) {
      books = gSampleBooks.map(function(book) {
        return createBook(book.name, book.price, book.img, book.rate);
      });
    }

    gBooks = books;
    saveBooks();
  }

  function getBooksForDisplay() {
    // keep gBook private
    var books = JSON.parse(JSON.stringify(gBooks));

    switch (gSortByProp.prop) {
      case 'name':
        books = sortByName(books);
        break;
      case 'price':
        books = sortByPrice(books);
        break;
    }
    return books;
  }

  function deleteBook(bookId) {
    var idx = getBookIdxById(bookId);
    if (idx > -1) {
      gBooks.splice(idx, 1);
      saveBooks();
      return true;
    } else {
      return false;
    }
  }

  function addBook(name, price) {
    var book = createBook(name, price);
    if (book) {
      gBooks.unshift(book);
      saveBooks();
      return true;
    }
    return false;
  }

  function updateBook(bookId, name, price) {
    var book = getBookById(bookId);
    if (book) {
      book.name = name;
      book.price = price;

      saveBooks();
      return true;
    }
    return false;
  }

  function updateRate(bookId, direction) {
    var book = getBookById(bookId);
    if (
      (book.rate === 0 && direction === 'down') ||
      (book.rate === 10 && direction === 'up')
    ) {
      return book.rate;
    }

    book.rate += direction === 'up' ? 1 : -1;
    saveBooks();
    return book.rate;
  }

  function updateSortByProp(prop) {
    gSortByProp.prop = prop;
    gSortByProp.dir = gSortByProp.dir === 'asc' ? 'desc' : 'asc';
  }

  function getBookById(id) {
    var book = gBooks.find(function(book) {
      return book.id === id;
    });

    return book;
  }

  return {
    createBooks: createBooks,
    getBooksForDisplay: getBooksForDisplay,
    deleteBook: deleteBook,
    addBook: addBook,
    getBookById: getBookById,
    updateBook: updateBook,
    updateRate: updateRate,
    updateSortByProp: updateSortByProp
  };
})();
