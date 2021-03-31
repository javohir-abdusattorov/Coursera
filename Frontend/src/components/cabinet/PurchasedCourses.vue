<template>
  <div>
    <Navbar></Navbar>
    <ul v-if="courses.length" class="list-group mt-5 px-5">
      <Course
        v-for="course in courses"
        :key="course.id"
        :course="course"
        :enable="{
          rating: true,
          sold: true,
          toggle: false,
          return: true,
          link: { name: 'cabinet.purchased-course', params: { id: course.id } }
        }"
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
      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="can-return" tabindex="-1" role="dialog" aria-labelledby="can-return-label" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="can-return-label">{{ canReturnCourse.title }}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body pt-2">
        <h4 v-if="canReturnCourse.canReturn" class="text-center text-success mb-3">Seller can return course</h4>
        <h4 v-else class="text-center text-danger mb-3">Seller cannot return course</h4>

        <p class="px-2 bg-info text-light vertical-center justify-content-between py-1 rounded mb-2">
          Price:
          <span class="font-weight-500 d-inline-block text-right price">${{ canReturnCourse.price }}</span>
        </p>

        <p v-if="canReturnCourse.spam" class="px-2 bg-info text-light vertical-center justify-content-between py-1 rounded mb-2">
          For spam:
          <span class="font-weight-500 d-inline-block text-right price">-${{ canReturnCourse.spamPrice }}</span>
        </p>
        <p v-else class="px-2 bg-secondary text-light text-strike vertical-center justify-content-between py-1 rounded mb-2">
          For spam:
          <span class="font-weight-500 d-inline-block text-right price">-$0</span>
        </p>

        <p class="px-2 bg-success text-light vertical-center justify-content-between py-1 rounded mb-2 mt-4">Total: <span class="font-weight-500 d-inline-block text-right price">+${{ canReturnCourse.total }}</span></p>
      </div>
      <div class="modal-footer d-block text-center">
        <p v-if="!returnCourseValidation.success" class="text-danger font-weight-500">
          {{ returnCourseValidation.message }}
        </p>
        <p v-else class="text-success font-weight-500">You successfuly returned course</p>
        <button @click="returnCourse()" :disabled="!canReturnCourse.canReturn" type="button" class="btn btn-danger">Return course</button>
      </div>
    </div>
  </div>
</div>

  </div>
</template>

<script>

import $ from "jquery"
import { bus } from "../../main"
import Navbar from "../utils/UserNavbar"
import Course from "../course/CourseBlock"
import CourseMixin from "../../mixins/courseMixin"


export default {
  data: () => ({
    url: process.env.VUE_APP_MAIN_URL,
    courseInfo: {
      author: { profilePicture: "", username: "" },
      category: { name: "" },
      createdAt: "", description: "", discount: false, discountDeadline: 0, discountPercent: 0, addedAt: "",
      id: "", title: "", poster: "", price: 0, rating: 0, sold: 0, saved: false, tags: [], cannotBuy: false, newPrice: 0 
    },
    canReturnCourse: {
      canReturn: false, spam: false, price: 0, spamPrice: 0, total: 0,
      title: "", discountPercent: 0,
    },
    returnCourseValidation: {
      success: false,
      message: ""
    },
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
    openCanReturnModal({ info, course }) {
      $(".modal").modal("hide")
      this.canReturnCourse = info
      this.canReturnCourse.title = course.title
      this.canReturnCourse.id = course.id
      this.returnCourseValidation = { success: false, message: "" }
      this.canReturnCourse.discountPercent = course.discountPercent
      $("#can-return").modal("show")
    },
    async returnCourse() {
      if (!this.canReturnCourse.canReturn) return
      bus.$emit("show:loader")
      const id = this.canReturnCourse.id
      const result = await this.$store.dispatch("returnCourse", id)
      if (result.error) {
        this.returnCourseValidation = { success: false, message: result.message }
      } else {
        this.returnCourseValidation = { success: true, message: "" }
        await this.$store.dispatch("reloadUser")
        await this.$store.dispatch("courseDeleted", id)
        setTimeout(() => $("#can-return").modal("hide"), 2000)
      }
      bus.$emit("hide:loader")
    },
  },
  computed: {
    auth() {
      return this.$store.state.auth
    },
    courses() {
      const courses = this.$store.state.courses
      return courses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    },
  },
  mixins: [CourseMixin],
  components: {
    Navbar, Course,
  },
  async created() {
    if (!this.auth.isAuthorized || this.auth.user.role != "user") bus.$emit("redirect", "index")

    bus.$emit("show:loader")
    $("[data-toggle='tooltip']").tooltip("hide")
    await this.$store.dispatch("getUserPurchasedCourses")
    bus.$emit("hide:loader", false)
    $(".modal").modal("hide")

    // Events
    bus.$on("open:course-info-modal", (course) => this.openCourseModal(course))
    bus.$on("open:can-return-course-modal", (data) => this.openCanReturnModal(data))
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
