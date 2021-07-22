<template>
  <div class="signup d-flex justify-content-center align-items-center flex-column">
    <div class="signup--image mb-5">
      <img src="../../assets/img/apple-touch-icon.png" alt="signup" />
    </div>
    <div class="signup--form-container d-flex justify-content-center align-items-center w-100 px-2">
      <div class="signup--form w-100">
        <form-component @submit="emailSignup" :disabled="disabled">
          <text-field-component
            placeholder="Username"
            :value.sync="Signup.Username"
            rules="required|username|min:3|max:30"
          />
          <text-field-component
            placeholder="Email"
            :value.sync="Signup.Email"
            rules="email|required"
          />
          <text-field-component
            type="password"
            placeholder="Password"
            :value.sync="Signup.Password"
            rules="required|min:8|max:36"
            vid="Password"
          />
          <text-field-component
            type="password"
            placeholder="Confirm Password"
            :value.sync="Signup.ConfirmPassword"
            rules="confirmed:Password"
          />
          <p class="text-danger font-weight-bold">{{ SignupError }}</p>
          <template v-slot:submit>Sign Up</template>
        </form-component>
      </div>
    </div>
    <div class="signup--options w-100">
      <div class="text-center">
        Already a member?
        <a @click.prevent="$emit('login')">Sign In</a>
      </div>
    </div>
    <div class="signup--other w-100 mt-5">
      <p class="signup--or d-flex align-items-center">or sign up using</p>
      <social-media-login @username="$emit('username')" />
    </div>
    <div>
      <b-modal id="confirm" v-model="modalShow" ok-only hide-header hide-footer>
        <div class="px-2 py-5 text-center">
          Registered successfully please check your email to verify your email
        </div>
        <div class="d-flex justify-content-end">
          <b-button @click="hideModal()" class="btn-confirm">OK</b-button>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import sha256 from 'sha256';
import helperFunctions from '../../store/helperFunctions';
import SocialMediaLogin from './SocialMediaLogin';

export default {
  name: 'signup',
  components: {
    SocialMediaLogin,
  },
  data: () => ({
    modalShow: false,
    savingSuccessful: false,
    disabled: false,
    SignupError: '',
    IsUsernameUnique: 'yes',
    Signup: {
      Username: null,
      Email: null,
      Password: null,
      ConfirmPassword: null,
    },
  }),
  methods: {
    emailSignup() {
      this.disabled = true;
      this.SignupError = '';
      helperFunctions
        .checkUniqueUsername(this.Signup.Username)
        .then(() => {
          helperFunctions
            .signUpPassword(this.$store.state, this.Signup)
            .then(() => {
              this.modalShow = true;
              // this.$modal.hide('signup');
              // this.$emit('login');
            })
            .catch((e) => {
              this.disabled = false;
              if (e.code === 'auth/email-already-in-use') {
                this.SignupError = 'Email is not available!';
              } else {
                this.SignupError = e.message;
              }
            });
        })
        .catch(() => {
          this.disabled = false;
          this.SignupError = 'Username is not available!';
        })
    },
    googleSignup() {
      let signup = {};
      signup.emailSignUp = false;
      signup.google = true;
      this.$store.dispatch('signUp', signup);
    },
    hideModal() {
      this.$bvModal.hide('confirm');
      this.$emit('login');
    }
  },
};
</script>

<style scoped>
a {
  color: rgb(21, 156, 228) !important;
  cursor: pointer;
}
.signup--image img {
  max-width: 100%;
  height: 80px;
}
.signup--other .signup--or {
  flex-basis: 100%;
  color: rgba(0, 0, 0, 0.6);
  font-size: 1.2em;
}
.signup--other .signup--or:before,
.signup--other .signup--or:after {
  content: '';
  flex-grow: 1;
  background: rgba(0, 0, 0, 0.3);
  height: 1px;
  margin: 5px 8px 0px;
}
.btn-confirm{
  background-color: #3C7299 !important;
  color: #ffffff;
}
</style>
