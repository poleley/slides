<script setup>

import UiButton from "@/components/UI/UiButton.vue";

import {useForm} from "@/use/form";

const passLength = 8

const required = v => !!v
const minLength = num => v => v.length >= num

const isEqual = (firstField, secondField, validatedField) => (form) => {
  const isValid = form[secondField].value === form[firstField].value
  form[validatedField].errors["isEqual"] = !isValid
  form[validatedField].validate()
  form[validatedField].valid &&= isValid
}

const {form} = useForm({
  firstName: {
    value: '',
    validators: {required}
  },
  lastName: {
    value: '',
    validators: {required}
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
  }
}, {
  validators: [isEqual('password', 'passwordConfirm', 'passwordConfirm')]
})

function submit() {

}

</script>

<template>
  <div class="registration-outer">
    <div class="registration-inner">
      <h2 class="registration-title fw-bold">Регистрация</h2>
      <pre> {{form }}</pre>
      <form>
        <div class="input-item">
          <input
              v-model="form.firstName.value"
              type="text"
              placeholder="Имя"
              class="form-control"
              :class="{'is-invalid': !form.firstName.valid}"
          />
          <div class="invalid-feedback">
            Заполните это поле
          </div>
        </div>

        <div class="input-item">
          <input
              v-model="form.lastName.value"
              type="text"
              placeholder="Фамилия"
              class="form-control"
              :class="{'is-invalid': !form.lastName.valid}"
          />
          <div class="invalid-feedback">
            Заполните это поле
          </div>
        </div>

        <div class="input-item">
          <input
              v-model="form.username.value"
              type="text"
              placeholder="Имя пользователя"
              class="form-control"
              :class="{'is-invalid': !form.username.valid}"
          />
          <div class="invalid-feedback">
            Заполните это поле
          </div>
        </div>

        <div class="input-item">
          <input
              v-model="form.password.value"
              type="password"
              placeholder="Пароль"
              class="form-control"
              :class="{'is-invalid': !form.password.valid}"
          />
          <div class="invalid-feedback">
          <template v-if="form.password.errors.minLength">
            <div>
              Длина пароля дожна быть больше {{ passLength }} символов
            </div>
          </template>
          <template v-if="form.password.errors.required">
            <div>
              Заполните это поле
            </div>
          </template>
          </div>
        </div>

        <div class="input-item">
          <input
              v-model="form.passwordConfirm.value"
              type="password"
              placeholder="Подтвердите пароль"
              class="form-control"
              :class="{'is-invalid': !form.passwordConfirm.valid}"
          />
          <div class="invalid-feedback">
            <template v-if="form.passwordConfirm.errors.isEqual">
              <div>
                Пароли не совпадают
              </div>
            </template>
            <template v-if="form.passwordConfirm.errors.minLength">
              <div>
                Длина пароля дожна быть больше {{ passLength }} символов
              </div>
            </template>
            <template v-if="form.passwordConfirm.errors.required">
              <div>
                Заполните это поле
              </div>
            </template>
          </div>
        </div>
        <ui-button type="submit" class="button-submit">Зарегистрироваться</ui-button>
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