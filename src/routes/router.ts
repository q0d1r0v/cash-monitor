// imports
import { createRouter, createWebHistory } from 'vue-router'

// layouts
const AuthLayout = () => import('../layouts/auth.vue')
const DefaultLayout = () => import('../layouts/default.vue')
const NotFoundLayout = () => import('../layouts/404.vue')

// auth pages
const LoginPage = () => import('../pages/LoginPage.vue')
const RegisterPage = () => import('../pages/RegisterPage.vue')

// pages
const HomePage = () => import('../pages/HomePage.vue')
const CostPage = () => import('../pages/CostPage.vue')
const NotFoundPage = () => import('../pages/NotFoundPage.vue')
const CategoryPage = () => import('../pages/CategoryPage.vue')

// router
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            name: 'AuthLayout',
            path: '/auth/',
            component: AuthLayout,
            children: [
                {
                    name: 'LoginPage',
                    path: 'login',
                    component: LoginPage
                },
                {
                    name: 'RegisterPage',
                    path: 'register',
                    component: RegisterPage
                }
            ]
        },
        {
            name: 'DefaultLayout',
            path: '/',
            component: DefaultLayout,
            children: [
                {
                    name: 'HomePage',
                    path: '/',
                    component: HomePage,
                    meta: {
                        auth: true
                    }
                },
                {
                    name: 'CostPage',
                    path: '/cost',
                    component: CostPage,
                    meta: {
                        auth: true
                    }
                },
                {
                    name: 'CategoryPage',
                    path: '/category',
                    component: CategoryPage,
                    meta: {
                        auth: true
                    }
                },
            ]
        },
        {
            name: 'NotFoundLayout',
            path: '/:pathMatch(.*)*',
            component: NotFoundLayout,
            children: [
                {
                    name: 'NotFoundPage',
                    path: '/:pathMatch(.*)*',
                    component: NotFoundPage
                }
            ]
        }
    ]
})

// router middleware
router.beforeEach((to, from, next) => {
    if (to.meta.auth == true && !localStorage.getItem('access_token')) {
        console.log(from)
        next('/auth/login')
    }
    next()
})

export default router