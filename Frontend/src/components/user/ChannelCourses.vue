<template>
<div>

<Navbar></Navbar>

<div class="mt-5 bg-white py-3 w-100 channel">
  <div class="col-md-9 mx-auto d-flex justify-content-between align-items-center">
    <div class="d-flex">
      <div class="channel-info">
        <img v-if="url && channel && channel.profilePicture" class="rounded-circle w-100 h-100" :src="`${url}/${channel.profilePicture}`">
      </div>
      <div class="center pl-3">
        <div>
          <h4 class="mb-0">{{ channel.username }}</h4>
          <p class="mb-0 text-muted subscribers">{{ channel.subscribersCount }} subscribers</p>
        </div>
      </div>
    </div>
    <button
      @click="toggleSubscribe()"
      :disabled="!auth.isAuthorized"
      :class="{
        'btn rounded-0 mr-2 d-flex center': true,
        'btn-danger': !channel.subscribed, 'btn-secondary': channel.subscribed }">
      <p class="mb-0 mr-1">{{ channel.subscribed ? 'Subscribed' : 'Subscribe' }}</p>
      <svg class="bi" width="14" height="14">
        <use v-if="!channel.subscribed" xlink:href="../../assets/icons/bootstrap-icons.svg#bell"/>
        <use v-else xlink:href="../../assets/icons/bootstrap-icons.svg#bell-fill"/>
      </svg>
    </button>

  </div>
</div>

<div class="mt-5 pt-4 col-md-9 px-0 mx-auto block-courses">
  <Course
    v-for="course in courses"
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

// import $ from "jquery"
import { bus } from "../../main"
import Navbar from "../utils/Navbar"
import Course from "../course/CourseCard"
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
    async toggleSubscribe() {
      if (this.toggleSubscribeLoader) return

      this.toggleSubscribeLoader = true
      await this.$store.dispatch("toggleSubscribe", this.channel)
      this.toggleSubscribeLoader = false
    },
  },
  computed: {
    auth() {
      return this.$store.state.auth
    },
    channel() {
      return this.$store.state.channels[0] || {}
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
    const channelID = +this.$route.params.id

    bus.$emit("show:loader")
    await this.$store.dispatch("getChannelCourses", channelID)
    await this.$store.dispatch("getChannel", channelID)
    bus.$emit("hide:loader", false)

    // Events
    bus.$on("open:course-info-modal", (course) => this.openCourseModal(course))
    bus.$on("open:can-buy-course-modal", (data) => this.openCanBuyModal(data))
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

  .btn-danger {
    background: #CA0000 !important;
    text-transform: uppercase;
    font-weight: 500;
    letter-spacing: 1px;
    font-size: 15px;
  }
  .btn-secondary {
    background: #535353 !important;
    text-transform: uppercase;
    font-weight: 500;
    letter-spacing: 1px;
    font-size: 15px;
  }
  .channel-info {
    width: 70px;
    height: 70px;
  }
  .subscribers {
    font-size: 14px;
  }
</style>