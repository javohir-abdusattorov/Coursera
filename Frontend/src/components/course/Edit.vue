<template>
  <div ref="container">
    <Navbar></Navbar>
    <main class="col-md-7 mx-auto bg-white rounded shadow my-5">
      <h3 class="text-center font-weight-light py-3">Edit course "{{ course.title }}"</h3>
      <form @submit.prevent="editCourse()" class="px-2 pb-4">
        <div class="form-group pb-2">
          <label class="mb-1" for="title">Title</label>
          <input v-model="course.title" type="text" class="form-control" id="title" placeholder="Enter course title" required>
        </div>
        <div class="form-group pb-2">
          <label class="mb-1" for="description">Description</label>
          <textarea v-model="course.description" class="form-control" id="description" rows="3" required></textarea>
        </div>
        <div class="form-group pb-2">
          <label class="mb-1" for="price">Price</label>
          <input v-model="course.price" type="number" min="1" class="form-control" id="price" placeholder="Enter course price" required>
        </div>
        <div class="form-group pb-2">
          <label class="mb-1" for="category">Category</label>
          <select v-model="course.category" class="form-control" id="category" required>
            <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
          </select>
        </div>
        <div class="form-group pb-2">
          <label class="mb-1" for="tags">Tags</label>
          <input @keypress="addTag($event)" v-model="currentTag" type="text" class="form-control mb-3" id="tags" placeholder="Enter course tag">
          <div class="tags">
            <p class="d-flex flex-wrap mb-0">
              <button
                v-for="(tag, i) in course.tags" :key="tag"
                class="btn btn-outline-primary vertical-center shadow-none rounded-25 px-2 py-1 mr-2 mb-2 tag"
                type="button">
                #{{ tag }}
                <span @click="course.tags.splice(i, 1)" class="text-danger ml-2 remove-tag-btn">&times;</span>
              </button>
            </p>
          </div>
        </div>

        <div class="pb-2 d-flex">
          <p class="mb-1 mr-3">Discount</p>
          <div class="custom-control custom-switch">
            <input v-model="course.discount" type="checkbox" class="custom-control-input" id="discount-toggle">
            <label class="custom-control-label" for="discount-toggle"></label>
          </div>
        </div>
        <div v-if="course.discount">
          <div class="form-group pb-2">
            <label class="mb-1" for="discount-percent">Discount percent</label>
            <input v-model="course.discountPercent" :required="course.discount" type="number" min="1" max="100" class="form-control" id="discount-percent" placeholder="Enter course discount percent (%)">
          </div>
          <div class="form-group pb-2">
            <label class="mb-1">Discount deadline</label>
            <div class="d-flex">
              <input v-model="course.discountDeadline.date" :required="course.discount" type="date" class="form-control">
              <input v-model="course.discountDeadline.time" :required="course.discount" type="time" class="form-control ml-4">
            </div>
          </div>
        </div>

        <div class="mb-4 mt-4">
          <p class="mb-1">Course video</p>
          <div class="custom-file" data-toggle="tooltip" title="If you want to change video, then upload new one">
            <input type="file" ref="course-video" class="custom-file-input" id="course-video" accept="video/*" @change="handleCourseVideoUpload()">
            <label class="custom-file-label" ref="course-video-label" for="course-video">Upload video</label>
          </div>
        </div>
        <div class="mb-4">
          <p class="mb-1">Course poster</p>
          <div class="custom-file" data-toggle="tooltip" title="If you want to change poster, then upload new one">
            <input type="file" ref="course-poster" class="custom-file-input" id="course-poster" accept="image/*" @change="handleCoursePosterUpload()">
            <label class="custom-file-label" ref="course-poster-label" for="course-poster">Upload image</label>
          </div>
        </div>

        <div class="text-center pb-3">
          <p class="text-center text-danger font-weight-500">{{ validation.errorMessage }}</p>
          <p class="text-center text-success font-weight-500" v-show="validation.success">Changes saved successfuly.</p>
          <button type="submit" class="btn btn-primary">Save</button>
        </div>

      </form>
    </main>
  </div>
</template>

<script>

import $ from "jquery"
import { bus } from "../../main"
import Navbar from "../utils/UserNavbar"
import ValidationMixin from "../../mixins/validationMixin"


