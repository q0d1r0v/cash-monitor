<script setup lang="ts">
// imports
import { Loading, Notify } from 'quasar';
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import http from '../utils/axios'

// route
const router = useRouter()

// types
interface IAuthDataType {
    username: string
    password: string
}
const auth_form = ref<IAuthDataType>({
    username: '',
    password: ''
})

// methods
async function login() {
    try {
        Loading.show()
        const { data } = await http.post('/auth/jwt/create', {
            username: auth_form.value.username,
            password: auth_form.value.password
        })
        localStorage.setItem('access_token', data.access)
        router.push('/')
    } catch (e) {
        Notify.create({
            message: "Kirishda xatolik yuz berdi!",
            color: "red"
        })
    } finally {
        Loading.hide()
    }
}

</script>

<template>
    <div class="auth-bg-card">
        <div class="card">
            <div class="auth-title">Kirish</div>

            <div class="auth-form">
                <div>
                    <q-input @keyup.enter="login" placeholder="Foydalanuvchi nomi" color="white" outlined style="background: #fff;"
                        v-model="auth_form.username" />
                </div>
                <div>
                    <q-input @keyup.enter="login" placeholder="Foydalanuvchi paroli" color="white" outlined style="background: #fff;"
                        type="password" v-model="auth_form.password" />
                </div>
            </div>

            <div>
                <q-btn class="login-button" :disable="!auth_form.username || !auth_form.password" @click="login">
                    Kirish
                </q-btn>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.auth-bg-card {
    width: 100%;
    height: 100vh;
    background: #28293d;
    display: flex;
    align-items: center;
    justify-content: center;

    & .card {
        width: 600px;
        height: 400px;
        border: 1px solid #fff;
        border-radius: 4px;
        transition: all 0.3s;
        position: relative;

        & .auth-title {
            font-size: 28px;
            color: #fff;
            text-align: center;
            margin-top: 10px;
        }

        .auth-form {
            padding: 15px;

            & div:nth-child(2) {
                margin-top: 12px;
            }
        }

        .login-button {
            background-color: #0062f6;
            color: #fff;
            width: 100%;
            padding: 14px;
            position: absolute;
            bottom: 0;
        }
    }

    .card:hover {
        width: 640px;
        height: 440px;
        box-shadow: 0px 0px 20px 10px #0062f6;
    }
}
</style>