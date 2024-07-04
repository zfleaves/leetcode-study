/*
 * @Date: 2024-06-02 19:08:14
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-02 19:08:24
 * @FilePath: \leetcode-study\华为OD\考勤信息.js
 */
function canReceiveAttendanceAward(attendanceRecord) {  
    // 定义一个数组来保存当前连续出现的迟到/早退的次数  
    let consecutiveLateLeaveEarlyCount = 0;  
    // 定义一个数组来保存过去7次出勤的情况  
    let pastSevenAttendance = [];  
    // 定义一个变量来保存缺勤的次数  
    let absentCount = 0;  
    
    // 遍历出勤记录  
    for (let i = 0; i < attendanceRecord.length; i++) {  
      const attendance = attendanceRecord[i];  
    
      // 更新过去7次出勤的情况  
      if (pastSevenAttendance.length >= 7) {  
        pastSevenAttendance.shift(); // 移除最早的一次记录  
      }  
      pastSevenAttendance.push(attendance);  
    
      // 根据出勤情况更新计数  
      switch (attendance) {  
        case 'absent':  
          absentCount++;  
          // 如果缺勤超过一次，则不能获得出勤奖  
          if (absentCount > 1) {  
            return false;  
          }  
          // 缺勤不影响迟到/早退的连续计数，所以不需要重置  
          break;  
        case 'late':  
        case 'leaveearly':  
          consecutiveLateLeaveEarlyCount++;  
          // 如果连续迟到/早退超过一次，则不能获得出勤奖  
          if (consecutiveLateLeaveEarlyCount > 1) {  
            return false;  
          }  
          // 检查过去7次出勤中，缺勤/迟到/早退是否超过3次  
          if (pastSevenAttendance.filter(a => a !== 'present').length > 3) {  
            return false;  
          }  
          break;  
        case 'present':  
          // 如果当前不是迟到/早退，则重置连续迟到/早退的计数  
          consecutiveLateLeaveEarlyCount = 0;  
          break;  
        default:  
          // 未知的出勤情况，可以根据需要添加错误处理  
          return false;  
      }  
    }  
    
    // 如果循环结束，则说明满足所有条件  
    return true;  
  }  
    
  // 示例  
  const attendanceRecord = 'presentlateabsentleaveearlypresentpresentpresentlatepresent';  
  const canReceive = canReceiveAttendanceAward(attendanceRecord);  
  console.log(canReceive); // 输出结果：根据提供的出勤记录，判断是否能获得出勤奖