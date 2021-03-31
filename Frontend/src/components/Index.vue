<template>
  <div>
    <Navbar></Navbar>
    <main class="mx-auto mt-3" w=80>
      <div class="d-flex justify-content-between align-items-start">
        <div w="25">
          <ul class="list-group bg-primary overflow-hidden shadow">
            <li class="list-group-item bg-primary px-2 py-2 text-white">
              <svg class="bi mr-1 mb-1 pointer" width="20" height="20">
                <use xlink:href="../assets/icons/bootstrap-icons.svg#list"/>
              </svg>
              Categories
            </li>
            <div class="categories">
              <router-link :to="{ 'name': 'course.all', query: { category: category.id } }" v-for="category in categories" :key="category.id" 
                class="list-group-item text-dark pointer decoration-none pl-3 py-2">
                {{ category.name }} <span class="badge badge-success ml-1">{{ category.courses.length }}</span>
              </router-link>
            </div>
          </ul>
          <div v-if="mostDiscountCourse" class="most-discount-course mt-4 px-3 pt-2 bg-white">
            <h4 class="text-primary">{{ mostDiscountCourse.title }}</h4>
            <p class="text-dark mb-1">Discount: <span class="font-weight-500">{{ mostDiscountCourse.discountPercent }}%</span></p>
            <p class="text-dark mb-1">Price: <span class="font-weight-500 text-strike text-muted">{{ mostDiscountCourse.price }}$</span></p>
            <p class="text-dark mb-1">New price: <span class="font-weight-500">{{ mostDiscountCourse.newPrice }}$</span></p>
            <p class="text-dark mb-1">Deadline: 
              <span v-if="mostDiscountCourse.deadlineStr" class="font-weight-500">{{ mostDiscountCourse.deadlineStr }}</span>
              <span v-else class="font-weight-500 text-danger">ended</span>
            </p>
            <img v-if="url && mostDiscountCourse && mostDiscountCourse.poster" class="w-100 rounded mt-2" :src="`${url}/${mostDiscountCourse.poster}`">
            <div class="text-center">
              <button
                :disabled="!mostDiscountCourse.deadlineStr || !auth.isAuthorized"
                @click="openCanBuyModalMostDiscount()"
                class="btn btn-sm btn-primary my-3"
              >Buy course</button>
            </div>
          </div>
        </div>
        <div w="73">
          <div class="slider rounded overflow-hidden">
            <div id="slide-controls" class="carousel slide" data-ride="carousel">
              <div class="carousel-inner">
                <div class="carousel-item active">
                  <img class="d-block w-100" src="../assets/images/index-slide-1.jpg">
                </div>
                <div class="carousel-item">
                  <img class="d-block w-100" src="../assets/images/index-slide-2.jpg">
                </div>
                <div class="carousel-item">
                  <img class="d-block w-100" src="../assets/images/index-slide-3.jpg">
                </div>
                <div class="carousel-item">
                  <img class="d-block w-100" src="../assets/images/index-slide-4.jpg">
                </div>
              </div>
              <a class="carousel-control-prev" href="#slide-controls" role="button" data-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
              </a>
              <a class="carousel-control-next" href="#slide-controls" role="button" data-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
              </a>
            </div>
          </div>
          <div class="pt-5">
            <div class="d-flex justify-content-center">
              <h3 class="text-center text-light bg-danger px-3 py-1 rounded">Golden courses (Admin recommended)</h3>
            </div>
            <Course
              v-for="course in goldenCourses"
              :key="course.id"
              :course="course"
            ></Course>
          </div>
          <div class="pt-5">
            <div class="d-flex justify-content-center">
              <h3 class="text-center text-light bg-danger px-3 py-1 rounded">Bestseller courses</h3>
            </div>
            <Course
              v-for="course in bestsellerCourses"
              :key="course.id"
              :course="course"
            ></Course>
          </div>
          <div class="pt-5">
            <div class="d-flex justify-content-center">
              <h3 class="text-center text-light bg-danger px-3 py-1 rounded">Most rated courses</h3>
            </div>
            <Course
              v-for="course in mostRatedCourses"
              :key="course.id"
              :course="course"
            ></Course>
          </div>
        </div>
      </div>
    </main>

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
          </div>
          <div class="modal-footer d-flex justify-content-center">
            <button
              :disabled="!auth.isAuthorized || courseInfo.cannotBuy"
              @click="openCanBuyModalCurrentInfo()"
              type="button"
              class="btn btn-success"
            >Buy course</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="can-buy" tabindex="-1" role="dialog" aria-labelledby="can-buy-label" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="can-buy-label">{{ canBuyCourse.title }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body pt-2">
            <h4 v-if="canBuyCourse.canBuy" class="text-center text-success mb-3">You can buy course</h4>
            <h4 v-else class="text-center text-danger mb-3">You cannot buy course</h4>

            <p class="px-2 bg-info text-light vertical-center justify-content-between py-1 rounded mb-2">
              Price:
              <span class="font-weight-500 d-inline-block text-right price">${{ canBuyCourse.price }}</span>
            </p>
            <p v-if="canBuyCourse.discount" class="px-2 bg-info text-light vertical-center justify-content-between py-1 rounded mb-2">
              Discount ({{ canBuyCourse.discountPercent }}%):
              <span class="font-weight-500 d-inline-block text-right price">-${{ canBuyCourse.discountPrice }}</span>
            </p>
            <p v-else class="px-2 bg-secondary text-light text-strike vertical-center justify-content-between py-1 rounded mb-2">
              Discount:
              <span class="font-weight-500 d-inline-block text-right price">-$0</span>
            </p>

            <p v-if="canBuyCourse.spam" class="px-2 bg-info text-light vertical-center justify-content-between py-1 rounded mb-2">
              For spam:
              <span class="font-weight-500 d-inline-block text-right price">+${{ canBuyCourse.spamPrice }}</span>
            </p>
            <p v-else class="px-2 bg-secondary text-light text-strike vertical-center justify-content-between py-1 rounded mb-2">
              For spam:
              <span class="font-weight-500 d-inline-block text-right price">+$0</span>
            </p>

            <p class="px-2 bg-success text-light vertical-center justify-content-between py-1 rounded mb-2 mt-4">Total: <span class="font-weight-500 d-inline-block text-right price">${{ canBuyCourse.total }}</span></p>
          </div>
          <div class="modal-footer d-block text-center">
            <p v-if="!buyCourseValidation.success" class="text-danger font-weight-500">{{ buyCourseValidation.message }}</p>
            <p v-else class="text-success font-weight-500">You successfuly bought course</p>
            <button @click="buyCourse()" :disabled="!canBuyCourse.canBuy" type="button" class="btn btn-success">Buy course</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Navbar from "./utils/Navbar"
import Course from "./course/CourseCard"
import CourseMixin from "../mixins/courseMixin"


export default {
  data: () => ({
    url: process.env.VUE_APP_MAIN_URL,
    courseInfo: {
      author: { profilePicture: "", username: "" },
      category: { name: "" },
      createdAt: "", description: "", discount: false, discountDeadline: 0, discountPercent: 0, addedAt: "",
      id: "", title: "", poster: "", price: 0, rating: 0, sold: 0, saved: false, tags: [], cannotBuy: false, newPrice: 0 
    },
    canBuyCourse: {
      canBuy: false, discount: false, spam: false, price: 0, discountPrice: 0, spamPrice: 0, total: 0,
      title: "", discountPercent: 0,
    },
    buyCourseValidation: {
      success: false,
      message: ""
    },
  }),
  methods: {
  },
  computed: {
    auth() {
      return this.$store.state.auth
    },
    categories() {
      return this.$store.state.categories
    },
    goldenCourses() {
      return this.$store.getters.getGoldenCourses
    },
    bestsellerCourses() {
      return this.$store.getters.getBestSellerCourses
    },
    mostRatedCourses() {
      return this.$store.getters.getMostRatedCourses
    },
    mostDiscountCourse() {
      const course = this.$store.getters.getMostDiscountCourse
      course.newPrice = course.price - ((course.price / 100) * course.discountPercent)
      course.deadlineStr = this.calculateDeadline(course.discountDeadline)
      return course
    }
  },
  components: {
    Navbar, Course
  },
  mixins: [CourseMixin],
  async created() {
    await this.defaultSettings()
  },
}

</script>

<style scoped>
  .slider .carousel-item {
    height: 400px;
  }
  .slider img {
    height: inherit;
    width: 100%;
    overflow: hidden;
  }
  .most-discount-course {
    border: 2px solid #007BFF;
    border-radius: 7px;
  }
  .primary-border {
    border: 2px solid #007BFF;
  }
  .danger-border {
    border: 2px solid #DC3545;
  }
  .discount {
    font-size: 30px;
  }
  .price {
    font-size: 20px;
  }
  .most-discount-course img {
    min-height: 150px;
    max-height: 180px;
  }
  #course-info p {
    font-size: 17px;
  }
</style>