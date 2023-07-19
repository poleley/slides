<script setup lang="ts">
import {defineProps, ref, watch} from 'vue'


defineProps({
  modelValue: {
    type: Object,
    default() {
      return {}
    }
  },
})

const emit = defineEmits(['update:modelValue'])
const fileName = ref<string>('')

const updateValue = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).files![0]);
  fileName.value = (e.target as HTMLInputElement).files![0].name;
};

watch(() => fileName.value, () => {
  if (fileName.value.length > 50)
    fileName.value = fileName.value.slice(0, 50) + '...'
})

</script>

<template>
  <div class="file-upload mb-2" :class="{'invalid': !modelValue.valid && modelValue.touched}">
    <div class="container-fluid">
      <div class="row">
        <template v-if="!modelValue.touched">
        <div class="col col-12">
          Нажмите здесь, чтобы загрузить файл
        </div>
        <div class="col col-12">
          или
        </div>
        <div class="col col-12">
          Перетащите его
        </div>
        </template>
        <template v-else>
          <div class="col col-12">
            <template v-if="modelValue.errors.isPdf">
              Расширение должно быть .pdf
            </template>
            <template v-else-if="modelValue.errors.maxSize">
              Размер файла не должен превышать 5 МБайт
            </template>
            <template v-else>
            {{ fileName }}
            </template>
          </div>
        </template>
      </div>
    </div>
    <input
        type="file"
        class="input-file"
        accept=".pdf"
        @input="updateValue"/>
  </div>
</template>

<style scoped>

.input-file {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  cursor: pointer;
  opacity: 0;
}

.file-upload {
  height: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  position: relative;
  max-width: 100%;
  border: 1px dashed #c9c9c9;
  transition: 0.2s;
  background-color: rgba(121, 95, 71, 0.14);
  text-align: center;
}

.invalid {
  border: 1px dashed red;
  color: red;
}

</style>