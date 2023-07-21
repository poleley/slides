<script setup lang="ts">
import { useUserStore } from "./stores";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();
</script>

<template>
  <nav
    v-if="router.currentRoute.value.name !== 'embed'"
    class="navbar navbar-expand-lg navbar-dark bg-primary"
  >
    <div class="container-fluid">
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="navbarNav" class="collapse navbar-collapse justify-content-between">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link
              class="nav-link active"
              aria-current="page"
              :to="{ name: 'all-presentations' }"
            >
              Галерея презентаций
            </router-link>
          </li>
        </ul>

        <div>
          <ul class="navbar-nav">
            <template v-if="!userStore.user">
              <li class="nav-item">
                <router-link class="nav-link" :to="{ name: 'signup' }">
                  Регистрация
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" :to="{ name: 'login' }">
                  Войти
                </router-link>
              </li>
            </template>
            <li v-else class="nav-item dropdown">
              <span
                id="navbarDropdown"
                class="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ userStore.user.lastName }} {{ userStore.user.firstName }}
              </span>
              <ul
                class="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdown"
              >
                <li>
                  <router-link class="dropdown-item" :to="{ name: 'library' }">
                    Моя коллекция
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" :to="{ name: 'favorite' }">Избранное </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" :to="{ name: 'converter' }"
                    >Загрузить презентацию
                  </router-link>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <router-link
                    class="dropdown-item"
                    :to="{ name: 'all-presentations' }"
                    @click="userStore.logOut()"
                  >
                    Выйти
                  </router-link>
                </li>
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
.navbar,
.footer {
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