export default {
  data: () => ({
    id: 0,
    course: {
      title: "",
      description: "",
      price: 0,
      category: "",
      tags: [],
      video: null,
      poster: null,
      discount: false,
      discountPercent: 0,
      discountDeadline: {
        date: "", time: "",
      },
    },
    validation: {
      success: false,
      errorMessage: ""
    },
    currentTag: "",
  }),
  methods: {
    addTag(evt) {
      if (evt.charCode === 13) {
        evt.preventDefault()
        if (!this.currentTag || this.course.tags.includes(this.currentTag)) return;
        this.course.tags.push(this.currentTag)
        this.currentTag = ""
      }
    },
    convertDateToISO(date) {
      const d = new Date(date)
      const h = d.getHours().toString().length == 1 ? `0${d.getHours()}` : d.getHours()
      const min = d.getMinutes().toString().length == 1 ? `0${d.getMinutes()}` : d.getMinutes()
      const y = d.getFullYear()
      const m = d.getMonth().toString().length == 1 ? `0${d.getMonth()+1}` : d.getMonth()+1
      const day = d.getDate()

      return [
        `${y}-${m}-${day}`,
        `${h}:${min}`
      ]
    },
    convertDateToNumber({ date, time }) {
      const p = date.split("-")
      const t = time.split(":")
      return new Date(p[0], p[1]-1, p[2], t[0], t[1]).getTime()
    },
    handleCourseVideoUpload() {
      this.course.video = this.$refs["course-video"].files[0]
      this.$refs["course-video-label"].textContent = this.course.video.name
    },
    handleCoursePosterUpload() {
      this.course.poster = this.$refs["course-poster"].files[0]
      this.$refs["course-poster-label"].textContent = this.course.poster.name
    },
    editCourse() {
      const data = JSON.parse(JSON.stringify(this.course))
      delete data.video
      delete data.poster
      delete data.discountDeadline

      // Validation
      const isInvalidData = this.validateObject(data, [
        { name: "title", type: "string" }, { name: "description", type: "string" },
        { name: "price", type: "number" }, { name: "category", type: "number" },
        { name: "tags", type: "array" }, { name: "discount", type: "boolean" }
      ])
      if (isInvalidData) return this.validation.errorMessage = isInvalidData
      if (data.price < 1) return this.validation.errorMessage = `Price must be greater than 0`
      if (!data.tags.length) return this.validation.errorMessage = `Please add at least 1 tag, for search purposes`

      if (data.discount) {
        console.log(this.course.discountDeadline)
        data.discountPercent = this.course.discountPercent
        data.discountDeadline = this.convertDateToNumber(this.course.discountDeadline)
      } else {
        data.discountPercent = 0
        data.discountDeadline = 0
      }
      const formData = this.createFormData(data)
      if (this.course.video) formData.append("video", this.course.video)
      if (this.course.poster) formData.append("poster", this.course.poster)

      bus.$emit("show:loader")
      this.axios({
        method: "patch",
        url: `${process.env.VUE_APP_MAIN_URL}/api/courses/edit/${this.id}`,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage["access-token"]}`
        },
        data: formData,
      }).then((res) => {
        this.validation.success = true
        this.validation.errorMessage = ""
        console.log(res)
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
    categories() {
      return this.$store.state.categories
    },
  },
  components: {
    Navbar
  },
  mixins: [ValidationMixin],
  async created() {
    bus.$emit("show:loader")
    await this.$store.dispatch("getCategories")

    const course = await this.$store.dispatch("getCourse", this.$route.params.id)
    if (!course.author.id == +this.auth.user.id) return bus.$emit("redirect", "cabinet.my-courses")

    this.id = course.id
    this.course.title = course.title
    this.course.description = course.description
    this.course.price = course.price
    this.course.category = course.category.id
    this.course.tags = course.tags
    this.course.discount = course.discount
    if (course.discount) {
      const [date, time] = this.convertDateToISO(course.discountDeadline)
      this.course.discountPercent = course.discountPercent
      this.course.discountDeadline = { date, time }
    }
    
    bus.$emit("hide:loader", false)
  },
  mounted() {
    $(this.$refs.container).find('[data-toggle="tooltip"]').tooltip({
      placement: "right"      
    })
  },
}

</script>

<style scoped>
  .tag {
    font-size: 13px;
  }
  .remove-tag-btn {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.1rem !important;
  }
</style>