import Vue from 'vue'
import Vuex from 'vuex'
import firebaseInfo from './firebase.js'
import firebase from 'firebase'
import helperFunctions from './helperFunctions.js'
import OnboardingService from '../services/onboardingService.js'
import UserService from '../services/userService.js'
import router from '../router'
const db = firebaseInfo.database
const users = db.collection('users')
Vue.use(Vuex)
Vue.use(firebase)

export const store = new Vuex.Store({
  state: {
    curUser: {},
    loggedIn: null
  },
  getters: {
    loggedIn (state) {
      console.log(state.loggedIn)
      return state.loggedIn
    },
    getCurrentUser (state) {
      return state.curUser
    }
  },
  mutations: {
    setUser (state, payload) {
      state.curUser = payload
    },
    signUpMutation (state, payload) {
      if (payload.emailSignUp == true) {
        helperFunctions.signUpPassword(state, payload)
      } else if (payload.google == true) {
        helperFunctions.googleSignUp(state, payload)
      }
    },
    loginMutation (state, payload) {
      if (payload.emailLogin == true) {
        helperFunctions.loginPassword(state, payload)
        location.reload()
      } else if (payload.google == true) {
        helperFunctions.googleSignIn(state, payload)
      }
    },
    setLoggedIn (state) {
      state.loggedIn = true
    },
    alreadyLoggedInMutation (state, payload) {
      helperFunctions.alreadyLoggedIn(state, payload)
    },
    logoutMutation (state) {
      let self = this
      firebase.auth().signOut().then(function () {
        router.push('/')
        console.log('logout')
        state.loggedIn = false
        self.curUser = {}
        location.reload()
      }).catch(function (err) {
        console.log(err.message)
      })
    },
    refreshUserState(state) {
      helperFunctions.refreshUserState(state);
    }
  },
  actions: {
    signUp ({commit}, payload) {
      commit('signUpMutation', payload)
    },
    login ({commit}, payload) {
      commit('loginMutation', payload)
    },
    alreadyLoggedIn ({commit}, payload) {
      commit('alreadyLoggedInMutation', payload)
    },
    logout ({commit}) {
      commit('logoutMutation')
    },
    refreshUserState ({commit}) {
      commit('refreshUserState');
    },
  }
})
