<script setup lang="ts">
// imports
import { onMounted, ref } from 'vue'
import { usePageTitle } from '../store/page_title'
import { Loading, Notify } from 'quasar';
import http from '../utils/axios';
import { Icon } from '@iconify/vue/dist/iconify.js';

import { representDate } from '../utils/dateformat';

// types
interface IPaginationDataTypes {
    page_number: number,
    max_page: number,
    max: number,
    data: object | any
}
interface IFilterFormDataTypes {
    search: string
    dates: {
        value: string
        date: object | any
    }
    ordering: string
    categories: {
        value: string
        items: [
            {
                id: number | string
                name: string
                value: string
            },
            {
                id: number | string
                name: string
                value: string
            }
        ]
    }
}

// store
const page_title = usePageTitle()

// data
const pagination_data = ref<IPaginationDataTypes>({
    page_number: 1,
    max: 1,
    max_page: 6,
    data: []
})
const filter_form = ref<IFilterFormDataTypes>({
    search: '',
    dates: {
        value: '',
        date: ''
    },
    categories: {
        value: '',
        items: [
            {
                id: 1,
                name: 'Kirim',
                value: 'IN'
            },
            {
                id: 2,
                name: 'Chiqim',
                value: 'OUT'
            }
        ]
    },
    ordering: '-issued'
})

const headers: any = [
    {
        name: 'id',
        label: "ID",
        field: (row: any) => row.id,
        align: "center"
    },
    {
        name: 'name',
        label: "Nomi",
        field: (row: any) => row.name,
        align: "center"
    },
    {
        name: 'type',
        label: "Turi",
        field: (row: any) => row.type === 'IN' ? 'Kirim' : 'Chiqim',
        align: "center"
    },
    {
        name: 'issuer',
        label: "Kimga",
        field: (row: any) => row.issuer,
        align: "center"
    },
    {
        name: 'amount_sum',
        label: "UZS Sum",
        field: (row: any) => row.amount_sum,
        align: "center"
    },
    {
        name: 'amount_dollar',
        label: "USD Sum",
        field: (row: any) => row.dolar_price,
        align: "center"
    },
    {
        name: 'date',
        label: "Sana va vaqt",
        field: (row: any) => representDate(row.issued),
        align: "center"
    },
    {
        name: 'actions',
        label: "Amallar",
        align: "left"
    },
]

// methods
async function getStatistics() {
    try {
        Loading.show()
        let from_date = ''
        let to_date = ''
        if (filter_form.value.dates.value) {
            from_date = filter_form.value.dates.value.split('/')[0]
            to_date = filter_form.value.dates.value.split('/')[1]
        }
        const { data } = await http.get('/api/actions/', {
            params: {
                page: pagination_data.value.page_number,
                search: filter_form.value.search,
                date_after: from_date,
                date_before: to_date,
                ordering: filter_form.value.ordering,
                category__type: filter_form.value.categories.value
            }
        })
        pagination_data.value.max = Math.ceil(data.count / 100)
        pagination_data.value.data = data.results
    } catch (e) {
        Notify.create({
            color: "red",
            message: "Ma'lumotni yuklab olishda xatolik yuz berdi!"
        })
    } finally {
        Loading.hide()
    }
}
function setDate() {
    filter_form.value.dates.value = filter_form.value.dates.date.from.split('/').join('-') + '/' + filter_form.value.dates.date.to.split('/').join('-')
    getStatistics()
}
function changeIssued() {
    if (filter_form.value.ordering === 'issued') {
        filter_form.value.ordering = '-issued'
        getStatistics()
    } else {
        filter_form.value.ordering = 'issued'
        getStatistics()
    }
}

function DownloadFile(downloadLink: string) {
        const link = document.createElement('a');
        link.href = downloadLink;
        document.body.appendChild(link);
        link.click(); // Trigger the download
        document.body.removeChild(link); // Clean up by removing the anchor element
    }

