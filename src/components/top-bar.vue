<script setup lang="ts">
// imports
import { Icon } from '@iconify/vue/dist/iconify.js';
import { usePageTitle } from '../store/page_title'
import {useRouter, useRoute} from 'vue-router'

// store
const page_title = usePageTitle()

// route
const route = useRoute()

// router
const router = useRouter()

// methods
function goToAccountPage() {
    router.push('/account')
}

</script>

<template>
    <div class="parent-bar">
        <div class="left-items">
            <span class="title">
                {{ page_title.page_title }}
            </span>
        </div>
        <div class="right-items">
            <q-btn unelevated round dense :style="route.fullPath === '/account' ? 'border: 1px solid #1375f7' : 'border: 1px solid rgba(0, 0, 0, 0.1);'" @click="goToAccountPage">
                <Icon :icon="route.fullPath === '/account' ? 'ri-user-fill' : 'ri-user-line'" :color="route.fullPath === '/account' ? '#1375f7' : ''" />
            </q-btn>
        </div>
    </div>
</template>

<style scoped lang="scss">
.parent-bar {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    border: 1px solid rgba(0, 0, 0, 0.1);

    & .left-items {
        width: 50%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: left;

        & .title {
            font-size: 22px
        }
    }

    .right-items {
        width: 50%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: right;
    }
}
</style>