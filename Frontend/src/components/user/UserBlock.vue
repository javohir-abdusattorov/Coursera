<template>
  <li class="list-group-item overflow-hidden py-0 px-3" ref="course">
    <div class="d-flex justify-content-between">
      <div class="main-info d-flex" style="flex-grow: 1">
        <div class="list-item-child username">
          <p class="mb-0 ml-2">{{ user.username }} - <b>{{ user.subscribersCount }} subscribers</b></p>
        </div>
        <div class="px-3 border-left center purchased">
          <p class="mb-0">Purchased courses: <b>{{ user.purchasedCourses.length }}</b></p>
        </div>
        <div class="pl-4 border-left d-flex align-items-center courses">
          <p class="mb-0">Own courses: <b>{{ user.courses.length }}</b></p>
        </div>
      </div>
      <div class="controls d-flex align-items-center">
        <button
          @click="toggleSpam()"
          :class="{ 'btn btn-sm mr-2 d-flex center': true, 'btn-danger': user.spam, 'btn-success': !user.spam }">
          <p class="mb-0 mr-1">{{ user.spam ? 'Remove from spam' : 'Add to spam' }}</p>
          <svg class="bi" width="14" height="14">
            <use v-if="user.spam" xlink:href="../../assets/icons/bootstrap-icons.svg#trash-fill"/>
            <use v-else xlink:href="../../assets/icons/bootstrap-icons.svg#asterisk"/>
          </svg>
        </button>
      </div>
    </div>
  </li>
</template>

<script>

import { bus } from "../../main"


export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
  }),
  methods: {
    toggleSpam() {
      bus.$emit("toggle-spam:user", this.user)
    },
  },
  computed: {
  },
  async created() {
  },
  mounted() {
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
  .purchased {
    width: 200px;
  }
  .courses {
    width: 198px;
  }
</style>