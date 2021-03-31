<template>
  <div>
    <Navbar></Navbar>
    <ul class="list-group mt-5 px-5">
      <User
        v-for="user in users"
        :key="user.id"
        :user="user"
      ></User>
    </ul>

  </div>
</template>

<script>

import $ from "jquery"
import { bus } from "../../main"
import Navbar from "../utils/AdminNavbar"
import User from "../user/UserBlock"

export default {
  data: () => ({
    url: process.env.VUE_APP_MAIN_URL,
    users: [],
  }),
  methods: {
    async toggleSpam(user) {
      const res = await this.axios({
        method: "patch",
        url: `${process.env.VUE_APP_MAIN_URL}/api/users/toggle-spam/${user.id}`,
        headers: { "Authorization": `Bearer ${localStorage["access-token"]}` },
      })
      const i = this.users.findIndex((item) => +item.id === +user.id)
      this.users[i].spam = res.data.spam
    }
  },
  computed: {
    auth() {
      return this.$store.state.auth
    },
  },
  components: {
    Navbar, User,
  },
  async created() {
    if (!this.auth.isAuthorized || this.auth.user.role != "admin") bus.$emit("redirect", "index")

    bus.$emit("show:loader")
    $("[data-toggle='tooltip']").tooltip("hide")
    $(".modal").modal("hide")

    this.users = await this.$store.dispatch("getUsers")
    bus.$emit("hide:loader", false)

    // Events
    bus.$on("toggle-spam:user", (data) => this.toggleSpam(data))
  },
  mounted() {
  }
}
</script>

<style scoped>
</style>
