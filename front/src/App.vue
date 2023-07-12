<script setup>
import {useUserStore} from "@/stores";
import {useRouter} from "vue-router";

const userStore = useUserStore();
const router = useRouter()

</script>

<template>
  <nav v-if="router.currentRoute.value.name !== 'embed'" class="navbar navbar-expand-lg navbar-dark">
    <div class="container-fluid">
      <button
          class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="navbarNav" class="collapse navbar-collapse justify-content-between">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/">Галерея презентаций</a>
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
              <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                 aria-expanded="false">
                {{ userStore.user.lastName }} {{ userStore.user.firstName }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="/library">Моя коллекция</a></li>
                <li><a class="dropdown-item" href="/favorite">Избранное</a></li>
                <li><a class="dropdown-item" href="/upload">Загрузить презентацию</a></li>
                <li>
                  <hr class="dropdown-divider">
                </li>
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
  <footer v-if="router.currentRoute.value.name !== 'embed'" class="footer">
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

</style>
