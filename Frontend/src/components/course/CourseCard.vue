<template>
<div>
  <div :class="{'d-flex mt-4 bg-white rounded course': true, 'discount-shadow': discount}">
    <div w="25" class="border-right">
      <img :src="`${url}/${course.poster}`" class="rounded-left course-poster">
    </div>
    <div class="px-3 pt-2 h-auto" w=75 ref="course">
      <div class="d-flex justify-content-between mb-2">
        <div>
          <div class="vertical-center">
            <svg v-if="saved" data-toggle="tooltip" title="Admin recommended course" class="bi mr-1 text-warning pointer" width="20" height="20">
              <use xlink:href="../../assets/icons/bootstrap-icons.svg#asterisk"/>
            </svg>
            <h5 :class="{ 'mb-0 course-title': true, 'text-warning': saved, 'text-danger': (discount || discount && saved)}">{{ course.title }}</h5>
          </div>
          <router-link :to="{ 'name': 'course.all', query: { category: course.category.id } }" class="mb-0 text-primary font-weight-500 pointer">#{{ course.category.name }}</router-link>
        </div>
        <div>
          <div class="vertical-center">
            <h5 class="mb-0 text-dark" v-if="discount">
              <span class="text-muted text-strike course-real-price">{{ course.price }}$</span>
              {{ discountPrice }}$
            </h5>
            <h5 class="mb-0 text-dark" v-else>{{ course.price }}$</h5>
          </div>
        </div>
      </div>
      <p class="font-italic course-description mb-1">
        {{ course.description.slice(0, descriptionMax) }}...
      </p>
      <div class="d-flex justify-content-center mb-2">
        <div class="px-2 pb-1 rounded bg-transparent-dark">
          <StarRating
            :star-size="18"
            :padding="1"
            :increment="0.5"
            :read-only="true"
            :show-rating="false"
            :rating="course.rating"
            active-color="#FFC107"
            inactive-color="#ffffff">
          </StarRating>
        </div>
      </div>
      <div class="vertical-center justify-content-between pb-2 mb-1">
        <div class="vertical-center author">
          <img :src="`${url}/${course.author.profilePicture}`" width="27" height="27" class="rounded-circle">
          <h6 class="text-dark ml-1 mb-0">{{ course.author.username }}</h6>
        </div>
        <div class="d-flex justify-content-between">
          <button
            v-if="auth.isAuthorized && auth.user.role == 'user'"
            @click="toggleSaved()"
            class="btn btn-sm mr-2 py-0 shadow-none">
            <svg class="bi" width="23" height="23">
              <use v-if="course.userSaved" xlink:href="../../assets/icons/bootstrap-icons.svg#bookmark-check-fill"/>
              <use v-else xlink:href="../../assets/icons/bootstrap-icons.svg#bookmark"/>
            </svg>
          </button>
          <button
            @click="openInfoModal()"
            class="btn btn-sm btn-info mr-2"
            data-toggle="tooltip"
            title="More information">
            <svg class="bi" width="18" height="18">
              <use xlink:href="../../assets/icons/bootstrap-icons.svg#info-circle-fill"/>
            </svg>
          </button>
          <button
            @click="openBuyModal()"
            :disabled="!auth.isAuthorized || auth.user.role != 'user' || course.cannotBuy"
            class="btn btn-sm btn-success"
          >Buy course</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>

import $ from "jquery"
import StarRating from "vue-star-rating"
import { bus } from "../../main"


export default {
  props: {
    course: {
      type: Object,
      required: true,
    }
  },
  data: () => ({
    url: process.env.VUE_APP_MAIN_URL,
    descriptionMax: 313,
    saved: false,
    discount: true,
    discountPrice: 0,
    toggleSavedLoader: false,
  }),
  methods: {
    async openInfoModal() {
      bus.$emit("show:loader")
      const course = await this.$store.dispatch("reloadCourse", this.course.id)
      course.cannotBuy = (this.course.cannotBuy || this.auth.user.role !== 'user')
      bus.$emit("hide:loader")
      bus.$emit("open:course-info-modal", course)
    },
    async openBuyModal() {
      bus.$emit("show:loader")
      const info = await this.$store.dispatch("courseBuyInfo", this.course.id)
      bus.$emit("hide:loader")
      bus.$emit("open:can-buy-course-modal", {
        info,
        course: this.course
      })
    },
    async toggleSaved() {
      if (this.toggleSavedLoader) return

      this.toggleSavedLoader = true
      this.course.userSaved = !this.course.userSaved
      this.$store.dispatch("courseChanged", this.course)
      bus.$emit("reload:courses", this.course.id)
      await this.$store.dispatch("toggleUserSaved", {
        id: this.course.id,
        saved: this.course.userSaved
      })
      await this.$store.dispatch("reloadUser")
      this.toggleSavedLoader = false
    }
  },
  components: {
    StarRating
  },
  computed: {
    auth() {
      return this.$store.state.auth
    },
  },
  created() {
    this.saved = this.course.saved
    this.discount = this.course.discount
    if (this.discount) {
      this.discountPrice = this.course.price - ((this.course.price / 100) * this.course.discountPercent)
    }
    this.$store.dispatch("courseChanged", this.course)

    // Events
    bus.$on("reload:courses", (id) => (+this.course.id === +id) && this.$forceUpdate())
  },
  mounted() {
    $(this.$refs.course).find('[data-toggle="tooltip"]').tooltip()
  }
}
</script>

<style scoped>
  .course {
    margin-bottom: 30px;
  }
  .course-poster {
    width: 100%;
    min-height: 100%;
    max-height: 240px;
    object-fit: cover;
  }
  .block-courses .course-poster {
    max-height: 200px;
  }
  .course-title {
    font-size: 1.5em;
    font-weight: 500;
    word-break: break-word;
  }
  .course-description {
    font-size: 15px;
    color: #4D4D4D;
  }
  .discount-shadow {
    box-shadow: 0 1rem 1rem rgba(220,53,69,.35)!important;
  }
  .course-real-price {
    font-size: 1rem;
  }
</style>