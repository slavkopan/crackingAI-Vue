<template>
  <div id="navbar">
    <b-navbar 
      class="navbar navbar-expand-lg student-garage-nav"
      data-navbar="sticky"
      v-if="!($route.path === '/landing' || $route.path === '/sign-up/student' || $route.path === '/login/student')" 
      toggleable="lg"
      
      >

      <b-navbar-brand href="#">
        <router-link class="nav-link" :to="{ name: 'AllProblems'}">
          <h1 class="brand-logo">Cracking The AI Interview</h1>
        </router-link>
            <!-- <img class="logo-dark" src="/static/assets/img/AI-navbar-logo.png" alt="logo" /> -->
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <!-- <b-nav-item href="#">Link</b-nav-item>
          <b-nav-item href="#" disabled>Disabled</b-nav-item> -->
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto" right>
          <!-- <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form> -->

          <!-- <b-nav-item-dropdown text="Lang" right>
            <b-dropdown-item href="#">EN</b-dropdown-item>
            <b-dropdown-item href="#">ES</b-dropdown-item>
            <b-dropdown-item href="#">RU</b-dropdown-item>
            <b-dropdown-item href="#">FA</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right> -->
            <!-- Using 'button-content' slot -->
            <!-- <template v-slot:button-content>
              <em>User</em>
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown> -->
          <ul class="nav nav-navbar mx-auto">
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'About'}">About</router-link>
            </li>

            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'AllProblems'}">Problems</router-link>
            </li>

            <div class="footer-links-hidden">
              <li class="nav-item">
                <a class="nav-link" href="#">Faq</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Contact Us</a>
              </li>
            </div>

            <li class="nav-item" v-if="!loggedIn">
              <a class="nav-link cursor-pointer" @click.prevent="promptLogin">Login | Sign Up</a>
            </li>

            <li class="nav-item dropdown" v-else>
              <a
                class="nav-link dropdown-toggle cursor-pointer"
                data-toggle="dropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
              >
                  <!-- <b-avatar class="default-avatar" :src="curUser.img_add"></b-avatar> -->
                  <b-img class="default-avatar" :src="curUser.img_add"></b-img>
              </a>

              <div class="profile-dropdown dropdown-menu">
                <router-link :to="{ name: 'Profile'}" class="dropdown-item">My Profile</router-link>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item cursor-pointer" @click.prevent="logout">Logout</a>
              </div>
            </li> 
          </ul>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Navbar',
  data() {
    return {
      msg: 'This is navbar',
      example: 'Testing'
    };
  },
  computed: {
    ...mapGetters({
      curUser: 'getCurrentUser',
      loggedIn: 'loggedIn'
    })
  },
  methods: {
    goToQA() {
      // q-a-main
      this.$router.push({ path: `/questions` });
    },
    logout() {
      this.$store.dispatch('logout');
    },
    promptLogin() {
      console.log('Login modal');
      this.$modal.show('login', { auto_prompt: false, show_reason: '' });
    }
  }
};
</script>

<style scoped>
@import '../assets/css/Navbar.css';
</style>
