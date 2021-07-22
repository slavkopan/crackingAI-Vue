<template>
  <button
    :class="block ? 'w-100' : ''"
    :style="`background: ${background};`"
    class="button"
    :disabled="disabled"
    :type="type"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script>
import { ValidationProvider } from 'vee-validate';
export default {
  name: 'text-field-component',
  components: {
    ValidationProvider
  },
  props: {
    block: {
      type: Boolean,
      default: false
    },
    background: {
      type: String,
      default: 'rgb(21, 156, 228)'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: String
  }
};
</script>

<style scoped>
.button {
  transition: all 0.2s ease-in-out;
  padding: 10px;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: bold;
}
.button:not(:disabled):hover {
  background: rgb(14, 130, 192);
}
.button:disabled {
  background: rgba(0, 0, 0, 0.12) !important;
  pointer-events: none;
  user-select: none;
  color: rgba(0, 0, 0, 0.26);
}
.button:focus {
  box-shadow: 0 0 0 2.8px rgba(21, 156, 228, 0.4);
  background: rgb(14, 130, 192);
}
</style>