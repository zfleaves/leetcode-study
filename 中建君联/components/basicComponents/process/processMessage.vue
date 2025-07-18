<!--
 * @Author: your name
 * @Date: 2020-12-03 11:09:04
 * @LastEditTime: 2021-12-07 17:48:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_unit\src\components\basicComponents\process\processMessage.vue
-->
<template>
  <div class="process-message">
    <div class="content">
      <div class="message-all" id="message-all">
        <div class="message-title" v-if="total !== pageNo">正在加载<i class="el-icon-loading"></i></div>
        <div class="message-title" v-else>已显示全部消息</div>
        <div class="message-list" v-for="item of messageList" :key="item.id">
          <el-avatar :icon="item.img"></el-avatar>
          <span>{{item.message}}</span>
        </div>
      </div>
      <div class="operation">
      </div>
      <div class="footer"></div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      messageList: [],
      // 设置开关避免重复请求数据
      scroll: true,
      // 当前页数
      pageNo: 1,
      // 总页数
      total: 5
    };
  },
  created () {
    this.getMessageList();
  },
  mounted () {
    document.getElementById('message-all').addEventListener('scroll', this.handleScroll);
  },
  methods: {
    // 获取消息数据
    getMessageList () {
      this.loading = true;
      const data = {
        pageNo: this.pageNo,
        pageSize: 10
      };
      if (this.total === this.pageNo) {
        return;
      }
      const arr = 10 * this.pageNo;
      const list = [];
      const no = arr === 10 ? 0 : arr - 10;
      for (let i = no + 1; i <= arr; i++) {
        console.log(i, 'i');
        list.push({
          id: i + 1,
          img: 'el-icon-user',
          message: `你好！${i + 1}`
        });
      }
      const listReverse = list.reverse();
      if (this.pageNo === 1) {
        this.messageList = listReverse;
      } else {
        this.messageList = [
          ...listReverse,
          ...this.messageList
        ];
      }
      this.$nextTick(() => {
        const ele = document.getElementById('message-all');
        if (this.pageNo === 1) {
          // 判断元素是否出现了滚动条
          if (ele.scrollHeight > ele.clientHeight) {
            // 设置滚动条到最底部
            ele.scrollTop = ele.scrollHeight;
          }
        } else {
          // 设置滚动条到最底部
          ele.scrollTop = ele.clientHeight;
        }
      });
      ++this.pageNo;
      // this.$store.dispatch('', data).then(res => {
      //     if (res.status === 0) {
      //         if (this.pageNo === 1) {
      //             this.messageList = res.results ? res.results.records : [];
      //             this.total = res.results ? res.results.total : 0;
      //         } else {
      //             this.messageList = [
      //                 ...this.messageList,
      //                 ...res.results.records
      //             ];
      //         }
      //         ++this.pageNo;
      //     } else {
      //         this.$message.error(this.$t(`exception.${res.errorCode}`));
      //     }
      //     this.loading = false;
      // }).catch(e => {
      //     this.loading = false;
      // });
    },
    // 滚动事件监听
    handleScroll () {
      // 是否滚动到底部的判断
      const element = document.getElementById('message-all');
      if ((element.scrollTop + element.clientHeight) === element.offsetHeight) {
        if (this.pageNo <= this.total) {
          this.getMessageList();
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.process-message {
  height: 100%;
  width: 100%;
  .content {
    height: 100%;
    width: 100%;
    position: relative;
    .message-all {
      position: absolute;
      width: 100%;
      padding: 10px;
      top: 0;
      bottom: 0;
      overflow-y: auto;
      display: flex;
      box-sizing: border-box;
      flex-direction: column;
      &::-webkit-scrollbar {
        display: none;
      }
      height: 50%;
      .message-title {
        text-align: center;
        font-size: 12px;
        color: #009F3A;
      }
    }
    .operation {
      height: 40%;
    }
    .footer {
      height: 10%;
    }
  }
}
</style>
