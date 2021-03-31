<template>
  <li class="list-group-item overflow-hidden py-0 px-3" ref="course">
    <div class="d-flex justify-content-between">
      <div class="main-info d-flex" style="flex-grow: 1">
        <div class="list-item-child">
          <p class="mb-0 ml-2">{{ category.name }} - <b>{{ category.courses.length }} courses</b></p>
        </div>
      </div>
      <div class="controls d-flex align-items-center">
        <button
          @click="edit()"
          class="btn btn-sm btn-primary">
          Edit
        </button>
      </div>
    </div>
  </li>
</template>

<script>

import $ from "jquery"
import { bus } from "../../main"


export default {
  props: {
    category: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
  }),
  methods: {
    edit() {
      bus.$emit("edit:category", this.category)
    }
  },
  computed: {
  },
  async created() {
    bus
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
</style>
