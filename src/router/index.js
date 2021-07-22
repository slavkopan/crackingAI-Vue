import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import AboutPage from '@/components/AboutPage.vue'
import AllProblems from '@/components/AllProblems.vue'
import IndividualProblemView from '@/components/IndividualProblem.vue'
import IndividualDiscussionView from '@/components/IndividualDiscussion.vue'
import TermsOfService from '@/components/TermsOfService.vue'
import Profile from '@/components/Profile.vue'
import SubscriptionPage from '@/components/SubscriptionPage.vue'
import LandingPage from '@/components/LandingPage.vue'
import UpdateCardDetails from '@/components/UpdateCardDetails.vue'
import SubscriptionPaymentHistory from '@/components/SubscriptionPaymentHistory.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/allproblems',
      name: 'AllProblems',
      component: AllProblems,
      meta: { requiresAuth: false }
    },
    {
      path: '/terms',
      name: 'TermsOfService',
      component: TermsOfService,
      meta: { requiresAuth: false }
    },
    {
      path: '/about',
      name: 'About',
      component: AboutPage,
      meta: { requiresAuth: false }
    },
    {
      path: '/problem/:id',
      name: 'IndividualProblemView',
      component: IndividualProblemView,
      meta: { requiresAuth: false }
    },
    {
      path: '/discussion/:id',
      name: 'IndividualDiscussionView',
      component: IndividualDiscussionView,
      meta: { requiresAuth: false }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: { requiresAuth: false }
    },
    {
      path: '/subscription',
      name: 'SubscriptionPage',
      component: SubscriptionPage,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'LandingPage',
      component: LandingPage,
      meta: { requiresAuth: false }
    },
    {
      path: '/updateCardDetails',
      name: 'UpdateCardDetails',
      component: UpdateCardDetails,
      meta: { requiresAuth: false }
    },
    {
      path: '/subscriptionHistory',
      name: 'SubscriptionPaymentHistory',
      component: SubscriptionPaymentHistory,
      meta: { requiresAuth: false }
    }
    /*
    {
      path: '/problem',
      name: 'IndividualProblemView',
      component: IndividualProblemView,
      meta: { requiresAuth: true }
    } */
  ]
})

// Secure routes
router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (!currentUser && requiresAuth) {
    next('landing')
  } else next()
})

export default router
