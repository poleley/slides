import { computed, reactive, watch } from "vue";
import { useField } from "./field";

export interface signUpForm {
  firstName: Field;
  lastName: Field;
  valid: boolean;
  username: Field;
  email: Field;
  password: Field;
  passwordConfirm: Field;
}

export interface Field {
  value: string;
  valid: boolean;
  touched: boolean;
  blur: boolean;
  errors: Errors;
}

export interface Errors {
  required: boolean;
  minLength?: boolean;
  isEmail?: boolean;
  isEqual?: boolean;
}

export function useForm(init = {}, config = {}): signUpForm {
  const form: signUpForm = reactive<signUpForm>({
    valid: computed(() => {
      return Object.keys(form)
        .filter((k) => k !== "valid")
        .reduce((acc, key) => {
          acc = form[key].valid;
          return acc;
        }, true);
    }),
  } as signUpForm);
  const { validators } = config;

  for (const [key, val] of Object.entries(init)) {
    form[key] = useField(val);
  }

  watch([() => form["password"].value, () => form["passwordConfirm"].value], () => {
    validators.forEach((validator) => {
      validator(form);
    });
  });

  return form;
}
