import { extend } from 'vee-validate';
import { required, email, max, min, confirmed } from 'vee-validate/dist/rules';

extend('email', {
  ...email,
  message: 'Email is not valid!'
});

extend('required', {
  ...required,
  message: 'This field is required!'
});

extend('max', {
  ...max,
  message: 'This field must not be greater than {length} characters!'
});

extend('min', {
  ...min,
  message: 'This field must be at least {length} characters!'
});

extend('confirmed', {
  ...confirmed,
  message: "{target} confirmation doesn't match!"
});

extend('username', {
  validate: value =>
    new RegExp(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,100}$/).test(value),
  message: 'Username must not contain any special characters!'
});
