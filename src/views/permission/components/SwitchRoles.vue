<template>
  <div>
    <div style="margin-bottom:15px;">
      权限： {{ roles }}
    </div>
    切换权限：
    <RadioGroup
      v-model="switchRoles"
      type="button"
    >
      <Radio label="editor" />
      <Radio label="admin" />
    </RadioGroup>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'SwitchRoles'
})
export default class extends Vue {
  get roles() {
    return UserModule.roles
  }

  get switchRoles() {
    return this.roles[0]
  }
}
</script>
