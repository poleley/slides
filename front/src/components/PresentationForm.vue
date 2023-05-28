<script setup>
import UiSelect from "@/components/UI/UiSelect.vue";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  topicOptions: {
    type: Array,
    required: true
  },
  maxTitleLength: {
    type: Number,
    required: true
  },
  checked2: {
    type: Boolean,
    default: true,
  },
  checked1: {
    type: Boolean,
    default: false
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})
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
              class="form-control title"
              id="title"
              v-model="modelValue.title.value"
              @blur="modelValue.title.blur"
              :class="{'is-invalid': !modelValue.title.valid && modelValue.title.touched}"
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
              @blur="modelValue.topic.blur"
              v-model="modelValue.topic"
              :options="topicOptions"
              :class="{'is-invalid': !modelValue.topic.valid && modelValue.topic.touched}"
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
                v-model="modelValue.privacy.value"
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
                :checked="checked1"
                class="form-check-input"
                v-model="modelValue.privacy.value"
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