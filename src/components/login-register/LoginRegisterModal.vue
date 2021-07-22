<template>
  <modal
    name="login"
    height="auto"
    width="400"
    :clickToClose="false"
    :scrollable="true"
    @before-open="beforeOpen"
  >
    <div class="card-body">
      <div class="text-danger text-right">
        <i class="fa fa-times cursor-pointer" @click="hideModal" />
      </div>
      <div
        class="d-flex justify-content-center align-items-center"
        v-if="auto_prompt && show_reason != ''"
      >
        <h6>Please sign up or login before you can {{show_reason}}.</h6>
      </div>
      <div v-if="signUp">
        <Signup @login="signUp = forgotPassword = false" @username="username = true" />
      </div>

      <div v-else-if="username">
        <username @close="hideModal" />
      </div>

      <div v-else-if="!signUp && !forgotPassword">
        <login
          @signup="signUp = true;"
          @reset-pass="forgotPassword = true"
          @username="username = true"
        />
      </div>

      <div v-else-if="!signUp && forgotPassword">
        <reset-password @login="signUp = forgotPassword = false" />
      </div>
    </div>
  </modal>
</template>

<script>
import Login from './Login';
import Signup from './Signup';
import ResetPassword from './ResetPassword';
import Username from './Username';

export default {
  name: 'LoginRegisterModal',
  components: {
    Login,
    Signup,
    ResetPassword,
    Username
  },
  data() {
    return {
      signUp: false,
      forgotPassword: false,
      username: false,
      show_reason: '',
      auto_prompt: false
    };
  },
  methods: {
    beforeOpen(event) {
      this.show_reason = event.params.show_reason;
      this.auto_prompt = event.params.auto_prompt;
    },
    hideModal() {
      this.$modal.hide('login');
      this.signUp = this.forgotPassword = this.username = false;
    }
  }
};
</script>
