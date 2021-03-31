<template>
<div>
  <nav class="navbar navbar-expand-lg justify-content-between navbar-light bg-white rounded-bottom shadow px-3 mb-4">
    <div style="width: 231px;">
      <router-link :to="{ name: 'index' }" class="navbar-brand d-flex align-items-center">
        <img src="../../assets/images/brand-logo.png" height="20" class="d-inline-block align-top">
      </router-link>
    </div>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-content" aria-controls="navbar-content" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="d-flex justify-content-center" style="flex-grow: 1">
      <ul class="navbar-nav align-items-center">
        <li :class="{ 'nav-item': true, active: currentRoute == 'course.all' }">
          <router-link :to="{ name: 'course.all' }" class="nav-link font-weight-500 pb-1">Courses</router-link>
        </li>
        <li :class="{ 'nav-item': true, active: currentRoute == 'channels.all' }">
          <router-link :to="{ name: 'channels.all' }" class="nav-link font-weight-500 pb-1">Channels</router-link>
        </li>
      </ul>
    </div>

    <div class="collapse navbar-collapse" id="navbar-content" style="flex-grow: 0 !important">
      <ul class="navbar-nav align-items-center" v-if="auth.isAuthorized">
        <li class="nav-item">
          <router-link
            :to="{ name: auth.user.role == 'user' ? 'cabinet.logs' : 'admin.new-courses' }"
            :class="{ 'nav-link cabinet-link px-3 py-1 d-flex vertical-center': true, 'border-danger': auth.user.spam }"
            data-toggle="tooltip" title="Cabinet">
            <svg class="bi mr-1 mb-1 pointer" width="20" height="20">
              <use xlink:href="../../assets/icons/bootstrap-icons.svg#person"/>
            </svg>
            <p class="mb-0 font-weight-500">{{ auth.user.role == "user" ? auth.user.username : "Admin" }}</p>
          </router-link>
        </li>
        <p class="font-weight-500 mb-0 ml-2 pointer" data-toggle="tooltip" title="Account">{{ auth.user.account }}$</p>
        <button @click="logout()" class="btn btn-sm btn-outline-danger ml-3 font-weight-500">Logout</button>
      </ul>
      <ul class="navbar-nav align-items-center ml-auto" v-else>
        <li class="nav-item">
          <router-link :to="{ name: 'auth.login' }" class="btn btn-outline-primary ml-3 py-1">
            Login | Register
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</div>
</template>

<script>

import $ from 'jquery'
import { bus } from "../../main"


export default {
  methods: {
    logout() {
      this.$store.dispatch("logout")
      bus.$emit("redirect", "auth.login")
    }
  },
  computed: {
    auth() {
      return this.$store.state.auth
    },
    currentRoute() {
      return this.$route.name
    },
  },
  mounted() {
    $('nav [data-toggle="tooltip"]').tooltip({
      trigger: "hover", placement: "left"
    })
  }
}
</script>

<style scoped>
  nav {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .cabinet-link {
    border-radius: 25px;
    border: 2px solid transparent;
    background: #D8EFFF;
    color: black !important;
  }
</style>
