import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'
// Initialize Firebase
const config = {
      apiKey: 'AIzaSyCiC_56EOGud-G3fg9pJUKKMObRN4B20Iw',
      authDomain: 'cracking-ai.firebaseapp.com',
      databaseURL: 'https://cracking-ai.firebaseio.com',
      projectId: 'cracking-ai',
      storageBucket: 'cracking-ai.appspot.com',
      messagingSenderId: '597029256157',
      appId: "1:892601360683:web:e042303ea9b8bc1d07256e",
      appId: '1:597029256157:web:52a2878f080f2e80b69434'
}
firebase.initializeApp(config)
// Use this line if all of your Date types are in timestamps formats
// firebase.firestore().settings({timestampsInSnapshots: true})

export default {
  database: firebase.firestore(),
  settings: firebase.firestore().settings({ timestampsInSnapshots: true }),
  storage: firebase.storage(),
  auth: firebase.auth()
}
