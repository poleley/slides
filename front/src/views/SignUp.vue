<script setup>

import UiButton from "@/components/UI/UiButton.vue";

import {useForm} from "@/use/form";
import {useUserStore} from "@/stores";
import UiToast from "@/components/UI/UiToast.vue";
import router from "@/routers/router";
import {ref} from "vue";


const passLength = 8
const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

const required = v => !!v
const minLength = num => v => v.length >= num

const isEmail = v => EMAIL_REGEXP.test(v)

const isEqual = (firstField, secondField, validatedField) => (form) => {
  const isValid = form[secondField].value === form[firstField].value
  form[validatedField].errors["isEqual"] = !isValid
  form[validatedField].validate()
  form[validatedField].valid &&= isValid
}

const userStore = useUserStore();

const {formQuestion} = useForm({
  firstName: {
    value: '',
    validators: {required}
  },
  lastName: {
    value: '',
    validators: {required}
  },
  email: {
    value: '',
    validators: {required, isEmail}
  },
  username: {
    value: '',
    validators: {required}
  },
  password: {
    value: '',
    validators: {required, minLength: minLength(passLength)}
  },
  passwordConfirm: {
    value: '',
    validators: {required, minLength: minLength(passLength)}
  },
}, {
  validators: [isEqual('password', 'passwordConfirm', 'passwordConfirm')]
})

const isShowToast = ref(false)

function hideToast() {
  isShowToast.value = false
}

async function submit() {
  if (formQuestion.valid) {
    await userStore.signUp(
        formQuestion.email.value,
        formQuestion.username.value,
        formQuestion.password.value,
        formQuestion.firstName.value,
        formQuestion.lastName.value,
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
      <h2 class="registration-title fw-bold">Регистрация</h2>
      <form @submit.prevent="submit">
        <div class="input-item">
          <input
              v-model="formQuestion.firstName.value"
              type="text"
              placeholder="Имя"
              class="form-control"
              :class="{'is-invalid': !formQuestion.firstName.valid && formQuestion.firstName.touched}"
              @blur="formQuestion.firstName.blur"
          />
          <div class="invalid-feedback">
            Заполните это поле
          </div>
        </div>

        <div class="input-item">
          <input
              v-model="formQuestion.lastName.value"
              type="text"
              placeholder="Фамилия"
              class="form-control"
              :class="{'is-invalid': !formQuestion.lastName.valid && formQuestion.lastName.touched}"
              @blur="formQuestion.lastName.blur"
          />
          <div class="invalid-feedback">
            Заполните это поле
          </div>
        </div>

        <div class="input-item">
          <input
              v-model="formQuestion.email.value"
              type="email"
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
              v-model="formQuestion.username.value"
              type="text"
              placeholder="Никнейм"
              class="form-control"
              :class="{'is-invalid': !formQuestion.username.valid && formQuestion.username.touched}"
              @blur="formQuestion.username.blur"
          />
          <div class="invalid-feedback">
            Заполните это поле
          </div>
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
            <template v-if="formQuestion.password.errors.minLength">
              <div>
                Длина пароля дожна быть больше {{ passLength }} символов
              </div>
            </template>
            <template v-if="formQuestion.password.errors.required">
              <div>
                Заполните это поле
              </div>
            </template>
          </div>
        </div>

        <div class="input-item">
          <input
              v-model="formQuestion.passwordConfirm.value"
              type="password"
              placeholder="Подтвердите пароль"
              class="form-control"
              :class="{'is-invalid': !formQuestion.passwordConfirm.valid && formQuestion.passwordConfirm.touched}"
              @blur="formQuestion.passwordConfirm.blur"
          />
          <div class="invalid-feedback">
            <template v-if="formQuestion.passwordConfirm.errors.isEqual">
              <div>
                Пароли не совпадают
              </div>
            </template>
            <template v-if="formQuestion.passwordConfirm.errors.minLength">
              <div>
                Длина пароля дожна быть больше {{ passLength }} символов
              </div>
            </template>
            <template v-if="formQuestion.passwordConfirm.errors.required">
              <div>
                Заполните это поле
              </div>
            </template>
          </div>
        </div>
        <ui-button
            type="submit"
            class="button-submit w-100"
            :disabled="!formQuestion.valid"
        >
          Зарегистрироваться
        </ui-button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.input-item {
  margin: 1rem 0;
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