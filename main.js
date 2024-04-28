console.log('this is a digital library');

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
        <strong>Message : ${message} 
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
    setTimeout(function() {
        alert.innerHTML = "";
    }, 10000);
}

async function showbooks() {
    // Check if user is logged in using the promise
    const { isLoggedIn, uid } = await checkUserLoggedIn();
    let tablebody = document.getElementById('tablebody');
    if (isLoggedIn) {
        console.error("No user logged in");
        bookinfo = `<h1 style="font-weight: bold;">Login to add/access books</h1>`;
        tablebody.innerHTML = bookinfo;
        return;
    }

    // Reference to the user's books in the database
    const userBooksRef = firebase.database().ref('users/' + uid + '/books');

    userBooksRef.once('value', (snapshot) => {
        let bookobj = snapshot.val();
        let bookinfo = "";

        if (bookobj) {
            Object.keys(bookobj).forEach((key, index) => {
                let bookData = bookobj[key].bookData;

                bookinfo += `<tr> 
                    <td>${index + 1}</td>
                    <td>${bookData.bookname}</td>
                    <td>${bookData.author}</td>
                    <td>${bookData.category}</td>
                    <td>${bookData.description}</td>
                    <td class="text-center">
                        <button class="btn btn-outline-primary btn-sm me-1" type="button" onclick="deletebook(this.id)" id="${key}">Delete Book</button>
                        <a class="btn btn-outline-primary btn-sm" href="${bookData.url}" download="${bookData.bookname}.pdf" target="_blank" style="margin-left: 25px">View/Download</a>
                    </td>`;
            });
        } else {
            bookinfo = `<h1 style="font-weight: bold;">No books added yet</h1>`;
        }
            tablebody.innerHTML = bookinfo;
    });
}



const loader = document.getElementById('addbookloader')
let scrollY = 0;
let libraryform = document.getElementById('libraryform')
libraryform.addEventListener('submit', submit)

async function submit(e) {
    e.preventDefault();
    toggleLoader();
    let display = new Display();
    const { loggedIn} = await checkUserLoggedIn(); // Await the promise

    if (loggedIn) {
        // get the form values
        let bookname = document.getElementById('formbook').value;
        let author = document.getElementById('formauthor').value;
        let description = document.getElementById('formdescription').value;
        let category;
        let programming = document.getElementById('programming');
        let finance = document.getElementById('finance');
        let persondev = document.getElementById('persondev');
        let someelse = document.getElementById('someelse');
        let fileInput = document.getElementById('myFile');
  
        // Get the current user's ID
        let currentUser = firebase.auth().currentUser;
        let userId = currentUser.uid;
  
        //check which checkbox is checked and assign value to variable
        if (programming.checked) {
            category = programming.value;
        } else if (finance.checked) {
            category = finance.value;
        } else if (persondev.checked) {
            category = persondev.value;
        } else if (someelse.checked) {
            category = someelse.value;
        }
  
        if (!bookname || !author || !description || !category) {
            let errorMsg = "Please fill in the following fields:";
            if (!bookname) errorMsg += "\n- Book Name";
            if (!author) errorMsg += "\n- Author Name";
            if (!description) errorMsg += "\n- Description";
            if (!category) errorMsg += "\n- Category";
            if (errorMsg === "Please fill in the following fields:\n- Book Name\n- Author Name\n- Description\n- Category") {
                display.show('danger', "All fields are empty");
            } else {
                display.show('danger', errorMsg);   
            }
            toggleLoader();
            return;
        } else if (fileInput.files.length === 0) {
            display.show('warning', 'To proceed, kindly provide the PDF file you\'d like to add.');
            toggleLoader();
            return;
        }
  
        let url = await uploadFiles(fileInput.files[0], userId); // Pass file and userId to uploadFiles
  
        // Link book's metadata with the PDF
        linkBookWithPdf(userId, {
            bookname: bookname,
            author: author,
            category: category,
            description: description,
            url: url
        });
  
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
            url: url,
            userId: userId
        };
  
        let book = new Book(bookname, author, category, description, url);
  
        if (display.check(book)) {
            display.clear();
            bookobj.push(newobj);
            display.show('primary', 'Your book has been successfully added');
        } else {
            display.show('danger', 'Sorry, you cannot add this book');
        }
        toggleLoader();
        localStorage.setItem('data', JSON.stringify(bookobj));
        showbooks();
    } else {
        toggleLoader();
        display.show('info', 'Please Login to continue');
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
    }
  }

