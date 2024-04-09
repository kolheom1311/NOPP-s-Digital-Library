const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});
/*const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};*/
// Initialise firebaseConfig with values from the Firebase console.
const firebaseConfig = {
	apiKey: "AIzaSyCLJAZyTBjYdpkOoTVnibScf13O-SUMsag",
	authDomain: "digital-library-7a492.firebaseapp.com",
	databaseURL: "https://digital-library-7a492-default-rtdb.firebaseio.com",
	projectId: "digital-library-7a492",
	storageBucket: "digital-library-7a492.appspot.com",
	messagingSenderId: "1010414231023",
	appId: "1:1010414231023:web:46bdd92d93465f37d9ea1a"
  };
  
  //create a logout function
  function logOut() {
    localStorage.clear();
    window.location.href = 'index.html';
}
//create a function that will check the login status
// function checkLoginStatus(){
// 	let user = firebase.auth().currentUser;
// 	if (user) {
//         // User is signed in, show account info and offer log out
// 		// document.getElementById('accountInfo').style.display = 'block';
// 		// document.getElementById('loginOptions').style.display = 'none';
// 		// document.getElementById('loggedinUser').innerHTML = user.email;
// 	} else {
//         // No user is signed in, show sign up/login options
// 		// document.getElementById('loginOptions').style.display = 'flex';
// 		// document.getElementById('accountInfo').style.display = 'none';
// 	}
// }

export function checkLoginStatus(){
	// Return a promise that resolves with a boolean value
	return new Promise((resolve, reject) => {
	  // Check if there is a current user
	  firebase.auth().onAuthStateChanged(function(user){
		if (user) {
		  resolve(true);
		  // showMenu();
		} else {
		  resolve(false);
		  // hideMenu();
		}
	  });
	});
  }

// window.onload=checkLoginStatus();
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // Initialize variables
  const auth = firebase.auth();
  // const auth = getAuth();
  const database = firebase.database();

  //create a logout function
  
  // Set up our register function
  function register () {
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
		var database_ref = database.ref();
  
		// Create User data
		var user_data = {
		  email : email,
		  full_name : full_name,
		  last_login : Date.now()
		};
  
		// Push to Firebase Database
		database_ref.child('users/' + user.uid).set(user_data);
  
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
  }
  
  function login (){
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
  
	  // DOne
	  alert('User Logged In!!');
	  window.location.href= "../index.html";
	  //code to set login status as true
	})
	.catch(function(error) {
	  // Firebase will use this to alert of its errors
	//   var error_code = error.code
	  var error_message = error.message
  
	  alert(error_message)
	})
  }
  //function for checking if the user is logged in
  /*function checkLoginStatus(){
	// Check if there is a current user
	firebase.auth().onAuthStateChanged(function(user){
	  if (user) {
		  alert("Logged in");
		  // showMenu();
	  } else {
		  alert("Not logged in");
		  // hideMenu();
	  }
  })};*/
  
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
		console.error('Google Sign-up error:', errorMessage);
		alert('Google Sign-up failed. Please try again.');
	  });
  }
  
  function resetPassword() {
	var email = document.getElementById('email').value;
  
	// Send password reset email
	firebase.auth().sendPasswordResetEmail(email)
	  .then(() => {
		// Password reset email sent successfully
		alert('Password reset email sent. Check your inbox.');
	  })
	  .catch((error) => {
		// Handle errors
		var errorCode = error.code;
		var errorMessage = error.message;
		console.error('Password reset error:', errorMessage, errorCode);
		alert('Failed to send password reset email. Please try again.');
	  });
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
  
