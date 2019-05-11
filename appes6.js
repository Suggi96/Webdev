class Book {
  constructor(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
class UI {
  addBookToList(book) {
    const list = document.getElementById('book-list');
    //create tr element
    const row =  document.createElement('tr');
    //Insert cols
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
    `;
    list.appendChild(row);
  }
  showAlert(msg, className){
    //create div
    const div = document.createElement('div');
    //Add className
    div.className = `alert ${className}`;
    //Add a text
    div.appendChild(document.createTextNode(msg));
    //Get a parent
    const container =  document.querySelector('.container');
    const form = document.querySelector('#book-form');

    //Insert alert
    container.insertBefore(div, form);

    //Time out after 3 sec
    setTimeout(function() {
      document.querySelector(".alert").remove();
    },3000);

  }
  deleteBook(target) {
    if(target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  }
  clearFields() {
    document.getElementById('title').value = "";
    document.getElementById('author').value = "";
    document.getElementById('isbn').value = "";
  }
}
//Local storage class
class Store {
  static getBook() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    }
    else {
     books =  JSON.parse(localStorage.getItem('books'));

  }
  return books;
}
  static displayBooks() {
    const books = Store.getBook();
    books.forEach(function(book){
      const ui = new UI();

      //Add book to ui
      ui.addBookToList(book);
    });

  }
  static addBook(book) {
    const books = Store.getBook();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));

  }
  static removeBook(isbn) {
    const books = Store.getBook();
    books.forEach(function(book, index){
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }

}
//DOM load event
document.addEventListener("DOMContentLoaded", Store.displayBooks);
//Event Listeners
document.getElementById('book-form').addEventListener('submit', function(e){
  //Get form values
  const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;
//Instantiate a book
  const book = new Book(title, author, isbn);

//Instantaite UI object
  const ui =  new UI();
//validate 
  if(this.title==="" || author==="" || isbn==="") {
    //error alert
    ui.showAlert('Please fill in all the fields', 'error');

  }
  else {
//Add book to list
  ui.addBookToList(book);

//Add to LS
  Store.addBook(book);

//Show alert book Added
  ui.showAlert('Book Added!', 'success');

//clear form fields
  ui.clearFields();
  }

  e.preventDefault();
});

//Event listener for delete
document.getElementById('book-list').addEventListener('click', function(e){
  //Instantaite UI object
  const ui =  new UI();
  
  //call prototype method 
  ui.deleteBook(e.target);

  //Remove from LS
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent)

  //Show alert
  ui.showAlert('Book Removed!', 'success');
  e.preventDefault();
});