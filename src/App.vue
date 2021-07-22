<template>
  <div>
    <div id="app" class="spread">
      <Navbar />
      <router-view class="margin-nav"></router-view>
      <LoginRegisterModal v-if="!loggedIn" />
      <UsernameModal />
      <UpgradeModal />
      <CancelModal />
      <ChangePriceModal />
      <RenewModal />
      <Foot />
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Head from '@/components/Head.vue';
import Main from '@/components/Main.vue';
import Foot from '@/components/Foot.vue';
import Landing from '@/components/Landing.vue';
import StudentSignUp from '@/components/login-register/students/SignUp.vue';
import LoginRegisterModal from '@/components/login-register/LoginRegisterModal.vue';
import UsernameModal from '@/components/usernameModal.vue';
import UpgradeModal from '@/components/UpgradeModal.vue';
import CancelModal from '@/components/CancelModal.vue';
import ChangePriceModal from '@/components/ChangePriceModal.vue';
import RenewModal from '@/components/RenewModal.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  components: {
    Navbar,
    Head,
    Main,
    Foot,
    Landing,
    StudentSignUp,
    LoginRegisterModal,
    UsernameModal,
    UpgradeModal,
    CancelModal,
    ChangePriceModal,
    RenewModal
  },
  data() {
    return {};
  },
  // ...
  computed: {
    ...mapGetters({
      loggedIn: 'loggedIn'
    })
  },
  mounted() {}
};
</script>

<style scoped>
body > div {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
#app {
  flex-grow: 1;
  background-color: #f8f8f8;
}
.margin-nav {
  padding-top: 25px;
  /* margin-bottom: 60px; */
}
.spread {
  /*min-height: 100vh;*/
}
.stretch-50 {
  height: 50%;
  width: 50%;
}
@media screen and (max-width: 768px) {
  body {
    padding-top: 0px;
  }
}
</style>
