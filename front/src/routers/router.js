import {createRouter, createWebHistory} from "vue-router"
import SignUp from "@/views/SignUp.vue";
import LogIn from "@/views/LogIn.vue";
import PresentationGallery from "@/views/PresentationGallery.vue";
import MyCollection from "@/views/MyCollection.vue";
import {useUserStore} from "@/stores";
import PresentationDetail from "@/views/PresentationDetail.vue";
import Converter from "@/views/Converter.vue";
import EditPresentation from "@/views/EditPresentation.vue";
import Interactivity from "@/views/Interactivity.vue";
import Statistics from "@/views/Statistics.vue";

const routes = [
    {
        path: "/",
        component: PresentationGallery,
        name: 'all-presentations'
    },
    {
        path: '/signup/',
        component: SignUp,
        name: 'signup'
    },
    {
        path: '/login/',
        component: LogIn,
        name: 'login'
    },
    {
        path: '/library/',
        component: MyCollection,
        name: 'library'
    },
    {
        path: '/presentation/:id/',
        component: PresentationDetail,
        name: 'presentation'
    },
    {
        path: '/presentation/:id/edit/',
        component: EditPresentation,
        name: 'presentation-edit'
    },
    {
        path: '/presentation/:id/edit/interactivity/',
        component: Interactivity,
        name: 'interactivity'
    },
    {
        path: '/presentation/:id/statistics/',
        component: Statistics,
        name: 'statistics'
    },
    {
        path: '/upload/',
        component: Converter,
        name: 'converter'
    }
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    if (
        (
            to.name === 'library' ||
            to.name === 'converter' ||
            to.name === 'presentation-edit' ||
            to.name === 'interactivity' ||
            to.name === 'statistics'
        ) && userStore.user === null
    )
        return next('/signup')
    else
        return next()
})

export default router