function delconfirm() {
    let del = document.getElementById('delcon');
    del.innerHTML = `
    <div class="alert alert-primary alert-dismissible fade show" role="alert">
        <h2>Your Book successfully deleted</h2> 
        <button type="button" class="btn-close" data-dismiss="alert" aria-label="Close"></button>
    </div>`;
    setTimeout(function() {
        del.innerHTML = "";
    }, 5000);
}

async function deletebook(bookKeyToDelete) {
    ToggleScreenLoader();

    // Get the user ID from sessionStorage
    const userId = UserID;

    try {
        // Reference to the user's books
        const userBooksRef = firebase.database().ref('users/' + userId + '/books');

        // Fetch the user's books
        const snapshot = await userBooksRef.once('value');
        const userBooks = snapshot.val();

        // Check if user's books data exists
        if (!userBooks) {
            console.error("User's books data not found");
            ToggleScreenLoader();
            return;
        }

        // Retrieve the book data using the unique key
        const bookDataToDelete = userBooks[bookKeyToDelete].bookData;

        // Check if the book data exists
        if (!bookDataToDelete) {
            console.error("Book data not found");
            ToggleScreenLoader();
            return;
        }

        // Get the book URL
        const bookUrlToDelete = bookDataToDelete.url;

        // Delete from Firebase Realtime Database
        await userBooksRef.child(bookKeyToDelete).remove();
        console.log("Book entry removed from Firebase Realtime Database");

        // Delete from Firebase Storage
        const storageRef = firebase.storage().refFromURL(bookUrlToDelete);
        await storageRef.delete();
        console.log("File deleted from Firebase Storage");

    } catch (error) {
        console.error("Error deleting file or book entry: ", error);
        ToggleScreenLoader();
        return;
    }

    showbooks();
    delconfirm();
    ToggleScreenLoader();
}

function ToggleScreenLoader(){
    let loader = document.getElementById('loader')
    if (loader.style.display === 'none') {
      scrollY = window.scrollY;
      loader.style.display = "flex";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
    } else {
      loader.style.display = "none";
      document.body.style.position = "absolute";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      window.scrollTo(0, scrollY);
    }
}

function toggleLoader() {
    if (loader.style.display === "block") {
        loader.style.display = "none";
        document.body.style.position = "relative";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        window.scrollTo(0, scrollY);
    } else {
        scrollY = window.scrollY;
        loader.style.display = "block";
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
    }
}

window.addEventListener('beforeunload', function() {
    // Remove specific item from sessionStorage
    sessionStorage.removeItem('cachedUserInfo');
  });  

async function toggleModal(modalId) {
    var modal = document.getElementById(modalId);
    var loader = document.getElementById('account-loader');
    
    // Check the initial state of the modal
    var isModalHidden = modal.style.display === "" || modal.style.display === "none";

    if (isModalHidden) {
        // Display the loader
        loader.style.display = "flex";

        // Open the modal
        modal.style.display = "block";
        document.body.style.position = "fixed";

        try {
            await updateUsername();
        } catch (error) {
            console.error("Error updating username:", error);
            
            // Handle error: Display an error message or fallback to default state
            displayErrorState();
        } finally {
            // Hide the loader
            loader.style.display = "none";
        }
    } else {
        // Close the modal
        modal.style.display = "none";
        document.body.style.position =  "static";
    }
}


  function openModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = "block";
    document.body.style.overflow = 'hidden';
  }
  
  function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = "none";
    document.body.style.overflow = 'auto';
  }

  function clearCachedUserInfo() {
    sessionStorage.removeItem('userInfo');
  }

  function isUserInfoExists() {
    return sessionStorage.getItem('userInfo') !== null;
  }
  
  function getUserInfoFromCache() {
    if (isUserInfoExists()) {
        console.log('userInfo exists in sessionStorage');
      } else {
        console.log('userInfo does not exist in sessionStorage');
      }
  }

async function updateUsername() {
    try {
        let userInfo;

        // Check if user information is already cached
        if (isUserInfoExists()) {
            const cachedUserInfo = sessionStorage.getItem('userInfo');
            userInfo = JSON.parse(cachedUserInfo);
        } else {
            // Asynchronously fetch the latest user information from Firebase
            userInfo = await getUserInfo();
            
            // Cache the latest user information
            sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        }

        const { name, email } = userInfo;
        displayUserInfo(name, email);
    } catch (error) {
        console.error("Error updating username:", error);
        
        // Handle error: Display an error message or fallback to default state
        displayErrorState();
    }
}