const firebaseConfig = {
  apiKey: "AIzaSyCLJAZyTBjYdpkOoTVnibScf13O-SUMsag",
  authDomain: "digital-library-7a492.firebaseapp.com",
  databaseURL: "https://digital-library-7a492-default-rtdb.firebaseio.com",
  projectId: "digital-library-7a492",
  storageBucket: "digital-library-7a492.appspot.com",
  messagingSenderId: "1010414231023",
  appId: "1:1010414231023:web:46bdd92d93465f37d9ea1a"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize variables
const auth = firebase.auth();
// const auth = getAuth();
const database = firebase.database();

function ToggleScreenLoader(){
    let loader = document.getElementById('loader')
    if (loader.style.display === 'none') {
      loader.style.display = "flex";
    } else {
      loader.style.display = "none";
    }
}

function register (e) {
  // Prevent the default form submission
  e.preventDefault();
  ToggleScreenLoader();
  // Get all our input fields
  var email = document.getElementById('regmail').value;
  var password = document.getElementById('regpass').value;
  var full_name = document.getElementById('regname').value;

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!');
    ToggleScreenLoader();
    return;
  }
  if (validate_field(full_name) == false) {
    alert('One or More Extra Fields is Outta Line!!');
    ToggleScreenLoader();
    return;
  }
  auth.createUserWithEmailAndPassword(email, password)
    .then(function(userCredential) {
      var user = userCredential.user;
      var user_data = {
        email: email,
        full_name: full_name,
        last_login: Date.now()
      };

      // Push to Firebase Database
      return database.ref('users/' + user.uid).set(user_data);
    })
    .then(() => {
      console.log("User Created!!");
      window.location.href = "../index.html";
    })
    .catch(function(error) {
      var errorMessage = error.message;
      alert(errorMessage);
    });
    ToggleScreenLoader();
}


function login (e){
  // Prevent the default form submission
  e.preventDefault();
  ToggleScreenLoader();
  // Get all our input fields
  var email = document.getElementById('logmail').value;
  var password = document.getElementById('logpass').value;

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!');
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser;

    // Create User data
    var user_data = {
      last_login : Date.now()
    };

    // Push to Firebase Database
    database.ref('users/' + user.uid).update(user_data);

    // Set session storage
    sessionStorage.setItem("UserFullName", user.displayName);
    sessionStorage.setItem("UserEmailID", user.email);
    sessionStorage.removeItem('userInfo');
    // Done
    window.location.href= "../index.html";
  })
  .catch(function(error) {
    var error_message = error.message;
    alert(error_message);
  });
  ToggleScreenLoader();
}

  // Google Sign-In function
function googleSignUp() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      // User signed in successfully
      var user = result.user;
      console.log('User signed in:', user);
      alert('Google Sign-up successful!');
      // Send google  info to server and redirect to index page
      window.location.href = "../index.html"
    })
    .catch((error) => {
      // Handle errors
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error('Google Sign-up error:', errorCode, errorMessage);
      alert('Google Sign-up failed. Please try again.');
    });
}


function resetPassword() {
  emailForPassReset = document.getElementById('logmail').value;
  ToggleScreenLoader();
  // First, check if the email exists
  firebase.auth().fetchSignInMethodsForEmail(emailForPassReset)
    .then((signInMethods) => {
      if (signInMethods.length === 0) {
        // No existing account found for this email
        alert('No account found with this email. Please enter a registered email address.');
        // Clear the email field
        document.getElementById('logmail').value = '';
        return;
      }

      // Email exists, proceed with sending reset password email
      if (validate_email(emailForPassReset)) {
        firebase.auth().sendPasswordResetEmail(emailForPassReset)
          .then(() => {
            alert('A password reset link has been sent to your registered Email ID. Click on the provided link or copy it and paste into a browser');
          })
          .catch((error) => {
            console.error('Error sending password reset email:', error);
            alert('An error occurred while sending the password reset email. Please try again later.');
            ToggleScreenLoader();
          });
          ToggleScreenLoader();
      } else {
        alert('Please enter a valid email address.');
        ToggleScreenLoader();
      }
    })
    .catch((error) => {
      console.error('Error fetching sign-in methods:', error);
      alert('An error occurred. Please try again.');
    });
}

function validate_email(email) {
  // Your existing email validation code
}

// Validate Functions
function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/;
  return expression.test(email);
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  return password.length >= 6;
}

function validate_field(field) {
  return field.trim() !== '';
}

// Checking

function getUserUid(email) {
  return new Promise((resolve, reject) => {
    auth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        // Get the UID of the logged-in user
        const uid = userCredential.user.uid;
        resolve(uid);
      })
      .catch(error => {
        reject(error.message);
      });
  });
}
