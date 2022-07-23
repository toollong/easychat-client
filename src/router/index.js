import { createRouter, createWebHashHistory } from 'vue-router'
import { getCookie } from '@/utils/cookie';

const routes = [
    {
        path: '/login',
        component: () => import('@/pages/login'),
        name: 'login'
    },
    {
        path: '/register',
        component: () => import('@/pages/register'),
        name: 'register'
    },
    {
        path: '/home',
        component: () => import('@/pages/home'),
        name: 'home'
    },
    {
        path: '/findPassword',
        component: () => import('@/pages/password'),
        name: 'findPassword'
    },
    {
        path: '/',
        redirect: "/home"
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.path === "/login" || to.path === "/register" || to.path === "/findPassword") {
        return next();
    }
    const uid = getCookie("uid");
    if (uid !== null && new RegExp(/\d{19}/).test(uid)) {
        return next();
    }
    return next("/login");
})

export default router