<script setup lang="ts">
// imports
import { onMounted, ref } from 'vue'
import { usePageTitle } from '../store/page_title'
import moment from 'moment'
import { Loading, Notify } from 'quasar';
import http from '../utils/axios';

// types
interface ICostCreateFormDataTypes {
    cost_types: {
        value: string,
        items: [
            {
                id: number
                title: string
                value: string
            },
            {
                id: number
                title: string
                value: string
            }
        ]
    }
    date: string
    time: string
    full_date: string
    to_whom: string
    categories: {
        value: string
        items: object | any
    }
    uzs_sum: number | string
    usd_sum: number | string
    usd_rate: number | string
    description: string
}

// store
const page_title = usePageTitle()

// data
const cost_create_forms = ref<ICostCreateFormDataTypes>({
    cost_types: {
        value: '',
        items: [
            {
                id: 1,
                title: 'Kirim',
                value: 'IN'
            },
            {
                id: 2,
                title: 'Chiqim',
                value: 'OUT'
            }
        ]
    },
    date: '',
    time: '',
    full_date: '',
    to_whom: '',
    categories: {
        value: '',
        items: []
    },
    uzs_sum: '',
    usd_sum: '',
    usd_rate: 0,
    description: ''
})

// methods
function setFirstData() {
    cost_create_forms.value.full_date = moment().format('YYYY-MM-DDTHH:MM')
    cost_create_forms.value.cost_types.value = ''
    cost_create_forms.value.to_whom = ''
    cost_create_forms.value.categories.value = ''
    cost_create_forms.value.uzs_sum = ''
    cost_create_forms.value.usd_sum = ''
    cost_create_forms.value.usd_rate = ''
    cost_create_forms.value.description = ''
}
async function getCategories() {
    try {
        Loading.show()
        cost_create_forms.value.date = moment().format('YYYY MM DD')
        cost_create_forms.value.to_whom = ''
        cost_create_forms.value.categories.value = ''
        cost_create_forms.value.uzs_sum = ''
        cost_create_forms.value.usd_sum = ''
        cost_create_forms.value.usd_rate = ''
        cost_create_forms.value.description = ''
        const { data } = await http.get('/api/categories', {
            params: {
                type: cost_create_forms.value.cost_types.value
            }
        })
        cost_create_forms.value.categories.items = data.results
    } catch (e) {
        Notify.create({
            color: "red",
            message: "Kategoriyalarni yuklab olishda xatolik yuz berdi!"
        })
    } finally {
        Loading.hide()
    }
}
async function sendCostForm() {
    try {
        if (cost_create_forms.value.cost_types.value && cost_create_forms.value.full_date && cost_create_forms.value.to_whom && cost_create_forms.value.categories.value && cost_create_forms.value.uzs_sum && cost_create_forms.value.usd_sum && cost_create_forms.value.usd_rate) {
            Loading.show()
            await http.post('/api/actions/', {
                category: cost_create_forms.value.categories.value,
                issuer: cost_create_forms.value.to_whom,
                amount_dollar: cost_create_forms.value.usd_sum,
                amount_sum: cost_create_forms.value.uzs_sum,
                description: cost_create_forms.value.description,
                dolar_price: cost_create_forms.value.usd_rate,
                issued: cost_create_forms.value.full_date
            })

        }
        cost_create_forms.value.cost_types.value = ''
        cost_create_forms.value.date = ''
        cost_create_forms.value.to_whom = ''
        cost_create_forms.value.categories.value = ''
        cost_create_forms.value.uzs_sum = ''
        cost_create_forms.value.usd_sum = ''
        cost_create_forms.value.usd_rate = ''
        cost_create_forms.value.description = ''
        Notify.create({
            color: "green",
            message: "Xarajat muvoffaqiyatli yaratildi!"
        })
    } catch (e) {
        Notify.create({
            color: "red",
            message: "Xarajatni yaratishda xatolik yuz berdi!"
        })
    } finally {
        Loading.hide()
    }
}
function setDateAndTime() {
    cost_create_forms.value.full_date = ''
    cost_create_forms.value.full_date = cost_create_forms.value.date.split('/').join('-') + 'T' + cost_create_forms.value.time.split(' ')[1]
}

// mounted
onMounted(() => {
    page_title.changePageTitle('Xarajatlar')
    setFirstData()
})

</script>

<template>
    <div style="background: #fff; padding: 10px;">
        <div style="display: flex">
            <q-select v-model="cost_create_forms.cost_types.value" :options="cost_create_forms.cost_types.items"
                option-label="title" option-value="value" emit-value map-options outlined dense label="Xarajat turi"
                style="background: #fff; width: 50%; margin-right: 10px;" clearable @update:model-value="getCategories" />
            <q-input :disable="!cost_create_forms.cost_types.value" label="Sana" outlined dense
                style="background: #fff; width: 50%;" clearable v-model="cost_create_forms.full_date">
                <template #prepend>
                    <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="cost_create_forms.date" @update:model-value="setDateAndTime">
                                <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Yopish" color="red" flat />
                                </div>
                            </q-date>
                        </q-popup-proxy>
                    </q-icon>
                </template>

                <template #append>
                    <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="cost_create_forms.time" mask="YYYY-MM-DD HH:mm" format24h
                                @update:model-value="setDateAndTime">
                                <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Yopish" color="red" flat />
                                </div>
                            </q-time>
                        </q-popup-proxy>
                    </q-icon>
                </template>
            </q-input>
        </div>
        <div style="display: flex; margin-top: 10px;">
            <q-input :disable="!cost_create_forms.cost_types.value" v-model="cost_create_forms.to_whom" outlined dense
                label="Kimga" style="background: #fff; width: 50%; margin-right: 10px;" clearable />
            <q-select :disable="!cost_create_forms.cost_types.value" v-model="cost_create_forms.categories.value"
                :options="cost_create_forms.categories.items" outlined dense label="Kategoriya"
                style="background: #fff; width: 50%" clearable option-label="name" option-value="id" map-options
                emit-value />
        </div>
        <div style="display: flex; margin-top: 10px;">
            <q-input :disable="!cost_create_forms.cost_types.value" v-model="cost_create_forms.uzs_sum" outlined dense
                label="Summa" style="background: #fff; width: 50%; margin-right: 10px;" clearable />
            <q-input :disable="!cost_create_forms.cost_types.value" v-model="cost_create_forms.usd_sum" outlined dense
                label="Dollor sum" style="background: #fff; width: 50%" clearable />
        </div>
        <div style="display: flex; margin-top: 10px;">
            <q-input :disable="!cost_create_forms.cost_types.value" v-model="cost_create_forms.usd_rate" outlined dense
                label="Valyuta kursi summasi" style="background: #fff; width: 50%; margin-right: 10px" clearable />
            <q-input :disable="!cost_create_forms.cost_types.value" v-model="cost_create_forms.description" outlined dense
                label="Izoh" style="background: #fff; width: 50%" clearable type="textarea" />
        </div>
        <div style="margin-top: 10px; display: flex; align-items: center; justify-content: end;">
            <q-btn unelevated color="secondary"
                :disable="!cost_create_forms.cost_types.value || !cost_create_forms.full_date || !cost_create_forms.to_whom || !cost_create_forms.categories.value || !cost_create_forms.uzs_sum || !cost_create_forms.usd_sum || !cost_create_forms.usd_rate"
                @click="sendCostForm">
                <q-tooltip>
                    Yaratish
                </q-tooltip>
                Saqlash
            </q-btn>
        </div>
    </div>
</template>