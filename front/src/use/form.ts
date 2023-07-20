import { computed } from "vue";
import { useField } from "./field.js";

// Вспомогательные функции -- в TypeScript не совсем идеально определены типы функций
// Object.entries, Object.fromEntries и т.д.

function entries<K extends string, V>(rec: Record<K, V>) {
  return Object.entries(rec) as [K, V][];
}

function fromEntries<K extends string, V>(ents: [K, V][]) {
  return Object.fromEntries(ents) as Record<K, V>;
}

function values<K extends string, V>(rec: Record<K, V>) {
  return Object.values(rec) as V[];
}

type UseFieldArgs = Parameters<typeof useField>[0];

export function useForm<K extends string>(fieldsInit: Record<K, UseFieldArgs>) {
  const fields = fromEntries(entries(fieldsInit).map(([k, v]) => [k, useField(v)]));
  const valid = computed(() => values(fields).every((v) => v.valid.value));

  return { ...fields, valid };
}
