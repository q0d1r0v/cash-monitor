// imports
import {defineStore} from 'pinia'

// pinia
export const usePageTitle = defineStore('page_title', {
    state: () => ({
        page_title: 'Dashboard'
    }),
    actions: {
        changePageTitle(title: string) {
            this.page_title = title
        }
    }
})