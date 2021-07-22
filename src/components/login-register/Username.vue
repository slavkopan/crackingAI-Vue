<template>
  <div class="d-flex flex-column">
    <h1 class="text-center">Enter Username</h1>
    <div class="d-flex justify-content-center align-items-center w-100 px-2">
      <form-component @submit="completeSignup" class="w-100">
        <p class="text-info">Seems you are new here. Let's register your username.</p>
        <text-field-component
          placeholder="Username"
          :value.sync="Username"
          rules="required|username|min:3|max:30"
        />
        <p class="text-danger font-weight-bold">{{ UsernameError }}</p>
        <template v-slot:submit>Complete Signup</template>
      </form-component>
    </div>
  </div>
</template>

<script>
import helperFunctions from '../../store/helperFunctions';

export default {
  name: 'username',
  data: () => ({
    Username: null,
    UsernameError: ''
  }),
  methods: {
    completeSignup() {
      this.UsernameError = '';
      helperFunctions
        .checkUniqueUsername(this.Username)
        .then(() => {
          helperFunctions
            .setUser(this.$store.state, { Username: this.Username })
            .then(() => {
              helperFunctions.checkUserStatus().then(() => {
                this.$router.push({ name: 'AllProblems' });
                this.$emit('close');
              });
            });
        })
        .catch(() => {
          this.UsernameError = 'Username is not available!';
        });
    }
  }
};
</script>
