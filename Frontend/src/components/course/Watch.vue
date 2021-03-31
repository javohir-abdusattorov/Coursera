<template>
<div ref="container" class="pb-4">
  <Navbar></Navbar>
  <div class="px-4 mx-1">
    <div>
      <VideoPlayer
        v-if="url && course.video"
        height="600"
        :src="`${url}/${course.video}`"
        :poster="`${url}/${course.poster}`"
      ></VideoPlayer>
    </div>
    <div class="course-info pt-3">
      <div class="title mb-3">
        <p class="text-primary mb-0 tags" style="font-size: 14px">{{ course.tags.map((item) => `#${item}`).join(" ") }}</p>
        <h4 class="font-weight-400">{{ course.title }}</h4>
      </div>
      <div class="d-flex justify-content-between" style="font-size: 14px">
        <p class="mb-0" style="color: #606060">
          {{ course.sold }} sales • {{ convertDate(course.createdAt) }}
        </p>
        <div class="d-flex align-items-center">
          <div class="px-2 pb-1 rounded bg-transparent-dark">
            <StarRating
              v-model="rate"
              :star-size="18"
              :padding="1"
              :increment="0.5"
              :show-rating="false"
              :rating="course.rating"
              active-color="#FFC107"
              inactive-color="#ffffff">
            </StarRating>
          </div>
          <button :disabled="cannotRate" @click="rateCourse()" class="btn btn-sm btn-outline-success ml-2">Rate</button>
        </div>
      </div>
    </div>
    <div class="channel-info d-flex justify-content-between align-items-start pt-3 mt-3 border-top border-bottom">
      <div class="channel d-flex align-items-start pt-2">
        <div class="mr-1 user-image">
          <img :src="`${url}/${channel.profilePicture}`" alt="avatar" class="w-100 h-100 rounded-circle">
        </div>
        <div class="ml-2" w=70>
          <div class="align-items-center">
            <p class="mb-0 mt-1 font-weight-500 d-block">
              <router-link :to="{ name: 'channels.courses', params: { id: channel.id } }" class="text-dark">
                {{ channel.username }}
              </router-link>
            </p>
            <p class="mb-0 text-muted font-weight-500 d-block" style="font-size: 13px">
              {{ channel.subscribersCount }} subscribers
            </p>
          </div>

          <div class="mt-4">
            <p>{{ course.description }}</p>
          </div>
        </div>
      </div>
      <button
        @click="toggleSubscribe()"
        :disabled="!auth.isAuthorized || (auth.isAuthorized && auth.user.role == 'admin')"
        :class="{
          'btn rounded-0 mt-3 d-flex center': true,
          'btn-danger': !channel.subscribed, 'btn-secondary': channel.subscribed }">
        <p class="mb-0 mr-1">{{ channel.subscribed ? 'Subscribed' : 'Subscribe' }}</p>
        <svg class="bi" width="14" height="14">
          <use v-if="!channel.subscribed" xlink:href="../../assets/icons/bootstrap-icons.svg#bell"/>
          <use v-else xlink:href="../../assets/icons/bootstrap-icons.svg#bell-fill"/>
        </svg>
      </button>
    </div>
    <div class="comments pt-4">
      <p class="font-weight-400 mb-3">{{ comments.length }} Comments</p>

      <div v-if="auth.user.role == 'user'" class="pt-3">
        <div class="comment d-flex mb-3">
          <div class="mr-3" style="width: 40px; height: 40px;">
            <img :src="`${url}/${auth.user.profilePicture}`" alt="avatar" class="w-100 h-100 rounded-circle">
          </div>
          <div w=80>
            <p class="mb-1" style="font-size: 14px">
              <span class="font-weight-500 mr-2">
                {{ auth.user.username }}
              </span>
            </p>
            <textarea v-model="newCommentMessage" type="text" class="form-control rounded-0" rows="2" placeholder="What do you think about course"></textarea>
            <div class="text-right pt-2 mt-1">
              <button @click="postComment()" class="btn btn-sm btn-primary">Comment</button>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-3">
        <div v-for="comment in comments" :key="comment.id" class="comment d-flex mb-3">
          <div class="mr-3" style="width: 40px; height: 40px;">
            <img :src="`${url}/${comment.user.profilePicture}`" alt="avatar" class="w-100 h-100 rounded-circle">
          </div>
          <div w=80>
            <p class="mb-1" style="font-size: 14px">
              <span class="font-weight-500 mr-2">
                <router-link :to="{ name: 'channels.courses', params: { id: comment.user.id } }" class="text-dark">
                  {{ comment.user.username }}
                </router-link>
              </span>
              <span class="text-secondary">{{ convertDate(comment.createdAt) }}</span>
            </p>
            <p v-if="editingComment != comment.id">{{ comment.message }}</p>
            <div v-else>
              <textarea v-model="comment.message" type="text" class="form-control rounded-0" rows="3" placeholder="What do you think about course"></textarea>
              <div class="text-right pt-2">
                <button @click="editComment(comment.id)" class="btn btn-sm btn-primary">Edit</button>
              </div>
            </div>
          </div>
          <div v-if="+comment.user.id === +auth.user.id" w="5">
            <div class="dropdown dropleft mb-1">
              <button class="btn dropdown-toggle shadow-none p-0 d-flex vertical-center" type="button" id="another-options-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <svg class="bi d-inline-block pointer" width="20" height="20">
                  <use xlink:href="../../assets/icons/bootstrap-icons.svg#three-dots"/>
                </svg>
              </button>
              <div class="dropdown-menu shadow" aria-labelledby="another-options-btn">
                <a @click="editCommentEnv(comment.id)" class="dropdown-item pointer">Edit</a>
                <a @click="deleteComment(comment.id)" class="dropdown-item pointer text-danger">Delete</a>
              </div>
            </div>
          </div>
          <div v-if="auth.user.role == 'admin'" w="5">
            <div class="dropdown dropleft mb-1">
              <button class="btn dropdown-toggle shadow-none p-0 d-flex vertical-center" type="button" id="another-options-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <svg class="bi d-inline-block pointer" width="20" height="20">
                  <use xlink:href="../../assets/icons/bootstrap-icons.svg#three-dots"/>
                </svg>
              </button>
              <div class="dropdown-menu shadow" aria-labelledby="another-options-btn">
                <a @click="adminDeleteComment(comment.id)" class="dropdown-item pointer text-danger">Delete</a>
              </div>
            </div>
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
import Navbar from "../utils/UserNavbar"
import CourseMixin from "../../mixins/courseMixin"
import VideoPlayer from "../utils/VideoPlayer"
import StarRating from "vue-star-rating"


