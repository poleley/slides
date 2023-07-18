<script setup lang="ts">
import UiSelect from "../components/UI/UiSelect.vue";
import { Form } from "../use/defaultForm";

export interface TopicOption {
  val: number,
  text: string
}

defineProps<{
  modelValue: Form,
  topicOptions: TopicOption[],
  maxTitleLength: number,
  checked2: boolean,
  checked1: boolean,
  isEdit: boolean
}>()

defineEmits(['update:modelValue', 'updateSelect'])
</script>

<template>
  <div class="align-items-center mt-2">
    <div class="row">
      <div class="col col-12">
        <div class="w-100">
          <label for="title">
            Название*
          </label>
          <input
              id="title"
              :value="modelValue.title.value"
              class="form-control title"
              :class="{'is-invalid': !modelValue.title.valid && modelValue.title.touched}"
              @input="$emit('update:modelValue', $event.target.value, 'title')"
              @blur="modelValue.title.blur"
          >
          <div class="help-text">*Обязательно</div>
          <div class="invalid-feedback">
            <template v-if="modelValue.title.errors.required">
              Заполните это поле
            </template>
            <template v-else>
              Длина названия не может быть больше {{ maxTitleLength }} символов
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-2" :class="{'align-items-center': isEdit}">
      <div :class="{'col-6': !isEdit, 'col-4': isEdit}">
        <div class="w-100">
          <label for="topic">
            Тема презентации*
          </label>
          <ui-select
              id="topic"
              :value="modelValue.topic.value"
              :class="{'is-invalid': !modelValue.topic.valid && modelValue.topic.touched}"
              :options="topicOptions"
              @change="$emit('update:modelValue', $event.target.value, 'topic')"
              @blur="modelValue.topic.blur"
          >
            Выберите тему...
          </ui-select>
          <div class="help-text">*Обязательно</div>
          <div class="invalid-feedback">
            Выберите тему презентации
          </div>
        </div>
      </div>
      <div :class="{'col-6': !isEdit, 'col-5': isEdit}">
        Кто может просматривать эту презентацию?
        <div class="form-check">
          <label>
            Только я
            <input
                type="radio"
                name="privacy"
                value="2"
                class="form-check-input"
                :checked="checked2"
                @click="$emit('update:modelValue', $event.target.value, 'privacy')"
            >
          </label>
        </div>
        <div class="form-check">
          <label>
            Все
            <input
                type="radio"
                name="privacy"
                value="1"
                class="form-check-input"
                :checked="checked1"
                @click="$emit('update:modelValue', $event.target.value, 'privacy')"
            >
          </label>
        </div>
      </div>
      <slot>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.help-text {
  font-size: 12px;
}
</style>