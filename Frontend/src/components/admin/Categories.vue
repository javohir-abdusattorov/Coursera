<template>
  <div>
    <Navbar></Navbar>
    <div class="px-5">
      <button @click="openCreateModal()" class="btn btn-success">Create +</button>
    </div>
    <ul class="list-group mt-4 px-5">
      <Category v-for="category in categories" :key="category.id" :category="category"></Category>
    </ul>

    <div class="modal fade" id="create" tabindex="-1" role="dialog" aria-labelledby="create-label" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="create-label">Create category</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body pt-2">
            <form @submit.prevent="createCategory()">
              <div class="form-group pb-2">
                <label class="mb-1" for="name">Name</label>
                <input v-model="create.data.name" type="text" class="form-control" id="name" placeholder="Enter category name" >
              </div>

              <div class="text-center mt-4">
                <p v-if="!create.validation.success" class="text-danger font-weight-500">{{ create.validation.message }}</p>
                <p v-else class="text-success font-weight-500">You successfuly created category</p>
                <button  type="submit" class="btn btn-success">Create</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="edit" tabindex="-1" role="dialog" aria-labelledby="edit-label" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="edit-label">Edit category <b>"{{ edit.data.name }}"</b></h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body pt-2">
            <form @submit.prevent="editCategory()">
              <div class="form-group pb-2">
                <label class="mb-1" for="name">Name</label>
                <input v-model="edit.data.name" type="text" class="form-control" id="name" placeholder="Enter category name" >
              </div>

              <div class="text-center mt-4">
                <p v-if="!edit.validation.success" class="text-danger font-weight-500">{{ edit.validation.message }}</p>
                <p v-else class="text-success font-weight-500">You successfuly edited category</p>
                <button  type="submit" class="btn btn-success">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import $ from "jquery"
import { bus } from "../../main"
import ValidationMixin from "../../mixins/validationMixin"

import Navbar from "../utils/AdminNavbar"
import Category from "../category/CategoryBlock"


export default {
  data: () => ({
    url: process.env.VUE_APP_MAIN_URL,
    create: {
      data: {
        name: ""
      },
      validation: {
        success: false,
        message: ""
      },
    },
    edit: {
      id: "",
      data: {
        name: ""
      },
      validation: {
        success: false,
        message: ""
      }
    },
  }),
  methods: {
    openCreateModal() {
      $('#create').modal('show')
    },
    openEditModal(category) {
      this.edit.id = category.id
      this.edit.data.name = category.name
      $('#edit').modal('show')
    },
    createCategory() {
      const data = JSON.parse(JSON.stringify(this.create.data))

      const isInvalidData = this.validateObject(data, [{ name: "name", type: "string" }])
      if (isInvalidData) return this.create.validation.message = isInvalidData

      bus.$emit("show:loader")
      this.axios({
        method: "post",
        url: `${process.env.VUE_APP_MAIN_URL}/api/category/create`,
        headers: { "Authorization": `Bearer ${localStorage["access-token"]}` },
        data,
      }).then((res) => {
        this.create.validation.success = true
        this.create.validation.message = ""
        this.$store.dispatch("categoryCreated", res.data)

        setTimeout(() => {
          $('#create').modal('hide')
          this.create.validation.success = false
        }, 3000)
      })
      .catch((error) => {
        console.error(error)
        const errorText = error.response.data.message ? error.response.data.message : error.response.statusText
        this.create.validation.message = Array.isArray(errorText) ? errorText.join(", ") : errorText
      })
      .then(() => bus.$emit("hide:loader"))
    },
    editCategory() {
      const data = JSON.parse(JSON.stringify(this.edit.data))

      const isInvalidData = this.validateObject(data, [{ name: "name", type: "string" }])
      if (isInvalidData) return this.edit.validation.message = isInvalidData

      bus.$emit("show:loader")
      this.axios({
        method: "patch",
        url: `${process.env.VUE_APP_MAIN_URL}/api/category/edit/${this.edit.id}`,
        headers: { "Authorization": `Bearer ${localStorage["access-token"]}` },
        data,
      }).then((res) => {
        const category = res.data
        this.edit.validation.success = true
        this.edit.validation.message = ""
        this.$store.dispatch("categoryChanged", category)

        setTimeout(() => {
          $('#edit').modal('hide')
          this.edit.validation.success = false
        }, 3000)
      })
      .catch((error) => {
        console.error(error)
        const errorText = error.response.data.message ? error.response.data.message : error.response.statusText
        this.edit.validation.message = Array.isArray(errorText) ? errorText.join(", ") : errorText
      })
      .then(() => bus.$emit("hide:loader"))
    },
  },
  computed: {
    auth() {
      return this.$store.state.auth
    },
    categories() {
      const data = this.$store.state.categories
      return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  },
  components: {
    Navbar, Category
  },
  mixins: [ValidationMixin],
  async created() {
    if (!this.auth.isAuthorized || this.auth.user.role != "admin") bus.$emit("redirect", "index")

    bus.$emit("show:loader")
    $("[data-toggle='tooltip']").tooltip("hide")
    await this.$store.dispatch("getCategories")
    bus.$emit("hide:loader", false)
    $(".modal").modal("hide")

    // Events
    bus.$on("edit:category", (data) => this.openEditModal(data))
  },
  mounted() {
  }
}
</script>

<style scoped>
</style>