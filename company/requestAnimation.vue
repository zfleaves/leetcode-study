<template>
    <div class="board-warp">
        <div id="test"></div>
        <div class="content">
            <board-item v-for="(item, index) in fetchData.list" :key="index" :item="item"></board-item>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, markRaw, reactive } from "vue";
import { boardApis } from "@/apis";
import BoardItem from './components/board-item.vue'
import { tools } from "@/util";
import boardItem from "./components/board-item.vue";
import type { ItemObject } from './components/itemType'
import { ElLoading } from "element-plus";

type Fetch = {
    totalData: Array<ItemObject>,
    list: Array<ItemObject>,
    total: number,
    once: number
    countOfRender: number
}

const fetchData = reactive<Fetch>({
    totalData: [], // 接口请求回来的完整数据
    list: [], // 当前渲染的数量
    total: 0, // 渲染总数
    once: 1, // 设置每次插入显示的DOM数量，根据情况自己设置
    countOfRender: 0  // 当前已经渲染DOM的总数
})



onMounted(() => {
    tools.setScale();
    tools.onThrottleEvent("resize", "throttleResize", tools.setScale);
    getnewBoardList()
})

const getnewBoardList = () => {
    const loading = ElLoading.service({
        lock: true,
        text: "数据加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
    });
    boardApis.getKPIScoreNewBoard().then((res: any) => {
        console.log('res: ', res);
        // res[0].schemeUrl = 'http://172.20.151.100:3100/project/60/interface/api/774'
        // res[0].isTaskScheme = '1'
        fetchData.totalData = markRaw(res)
        fetchData.total = res.length
        loading.close();
        loop()
    }).catch(e => {
        loading.close();
    })
}

const loop = () => {
    // 每次只渲染once条数据
    const temp: Array<ItemObject> = []; // 起始值
    for (let i = 0; i < fetchData.once; i++) {
    // 当DOM渲染完就退出
    if (fetchData.countOfRender >= fetchData.total) return;
        const item = fetchData.totalData[fetchData.countOfRender]
        temp.push(item);
        fetchData.countOfRender += 1;
    }
    fetchData.list = fetchData.list.concat(temp);
    window.requestAnimationFrame(loop) // 把你的一个ts 平时demo 发我下，我去看看
}

</script>

<style scoped lang="scss">
.board-warp {
    width: 100%;
    padding: 40px 40px;
    overflow: hidden;
    background: #F7F7F7;
    .content {
        width: 100%;
        padding: 10px;
        .board-item {
            width: calc((100% - 40px) / 3);
            float: left;
            background: white;
            box-shadow: var(--el-box-shadow-light);
            // border: 1px solid #dedede;
            margin-right: 20px;
            // height: 460px;
            margin-bottom: 40px;
            &:nth-child(3n) {
                margin-right: 0;
            }
        }
    }
}
</style>