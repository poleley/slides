<script>

import MyInput from "@/components/UI/UIInput.vue";
import {defineComponent} from "vue";
import {useUserStore} from "@/stores";

export default defineComponent({
  name: 'app',
  components: {MyInput},
  setup() {
    const userStore = useUserStore();
    return {userStore}
  }
})

</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-between" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Галерея презентаций</a>
          </li>
        </ul>

        <div>
          <ul class="navbar-nav">
            <template v-if="!userStore.user">
              <li class="nav-item">
                <a class="nav-link" href="/signup">Регистрация</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/login">Войти</a>
              </li>
            </template>
            <li v-else class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ userStore.user.lastName }} {{ userStore.user.firstName }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="#">Моя коллекция</a></li>
                <li><a class="dropdown-item" href="#">Загрузить презентацию</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" @click="userStore.logOut()">Выйти</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
  <div class="content">
    <router-view></router-view>
  </div>
  <footer class="footer">
    <p class="p-2"></p>
  </footer>
</template>

<style scoped>
.navbar, .footer {
  background-color: #81673e !important;
}

.content {
  display: flex;
  flex: 1 0 auto;
}

.footer {
  font-size: 20px;
  flex: 0 0 auto;
}

/*.dropdown-menu {*/
/*  left: -600% !important;*/
/*}*/

</style>
