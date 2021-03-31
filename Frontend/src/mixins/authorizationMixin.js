import axios from "axios"


export default {
	methods: {
    async checkAuthorization() {
      const token = localStorage["access-token"]
      if (!token) return false

      try {
        const q = `query { getMe(token: "${token}") {
          id, username, account, profilePicture, spam, subscribersCount, role,
          purchasedCourses { id, title }, savedCourses { id, title }, subscriptions { id }
        }}`
        const res = await axios({
          method: "post",
          url: `${process.env.VUE_APP_MAIN_URL}/${process.env.VUE_APP_GRAPHQL_URL}`,
          data: { query: q }
        })

        return { isAuthorized: true, user: res.data.data.getMe }
      } catch (error) {
        console.error(error)
        localStorage.removeItem("access-token")
        return { isAuthorized: false }
      }
    }
	}
}