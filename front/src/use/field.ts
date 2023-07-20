import { ref, watch } from "vue";

export function useField(fieldInit: {
  value?: string;
  validators: Record<string, (value: string) => boolean>;
}) {
  const valid = ref(true);
  const value = ref(fieldInit.value ?? "");
  const touched = ref(false);
  const errors = ref<Record<string, boolean>>({});

  const validate = () => {
    valid.value = true;

    for (const [name, validator] of Object.entries(fieldInit.validators)) {
      const isValid = validator(value.value);
      errors.value[name] = !isValid;
      if (!isValid) valid.value = false;
    }
  };

  watch(value, validate, { immediate: true });

  return {
    value,
    valid,
    errors,
    validate,
    touched,
    blur: () => (touched.value = true),
  };
}
