var musiclist=[];
musicapi._request('./musiclist.json',function(data){
    if(typeof data=='string') data=JSON.parse(data);
  if(data==false){
    alert('歌曲列表获取失败！');
  }else{
    musiclist=data;
    var ul=document.querySelector(".musiclist ul");
    musiclist.forEach(function(r,i){
      var li=document.createElement("li");
      li.innerHTML='<div class="anim"><div></div><div></div><div></div></div><div class="index"></div><div class="name"></div>'
      li.querySelector(".name").innerHTML=r.artist+' - '+r.name;
      li.querySelector(".index").innerHTML=i;
      li.onclick=function(){
        play(i);
      }
      ul.appendChild(li);
    });
    init();
  }
})

var LRC={0:'歌词加载中'};
var defimg='https://image.gumengya.cn/i/2023/10/15/652b46cf15392.png';
var el={
  img:document.getElementById("img"),
  title:document.getElementById("music-title"),
  album:document.getElementById("music-album"),
  singer:document.getElementById("music-singer"),
  audio:document.getElementById("audio"),
  range:{
    r1:document.querySelector(".range .r1"),
    r2:document.querySelector(".range .r2"),
    r:document.querySelector(".range")
  },
  time:{
    cur:document.querySelector(".time .l"),
    max:document.querySelector(".time .r"),
  },
  playbtn:document.querySelector(".playbtn"),
  container:document.querySelector(".siquan-player .container"),
  lrc:document.querySelector(".right ul"),
  lastbtn:document.querySelector(".lastbtn"),
  nextbtn:document.querySelector(".nextbtn"),
  sx:document.querySelector(".sx"),
  mode:document.querySelector(".mode"),
  musiclistbtn:document.getElementById("siquan-player-musiclist"),
  musicinfobtn:document.getElementById("siquan-player-musicinfo"),
  info:{
    title:document.querySelector(".info-name"),
    album:document.querySelector(".info-album"),
    singer:document.querySelector(".info-singer"),
    tags:document.querySelector(".info-tags"),
    pj:document.querySelector(".info-pj"),
  }
}
var nowplay=-1;
var rs=[];
function play(i){
  rs.forEach(function(r){
    r.abort();
  })
  nowplay=i;
  try{
    document.querySelector(".musiclist ul li.act").classList.remove("act");
  }catch(e){}
  document.querySelectorAll(".musiclist ul li")[i].classList.add("act");
  el.img.src=defimg;
  el.title.innerText=
  el.album.innerText=
  el.info.title.innerText=
  el.info.album.innerText=
  el.info.pj.innerText=
  el.info.singer.innerText=
  el.singer.innerText='...';
  el.info.tags.innerHTML=musiclist[i].tag.map(function(v){return '<span class="s-tag">'+v+'</span>'}).join('');
  el.audio.src='';
  LRC={0:'歌词加载中'};
  xrLRC();
  rs.push(musicapi.get(musiclist[i],function(data){
    if(data.error){
      alert(data.error);
    }else{
      el.img.src=data.img;
      el.title.innerText=el.info.title.innerText=data.songname;
      el.audio.src=data.url;
      el.album.innerText=el.info.album.innerText=data.album;
      el.singer.innerText=el.info.singer.innerText=data.artist;
      LRC=data.lrc;
      xrLRC();
    }
  }))
  rs.push(musicapi._request('./info/'+musiclist[i].mid+'.txt',function(data){
    if(!data){
      el.info.pj.innerText='暂无';
    }else{
      el.info.pj.innerText=data;
    }
  }))
}
function init(){
  var i=location.href.split('#')[1];
  var q={};
  if(i){
    i.split('&');
    i.forEach(function(it){
      var a=it.split('=');
      q[a[0]]=a[1];
    })
  }

  play((!isNaN(parseInt(q.index)))?parseInt(i):Math.floor(Math.random()*musiclist.length));
}
window.onhashchange=function(){
  musiclist.length>0&&init();
}
function xrLRC(){
  el.lrc.innerHTML='';
  for(var k in LRC){
    var li=document.createElement('li');
    li.innerText=LRC[k];
    el.lrc.append(li);
  }
}
el.audio.addEventListener('canplay',function(){
  try{this.play();}catch(e){}
})
el.audio.addEventListener('timeupdate',function(){
  var cur=el.audio.currentTime;
  var max=el.audio.duration;
  var per=cur/max;
  if(___){
    el.range.r2.style.width=per*100+'%'
    el.range.r1.style.left='calc('+per*100+'% - 6px)';
  }
  
  el.time.cur.innerText=formatTime(cur);
  el.time.max.innerText=formatTime(max);
  var i=-1;
  for(var k in LRC){
    if(cur<k){
      break;
    }
    i++;
  }
  try{
    el.lrc.querySelector('li.act').classList.remove('act');
  }catch(e){}
  var h=document.querySelector(".right").getBoundingClientRect().height/2;
  var al=el.lrc.querySelectorAll('li');
  for(var j=0;j<i;j++){
    h-=al[j].getBoundingClientRect().height;
  }
  if(i!=-1){
    h-=al[i].getBoundingClientRect().height/2;
    el.lrc.querySelectorAll('li')[i].classList.add('act');
  }
  el.lrc.style.marginTop=h+'px';
});

