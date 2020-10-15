<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          {{ this.$store.state.storage.node.id }}
        </q-toolbar-title>
        <q-toggle v-model="buttonState" color="red" />

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          Settings
        </q-item-label>
        <q-item>
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Storage SAS</q-item-label>
            <q-input v-model="this.$store.state.signature" label="Standard" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated>
      <q-toolbar>
        <q-toolbar-title>Footer</q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
  data() {
    return {
      leftDrawerOpen: false
    };
  },
  created: function() {
    if (localStorage.storageaccountsas) {
      this.$store.commit("storage/updateSAS", localStorage.name);
    }
    this.$store.dispatch("storage/initAction");
  },
  computed: {
    buttonState: {
      get() {
        return this.$store.state.storage.buttonState;
      },
      set(val) {
        this.$store.commit("storage/updateButtonState", val);
      }
    }
  }
};
</script>
