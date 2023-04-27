import {createRouter, createWebHistory} from "vue-router"
import SignUp from "@/views/SignUp.vue";
import LogIn from "@/views/LogIn.vue";
import PresentationGallery from "@/views/PresentationGallery.vue";
import MyCollection from "@/views/MyCollection.vue";

const routes = [
    {
        path: "/",
        component: PresentationGallery
    },
    {
        path: '/signup/',
        component: SignUp
    },
    {
        path: '/login/',
        component: LogIn
    },
    {
        path: '/library/',
        component: MyCollection
    }
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router