<template>
  <div
    v-if="showSettings"
    id="setting"
  >
    <svg-icon
      :name="isShowSettingPlane? 'setting': 'setting'"
      @click="click"
    />
    <right-panel v-model="isShowSettingPlane">
      <settings />
    </right-panel>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import RightPanel from '@/components/RightPanel/index.vue'
import Settings from '@/layout/components/Settings/index.vue'
import { SettingsModule } from '@/store/modules/settings'

@Component({
  name: 'Setting',
  components: {
    RightPanel,
    Settings
  }
})
export default class extends Vue {
  private isShowSettingPlane = false;

  get showSettings() {
    return SettingsModule.showSettings
  }

  private click() {
    this.isShowSettingPlane = !this.isShowSettingPlane
  }
}
</script>
