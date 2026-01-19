<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>App</q-toolbar-title>

        <!--Heat Map Button-->
        <q-btn
        flat 
        dense 
        round 
        icon="grid_view"
        @click="openHeatMap">
        <q-tooltip>Market Sector Heat Map</q-tooltip>
      </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <!-- 🔥 THIS IS REQUIRED -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>
 <script setup>
        import { useRouter } from 'vue-router'

        /* Router */
        const router = useRouter()

        function openHeatMap () {
            router.push('/sector-heatmap')
        }
</script>
