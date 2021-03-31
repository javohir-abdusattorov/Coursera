<template>
  <div>
    <template class="pb-4">
      <router-view
        v-if="!authLoading"
      ></router-view>
    </template>

    <div class="modal loading-modal" ref="loader" tabindex="-1" role="dialog">
      <div id="loader"><div class="loader-container"></div></div>
    </div>
  </div>
</template>

<script>

import $ from 'jquery'

import { bus } from "./main"
import AuthorizationMixin from "./mixins/authorizationMixin"
import ValidationMixin from "./mixins/validationMixin"


export default {
  name: 'App',
  data: () => ({
    authLoading: true,
  }),
  methods: {
    loader(action) {
      $(this.$refs.loader).modal(action == true ? "show" : "hide")
    },

    redirect(name) {
      this.loader(false)
      this.$router.push({ name })
    }
  },
  mixins: [AuthorizationMixin, ValidationMixin],
  async created() {
    // Authorization checking
    this.loader(true)
    await this.$store.dispatch("checkUserAuthorization")
    this.authLoading = false
    this.loader(false)

    bus.$on("show:loader", () => this.loader(true))
    bus.$on("hide:loader", () => this.loader(false))
    bus.$on("redirect", (path) => this.redirect(path))
  },
  mounted() {
    if (this.authLoading) this.loader(true)
    $('[data-toggle="tooltip"]').tooltip()
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');
  @import "assets/main-styles.css";
</style>
