// import firebase database here
import firebase from '../store/firebase.js'
import UserService from './userService.js'
import axios from 'axios'

const db = firebase.database
const answers = db.collection('answers')
const questions = db.collection('questions')
const discussions = db.collection('discussions')
const comments = db.collection('comments')
const users = db.collection('users')
const userSolutions = db.collection('userSolutions')
export default {
  getQuestions () {
    return questions.get()
  },
  getQuestion (id) {
    return questions.doc(id).get()
  },
  createSolution (questionID, userSolution) {
    let query = userSolutions.where('questionID', '==', questionID).where('userID', '==', UserService.getCurrentUserId()).get()
      .then(snapshot => {
        if (snapshot.empty) {
          let result = Object.assign({}, {
            questionID: questionID,
            userSolution: userSolution,
            userID: UserService.getCurrentUserId(),
            createdDate: this.getDate()
          })
          userSolutions.add(result).then(function (docRef) {
            console.log('Document written with ID: ', docRef.id)
          }).catch(function (error) {
            console.error('Error adding document: ', error)
          })
        }
        snapshot.forEach(doc => { // should only be one
          userSolutions.doc(doc.id).update({userSolution: userSolution}) // update answrs
            .then(function () {
              console.log('Document successfully updated!')
            }).catch(function (error) {
            // The document probably doesn't exist.
              console.error('Error updating document: ', error)
            })
        })
      })
      .catch(err => {
        console.log('Error getting documents', err)
      })
  },
  postAnswer (answer, id, updateCallback) {
    let answers
    let self = this
    this.getQuestion(id).then(function (querySnapshot) {
      console.log(querySnapshot)
      answers = querySnapshot.data().answers
      answers.push(answer) // add the answer to the answers
      questions.doc(id).update({answers: answers}) // update answrs
        .then(function () {
          self.algoliaUpdateQuestion(id)
          updateCallback()
          console.log('Document successfully updated!')
        })
        .catch(function (error) {
        // The document probably doesn't exist.
          console.error('Error updating document: ', error)
        })
    })
  },
  upvoteAnswer (id) {
    return this.getComments(id).then(function (result) {
      let comment = result.data()
      let upvotes = comment.upvotes
      if (upvotes[UserService.getCurrentUserId()] == 1) {
        console.log('delete')
        delete upvotes[UserService.getCurrentUserId()]
      } else {
        upvotes[UserService.getCurrentUserId()] = 1
      }
      console.log(upvotes)
      comments.doc(id).update({upvotes: upvotes})
        .then(function () {
          console.log('Document successfully updated!')
          return 1
        })
        .catch(function (error) {
        // The document probably doesn't exist.
          console.error('Error updating document: ', error)
        })
    })
  },
  downvoteAnswer (id) {
    return this.getComments(id).then(function (result) {
      let comment = result.data()
      let upvotes = comment.upvotes
      if (upvotes[UserService.getCurrentUserId()] == -1) {
        delete upvotes[UserService.getCurrentUserId()]
      } else {
        upvotes[UserService.getCurrentUserId()] = -1
      }
      comments.doc(id).update({upvotes: upvotes})
        .then(function () {
          console.log('Document successfully updated!')
          return -1
        })
        .catch(function (error) {
        // The document probably doesn't exist.
          console.error('Error updating document: ', error)
        })
    })
  },
  indicateCompleteness (questionID, complete,callback) {
    let questionsCompleted = UserService.getCurrentUser().completedQuestions;
    questionsCompleted[questionID] = complete;
    UserService.updateCurrentUser({completedQuestions: questionsCompleted}, callback);
  },
  submitComment (questionID, comment, title, callback) {
    let self = this
    discussions.where('questionID', '==', questionID).limit(1).get().then(function (snapshot) { // now add commentID to discussion
      let discussion = snapshot.docs[0].data()
      let commentToAdd = Object.assign({}, {
        discussionID: snapshot.docs[0].id,
        upvotes: {},
        userID: UserService.getCurrentUserId(),
        content: comment,
        title: title,
        createdDate: self.getDate()
      })
      let commentID
      comments.add(commentToAdd).then(function (docRef) {
        console.log('Document written with ID: ', docRef.id) // wrote the comment
        commentID = docRef.id
        let discussionComments = discussion.comments
        discussionComments.push(commentID)
        console.log(discussionComments)
        discussions.doc(snapshot.docs[0].id).update({comments: discussionComments}) // update questionsCompleted
          .then(function () {
            callback()
            console.log('Document successfully updated!')
          })
          .catch(function (error) {
            // The document probably doesn't exist.
            console.error('Error updating document: ', error)
          })
      }).catch(function (error) {
        console.error('Error adding document: ', error)
      })
    })
  },
  getDiscussion (questionID, needID) {
    return discussions.where('questionID', '==', questionID).limit(1).get().then(function (snapshot) { // now add commentID to discussion
      if (needID) {
        return {data: snapshot.docs[0].data(), id: snapshot.docs[0].id}
      }
      return snapshot.docs[0].data()
    })
  },

  getDate () {
    let result = {}
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    result.ms = new Date().getTime()
    const date = new Date()
    const month = months[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()
    result.stringFormat = month + ' ' + day + ', ' + year
    return result
  },
  getComments (id) {
    // console.log('get Comment', id)
    return comments.doc(id).get()
  },
  getUserSolution (id) {
    return userSolutions.where('questionID', '==', id).where('userID', '==', UserService.getCurrentUserId()).limit(1).get().then(function (snapshot) { // now add commentID to discussion
      if (snapshot.empty) {
        return 0
      }
      return snapshot.docs[0].data()
    })
  },
  commentToComment(id,updatedComments){
    comments.doc(id).update({comments: updatedComments}) // update questionsCompleted
      .then(function () {
        console.log('Document successfully updated!')
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error('Error updating document: ', error)
      })
  },

  // Reply comment upvote
  updateVote(id, updatedComments){
    return comments.doc(id).update({comments: updatedComments})
  },
  getAllUsersSolution(id) {
    return userSolutions.where('userID', '==', id).get()
  }
}
