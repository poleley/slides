import { reactive, ref, watch } from "vue";
import { type RefValue } from "vue/macros";

interface Field {
  [key: string]: any;
}

export function useField(field: Field) {
  const valid = ref<boolean>(true);
  const value = ref<RefValue<string>>(field.value);
  const touched = ref<boolean>(false);
  const errors = reactive<Field>({});

  const reassign = () => {
    valid.value = true;
    Object.keys(field.validators ?? {}).map((name) => {
      const isValid = field.validators[name](value.value);
      errors[name] = !isValid;
      if (!isValid) valid.value = false;
    });
  };

  watch(value, reassign);
  reassign();

  return {
    value,
    valid,
    errors,
    validate: reassign,
    touched,
    blur: () => (touched.value = true),
  };
}
