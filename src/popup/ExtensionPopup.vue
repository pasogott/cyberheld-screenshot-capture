<script setup>
import { ref } from 'vue';
import { useInputStorageSync } from '@/composables/input-storage-sync';
import { STORAGE_KEYS } from '@/utils/enums';
import { sendMsgToActiveTab } from '@/utils/clib';
import { POPUP_MESSAGES_TYPES, CONTENT_MESSAGES_TYPES } from '@/utils/enums';

// Sync all state with storage
const isActive = useInputStorageSync(STORAGE_KEYS.IS_ACTIVE, { defaultValue: true, onChange: settingsChanged });
const trigger = useInputStorageSync(STORAGE_KEYS.TRIGGER_TYPE, { onChange: settingsChanged });
const shotIntervalSeconds = useInputStorageSync(STORAGE_KEYS.SHOT_INTERVAL_SECONDS, { onChange: settingsChanged });
const scrollPercent = useInputStorageSync(STORAGE_KEYS.SCROLL_PERCENT, { onChange: settingsChanged });
const fileType = useInputStorageSync(STORAGE_KEYS.FILE_TYPE, { onChange: settingsChanged });
const downloadAuto = useInputStorageSync(STORAGE_KEYS.IS_DOWNLOAD_AUTO, { onChange: settingsChanged });
const downloadGallery = useInputStorageSync(STORAGE_KEYS.IS_SAVE_TO_GALLERY, { onChange: settingsChanged });

const scrollOptions = [30, 40, 50, 60];

const toggleActive = () => {
  isActive.value = !isActive.value;
  sendMsgToActiveTab({ type: CONTENT_MESSAGES_TYPES.RELOAD_SETTINGS });
};

let isPageActive = ref(false);
pageActiveCheck()
const togglePageActive = () => {
  // TODO: Implement page-specific toggle logic
  console.log('Toggle active for current page');
  isPageActive.value = !isPageActive.value;
  setPageActive()
};
async function pageActiveCheck() {
  let res = await sendMsgToActiveTab({ type: CONTENT_MESSAGES_TYPES.PAGE_ACTIVE_CHECK })
  isPageActive.value = res.value;
  console.log(`isPageActive: ${isPageActive.value}`)
}

async function setPageActive() {
  sendMsgToActiveTab({ type: CONTENT_MESSAGES_TYPES.PAGE_ACTIVE_SET, value: isPageActive.value })
}

async function settingsChanged() {
  sendMsgToActiveTab({ type: CONTENT_MESSAGES_TYPES.RELOAD_SETTINGS })
}

const setScrollPercent = (percent) => {
  if (trigger.value !== 'scroll') return;
  scrollPercent.value = percent;
};
</script>

<template>
  <div class="popup-container">
    <header class="popup-header">
      <button type="button" class="status-toggle" :class="{ inactive: !isActive }" @click="toggleActive"
        aria-pressed="isActive" aria-label="Toggle extension active state" title="Active for all pages">
        <font-awesome-icon icon="fa-solid fa-power-off" />
      </button>
      <div class="flex-grow-1 ms-2">
        <div class="fw-semibold">Cyberheld</div>
        <!-- <small class="text-muted">Tap the icon to pause or resume captures</small> -->
      </div>
      <button type="button" class="status-toggle page-toggle" :class="{ inactive: !isPageActive }"
        @click="togglePageActive" aria-label="Toggle extension for current page" title="Active for current page">
        <font-awesome-icon icon="fa-solid fa-file" />
      </button>
    </header>

    <main class="popup-body" :class="{ 'is-disabled': !isActive && !isPageActive }">
      <section class="section-card">
        <div class="section-title">
          <font-awesome-icon icon="fa-solid fa-camera" />
          <span>Capture trigger</span>
        </div>



        <div class="trigger-option" :class="{ active: trigger === 'scroll' }">
          <div class="form-check align-items-start">
            <input class="form-check-input" type="radio" name="captureTrigger" id="triggerScroll" value="scroll"
              v-model="trigger">
            <label class="form-check-label w-100" for="triggerScroll">
              <div class="option-heading">On scroll depth</div>
              <p class="option-description">Trigger captures based on how far the page has been scrolled.</p>
            </label>

            <div class="option-control">
              <label class="form-label mb-1">Scroll threshold</label>
              <div class="d-flex flex-wrap align-items-center gap-2 threshold-row">
                <div class="input-group input-group-sm threshold-input">
                  <input type="number" class="form-control" min="0" max="100" step="5" v-model="scrollPercent"
                    :disabled="trigger !== 'scroll'">
                  <span class="input-group-text">%</span>
                </div>
                <div class="preset-buttons d-flex flex-wrap gap-2">
                  <button v-for="percent in scrollOptions" :key="percent" type="button"
                    class="btn btn-outline-secondary btn-sm preset-btn" @pointerdown.stop @pointerup.stop
                    @click.stop.prevent="setScrollPercent(percent)" :disabled="trigger !== 'scroll'">
                    {{ percent }}%
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section-card">
        <div class="section-title">
          <font-awesome-icon icon="fa-solid fa-file-image" />
          <span>File type</span>
        </div>

        <div class="d-flex gap-2">
          <div class="choice-pill" :class="{ active: fileType === 'png' }">
            <input type="radio" class="btn-check" name="fileType" id="fileTypePng" value="png" v-model="fileType">
            <label class="btn btn-outline-secondary btn-sm w-100" for="fileTypePng">PNG</label>
          </div>
          <div class="choice-pill" :class="{ active: fileType === 'jpg' }">
            <input type="radio" class="btn-check" name="fileType" id="fileTypeJpg" value="jpg" v-model="fileType">
            <label class="btn btn-outline-secondary btn-sm w-100" for="fileTypeJpg">JPG</label>
          </div>
        </div>
        <small class="text-muted d-block mt-2">PNG keeps every pixel crisp; JPG keeps file sizes lighter.</small>
      </section>

      <section class="section-card mb-1">
        <div class="section-title">
          <font-awesome-icon icon="fa-solid fa-download" />
          <span>Download options</span>
        </div>

        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="autoDownloadSwitch" v-model="downloadAuto">
          <label class="form-check-label" for="autoDownloadSwitch">Auto-download after capture</label>
        </div>
        <!-- <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="gallerySwitch" v-model="downloadGallery">
          <label class="form-check-label" for="gallerySwitch">Save to extension gallery</label>
        </div> -->
        <small class="text-muted d-block mt-2">Fine-tune once capture logic is wired up.</small>
      </section>

      <div v-if="!isActive && !isPageActive" class="body-overlay">
        <font-awesome-icon icon="fa-solid fa-ban" />
        <span>Extension paused</span>
      </div>
    </main>
  </div>
