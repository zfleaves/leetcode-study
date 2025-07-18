<template>
  <el-table
    ref="organizationTable"
    :data="tableData"
    :height="offsetHeight"
    style="width: 100%;"
    row-key="id"
    size="small"
    highlight-current-row
    default-expand-all
    @row-click="handleCurrentChange"
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <template slot="empty">
      <no-data>
      </no-data>
    </template>
    <el-table-column
     :label="$t('fConfig.organization')" min-width="180" show-overflow-tooltip>
      <template slot-scope="scope">
        <el-checkbox
        @change="handleCurrentChange(scope.row)"
         v-if="isRelation"
         v-show="isRadio || isCheckBox" v-model="scope.row.checked"
         :disabled="isRelationDepart(scope.row)" style='margin-right:8px;'>
        </el-checkbox>
        <el-checkbox
        @change="handleCurrentChange(scope.row)"
        v-else
         v-show="isRadio || isCheckBox" v-model="scope.row.checked"
         :disabled="scope.row.disabled" style='margin-right:8px;'>
        </el-checkbox>
        <i :class="scope.row.orgAttributeCode | iconFilter"></i>
        <span style="margin-left: 4px;">{{ scope.row.orgName }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  export default {
    data () {
      return {
        tableData: [],
        testData: [],
        selectData: [],
        authorityOrgIdList: []
      };
    },
    props: {
      offsetHeight: {
        default: 400
      },
      isRadio: {
        default: false
      },
      isCheckBox: {
        default: false
      },
      selectOrgId: {
        default: ''
      },
      selectOrgList: {
        default: () => []
      },
      isShowDepartName: {
        default: true,
        type: Boolean
      },
      isOnlyCheckDepartName: {
        default: false,
        type: Boolean
      },
      isAuthority: {
        default: false,
        type: Boolean
      },
      isRelation: { // 是否关联上级所属公司
        default: false,
        type: Boolean
      },
      relationOrgId: { // 关联的上级所属公司
        default: 0
      },
      isComplete: { // 是否展示完整路径
        default: false,
        type: Boolean
      },
      // 公司节点内选择
      isOrganizationTableShow: {
        default: false,
        type: Boolean
      },
      belongCompanyId: {
         type: Number,
         default: null
      },
      // 公司层级调整时需要将当前组织机构置灰
      isNeedDisable: {
        default: false,
        type: Boolean
      },
      soucrceOrgId: {
        type: Number,
        default: null
      }
    },
    created () {
      this.authorityOrgIdList = this.$utils.Auth.hasUserInfo().data || [];
      this._getOrgTree();
    },
    filters: {
      iconFilter (val) {
        if (val === '01') return 'iconfont icon-gongsiyewu color-gongsiyewu';
        if (val === '02') return 'iconfont icon-home color-home';
        if (val === '03') return 'iconfont icon-bumen color-bumen';
        if (val === '04') return 'iconfont icon-bumen color-bumen';
      }
    },
    methods: {
      // 获取组织机构
      async _getOrgTree () {
        let belongCompanyId = this.belongCompanyId;
        const url = this.isOrganizationTableShow ? 'publicApi/getEffectiveOrgChildrenTree' : 'publicApi/getEffectiveOrgTree';
        if (this.isOrganizationTableShow && !this.belongCompanyId) {
          const dataInfo = localStorage.getItem('dataInfo') ? JSON.parse(localStorage.getItem('dataInfo')) : {};
          const params = {
            projectStatus: [1, 2, 3],
            projectName: dataInfo.projectName
          };
          await this.$store.dispatch('publicApi/getProjectV1PermissionList', params).then(res => {
            if (res.status === 0) {
              belongCompanyId = res.results.length > 0 ? res.results[0].orgId : '';
            }
          });
        }
        const params = {
          orgId: this.isOrganizationTableShow ? belongCompanyId : null
        };
        await this.$store.dispatch(url, params).then(res => {
          if (res.results.length === 0) return;
          if (this.isComplete || this.isRelation) {
            this.setCompleteData(res.results);
          }
          if (!this.isShowDepartName) {
            this.filterOgr(res.results);
          }
          this.tableData = res.results;
          this.$refs.organizationTable && this.$refs.organizationTable.setCurrentRow(this.tableData[0]);
          this.$emit('currentRow', this.tableData[0]);// 进页面首次点击
          // if (this.isRadio) {
            this.$nextTick(() => {
              this.setCheckTree(res.results);
              // console.log(res.results, 'res.results');
            });
          // }
        });
      },
      // 展示完整路径
      setCompleteData(arr, parentName = '', orgNameList = [], parentIdList = [], companyList = []) {
        for (const item of arr) {
          item.completeList = [];
          item.companyList = [];
          item.companyList = item.orgAttributeCode !== '04' ? companyList.concat([{orgName: item.orgName, id: item.id}]) : companyList;
          item.parentIdList = parentIdList.concat([item.id]);
          if (parentName) {
            item.completeList = orgNameList.concat(parentName);
          }
          if (item.children && item.children.length) {
            this.setCompleteData(item.children, item.orgName, item.completeList, item.parentIdList, item.companyList);
          }
        }
      },
      filterOgr (targetList) { // 遍历后台传来的路由字符串，转换为组件对象
        const filterList = targetList.filter(v => {
          if (v.children && v.children.length) {
            v.children = this.filterOgr(v.children);
          }
          return v.orgAttributeCode !== '04';
        });
        return filterList;
      },

      setCheckTree (arr, parentOrgId) {
        for (const i in arr) {
          const item = arr[i];
          this.$set(item, 'code', item.orgCode);
          item.currentOrgName = item.orgName;
          if (item.orgAttributeCode === '04') {
            item.parentOrgId = parentOrgId;
          } else {
            item.parentOrgId = item.id;
          }
          if (this.isAuthority) {
            if (this.authorityOrgIdList.indexOf(item.id) >= 0) {
              this.$set(item, 'disabled', false);
            } else {
              this.$set(item, 'disabled', true);
            }
          }
          if (this.isOnlyCheckDepartName && this.isShowDepartName) {
            if (item.orgAttributeCode === '04') {
              this.$set(item, 'disabled', false);
            } else {
              this.$set(item, 'disabled', true);
            }
          }
          if (this.isRadio) {
            if (this.selectOrgId === item.id) {
              this.$set(item, 'checked', true);
            } else {
              this.$set(item, 'checked', false);
            }
          }
          if (this.isCheckBox) {
            if (this.selectOrgList.findIndex(v => v.id === item.id) >= 0) {
              this.$set(item, 'checked', true);
            } else {
              this.$set(item, 'checked', false);
            }
          }
          if (this.isNeedDisable) {
            if (this.soucrceOrgId === item.id) {
              this.$set(item, 'disabled', true);
            } else {
              this.$set(item, 'checked', false);
            }
          }
          if (item.children && item.children.length) {
            this.setCheckTree(item.children, item.parentOrgId);
          }
        }
      },
      // 只能选上级所属公司下的部门
      isRelationDepart(row) {
        if (row.orgAttributeCode !== '04') return true;
        // if (row.parentId !== this.relationOrgId) return true;
        if (row.parentIdList.indexOf(this.relationOrgId) < 0) return true;
        return false;
      },
      // 点击当前行
      handleCurrentChange (val) {
        this.$emit('currentRow', val);
        if (val.disabled) return; // 如果禁选 无后续操作
        if (this.isRelation) {
          if (this.isRelationDepart(val)) return; // 关联后的禁选 无后续操作
        }
        if (this.isRadio) {
          if (val.checked) {
            this.$set(val, 'checked', false);
          } else {
            this.checkRadio(this.tableData);
            this.$set(val, 'checked', true);
          }
        }
        if (this.isCheckBox) {
          if (val.checked) {
            this.$set(val, 'checked', false);
          } else {
            this.$set(val, 'checked', true);
          }
        }
      },
      // 设置勾选
      checkRadio (arr) {
        for (const i in arr) {
          const item = arr[i];
          this.$set(item, 'checked', false);
          if (item.children && item.children.length) {
            this.checkRadio(item.children);
          }
        }
      },
      // 获取勾选的数据
      getSelectData(arr) {
          for (const item of arr) {
            if (item.checked) {
                this.selectData.push(item);
            }
            if (item.children && item.children.length) {
                this.getSelectData(item.children);
            }
          }
      },
      // 获取 选择得组织机构
      getOrgList () {
        this.selectData = [];
        this.getSelectData(this.tableData);
        return this.selectData;
      }
    }
  };
</script>
