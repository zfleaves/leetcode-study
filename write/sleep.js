// 8. 【代码题】实现一个同步的 sleep 方法
function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
// 可取消的 sleep

function sleepWithCancel(time) {
    let timeId;
    let prpmise = new Promise(resolve => {
        timeId = setTimeout(resolve, time)
    });

    prpmise.cancel = () => clearTimeout(timeId);
    return prpmise;
}