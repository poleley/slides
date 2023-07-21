<script setup lang="ts">
import { useUserStore } from "../stores";
import router from "../routers/router";
import { reactive, ref } from "vue";
import UiToast from "../components/UI/UiToast.vue";
import { useForm } from "../use/form";

const EMAIL_REGEXP =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

function required(v: string) {
  return !!v;
}

function isEmail(v: string) {
  return EMAIL_REGEXP.test(v);
}

const userStore = useUserStore();

const form = reactive(useForm({
  email: {
    validators: { required, isEmail }
  },
  password: {
    validators: { required }
  }
}));

const isShowToast = ref(false);

function hideToast() {
  isShowToast.value = false;
}

async function submit() {
  if (form.valid) {
    await userStore.logIn(form.email.value, form.password.value);
    if (userStore.error === null) await router.replace({ name: "library" });
    else {
      isShowToast.value = true;
      setTimeout(hideToast, 3000);
    }
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
      <h2 class="registration-title fw-bold">Войти</h2>
      <form @submit.prevent="submit">
        <div class="input-item">
          <input
            v-model="form.email.value"
            type="text"
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
            v-model="form.password.value"
            type="password"
            placeholder="Пароль"
            class="form-control"
            :class="{ 'is-invalid': !form.password.valid && form.password.touched }"
            @blur="form.password.blur"
          />
          <div class="invalid-feedback">
            <template v-if="form.password.errors.required">
              <div>Заполните это поле</div>
            </template>
          </div>
        </div>

        <button type="submit" class="btn btn-primary" :disabled="!form.valid">
          Войти
        </button>
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
