<template>
  <li class="list-group-item overflow-hidden py-0 px-3" ref="channel">
    <div class="d-flex justify-content-between">
      <div class="main-info d-flex" style="flex-grow: 1">
        <div class="py-2 mr-1 user-image center">
          <img :src="`${url}/${user.profilePicture}`" alt="avatar" class="w-100 h-100 rounded-circle">
        </div>
        <div class="d-flex align-items-center py-2 username">
          <div>
            <p class="mb-0 ml-2 font-weight-500 user-username">
              <router-link :to="{ name: 'channels.courses', params: { id: user.id } }" class="text-dark">
                {{ user.username }}
              </router-link>
            </p>
            <p class="mb-0 ml-2 text-muted font-weight-500" style="font-size: 13px;">{{ user.subscribersCount }} subscribers</p>
          </div>
        </div>
        <div class="pl-4 d-flex align-items-center rating">
          <p class="mb-0 mr-1" data-toggle="tooltip" title="Channel's all courses average rating">Rating</p>
          <div class="px-2 pb-1 ml-1 rounded bg-transparent-dark">
            <StarRating
              v-if="averageRating"
              :star-size="18"
              :padding="1"
              :increment="0.5"
              :read-only="true"
              :show-rating="false"
              :rating="averageRating"
              active-color="#FFC107"
              inactive-color="#ffffff">
            </StarRating>
          </div>
        </div>
        <div class="pl-4 d-flex align-items-center courses">
          <p class="mb-0">Courses: <b>{{ user.courses.length }}</b></p>
        </div>
      </div>
      <div class="controls d-flex align-items-center">
        <button
          @click="toggleSubscribe()"
          :disabled="!auth.isAuthorized"
          :class="{
            'btn btn-sm mr-2 d-flex center': true,
            'btn-danger': !user.subscribed, 'btn-secondary': user.subscribed }">
          <p class="mb-0 mr-1">{{ user.subscribed ? 'Subscribed' : 'Subscribe' }}</p>
          <svg class="bi" width="14" height="14">
            <use v-if="!user.subscribed" xlink:href="../../assets/icons/bootstrap-icons.svg#bell"/>
            <use v-else xlink:href="../../assets/icons/bootstrap-icons.svg#bell-fill"/>
          </svg>
        </button>
      </div>
    </div>
  </li>
</template>

<script>

import $ from "jquery"
import StarRating from "vue-star-rating"


export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    url: process.env.VUE_APP_MAIN_URL,
    toggleSubscribeLoader: false,
    averageRating: 0,
  }),
  methods: {
    async toggleSubscribe() {
      if (this.toggleSubscribeLoader) return

      this.toggleSubscribeLoader = true
      await this.$store.dispatch("toggleSubscribe", this.user)
      this.toggleSubscribeLoader = false
    },
  },
  components: {
    StarRating,
  },
  computed: {
    auth() {
      return this.$store.state.auth
    },
  },
  created() {
    this.averageRating = this.user.courses.reduce((acc, current) => acc + current.rating, 0) / this.user.courses.length
  },
  mounted() {
    $(this.$refs.channel).find('[data-toggle="tooltip"]').tooltip()
  }
}
</script>


<style scoped> 
  .list-item-child {
   margin-top: .75rem; 
   margin-bottom: .75rem; 
  }
  .username {
    width: 308px;
  }
  .user-image {
    width: 40px;
  }
  .rating {
    width: 200px;
  }
  .courses {
    width: 198px;
  }
  .btn-danger {
    background: #CA0000 !important;
    text-transform: uppercase;
    font-weight: 500;
    letter-spacing: 1px;
  }
  .btn-secondary {
    background: #535353 !important;
    text-transform: uppercase;
    font-weight: 500;
    letter-spacing: 1px;
  }
</style>