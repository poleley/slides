<script setup>

import UiButton from "@/components/UI/UiButton.vue";

import {useForm} from "@/use/form";
import {useUserStore} from "@/stores";

const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

const required = v => !!v
const isEmail = v => EMAIL_REGEXP.test(v)

const userStore = useUserStore();

const {form} = useForm({
  email: {
    value: '',
    validators: {required, isEmail}
  },
  password: {
    value: '',
    validators: {required}
  },
}, {}, true)

function submit() {
  if (form.valid) {
    userStore.logIn(
        form.email.value,
        form.password.value,
    )
  }
}

</script>

<template>
  <div class="registration-outer">
    <div class="registration-inner">
      <h2 class="registration-title fw-bold">Войти</h2>
      <form @submit.prevent="submit">

        <div class="input-item">
          <input
              v-model="form.email.value"
              type="text"
              placeholder="Электронная почта"
              class="form-control"
              :class="{'is-invalid': !form.email.valid && form.email.touched}"
              @blur="form.email.blur"
          />
          <template v-if="form.email.errors.isEmail">
            <div class="invalid-feedback">
              Введите корректную электронную почту
            </div>
          </template>
          <template v-else-if="form.email.errors.required">
            <div class="invalid-feedback">
              Заполните это поле
            </div>
          </template>
        </div>

        <div class="input-item">
          <input
              v-model="form.password.value"
              type="password"
              placeholder="Пароль"
              class="form-control"
              :class="{'is-invalid': !form.password.valid && form.password.touched}"
              @blur="form.password.blur"
          />
          <div class="invalid-feedback">
            <template v-if="form.password.errors.required">
              <div>
                Заполните это поле
              </div>
            </template>
          </div>
        </div>

        <ui-button
            type="submit"
            class="button-submit"
            :disabled="!form.valid"
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