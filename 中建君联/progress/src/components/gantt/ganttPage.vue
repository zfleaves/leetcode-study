<!--
 * @Author: your name
 * @Date: 2021-01-28 10:28:40
 * @LastEditTime: 2022-02-21 15:44:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\components\gantt\ganttPage.vue
-->
<template>
  <div class="ganttPageWrap" v-if="pageConfigLoading" v-loading="loading">
    <gantt :readonly="readonly" :tasks="ganttTasks" :projectId="projectId" :planStartDate="planStartDate"  v-loading="loading">
    </gantt>
  </div>
</template>

<script>
export default {
  name: 'ganttPage',
  provide() {
    return {
      ganttPage: this
    };
  },
  components: {
    gantt (resolve) {
      require(['components/gantt/gantt.vue'], resolve);
    }
  },
  data() {
    return {
      id: '',
      type: 'edit',
      projectId: '',
      routerName: '',
      routerNameList: [
        { name: 'demMasterPlan', infoUrl: 'demMasterPlan/getInfo', params: 'masterPlanId' },
        { name: 'demMasterPlanAdjust', infoUrl: 'demMasterPlanAdjust/getInfo', params: 'masterPlanAdjustId' },
        { name: 'demMasterExecute', infoUrl: 'demMasterPlan/getInfo', params: 'masterPlanId' },
        { name: 'history', infoUrl: 'demMasterPlan/getHistoryInfo', params: 'masterPlanBakId' }
      ],
      loading: true,
      pageConfigLoading: false,
      ganttTasks: {},
      readonly: true,
      masterPlanId: '',
      planStartDate: ''
    };
  },
  beforeRouteEnter (to, from, next) {
    if (to.params.lastRouterName === 'history') {
      to.meta.lastRouterName = 'demMasterPlan';
    } else {
      to.meta.lastRouterName = to.params.lastRouterName;
    }
    next();
  },
  created () {
    const params = this.$route.params;
    this.type = this.$base64.decode(params.type);
    this.readonly = this.type === 'info';
    this.id = this.$base64.decode(params.id);
    this.routerName = params.lastRouterName;
    this.getInfo();
  },
  methods: {
    getInfo() {
      const lastRouter = this.routerNameList.find(v => v.name === this.routerName);
      if (!lastRouter) {
        this.pageConfigLoading = true;
        this.loading = false;
        return;
      }
      this.$store.dispatch(lastRouter.infoUrl, {[lastRouter.params]: this.id}).then(res => {
          const results = this.$clone(res.results);
          if (!results) {
            this.pageConfigLoading = true;
            this.loading = false;
            return;
          }
          this.masterPlanId = results.masterPlanId;
          this.projectId = results.projectId;
          this.planStartDate = results.planStartDate;
          const demMasterPlanGant = this.setData(results.demMasterPlanGants);
          const demMasterPlanLinks = this.setLinks(results.demMasterPlanLinks);
          this.ganttTasks = {
            data: demMasterPlanGant,
            links: demMasterPlanLinks
          };
          this.pageConfigLoading = true;
          this.loading = false;
      });
    },
    // 设置节点
    setData(arr) {
      for (const item of arr) {
        item.nodeId = item.id;
        delete item.id;
        item.id = item.cid;
        item.start_date = item.startDate.split(' ')[0];
        item.end_date = item.endDate ? item.endDate.split(' ')[0] : '';
        item.start_date = `${item.start_date}`;
        item.end_date = `${item.end_date}`;
        item.open = item.open !== 0;
        if (this.routerName === 'demMasterExecute') {
          item.realStartDate = item.realStartDate ? item.realStartDate.split(' ')[0] : '';
          item.realEndDate = item.realEndDate ? item.realEndDate.split(' ')[0] : '';
          let realDuration = item.realDuration || 0;
          realDuration = realDuration * 100;
          item.realDuration = Number(realDuration.toFixed(4));
          item.progressEstimate = this.setDicData(item.progressEstimate);
        }
      }
      console.log(arr, 'arr');
      return arr;
    },
    // 表格数据字典
    setDicData (value) {
        const selectList = [
            { dataName: 'demMasterExecute.progressEstimate0', dataCode: 0 },
            { dataName: 'demMasterExecute.progressEstimate1', dataCode: 1 },
            { dataName: 'demMasterExecute.progressEstimate2', dataCode: 2 }
        ];
        const index = selectList && selectList.findIndex(v => v.dataCode === value);
        if (index < 0) return '';
        return this.$t(selectList[index].dataName);
    },
    // 设置连线
    setLinks(arr) {
      // for (const item of arr) {
      //   item.nodeId = item.id;
      //   delete item.id;
      //   item.id = item.cid;
      //   item.start_date = item.startDate;
      //   item.end_date = item.startDate;
      //   item.open = item.open === 0 ? false : true
      // }
      return arr;
    }
  }
};
</script>

<style  lang="scss" scoped>
.test {
    width: 100%;
    height: 100%;
    .contents {
      padding: 10px;
      box-sizing: border-box;
      flex: 1;
    }
}
</style>
