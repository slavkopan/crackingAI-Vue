<template>
  <ValidationProvider :rules="rules" v-slot="{ errors }" :vid="vid">
    <div class="mb-5">
      <input
        class="input"
        :class="errors.length ? 'border-danger' : ''"
        :type="type"
        :placeholder="placeholder"
        :value="value"
        @input="$emit('update:value', $event.target.value)"
        v-on="$listeners"
      />
      <div class="text-danger mt-1" v-for="error in errors" :key="error">{{ error }}</div>
    </div>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate';
export default {
  name: 'text-field-component',
  components: {
    ValidationProvider
  },
  props: {
    value: {
      default: null
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: String,
    rules: String,
    vid: String
  }
};
</script>

<style scoped>
.input {
  transition: all 0.2s ease-in-out;
  border: 1px solid rgb(200, 200, 200);
  border-radius: 3px;
  padding: 10px;
  outline: none;
  width: 100%;
}
.input:hover,
.input:focus {
  border-color: rgb(21, 156, 228);
}
.input:focus {
  box-shadow: 0 0 0 2.8px rgba(21, 156, 228, 0.4);
}
.input.border-danger:focus {
  box-shadow: 0 0 0 2.8px rgba(255, 73, 84, 0.3);
}
.input::placeholder {
  color: rgb(180, 180, 180);
}
</style>