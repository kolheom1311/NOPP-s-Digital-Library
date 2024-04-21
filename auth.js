const firebaseConfig = {
  apiKey: "AIzaSyCLJAZyTBjYdpkOoTVnibScf13O-SUMsag",
  authDomain: "digital-library-7a492.firebaseapp.com",
  databaseURL: "https://digital-library-7a492-default-rtdb.firebaseio.com",
  projectId: "digital-library-7a492",
  storageBucket: "digital-library-7a492.appspot.com",
  messagingSenderId: "1010414231023",
  appId: "1:1010414231023:web:46bdd92d93465f37d9ea1a"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var fileText = document.querySelector(".attach-button");
var fileItem;
var fileName;

function getFile(e) {
  var fileInput = e.target;
  var file = fileInput.files[0];

  // Check if the selected file is not a PDF
  if (file && file.type !== "application/pdf") {
      alert("Please select a PDF file.");
      fileInput.value = ""; // Clear the selected files
      return; // Stop further execution
  }
  else{
  // Proceed with displaying the file name
  fileItem = e.target.files[0];
  fileName = fileItem.name;
  fileText.innerHTML = fileName;
  }
}

var UserID = null;

function checkUserLoggedIn() {
  return new Promise((resolve) => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        UserID = user.uid;
        resolve({ loggedIn: true, uid: user.uid });
      } else {
        // No user is signed in.
        resolve({ loggedIn: false, uid: null });
      }
    });
  });
}

// window.onload = buttons;

function logoutUser() {
  firebase.auth().signOut().then(function() {
      // Sign-out successful.
      sessionStorage.removeItem("UserFullName");
      clearCachedUserInfo();
      alert("User signed out successfully");
      window.location.href="./login-signup/login-signup.html";
      // Redirect to the login page or any other desired page
  }).catch(function(error) {
      // An error happened.
      console.error('Error while logging out:', error);
      // Handle error appropriately, such as showing an error message to the user
      alert('Failed to log out. Please try again.');
  });
}

function getUserInfo() {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in, retrieve user data from Firebase Database
        firebase.database().ref('users/' + user.uid).once('value').then(snapshot => {
          const userData = snapshot.val();
          if (userData && userData.full_name && userData.email) {
            const userName = userData.full_name;
            const userEmail = userData.email;
            
            // Log user information
            console.log("User is signed in");
            console.log("User Name:", userName);
            console.log("User Email:", userEmail);

            resolve({
              name: userName,
              email: userEmail
            });
          } else {
            console.error('User data is incomplete or missing:', userData);
            reject({
              name: "",
              email: ""
            });
          }
        }).catch(error => {
          console.error('Error fetching user data:', error);
          reject({
            name: "",
            email: ""
          });
        });
      } else {
        // No user is signed in
        console.log("No user signed in");
        reject({
          name: "",
          email: ""
        });
      }
    });
  });
}

function displayUserInfo(name, email) {
  const usernameElement = document.getElementById('username');
  const emailElement = document.getElementById('email');

  // Update the DOM elements with the user information
  if (name && email) {
    usernameElement.textContent = name;
    emailElement.textContent = "Email: "+email;
  } else {
    // If user information is not available, display a default message
    usernameElement.textContent = "Guest!";
    emailElement.textContent = "";
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  try {
    // Show loader
    document.getElementById('loader').style.display = 'flex';
    document.body.style.overflowY = "hidden";
    
    // Check if user is logged in
    const { loggedIn } = await checkUserLoggedIn();
    
    // Display appropriate buttons
    const loginBtn = document.getElementById('login-Btn');
    const accountBtn = document.getElementById('account-Btn');
    showbooks();
    
    if (loggedIn === false) {
      accountBtn.style.display = 'none';
      loginBtn.style.display = 'block';
    } else {
      accountBtn.style.display = 'block';
      loginBtn.style.display = 'none';
    }
    
    // Hide loader after a delay
    setTimeout(() => {
      document.getElementById('loader').style.display = 'none';
      document.body.style.overflowY = "scroll";
    }, 10); // Adjust the delay as needed
  } catch (error) {
    console.error("Error:", error);
    // Handle error
  }
});

function displayLoadingState() {
  const usernameElement = document.getElementById('username');
  const emailElement = document.getElementById('email');
  usernameElement.textContent = "Loading...";
  emailElement.textContent = "";
}

function displayErrorState() {
  const usernameElement = document.getElementById('username');
  const emailElement = document.getElementById('email');
  usernameElement.textContent = "Error loading user data";
  emailElement.textContent = "";
}

function uploadFiles(fileItem, userId) {
const storageRef = firebase.storage().ref("files/" + userId + "/" + fileItem.name); 
const uploadTask = storageRef.put(fileItem);

return new Promise((resolve, reject) => {
    uploadTask.then((snapshot) => {
        return snapshot.ref.getDownloadURL();
    }).then((url) => {
        console.log("URL: ", url);
        if (url !== "") {
            resolve(url);
        }
    }).catch((error) => {
        console.log("Error is ", error);
        reject(error);
        toggleLoader();
    });
});
}

function linkBookWithPdf(userId, bookData) {
  // Reference to the user's books in the database
  const userBooksRef = database.ref('users/' + userId + '/books');
  // Push the book data to the user's books
  userBooksRef.push({
      bookData: bookData
  })
  .then(() => {
      console.log("Book data linked with PDF successfully!");
  })
  .catch((error) => {
      console.error("Error linking book data with PDF: ", error);
  });
}



