import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"

import AuthorizationMixin from "../mixins/authorizationMixin"

Vue.use(Vuex)

const coursePerSection = 5
const defaultUser = {
  id: "0", username: "", account: 0, profilePicture: "", spam: true, subscribersCount: 0,
  role: "user", purchasedCourses: [], savedCourses: [],
}
const defaultCourse = `
  id, title, description, price, video, poster, sold, rating, discount, discountPercent, discountDeadline,
  active, saved, tags, createdAt, updatedAt,
  author { id, username, profilePicture }, category { name, id }
`
const defaultChannel = `
  id, username, subscribersCount, spam, profilePicture, courses { ${defaultCourse} }
`


export default new Vuex.Store({
  state: {
    auth: {
      isAuthorized: false,
      user: defaultUser,
    },
    categories: [],
    courses: [],
    channels: [],
  },

  getters: {
    // Courses
    courses(state) {
      const courses = [...state.courses].filter((item) => item.active === true)
      return courses
    },
    getGoldenCourses(state, getters) {
      const courses = getters.courses.filter((item) => item.saved === true).slice(0, coursePerSection)
      courses.sort((a, b) => b.rating - a.rating)
      return courses
    },
    getBestSellerCourses(state, getters) {
      const courses = getters.courses.sort((a, b) => b.sold - a.sold).slice(0, coursePerSection)
      return courses
    },
    getMostRatedCourses(state, getters) {
      const courses = getters.courses.sort((a, b) => b.rating - a.rating).slice(0, coursePerSection)
      return courses
    },
    getMostDiscountCourse(state, getters) {
      const course = getters.courses.reduce((prev, current) => {
        return (prev.discountPercent > current.discountPercent) ? prev : current
      }, {})
      return course
    },
    getNotActivatedCourses(state) {
      const courses = [...state.courses].filter((item) => item.active === false)
      courses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      return courses
    },

    // User
    channels(state) {
      const data = [...state.channels].filter((item) => !item.spam)
      return data
    },
    getChannels(state, getters) {
      if (!state.auth.isAuthorized) return getters.channels
      const data = getters.channels.filter((item) => +item.id !== +state.auth.user.id)
      return data
    },
  },

  mutations: {
    // Authorization
    authorize(state, user) {
      state.auth.isAuthorized = true
      state.auth.user = user
    },
    login(state, { user, token }) {
      state.auth.isAuthorized = true
      state.auth.user = user
      localStorage["access-token"] = token
    },
    logout(state) {
      state.auth.isAuthorized = false
      state.auth.user = defaultUser
      localStorage.removeItem("access-token")
    },

    // Course
    reloadCourse(state, course) {
      const i = state.courses.findIndex(item => +item.id === +course.id)
      Vue.set(state.courses, i, course)
    },
    courseDeleted(state, id) {
      const i = state.courses.findIndex(item => +item.id === +id)
      state.courses.splice(i, 1)
    },

    // Category
    categoryCreated(state, category) {
      state.categories.push(category)
    },
    categoryChanged(state, category) {
      const i = state.categories.findIndex(item => +item.id === +category.id)
      const updatedCategory = state.categories[i]
      updatedCategory.name = category.name
      Vue.set(state.categories, i, updatedCategory)
    },

    // User
    channelChanged(state, channel) {
      const i = state.channels.findIndex((item) => +item.id === +channel.id)
      Vue.set(state.channels, i, channel)
    },
  },

  actions: {
    // Authorization
    async checkUserAuthorization({ state, commit }) {
      if (state.auth.isAuthorized) return
      const auth = await AuthorizationMixin.methods.checkAuthorization()

      if (auth.isAuthorized) commit("authorize", auth.user)
      else commit("logout")
    },
    async reloadUser({ commit }) {
      const auth = await AuthorizationMixin.methods.checkAuthorization()
      if (auth.isAuthorized) commit("authorize", auth.user)
      else commit("logout")
    },
    async getUsers({ dispatch }) {
      const res = await dispatch("query", `
        getAllUsers { id, username, subscribersCount, spam, purchasedCourses { id }, courses { id } }
      `)
      return res.getAllUsers
    },
    async getChannels({ state, dispatch }) {
      state.channels = []
      const res = await dispatch("query", `
        getAllUsers { ${defaultChannel} }
      `)
      const channels = res.getAllUsers
      const isAuthorized = state.auth.isAuthorized
      const userSubscriptions = state.auth.user.subscriptions.map((item) => +item.id)

      for (const channel of channels) {
        if (isAuthorized) {
          channel.subscribed = userSubscriptions.includes(+channel.id)
        } else channel.subscribed = false
      }
      state.channels = channels
    },
    async getChannel({ state, dispatch }, channelID) {
      state.channels = []
      const res = await dispatch("query", `
        getUser (id: ${channelID}) { ${defaultChannel} }
      `)
      const channel = res.getUser
      const isAuthorized = state.auth.isAuthorized
      const userSubscriptions = state.auth.user.subscriptions.map((item) => +item.id)

      if (isAuthorized) {
        channel.subscribed = userSubscriptions.includes(+channel.id)
      } else channel.subscribed = false

      state.channels = [channel]
    },
    async toggleSubscribe({ commit, dispatch }, channel) {
      const route = channel.subscribed ? "unsubscribe" : "subscribe"
      await axios({
        method: "post",
        url: `${process.env.VUE_APP_MAIN_URL}/api/users/${route}/${channel.id}`,
        headers: { "Authorization": `Bearer ${localStorage["access-token"]}` },
      })
      await dispatch("reloadUser")

      if (channel.subscribed) {
        channel.subscribed = false
        channel.subscribersCount--
      } else {
        channel.subscribed = true
        channel.subscribersCount++
      }
      
      commit("channelChanged", channel)
    },
    login: ({ commit }, data) => commit("login", data),
    logout: ({ commit }) => commit("logout"),

    // Courses
    async getCourses({ state, dispatch }) {
      state.courses = []
      const res = await dispatch("query", `
        getAllCourses { ${defaultCourse} }
      `)
      const courses = res.getAllCourses
      for (const course of courses) {
        course.cannotBuy = Boolean(
          (state.auth.isAuthorized && +course.author.id === +state.auth.user.id) ||
          (state.auth.isAuthorized && state.auth.user.purchasedCourses.some((item) => +item.id === +course.id))
        )
        course.userSaved = Boolean(state.auth.isAuthorized && state.auth.user.savedCourses.some((item) => +item.id === +course.id))
      }
      state.courses = courses
    },
    async getChannelCourses({ state, dispatch }, channelID) {
      state.courses = []
      const res = await dispatch("query", `
        getAuthorCourses (author: ${channelID}) { ${defaultCourse} }
      `)
      const courses = res.getAuthorCourses
      for (const course of courses) {
        course.cannotBuy = Boolean(
          (state.auth.isAuthorized && +course.author.id === +state.auth.user.id) ||
          (state.auth.isAuthorized && state.auth.user.purchasedCourses.some((item) => +item.id === +course.id))
        )
        course.userSaved = Boolean(state.auth.isAuthorized && state.auth.user.savedCourses.some((item) => +item.id === +course.id))
      }
      state.courses = courses
    },
    async getUserSavedCourses({ state, dispatch }) {
      state.courses = []
      const res = await dispatch("query", `
        getFavouriteCourses (token: "${localStorage["access-token"]}") { ${defaultCourse} }
      `)
      const courses = res.getFavouriteCourses
      for (const course of courses) {
        course.cannotBuy = Boolean(
          (state.auth.isAuthorized && +course.author.id === +state.auth.user.id) ||
          (state.auth.isAuthorized && state.auth.user.purchasedCourses.some((item) => +item.id === +course.id))
        )
        course.userSaved = Boolean(state.auth.isAuthorized && state.auth.user.savedCourses.some((item) => +item.id === +course.id))
      }
      state.courses = courses
    },
    async getUserPurchasedCourses({ state, dispatch }) {
      state.courses = []
      const res = await dispatch("query", `
        getMe (token: "${localStorage["access-token"]}") { purchasedCourses { ${defaultCourse} } }
      `)
      const courses = res.getMe.purchasedCourses
      for (const course of courses) {
        course.cannotBuy = Boolean(
          (state.auth.isAuthorized && +course.author.id === +state.auth.user.id) ||
          (state.auth.isAuthorized && state.auth.user.purchasedCourses.some((item) => +item.id === +course.id))
        )
        course.userSaved = Boolean(state.auth.isAuthorized && state.auth.user.savedCourses.some((item) => +item.id === +course.id))
      }
      state.courses = courses
    },
    async getUserCourses({ state, dispatch }) {
      state.courses = []
      const res = await dispatch("query", `
        getMyCourses (token: "${localStorage["access-token"]}") { ${defaultCourse} }
      `)
      const courses = res.getMyCourses
      for (const course of courses) {
        course.cannotBuy = Boolean(
          (state.auth.isAuthorized && +course.author.id === +state.auth.user.id) ||
          (state.auth.isAuthorized && state.auth.user.purchasedCourses.some((item) => +item.id === +course.id))
        )
        course.userSaved = Boolean(state.auth.isAuthorized && state.auth.user.savedCourses.some((item) => +item.id === +course.id))
      }
      state.courses = courses
    },
    async reloadCourse({ state, dispatch, commit }, id) {
      const res = await dispatch("query", `
        getCourse (id: ${id}) { ${defaultCourse} }
      `)

      const course = res.getCourse
      course.cannotBuy = Boolean(
        (state.auth.isAuthorized && +course.author.id === +state.auth.user.id) ||
        (state.auth.isAuthorized && state.auth.user.purchasedCourses.some((item) => +item.id === +course.id))
      )
      course.userSaved = Boolean(state.auth.isAuthorized && state.auth.user.savedCourses.some((item) => +item.id === +id))
      commit("reloadCourse", course)

      return course
    },
    async getCourse({ dispatch }, id) {
      const res = await dispatch("query", `
        getCourse (id: ${id}) {
          id, tags, title, sold, rating, createdAt, description, video, poster, price, discount, discountDeadline, discountPercent
          author {
            id, username, profilePicture, subscribersCount, 
          }
          comments {
            id, message, createdAt, user {
              id, username, profilePicture
            }
          }
          category { id }
        }
      `)
      return res.getCourse
    },
    async courseBuyInfo(state, id) {
      try {
        const res = await axios({
          method: "post",
          url: `${process.env.VUE_APP_MAIN_URL}/api/courses/can-buy/${id}`,
          headers: { "Authorization": `Bearer ${localStorage["access-token"]}` },
        })
        return res.data
      } catch (err) {
        const errorText = err.response.data.message ? err.response.data.message : err.response.statusText
        return {
          error: true,
          message: errorText
        }
      }
    },
    async courseReturnInfo(state, id) {
      try {
        const res = await axios({
          method: "post",
          url: `${process.env.VUE_APP_MAIN_URL}/api/courses/can-return/${id}`,
          headers: { "Authorization": `Bearer ${localStorage["access-token"]}` },
        })
        return res.data
      } catch (err) {
        const errorText = err.response.data.message ? err.response.data.message : err.response.statusText
        return {
          error: true,
          message: errorText
        }
      }
    },
    async toggleUserSaved(state, { id, saved }) {
      const route = saved ? "add-saved" : "remove-saved"
      await axios({
        method: "post",
        url: `${process.env.VUE_APP_MAIN_URL}/api/courses/${route}/${id}`,
        headers: { "Authorization": `Bearer ${localStorage["access-token"]}` },
      })
    },
    async toggleAdminSaved(state, id) {
      const res = await axios({
        method: "patch",
        url: `${process.env.VUE_APP_MAIN_URL}/api/courses/toggle-saved/${id}`,
        headers: { "Authorization": `Bearer ${localStorage["access-token"]}` },
      })
      return res.data.saved
    },
    async buyCourse(context, id) {
      try {
        await axios({
          method: "post",
          url: `${process.env.VUE_APP_MAIN_URL}/api/courses/buy/${id}`,
          headers: { "Authorization": `Bearer ${localStorage["access-token"]}` }
        })
        return { error: false }
      } catch(err) {
        const errorText = err.response.data.message ? err.response.data.message : err.response.statusText
        return { error: true, message: errorText }
      }
    },
    async rateCourse(context, { id, rate }) {
      try {
        const res = await axios({
          method: "patch",
          url: `${process.env.VUE_APP_MAIN_URL}/api/courses/rate/${id}`,
          headers: { "Authorization": `Bearer ${localStorage["access-token"]}` },
          data: { rating: rate }
        })
        return res.data
      } catch(err) {
        console.log(err.response)
      }
    },
    async returnCourse(context, id) {
      try {
        await axios({
          method: "delete",
          url: `${process.env.VUE_APP_MAIN_URL}/api/courses/return/${id}`,
          headers: { "Authorization": `Bearer ${localStorage["access-token"]}` }
        })
        return { error: false }
      } catch(err) {
        const errorText = err.response.data.message ? err.response.data.message : err.response.statusText
        return { error: true, message: errorText }
      }
    },
    async activateCourse({ dispatch }, course) {
      await axios({
        method: "post",
        url: `${process.env.VUE_APP_MAIN_URL}/api/courses/activate-course/${course.id}`,
        headers: { "Authorization": `Bearer ${localStorage["access-token"]}` },
      })
      dispatch("courseChanged", course)
    },
    async disableCourse({ dispatch }, id) {
      await axios({
        method: "post",
        url: `${process.env.VUE_APP_MAIN_URL}/api/courses/disable-course/${id}`,
        headers: { "Authorization": `Bearer ${localStorage["access-token"]}` },
      })
      dispatch("courseDeleted", id)
    },
    async deleteCourse({ dispatch }, id) {
      await axios({
        method: "delete",
        url: `${process.env.VUE_APP_MAIN_URL}/api/courses/delete/${id}`,
        headers: { "Authorization": `Bearer ${localStorage["access-token"]}` },
      })
      dispatch("courseDeleted", id)
    },
    courseChanged({ commit }, course) {
      commit("reloadCourse", course)
    },
    courseDeleted({ commit }, id) {
      commit("courseDeleted", id)
    },

    // Category
    async getCategories({ state, dispatch }) {
      const res = await dispatch("query", `
        getAllCategories { id, name, courses { id } }
      `)
      state.categories = res.getAllCategories
    },
    async categoryCreated({ commit }, data) {
      commit("categoryCreated", data)
    },
    async categoryChanged({ commit }, data) {
      commit("categoryChanged", data)
    },

    // For sending Graphql queries
    async query(context, q) {
      return new Promise((resolve) => {
        axios({
          method: "post",
          url: `${process.env.VUE_APP_MAIN_URL}/${process.env.VUE_APP_GRAPHQL_URL}`,
          data: { query: `query { ${q} }` }
        }).then((res) => {
          resolve(res.data.data)
        }).catch((err) => {
          console.error(err.response)
        })
      })
    }
  }
})