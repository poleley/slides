import {createRouter, createWebHistory} from "vue-router"
import Main from "@/views/Main.vue";
import SignUp from "@/views/SignUp.vue";
import LogIn from "@/views/LogIn.vue";

const routes = [
    {
        path: "/",
        component: Main
    },
    {
        path: '/signup/',
        component: SignUp
    },
    {
        path: '/login/',
        component: LogIn
    },
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router