// import firebase database here
import firebase from '../store/firebase.js'
import UserService from './userService.js'
import axios from 'axios'
const db = firebase.database
const messages = db.collection('messages')
const chatrooms = db.collection('chatrooms')

export default{

  createMessage (uid, rid, textMessage) {
    return Object.assign({}, {
      userId: uid,
      receiverId: rid,
      message: textMessage,
      createdDate: new Date().getTime(),
      updatedDate: new Date().getTime()
    })
  },

  createChatRoom (userId, otherUser) {
    let room = {}
    let users = {}
    users[userId] = true
    users[otherUser] = true
    room.users = users
    room.messages = []
    return chatrooms.add(room).then(function (docRef) {
      return docRef.id
    }).catch(function (error) {
      console.error('Error adding document: ', error)
    })
  },

  sendMessage (chatId, userId, receiverId, text) {
    let self = this
    console.log('messageServiceChat Id', chatId)
    let chatRef = chatrooms.doc(chatId)
    console.log('chatRef', chatRef)
    return chatrooms.doc(chatId).get().then(function (querySnapshot) {
      let chatroom = querySnapshot.data()
      console.log(chatroom)
      let messagesCopy = chatroom.messages
      messagesCopy.push(self.createMessage(userId, receiverId, text))
      return chatRef.update({
        messages: messagesCopy
      }).then(function () {
        console.log('Document successfully updated!')
        return 1 // number to return on success
      })
        .catch(function (error) {
          console.error('Error updating document: ', error)
          return -1 // number to return on error
        })
    })
  },

  getMessgesWithUser (userId, otherUserId) {
    return chatrooms.where('users.' + userId, '==', true).where('users.' + otherUserId, '==', true).limit(1).get().then(function (snapshot) {
      let result = {}
      console.log(snapshot.docs.length)
      if (snapshot.docs.length > 0) {
        result.chatId = snapshot.docs[0].id
        result.messages = snapshot.docs[0].data().messages.sort(function (a, b) {
          return new Date(b.createdDate) - new Date(a.createdDate)
        })
        console.log('After Alert', result)
        return result
      } else {
        console.log('No Messages With User Yet!')
        result.chatId = ''
        result.messages = []
        return result
      }
    })
  },

  getUserChatrooms (userId) {
    console.log(userId)
    return chatrooms.where('users.' + userId, '==', true).get().then(function (snapshot) {
      let rooms = []
      snapshot.docs.forEach(function (doc) {
        rooms.push(doc.data())
      })
      return rooms
    })
  },

  getAllMessagesRealTime (cb) {
    messages.onSnapshot(() => cb())
  },
  notifyUser (phoneNumber, user) {
    if (phoneNumber.length < 10) return // user doesn't have a legit phone number
    axios
      .post(
        'https://us-central1-student-garage.cloudfunctions.net/messageSent',
        {
          user: user,
          phoneNumber: phoneNumber
        },
        {
          headers: { 'Access-Control-Allow-Origin': '*' }
        }
      )
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

}
