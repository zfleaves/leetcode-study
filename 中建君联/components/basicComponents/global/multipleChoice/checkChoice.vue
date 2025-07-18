<!--
 * @Author: your name
 * @Date: 2021-02-18 09:19:11
 * @LastEditTime: 2022-09-15 15:06:04
 * @LastEditors: zengqin 1058574586@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_tenders\src\components\basicComponents\global\multipleChoice\checkChoice.vue
-->
<template>
  <div class="multiple-choice-icon">
    <div>
      <el-checkbox-group v-model="checkedCities" size="mini" style="margin-right: 10px;"
        @change="handleCheckedCitiesChange">
        <el-checkbox v-for="item in tagDadaList" :disabled="!tagDisabled" :label="item[selectConfig.rowKey]"
          :key="item[selectConfig.rowKey]">
          {{item[selectConfig.rowName]}}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <div @click="handlMultipleChoice" v-if="isDisabled">
      <i class="multiple-choice-icon iconfont icon-liebiao"></i>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tagDadaList: [],
      selectList: [],
      tagDisabled: false,
      checkedCities: []
    };
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
          constNum: 2
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
        this.tagDadaList = this.selectList;
        this.checkedCities = this.selectList.filter(v => v.isChecked).map(v => v[this.selectConfig.rowKey]);
      },
      immediate: true
    },
    'selectConfig.tagDada': {
      handler () {
        if (!this.isConfig) return;
        if (this.userList && this.userList.length > 0) return;
        this.selectList = JSON.parse(JSON.stringify(this.selectConfig.tagDada));
        this.tagDadaList = this.selectList;
        this.checkedCities = this.selectList.filter(v => v.isChecked).map(v => v[this.selectConfig.rowKey]);
      },
      immediate: true
    },
    processDisabled: {
      handler () {
        if (this.processDisabled) {
          this.tagDisabled = true;
        } else {
          this.tagDisabled = this.isDisabled;
        }
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
    handleCheckedCitiesChange (arr) {
      this.tagDadaList.forEach(v => {
        v.isChecked = false;
      });
      for (const item of arr) {
        const index = this.tagDadaList.findIndex(v => v[this.selectConfig.rowKey] === item);
        if (index >= 0) {
          this.tagDadaList[index].isChecked = true;
        }
      }
      this.$emit('update:selectAssigneeUsers', this.tagDadaList);
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
