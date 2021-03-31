<template>
  <div>
    <Navbar></Navbar>
    <main class="col-md-7 mx-auto bg-white rounded shadow my-5">
      <h3 class="text-center font-weight-light py-3">Create new course</h3>
      <form @submit.prevent="createCourse()" class="px-2 pb-4">
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

        <div class="mb-4">
          <p class="mb-1">Course video</p>
          <div class="custom-file">
            <input type="file" ref="course-video" class="custom-file-input" id="course-video" required accept="video/*" @change="handleCourseVideoUpload()">
            <label class="custom-file-label" ref="course-video-label" for="course-video">Upload video</label>
          </div>
        </div>
        <div class="mb-4">
          <p class="mb-1">Course poster</p>
          <div class="custom-file">
            <input type="file" ref="course-poster" class="custom-file-input" id="course-poster" required accept="image/*" @change="handleCoursePosterUpload()">
            <label class="custom-file-label" ref="course-poster-label" for="course-poster">Upload image</label>
          </div>
        </div>

        <div class="text-center pb-3">
          <p class="text-center text-danger font-weight-500">{{ validation.errorMessage }}</p>
          <p class="text-center text-success font-weight-500" v-show="validation.success">You created course successfuly.</p>
          <button type="submit" class="btn btn-primary">Create course</button>
        </div>

      </form>
    </main>
  </div>
</template>

<script>

// import $ from "jquery"
import { bus } from "../../main"
import Navbar from "../utils/UserNavbar"
import ValidationMixin from "../../mixins/validationMixin"


export default {
  data: () => ({
    course: {
      title: "",
      description: "",
      price: null,
      category: null,
      tags: [],
      video: null,
      poster: null,
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
    handleCourseVideoUpload() {
      this.course.video = this.$refs["course-video"].files[0]
      this.$refs["course-video-label"].textContent = this.course.video.name
    },
    handleCoursePosterUpload() {
      this.course.poster = this.$refs["course-poster"].files[0]
      this.$refs["course-poster-label"].textContent = this.course.poster.name
    },
    createCourse() {
      const data = JSON.parse(JSON.stringify(this.course))
      delete data.video
      delete data.poster

      // Validation
      const isInvalidData = this.validateObject(data, [
        { name: "title", type: "string" }, { name: "description", type: "string" },
        { name: "price", type: "number" }, { name: "category", type: "number" },
        { name: "tags", type: "array" }
      ])
      if (isInvalidData) return this.validation.errorMessage = isInvalidData
      if (data.price < 1) return this.validation.errorMessage = `Price must be greater than 0`
      if (!data.tags.length) return this.validation.errorMessage = `Please add at least 1 tag, for search purposes`
      if (!this.course.video) return this.validation.errorMessage = `Please upload course video`
      if (!this.course.poster) return this.validation.errorMessage = `Please upload course poster`

      const formData = this.createFormData(data)
      formData.append("video", this.course.video)
      formData.append("poster", this.course.poster)

      bus.$emit("show:loader")
      this.axios({
        method: "post",
        url: `${process.env.VUE_APP_MAIN_URL}/api/courses/create`,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage["access-token"]}`
        },
        data: formData,
      }).then((res) => {
        this.validation.success = true
        this.validation.errorMessage = ""
        console.log(res)
        setTimeout(() => bus.$emit("redirect", "cabinet.my-courses"), 3000)
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
    bus.$emit("hide:loader", false)
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