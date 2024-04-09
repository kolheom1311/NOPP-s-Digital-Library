// import { checkLoginStatus } from "./login-signup/login-signup";
// import { uploadFiles } from "auth";

console.log('this is the digital library tutorial');
var user = {};
showbooks();

// async function isLoggedIn() {
//     // Simulate checking if there's a logged-in user stored in local storage
//     return !!localStorage.getItem('userid');
// }

function Book(bookname, author, category, description, url) {
    this.bookname = bookname;
    this.author = author;
    this.category = category;
    this.description = description;
    this.url = url; // Added URL parameter to Book constructor
}

function Display() {}

Display.prototype.check = function(book) {
    if (book.bookname.length < 2 || book.author.length < 2 || book.description.length < 2) {
        return false;
    } else {
        return true;
    }
}

Display.prototype.clear = function() {
    let libraryForm = document.getElementById('libraryform');
    libraryForm.reset();
}

Display.prototype.show = function(type, message) {
    let alert = document.getElementById('alert')
    alert.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        <strong>Message : ${message}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
    setTimeout(function() {
        alert.innerHTML = "";
    }, 2500);
}

async function showbooks() {
    let data = localStorage.getItem('data');
    let bookobj;
    if (data == null) {
        bookobj = [];
    } else {
        bookobj = JSON.parse(data);
    }
    let bookinfo = "";
    bookobj.forEach(function(element, index) {
        bookinfo += `<tr> 
            <td>${index+1}</td>
            <td>${element.bookname}</td>
            <td>${element.author}</td>
            <td>${element.category}</td>
            <td>${element.description}</td>
            <td class="text-center">
                <button class="btn btn-outline-primary btn-sm me-1" type="button" onclick="deletebook(${index})">Delete Book</button>
                <a class="btn btn-outline-primary btn-sm" href="${element.url}" download="${element.bookname}.pdf" style="margin-left: 25px">View/Download</a>
            </td>
        </tr>`;
    });

    let tablebody = document.getElementById('tablebody');
    if (bookobj.length != 0) {
        tablebody.innerHTML = bookinfo;
    } else {
        tablebody.innerHTML = `<h1 style="font-weight: bold;">Add Book First</h1>`;
    }
}

let libraryform = document.getElementById('libraryform')
libraryform.addEventListener('submit', submit);

async function submit(e) {
    e.preventDefault();
    // let isLoggedIn = await checkLoginStatus();
    // if (isLoggedIn) {
        console.log('User Logged in');
        let bookname = document.getElementById('formbook').value;
        let author = document.getElementById('formauthor').value;
        let description = document.getElementById('formdescription').value;
        let category;
        let programming = document.getElementById('programming');
        let finance = document.getElementById('finance');
        let persondev = document.getElementById('persondev');
        let someelse = document.getElementById('someelse');

        if (programming.checked) {
            category = programming.value;
        } else if (finance.checked) {
            category = finance.value;
        } else if (persondev.checked) {
            category = persondev.value;
        } else if (someelse.checked) {
            category = someelse.value;
        }

        let url = await uploadFiles();

        let data = localStorage.getItem('data');
        let bookobj;
        if (data == null) {
            bookobj = [];
        } else {
            bookobj = JSON.parse(data);
        }

        let newobj = {
            bookname: bookname,
            author: author,
            category: category,
            description: description,
            url: url
        }

        let book = new Book(bookname, author, category, description, url);
        let display = new Display();

        if (display.check(book)) {
            display.clear();
            bookobj.push(newobj);
            display.show('primary', 'Your book has been successfully added');
        } else {
            display.show('danger', 'Sorry, you cannot add this book');
        }

        localStorage.setItem('data', JSON.stringify(bookobj));
        showbooks();
    // } else {
        console.log('User not logged in');
        displayLoginPopup();
        return;
    // }
}

function displayLoginPopup() {
    // Display the login popup
    var modal = document.getElementById("loginModal");
    var span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

const accountBtn = document.querySelector('.account-btn');
const modal = document.querySelector('.modal');
const closeBtn = document.querySelector('.close');
const loggedInName = document.getElementById('logged-in-name');
const loggedInEmail = document.getElementById('logged-in-email');
const logoutBtn = document.querySelector('.logout-btn');

accountBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    loggedInName.textContent = 'John Doe';
    loggedInEmail.textContent = 'john.doe@example.com';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

logoutBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    logoutUser();
});

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

function closeLoginPopup() {
    var modal = document.getElementById("loginModal");
    modal.style.display = "none";
}

function logoutUser() {
    // Your logout logic here
}

function delconfirm() {
    let del = document.getElementById('delcon');
    del.innerHTML = `
    <div class="alert alert-primary alert-dismissible fade show" role="alert">
        <strong><h2>Your Book successfully deleted</h2></strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
    setTimeout(function() {
        del.innerHTML = "";
    }, 2500);
}

function deletebook(index) {
    let data = localStorage.getItem("data");
    if (data == null) {
        bookobj = [];
    } else {
        bookobj = JSON.parse(data);
    }
    bookobj.splice(index, 1);
    localStorage.setItem('data', JSON.stringify(bookobj));
    showbooks();
    delconfirm();
}
