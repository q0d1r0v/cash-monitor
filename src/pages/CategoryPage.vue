<script setup lang="ts">
// imports
import { onMounted, ref } from 'vue'
import { usePageTitle } from '../store/page_title'
import { Loading, Notify } from 'quasar';
import http from '../utils/axios';
import { Icon } from '@iconify/vue/dist/iconify.js';

// types
interface IPaginationDataTypes {
    page_number: number,
    max_page: number,
    max: number,
    data: object | any
}
interface IDeleteDialogDataTypes {
    dialog_model: boolean
    item: object | any
}
interface ICreateDialogFormDataTypes {
    dialog_model: boolean
    editing_items: {
        editing: boolean,
        item: object | any
    }
    name: string
    type_value: string,
    type: [
        {
            id: number,
            title: string,
            value: string
        },
        {
            id: number,
            title: string,
            value: string
        }
    ]
}

// store
const page_title = usePageTitle()

// data
const pagination_data = ref<IPaginationDataTypes>({
    page_number: 1,
    max_page: 6,
    max: 1,
    data: []
})
const delete_dialog_data = ref<IDeleteDialogDataTypes>({
    dialog_model: false,
    item: {}
})
const create_dialog_form = ref<ICreateDialogFormDataTypes>({
    dialog_model: false,
    editing_items: {
        editing: false,
        item: {}
    },
    name: '',
    type_value: '',
    type: [
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
})
const headers_of_categories_table: any = [
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
        field: (row: any) => row.type,
        align: "center"
    },
    {
        name: 'actions',
        label: "Amallar",
        align: "left"
    }
]

// methods
async function getCategories() {
    try {
        Loading.show()
        const { data } = await http.get('/api/categories', {
            params: {
                page: pagination_data.value.page_number
            }
        })
        pagination_data.value.data = data.results
        pagination_data.value.max = Math.ceil(data.count / 100)
    } catch (e) {
        Notify.create({
            color: "red",
            message: "Kategoriyalarni yuklab olishda xatolik yuz berdi!"
        })
    } finally {
        Loading.hide()
    }
}
function showCreateDialog() {
    create_dialog_form.value.editing_items.editing = false
    create_dialog_form.value.name = ""
    create_dialog_form.value.type_value = ""
    create_dialog_form.value.dialog_model = true
}
function closeDialog() {
    create_dialog_form.value.dialog_model = false
}
async function sendCreateForm() {
    try {
        await http.post('/api/categories/', {
            name: create_dialog_form.value.name,
            type: create_dialog_form.value.type_value
        })
        await getCategories()
        create_dialog_form.value.dialog_model = false
        Notify.create({
            color: "green",
            message: "Kategoriya muvoffaqiyatli yaratildi!"
        })
    } catch (e) {
        Notify.create({
            color: "red",
            message: "Yangi kategoriya yaratishda xatolik yuz berdi!"
        })
    } finally {
        Loading.hide()
    }
}
function showEditDialog(item: any) {
    create_dialog_form.value.editing_items.editing = true
    create_dialog_form.value.editing_items.item = item
    create_dialog_form.value.name = item.name
    create_dialog_form.value.type_value = item.type
    create_dialog_form.value.dialog_model = true
}
async function updateCategory() {
    try {
        await http.put(`/api/categories/${create_dialog_form.value.editing_items.item.id}/`, {
            name: create_dialog_form.value.name,
            type: create_dialog_form.value.type_value
        })
        await getCategories()
        create_dialog_form.value.dialog_model = false
        Notify.create({
            color: "green",
            message: "Kategoriya muvoffaqiyatli o'zgartirildi!"
        })
    } catch (e) {
        Notify.create({
            color: "red",
            message: "Mavjud kategoriyani o'zgartirishda xatolik yuz berdi!"
        })
    } finally {
        Loading.hide()
    }
}
function showDeleteDialog(item: any) {
    delete_dialog_data.value.item = item
    delete_dialog_data.value.dialog_model = true
}
async function deleteCategory() {
    try {
        await http.delete(`/api/categories/${delete_dialog_data.value.item.id}/`)
        await getCategories()
        delete_dialog_data.value.dialog_model = false
        Notify.create({
            color: "green",
            message: "Kategoriya muvoffaqiyatli o'chirildi!"
        })
    } catch (e) {
        Notify.create({
            color: "red",
            message: "Mavjud kategoriyani o'chirishda xatolik yuz berdi!"
        })
    } finally {
        Loading.hide()
    }
}

