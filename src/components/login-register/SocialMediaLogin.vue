<template>
  <div>
    <div class="d-flex justify-content-center">
      <button-component class="mr-3" background="#d83426" @click="googleLogin">
        <i class="fa fa-google"></i> Google
      </button-component>
      <button-component background="#446bbf" @click="facebookLogin">
        <i class="fa fa-facebook-square"></i> Facebook
      </button-component>
    </div>
    <p class="text-danger font-weight-bold text-center mt-3">{{ LoginError }}</p>
  </div>
</template>

<script>
import helperFunctions from '../../store/helperFunctions';

export default {
  name: 'social-media-login',
  data: () => ({
    LoginError: ''
  }),
  methods: {
    googleLogin() {
      this.LoginError = '';
      helperFunctions
        .googleSignIn()
        .then(() => {
          this.createUserAccount();
          location.reload();
        })
        .catch(e => {
          this.LoginError = 'Something went wrong! Please try again later.';
        });
    },
    facebookLogin() {
      this.LoginError = '';
      helperFunctions
        .facebookSignIn()
        .then(() => {
          this.createUserAccount();
        })
        .catch(e => {
          this.LoginError = 'Something went wrong! Please try again later.';
        });
        location.reload()
    },
    createUserAccount() {
      helperFunctions
        .checkUserStatus()
        .then(res => {
          if (res === 'signup') {
            this.$emit('username');
          }
        })
        .catch(e => {
          this.LoginError = e.message;
        });
        location.reload()
    }
  }
};
</script>