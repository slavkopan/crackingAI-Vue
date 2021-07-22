import firebaseInfo from './firebase.js';
import firebase from 'firebase';
import UserService from '../services/userService.js';
import StripeService from '../services/stripeService.js';
import router from '../router';
const db = firebaseInfo.database;
const users = db.collection('users');
import sha256 from 'sha256';

export default {
  signUpPassword(state, signup) {
    return new Promise(async (resolve, rej) => {
      try {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(
            signup.Email,
            // sha256(signup.Password)
            signup.Password
          );
  
        const user = firebase.auth().currentUser;
        await user.sendEmailVerification();
        this.setUser(state, signup).then((docRef) => {
          StripeService.createCustomer(signup.Email).then((res) => { // Create customer on stripe
            // console.log("createCustomer res", res);
            const result = res.data;
            if (result && result.error === false) {
              UserService.updateCurrentUser({ customerId: result.customer.id }, () => { // Update stripe customer id to firestore database
                firebase.auth().signOut(); 
              });
            }else {
              firebase.auth().signOut(); 
            }
          }).catch((err) => {
            console.log("createCustomer err", err);
          });
          resolve();
        }).catch(err => {
          rej(err);
        });
      } catch (err) {
        rej(err);
      }
    });
  },
  loginPassword(state, login) {
    return new Promise(async (res, rej) => {
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(login.Email, login.Password);
          firebase.auth().onAuthStateChanged((user) => {
            if(user && !user.emailVerified) {
              firebase.auth().signOut();
              rej({ message: 'Email is not verified'});
            } else {
              this.checkUserStatus(state)
              .then(() => {
                res();
              })
              .catch(() => {
                firebase.auth().signOut();
                rej({ message: 'Something went wrong! Please try again later.' });
              });
            }
          });
          // .then(() => {
          //   firebase.auth().onAuthStateChanged(function(user) {
          //     if (user) {
          //       // alert("Signed in user!")
          //       if (user != null) {
          //         let email_verified = user.emailVerified;
          //         // console.log(`email verified ${email_verified}`);
          //         if (email_verified === false) {
          //           console.log('Email is not verified');
          //           firebase.auth().signOut();
          //           rej({ message: 'Email is not verified' });
          //         } else {
          //           console.log('Email is verified');
          //         }
          //       }
          //     }
          //   });
          // })
          // .catch(error => {
          //   console.log(error);
          // });

        // this.checkUserStatus(state)
        // .then(() => {
        //   res();
        // })
        // .catch(() => {
        //   firebase.auth().signOut();
        //   rej({ message: 'Something went wrong! Please try again later.' });
        // });
      } catch (err) {
        rej(err);
      }
    });
  },
  googleSignIn() {
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider());
  },
  facebookSignIn() {
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.FacebookAuthProvider());
  },
  checkUserStatus(state) {
    return new Promise((res, rej) => {
      users
        .where('userId', '==', firebase.auth().currentUser.uid)
        .limit(1)
        .get()
        .then(snapshot => {
          if (!snapshot.docs.length) {
            res('signup');
          } else {
            this.setUserState(state, snapshot.docs[0]);
            res('login');
          }
        })
        .catch(err => {
          rej(err);
        });
    });
  },
  setUser(state, signup) {
    return new Promise((res, rej) => {
      let profile = {};
      profile.userId = firebase.auth().currentUser.uid;
      profile.completedQuestions = {};
      profile.first_name = '';
      profile.last_name = '';
      profile.img_add = '/static/assets/img/avatar/default-avatar.png';
      profile.username = signup.Username;
      profile.email = signup.Email;
      users
        .add(profile)
        .then(docRef => {
          docRef.get().then(doc => {
            this.setUserState(state, doc);
            res(docRef);
          });
        })
        .catch(err => {
          rej(err);
        });
    });
  },
  async setUserState(state, doc) {
    const idTokenResult = await firebase.auth().currentUser.getIdTokenResult();
    console.log('idTokenResult', idTokenResult);
    state.curUser = {
      ...doc.data(),
      idToken: idTokenResult.token  
    };
    UserService.setCurrentUser(state.curUser);
    // state.loggedIn = true;
    // this.routerPushHome();
  },
  routerPushHome() {
    router.push({ name: 'AllProblems' }).catch(() => {});
  },
  alreadyLoggedIn(state, payload) {
    state.curUser = payload;
    UserService.setCurrentUser(state.curUser);
    state.loggedIn = true;
    // this.routerPushHome();
  },
  checkUniqueUsername(username) {
    return new Promise((res, rej) => {
      users
        .where('username', '==', username)
        .limit(1)
        .get()
        .then(snapshot => (!snapshot.docs.length ? res() : rej()))
        .catch(() => rej());
    });
  },
  refreshUserState(state) {
    users
      .where('userId', '==', firebase.auth().currentUser.uid)
      .limit(1)
      .get()
      .then(snapshot => {
        if (snapshot.docs.length) {
          this.setUserState(state, snapshot.docs[0]);
        }
      })
      .catch(err => {
        console.log('refreshUserState err', err);
      });
  }
};
