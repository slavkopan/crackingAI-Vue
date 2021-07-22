<template>
  <ValidationObserver v-slot="{invalid}">
    <form @submit.prevent="$emit('submit')">
      <slot />
      <button-component class="mb-5" block :disabled="disabled || invalid" type="submit">
        <slot name="submit" />
      </button-component>
    </form>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver } from 'vee-validate';
export default {
  name: 'form-component',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ValidationObserver
  }
};
</script>