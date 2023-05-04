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
  maxTagLength: {
    type: Number,
    required: true
  },
  checked3: {
    type: Boolean,
    default: true
  },
  checked2: {
    type: Boolean,
    default: false,
  },
  checked1: {
    type: Boolean,
    default: false
  },
})
</script>

<template>
  <div class="align-items-center mt-2">
    <div class="row">
      <div class="col-6">
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
      <div class="col-6">
        Кто может просматривать эту презентацию?
        <div class="form-check">
          <label>
            Только я
            <input
                type="radio"
                name="privacy"
                value="3"
                class="form-check-input"
                :checked="checked3"
                v-model="modelValue.privacy.value"
            >
          </label>
        </div>
        <div class="form-check">
          <label>
            Только те, у кого есть ссылка
            <input
                type="radio"
                name="privacy"
                value="2"
                :checked="checked2"
                class="form-check-input"
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
    </div>
    <div class="row mt-2">
      <div class="col-6">
        <div class="w-100">
          <label for="tags">Теги</label>
          <input
              v-model="modelValue.tags.value"
              class="form-control"
              id="tags"
              @blur="modelValue.tags.blur"
              :class="{'is-invalid': !modelValue.tags.valid && modelValue.tags.touched}"
          >
          <div class="invalid-feedback">
            Длина одного тега не может быть больше {{ maxTagLength }} символов
          </div>
        </div>
      </div>
      <div class="col-6">
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
    </div>
  </div>
</template>

<style scoped>
.help-text {
  font-size: 12px;
}
</style>