<template>
  <router-view v-slot="{ Component }">
    <component :is="currentLayout">
      <component :is="Component" />
    </component>
  </router-view>
</template>

<script>
import DefaultLayout from './layout/wrapper/index.vue';
import ClientLayout from './layout/client/ClientLayout.vue';
import BlankLayout from './layout/blank/BlankLayout.vue';

export default {
  name: 'App',
  components: {
    DefaultLayout,
    ClientLayout,
    BlankLayout,
  },
  computed: {
    currentLayout() {
      const layouts = {
        default: DefaultLayout,
        client: ClientLayout,
        blank: BlankLayout,
      };

      return layouts[this.$route.meta.layout] || DefaultLayout;
    },
  },
};
</script>