// mounted
onMounted(() => {
    page_title.changePageTitle('Kategoriya')
    getCategories()
})
</script>

<template>
    <div>
        <div class="top-container">
            <q-btn unelevated color="secondary" @click="showCreateDialog">
                Yaratish
                <q-tooltip>
                    Yangi kategoriya yaratish
                </q-tooltip>
            </q-btn>
            <q-pagination v-model="pagination_data.page_number" :max="pagination_data.max"
                :max-pages="pagination_data.max_page" style="margin-left: 10px;" @update:model-value="getCategories" />
        </div>

        <div>
            <q-table :columns="headers_of_categories_table" no-data-label="Ma'lumotlar mavjud emas!" flat
                class="table-border" hide-pagination :rows-per-page-options="[0]" :rows="pagination_data.data">
                <template #body-cell-actions="props">
                    <q-td>
                        <q-btn round unelevated color="orange" dense style="margin-right: 10px;"
                            @click="showEditDialog(props.row)">
                            <Icon icon="ri-edit-line" />
                            <q-tooltip>
                                O'zgartirish
                            </q-tooltip>
                        </q-btn>
                        <q-btn round unelevated color="red" dense @click="showDeleteDialog(props.row)">
                            <Icon icon="ri-delete-bin-line" />
                            <q-tooltip>
                                O'chirish
                            </q-tooltip>
                        </q-btn>
                    </q-td>
                </template>
            </q-table>
        </div>
    </div>

    <q-dialog v-model="create_dialog_form.dialog_model" persistent>
        <q-card style="min-width: 450px; min-height: 250px; padding: 8px;">
            <div>
                <span class="title" v-if="!create_dialog_form.editing_items.editing">
                    Yangi kategoriya yaratish
                </span>
                <span class="title" v-else>
                    O'zgartirish
                </span>

                <div style="margin-top: 10px;">
                    <q-input outlined dense label="Nomi" v-model="create_dialog_form.name" clearable />
                    <q-select :disable="create_dialog_form.editing_items.editing" outlined dense label="Turi"
                        v-model="create_dialog_form.type_value" :options="create_dialog_form.type" option-label="title"
                        option-value="value" clearable map-options emit-value style="margin-top: 10px;" />
                </div>

                <div class="bottom-bar">
                    <div>
                        <q-btn unelevated color="secondary" style="margin-right: 5px;"
                            :disable="!create_dialog_form.name || !create_dialog_form.type_value" @click="sendCreateForm"
                            v-if="!create_dialog_form.editing_items.editing">
                            Yaratish
                            <q-tooltip>
                                Yangi kategoriya yaratish
                            </q-tooltip>
                        </q-btn>
                        <q-btn unelevated color="secondary" style="margin-right: 5px;"
                            :disable="!create_dialog_form.name || !create_dialog_form.type_value" v-else
                            @click="updateCategory">
                            O'zgartirish
                            <q-tooltip>
                                Mavjud kategoriyani o'zgartirish
                            </q-tooltip>
                        </q-btn>
                        <q-btn unelevated color="red" @click="closeDialog">
                            Bekor qilish
                            <q-tooltip>
                                Yangi kategoriya yaratishni bekor qilish
                            </q-tooltip>
                        </q-btn>
                    </div>
                </div>
            </div>
        </q-card>
    </q-dialog>

    <q-dialog v-model="delete_dialog_data.dialog_model">
        <q-card style="min-width: 450px; min-height: 200px; padding: 8px;">
            <div>
                <span class="title">
                    <span style="font-weight: 600;">{{ delete_dialog_data.item?.name }}ni</span> o'chirishni tasdiqlaysizmi?
                </span>

                <div class="bottom-bar">
                    <div>
                        <q-btn unelevated color="secondary" style="margin-right: 5px;" @click="deleteCategory">
                            Tasdiqlash
                            <q-tooltip>
                                O'chirish
                            </q-tooltip>
                        </q-btn>
                    </div>
                </div>
            </div>
        </q-card>
    </q-dialog>
</template>

<style scoped lang="scss">
.table-border {
    border: 1px solid rgba(0, 0, 0, 0.1);
    margin-top: 10px;
}

.top-container {
    padding: 5px 0px;
    display: flex;
    align-items: center;
    justify-content: end;
}

.bottom-bar {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 5px;
}

.title {
    font-size: 18px;
}
</style>