// import firebase database here
import firebase from '../store/firebase.js'
import UserService from './userService.js'
import axios from 'axios'

const db = firebase.database
const questions = db.collection('questions')
const answers = db.collection('answers')

export default {
  askQuestion (askerId, title) {
    let self = this
    let question = this.createQuestion(askerId, title)
    questions.add(question).then(function (docRef) {
      questions.doc(docRef.id).get().then(function (querySnapshot) {
        self.addQuestionToAlgolia(querySnapshot.data(), docRef.id)
      })
      console.log('Document written with ID: ', docRef.id)
    }).catch(function (error) {
      console.error('Error adding document: ', error)
    })
  },
  createQuestion (askerId, title) {
    return Object.assign({}, {
      asked_by: askerId,
      title: title,
      answers: [],
      createdDate: new Date().getTime()
    })
  },
  getQuestions () {
    return questions.get()
  },
  getQuestion (id) {
    return questions.doc(id).get()
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
  upvoteAnswer (index, questionId, curUserId) {
    return this.getQuestion(questionId).then(function (querySnapshot) {
      let answers = querySnapshot.data().answers
      let answer = answers[index]
      console.log(answer)
      answer.upvotes[curUserId] = 1
      answers.splice(index, 1, answer)
      questions.doc(questionId).update({answers: answers}) // update answrs
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
  downvoteAnswer (index, questionId, curUserId) {
    return this.getQuestion(questionId).then(function (querySnapshot) {
      let answers = querySnapshot.data().answers
      let answer = answers[index]
      answer.upvotes[curUserId] = -1
      answers.splice(index, 1, answer)
      questions.doc(questionId).update({answers: answers}) // update answrs
        .then(function () {
          console.log('Document successfully updated!')
          return 1
        })
        .catch(function (error) {
        // The document probably doesn't exist.
          console.error('Error updating document: ', error)
        })
    })
  }
}
