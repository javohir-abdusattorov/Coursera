<template>
<div>

<Navbar></Navbar>

<div class="my-5 px-5 logs">
  <div
    v-for="(log, index) in logs"
    :key="index"
    :class="{
      'card rounded-0': true,
      'text-white bg-success': log.type == 'success',
      'text-white bg-info': log.type == 'info',
      'text-white bg-danger': log.type == 'danger',
      'text-dark bg-warning': log.type == 'warn',
    }"
  >
    <div class="card-body py-3 vertical-center">
      <p class="mb-0 mr-3 date">[{{ log.createdAt }}]</p>
      <p class="card-text" v-html="log.message"></p>
    </div>
  </div>
</div>

</div>
</template>

<script>

import $ from "jquery"
import { bus } from "../../main"
import Navbar from "../utils/UserNavbar"


export default {
  data: () => ({
    url: process.env.VUE_APP_MAIN_URL,
    logs: [],
  }),
  methods: {
    convertDate(d) {
      const date = new Date(d).toISOString().split("T")[0].split("-").reverse().join(".")
      const time = new Date(d).toISOString().split("T")[1].split(".")[0].slice(0, 5)
      return `${date} ${time}`
    }
  },
  computed: {
    auth() {
      return this.$store.state.auth
    },
  },
  components: {
    Navbar
  },
  async created() {
    if (this.auth.user.role != "user") return bus.$emit("redirect", "index")

    const token = localStorage["access-token"]
    $("[data-toggle='tooltip']").tooltip("hide")
    const logs = await this.$store.dispatch("query", `
      getMyLogs(token: "${token}") {
        logs { type, message, createdAt }
      }
    `)
    for (const log of logs.getMyLogs.logs) {
      const message = log.message
        .replaceAll("<", "%^b class='underline'$^")
        .replaceAll(">", "%^/b$^")
        .replaceAll("%^", "<")
        .replaceAll("$^", ">")
        .replaceAll("(", "<span class='rounded-25 px-25 py-1 bg-dark text-warning'>")
        .replaceAll(")", "</span>")

      log.createdAt = this.convertDate(log.createdAt)
      log.message= message
    }

    this.logs = logs.getMyLogs.logs.reverse()
  },
}

</script>

<style scoped>
  .card:first-of-type {
    border-top-left-radius: 5px !important;
    border-top-right-radius: 5px !important;
  }
  .card:last-of-type {
    border-bottom-left-radius: 5px !important;
    border-bottom-right-radius: 5px !important;
  }
  .date {
    letter-spacing: 1px;
  }
</style>