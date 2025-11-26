import '@/assets/popup.css'

import { createApp } from 'vue'
import ExtensionPopup from './ExtensionPopup.vue'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// 
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
// 


library.add(fas, far, fab);

const app = createApp(ExtensionPopup);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(Toast, {});

app.mount('#app')


console.log("popup")