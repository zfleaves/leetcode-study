
<template>
  <div class="compositePage" style="height: 500px; overflow: hidden;">
    <div class="roleCons subsystemRole">
      <div class="contents">
        <div class="contents-table table1" style="flex: 7">
          <div class="cons-bottom" style="display: flex" ref="consTable">
            <div class="cons" style="width: 100%">
              <div class="cons-table">
                <div class="cons-head-btn">
                  <div class="cons-head-btn-title">
                    <!-- 子系统 -->
                    <div>{{ $t("dialog.subsystemList") }}</div>
                  </div>
                </div>
                <div class="cons-table-auto" ref="table_cons">
                  <g-query-table
                    ref="subsystem"
                    :config="configSubsystem"
                    @tableList="getSubsystemList"
                  >
                  </g-query-table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="contents-table table1" style="flex: 7">
          <div class="cons-bottom" style="display: flex" ref="consTable">
            <div class="cons" style="width: 100%">
              <div class="cons-table">
                <div class="cons-head-btn">
                  <div class="cons-head-btn-title" style="margin-bottom: 5px">
                    <!-- 已选子系统 可拖拽排序 -->
                    <div>
                      {{ $t("dialog.selectedSubsystem") }}
                      <!-- <span class="midFont error">（ {{ $t("dialog.drag") }} ）</span> -->
                    </div>
                    <el-button
                      size="mini"
                      type="primary"
                      v-fast-click
                      icon="el-icon-plus"
                      @click="addJurisdictionTree"
                      >{{ $t("button.save") }}</el-button
                    >
                  </div>
                  <div class="cons-table-auto">
                    <g-query-table ref="select_subsystem" :config="configMenu">
                      <template slot="table-subSystemCode" slot-scope="scope">
                        {{ $t(`subSystem.${scope.row.subSystemCode}`) }}
                      </template>
                    </g-query-table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'openCloud',
  data() {
    return {
      // 菜单列表
      configMenu: {
        // 表格数据
        tableData: [],
        // 表头操作行配置
        tableHeader: {
          showColumnCtrl: false, // 显示/隐藏列
          refresh: false // 刷新
        },
        // 是否默认选中第一行
        defaultSeleFirstLine: false,
        // 子系统表头渲染参数
        tableList: [
          // 子系统名称
          { show: true, label: 'fConfig.subSystemName', prop: 'subSystemCode', formType: 'slot' }
        ]
      },
      // 子系统列表
      configSubsystem: {
        isCheckbox: true,
        // 表格数据
        tableData: [],
        selectedList: [],
        // 表头操作行配置
        tableHeader: {
          showColumnCtrl: false, // 显示/隐藏列
          refresh: false // 刷新
        },
        // 是否默认选中第一行
        defaultSeleFirstLine: true,
        // 子系统表头渲染参数
        tableList: [
          // 子系统名称
          { show: true, label: 'fConfig.subSystemName', prop: 'subSystemName' }
        ]
      },
      subSystemCode: ''
    };
  },
  created() {
    this._getSubsystemTableData();
  },
  mounted() {
    this.$nextTick(() => {
      const consHeight = this.$refs.table_cons ? this.$refs.table_cons.offsetHeight : 500;
      this.configMenu.height = consHeight - 20;
      this.configMenu.maxHeight = consHeight - 20;
      this.configSubsystem.height = consHeight - 20;
      this.configSubsystem.maxHeight = consHeight - 20;
    });
  },
  /* eslint-disable */
  methods: {
    // 获取快捷菜单
    async _getQuickAccess() {
      await this.$store.dispatch('publicApi/getQuickSubsystemPublic').then(res => {
        if (res.results.length === 0) {
          this.$store.dispatch('publicApi/getTenantSubSystemEffective', { currentTenantId: this.$utils.Auth.hasUserInfo().tenantId }).then(val => {
            let arr = [];
            val.results &&
              val.results.forEach(item => {
                arr = arr.concat(item.tenantSysSubSystems.filter(v => v.status === 0));
              });
            const data = arr.sort(this.compare);
            this.configMenu.tableData = data;
            this.configSubsystem.selectedList = this.$clone(data);
          });
        } else {
          this.configMenu.tableData = res.results;
          this.configSubsystem.selectedList = this.$clone(res.results);
        }
      });
      this.$nextTick(() => {
        this.$refs.select_subsystem.rowDrop();
      });
    },
    // 排序 比较大小
    compare(obj1, obj2) {
      let val1 = obj1.sort || 0;
      let val2 = obj2.sort || 0;
      if (val1 > val2) {
        return 1;
      } else if (val1 < val2) {
        return -1;
      } else {
        return 0;
      }
    },
    // 获取子系统列表
    _getSubsystemTableData() {
      this.$store.dispatch('publicApi/tenantSubsystemPublic', { currentTenantId: this.$utils.Auth.hasUserInfo().tenantId }).then(res => {
        let arr = [];
        res.results &&
          res.results.forEach(item => {
            arr = arr.concat(item.tenantSysSubSystems);
          });
        this.configSubsystem.tableData = arr.sort((a, b) => {
          return a.sort - b.sort;
        });
        this.configSubsystem.selectedList = [];
        this._getQuickAccess();
      });
    },
    // 获取选中的子系统
    getSubsystemList(arr) {
      this.configMenu.tableData = arr;
    },
    // 保存快捷菜单
    addJurisdictionTree() {
      if (this.configMenu.tableData.length === 0) {
        // 请至少选择一个子系统
        this.$message.warning(this.$t('dialog.pleaseSelectSubsystem'));
        return;
      }
      const subsystemIds = this.configMenu.tableData.map(v => v.id);
      this.$store.dispatch('publicApi/setQuickSubsystemPublic', subsystemIds).then(res => {
        if (res.status === 0) {
          // 子系统设置成功
          this.$message.success(this.$t('dialog.selectSubsystemSuccess'));
          this.$emit('selectedOpenCloud', false);
        } else {
          this.$message.error(`${this.$t(`exception.${res.errorCode}`)}`);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.compositePage {
    padding: 10px 0 10px 10px;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background-color: #f2f4f7;
    .roleCons {
      height: 100%;
      flex: auto;
      display: flex;
      flex-direction: column;
      .contents {
        width: 100%;
        flex: auto;
        display: flex;
        .table1 {
          // flex: 4;
          margin-right: 10px;
        }
        // .table2 {
        //   flex: 6;
        // }
        .contents-table{
          height: 100%;
          border: 1px solid #ebeef5;
          background-color: #fff;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
          display: flex;
          flex-direction: column;
          .cons-top{
            width: 100%;
            .function_cons {
              padding: 10px 10px 0 10px;
              width: 100%;
              box-sizing: border-box;
              .search_cons{
                padding: 10px;
              }
              .el-row {
                width: 100%;
                height: 100%;
                margin: 0 0 !important;
                .el-col {
                  height: 100%;
                  overflow: hidden;
                }
              }
            }
          }
          .cons-bottom{
            flex: auto;
            width: 100%;
            box-sizing: border-box;
            // padding: 5px 10px 10px 10px;
            .cons {
              height: 100%;
              background-color: #fff;
              box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
              position: relative;
            .cons-table{
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
                .cons-head-btn{
                  text-align: right;
                  padding-bottom: 10px;
                  box-sizing: border-box;
                }
                .cons-table-t{
                  flex: auto;
                  border: 1px solid #EBEEF5;
                  padding-top: 1px;
                }
                .pages {
                  text-align: center;
                }
              }
            }
          }
        }
      }
    }
    .cons-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 32px;
      font-size: 16px;
      margin-bottom: 8px;
    }
    .cons-table-expand{
      display: flex;
      flex-wrap: wrap;
      line-height: 30px;
      padding: 0 10px;
      div{
        width: 33%;
      }
    }
  }
.cons-table-auto {
  flex: auto;
}
.tabs-button {
  display: flex;

  .cons-tabs {
    width: 90%;
  }

  .cons-button {
    width: 10%;
    text-align: center;
  }
}

.subsystemRole {
  .cons-head-btn-title {
    display: flex;
    justify-content: space-between;
    line-height: 32px;
  }
}
.table_pages {
  text-align: center;
}
</style>
