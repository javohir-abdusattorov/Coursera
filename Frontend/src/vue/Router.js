
import VueRouter from "vue-router"

import Index from "../components/Index.vue"
import AuthRegister from "../components/Auth/Register.vue"
import AuthLogin from "../components/Auth/Login.vue"

import CreateCourse from "../components/course/Create"
import EditCourse from "../components/course/Edit"
import AllCourses from "../components/course/All"

import AdminNewCourses from "../components/admin/NewCourses"
import AdminAllCourses from "../components/admin/AllCourses"
import AdminCategories from "../components/admin/Categories"
import AdminUsers from "../components/admin/Users"

import AllChannels from "../components/user/AllChannels"
import ChannelCourses from "../components/user/ChannelCourses"

import UserLogs from "../components/cabinet/Logs"
import UserSavedCourses from "../components/cabinet/SavedCourses"
import UserPurchasedCourses from "../components/cabinet/PurchasedCourses"
import UserCourses from "../components/cabinet/AuthorCourses"
import UserPurchasedCourse from "../components/course/Watch"
import UserSettings from "../components/cabinet/Settings"


const routes = [
  {
    name: "index",
    path: "/",
    component: Index,
    meta: {
      auth: '0',
      title: "Coursera",
    }
  },

  // -- Auth routes --
  {
    name: "auth.register",
    path: "/auth/register",
    component: AuthRegister,
    meta: {
      auth: '-',
      title: "Registration | Coursera",
    }
  },
  {
    name: "auth.login",
    path: "/auth/login",
    component: AuthLogin,
    meta: {
      auth: '-',
      title: "Login | Coursera",
    }
  },

  // -- Course routes --
  {
    name: "course.all",
    path: "/courses/all",
    component: AllCourses,
    meta: {
      auth: '0',
      title: "All courses | Coursera",
    }
  },
  {
    name: "course.create",
    path: "/courses/create",
    component: CreateCourse,
    meta: {
      auth: '+',
      title: "Create course | Coursera",
    }
  },
  {
    name: "course.edit",
    path: "/courses/edit/:id",
    component: EditCourse,
    meta: {
      auth: '+',
      title: "Edit course | Coursera",
    }
  },

  // -- Admin cabinet --
  {
    name: "admin.new-courses",
    path: "/cabinet/admin/new-courses",
    component: AdminNewCourses,
    meta: {
      auth: '+',
      title: "Admin - New Courses | Coursera",
    }
  },
  {
    name: "admin.all-courses",
    path: "/cabinet/admin/all-courses",
    component: AdminAllCourses,
    meta: {
      auth: '+',
      title: "Admin - All Courses | Coursera",
    }
  },
  {
    name: "admin.categories",
    path: "/cabinet/admin/categories",
    component: AdminCategories,
    meta: {
      auth: '+',
      title: "Admin - Categories | Coursera",
    }
  },
  {
    name: "admin.users",
    path: "/cabinet/admin/users",
    component: AdminUsers,
    meta: {
      auth: '+',
      title: "Admin - Users | Coursera",
    }
  },

  // -- Channel --
  {
    name: "channels.all",
    path: "/channels/all",
    component: AllChannels,
    meta: {
      auth: '0',
      title: "All channels | Coursera",
    }
  },
  {
    name: "channels.courses",
    path: "/channels/:id",
    component: ChannelCourses,
    meta: {
      auth: '0',
    }
  },

  // -- Cabinet --
  {
    name: "cabinet.logs",
    path: "/cabinet/user/logs",
    component: UserLogs,
    meta: {
      auth: '+',
    }
  },
  {
    name: "cabinet.saved-courses",
    path: "/cabinet/user/courses/saved",
    component: UserSavedCourses,
    meta: {
      auth: '+',
    }
  },
  {
    name: "cabinet.my-courses",
    path: "/cabinet/user/courses/my",
    component: UserCourses,
    meta: {
      auth: '+',
    }
  },
  {
    name: "cabinet.purchased-courses",
    path: "/cabinet/user/courses/purchased",
    component: UserPurchasedCourses,
    meta: {
      auth: '+',
    }
  },
  {
    name: "cabinet.purchased-course",
    path: "/cabinet/user/courses/purchased/:id",
    component: UserPurchasedCourse,
    meta: {
      auth: '+',
    }
  },
  {
    name: "cabinet.settings",
    path: "/cabinet/user/settings",
    component: UserSettings,
    meta: {
      auth: '+',
    }
  },

]

const Router = new VueRouter({
  mode: "history",
  routes
})

Router.beforeResolve((to, from, next) => {
  const auth = to.meta.auth
  if (auth == "+" && !localStorage["access-token"]) next({ name: 'auth.login' })

  document.title = to.meta.title || `Coursera`
  next()
})


export default Router