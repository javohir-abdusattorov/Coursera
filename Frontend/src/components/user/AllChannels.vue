<template>
  <div>
    <Navbar></Navbar>
    <ul class="list-group mt-5 px-5">
      <Channel
        v-for="channel in channels"
        :key="channel.id"
        :user="channel"        
        class="list-group-item"
      ></Channel>
    </ul>
  </div>
</template>

<script>

// import $ from "jquery"
import { bus } from "../../main"
import Navbar from "../utils/Navbar"
import Channel from "./ChannelBlock"

export default {
  data: () => ({
    url: process.env.VUE_APP_MAIN_URL,
  }),
  methods: {
  },
  computed: {
    auth() {
      return this.$store.state.auth
    },
    channels() {
      return this.$store.getters.getChannels
    },
  },
  components: {
    Navbar, Channel,
  },
  async created() {
    bus.$emit("show:loader")
    this.users = await this.$store.dispatch("getChannels")
    bus.$emit("hide:loader", false)
    // Events
    // bus.$on("toggle-spam:user", (data) => this.toggleSpam(data))
  },
  mounted() {
  }
}
</script>

<style scoped>
</style>