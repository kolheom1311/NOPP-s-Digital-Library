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

function openResetModal() {
  document.getElementById('resetModal').style.display = 'block';
}

function closeResetModal() {
  document.getElementById('resetModal').style.display = 'none';
  document.getElementById('emailInput').value = '';
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
  // Get all our input fields
  var email = document.getElementById('logmail').value;
  var password = document.getElementById('logpass').value;
  ToggleScreenLoader();
  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!');
    document.getElementById('loader').style.display = 'none';
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

/*async function resetPassword() {
  var emailInput = document.getElementById('emailInput').value;
  try {
    console.log("Email input:", emailInput);
    const signInMethods = await auth.fetchSignInMethodsForEmail(emailInput);
    console.log("Sign-in methods length:", signInMethods.length);
    if (signInMethods.length > 0) {
      await auth.sendPasswordResetEmail(emailInput);
      console.log('Password reset link sent to email');
    } else {
      console.error('User not found or email is not associated with any sign-in method');
    }
  } catch (error) {
    console.error(error.message);
  }
}*/

function resetPassword(){
  var email = document.getElementById('emailInput').value;
  firebase.auth().sendPasswordResetEmail(email)
    .then
    (function() {
      // Password reset email sent successfully
      window.alert("If "+ email +" is registered with Digital Library,\nA Password reset link is sent to it.");
      // You can display a message to the user here if needed
    })
    .catch(function(error) {
      // Error occurred while sending password reset email
      console.error("Error sending password reset email:", error);
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode+": "+errorMessage); 
      // You can display an error message to the user here if needed
    });
}

/*async function checkEmailExists() {
  var email = document.getElementById('emailInput').value;
  try {
    const userRecord = await firebase.auth().getUserByEmail(email);
    // If userRecord exists, email exists
    console.log("Email exists:", email);
    // You can handle the existence of the email here
    return true;
  } catch (error) {
    // If error code is 'auth/user-not-found', email does not exist
    if (error.code === 'auth/user-not-found') {
      console.log("Email does not exist:", email);
      // You can handle the non-existence of the email here
      return false;
    } else {
      // Other error occurred
      console.error("Error checking email existence:", error);
      // You can handle the error here
      return false;
    }
  }
}*/


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
        const uid = userCredential.user.uid;
        resolve(uid);
      })
      .catch(error => {
        reject(error.message);
      });
  });
}
