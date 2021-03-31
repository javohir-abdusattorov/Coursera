<template>
<div>

<Navbar></Navbar>
<h4 @click="toggleFilters()" class="text-center mb-0 mt-2 font-weight-400 pointer">-- Filters --</h4>
<div ref="filters-toggle">
  <div class="pt-3 col-md-11 mx-auto">
    <div class="d-flex">
      <input v-model="filters['search-title']" type="search" class="form-control mr-3" placeholder="Search by title">
      <input v-model="filters['search-tag']" type="search" class="form-control mr-3" placeholder="Search by tag">
      <input v-model="filters['search-description']" type="search" class="form-control" placeholder="Search by description">
    </div>
  </div>
  <div class="d-flex mt-4 p-3 col-md-9 mx-auto shadow rounded filters">
    <div class="col-md-6 px-0">
      <div class="d-flex align-items-center mb-3" w=80>
        <p class="mb-0 mr-3 font-weight-500" w=12>Price</p>
        <input v-model="filters['price-min']" w=30 type="number" min="0" class="form-control mr-3 py-1" placeholder="Min">
        <input v-model="filters['price-max']" w=30 type="number" min="0" class="form-control mr-3 py-1" placeholder="Max">
      </div>
      <div class="d-flex align-items-center mb-3" w=80>
        <p class="mb-0 mr-3 font-weight-500" w=12>Sold</p>
        <input v-model="filters['sold-min']" w=30 type="number" min="0" class="form-control mr-3 py-1" placeholder="Min">
        <input v-model="filters['sold-max']" w=30 type="number" min="0" class="form-control mr-3 py-1" placeholder="Max">
      </div>
      <div class="d-flex align-items-center mb-3" w=80>
        <p class="mb-0 mr-3 font-weight-500" w=30>Have discount</p>
        <select v-model="filters['bool-discount']" class="form-control" w=46>
          <option value="0">All</option>
          <option value="+">Yes</option>
          <option value="-">No</option>
        </select>
      </div>
      <div class="d-flex align-items-center mb-3" w=80>
        <p class="mb-0 mr-3 font-weight-500" w=30>Category</p>
        <select v-model="filters['category']" class="form-control" w=46>
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
      </div>
    </div>
    <div class="col-md-6 px-0">
      <div class="d-flex align-items-center ml-auto mb-3" w=80>
        <p class="mb-0 mr-3 font-weight-500" w=35>Rating</p>
        <input v-model="filters['rating-min']" w=30 type="number" min="1" max="5" class="form-control mr-3 py-1" placeholder="Min">
        <input v-model="filters['rating-max']" w=30 type="number" min="1" max="5" class="form-control mr-3 py-1" placeholder="Max">
      </div>
      <div class="d-flex align-items-center ml-auto mb-3" w=80>
        <p class="mb-0 mr-3 font-weight-500" w=35>Discount percent</p>
        <input v-model="filters['discount-min']" w=30 type="number" min="1" max="100" class="form-control mr-3 py-1" placeholder="Min">
        <input v-model="filters['discount-max']" w=30 type="number" min="1" max="100" class="form-control mr-3 py-1" placeholder="Max">
      </div>
      <div class="d-flex align-items-center ml-auto" w=80>
        <p class="mb-0 mr-3 font-weight-500" w=32>Is golden</p>
        <select v-model="filters['bool-saved']" class="form-control" w=32>
          <option value="0">All</option>
          <option value="+">Yes</option>
          <option value="-">No</option>
        </select>
      </div>
    </div>
  </div>

  <div class="col-md-4 mx-auto pt-4 mt-2">
    <div class="d-flex align-items-center mb-3">
      <p class="mb-0 mr-3 font-weight-500" w=15>Sort by</p>
      <select v-model="filters.sort" class="form-control" w=65>
        <option value="createdAt-">Oldest</option>
        <option value="createdAt+">Newest</option>
        <option value="price+">Expensive</option>
        <option value="price-">Cheap</option>
        <option value="sold+">Best seller</option>
        <option value="sold-">Least sold</option>
        <option value="rating+">Highest rating</option>
        <option value="rating-">Lowest rating</option>
        <option value="discount+">Biggest discount percent</option>
        <option value="discount-">Smallest discount percent</option>
      </select>
    </div>
  </div>
</div>

<div class="mt-5 pt-4 col-md-9 px-0 mx-auto block-courses">
  <Course
    v-for="course in filteredCourses"
    :key="course.id"
    :course="course"
  ></Course>
</div>


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

import $ from "jquery"
import Navbar from "../utils/Navbar"
import Course from "./CourseCard"
import CourseMixin from "../../mixins/courseMixin"


export default {
  data: () => ({
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
    filters: {
      validation: {
        success: false,
        message: ""
      },

      "search-title": "",
      "search-tag": "",
      "search-description": "",

      "price-min": null,
      "price-max": null,
      "sold-min": null,
      "sold-max": null,
      "rating-min": null,
      "rating-max": null,
      "discount-min": null,
      "discount-max": null,

      "bool-discount": "0",
      "bool-saved": "0",

      "category": "",
      "sort": "createdAt-"
    },
  }),
  methods: {
    toggleFilters() {
      $(this.$refs["filters-toggle"]).toggle(200)
    },
  },
  computed: {
    auth() {
      return this.$store.state.auth
    },
    categories() {
      return this.$store.state.categories
    },
    courses() {
      return this.$store.getters.courses
    },
  },
  components: {
    Navbar, Course
  },
  mixins: [CourseMixin],
  async created() {
    await this.defaultSettings()
    const q = this.$route.query.category
    if (q && Number.isFinite(+q)) {
      const i = this.categories.find(item => +item.id === +q)
      if (i) {
        this.filters.category = q
      }
    }
  },
}

</script>

<style scoped>
  .filters {
    background: #FFE7E9;
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
  #course-info p {
    font-size: 17px;
  }
</style>