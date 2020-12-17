<template>
  <div v-if="errorLogs.length>0">
    <Badge
      :dot="true"
      type="error"
      @click.native="dialogTableVisible=true"
    >
      <Button
        size="small"
        class="err-btn"
        type="error"
      >
        <svg-icon name="bug" />
      </Button>
    </Badge>

    <Modal
      v-model="dialogTableVisible"
      width="80%"
      transfer
    >
      <div slot="header">
        <span style="padding-right: 10px;">错误日志</span>
        <Button
          size="small"
          type="primary"
          icon="md-trash"
          @click="clearAll"
        >
          清空错误日志
        </Button>
      </div>
      <Table
        :columns="columns"
        :data="errorLogs"
        border
      >
        <template
          slot="message"
          slot-scope="{row}"
        >
          <div>
            <span class="message-title">Msg:</span>
            <Tag color="error">
              {{ row.message }}
            </Tag>
          </div>
          <br>
          <div>
            <span
              class="message-title"
              style="padding-right: 10px;"
            >Info: </span>
            <Tag color="warning">
              {{ row.tag }} error in {{ row.info }}
            </Tag>
          </div>
          <br>
          <div>
            <span
              class="message-title"
              style="padding-right: 16px;"
            >Url: </span>
            <Tag color="success">
              {{ row.url }}
            </Tag>
          </div>
        </template>
        <template
          slot="stack"
          slot-scope="{row}"
        >
          {{ row.stack }}
        </template>
      </Table>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ErrorLogModule } from '@/store/modules/error-log'

@Component({
  name: 'ErrorLog'
})
export default class extends Vue {
  private dialogTableVisible = false;
  private columns = [
    {
      slot: 'message',
      title: 'Message'
    },
    {
      slot: 'stack',
      title: 'stack'
    }
  ];

  get errorLogs() {
    return ErrorLogModule.logs.map((v) => {
      return {
        stack: v.err?.stack ?? '',
        message: v.err.message,
        tag: v.vm.$vnode.tag,
        info: v.info,
        url: v.url
      }
    })
  }

  private clearAll() {
    this.dialogTableVisible = false
    ErrorLogModule.ClearErrorLog()
  }
}
</script>

<style lang="less" scoped>
.message-title {
  font-size: 16px;
  color: #333;
  font-weight: bold;
  padding-right: 8px;
}
::v-deep .ivu-badge-dot {
  top: 7px;
  right: -7px;
}
.ivu-btn.err-btn {
  width: 34px;
  height: 30px;
  padding: 0;
  margin-top: -6px;
}
</style>
