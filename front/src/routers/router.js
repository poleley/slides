import {createRouter, createWebHistory} from "vue-router"
import Main from "@/pages/Main.vue";
import SignUp from "@/pages/SignUp.vue";

const routes = [
    {
        path: "/",
        component: Main
    },
    {
        path: '/signup/',
        component: SignUp
    }
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router