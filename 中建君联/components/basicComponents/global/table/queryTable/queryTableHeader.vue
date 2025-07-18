<template>
  <div class="table-header-container">
    <div class="header-right">
      <!-- 显隐列 -->
      <div class="header-right-item column-ctrl-item" v-if="info.showColumnCtrl"
        :title="$t('button.explicitImplicitColumn')">
        <el-popover placement="bottom" width="246" trigger="click" v-model="columnsFlag">
          <div style="padding: 10px;" :style="{height: tableHeight + 'px'}">
            <div class="fixed-checkbox" :class="customShow && menuId ? 'menu' : 'public'">
              <div class="fixed-scroll">
                <el-checkbox-group v-model="shows" v-loading="columnLoading">
                  <el-checkbox v-for="(column,key) in columns" :key="key" :label="column.label" :name="column.prop"
                    @change="onColumnChange(column, key)">{{$t(column.label)}}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div v-if="customShow && menuId">
              <el-divider></el-divider>
              <el-button class="more" type="primary"
                style="float: right;margin-left: 8px;min-width: 60px;height: 30px;line-height: 30px;"
                icon="el-icon-edit" size="mini" @click="handleCustomShow">
                {{$t('button.save')}}</el-button>
            </div>
          </div>
          <el-button class="more" type="primary" slot="reference" icon="iconfont icon-liebiao" size="small">
            {{$t('button.explicitImplicitColumn')}}
          </el-button>
        </el-popover>
      </div>
      <!-- 刷新 -->
      <div class="header-right-item" v-if="info.refresh" @click.stop="onRefresh" :title="$t('button.refresh')">
        <el-button class="other" type="primary" slot="reference" icon="el-icon-refresh"
          size="small">{{$t('button.refresh')}}</el-button>
      </div>
      <!-- 固定列 -->
      <div class="header-right-item column-ctrl-item" v-if="info.showColumnCtrl"
        :title="$t('button.explicitImplicitColumn')">
        <el-popover placement="bottom" width="300" trigger="click" v-model="columnsFixed">
          <div style="padding: 10px;" :style="{height: tableHeight + 'px'}">
            <div class="fixed-all" :class="customShow && menuId ? 'menu' : 'public'">
              <div class="fixed-all-list fixed-scroll" v-loading="columnLoading">
                <div class="fixed-list" v-for="(column,key) in columns" :key="key">
                  <div class="fixed-list-label">
                    <tooltips :value="$t(column.label)"></tooltips>
                  </div>
                  <div class="fixedList">
                    <span v-for="(item,index) in fixedList" @click="column.fixed = item.code" :key="index"
                      :class="column.fixed === item.code ? 'active' : ''">
                      {{$t(item.name)}}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="customShow && menuId">
              <el-divider></el-divider>
              <el-button class="more" type="primary"
                style="float: right;margin-left: 8px;min-width: 60px;height: 30px;line-height: 30px;"
                icon="el-icon-edit" size="mini" @click="handleFixedCustomShow">
                {{$t('button.save')}}</el-button>
            </div>
          </div>
          <el-button class="more" type="primary" slot="reference" icon="el-icon-paperclip" size="small">
            {{$t('button.fixedCustom')}}
          </el-button>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
import config from 'util/config';

