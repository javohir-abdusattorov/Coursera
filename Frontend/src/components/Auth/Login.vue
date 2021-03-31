<template>
  <div>
    <div class="col-md-4 mx-auto bg-white rounded shadow pt-3 px-4 my-5">
      <h2 class="text-center font-weight-light">Login</h2>
      <form @submit="login($event)">
        <div class="form-group mb-4">
          <label for="user-name">Name</label>
          <input v-model="user.username" type="text" class="form-control" id="user-name" placeholder="Enter your username" required>
        </div>
        <div class="form-group mb-4">
          <label for="user-password">Password</label>
          <input v-model="user.password" type="password" class="form-control" id="user-password" placeholder="Enter your password" required>
        </div>
        <p class="text-center text-danger font-weight-500">{{ validation.errorMessage }}</p>
        <p class="text-center text-success font-weight-500" v-show="validation.success">You logged in successfuly!</p>
        <div class="text-center"><button type="submit" class="btn btn-primary">Submit</button></div>

        <p class="mt-4 mb-1 text-center">Doesn't have an account? <router-link :to="{ name: 'auth.register' }">Register</router-link></p>
        <p class="pb-3 text-center"><router-link :to="{ name: 'index' }">Home page</router-link></p>
      </form>
    </div>
  </div>
</template>

<script>

import { bus } from "../../main"
import ValidationMixin from "../../mixins/validationMixin"


export default {
  data: () => ({
    user: {
      username: "",
      email: "",
    },
    validation: {
      success: false,
      errorMessage: ""
    }
  }),
  methods: {
    login(evt) {
      evt.preventDefault()

      const data = JSON.parse(JSON.stringify(this.user))
      const isInvalidData = this.validateObject(data, [
        { name: "username", type: "string" }, { name: "password", type: "string" }
      ])
      if (isInvalidData) return this.validation.errorMessage = isInvalidData

      bus.$emit("show:loader")
      this.axios({
        method: "post",
        url: `${process.env.VUE_APP_MAIN_URL}/api/auth/login`,
        data
      }).then(async (res) => {
        this.validation.success = true

        this.$store.dispatch("login", res.data)
        await this.$store.dispatch("reloadUser")
        bus.$emit("redirect", "index")
      })
      .catch((error) => {
        const errorText = error.response.data.message ? error.response.data.message : error.response.statusText
        this.validation.errorMessage = errorText
      })
      .then(() => bus.$emit("hide:loader"))
    }
  },
  mixins: [ValidationMixin],
  created() {
    if (this.$store.state.auth.isAuthorized) bus.$emit("redirect", "index")
  }
}
</script>

<style scoped>
</style>
