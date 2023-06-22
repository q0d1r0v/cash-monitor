<script setup lang="ts">
// imports
import { Icon } from '@iconify/vue/dist/iconify.js';
import { usePageTitle } from '../store/page_title'

// store
const page_title = usePageTitle()

// methods
async function logOut() {
    await localStorage.clear()
    location.reload()
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
            <q-btn color="primary" outline round dense>
                <Icon icon="ri-logout-box-r-line" />
                <q-tooltip>
                    Chiqish
                </q-tooltip>
                <q-menu transition-show="scale" transition-hide="scale">
                    <q-list style="min-width: 80px" dense>
                        <q-item clickable @click="logOut()">
                            <q-item-section>Chiqish</q-item-section>
                        </q-item>
                    </q-list>
                </q-menu>
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