<template>
  <div>
    <Navbar></Navbar>
    <ul v-if="courses.length" class="list-group mt-5 px-5">
      <Course
        v-for="course in courses"
        :key="course.id"
        :course="course"
        :enable="{ rating: true, sold: true, toggle: true, link: { name: 'cabinet.purchased-course', params: {
          id: course.id
        }}}"
      ></Course>
    </ul>

    <div class="modal fade bd-example-modal-lg" id="course-info" tabindex="-1" role="dialog" aria-labelledby="course-info-label" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="course-info-label">{{ courseInfo.title }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p class="pb-2 border-bottom">{{ courseInfo.description }}</p>
            <div class="d-flex">
              <div w="50">
                <p>Author: <span class="font-weight-500 ml-1">{{ courseInfo.author.username }}</span></p>
                <p>Category: <span class="font-weight-500 ml-1">{{ courseInfo.category.name }}</span></p>
                <p>Added at: <span class="font-weight-500 ml-1">{{ courseInfo.addedAt }}</span></p>
                <p>Rating: <span class="font-weight-500 ml-1">{{ courseInfo.rating }}/5</span></p>
                <p>Sold: <span class="font-weight-500 ml-1">{{ courseInfo.sold }} times</span></p>
                <p>Golden: <span class="font-weight-500 ml-1">{{ courseInfo.saved ? "True": "False" }}</span></p>
                <p>Tags: <span class="font-weight-500 ml-1 text-primary">
                  {{ courseInfo.tags.map((item) => `#${item}`).join(" ") }}
                </span></p>
              </div>
              <div w="50">
                <div v-if="courseInfo.discount">
                  <p>Discount: <span class="font-weight-500 ml-1 text-success">Yes</span></p>
                  <p>Price: <span class="font-weight-500 ml-1 text-muted text-strike">{{ courseInfo.price }}$</span></p>
                  <p>Discount percent: <span class="font-weight-500 ml-1">{{ courseInfo.discountPercent }}%</span></p>
                  <p>Discount deadline: <span class="font-weight-500 ml-1">{{ courseInfo.discountDeadline }}</span></p>
                  <p>New price: <span class="font-weight-500 ml-1">{{ courseInfo.newPrice }}$</span></p>
                </div>
                <div v-else>
                  <p>Discount: <span class="font-weight-500 ml-1 text-danger">No</span></p>
                  <p>Price: <span class="font-weight-500 ml-1">{{ courseInfo.price }}$</span></p>
                </div>
              </div>
            </div>
            <div class="mt-3">
              <p class="text-center mb-1">Poster</p>
              <img
                v-if="url && courseInfo && courseInfo.poster"
                class="rounded border w-100"
                :src="`${url}/${courseInfo.poster}`"
              >
            </div>
            <div class="mt-4">
              <p class="text-center mb-1">Video</p>
              <video
                v-if="url && courseInfo && courseInfo.video"
                class="rounded border"
                ref="course-info-video"
                height="300" controls="controls" preload="none"
              >
                <source :src="`${url}/${courseInfo.video}`" type="video/mp4">
              </video>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

import $ from "jquery"
import { bus } from "../../main"
import Navbar from "../utils/AdminNavbar"
import Course from "../course/CourseBlock"


export default {
  data: () => ({
    url: process.env.VUE_APP_MAIN_URL,
    courseInfo: {
      author: { profilePicture: "", username: "" },
      category: { name: "" },
      createdAt: "", description: "", discount: false, discountDeadline: 0, discountPercent: 0, addedAt: "",
      id: "", title: "", poster: "", price: 0, rating: 0, sold: 0, saved: false, tags: [], cannotBuy: false, newPrice: 0 
    },
    courseOptions: [
      {
        name: "Activate",
        color: "success",
        run: undefined,
      },
      {
        name: "Delete",
        color: "danger",
        run: undefined,
      },
    ],
  }),
  methods: {
    async activateCourse(course) {
      bus.$emit("show:loader")
      course.active = true
      await this.$store.dispatch("activateCourse", course)
      bus.$emit("hide:loader", false)
    },
    async disableCourse(course) {
      bus.$emit("show:loader")
      await this.$store.dispatch("disableCourse", course.id)
      bus.$emit("hide:loader", false)
    },

    // Course info modal
    openCourseModal(course) {
      $(".modal").modal("hide")
      this.courseInfo = course
      this.courseInfo.addedAt = this.convertDate(course.createdAt)
      this.courseInfo.discountDeadline = this.calculateDeadline(course.discountDeadline)
      this.courseInfo.newPrice = course.price - ((course.price / 100) * course.discountPercent)
      this.$refs["course-info-video"].load()
      $("#course-info").modal("show")
    },
    convertDate(date) {
      return new Date(date).toISOString().split("T")[0].split("-").reverse().join(".")
    },
    calculateDeadline(deadline) {
      const last = new Date(deadline) - new Date()
      if (!last || last < 1) return false

      const sec = Math.floor(last / 1000)
      if (sec < 1) return false

      const min = Math.floor(sec / 60)
      if (min < 1) return `${sec}sec`

      const hour = Math.floor(min / 60)
      if (hour < 1) return `${min}m ${sec - (60 * min)}s`

      const day = Math.floor(hour / 24)
      if (day < 1) return `${hour}h ${min - (60 * hour)}m`

      return `${day}d ${hour - (24 * day)}h`
    },
  },
  computed: {
    auth() {
      return this.$store.state.auth
    },
    courses() {
      const courses = this.$store.getters.courses
      return courses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    },
  },
  components: {
    Navbar, Course,
  },
  async created() {
    if (!this.auth.isAuthorized || this.auth.user.role != "admin") bus.$emit("redirect", "index")

    bus.$emit("show:loader")
    $("[data-toggle='tooltip']").tooltip("hide")
    await this.$store.dispatch("getCourses")
    bus.$emit("hide:loader", false)
    $(".modal").modal("hide")

    this.courseOptions[0].run = this.activateCourse
    this.courseOptions[1].run = this.disableCourse

    // Events
    bus.$on("open:course-info-modal", (course) => this.openCourseModal(course))
  },
  mounted() {
  }
}
</script>

<style scoped> 
  video {
    width: 100%;
    background: #000;
  }
  img {
    width: 100%;
    max-height: 400px;
  }
  video:focus {
    outline: none;
  }
</style>
