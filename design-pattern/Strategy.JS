// 策略类，策略类封装了具体的算法，并负责具体的计算过程

var calculateBouns = function (salary, level) {
  if (level === "A") {
    return salary * 4;
  }
  if (level === "B") {
    return salary * 3;
  }
  if (level === "C") {
    return salary * 2;
  }
};
// 调用如下：
console.log(calculateBouns(4000, "A")); // 16000
console.log(calculateBouns(2500, "B")); // 7500

// 又比如实现一个表单校验的代码，常常会像如下写法：
var registerForm = document.getElementById("registerForm");
registerForm.onsubmit = function () {
  if (registerForm.userName.value === "") {
    alert("用户名不能为空");
    return;
  }
  if (registerForm.password.value.length < 6) {
    alert("密码的长度不能小于6位");
    return;
  }
  if (!/(^1[3|5|8][0-9]{9}$)/.test(registerForm.phoneNumber.value)) {
    alert("手机号码格式不正确");
    return;
  }
};
