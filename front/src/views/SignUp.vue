<script setup lang="ts">
import { useForm } from "../use/form";
import { useUserStore } from "../stores";
import UiToast from "../components/UI/UiToast.vue";
import router from "../routers/router";
import { reactive, ref, watch } from "vue";

const passLength: number = 8;
const EMAIL_REGEXP =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

function required(v: string) {
  return !!v;
}

function minLength(num: number) {
  return (v: string) => v.length >= num;
}

function isEmail(v: string) {
  return EMAIL_REGEXP.test(v);
}

const userStore = useUserStore();

const form = reactive(useForm(
  {
    firstName: {
      validators: { required },
    },
    lastName: {
      validators: { required },
    },
    email: {
      validators: { required, isEmail },
    },
    username: {
      validators: { required },
    },
    password: {
      validators: { required, minLength: minLength(passLength) },
    },
    passwordConfirm: {
      validators: { required, minLength: minLength(passLength) },
    },
  }
));

const isEqual = () => {
  const isValid = form.password.value === form.passwordConfirm.value;
  form.passwordConfirm.errors["isEqual"] = !isValid;
  form.passwordConfirm.valid &&= isValid;
};

watch([() => form["password"].value, () => form["passwordConfirm"].value], () => {
  isEqual()
});

const isShowToast = ref<boolean>(false);

function hideToast() {
  isShowToast.value = false;
}

async function submit() {
  if (form.valid) {
    await userStore.signUp(
      form.email.value,
      form.username.value,
      form.password.value,
      form.firstName.value,
      form.lastName.value,
    );
  }
  if (userStore.error === null) await router.replace({ name: "library" });
  else {
    isShowToast.value = true;
    setTimeout(hideToast, 3000);
  }
}
</script>

<template>
  <ui-toast :show="isShowToast">
    <template #header>Уведомление</template>
    <template #body>{{ userStore.error }}</template>
  </ui-toast>
  <div class="registration-outer">
    <div class="registration-inner">
      <h2 class="registration-title fw-bold">Регистрация</h2>
      <form @submit.prevent="submit">
        <div class="input-item">
          <input
            v-model="form.firstName.value"
            type="text"
            placeholder="Имя"
            class="form-control"
            :class="{ 'is-invalid': !form.firstName.valid && form.firstName.touched }"
            @blur="form.firstName.blur"
          />
          <div class="invalid-feedback">Заполните это поле</div>
        </div>

        <div class="input-item">
          <input
            v-model="form.lastName.value"
            type="text"
            placeholder="Фамилия"
            class="form-control"
            :class="{ 'is-invalid': !form.lastName.valid && form.lastName.touched }"
            @blur="form.lastName.blur"
          />
          <div class="invalid-feedback">Заполните это поле</div>
        </div>

        <div class="input-item">
          <input
            v-model="form.email.value"
            type="email"
            placeholder="Электронная почта"
            class="form-control"
            :class="{ 'is-invalid': !form.email.valid && form.email.touched }"
            @blur="form.email.blur"
          />
          <template v-if="form.email.errors.isEmail">
            <div class="invalid-feedback">Введите корректную электронную почту</div>
          </template>
          <template v-else-if="form.email.errors.required">
            <div class="invalid-feedback">Заполните это поле</div>
          </template>
        </div>

        <div class="input-item">
          <input
            v-model="form.username.value"
            type="text"
            placeholder="Никнейм"
            class="form-control"
            :class="{ 'is-invalid': !form.username.valid && form.username.touched }"
            @blur="form.username.blur"
          />
          <div class="invalid-feedback">Заполните это поле</div>
        </div>

        <div class="input-item">
          <input
            v-model="form.password.value"
            type="password"
            placeholder="Пароль"
            class="form-control"
            :class="{ 'is-invalid': !form.password.valid && form.password.touched }"
            @blur="form.password.blur"
          />
          <div class="invalid-feedback">
            <template v-if="form.password.errors.minLength">
              <div>Длина пароля дожна быть больше {{ passLength }} символов</div>
            </template>
            <template v-if="form.password.errors.required">
              <div>Заполните это поле</div>
            </template>
          </div>
        </div>

        <div class="input-item">
          <input
            v-model="form.passwordConfirm.value"
            type="password"
            placeholder="Подтвердите пароль"
            class="form-control"
            :class="{
              'is-invalid': !form.passwordConfirm.valid && form.passwordConfirm.touched,
            }"
            @blur="form.passwordConfirm.blur"
          />
          <div class="invalid-feedback">
            <template v-if="form.passwordConfirm.errors.isEqual">
              <div>Пароли не совпадают</div>
            </template>
            <template v-if="form.passwordConfirm.errors.minLength">
              <div>Длина пароля дожна быть больше {{ passLength }} символов</div>
            </template>
            <template v-if="form.passwordConfirm.errors.required">
              <div>Заполните это поле</div>
            </template>
          </div>
        </div>
        <button type="submit" class="btn btn-primary w-100" :disabled="!form.valid">
          Зарегистрироваться
        </button>
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
