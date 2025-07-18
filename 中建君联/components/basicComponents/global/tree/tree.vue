<template>
  <div class="tree">
    <div class="cons">
      <el-tree
        :data="treeData"
        :empty-text="emptyText"
        ref="tree"
        node-key="id"
        :props="defaultProps"
        :load="load"
        lazy
        @node-click="nodeClick">
        <!--  节点树内容区渲染 -->
        <div class="custom-tree-node" slot-scope="{data }">
          <div class="tree-list">
            <template v-for="item in treeConfig.slaveColumns">
              <tooltips :key="item.id" :value="data[item.cloneFormColumnSource]"></tooltips>
            </template>
            <div class="tree-btn">
              <el-button
                :key="but.id"
                v-for="but in treeConfig.buts"
                :class="but.style"
                @click="setFn(but, data)"
                type="text" size="mini" v-fast-click>
                {{but.buttonName}}
              </el-button>
            </div>
          </div>
        </div>
      </el-tree>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'tree',
    data () {
      return {
        treeData: [],
        defaultProps: {
          children: 'children',
            label: (node) => node,
            isLeaf: 'leaf'
        },
        emptyText: '努力加载中...'
      };
    },
    props: {
      searchData: {
        default: () => {
        },
        type: Object
      },
      treeConfig: {
        default: () => []
      }
    },
    watch: {
      searchData: {
        handler () {
          this._getTreeData(0, 'search');
        },
        immediate: true
      }
    },
    methods: {
      // 懒加载
      load (node) {
        console.log(node);
      },
     // 获取第一层数据
      _getTreeData (parentId, type) {
        console.log(parentId, type);
      },
      // 点击节点时
      nodeClick (event) {
        this.$emit('update:node', JSON.parse(JSON.stringify(event)));
      },
      // 行按钮
      setFn (btnParameter, row) {
        this.$emit('fnName', row);
      }
    }
  };
</script>

<style scoped lang="scss">
  .tree {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 100%;
    position: relative;
    font-size: 14px;
    .tree-list{
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
    }
    .cons {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 10px;
      background: white;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      .header-search {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        span {
          color: rgb(101, 198, 236);
        }
        div {
          width: 70%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .el-input--small .el-input__inner {
            width: 100px;
            font-size: 14px;
          }
        }
      }
      .custom-tree-node {
        width: 100%;
        line-height: 35px;
        display: flex;
        overflow: hidden;
      }
    }
  }

</style>
