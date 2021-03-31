<template>
<div>

  <Navbar></Navbar>

  <div class="col-md-6 bg-white mx-auto shadow rounded">
    <form @submit.prevent="editUser()" class="settings-form pb-3 mb-4">
      <div class="text-center pt-3">
        <img v-if="url && auth" :src="`${url}/${auth.user.profilePicture}`" class="rounded-circle shadow user-image" width=100 height="100">
      </div>
      <div class="shadow-bottom pb-2">
        <div class="custom-file col-md-8 d-block my-2 mx-auto">
          <input ref="profile-picture" @change="handlePictureUpload()" type="file" class="custom-file-input" id="user-image" accept="image/*">
          <label ref="profile-picture-label" class="custom-file-label" for="user-image">Upload profile picture</label>
        </div>
      </div>
      <div class="form-group pb-2 pt-4 px-3">
        <label for="username">Username:</label>
        <input v-model="data.username" type="text" class="form-control" id="username" required placeholder="Enter username">
      </div>
      <div class="form-group py-2 px-3">
        <label for="old-password">If you want to change the password, enter the old password:</label>
        <input v-model="data.oldPassword" type="password" class="form-control" id="old-password" autocomplete="new-password">
      </div>
      <div class="form-group py-2 px-3">
        <label for="new-password">New password:</label>
        <input v-model="data.newPassword" type="password" class="form-control" id="new-password" autocomplete="new-password">
      </div>
      <div class="text-center"><button class="btn btn-primary" type="submit">Save</button></div>
      <p class="text-center text-danger font-weight-500">{{ validation.errorMessage }}</p>
      <p class="text-center text-success font-weight-500" v-show="validation.success">Changes saved successfuly</p>
    </form>
  </div>

</div>
</template>

<script>

// import $ from "jquery"
import { bus } from "../../main"
import Navbar from "../utils/UserNavbar"
import ValidationMixin from "../../mixins/validationMixin"


export default {
  data: () => ({
    url: process.env.VUE_APP_MAIN_URL,
    data: {
      profilePicture: null,
      username: "",
      oldPassword: "",
      newPassword: "",
    },
    validation: {
      success: false,
      errorMessage: ""
    },
  }),
  methods: {
    handlePictureUpload() {
      this.data.profilePicture = this.$refs["profile-picture"].files[0]
      this.$refs["profile-picture-label"].textContent = this.data.profilePicture.name
    },
    editUser() {
      let data = JSON.parse(JSON.stringify(this.data)) 

      const isInvalidData = this.validateObject(data, [
        { name: "username", type: "string" }
      ])
      if (isInvalidData) return this.validation.errorMessage = isInvalidData

      const formData = this.createFormData(data)
      if (this.data.profilePicture) formData.append(`profilePicture`, this.data.profilePicture)

      if (this.data.oldPassword && this.data.newPassword) {
        formData.append("oldPassword", this.data.oldPassword)
        formData.append("newPassword", this.data.newPassword)
      }

      bus.$emit("show:loader")
      this.axios({
        method: "patch",
        url: `${process.env.VUE_APP_MAIN_URL}/api/users/edit`,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage["access-token"]}`
        },
        data: formData,
      }).then(async() => {
        this.validation.success = true
        this.validation.errorMessage = ""
        await this.$store.dispatch("reloadUser")
      })
      .catch((error) => {
        const errorText = error.response.data.message ? error.response.data.message : error.response.statusText
        this.validation.errorMessage = errorText
      })
      .then(() => bus.$emit("hide:loader"))
    },
  },
  computed: {
    auth() {
      return this.$store.state.auth
    },
  },
  components: {
    Navbar
  },
  mixins: [ValidationMixin],
  async created() {
    this.data.username = this.auth.user.username
  },
}

</script>

<style scoped>
</style>