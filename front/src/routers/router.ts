import {createRouter, createWebHistory} from "vue-router"
import SignUp from "@/views/SignUp.vue";
import LogIn from "@/views/LogIn.vue";
import PresentationGallery from "@/views/PresentationGallery.vue";
import MyCollection from "@/views/MyCollection.vue";
import {useUserStore} from "../stores";
import PresentationDetail from "@/views/PresentationDetail.vue";
import Converter from "@/views/PresentationConverter.vue";
import EditPresentation from "@/views/EditPresentation.vue";
import Interactivity from "@/views/PresentationInteractivity.vue";
import Statistics from "@/views/PresentationStatistics.vue";
import Embed from "@/views/EmbeddedPresentation.vue";
import Favorite from "@/views/FavoritePresentations.vue";

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
        path: '/favorite/',
        component: Favorite,
        name: 'favorite'
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
    },
    {
        path: '/embed/:id/',
        component: Embed,
        name: 'embed'
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