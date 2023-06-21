<script setup lang="ts">
// imports
import { onMounted } from 'vue'
import { usePageTitle } from '../store/page_title'

// store
const page_title = usePageTitle()

// mounted
onMounted(() => {
    page_title.changePageTitle('Chiqim')
})

</script>

<template>
    <div>
        Chiqim page
    </div>
</template>