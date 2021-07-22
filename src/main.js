// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import { store } from './store/store.js';
import firebase from './store/firebase.js';
import Carousel3d from 'vue-carousel-3d';
import globalMixins from './mixins/globalMixins';
import UserService from './services/userService.js';
import { NavbarPlugin } from 'bootstrap-vue';
import VModal from 'vue-js-modal';
import SuiVue from 'semantic-ui-vue';

// Bootstrap Import
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

import './plugins';
import './components';
import 'semantic-ui-css/semantic.min.css';

// Syntax Highlight
import hljs from 'highlight.js';

// Fontawesome
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

 
// library.add(faUserSecret)
// Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(hljs.vuePlugin);
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VModal);
Vue.use(NavbarPlugin);
Vue.use(Carousel3d);
Vue.use(SuiVue);
Vue.mixin(globalMixins);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  firebase,
  components: { App },
  template: '<App/>',
  created() {
    firebase.auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        console.log("idTokenResult", idTokenResult.token);
        UserService.userExists(user.uid).then(found => {
          if (found && user.emailVerified) {
            found.idToken = idTokenResult.token;
            this.$store.dispatch('alreadyLoggedIn', found);
            this.$root.$emit('changedUser');
          }
        });
      }
    });
  }
});
