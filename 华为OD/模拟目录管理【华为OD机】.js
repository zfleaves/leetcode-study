/*
 * @Date: 2024-06-02 18:57:37
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-02 18:58:19
 * @FilePath: \leetcode-study\华为OD\模拟目录管理【华为OD机】.js
 */
// 初始化当前目录为根目录  
let currentDir = '/';

// 存储目录结构（在这个简单模拟中，只用来判断目录是否存在）  
let directories = {
    '/': true
};

// 创建目录的函数  
function mkdir(dirName) {
    // 忽略已存在的目录  
    if (directories[currentDir + dirName]) return;
    // 更新目录结构  
    directories[currentDir + dirName] = true;
}

// 进入目录的函数  
function cd(dirName) {
    let targetDir = dirName === '..' ? currentDir.split('/').slice(0, -1).join('/') : currentDir + dirName;
    // 如果目标目录存在，则切换到该目录  
    if (directories[targetDir] || targetDir === '/') {
        currentDir = targetDir;
    }
}

// 查看当前所在路径的函数  
function pwd() {
    return currentDir;
}

// 主函数，处理输入  
function processCommands(commands) {
    commands.forEach(command => {
        const [cmd, ...args] = command.trim().split(/\s+/);
        switch (cmd) {
            case 'mkdir':
                mkdir(args[0]);
                break;
            case 'cd':
                cd(args[0]);
                break;
            case 'pwd':
                console.log(pwd()); // 最后一条命令的结果将直接输出  
                break;
            default:
                console.log('Unknown command');
        }
    });
}

// 示例输入  
const inputCommands = [
    'mkdir abc',
    'cd abc',
    'mkdir def',
    'cd ..',
    'pwd'
];

// 处理输入并输出结果  
processCommands(inputCommands);