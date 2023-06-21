<script setup lang="ts">
// imports
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// types
interface INavBarTypes {
    id: number
    title: string
    path: string
    icon: string
    active_icon: string
}

// route
const route = useRoute()

// router
const router = useRouter()

// data
const NavBarItems = ref<INavBarTypes[]>(
    [
        {
            id: 1,
            icon: 'ri-dashboard-line',
            active_icon: 'ri-dashboard-fill',
            path: '/',
            title: 'Dashboard'
        },
        {
            id: 2,
            icon: 'ri-arrow-down-line',
            active_icon: 'ri-arrow-down-fill',
            path: '/make',
            title: 'Kirim'
        },
        {
            id: 3,
            icon: 'ri-arrow-up-line',
            active_icon: 'ri-arrow-up-fill',
            path: '/cost',
            title: 'Chiqim'
        },
        {
            id: 4,
            icon: 'ri-article-line',
            active_icon: 'ri-article-fill',
            path: '/category',
            title: 'Kategoriya'
        },
    ]
)

// methods
function goToPage(path: string) {
    router.push(path)
}

</script>

<template>
    <div class="parent-left-bar">
        <div class="logo">
            <span @click="goToPage('/')">Monitoring</span>
        </div>

        <div class="parent-menu" v-for="(nav_bar, index) of NavBarItems" :key="index" @click="goToPage(nav_bar.path)">
            <div class="left-active-item" v-show="route.fullPath === nav_bar.path">
                <!-- some -->
            </div>
            <Icon :icon="route.fullPath === nav_bar.path ? nav_bar.active_icon : nav_bar.icon"
                :class="route.fullPath === nav_bar.path ? 'active-icon' : 'default-icon'" />
            <div :class="route.fullPath === nav_bar.path ? 'active-text' : 'default-text'">{{ nav_bar.title }}</div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.parent-left-bar {
    min-width: 250px;
    height: 100vh;
    border: 1px solid rgba(0, 0, 0, 0.1);

    & .logo {
        width: 100%;
        padding: 10px;
        text-align: center;

        & span {
            font-size: 25px;
            user-select: none;
            cursor: pointer;
        }
    }

    .parent-menu {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 18px;
        padding-top: 10px;
        user-select: none;
        cursor: pointer;
        transition: all 0.3s;
        margin: 6px;

        & .default-icon {
            font-size: 22px;
        }

        .left-active-item {
            position: absolute;
            left: 0;
            width: 10px;
            height: 28px;
            background: #1375f7;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
        }
    }

    .parent-menu:hover {
        color: #1375f7;
    }

    .active-icon {
        margin-left: 10px;
        font-size: 22px;
        color: #1375f7;
    }

    .active-text {
        color: #1375f7;
    }
}</style>