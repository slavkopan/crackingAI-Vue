var admin = require("firebase-admin");
var serviceAccount = require("./cracking-ai-firebase-adminsdk-6rk2x-10f9cc2c89.json");
let questions = require("./questions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cracking-ai.firebaseio.com"
});
const firestore = admin.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);

/*questions = JSON.parse(JSON.stringify(questions));*/



questions.forEach((question) =>{
  console.log(question);
  firestore.collection('questions').add(question).then(function(questiondocRef) {
    console.log("Document written with ID: ", questiondocRef.id);
    firestore.collection('discussions').add({questionID:questiondocRef.id,comments:[]}).then(function(discussiondocRef) {
      console.log("Document written with ID: ", discussiondocRef.id);
    }).catch(function(error) {
    console.error("Error adding document: ", error);
    });
  }).catch(function(error) {
  console.error("Error adding document: ", error);
  });
});
