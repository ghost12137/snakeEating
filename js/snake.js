window.onload = function () {
  //获取元素节点
  var big = document.querySelector(".big"); //获取工作区
  var ball = document.querySelector("span"); //获取小球
  var snake = document.querySelector("ul"); //获取蛇
  var ballCount = document.querySelector(".ballCount"); //获取每局的计数
  var ballCountLis; //给计数的li标签
  var snakeBody; //给蛇身的li标签
  var speed; //蛇的速度
  var arrAll; //二维数组，每一项为一个数组，保存每一个li的x，y和方向 0:y,1: x, 2: direction
  var timer; //蛇运动时的定时器 Interval
  var timers; //数组，蛇吃到小球后，小球顺着身子流动的定时器，数组是因为可能小球还未到尾部，又吃到了一个小球
  var index; //数组，与speed绑定
  var direction; //现在蛇运动的方向
  var flag; //判断现在是否按下了方向键 
  var num; //用来记忆最初蛇身的长度，计数吃到几个小球后减去
  var start; //判断是否开始游戏
  var ballXY; //保存小球的坐标
  var floor = Math.floor;
  var random = Math.random;

  //生成小球
  function ballPosition() {
    let temp;

    do {
      temp = false;
      ballXY.x = floor(random() * 36) * 20;
      ballXY.y = floor(random() * 29) * 20;

      //使用for循环遍历蛇身，使小球不会出现在蛇身
      for (let i = 0;i < snakeBody.length;++i) {
        if (ballXY.x == arrAll[i][0] && ballXY.y == arrAll[i][1]) {
          temp = true;
          break;
        }
      }
    } while (temp)
    ball.style.left = ballXY.x + "px";
    ball.style.top = ballXY.y + "px";
    ball.style.display = "block";
  };

  //初始化变量
  function initData() {
    speed = 200;
    arrAll = [];
    timers = [];
    index = [];
    ballXY = {
      x: 0,
      y: 0
    };
    let snakeInnerHTML = "<li></li><li></li><li></li><li></li>"
    snake.innerHTML = snakeInnerHTML;
    snakeBody = document.querySelectorAll("ul li");
    num = snakeBody.length;

    // 给所有的li一个定位，并记录到arrAll中
    for (let i = num - 1;i >= 0;--i) {
      let arr = [0, 20 * i, "right"];
      arrAll.push(arr);
      snakeBody[i].style.top = 0;
      snakeBody[i].style.left = 20 * (num - 1 - i) + "px";
      let b = document.createElement("b");
      snakeBody[i].appendChild(b);
    }
    //给arrAll多造一个子元素, 用来为吃到小球后新增的身子赋值
    arrAll[arrAll.length] = [20 * num - 1, 0, "right"];
    ballPosition();     //生成小球位置
    timer = null;
    timers = [];
    direction = "right";
    flag = null;
    start = false;
  };

  //move函数
  function move() {
    //如果按下了方向键，那么为direction赋flag的值
    if (flag) {
      direction = flag;
    }
    //使用for循环依次移动每一个li
    for (var i = arrAll.length - 1;i >= 0;--i) {
      if (i == arrAll.length - 1) {
        var arrs = [];
        arrs[0] = arrAll[i - 1][0];
        arrs[1] = arrAll[i - 1][1];
        arrs[2] = arrAll[i - 1][2];   //direction
        arrAll[i] = arrs;
      } else {
        //如果是第一个li，则它的方向更新为目前的方向
        if (0 == i) {
          arrAll[i][2] = direction;
        } else {
          //如果不是，则把li的移动方向设置为前一个的
          arrAll[i][2] = arrAll[i - 1][2];
        }
        //根据方向来更新位置
        switch (arrAll[i][2]) {
          case "top":
            arrAll[i][0] -= 20;
            snakeBody[i].style.top = arrAll[i][0] + "px";
            snakeBody[i].querySelector('b').style.transform = "translate(-10px, 0) rotate(270deg)";
            break;
          case "right":
            arrAll[i][1] += 20;
            snakeBody[i].style.left = arrAll[i][1] + "px";
            snakeBody[i].querySelector("b").style.transform = "translate(-10px, 0) rotate(0deg)";
            break;
          case "bottom":
            arrAll[i][0] += 20;
            snakeBody[i].style.top = arrAll[i][0] + "px";
            snakeBody[i].querySelector("b").style.transform = "translate(-10px, 0) rotate(90deg)";
            break;
          case "left":
            arrAll[i][1] -= 20;
            snakeBody[i].style.left = arrAll[i][1] + "px";
            snakeBody[i].querySelector("b").style.transform = "translate(-10px, 0) rotate(180deg)";
            break;
        }
      }
    }
    snakeBody[0].querySelector("b").style.transform = "translate(-12px, 0) rotate(0deg)";
    //判断是否按下了方向键，转动蛇头
    if (flag) {
      if ("bottom" == flag) {
        snakeBody[0].style.transform = "rotate(90deg)";
      } else if ("right" == flag) {
        snakeBody[0].style.transform = "rotate(0deg)";
      } else if ("top" == flag) {
        snakeBody[0].style.transform = "rotate(270deg)";
      } else if ("left" == flag) {
        snakeBody[0].style.transform = "rotate(180deg)";
      }
      flag = null;
      timer = setInterval(move, speed);
    }
    //判断蛇是否吃掉了小球
    if (arrAll[0][0] == ballXY.y && arrAll[0][1] == ballXY.x) {
      clearInterval(timer);
      speed = 200;
      timer = setInterval(move, speed);
      //产生一个新的小球
      ball.style.display = "none";
      ballPosition();
      //下面是启动球的函数定时器
      index[index.length] = 1;
      timers[timers.length] = setInterval(dingshiqi, 20, timers.length);//时间后的参数为传入参数
    }
    //判断蛇是否碰壁或碰到自己
    for (var i = 1;i < snakeBody.length;++i) {
      if (arrAll[0][0] == arrAll[i][0] &&
          arrAll[0][1] == arrAll[i][1] ||
          arrAll[0][0] < 0 ||
          arrAll[0][0] == 600 ||
          arrAll[0][1] < 0 ||
          arrAll[0][1] == 740) {
            clearInterval(timer);
            snakeBody[0].style.zIndex = snakeBody.length;
            snakeBody[0].style.backgroundColor = "red";
            start = false;
            var tempTimer = setTimeout(function() {
              snakeBody[0].style.backgroundColor = "#b5cad5";
              initData();
            }, 1000);
            break;
          }
    }
  };
  
  //吃掉小球，出现顺着身子移动的白色的函数
  function dingshiqi(temp) {
    snakeBody[index[temp]].style.backgroundColor = "#b5cad5";
    if (index[temp] == snakeBody.length - 1) {
      clearInterval(timers[temp]);
      //新生成的蛇身数组，其位置和方向为之前的最后一个蛇身
      // var arr = [arrAll[arrAll.length - 1][0], arrAll[arrAll.length - 1][1], arrAll[arrAll.length - 1][2]];
      var arr = [...arrAll[arrAll.length - 1]];
      arrAll[arrAll.length] = arr;
      //创建一个新li元素
      var li = document.createElement("li");
      var b = document.createElement("b");
      li.appendChild(b);
      snake.appendChild(li);
      //更新蛇身
      snakeBody = document.querySelectorAll("ul li");
      snakeBody[snakeBody.length - 1].style.top = arr[0] + "px";
      snakeBody[snakeBody.length - 1].style.left = arr[1] + "px";
      ballCountLis[ballCountLis.length - 1].innerHTML = "吃掉小球数量为：" + (arrAll.length - 1 - num) + "枚!";
      return;
    }
    snakeBody[index[temp] + 1].style.backgroundColor = "#fff";
    index[temp]++;
  }

  //相应按下键盘
  function keyDown(event) {
    if ("red" === snakeBody[0].style.backgroundColor) return; //蛇头碰到身体或者边框
    //如果是空格键
    if (32 === event.keyCode) {
      if (timer) {
        clearInterval(timer);
        timer = null;
        flag = true;
      } else {
        timer = setInterval(move, speed); //每个speed运行move函数
        flag = false;
        //如果游戏没运行，也就是初次启动，而不是暂停后启动
        if (!start) {
          //如果是失败了，蛇头为红色，此时也屏蔽空格
          let count = document.createElement("li");
          count.innerHTML = "吃掉小球的数量: " + (arrAll.length - 1 - num) + "个!";
          ballCount.appendChild(count);
          ballCountLis = document.querySelectorAll("ol li");
          start = true;
        }
      }
      return;
    }
    //如果游戏没有开始，则按其他键没用
    if (!start) return;
    //如果按下了回车或Q
    if (13 == event.keyCode || 81 == event.keyCode) {
      if (timer) {
        clearInterval(timer);
        if (50 == speed) speed = 200;
        else speed = 50;
        timer = setInterval(move, speed);
      } else {
        if (50 == speed) speed = 200;
        else speed = 50;
      }
      return;
    }
    if (flag) return;
    //向上
    if (38 == event.keyCode || 87 == event.keyCode) {
      if ("bottom" == direction || "top" == direction) return;
      flag = "top";
    } else if (37 == event.keyCode || 65 == event.keyCode) {
      if ("right" == direction || "left" == direction) return;
      flag = "left";
    } else if (39 == event.keyCode || 68 == event.keyCode) {
      if ("left" == direction || "right" == direction) return;
      flag = "right";
    } else if (40 == event.keyCode || 83 == event.keyCode) {
      if ("top" == direction || "bottom" == direction) return;
      flag = "bottom";
    } else {
      return;
    }
    speed = 200;
    clearInterval(timer);
    move();
  };




  initData();
  document.addEventListener("keydown", keyDown);
};