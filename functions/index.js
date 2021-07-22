// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// const algoliasearch = require('algoliasearch');
// const cors = require("cors")({origin: true});
// const twilio = require('twilio');
// const ALGOLIA_APP_ID = "V3M5YXBNG9";
// const ALGOLIA_ADMIN_KEY = "e25d99bed2507f720df6ce4441202a32";

// const accountSid = functions.config().twilio.sid;
// const authToken  = functions.config().twilio.token;

// const client = new twilio(accountSid, authToken);

// const twilioNumber = '+16503811743' // your twilio phone number
// let serviceKey = './student-garage-firebase-adminsdk-7c5v6-1bd1893386.json';
// let serviceAccount = require(serviceKey);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://student-garage.firebaseio.com"
// });

// exports.addResourcesToAlgolia = functions.https.onRequest(function(req,res){
//   const db = admin.firestore();
//   const ALGOLIA_INDEX_NAME = "resources";
//   let arrayOfResources = [];
//   let titleContains = [];
//   const resources = db.collection('education-resources');
//   resources.get().then(function(docs){
//     docs.forEach(function(doc){
//       let resource = doc.data();
//       resource.objectID = doc.id;
//       if(!titleContains.includes(resource.title)){ // i believe we had duplicate docs in the db
//         arrayOfResources.push(resource);
//         titleContains.push(resource.title);
//       }
//     });
//     let client = algoliasearch(ALGOLIA_APP_ID,ALGOLIA_ADMIN_KEY);
//     let index = client.initIndex(ALGOLIA_INDEX_NAME);
//     index.saveObjects(arrayOfResources,function(err,content){
//       res.status(200).send(content);
//     });
//   });
// });

// // CORS and Cloud Functions export logic
// exports.messageSent = functions.https.onRequest((req, res) => {
//   cors(req,res,function(){
//     const phoneNumber = req.body.phoneNumber;
//     let user = req.body.user;
//     let message = "You have a new message from " + user.first_name + " " + user.last_name + " on Student Garage. To view, navigate to https://studentgarage.co/messages.";
//     const textMessage = {
//                           body: message,
//                           to: phoneNumber,  // Text to this number
//                           from: twilioNumber // From a valid Twilio number
//                       }
//                       client.messages.create(textMessage)
//                       .then(function(message){
//                         res.header("Access-Control-Allow-Origin", "*");
//                         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//                         res.status(200).send(message.sid);
//                       });
//   });
// });


// // CORS and Cloud Functions export logic
// exports.addQuestionToAlgolia = functions.https.onRequest((req, res) => {
//   cors(req,res,function(){
//     let question = req.body.question;
//     let algoliaClient = algoliasearch(ALGOLIA_APP_ID,ALGOLIA_ADMIN_KEY);
//     let index = algoliaClient.initIndex("questions");
//     index.saveObjects(question,function(err,content){
//       res.status(200).send(content);
//     });
//   });
// });


// // CORS and Cloud Functions export logic
// exports.addStudentToAlgolia = functions.https.onRequest((req, res) => {
//   cors(req,res,function(){
//     let student = req.body.student;
//     let algoliaClient = algoliasearch(ALGOLIA_APP_ID,ALGOLIA_ADMIN_KEY);
//     let index = algoliaClient.initIndex("students");
//     index.saveObjects(student,function(err,content){
//       res.status(200).send(content);
//     });
//   });
// });

// // CORS and Cloud Functions export logic
// exports.addInvestorToAlgolia = functions.https.onRequest((req, res) => {
//   cors(req,res,function(){
//     let investor = req.body.investor;
//     let algoliaClient = algoliasearch(ALGOLIA_APP_ID,ALGOLIA_ADMIN_KEY);
//     let index = algoliaClient.initIndex("investors");
//     index.saveObjects(investor,function(err,content){
//       res.status(200).send(content);
//     });
//   });
// });

// // CORS and Cloud Functions export logic
// exports.addProjectToAlgolia = functions.https.onRequest((req, res) => {
//   cors(req,res,function(){
//     let project = req.body.project;
//     let algoliaClient = algoliasearch(ALGOLIA_APP_ID,ALGOLIA_ADMIN_KEY);
//     let index = algoliaClient.initIndex("projects");
//     index.saveObjects(project,function(err,content){
//       res.status(200).send(content);
//     });
//   });
// });

// // CORS and Cloud Functions export logic
// exports.questionAnswered = functions.https.onRequest((req, res) => {
//   cors(req,res,function(){
//     const phoneNumber = req.body.phoneNumber;
//     let user = req.body.user;
//     let message = "You have a new answer from " + user.first_name + " " + user.last_name + " on Student Garage. To view, navigate to https://studentgarage.co/questions.";
//     const textMessage = {
//                           body: message,
//                           to: phoneNumber,  // Text to this number
//                           from: twilioNumber // From a valid Twilio number
//                       }
//                       client.messages.create(textMessage)
//                       .then(function(message){
//                         res.header("Access-Control-Allow-Origin", "*");
//                         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//                         res.status(200).send(message.sid);
//                       });
//   });
// });

// // CORS and Cloud Functions export logic
// exports.projectComment = functions.https.onRequest((req, res) => {
//   cors(req,res,function(){
//     const phoneNumber = req.body.phoneNumber;
//     let user = req.body.user;
//     let message = "You have a new comment on your project from " + user.first_name + " " + user.last_name + " on Student Garage. To view, navigate to https://studentgarage.co/discover.";
//     const textMessage = {
//                           body: message,
//                           to: phoneNumber,  // Text to this number
//                           from: twilioNumber // From a valid Twilio number
//                       }
//                       client.messages.create(textMessage)
//                       .then(function(message){
//                         res.header("Access-Control-Allow-Origin", "*");
//                         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//                         res.status(200).send(message.sid);
//                       });
//   });
// });
