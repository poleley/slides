<script setup>

import UiButton from "@/components/UI/UiButton.vue";

import {useForm} from "@/use/form";
import {useUserStore} from "@/stores";
import router from "@/routers/router";
import {ref} from "vue";
import UiToast from "@/components/UI/UiToast.vue";

const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

const required = v => !!v
const isEmail = v => EMAIL_REGEXP.test(v)

const userStore = useUserStore();

const {formQuestion} = useForm({
  email: {
    value: '',
    validators: {required, isEmail}
  },
  password: {
    value: '',
    validators: {required}
  },
}, {}, true)

const isShowToast = ref(false)

function hideToast() {
  isShowToast.value = false
}

async function submit() {
  if (formQuestion.valid) {
    await userStore.logIn(
        formQuestion.email.value,
        formQuestion.password.value,
    )
    if (userStore.error === null)
      await router.replace({name: 'library'})
    else {
      isShowToast.value = true
      setTimeout(hideToast, 3000)
    }
  }
}

</script>

<template>
  <ui-toast :show="isShowToast">
    <template v-slot:header>Уведомление</template>
    <template v-slot:body>{{ userStore.error }}</template>
  </ui-toast>
  <div class="registration-outer">
    <div class="registration-inner">
      <h2 class="registration-title fw-bold">Войти</h2>
      <form @submit.prevent="submit">
        <div class="input-item">
          <input
              v-model="formQuestion.email.value"
              type="text"
              placeholder="Электронная почта"
              class="form-control"
              :class="{'is-invalid': !formQuestion.email.valid && formQuestion.email.touched}"
              @blur="formQuestion.email.blur"
          />
          <template v-if="formQuestion.email.errors.isEmail">
            <div class="invalid-feedback">
              Введите корректную электронную почту
            </div>
          </template>
          <template v-else-if="formQuestion.email.errors.required">
            <div class="invalid-feedback">
              Заполните это поле
            </div>
          </template>
        </div>

        <div class="input-item">
          <input
              v-model="formQuestion.password.value"
              type="password"
              placeholder="Пароль"
              class="form-control"
              :class="{'is-invalid': !formQuestion.password.valid && formQuestion.password.touched}"
              @blur="formQuestion.password.blur"
          />
          <div class="invalid-feedback">
            <template v-if="formQuestion.password.errors.required">
              <div>
                Заполните это поле
              </div>
            </template>
          </div>
        </div>

        <ui-button
            type="submit"
            class="button-submit"
            :disabled="!formQuestion.valid"
        >
          Войти
        </ui-button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.input-item {
  margin: 1rem 0;
}

form button {
  width: 100%;
}

.registration-outer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.registration-inner {
  width: 30%;
}

.registration-title {
  color: #564425;
}
</style>