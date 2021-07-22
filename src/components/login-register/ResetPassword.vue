<template>
  <div class="d-flex flex-column">
    <h1 class="text-center">Reset Password</h1>
    <div class="d-flex justify-content-center align-items-center w-100 px-2">
      <form-component @submit="resetPassword" class="w-100">
        <text-field-component
          placeholder="Email"
          :value.sync="ResetPassword.Email"
          rules="email|required"
        />
        <template v-slot:submit>Reset</template>
      </form-component>
    </div>
    <div class="w-100">
      <div class="text-center">
        Go back to
        <a @click.prevent="$emit('login')">Sign In</a>
      </div>
    </div>
    <div>
      <b-modal id="confirm" ref="reset-success-modal" ok-only hide-header hide-footer>
        <div class="px-2 py-5 text-center">
          An email has been sent to <b>{{ResetPassword.Email}}</b> to reset your password
        </div>
        <div class="d-flex justify-content-end">
          <b-button @click="onModalClose()" class="btn-confirm">OK</b-button>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import UserService from '../../services/userService.js'
export default {
  name: 'reset-password',
  data: () => ({
    ResetPassword: {
      Email: null
    }
  }),
  methods: {
    resetPassword() {
      //this.$emit('login');
      // console.log(this.ResetPassword.Email);
      UserService.passwordReset(this.ResetPassword.Email, (isEmailSent) => {
        this.$refs['reset-success-modal'].show();
      })
    },
    onModalClose() {
      this.$emit('login');
    }
  }
};
</script>

<style scoped>
a {
  color: rgb(21, 156, 228) !important;
  cursor: pointer;
}
</style>
