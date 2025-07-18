<template>
    <div class="generalPage queryPage" v-loading="loading">
    <div class="roleCons">
      <div class="content">
        <div class="cons" ref="cons">
          <div class="search_cons" v-if="searchConfigForm.formShow" ref="searchForm">
            <g-search-form :configForm="searchConfigForm"
                            ref='searchForm'
                           :searchData.sync="searchData">
            </g-search-form>
          </div>
          <template v-if="configTable.tableList.length > 0">
            <div class="table_cons">
              <div class="table_cons_table">
                <div class="table_btn" v-if="configTable.button.length">
                  <g-button :operationButtons="configTable.button" @butFnName="emitButtonFnName">
                  </g-button>
                </div>
                <div class="table_content" :ref="item.slaveTableName">
                  <g-tree
                    v-if="configTable.isTree"
                    :searchData="searchData"
                    :treeConfig="configTable.tableList"
                    @fnName="emitTableButtonFnName">
                  </g-tree>
                  <g-query-table
                    v-else
                    v-on="$listeners"
                    @rowClick="handleRowClick"
                    :tableData="childTableData"
                    :maxHeight="offsetHeight"
                    @fnName="emitTableButtonFnName">
                  </g-query-table>
                </div>
                <div class="table_pages"
                     v-if="configTable.paging">
                  <g-to-page ref="Page" :page-size="pageSize" :total="total"
                           @sentPages="getPages">
                  </g-to-page>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {search} from 'mixin/searchMixins';

export default {
    mixins: [search],
    data () {
        return {
          searchConfigForm: {},
          configTable: {},
          // 数据
          childTableData: []
        };
    },
    props: {
      queryPageConfig: {
        type: Object,
        default: () => {
          const params = {
            // 搜索配置
            searchConfigForm: {},
            // 表格配置
            configTable: {},
            // 数据
            childTableData: []
          };
          return params;
        }
      }
    },
    mounted () {
      this.searchConfigForm = JSON.parse(JSON.stringify(this.queryPageConfig.searchConfigForm));
      this.configTable = JSON.parse(JSON.stringify(this.queryPageConfig.configTable));
      this.childTableData = JSON.parse(JSON.stringify(this.queryPageConfig.childTableData));
    },
    methods: {
      // 分页
      getPages (obj) {
        if (obj.isSzieChange) {
          this.pageSize = obj.pageSize;
        } else {
          this.pageNo = obj.pageNo;
        }
        this._getDataList();
      },
      // 搜索条件
      emitSearchForm () {

      }
    }
};
</script>
<style lang="scss" scoped>

</style>
