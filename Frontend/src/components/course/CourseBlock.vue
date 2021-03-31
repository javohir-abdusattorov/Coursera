<template>
  <li class="list-group-item overflow-hidden py-0 px-0" ref="course">
    <div class="d-flex justify-content-between">
      <div class="main-info d-flex" style="flex-grow: 1">
        <div class="bg-primary px-2 center">
          <p class="mb-0 text-light created-at">{{ createdAt }}</p>
        </div>
        <div class="list-item-child course-title">
          <p class="mb-0 ml-2" v-if="!enable.link">{{ course.title }} - <b>${{ course.price }}</b></p>
          <p class="mb-0 ml-2" v-else>
            <router-link :to="enable.link" class="text-dark">
              {{ course.title }} - <b>${{ course.price }}</b>
            </router-link>
          </p>
        </div>
        <div v-if="enable.sold" class="px-3 border-left center course-sold">
          <p class="mb-0">Sold: <b>{{ course.sold }} times</b></p>
        </div>
        <div v-if="enable.rating" class="px-3 border-left border-right center course-rating">
          <p class="mb-0 mr-2">Rating</p>
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
      </div>
      <div class="controls d-flex align-items-center">

        <button
          v-if="enable.toggle"
          @click="toggleSaved()"
          :class="{ 'btn btn-sm mr-2 d-flex center': true, 'btn-danger': course.saved, 'btn-success': !course.saved }">
          <p class="mb-0 mr-1">{{ course.saved ? 'Remove from saved' : 'Add to saved' }}</p>
          <svg class="bi" width="14" height="14">
            <use v-if="course.saved" xlink:href="../../assets/icons/bootstrap-icons.svg#trash-fill"/>
            <use v-else xlink:href="../../assets/icons/bootstrap-icons.svg#asterisk"/>
          </svg>
        </button>
        <button
          v-if="enable.return"
          @click="openReturnModal()"
          class="btn btn-sm btn-danger mr-2 d-flex center">
          <p class="mb-0 mr-1">Return course</p>
          <svg class="bi" width="14" height="14">
            <use xlink:href="../../assets/icons/bootstrap-icons.svg#trash-fill"/>
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
        <div v-if="options && options.length">
          <button
            v-for="option in options"
            :key="option.name"
            @click="option.run(course)"
            :class=" ['btn btn-sm mr-2', `btn-${option.color}`]"
          >
            {{ option.name }}
          </button>
        </div>

      </div>
    </div>
  </li>
</template>

<script>

import $ from "jquery"
import { bus } from "../../main"
import StarRating from "vue-star-rating"


export default {
  props: {
    course: {
      type: Object,
      required: true,
    },
    options: {
      type: Array,
    },
    enable: {
      type: Object,
      required: true
    },
  },
  data: () => ({
    toggleSavedLoader: false,
  }),
  methods: {
    async openInfoModal() {
      bus.$emit("show:loader")
      const course = await this.$store.dispatch("reloadCourse", this.course.id)
      bus.$emit("hide:loader")
      bus.$emit("open:course-info-modal", course)
    },
    async toggleSaved() {
      if (this.toggleSavedLoader) return

      this.toggleSavedLoader = true
      const saved = await this.$store.dispatch("toggleAdminSaved", this.course.id)
      this.course.saved = saved
      this.$store.dispatch("courseChanged", this.course.saved)
      this.toggleSavedLoader = false
    },
    async openReturnModal() {
      bus.$emit("show:loader")
      const info = await this.$store.dispatch("courseReturnInfo", this.course.id)
      bus.$emit("hide:loader")
      bus.$emit("open:can-return-course-modal", {
        info,
        course: this.course
      })
    },
  },
  components: {
    StarRating
  },
  computed: {
    createdAt() {
      return new Date(this.course.createdAt).toISOString().split("T")[0].split("-").reverse().join(".")
    },
  },
  async created() {
  },
  mounted() {
    $(this.$refs.course).find('[data-toggle="tooltip"]').tooltip()
  }
}
</script>

<style scoped> 
  .list-item-child {
   margin-top: .75rem; 
   margin-bottom: .75rem; 
  }
  .created-at {
    font-size: 16px;
  }
  .course-title {
    width: 408px;
  }
  .course-sold {
    width: 163px;
  }
  .course-rating {
    width: 198px;
  }
</style>
