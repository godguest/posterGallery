'use strict';
// 改写视图为模板字符串，在HTML中操作
// <div class="stage">
//   <section class="wrap" id="wrap">
//     <figure class="photo front" id="photo{{index}}" onclick="act({{index}});">
//       <img src="images/{{img}}.jpg" alt="{{alt}}">
//       <figcaption class="caption">
//         <h2 class="title">{{title}}</h2>
//         <div class="desc">
//           {{desc}}
//         </div>
//       </figcaption>
//     </figure>
//   </section>
//   <nav class="ctrl" id="ctrl">
//     <span class="icon front" id="icon{{index}}" onclick="act({{index}});"></span>
//   </nav>
// </div>

// 通用函数
// 获取指定id/class的元素
function $(selector) {
  let method = selector.substr(0, 1) == '#' ? 'getElementById' : 'getElementsByClassName';
  return document[method](selector.substr(1));
}
// 生成指定范围的随机整数
function random(range) {
  let min = range[0], max = range[1];
  return Math.floor(Math.random() * (max - min)) + min;
}

// 翻面/居中控制
function act(n) {
  let photo = $('#photo' + n);
  let icon = $('#icon' + n);
  let clsP = photo.className;
  let clsI = icon.className;
  if (/center/.test(clsP)) {
    if (/back/.test(clsP)) {
      clsP = clsP.replace('back', 'front');
      clsI = clsI.replace('back', 'front');
    } else {
      clsP = clsP.replace('front', 'back');
      clsI = clsI.replace('front', 'back');
    }
    photo.className = clsP;
    icon.className = clsI;
  } else {
    arrange(n);
  }
}

// 输出所有的海报和控制按钮
(function () {
  let wraps = [];
  let ctrls = [];
  let wrap = $('#wrap').innerHTML;
  let ctrl = $('#ctrl').innerHTML;
  for (let i in data) {
    let info = data[i];
    let tplW = wrap.replace(/{{index}}/g, i)
                   .replace('{{img}}', info.img)
                   .replace('{{alt}}', info.alt)
                   .replace('{{title}}', info.title)
                   .replace('{{desc}}', info.desc);
    wraps.push(tplW);
    let tplC = ctrl.replace(/{{index}}/g, i);
    ctrls.push(tplC);
  }
  $('#wrap').innerHTML = wraps.join('');
  $('#ctrl').innerHTML = ctrls.join('');
  arrange(random([0, data.length]));
})();

// 整理海报
function arrange(n) {
  let photos = [];
  let photo = $('.photo');
  let icon = $('.icon');
  for (let i = 0; i < photo.length; i++) {
    let clsP = photo[i].className;
    let clsI = icon[i].className;
    clsP = clsP.replace(' center', '');
    clsI = clsI.replace(' center', '');
    if (/back/.test(clsP)) {
      clsP = clsP.replace('back', 'front');
      clsI = clsI.replace('back', 'front');
    }
    photo[i].className = clsP;
    photos.push(photo[i]);
    icon[i].className = clsI;
  }
  let cPhoto = $('#photo' + n);
  let cIcon = $('#icon' + n);
  let ranges = range();
  cPhoto.className += ' center';
  cPhoto.removeAttribute('style');
  cPhoto.style.left = ranges.cX + 'px';
  cPhoto.style.top = ranges.cY + 'px';
  cIcon.className += ' center';
  photos.splice(n, 1);
  let mid = Math.round(photos.length / 2);
  for (let i in photos) {
    let photo = photos[i];
    let x = i < mid ? ranges.leftX : ranges.rightX;
    let y = ranges.y;
    photo.style.left = random(x) + 'px';
    photo.style.top = random(y) + 'px';
    photo.style.transform = 'rotate(' + random([-150, 150]) + 'deg) scale(1)';
  }
}

// 计算海报的位置范围，每个海报至少露出一个角
function range() {
  let wrap = $('#wrap'),
      wrapW = wrap.clientWidth,
      wrapH = wrap.clientHeight,
      wrapW2 = Math.round(wrapW / 2),
      wrapH2 = Math.round(wrapH / 2);
  let photo = $('#photo0'),
      photoW = photo.clientWidth,
      photoH = photo.clientHeight,
      photoW2 = Math.round(photoW / 2),
      photoH2 = Math.round(photoH / 2);
  let range = {
    leftX: [-photoW2, wrapW2 - photoW2 * 3],
    rightX: [wrapW2 + photoW2, wrapW - photoW2],
    y: [-photoH2, wrapH - photoH2],
    cX: wrapW2 - photoW2,
    cY: wrapH2 - photoH2
  };
  return range;
}