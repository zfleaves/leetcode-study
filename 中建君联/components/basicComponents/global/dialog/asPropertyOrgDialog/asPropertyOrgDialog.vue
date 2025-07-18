<!--
 * @Author: your name
 * @Date: 2021-06-15 09:48:46
 * @LastEditTime: 2021-08-06 15:33:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_assets\src\components\basicComponents\global\dialog\asPropertyOrg\asPropertyOrg.vue
-->
<template>
  <div class="asPropertyOrg">
    <div class="roleCons">
      <div class="content">
        <div class="cons">
          <div class="asPropertyOrg-table" ref="asPropertyOrgTable">
            <el-table
              :data="tableData"
              :height="offsetHeight"
              style="width: 100%"
              row-key="orgId"
              size="small"
              ref="asPropertyOrgDialog"
              highlight-current-row
              default-expand-all
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
              @selection-change="selectionChange"
              @row-click="clickRow">
              <template slot="empty">
                <no-data></no-data>
              </template>
              <el-table-column type="selection" :selectable="selectable" align="center" :reserve-selection='true' width="50">
              </el-table-column>
              <!-- 组织机构 -->
              <el-table-column
                prop="orgName"
                :label="$t('fConfig.organization')"
                min-width="100"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <i :class="scope.row.orgAttributeCode | iconFilter"></i>
                  <span style="margin-left: 4px;">{{ scope.row.orgName }}</span>
                </template>
              </el-table-column>
              <!-- 类型 -->
              <el-table-column prop="orgAttributeValue" :label="$t('fConfig.typeName')" width="80" show-overflow-tooltip></el-table-column>
              <!-- 编号 -->
              <el-table-column prop="orgCode" :label="$t('fConfig.code')" min-width="50" show-overflow-tooltip></el-table-column>
              <!-- 状态 -->
              <el-table-column prop="status" :label="$t('fConfig.status')" min-width="50" show-overflow-tooltip>
                <template slot-scope="scope">{{
                  judgeDataList(scope.row.status, "status")
                }}</template>
              </el-table-column>
              <!-- 同级排序 -->
              <el-table-column prop="sorts" :label="$t('fConfig.sort')" width="50" show-overflow-tooltip></el-table-column>
              <!-- 是否产权组织 -->
              <el-table-column prop="isProperty" :label="$t('fConfig.isProperty')" min-width="50" show-overflow-tooltip>
                <template slot-scope="scope">{{
                  scope.row.isProperty === 1 ? $t("tips.yes") : $t("tips.no")
                }}</template>
              </el-table-column>
              <!-- 产权组织名称 -->
              <el-table-column prop="propertyOrgName" :label="$t('fConfig.propertyOrgName')" min-width="50" show-overflow-tooltip></el-table-column>
              <!-- 产权组织编号 -->
              <el-table-column prop="propertyOrgCode" :label="$t('fConfig.propertyOrgCode')" min-width="50" show-overflow-tooltip></el-table-column>
              <!-- 资产负责人 -->
              <el-table-column prop="directorNames" :label="$t('fConfig.directorName')" min-width="100" show-overflow-tooltip>
                <template slot-scope="scope">{{
                  scope.row.directors.map((v) => v.directorName).join(",")
                }}</template>
              </el-table-column>
            </el-table>
            <div class="footer">
              <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small" @click="handleDialogStatus('close')">{{$t('button.close')}}</el-button>
              <el-button size="small" type="primary" icon="el-icon-circle-check" @click="handleDialogStatus('save')" v-fast-click>{{$t('button.determine')}}</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'asPropertyOrgDialog',
  data() {
    return {
      tableData: [],
      offsetHeight: 400,
      statusList: [
        { dataValue: 0, dataName: this.$t('button.enable') },
        { dataValue: 1, dataName: this.$t('button.disable') }
      ],
      selectList: [],
      authorityOrgIdList: []
    };
  },
    props: {
        dialogHeight: {
            type: Number,
            default: 300
        },
        // 默认选中
        selectId: {
            default: ''
        }
    },
  created() {
    this.authorityOrgIdList = this.$utils.Auth.hasUserInfo().data || [];
    console.log(this.authorityOrgIdList, 'this.authorityOrgIdList');
    this._getOrgTree();
  },
  mounted() {
    this.$nextTick(() => {
      this.offsetHeight = this.dialogHeight - 100;
    });
  },
  filters: {
    iconFilter(val) {
      if (val === '01') return 'iconfont icon-gongsiyewu color-gongsiyewu';
      if (val === '02') return 'iconfont icon-home color-home';
      if (val === '03') return 'iconfont icon-bumen color-bumen';
      if (val === '04') return 'iconfont icon-bumen color-bumen';
    }
  },
  methods: {
    _getOrgTree() {
      this.$store.dispatch('publicApi/getOrgEffectiveTreePublicApi').then(res => {
        this.tableData = res.results;
        this.setAsPropertyOrg(this.tableData);
        this.toggleSelection(this.selectIdList);
      });
    },
    // 设置数据
    setAsPropertyOrg(arr) {
      for (const item of arr) {
        item.id = item.orgId;
        if (this.authorityOrgIdList.indexOf(item.orgId) >= 0 && item.isProperty === 1) {
          this.$set(item, 'doNotCheck', false);
        } else {
          this.$set(item, 'doNotCheck', true);
        }
        if (item.children && item.children.length) {
          this.setAsPropertyOrg(item.children);
        }
      }
    },
    judgeDataList(id, str) {
      const index = this[`${str}List`].findIndex(v => v.dataValue === id);
      if (index < 0) return '';
      return this[`${str}List`][index].dataName;
    },
    // 禁止勾选
    selectable(row) {
      if (row.doNotCheck) {
        return false;
      } else {
        return true;
      }
    },
    // 勾选
    toggleSelection () {
      if (this.selectId) {
        this.toggleSelectionChildren(this.selectId, this.tableData);
      } else {
        this.$refs.asPropertyOrgDialog && this.$refs.asPropertyOrgDialog.clearSelection();
      }
    },
    toggleSelectionChildren (rowKey, arr) {
      for (const v of arr) {
        if (rowKey === v.id) {
          this.$refs.asPropertyOrgDialog && this.$refs.asPropertyOrgDialog.toggleRowSelection(v, true);
        } else if (v.children && v.children.length) {
          this.toggleSelectionChildren(rowKey, v.children);
        }
      }
    },
    selectionChange (val) {
      if (val.length > 1) {
        this.$refs.asPropertyOrgDialog && this.$refs.asPropertyOrgDialog.clearSelection();
        this.$refs.asPropertyOrgDialog && this.$refs.asPropertyOrgDialog.toggleRowSelection(val[val.length - 1]);
      }
      if (val.length > 1) {
        this.selectList = [val[val.length - 1]];
      } else {
        this.selectList = val;
      }
    },
    clickRow (row, column, event) {
      if (row.doNotCheck) {
        return;
      }
      if (this.selectList.length && row.id === this.selectList[0].id) {
        this.$refs.asPropertyOrgDialog && this.$refs.asPropertyOrgDialog.clearSelection();
        return;
      }
      this.$refs.asPropertyOrgDialog && this.$refs.asPropertyOrgDialog.toggleRowSelection(row);
    },
    handleDialogStatus(event) {
      if (event === 'close') {
        this.$emit('update:close', false);
      } else {
        console.log(this.selectList, 'selectList');
        this.$emit('getData', this.selectList);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.asPropertyOrg {
  height: 100%;
  display: flex;
  flex-direction: column;
  .roleCons {
    height: 100%;
    flex: auto;
    display: flex;
    flex-direction: column;
    .content {
      flex: auto;
      height: 100%;
      background: white;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      position: relative;
      .cons {
        height: 100%;
        box-sizing: border-box;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        padding: 10px;
        overflow-y: auto;
        &::-webkit-scrollbar {
          display: none;
        }
        .asPropertyOrg-table {
          height: 100%;
          padding-top: 1px;
          border-bottom: none;
          box-sizing: border-box;
        }
      }
    }
  }
}
</style>
