import { computed, reactive } from "vue";
import { useField } from "./field";
import { type Field } from "./signUpForm.js";

export interface logInForm {
  email: Field;
  password: Field;
  valid: boolean;
}

export function useForm(init: logInForm): logInForm {
  const form: logInForm = reactive<logInForm>(<logInForm>{
    valid: computed(() => {
      return Object.keys(form)
        .filter((k) => k !== "valid")
        .reduce((acc, key) => {
          acc = form[key].valid;
          return acc;
        }, true);
    }),
  });

  for (const [key, val] of Object.entries(init)) {
    form[key] = useField(val);
  }

  return form;
}
