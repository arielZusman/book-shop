'use strict';

function onInit() {
  bookService.createBooks();
  render();
  renderPagination();
}

function render() {
  var books = bookService.getBooksForDisplay();

  var bookStr = books
    .map(function(book) {
      var { id, name, price } = book;
      return `
      <tr class="book book-${id}">
        <td>${id}</td>
        <td class="book-name">${name}</td>
        <td class="book-price">${price}</td>
        <td>
          <button type="button" class="btn btn-primary js-read"
            onclick="onBookDetails('${id}')"
          >
            Read
          </button>
        </td>
        <td>
          <button type="button" class="btn btn-warning js-update"
            onclick="readAndUpdateBook(this, '${id}')"
            data-update="show-form">
              Update
            </button>
        </td>
        <td>
          <button type="button" class="btn btn-danger js-delete" 
            onclick="onDeleteBook(event, '${id}')">
              Delete
          </button>
        </td>
      </tr>`;
    })
    .join('');

  document.querySelector('.books-table tbody').innerHTML = bookStr;
}

function renderPagination() {
  var pageCount = bookService.getPageCount();

  var strHtml = `<li class="page-item disabled page-prev"
                      onclick="onPageChange(this, event, 'prev')">
                  <a class="page-link" href="#" tabindex="-1">Previous</a>
                </li>`;

  for (var i = 0; i < pageCount; i++) {
    strHtml += `<li class="page-item page-num ${i === 0 ? 'active' : ''}"
                    data-pagenum="${i}"
                    onclick="onPageChange(this,event, '${i}')">
                      <a class="page-link" href="#" >${i + 1}</a>
                    </li>`;
  }

  strHtml += `<li class="page-item page-next" onclick="onPageChange(this,event,'next')">
                <a class="page-link" href="#">Next</a>
              </li>`;

  document.querySelector('.book-pagination').innerHTML = strHtml;
}

function onBookDetails(bookId) {
  var book = bookService.getBookById(bookId);
  var { name, price, img, rate } = book;
  var strHtml = `
     <div class="container-fluid">
      <div class="row align-items-center">
        <div class="col-8">
          <h5 class="text-center">${name}
            <small class="price">$${price}</small>
          </h5>
        </div>
        <div class="col-4">
          <div class="row">
            <div class="col">
              <span class="oi oi-thumb-down text-danger" title="thumb down" aria-hidden="true"
              onclick="onRateChange('${bookId}', 'down')"
              ></span>
            </div>
            <div class="col">
              <span class="rate">${rate}</span>
            </div>
            <div class="col">
              <span class="oi oi-thumb-up text-success" title="thumb up" aria-hidden="true"
              onclick="onRateChange('${bookId}', 'up')"
              ></span>
            </div>
          </div>
        </div>
      </div>
      <hr>
      <div class="row">
        <div class="col">
          <img class="img-fluid mx-auto d-block" src="img/${img}">
        </div>
      </div>
    </div>
  `;
  var elModal = document.querySelector('#bookDetails .modal-body');
  elModal.innerHTML = strHtml;

  $('#bookDetails').modal('show');
}

function onFormSubmit(elForm, ev) {
  ev.preventDefault();
  var name = elForm.querySelector('.book-name').value;
  var price = +elForm.querySelector('.book-price').value;

  var isHappy = bookService.addBook(name, price);
  if (isHappy) {
    render();
  }
}

function onDeleteBook(ev, bookId) {
  ev.stopPropagation();

  var isDeleted = bookService.deleteBook(bookId);
  if (isDeleted) {
    render();
  }
}

function readAndUpdateBook(elBtn, bookId) {
  toggleOtherBtns(bookId, true);
  var book = bookService.getBookById(bookId);

  var elBookRow = document.querySelector(`.book-${bookId}`);

  if (elBtn.dataset.update === 'show-form') {
    elBookRow.querySelector('.book-name').innerHTML = getInputBookName(
      book.name
    );
    elBookRow.querySelector('.book-price').innerHTML = getInputBookPrice(
      book.price
    );
    elBtn.dataset.update = 'update';
  } else if (elBtn.dataset.update === 'update') {
    var name = elBookRow.querySelector('[name="name"]').value;
    var price = +elBookRow.querySelector('[name="price"]').value;
    elBtn.dataset.update = 'show-form';

    var isHappy = bookService.updateBook(bookId, name, price);

    if (isHappy) {
      render();
    }
  }
}

function getInputBookName(value) {
  return `
    <div class="form-group">
      <label>
        <input type="text" name="name" class="form-control" value="${value}">
      </label>
    </div>
  `;
}

function getInputBookPrice(value) {
  return `
    <div class="form-group">
      <label>
        <input type="number" name="price" step="0.01" class="form-control" value="${value}">
      </label>
    </div>
  `;
}

function onSortByProp(prop) {
  bookService.updateSortByProp(prop);
  render();
}

// disables or enables all buttons on the table except the current update
function toggleOtherBtns(bookId, disable) {
  var books = document.querySelectorAll(`.book`);

  for (var i = 0; i < books.length; i++) {
    var currBook = books[i];
    if (currBook.classList.contains(`book-${bookId}`)) {
      currBook.querySelector('.js-read').disabled = disable;
      currBook.querySelector('.js-delete  ').disabled = disable;
      continue;
    }

    var elBtns = currBook.querySelectorAll('button');
    for (var j = 0; j < elBtns.length; j++) {
      elBtns[j].disabled = disable;
    }
  }
}

function onRateChange(bookId, direction) {
  var newRate = bookService.updateRate(bookId, direction);
  document.querySelector('#bookDetails .rate').innerText = newRate;
}

function onPageChange(elPageNum, ev, pageNum) {
  ev.preventDefault();

  var currPage = bookService.changePage(pageNum);
  var pageCount = bookService.getPageCount();
  var elNext = document.querySelector('.page-next');
  var elPrev = document.querySelector('.page-prev');

  if (currPage > 0) {
    elPrev.classList.remove('disabled');
  } else {
    elPrev.querySelector('.page-prev').classList.add('disabled');
  }

  if (currPage < pageCount - 1) {
    elNext.classList.remove('disabled');
  } else {
    elNext.classList.add('disabled');
  }
  var elPagination = document.querySelectorAll('.book-pagination .page-num');

  elPagination.forEach(function(el) {
    if (+el.dataset.pagenum === currPage) el.classList.add('active');
    else el.classList.remove('active');
  });

  render();
}