async function downloadExcel() {
    try {

        Loading.show()
        let from_date = ''
        let to_date = ''
        if (filter_form.value.dates.value) {
            from_date = filter_form.value.dates.value.split('/')[0]
            to_date = filter_form.value.dates.value.split('/')[1]
        }
        const { data } = await http.get('/api/actions/excel/', {
            params: {
                page: pagination_data.value.page_number,
                search: filter_form.value.search,
                date_after: from_date,
                date_before: to_date,
                ordering: filter_form.value.ordering,
                category__type: filter_form.value.categories.value
            }
        })
        const link = data.file_link
        
        DownloadFile(link)
        
    } catch (e) {
        Notify.create({
            color: "red",
            message: "Excel yuklab olishda xatolik yuz berdi!"
        })
    } finally {
        Loading.hide()
    }
    
}

// mounted
onMounted(() => {
    page_title.changePageTitle('Dashboard')
    getStatistics()
})

</script>

<template>
    <div>
        <div class="top-filter-bar">
            <div class="left-data">
                <div style="min-width: 200px">
                    <q-input v-model="filter_form.search" placeholder="Qidiruv..." outlined dense clearable
                        @keyup.enter="getStatistics">
                        <template #append>
                            <Icon icon="ri-search-line" @click="getStatistics" style="font-size: 18px; cursor: pointer;" />
                        </template>
                    </q-input>
                </div>
                <div style="min-width: 200px; margin-left: 10px;">
                    <q-select label="Turi" v-model="filter_form.categories.value" :options="filter_form.categories.items"
                        option-label="name" option-value="value" map-options emit-value outlined dense clearable
                        @update:model-value="getStatistics" />
                </div>
                <div style="min-width: 200px; margin-left: 10px;">
                    <q-input v-model="filter_form.dates.value" outlined dense label="Sana">
                        <template #append>
                            <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                    <q-date v-model="filter_form.dates.date" range @update:model-value="setDate">
                                        <div class="row items-center justify-end">
                                            <q-btn v-close-popup label="Yopish" color="red" flat />
                                        </div>
                                    </q-date>
                                </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                </div>
            </div>
            <div class="right-data">
                <div style="margin-right: 10px;">
                    <q-btn unelevated color="secondary" @click="downloadExcel">
                        Excelga yuklash
                        <q-tooltip>
                            Excelga yuklash
                        </q-tooltip>
                    </q-btn>
                </div>
                <q-pagination v-model="pagination_data.page_number" :max="pagination_data.max"
                    :max-pages="pagination_data.max_page" @update:model-value="getStatistics" />
            </div>
        </div>
        <div>
            <div style="display: flex; align-items: center; justify-content: end; margin-top: 10px;">
                <q-btn unelevated color="primary" @click="changeIssued">
                    Saralash
                    <Icon style="margin-left: 10px;"
                        :icon="filter_form.ordering === 'issued' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'" />
                    <q-tooltip>
                        Filter
                    </q-tooltip>
                </q-btn>
            </div>
            <q-table :columns="headers" :rows="pagination_data.data" hide-pagination :rows-per-page-options="[0]"
                no-data-label="Ma'lumotlar mavjud emas!" flat class="table-border">
                <template #body-cell-actions="props">
                    <q-td>
                        <q-btn round color="orange" dense unelevated>
                            <Icon icon="ri-eye-line" />
                            <q-tooltip>
                                {{ props.row.description ? `Izoh: ${props.row.description}` : 'Izoh mavjud emas!' }}
                            </q-tooltip>
                        </q-btn>
                    </q-td>
                </template>
            </q-table>
        </div>
    </div>
</template>

<style scoped lang="scss">
.table-border {
    border: 1px solid rgba(0, 0, 0, 0.1);
    margin-top: 10px;
}

.top-filter-bar {
    background: #fff;
    padding: 10px;
    display: flex;

    & .left-data {
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: left;
    }

    .right-data {
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: end;
    }
}
</style>