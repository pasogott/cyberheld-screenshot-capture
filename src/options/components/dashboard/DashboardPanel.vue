<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { STORAGE_KEYS } from '@/utils/enums.js';
import { useInputStorageSync } from '@/composables/input-storage-sync';
// const emailsOnly = useInputStorageSync(STORAGE_KEYS.EXPORT_EMAILS_ONLY);

const name = useInputStorageSync(STORAGE_KEYS.USER_NAME);
const fileType = useInputStorageSync(STORAGE_KEYS.FILE_TYPE);
const enableShortcut = useInputStorageSync(STORAGE_KEYS.IS_KEYBOARD_SHORTCUT);
const fontSize = useInputStorageSync(STORAGE_KEYS.FONT_SIZE);
const bgColor = useInputStorageSync(STORAGE_KEYS.BG_COLOR, { defaultValue: '#ffffff' });
const textColor = useInputStorageSync(STORAGE_KEYS.TEXT_COLOR, { defaultValue: '#000000' });
const showName = useInputStorageSync(STORAGE_KEYS.SHOW_NAME);
const showTime = useInputStorageSync(STORAGE_KEYS.SHOW_TIME);
const showUrl = useInputStorageSync(STORAGE_KEYS.SHOW_URL);

const nowUTC = ref('');

const updateTime = () => {
  const now = new Date();
  nowUTC.value = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
};

onMounted(() => {
  updateTime();
  const interval = setInterval(updateTime, 1000);
  onUnmounted(() => clearInterval(interval));
});

const demoStyle = computed(() => ({
  backgroundColor: bgColor.value,
  color: textColor.value,
  fontSize: fontSize.value + 'px',
  borderRadius: '8px',
  border: '1px solid #dee2e6',
  padding: '1.5rem',
  minHeight: '110px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  marginTop: '1.5rem',
  whiteSpace: 'pre-line',
}));
</script>

<template>
  <!-- Reminder: Ensure Bootstrap & Font Awesome are included in your project -->
  <div class="container py-4 my-2" style="max-width: 480px;">
    <form autocomplete="off">
      <div class="mb-3">
        <label class="form-label" for="name"><i class="fa fa-user me-1"></i>Name</label>
        <input v-model="name" id="name" type="text" class="form-control" placeholder="Enter name" />
      </div>
      <div class="mb-3">
        <label class="form-label" for="fileType"><i class="fa fa-image me-1"></i>Image File Type</label>
        <select v-model="fileType" id="fileType" class="form-select">
          <option value="jpeg">JPEG</option>
          <option value="png">PNG</option>
        </select>
      </div>
      <div class="form-check form-switch">
        <input v-model="enableShortcut" id="enableShortcut" type="checkbox" class="form-check-input" role="switch" />
        <label class="form-check-label" for="enableShortcut">
          <i class="fa fa-keyboard me-1"></i>Enable shortcut
        </label>
      </div>
      <!-- Tip -->
      <div class="popup-tip">
        <font-awesome-icon icon="info-circle" class="tip-icon" />
        <span><span style="font-weight: bold;">Tip:</span> Try <font-awesome-icon icon="keyboard" class="kbd-icon" />
          Ctrl+Shift+7 directly from the webpage</span>
      </div>
      <hr>
      <!-- show name, time, url -->
      <div class="row mb-2 px-5">
        <div class="col form-check form-switch">
          <label class="form-check-label" for="showName">
            <i class="fa fa-user me-1"></i>Show name
          </label>
          <input v-model="showName" id="showName" type="checkbox" class="form-check-input" role="switch" />
        </div>
        <div class="col form-check form-switch">
          <label class="form-check-label" for="showTime">
            <i class="fa fa-clock me-1"></i>Show time
          </label>
          <input v-model="showTime" id="showTime" type="checkbox" class="form-check-input" role="switch" />
        </div>
        <div class="col form-check form-switch">
          <label class="form-check-label" for="showUrl">
            <i class="fa fa-link me-1"></i>Show URL
          </label>
          <input v-model="showUrl" id="showUrl" type="checkbox" class="form-check-input" role="switch" />
        </div>
      </div>
      <!-- font size -->
      <div class="mb-3">
        <label class="form-label" for="fontSize"><i class="fa fa-text-height me-1"></i>Font size (px)</label>
        <input v-model="fontSize" id="fontSize" type="number" min="8" max="72" class="form-control"
          style="max-width:120px;" />
      </div>
      <!-- background and text color -->
      <div class="row mb-3">
        <div class="col">
          <label class="form-label" for="bgColor"><i class="fa fa-fill-drip me-1"></i>Background</label>
          <input v-model="bgColor" id="bgColor" type="color" class="form-control form-control-color" />
        </div>
        <div class="col">
          <label class="form-label" for="textColor"><i class="fa fa-font me-1"></i>Text</label>
          <input v-model="textColor" id="textColor" type="color" class="form-control form-control-color" />
        </div>
      </div>
    </form>
    <div :style="demoStyle" class="shadow-sm mt-4">
      <div class="mt-2 small">
        <div v-if="showName">Name: {{ name }}</div>
        <div v-if="showTime">Time (UTC): {{ nowUTC }}</div>
        <div v-if="showUrl">URL: https://google.com/</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  /* background: burlywood; */
  background: #a3e2cd;
  border-radius: 12px;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.03);
}

.form-control-color {
  padding: 0.15rem;
  width: 2.5rem;
  height: 2.5rem;
}

.popup-tip {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  font-size: 0.83rem;
  color: #888;
  /* background: #f8f9fa; */
  /* border-top: 1px solid #eee; */
  padding-left: 6px;
  /* min-height: 32px; */
  letter-spacing: 0.01em;
}

.tip-icon {
  color: #0d6efd;
  font-size: 1em;
  margin-right: 2px;
}

.kbd-icon {
  font-size: 0.95em;
  margin: 0 2px 0 4px;
  color: #444;
}
</style>
