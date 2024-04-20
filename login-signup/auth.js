const firebaseConfig = {
  apiKey: "your_api_key_here",
  authDomain: "your_auth_domain_here.firebaseapp.com",
  databaseURL: "https://your_project_id_here-default-rtdb.firebaseio.com",
  projectId: "your_project_id_here",
  storageBucket: "your_storage_bucket_here.appspot.com",
  messagingSenderId: "your_messaging_sender_id_here",
  appId: "your_app_id_here"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize variables
const auth = firebase.auth();
// const auth = getAuth();
const database = firebase.database();
// Set up our register function
/*function register () {
  // Get all our input fields
  var email = document.getElementById('regmail').value; // Use correct ID for email field
  var password = document.getElementById('regpass').value; // Use correct ID for password field
  var full_name = document.getElementById('regname').value; // Use correct ID for full_name field
  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!');
    return;
  }
  if (validate_field(full_name) == false) {
    alert('One or More Extra Fields is Outta Line!!');
    return;
  }
  
  // Move on with Auth
  auth.createUserWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      var user = auth.currentUser;

      // Add this user to Firebase Database
      // var database_ref = database.ref();

      // Create User data
      var user_data = {
        email : email,
        full_name : full_name,
        last_login : Date.now()
      };

      // Push to Firebase Database
      database.ref('users/' + email).set(user_data);

      // Done
      alert('User Created!!');
      window.location.href= "../index.html";
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      var errorCode = error.code;
      var errorMessage = error.message;

      alert(errorMessage);
    });
}*/

function ToggleScreenLoader(){
    let loader = document.getElementById('loader')
    if (loader.style.display === 'none') {
      loader.style.display = "flex";
    } else {
      loader.style.display = "none";
    }
}

/*function login (){
  // Get all our input fields
  email = document.getElementById('logmail').value
  password = document.getElementById('logpass').value

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!')
    return
    // Don't continue running the code
  }

  auth.signInWithEmailAndPassword(email, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser

    // Add this user to Firebase Database
    var database_ref = database.ref()

    // Create User data
    var user_data = {
      last_login : Date.now()
    }

    // Push to Firebase Database
    database_ref.child('users/' + user.uid).update(user_data)
    // Done
    sessionStorage.setItem("UserFullName", user.full_name)
    sessionStorage.setItem("UserEmailID", user.email)
    alert('User Logged In!!')
    window.location.href= "../index.html";
  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var error_message = error.message

    alert(error_code+': '+error_message)
  })
}

function register (e) {
  // Prevent the default form submission
  e.preventDefault();

  // Get all our input fields
  var email = document.getElementById('regmail').value;
  var password = document.getElementById('regpass').value;
  var full_name = document.getElementById('regname').value;

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!');
    return;
  }
  if (validate_field(full_name) == false) {
    alert('One or More Extra Fields is Outta Line!!');
    return;
  }

  // Move on with Auth
  auth.createUserWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      var user = auth.currentUser;

      // Create User data
      var user_data = {
        email : email,
        full_name : full_name,
        last_login : Date.now()
      };

      // Push to Firebase Database
      database.ref('users/' + user.uid).set(user_data);

      // Done
      alert('User Created!!');
      window.location.href= "../index.html";
    })
    .catch(function(error) {
      var errorMessage = error.message;
      alert(errorMessage);
    });
}*/

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
    alert('User Logged In!!');
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

/*function resetPassword() {
  emailForPassReset = document.getElementById('logmail').value;
  if (validate_email(emailForPassReset)) {
    firebase.auth().sendPasswordResetEmail(emailForPassReset).then(()=>{
        alert('A password reset link has been sent to your registered Email ID. Click on the provided link or copy it and paste into a browser');
    }),
    alert('An email has been sent with instructions on how to reset your password.')
  } else {
    alert('Please enter a valid email address.')
  }

  // var email = document.getElementById('email').value;

  // // Send password reset email
  // firebase.auth().sendPasswordResetEmail(email)
  //   .then(() => {
  //     // Password reset email sent successfully
  //     alert('Password reset email sent. Check your inbox.');
  //   })
  //   .catch((error) => {
  //     // Handle errors
  //     var errorCode = error.code;
  //     var errorMessage = error.message;
  //     console.error('Password reset error:', errorMessage, errorCode);
  //     alert('Failed to send password reset email. Please try again.');
  //   });
}*/

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
      ToggleScreenLoader();
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
