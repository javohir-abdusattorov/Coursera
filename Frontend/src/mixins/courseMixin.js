
import $ from "jquery"
import { bus } from "../main"


export default {

  methods: {
    async defaultSettings() {
      bus.$emit("show:loader")
      await this.$store.dispatch("getCategories")
      await this.$store.dispatch("getCourses")
      bus.$emit("hide:loader", false)

      $(".modal").modal("hide")

      // Events
      bus.$on("open:course-info-modal", (course) => this.openCourseModal(course))
      bus.$on("open:can-buy-course-modal", (data) => this.openCanBuyModal(data))
    },

    openCourseModal(course) {
      $(".modal").modal("hide")
      this.courseInfo = course
      this.courseInfo.addedAt = this.convertDate(course.createdAt)
      this.courseInfo.discountDeadline = this.calculateDeadline(course.discountDeadline)
      this.courseInfo.newPrice = course.price - ((course.price / 100) * course.discountPercent)
      $("#course-info").modal("show")
    },
    openCanBuyModal({ info, course }) {
      $(".modal").modal("hide")
      this.canBuyCourse = info
      this.canBuyCourse.title = course.title
      this.canBuyCourse.id = course.id
      this.buyCourseValidation = { success: false, message: "" }
      this.canBuyCourse.discountPercent = course.discountPercent
      $("#can-buy").modal("show")
    },
    async openCanBuyModalMostDiscount() {
      $(".modal").modal("hide")
      bus.$emit("show:loader")
      const info = await this.$store.dispatch("courseBuyInfo", this.mostDiscountCourse.id)
      bus.$emit("hide:loader")

      this.canBuyCourse = info
      this.canBuyCourse.id = this.mostDiscountCourse.id
      this.canBuyCourse.title = this.mostDiscountCourse.title
      this.buyCourseValidation = { success: false, message: "" }
      this.canBuyCourse.discountPercent = this.mostDiscountCourse.discountPercent
      $("#can-buy").modal("show")
    },
    async openCanBuyModalCurrentInfo() {
      $(".modal").modal("hide")
      bus.$emit("show:loader")
      const info = await this.$store.dispatch("courseBuyInfo", this.courseInfo.id)
      bus.$emit("hide:loader")

      this.canBuyCourse = info
      this.canBuyCourse.id = this.courseInfo.id
      this.canBuyCourse.title = this.courseInfo.title
      this.buyCourseValidation = { success: false, message: "" }
      this.canBuyCourse.discountPercent = this.courseInfo.discountPercent
      $("#can-buy").modal("show")
    },
    async buyCourse() {
      if (!this.canBuyCourse.canBuy) return
      bus.$emit("show:loader")
      const id = this.canBuyCourse.id
      const result = await this.$store.dispatch("buyCourse", id)
      if (result.error) {
        this.buyCourseValidation = { success: false, message: result.message }
      } else {
        this.buyCourseValidation = { success: true, message: "" }
        await this.$store.dispatch("reloadUser")
        await this.$store.dispatch("reloadCourse", id)
        setTimeout(() => $("#can-buy").modal("hide"), 2000)
      }
      bus.$emit("hide:loader")
    },
    convertDate(date) {
      return new Date(date).toISOString().split("T")[0].split("-").reverse().join(".")
    },
    calculateDeadline(deadline) {
      console.log(new Date(deadline))
      const last = new Date(deadline) - new Date()
      if (!last || last < 1) return false

      const sec = Math.floor(last / 1000)
      if (sec < 1) return false

      const min = Math.floor(sec / 60)
      if (min < 1) return `${sec}sec`

      const hour = Math.floor(min / 60)
      if (hour < 1) return `${min}m ${sec - (60 * min)}s`

      const day = Math.floor(hour / 24)
      if (day < 1) return `${hour}h ${min - (60 * hour)}m`

      return `${day}d ${hour - (24 * day)}h`
    },
  },
  computed: {
    filteredCourses() {
      let courses = [...this.courses]

      // Search 
      if (this.filters["search-title"]) {
        const q = new RegExp(this.filters["search-title"], "i")
        courses = courses.filter((item) => item.title.match(q))
      }
      if (this.filters["search-description"]) {
        const q = new RegExp(this.filters["search-description"], "gi")
        courses = courses.filter((item) => item.description.match(q))
      }
      if (this.filters["search-tag"]) {
        const q = new RegExp(this.filters["search-tag"], "i")
        courses = courses.filter((item) => item.tags.some((tag) => tag.match(q)))
      }

      // Main filters
      if (this.filters["price-min"]) {
        courses = courses.filter((item) => item.price >= this.filters["price-min"])
      }
      if (this.filters["price-max"]) {
        courses = courses.filter((item) => item.price < this.filters["price-max"])
      }
      if (this.filters["sold-min"]) {
        courses = courses.filter((item) => item.sold >= this.filters["sold-min"])
      }
      if (this.filters["sold-max"]) {
        courses = courses.filter((item) => item.sold < this.filters["sold-max"])
      }
      if (this.filters["rating-min"]) {
        courses = courses.filter((item) => item.rating >= this.filters["rating-min"])
      }
      if (this.filters["rating-max"]) {
        courses = courses.filter((item) => item.rating < this.filters["rating-max"])
      }
      if (this.filters["discount-min"]) {
        courses = courses.filter((item) => item.discountPercent >= this.filters["discount-min"])
      }
      if (this.filters["discount-max"]) {
        courses = courses.filter((item) => item.discountPercent < this.filters["discount-max"])
      }

      // Boolean filters
      if (this.filters["bool-discount"] !== "0") {
        courses = courses.filter((item) => {
          if (this.filters["bool-discount"] == "+") return item.discount
            else return !item.discount
        })
      }
      if (this.filters["bool-saved"] !== "0") {
        courses = courses.filter((item) => {
          if (this.filters["bool-saved"] == "+") return item.saved
            else return !item.saved
        })
      }

      // Category
      if (this.filters["category"]) {
        courses = courses.filter((item) => {
          return +item.category.id === +this.filters["category"]
        })
      }

      // Sort
      if (this.filters["sort"]) {
        const sortBy = this.filters["sort"]
        if (sortBy == "createdAt-") {
          courses.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        } else if (sortBy == "createdAt+") {
          courses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        } else if (sortBy == "price+") {
          courses.sort((a, b) => b.price - a.price)
        } else if (sortBy == "price-") {
          courses.sort((a, b) => a.price - b.price)
        } else if (sortBy == "sold+") {
          courses.sort((a, b) => b.sold - a.sold)
        } else if (sortBy == "sold-") {
          courses.sort((a, b) => a.sold - b.sold)
        } else if (sortBy == "rating+") {
          courses.sort((a, b) => b.rating - a.rating)
        } else if (sortBy == "rating-") {
          courses.sort((a, b) => a.rating - b.rating)
        } else if (sortBy == "discount+") {
          courses.sort((a, b) => b.discountPercent - a.discountPercent)
        } else if (sortBy == "discount-") {
          courses.sort((a, b) => a.discountPercent - b.discountPercent)
        }
      }

      return courses
    },
  }
}