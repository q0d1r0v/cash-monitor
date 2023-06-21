<script setup lang="ts">
// imports
import TopBar from "../components/top-bar.vue";
import LeftBar from "../components/left-bar.vue";
</script>

<template>
  <div>
    <div class="bars">
      <left-bar />
      <div class="main">
        <top-bar title="Theflix" />
        <div class="page">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bars {
  display: flex;

  & .main {
    width: 100%;
    & .page {
      height: 100%;
      padding: 10px;
      background-color: #e2ebff41;
    }
  }
}
</style>
