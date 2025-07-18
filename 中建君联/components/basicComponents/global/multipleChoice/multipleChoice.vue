<!--
 * @Author: wumaoxia
 * @Date: 2020-07-02 09:38:23
 * @LastEditTime: 2021-11-12 14:37:59
 * @LastEditors: Please set LastEditors
 * @Description: 用于多选 如：人员
 * @FilePath: \web_basicconfiguration\src\components\global\multipleChoice\multipleChoice.vue
-->
<template>
  <div class="multiple-choice-icon">
    <div :title="tagDadaListTips">
      <el-tag v-for="item in tagDadaList" :key="item[selectConfig.rowKey]" style="margin-right: 10px;" type="info"
        size="mini" :closable="tagDisabled" @close="handleDelete(item)">
        {{item[selectConfig.rowName]}}
      </el-tag>
      <el-tag v-if="selectList.length > selectConfig.constNum" type="info" size="mini">
        +{{selectList.length - selectConfig.constNum}}
      </el-tag>
    </div>
    <div @click="handlMultipleChoice">
      <i class="multiple-choice-icon iconfont icon-liebiao" v-if="isDisabled"></i>
      <i class="el-icon-view smallFont set" v-else-if="selectConfig.isCanInfo" @click.stop="handleViewInfo"></i>
    </div>

    <!-- 选择退货单 -->
    <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
      <div :style="{height: (height - 20) + 'px'}" slot-scope="{height}" slot="body" ref="multipleChoice"
        v-if="dialogVisible">
        <g-query-table :config="mainTable" slot="body" v-if="dialogVisible">
          <template :slot="'table-' + selectConfig.rowName" slot-scope="{row}">
            <span class="midFont set" @click="handleInfo(row)">{{row[selectConfig.rowName]}}</span>
          </template>
        </g-query-table>
      </div>
    </g-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tagDadaList: [],
      selectList: [],
      tagDisabled: false,
      dialogVisible: false,
      dialogConfig: {
        title: '',
        appendBody: false,
        center: true,
        top: '100px',
        width: '50%',
        span: '0.6'
      },
      mainTable: {
        // 表格数据
        tableData: [],
        // 子系统表头渲染参数
        tableList: [
        ]
      }
    };
  },
  computed: {
    tagDadaListTips () {
      const rowName = this.selectConfig.rowName;
      return this.selectList.map(v => v[rowName]).join(',');
    }
  },
  props: {
    selectConfig: {
      type: Object,
      default: () => {
        const parmas = {
          // 显示的列表
          tagDada: [],
          // id
          rowKey: 'id',
          // name
          rowName: 'name',
          // 默认显示的个数
          constNum: 2,
          // 展示名称
          rowLabel: '',
          // 是否查看展示
          isCanInfo: false,
          routerId: '',
          routerName: ''
        };
        return parmas;
      }
    },
    isConfig: {
      type: Boolean,
      default: true
    },
    // 禁止选择及删除
    isDisabled: {
      type: Boolean,
      default: true
    },
    // 流程状态
    processDisabled: {
      type: Boolean,
      default: false
    },
    userList: {
      type: Array,
      default: () => []
    },
    isCanInfo: {
      type: Boolean,
      default: false
    }
  },
  created () {
    if (this.processDisabled) {
      this.tagDisabled = true;
    } else {
      this.tagDisabled = this.isDisabled;
    }
  },
  watch: {
    userList: {
      handler () {
        if (!this.isConfig) return;
        this.selectList = JSON.parse(JSON.stringify(this.userList));
        this.tagDadaList = this.selectList.slice(0, this.selectConfig.constNum);
      },
      immediate: true
    },
    'selectConfig.tagDada': {
      handler () {
        if (!this.isConfig) return;
        if (this.userList && this.userList.length > 0) return;
        this.selectList = JSON.parse(JSON.stringify(this.selectConfig.tagDada));
        this.tagDadaList = this.selectList.slice(0, this.selectConfig.constNum);
      },
      immediate: true
    }
  },
  methods: {
    handleDelete (item) {
      this.$emit('tagDelete', item);
    },
    // 点击多选按钮
    handlMultipleChoice () {
      this.$emit('select', true);
    },
    // 查看
    handleViewInfo () {
      this.dialogConfig.title = this.$t(this.selectConfig.rowLabel);
      this.mainTable.tableList = [
        { show: true, prop: this.selectConfig.rowName, label: this.dialogConfig.title, formType: 'slot' }
      ];
      this.mainTable.tableData = this.selectList;
      this.dialogVisible = true;
      this.$nextTick(() => {
        const height = this.$refs.multipleChoice ? this.$refs.multipleChoice.offsetHeight : 522;
        this.mainTable.maxHeight = height;
      });
    },
    // 查看
    handleInfo (row) {
      let id = row[this.selectConfig.routerId];
      const routerName = this.selectConfig.routerName;
      // console.log(this.selectConfig.routerName, 'this.selectConfig.routerName');
      const translateType = 'info';
      const type = this.$base64.encode('info');
      id = this.$base64.encode(id || 0);
      const checkArrivalId = this.$base64.encode(0);
      const RouteTitleObj = { name: `${routerName}Edit`, loadRouteName: routerName, translateType };
      localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
      this.$router.push(`/${routerName}Edit/${type}/${id}/${routerName}/${checkArrivalId}/${routerName}`);
      this.dialogVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.multiple-choice-icon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 6px;
  line-height: 36px;
  .multiple-choice-icon {
    font-size: 16px !important;
    color: #009F3A;
  }
  i{
    cursor: pointer;
  }
}
</style>
