<template>
  <div class="login d-flex justify-content-center align-items-center flex-column">
    <div class="login--image mb-5">
      <img src="../../assets/img/apple-touch-icon.png" alt="login" />
    </div>
    <div class="login--form-container d-flex justify-content-center align-items-center w-100 px-2">
      <div class="login--form w-100">
        <form-component @submit="emailLogin" :disabled="disabled">
          <text-field-component
            placeholder="Email"
            :value.sync="Login.Email"
            rules="email|required"
          />
          <text-field-component
            type="password"
            placeholder="Password"
            :value.sync="Login.Password"
            rules="required|min:8|max:36"
          />
          <div class="text-right mb-5" style="margin-top: -20px">
            <a @click.prevent="$emit('reset-pass')">Forgot Your Password?</a>
          </div>
          <p class="text-danger font-weight-bold">{{ LoginError }}</p>
          <template v-slot:submit>Sign In</template>
        </form-component>
      </div>
    </div>
    <div class="w-100 text-center">
      New here?
      <a @click.prevent="$emit('signup')">Sign Up</a>
    </div>
    <div class="login--other w-100 mt-5">
      <p class="login--or d-flex align-items-center">or sign in using</p>
      <social-media-login @username="$emit('username')" />
    </div>
  </div>
</template>

<script>
import sha256 from 'sha256';
import helperFunctions from './../../store/helperFunctions';
import SocialMediaLogin from './SocialMediaLogin';

export default {
  name: 'login',
  components: {
    SocialMediaLogin,
  },
  data: () => ({
    disabled: false,
    LoginError: '',
    Login: {
      Email: null,
      Password: null,
    },
  }),
  methods: {
    emailLogin() {
      this.disabled = true;
      this.LoginError = '';
      helperFunctions
        .loginPassword(this.$store.state, this.Login)
        .then(() => {
          this.$modal.hide('login');
          this.$router.push({ name: 'AllProblems' })
        })
        .catch((e) => {
          this.disabled = false;
          if (e.code === 'auth/user-not-found') {
            this.LoginError = 'No account found with this email.';
          } else if (e.code === 'auth/wrong-password') {
            this.LoginError = 'Password is incorrect.';
          } else {
            this.LoginError = e.message;
          }
        });
    },
  },
};
</script>

<style scoped>
a {
  color: rgb(21, 156, 228) !important;
  cursor: pointer;
}
.login--image img {
  max-width: 100%;
  height: 80px;
}
.login--other .login--or {
  flex-basis: 100%;
  color: rgba(0, 0, 0, 0.6);
  font-size: 1.2em;
}
.login--other .login--or:before,
.login--other .login--or:after {
  content: '';
  flex-grow: 1;
  background: rgba(0, 0, 0, 0.3);
  height: 1px;
  margin: 5px 8px 0px;
}
</style>