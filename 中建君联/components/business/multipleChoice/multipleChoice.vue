<!--
 * @Author: your name
 * @Date: 2020-12-02 10:28:50
 * @LastEditTime: 2020-12-02 10:30:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_portal\src\components\business\multipleChoice\multipleChoice.vue
-->
<template>
    <div class="multiple-choice-icon">
        <div>
            <el-tag
                v-for="item in tagDadaList" :key="item[selectConfig.rowKey]"
                style="margin-right: 10px;"
                type="info" size="mini" :closable="tagDisabled" @close="handleDelete(item)">
                {{item[selectConfig.rowName]}}
            </el-tag>
            <el-tag v-if="selectList.length > selectConfig.constNum" type="info" size="mini">
                +{{selectList.length - selectConfig.constNum}}
            </el-tag>
        </div>
        <div @click="handlMultipleChoice" v-if="isDisabled">
            <i class="multiple-choice-icon iconfont icon-menu"></i>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            tagDadaList: [],
            selectList: [],
            tagDisabled: false
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
    created() {
        if (this.processDisabled) {
            this.tagDisabled = true;
        } else {
            this.tagDisabled = this.isDisabled;
        }
    },
    watch: {
        userList: {
            handler() {
                if (!this.isConfig) return;
                this.selectList = JSON.parse(JSON.stringify(this.userList));
                this.tagDadaList = this.selectList.slice(0, this.selectConfig.constNum);
            },
            immediate: true
        },
        'selectConfig.tagDada': {
            handler() {
                if (!this.isConfig) return;
                if (this.userList && this.userList.length > 0) return;
                this.selectList = JSON.parse(JSON.stringify(this.selectConfig.tagDada));
                this.tagDadaList = this.selectList.slice(0, this.selectConfig.constNum);
            },
            immediate: true
        }
    },
    methods: {
        handleDelete(item) {
            this.$emit('tagDelete', item);
        },
        // 点击多选按钮
        handlMultipleChoice() {
            this.$emit('select', true);
        }
    }
};
</script>
<style lang="scss" scoped>
.multiple-choice-icon{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 6px;
    line-height: 36px;
    .multiple-choice-icon{
        font-size: 16px;
        color: #009F3A;
    }
}
</style>
