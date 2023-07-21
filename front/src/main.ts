import { createApp } from "vue";
import App from "./App.vue";
import "/src/assets/custom.scss";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import router from "./routers/router";
import { createPinia } from "pinia";

const app = createApp(App);

app.use(createPinia()).use(router).mount("#app");