export default {
  props: {
    info: {
      type: Object,
      default: () => ({})
    },
    columns: {
      type: Array,
      default: () => []
    },
    columnLoading: {
      type: Boolean,
      default: false
    },
    auths: {
      type: Array,
      default: () => []
    },
    // 是否需要使用自定义的显示/隐藏
    customShow: {
      type: Boolean,
      default: true
    },
    tableHeight: {
      type: Number,
      default: 400
    }
  },
  watch: {
    columns: {
      handler (newColumns) {
        // console.log(this.columns, 'this.columns');
        // this.getColumnsShow();
        this.shows = newColumns.filter(column => column.show).map(c => c.label);
      },
      deep: true
    }
  },
  data () {
    return {
      shows: [],
      fixeds: [],
      menuId: '',
      fixedList: [
        { name: 'fConfig.left', code: 'left' },
        { name: 'fConfig.nothing', code: '' },
        { name: 'fConfig.right', code: 'right' }
      ],
      columnsFlag: false,
      columnsFixed: false
    };
  },
  created () {
    // console.log(this.columns);
    if (Object.keys(this.$route.params).length === 0 && this.customShow) {
      this.menuId = this.$utils.menu.getMenuId(this.$route.name);
    }
    // 获取用户列
    this.getColumnsShow();
  },
  methods: {
    getColumnsShow () {
      if (this.columns) {
        this.shows = this.columns.filter(column => column.show).map(c => c.label);
      }
      if (this.menuId && this.customShow) {
        const data = {
          subSystemCode: config.subSystemCode,
          menuId: this.menuId
        };
        this.$store.dispatch('publicApi/getMetaColumns', data).then(res => {
          if (res.results) {
            const columnValue = JSON.parse(res.results.columnValue);
            const { hideColumnsList, fixedColumnsList } = columnValue;
            hideColumnsList && this.setColumnShow(hideColumnsList);
            fixedColumnsList && this.setColumnFixed(fixedColumnsList);
            // console.log(columnValue, 'columnValue');
          }
        });
      }
    },
    // 设置是否显示
    setColumnShow (hideColumnsList) {
      for (const item of hideColumnsList) {
        const index = this.columns.findIndex(v => v.prop === item || item.formType === 'operate');
        if (index >= 0) {
          this.$set(this.columns[index], 'show', false);
        }
      }
    },
    // 设置固定列
    setColumnFixed (fixedColumnsList) {
      for (const item of fixedColumnsList) {
        const index = this.columns.findIndex(v => v.prop === item.prop || v.formType === item.prop);
        if (index >= 0) {
          this.$set(this.columns[index], 'fixed', item.fixed);
        } else {
          this.$set(this.columns[index], 'fixed', '');
        }
      }
    },
    onColumnChange (column, key) {
      const columnObj = {
        ...column,
        show: !column.show
      };
      this.columns[key] = columnObj;
      this.$emit('onColumnChange', this.columns);
    },
    onRefresh () {
      this.$emit('onRefresh', true);
    },
    // 点击保存显隐列
    handleCustomShow () {
      this.saveCustom('columnsFlag');
    },
    // 点击保存固定列
    handleFixedCustomShow () {
      this.saveCustom('columnsFixed');
    },
    saveCustom (flag) {
      const hideColumnsList = [];
      const fixedColumnsList = [];
      for (const item of this.columns) {
        if (!item.show) {
          hideColumnsList.push(item.prop || 'operate');
        }
        if (item.fixed) {
          fixedColumnsList.push({
            prop: item.prop || 'operate',
            fixed: item.fixed
          });
        }
      }
      const columnValueData = {
        hideColumnsList,
        fixedColumnsList
      };
      const data = {
        subSystemCode: config.subSystemCode,
        menuId: this.menuId,
        columnValue: JSON.stringify(columnValueData)
      };
      this.$store.dispatch('publicApi/setMetaColumns', data).then(res => {
        // console.log(res, 'setMetaColumns');
        this.$emit('onRefresh', true);
        this[flag] = false;
      });
    },
    // 固定列
    onFixedColumnChange (column, key) {
      const columnObj = {
        ...column,
        fixed: column.fixed
      };
      this.columns[key] = columnObj;
      this.$emit('onFixedColumnChange', this.columns);
    }
  }
};

</script>

<style lang="scss" scoped>
.el-checkbox {
  width: 100%;
}
.table-header-container {
  display: inline-block;

  .header-right {
    display: flex;
    align-items: center;

    .header-right-space {
      flex: 1;
    }

    .header-right-item {
      color: #009F3A;
      cursor: pointer;
      // margin-left: 10px;
    }
  }
}
.fixed-all {
  width: 100%;
  height: calc(100% - 72px);
  overflow: hidden;
  position: relative;
  &.public {
    height: 100%;
  }
  .fixed-all-list {
    .fixed-list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 40px;
      .fixed-list-label {
        width: 100px;
        overflow: hidden;
      }
    }
  }
}
.fixedList {
  span {
    display: inline-block;
    border-left: 1px solid #dcdfe6;
    border-top: 1px solid #dcdfe6;
    border-bottom: 1px solid #dcdfe6;
    border-radius: 4px 0 0 4px;
    // padding: 7px 15px;
    box-sizing: border-box;
    font-size: 12px;
    width: 44px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    background: white;
    text-align: center;
    &.active {
      color: #fff;
      background-color: #009F3A;
      border-color: #009F3A;
      border-radius: 0;
    }
    &:last-child {
      border-right: 1px solid #dcdfe6;
    }
  }
}
.fixed-checkbox {
  width: 100%;
  height: calc(100% - 72px);
  position: relative;
  &.public {
    height: 100%;
  }
  /deep/ .el-checkbox-group {
    width: 100%;
    height: 100%;
    .el-checkbox {
      height: 40px;
      line-height: 40px;
    }
  }
}
// .is-fixed-close{
//   /deep/ .el-radio-button__inner{
//     color: #606266 !important;
//     background: #fff !important;
//   }
// }
// .is-fixed-active{
//   /deep/ .el-radio-button__inner{
//     color: white !important;
//     background-color: #009F3A !important;
//   }
// }
</style>
