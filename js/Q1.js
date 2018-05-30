"use strict";
var state = "on";

function toggleLight() {
  var image = document.getElementById('image');
  if ( state == "on" ) {
    state = "off";
    image.src = "img/off.jpg";
  } else {
    state = "on";
    image.src = "img/on.jpg";
  }
}

var timeLeft = 5;

function countDownTimer() {
  timeLeft = timeLeft - 1;
  if (timeLeft <= 0) {
    document.getElementById("image").src = "img/off.jpg";
    clearInterval(setting);
  }
  document.getElementById("timer").value = timeLeft;
} 


var setting = 0;

document.onkeyup = function(event) {
    if (event.keyCode == 13) {      //keycode==13 對應到鍵盤的ENTER
      var num = window.timer.value;
      if (isNaN(num)) {
        alert("請輸入數字")
      } else {
        var timeUI = num;
        timeLeft = parseInt(timeUI);
        setting = setInterval(countDownTimer, 1000);
        document.activeElement.blur();  //取消聚焦
      }
    }
  }

  function clearValue() {
    window.timer.value = '';
    clearInterval(setting);
  }