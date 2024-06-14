<script setup>
import { ref } from 'vue';

const drawer = ref(false);

const navItems = [
  { title: 'Interactive Map', link: '/', name: 'map' },
  { title: 'Graph', link: '/graph', name: 'graph' },
];
</script>

<template>
  <v-app-bar app color="primary" dark>
    <v-container>
      <v-row align="center" no-gutters>
        <v-spacer></v-spacer>
        <v-col cols="auto">
          <v-btn
            text
            v-for="item in navItems"
            :key="item.title"
            :to="{ name: item.name }"
            :exact="true"
            class="v-btn--router"
          >
            {{ item.title }}
          </v-btn>
        </v-col>
        <v-col cols="auto" class="d-lg-none">
          <v-btn icon @click="drawer = !drawer">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-navigation-drawer v-model="drawer" app temporary right dark color="primary">
      <v-list dense>
        <v-list-item v-for="item in navItems" :key="item.title" :to="item.link">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app-bar>
</template>

<style scoped>
.v-application {
  background-color: #121212;
}

.v-btn--text {
  color: white !important;
}

.v-icon {
  color: white !important;
}
</style>
