// import firebase database here
import { store } from '../store/store.js';
import firebase from '../store/firebase.js';
const db = firebase.database;
const storage = firebase.storage;
const storageRef = storage.ref();
const users = db.collection('users');
const questions = db.collection('questions');

let currentUser = null;
export default {
  setCurrentUser(user) {
    currentUser = user;
  },
  getCurrentUserId() {
    return currentUser.userId;
  },
  getCurrentUser() {
    return currentUser;
  },
  getCurrentUserQuestions() {
    return questions
      .where('asked_by.userId', '==', currentUser.userId)
      .get()
      .then(function(snapshot) {
        return snapshot.docs;
      });
  },
  getUserProfile(id) {
    let self = this;
    return users
      .where('userId', '==', id)
      .limit(1)
      .get()
      .then(function(snapshot) {
        if (snapshot.docs.length) {
          let user = snapshot.docs[0].data();
          return user;
        }else {
          return {};
        }
      });
  },
  getCurrentUserProfile() {
    return users
      .where('userId', '==', this.getCurrentUserId())
      .limit(1)
      .get()
      .then(snapshot => {
        let user = snapshot.docs[0].data();
        this.setCurrentUser(user);
        return user;
      });
  },
  userExists(userId) {
    return users
      .where('userId', '==', userId)
      .limit(1)
      .get()
      .then(snapshot =>
        snapshot.docs.length ? snapshot.docs[0].data() : undefined
      );
  },
  updateUser(userId, update, updatedProfile) {
    // updatedProfile function
    users
      .where('userId', '==', userId)
      .limit(1)
      .get()
      .then(function(snapshot) {
        let user = snapshot.docs[0];
        let userRef = users.doc(user.id);
        userRef
          .update(update)
          .then(function() {
            updatedProfile();
            console.log('Document successfully updated!');
          })
          .catch(function(error) {
            // The document probably doesn't exist.
            console.error('Error updating document: ', error);
          });
      });
  },
  updateCurrentUser(update, callback) {
    // updatedProfile function
    let self = this;
    let id = self.getCurrentUserId();
    users
      .where('userId', '==', id)
      .limit(1)
      .get()
      .then(function(snapshot) {
        let user = snapshot.docs[0];
        let userRef = users.doc(user.id);
        userRef
          .update(update)
          .then(function() {
            users
              .where('userId', '==', id)
              .limit(1)
              .get()
              .then(function(snapshot) {
                let user = snapshot.docs[0].data();
                self.setCurrentUser(user);
                callback();
              });
            console.log('Document successfully updated!');
          })
          .catch(function(error) {
            // The document probably doesn't exist.
            console.error('Error updating document: ', error);
          });
      });
  },
  getProfileImageURL(userId, fileName, image) {
    let path = '/images/profile-image/' + userId + '/' + fileName;
    let imageRef = storageRef.child(path);
    return imageRef.put(image).then(snapshot => {
      return snapshot.ref.getDownloadURL().then(function(downloadURL) {
        return downloadURL;
      });
    });
  },
  passwordReset(emailAddress, callback) {
    const auth = firebase.auth;
    console.log(auth);
    auth.sendPasswordResetEmail(emailAddress)
      .then(function() {
        // Email sent.
        console.log("Email Sent");
        callback(true)
      })
      .catch(function(error) {
        // An error happened.
        console.log(error);
        callback(false)
      });
  },
  updateUser(input) {
    let self = this;
    console.log(input);
    const id = self.getCurrentUserId();
    console.log(id);
    console.log(users);
    users
      .where('userId', '==', id)
      .limit(1)
      .get()
      .then(function(snapshot) {
        console.log(input);
        let result = {
          first_name: input.userFirstName,
          last_name: input.userLastName
        };
        if (input.img_add) {
          result.img_add = input.img_add;
        }
        let user = snapshot.docs[0].data();
        users
          .doc(snapshot.docs[0].id)
          .update(result) // update questionsCompleted
          .then(function() {
            console.log('Document successfully updated!');
            self.updateCurrentUser();
          })
          .catch(function(error) {
            // The document probably doesn't exist.
            console.error('Error updating document: ', error);
          });
      });
  },
  async updateUserProfileImage(file) {
    try {
      const userId = this.getCurrentUserId();
      const extension = file.type.split('/')[1];
      const fileName = `${userId}.${extension}`;
      let imageRef = storageRef.child(fileName);
      const snapshot  = await imageRef.put(file);
      const imageUrl = await snapshot.ref.getDownloadURL();
      return imageUrl;
    } catch(error) {
      return error;
    }
  },
  async userNameExists(username) {
    const userId = this.getCurrentUserId();
    return users
      .where('username', '==', username)
      .limit(1)
      .get()
      .then(snapshot => {
        if(snapshot.docs.length) {
          const data = snapshot.docs[0].data();
          if(data.userId === userId) {
            return false;
          } else {
            return true;
          }
        } else {
          return false;
        }
      });
  }
};
