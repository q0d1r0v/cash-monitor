<script setup lang="ts">
import { useRouter } from 'vue-router';

// route
const router = useRouter()

// methods
function goToHomePage() {
    router.push('/')
}

</script>

<template>
    <div class="parent">
        <div style="text-align: center;">
            <div>
                <span class="not-found-text">
                    Kirish
                </span>
            </div>
            <div class="return-button">
                <q-btn unelevated color="primary" @click="goToHomePage">
                    Bosh sahifa
                </q-btn>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.parent {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
        & .not-found-text {
            font-size: 22px;
        }
        .return-button {
            margin-top: 10px;
        }
}
</style>