<template>
  <div class="app-container">
    <switch-roles @change="handleRolesChange" />
    <div
      :key="key"
      style="margin-top:30px;"
    >
      <div>
        <span
          v-permission="['admin']"
          class="permission-alert"
        >
          Only
          <Tag
            class="permission-tag"
          >admin</Tag> can see this
        </span>
        <Tag
          v-permission="['admin']"
          class="permission-sourceCode"
        >
          v-permission="['admin']"
        </Tag>
      </div>

      <div>
        <span
          v-permission="['editor']"
          class="permission-alert"
        >
          Only
          <Tag
            class="permission-tag"
          >editor</Tag> can see this
        </span>
        <Tag
          v-permission="['editor']"
          class="permission-sourceCode"
        >
          v-permission="['editor']"
        </Tag>
      </div>

      <div>
        <span
          v-permission="['admin','editor']"
          class="permission-alert"
        >
          Both
          <Tag
            class="permission-tag"
          >admin</Tag> and
          <Tag
            class="permission-tag"
          >editor</Tag> can see this
        </span>
        <Tag
          v-permission="['admin','editor']"
          class="permission-sourceCode"
        >
          v-permission="['admin','editor']"
        </Tag>
      </div>
    </div>

    <div
      :key="'checkPermission'+key"
      style="margin-top:60px;"
    >
      <aside>
        permission.tips
        <br> e.g.
      </aside>

      <Tabs
        type="card"
        style="width:550px;"
      >
        <TabPane
          v-if="checkPermission(['admin'])"
          label="Admin"
        >
          Admin can see this
          <Tag
            class="permission-sourceCode"
            type="info"
          >
            v-if="checkPermission(['admin'])"
          </Tag>
        </TabPane>

        <TabPane
          v-if="checkPermission(['editor'])"
          label="Editor"
        >
          Editor can see this
          <Tag
            class="permission-sourceCode"
          >
            v-if="checkPermission(['editor'])"
          </Tag>
        </TabPane>

        <TabPane
          v-if="checkPermission(['admin','editor'])"
          label="Admin-OR-Editor"
        >
          Both admin or editor can see this
          <Tag
            class="permission-sourceCode"
          >
            v-if="checkPermission(['admin','editor'])"
          </Tag>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { checkPermission } from '@/utils/permission' // Use permission directly
import SwitchRoles from './components/SwitchRoles.vue'

@Component({
  name: 'DirectivePermission',
  components: {
    SwitchRoles
  }
})
export default class extends Vue {
  private key = 1 // 为了能每次切换权限的时候重新初始化指令
  private checkPermission = checkPermission

  private handleRolesChange() {
    this.key++
  }
}
</script>

<style lang="less" scoped>
.permission-alert {
  width: 320px;
  margin-top: 15px;
  background-color: #f0f9eb;
  color: #67c23a;
  padding: 8px 16px;
  border-radius: 4px;
  display: inline-block;
}

.permission-sourceCode {
  margin-left: 15px;
}

.permission-tag {
  background-color: #ecf5ff;
}
</style>
