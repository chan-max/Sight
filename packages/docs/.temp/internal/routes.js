/**
 * Generated by "@vuepress/internal-routes"
 */

import { injectComponentOption, ensureAsyncComponentsLoaded } from '@app/util'
import rootMixins from '@internal/root-mixins'
import GlobalLayout from "C:\\Users\\Administrator\\AppData\\Roaming\\npm\\node_modules\\vuepress\\node_modules\\@vuepress\\core\\lib\\client\\components\\GlobalLayout.vue"

injectComponentOption(GlobalLayout, 'mixins', rootMixins)
export const routes = [
  {
    name: "v-58fedcd9",
    path: "/api/app.html",
    component: GlobalLayout,
    beforeEnter: (to, from, next) => {
      ensureAsyncComponentsLoaded("Layout", "v-58fedcd9").then(next)
    },
  },
  {
    name: "v-872c37b2",
    path: "/api/builtInComponent.html",
    component: GlobalLayout,
    beforeEnter: (to, from, next) => {
      ensureAsyncComponentsLoaded("Layout", "v-872c37b2").then(next)
    },
  },
  {
    name: "v-59fe2fad",
    path: "/api/builtInTag.html",
    component: GlobalLayout,
    beforeEnter: (to, from, next) => {
      ensureAsyncComponentsLoaded("Layout", "v-59fe2fad").then(next)
    },
  },
  {
    name: "v-d829abfa",
    path: "/api/builtInDirective.html",
    component: GlobalLayout,
    beforeEnter: (to, from, next) => {
      ensureAsyncComponentsLoaded("Layout", "v-d829abfa").then(next)
    },
  },
  {
    name: "v-7f37c92a",
    path: "/api/cssBuiltInFunction.html",
    component: GlobalLayout,
    beforeEnter: (to, from, next) => {
      ensureAsyncComponentsLoaded("Layout", "v-7f37c92a").then(next)
    },
  },
  {
    name: "v-0830846c",
    path: "/api/",
    component: GlobalLayout,
    beforeEnter: (to, from, next) => {
      ensureAsyncComponentsLoaded("Layout", "v-0830846c").then(next)
    },
  },
  {
    path: "/api/index.html",
    redirect: "/api/"
  },
  {
    name: "v-abf6d344",
    path: "/en/guide/readme..html",
    component: GlobalLayout,
    beforeEnter: (to, from, next) => {
      ensureAsyncComponentsLoaded("Layout", "v-abf6d344").then(next)
    },
  },
  {
    name: "v-6e7bad98",
    path: "/en/",
    component: GlobalLayout,
    beforeEnter: (to, from, next) => {
      ensureAsyncComponentsLoaded("Layout", "v-6e7bad98").then(next)
    },
  },
  {
    path: "/en/index.html",
    redirect: "/en/"
  },
  {
    name: "v-dd242ece",
    path: "/guide/install.html",
    component: GlobalLayout,
    beforeEnter: (to, from, next) => {
      ensureAsyncComponentsLoaded("Layout", "v-dd242ece").then(next)
    },
  },
  {
    name: "v-18dbbf8e",
    path: "/guide/intro.html",
    component: GlobalLayout,
    beforeEnter: (to, from, next) => {
      ensureAsyncComponentsLoaded("Layout", "v-18dbbf8e").then(next)
    },
  },
  {
    name: "v-1728bbb0",
    path: "/guide/",
    component: GlobalLayout,
    beforeEnter: (to, from, next) => {
      ensureAsyncComponentsLoaded("Layout", "v-1728bbb0").then(next)
    },
  },
  {
    path: "/guide/index.html",
    redirect: "/guide/"
  },
  {
    name: "v-60504615",
    path: "/",
    component: GlobalLayout,
    beforeEnter: (to, from, next) => {
      ensureAsyncComponentsLoaded("Layout", "v-60504615").then(next)
    },
  },
  {
    path: "/index.html",
    redirect: "/"
  },
  {
    name: "v-78ab5142",
    path: "/tutorial/app.html",
    component: GlobalLayout,
    beforeEnter: (to, from, next) => {
      ensureAsyncComponentsLoaded("Layout", "v-78ab5142").then(next)
    },
  },
  {
    name: "v-3941e078",
    path: "/tutorial/",
    component: GlobalLayout,
    beforeEnter: (to, from, next) => {
      ensureAsyncComponentsLoaded("Layout", "v-3941e078").then(next)
    },
  },
  {
    path: "/tutorial/index.html",
    redirect: "/tutorial/"
  },
  {
    name: "v-0e0d5b9a",
    path: "/tutorial/test.html",
    component: GlobalLayout,
    beforeEnter: (to, from, next) => {
      ensureAsyncComponentsLoaded("Layout", "v-0e0d5b9a").then(next)
    },
  },
  {
    path: '*',
    component: GlobalLayout
  }
]