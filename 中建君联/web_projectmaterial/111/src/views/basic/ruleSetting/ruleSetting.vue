<template>
    <div class="ruleSetting">
        <g-edit-title :title="$t('menu.ruleSetting')"></g-edit-title>
        <div class="content">
            <div class="title">
                <span class="title-tips">{{$t('ruleSetting.check')}}</span>
                <el-switch
                style="display: block"
                v-model="check"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :disabled="!(authButtonList.indexOf('check') >= 0)"
                :active-text="$t('ruleSetting.openCheck')"
                :inactive-text="$t('ruleSetting.closeCheck')"
                @change="changeStatus">
                </el-switch>
            </div>
            <el-divider content-position="left">{{$t('tips.tips')}}</el-divider>
            <div class="tips">
                <p>{{$t('ruleSetting.tips1')}}</p>
                <p>{{$t('ruleSetting.tips2')}}</p>
                <p>{{$t('ruleSetting.tips3')}}</p>
                <p>{{$t('ruleSetting.tips4')}}：</p>
                <p>{{$t('ruleSetting.tips5')}}</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'ruleSetting',
    data() {
        return {
            check: true,
            authButtonList: [],
            mastercheckList: []
        };
    },
    created() {
        this.authButtonList = this.$route.meta.authButtonList && this.$route.meta.authButtonList.map(v => v.resUrl);
        this._mastercheckList();
    },
    methods: {
        _mastercheckList() {
            this.$store.dispatch('ruleSetting/mastercheckList').then(res => {
                if (res.status === 0) {
                    this.mastercheckList = res.results;
                    this.mastercheckList.length === 0 ? this.setCheck(1) : (this.check = this.mastercheckList[0].status === 0);
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
            });
        },
        changeStatus(value) {
            this.$confirm(this.$t(`ruleSetting.${value ? 'open' : 'close'}`), this.$t('tips.tips'), {
                type: value ? 'success' : 'warning'
            }).then(() => {
                this.setCheck(value);
            }).catch(() => {
                this.check = !this.check;
            });
        },
        setCheck(value) {
            const data = [
                {
                    status: value ? 0 : 1,
                    id: this.mastercheckList.length ? this.mastercheckList[0].id : '',
                    titleCode: '01',
                    titleValue: '预算明细与品种库匹配校验设置'
                }
            ];
            this.$store.dispatch('ruleSetting/mastercheckEdit', data).then(res => {
                if (res.status !== 0) {
                    this.$message.error(`${this.$t(`ruleSetting.${value ? 'openCheck' : 'closeCheck'}`)}${this.$t('tips.fail')}`);
                } else {
                    this._mastercheckList();
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.ruleSetting{
    width: 100%;
    height: 100%;
    .content{
        width: 100%;
        height: 100%;
        .title{
            margin: 2% 0;
            display: flex;
            font-size: 14px;
            .title-tips{
                margin-right: 20px;
            }
        }
        .tips{
            margin-top: 5%;
            color: red;
            font-size: 14px;
        }
    }
}
</style>
