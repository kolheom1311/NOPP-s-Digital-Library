import firebase from 'firebase/app'; // import the firebase library
import 'firebase/storage'; // import the storage module if you're using Firebase Storage
import 'firebase/auth'; // import the authentication module if you're using Firebase Auth

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

var fileText = document.querySelector(".fileText");
var fileItem;
var fileName;

function getFile(e) {
  fileItem = e.target.files[0];
  fileName = fileItem.name;
  fileText.innerHTML = fileName;
}

export function uploadFiles() {
  const storageRef = firebase.storage().ref("files/" + fileName);
  const uploadTask = storageRef.put(fileItem);

  return new Promise((resolve, reject) => {
      uploadTask.then((snapshot) => {
          return snapshot.ref.getDownloadURL();
      }).then((url) => {
          console.log("URL: ", url);
          if (url !== "") {
              resolve(url); // Resolve the Promise with the URL
          }
      }).catch((error) => {
          console.log("Error is ", error);
          reject(error); // Reject the Promise if there's an error
      });
  });
}

function logout() {
  const auth = firebase.auth(); // Initialize the auth variable
  auth.signOut().then(function () {
      // Sign-out successful.
      var user = auth.currentUser;

      // Update user's status to logged out in the database
      if (user) {
          var database_ref = firebase.database().ref(); // Initialize the database reference
          var user_data = {
              isLoggedIn: false // Set login status as false
          };
          database_ref.child('users/' + user.uid).update(user_data);
      }

      // Redirect to the login page or any other desired page
      window.location.href = "./login-signup/login-signup.html";
  }).catch(function (error) {
      // An error happened.
      console.error('Error while logging out:', error);
      // Handle error appropriately, such as showing an error message to the user
      alert('Failed to log out. Please try again.');
  });
}
