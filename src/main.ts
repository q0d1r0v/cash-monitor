// imports
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

// router
import router from "./routes/router";

// import asn use quasar
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";
import { Quasar, Notify, Loading } from "quasar";

// store
import {createPinia} from 'pinia'
const pinia = createPinia()

createApp(App)
  .use(router)
  .use(Quasar, {
    plugins: {
        Notify,
        Loading
    }
  })
  .use(pinia)
  .mount("#app")
  .$nextTick(() => postMessage({ payload: "removeLoading" }, "*"));
