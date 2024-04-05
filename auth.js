const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
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

function uploadFiles() {
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
