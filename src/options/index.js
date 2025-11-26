import './assets/scss/main.scss'

import { createApp } from 'vue'
import ExtensionOptions from './ExtensionOptions.vue'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// 
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
// 
library.add(fas, far);

const app = createApp(ExtensionOptions);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(Toast, {});

app.mount('#app')
