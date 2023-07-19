import { computed, reactive } from "vue";
import { useField } from "./field";
import { type Field } from "./signUpForm.js";

export interface PresentationForm {
  file?: FileField;
  title: Field;
  topic: Field;
  privacy: Field;
  valid: boolean;
}

export interface LeadForm {
  firstName: Field;
  lastName: Field;
  email: Field;
  valid: boolean;
}

interface FileField extends Field {
  value: object;
}

export function useLeadForm(init = {}): LeadForm {
  const form = reactive<LeadForm>(<LeadForm>{
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

export function usePresentationForm(init = {}): PresentationForm {
  const form = reactive<PresentationForm>(<PresentationForm>{
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