el.playbtn.addEventListener('click',function(){
  if(el.container.classList.contains('playing')){
    el.audio.pause();
  }else{
    el.audio.play();
  }
})

el.audio.addEventListener('play',function(){
  el.container.classList.add('playing');
  el.playbtn.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause" viewBox="0 0 16 16">  <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5"/></svg>'
})

el.audio.addEventListener('pause',function(){
  el.container.classList.remove('playing');
  el.playbtn.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>'
});

var ___=true;

el.range.r1.addEventListener('mousedown',function(){
  ___=false;
  var per;
  document.onmousemove=function(e){
    var x=e.pageX;
    var w=el.range.r.getBoundingClientRect().width;
    var l=el.range.r.getBoundingClientRect().left;
    var r=x-l;
    if(r<0){
      r=0;
    }
    if(r>w){
      r=w;
    }
    per=r/w;
    el.range.r2.style.width=per*100+'%'
    el.range.r1.style.left='calc('+per*100+'% - 6px)';
  }
  document.onmouseup=function(){
    document.onmousemove=null;
    document.onmouseup=null;
    ___=true;
    el.audio.currentTime=el.audio.duration*per;
  }
})

el.range.r1.addEventListener('touchstart',function(){
  ___=false;
  var per;
  document.ontouchmove=function(e){
    var x=e.targetTouches[0].pageX;
    var w=el.range.r.getBoundingClientRect().width;
    var l=el.range.r.getBoundingClientRect().left;
    var r=x-l;
    if(r<0){
      r=0;
    }
    if(r>w){
      r=w;
    }
    per=r/w;
    el.range.r2.style.width=per*100+'%'
    el.range.r1.style.left='calc('+per*100+'% - 6px)';
  }
  document.ontouchend=function(){
    document.ontouchmove=null;
    document.ontouchend=null;
    ___=true;
    el.audio.currentTime=el.audio.duration*per;
  }
})

el.range.r.addEventListener('click',function(e){
  if(___){
    var per=(e.pageX-el.range.r.getBoundingClientRect().left)/el.range.r.getBoundingClientRect().width;
    el.audio.currentTime=el.audio.duration*per;
  }
})

function formatTime(time){
  var min=Math.floor(time/60);
  var sec=Math.floor(time%60);
  if(isNaN(min)){
    return '00:00';
  }
  if(min<10){
    min='0'+min;
  }
  if(sec<10){
    sec='0'+sec;
  }
  return min+':'+sec;
}


var qh=0;
var qhicon=['<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-repeat" viewBox="0 0 16 16"><path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"/></svg>',
'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-repeat-1" viewBox="0 0 16 16"><path d="M11 4v1.466a.25.25 0 0 0 .41.192l2.36-1.966a.25.25 0 0 0 0-.384l-2.36-1.966a.25.25 0 0 0-.41.192V3H5a5 5 0 0 0-4.48 7.223.5.5 0 0 0 .896-.446A4 4 0 0 1 5 4zm4.48 1.777a.5.5 0 0 0-.896.446A4 4 0 0 1 11 12H5.001v-1.466a.25.25 0 0 0-.41-.192l-2.36 1.966a.25.25 0 0 0 0 .384l2.36 1.966a.25.25 0 0 0 .41-.192V13h6a5 5 0 0 0 4.48-7.223Z"/><path d="M9 5.5a.5.5 0 0 0-.854-.354l-1.75 1.75a.5.5 0 1 0 .708.708L8 6.707V10.5a.5.5 0 0 0 1 0z"/></svg>',
'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-shuffle" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5"/><path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z"/></svg>'];

el.nextbtn.addEventListener('click',function(){
  if(nowplay==-1) return;
  if(qh==2){
    play(Math.floor(Math.random()*musiclist.length));
  }else{
    if(nowplay==musiclist.length-1){
      play(0);
    }else{
      play(nowplay+1);
    }
  }
})
el.lastbtn.addEventListener('click',function(){
  if(nowplay==-1) return;
  if(qh==2){
    play(Math.floor(Math.random()*musiclist.length));
  }else{
    if(nowplay==0){
      play(musiclist.length-1);
    }else{
      play(nowplay-1);
    }
  }
})

el.audio.addEventListener('ended',function(){
  if(qh==1){
    this.currentTime=0;
    this.play();
  }else{
    el.nextbtn.click();
  }
})


el.sx.addEventListener('click',function(){
  if(qh==2){
    qh=0;
  }else{
    qh++;
  }
  this.innerHTML=qhicon[qh];
});

var mode=1;
var modeicon=['<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-moon-fill" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278"/></svg>',
'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sun-fill" viewBox="0 0 16 16"><path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg>']
var modecl=['dark','light']

el.mode.addEventListener('click',function(){
  document.body.classList.remove(modecl[mode]);
  mode=mode==1?0:1;
  this.innerHTML=modeicon[mode];
  document.body.classList.add(modecl[mode])
})

el.musiclistbtn.addEventListener('click',function(){
  document.querySelector(".dialog.musiclist").classList.add('show');
  document.querySelector(".musiclist li.act").scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  })
})

el.musicinfobtn.addEventListener('click',function(){
  document.querySelector(".dialog.musicinfo").classList.add('show');
})

document.querySelectorAll(".dialog .close").forEach(function(el){
  el.addEventListener('click',function(){
    this.parentElement.parentElement.parentElement.parentElement.classList.remove('show');
  })
})