</template>

<style scoped>
.popup-container {
  width: 350px;
  height: 400px;
  display: flex;
  flex-direction: column;
  border: 1px solid #d9dee7;
  overflow: hidden;
  background-color: #fff;
  font-size: 0.85rem;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  background-color: #f3f5f9;
  border-bottom: 1px solid #e3e7ef;
}

.status-toggle {
  border: none;
  background: rgba(13, 110, 253, 0.12);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bs-primary);
  transition: background-color 0.2s ease, color 0.2s ease;
  cursor: pointer;
}

.status-toggle.inactive {
  background: #eef1f7;
  color: #9aa1b3;
}

.status-chip {
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(13, 110, 253, 0.1);
  color: var(--bs-primary);
  font-size: 0.75rem;
}

.status-chip.inactive {
  background: #e6e8ee;
  color: #687087;
}

.popup-body {
  flex: 1;
  padding: 2px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  position: relative;
}

.popup-body.is-disabled {
  filter: grayscale(0.3) brightness(0.92);
  overflow: hidden;
}

.section-card {
  border: 1px solid #e6e9f3;
  border-radius: 12px;
  padding: 12px;
  background-color: #fbfcfe;
  box-shadow: 0 1px 2px rgba(18, 38, 63, 0.04);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1c2333;
}

.section-title :deep(svg) {
  color: var(--bs-primary);
}

.trigger-option {
  border: 1px solid #e3e7f0;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fff;
  transition: all 0.2s ease;
  margin-top: 10px;
}

.trigger-option:first-of-type {
  margin-top: 0;
}

.trigger-option.active {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.12);
  background: #f0f5ff;
}

.trigger-option .form-check-label {
  display: block;
  cursor: pointer;
}

.option-heading {
  font-weight: 600;
  color: #1c2333;
}

.option-description {
  margin-bottom: 8px;
  color: #6c7685;
  font-size: 0.8rem;
}

.option-control {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  padding: 8px;
  border: 1px dashed #d5dae6;
}

.option-control .form-label {
  font-size: 0.75rem;
  color: #4b5466;
}

.choice-pill {
  position: relative;
  flex: 1;
}

.choice-pill .btn {
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.choice-pill.active .btn {
  color: #0b5ed7;
  background-color: rgba(13, 110, 253, 0.12);
  border-color: rgba(13, 110, 253, 0.4);
  box-shadow: 0 0 0 1px rgba(13, 110, 253, 0.3);
}

.section-card .form-switch {
  padding-left: 2.2em;
  margin-bottom: 6px;
}

.section-card .form-switch:last-of-type {
  margin-bottom: 0;
}

.threshold-input {
  min-width: 90px;
}

.threshold-row {
  align-items: stretch !important;
}

.preset-btn {
  border-radius: 8px;
  min-width: 52px;
}

.preset-btn:disabled {
  pointer-events: none;
}

.body-overlay {
  position: absolute;
  inset: 0;
  background: rgba(245, 247, 252, 0.72);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #6b7285;
  font-weight: 600;
  pointer-events: all;
  cursor: not-allowed;
}

.body-overlay :deep(svg) {
  font-size: 1.2rem;
}
</style>
