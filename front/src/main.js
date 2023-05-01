import { createApp } from "vue"
import App from "./App.vue"
// import components from "@/components/UI"
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import 'bootstrap-icons/font/bootstrap-icons.css'
import router from "@/routers/router";
import axios from "axios";
import {createPinia} from "pinia";

axios.defaults.BASE_URL = "http://127.0.0.1:8000"

const app = createApp(App);

// components.forEach(component => {
//     app.component(component.name, component)
// })

app
    .use(createPinia())
    .use(router, axios)
    .mount("#app")