export default {
  data: () => ({
    url: process.env.VUE_APP_MAIN_URL,
    course: {
      tags: []
    },
    editingComment: 0,
    channel: { subscribed: false, subscribersCount: 0 },
    comments: [],
    rate: 0,
    cannotRate: false,
    newCommentMessage: "",
  }),
  methods: {
    async rateCourse() {
      if (this.cannotRate) return

      this.rate = await this.$store.dispatch("rateCourse", {
        id: this.course.id,
        rate: this.rate
      })
      this.cannotRate = true
    },
    async toggleSubscribe() {
      const route = this.channel.subscribed ? "unsubscribe" : "subscribe"
      await this.axios({
        method: "post",
        url: `${process.env.VUE_APP_MAIN_URL}/api/users/${route}/${this.channel.id}`,
        headers: { "Authorization": `Bearer ${localStorage["access-token"]}` },
      })
      await this.$store.dispatch("reloadUser")

      if (this.channel.subscribed) {
        this.channel.subscribed = false
        this.channel.subscribersCount--
      } else {
        this.channel.subscribed = true
        this.channel.subscribersCount++
      }
    },
    async postComment() {
      if (!this.newCommentMessage) return

      const res = await this.axios({
        method: "post",
        url: `${process.env.VUE_APP_MAIN_URL}/api/comments/create/${this.course.id}`,
        headers: { "Authorization": `Bearer ${localStorage["access-token"]}` },
        data: { message: this.newCommentMessage }
      })
      this.newCommentMessage = ""
      this.comments.unshift(res.data)
    },
    async editComment(id) {
      const { message } = this.comments.find(item => item.id === id)
      await this.axios({
        method: "patch",
        url: `${process.env.VUE_APP_MAIN_URL}/api/comments/edit/${id}`,
        headers: { "Authorization": `Bearer ${localStorage["access-token"]}` },
        data: { message  }
      })
      this.editingComment = 0
    },
    async deleteComment(id) {
      await this.axios({
        method: "delete",
        url: `${process.env.VUE_APP_MAIN_URL}/api/comments/delete/${id}`,
        headers: { "Authorization": `Bearer ${localStorage["access-token"]}` },
      })
      const i = this.comments.findIndex((item) => +item.id === +id)
      this.comments.splice(i, 1)
    },
    async adminDeleteComment(id) {
      await this.axios({
        method: "delete",
        url: `${process.env.VUE_APP_MAIN_URL}/api/comments/admin-delete/${id}`,
        headers: { "Authorization": `Bearer ${localStorage["access-token"]}` },
      })
      const i = this.comments.findIndex((item) => +item.id === +id)
      this.comments.splice(i, 1)
    },

    editCommentEnv(id) {
      this.editingComment = id
    },
    convertDate(d) {
      const date = new Date(d).toGMTString()
      const parts = date.split(" ")
      const month = parts[2]
      const day = parts[1]
      const year = parts[3]

      return `${month} ${day}, ${year}`
    },
  },
  computed: {
    auth() {
      return this.$store.state.auth
    },
  },
  mixins: [CourseMixin],
  components: {
    Navbar, VideoPlayer, StarRating
  },
  async created() {
    const id = this.$route.params.id
    this.course = await this.$store.dispatch("getCourse", id)
    const aviable = Boolean(
      this.auth.user.role == "admin" ||
      +this.course.author.id == +this.auth.user.id ||
      this.auth.user.purchasedCourses.some((item) => +item.id === +id)
    )
    if (!aviable) return bus.$emit("redirect", "cabinet.purchased-courses")

    this.channel = this.course.author
    this.channel.subscribed = this.auth.user.subscriptions.some((item) => +item.id === +this.channel.id)
    this.comments = this.course.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    this.rate = this.course.rating

    $(this.$refs.container).addClass("bg-white")
  },
  mounted() {
  }
}
</script>

<style scoped>
  .user-image {
    width: 48px;
    height: 48px;
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
  #another-options-btn::before {
    content: "";
    display: none ;
  }
</style>
