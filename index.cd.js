var MUSICLIST_URL  = './musiclist.json'; // 歌单文件
var INFO           = true;               // 显示你的评价 (取决于 INFO_ROOT/[mid].txt)
var TAG            = true;               // 显示歌曲标签 (取决于musiclist[i].tag)
var DEFAULT_MODE   = 'light';            // 默认模式 ，可选 light 亮色,dark 暗色
var INFO_ROOT      = './info/'           // 评价文件夹根目录 (结尾要加“/”)
var AUTOPLAY       = true;               // 自动播放
var START_PLAY     = 'random'            // 刚开始的播放策略，可选 random 随机播放，first 第一首播放
var PLAY_MODE      = 'loop';             // 播放模式，可选 loop 单曲循环，random 随机播放，order 顺序播放
var ENABLED_MID    = true;               // 是否启用歌曲mid，这主要应用于歌曲定位和评价显示
var SHOW_MID_IN_URL= true;               // 是否显示歌曲mid在歌曲链接中(这不会导致历史记录堆积)
var PERFORMANCE_MODE=false;               // 性能模式，在页面失焦时取消动画和歌词更新和时间更新(针对一些配置较差的电脑进行后台播放)
var BLURBG         = false;              // 是否显示模糊图片背景(这对配置较差的电脑是个挑战)
var MAINCOLORBG    = true;               // 是否以歌曲封面图片主题色作为背景(BLURBG=true时无效)

/* ↑↑↑ 根配置 ↑↑↑ */

!function(){
  var noticeinter=null;
  function notice(text,fn=function(){}){
    clearTimeout(noticeinter);
    document.querySelector(".notice").innerText=text;
    document.querySelector(".notice").onclick=fn;
    document.querySelector(".notice").style.display='block';
    noticeinter=setTimeout(function(){
      document.querySelector(".notice").style.display='none';
      document.querySelector(".notice").onclick=function(){};
    },2000);
  }
  
// 作者：BrownHu
// 链接：https://juejin.cn/post/6844903678231445512
// 来源：稀土掘金
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
  function colorfulImg(img,cb){
    let imgEl=document.createElement('img');
    imgEl.src=img;
    imgEl.crossOrigin = 'Anonymous';
    imgEl.onload=function(){
      try{
        let canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        height,width,length,data, 
        i = -4,
        blockSize = 50,
        count = 0,
        rgb = {r:0,g:0,b:0}
            
    height = canvas.height = imgEl.height
    width = canvas.width = imgEl.width
    context.drawImage(imgEl, 0, 0);
    data = context.getImageData(0, 0, width, height).data
    length = data.length
    while ( (i += blockSize * 4) < length ) {
    ++count;
    rgb.r += data[i];
    rgb.g += data[i+1];
    rgb.b += data[i+2];
    }
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);
    cb('rgba('+rgb.r+','+rgb.g+','+rgb.b+',.5)',(rgb.r+rgb.g+rgb.b)/3>128);
      }catch(e){
        d();
      }
      
    }
    imgEl.onerror=function(){
      d();
    }
    function d(){
      rs.push(musicapi._request('https://api.qjqq.cn/api/Imgcolor?img='+img,function(n){
          if(!n){
            cb('rgba(0,0,0,0)',-1);
          }else{
            var h=n.RGB.slice(1);
            var r=parseInt(h.substring(0,2),16);
            var g=parseInt(h.substring(2,4),16);
            var b=parseInt(h.substring(4,6),16);
            cb('rgba('+r+','+g+','+b+',.5)',(r+g+b)/3>128);
          }
        }));
    }
    
}

  var _title="我的音乐盒子";
  var musiclist=[];
  if(BLURBG&&localStorage.chaxinneng!='yes'){
    document.querySelector(".mbg").style.display='block';
    if(!localStorage.chaxinneng)cxinneng();
  }
  
  var xinnenginter;
  var zhenshu=0;
  var __xnjctz=false;
  var lowzhenshu=0;
  
  function cxinneng(){
    function xnjc(){
      requestAnimationFrame(function(){
        zhenshu++;
        (!__xnjctz)&&xnjc();
      })
    }
    setTimeout(function(){
      xnjc();
      checkxinnengInterval();
    },2000)
  }
  
  function checkxinnengInterval(){
    xinnenginter=setInterval(function(){
        if(zhenshu<=16){
          lowzhenshu++;
          if(lowzhenshu>5){
            if(confirm('你的电脑性能较差，是否取消模糊背景功能？')){
              localStorage.chaxinneng='yes';
              document.querySelector(".mbg").style.display='none';
            }else{
              localStorage.chaxinneng='no';
            }
            __xnjctz=true;
            clearInterval(xinnenginter);
          }
        }
        zhenshu=0;
      },1000)
  }
  musicapi._request(MUSICLIST_URL,function(data){
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
          /* 特效 START */
          try{
            if(this.innerText.indexOf(" - DESTRUCTION 3,2,1")!=-1){
              var a=true;
              document.body.style.transition='none';
              document.body.style.cursor='none';
              setInterval(function(){
                a=!a;
                if(a){
                  document.querySelector('.siquan-player').style.transform='translateY(-10px)';
                }else{
                  document.querySelector('.siquan-player').style.transform='translateY(10px)';
                }
                el.mode.click();
              },50);
              var b=true;

              setInterval(function(){
                document.body.style.opacity=Math.random();
                b=!b;
                if(b){
                  document.querySelector('.siquan-player').style.transform='translateX(-10px)';
                }else{
                  document.querySelector('.siquan-player').style.transform='translateX(10px)';
                }
                el.mode.click();
              },70);
            }
          }catch(e){}
          /* 特效 END */
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
      tags:document.querySelector(".info-tags .in"),
      pj:document.querySelector(".info-pj .in"),
      tags_f:document.querySelector(".info-tags"),
      pj_f:document.querySelector(".info-pj"),
    }
  }
  el.img.onerror=function(){
    this.src=defimg;
  }
  function r(){
    var resizer = document.querySelector("#resizer");
    var w = window.innerWidth;
    var h = window.innerHeight;
    if (w < 700) {
      resizer.innerHTML = '';
      return;
    }
    var styles = `
    .siquan-player .container .left .music-album-pic{
      width:${Math.min(w * 0.287,h*0.5)}px;
      height:${Math.min(w * 0.287,h*0.5)}px;
    }
    .siquan-player .container .left .music-info .music-title{
      font-size:${w * 0.02}px;
    }
    .iconbtn{
      width:${h * 0.06}px;
      height:${h * 0.06}px;
    }
    .siquan-player .container .left .music-info .music-message{
      font-size:${w * 0.012}px;
    }
    .siquan-player .container .left .music-controls .range{
      height:${h * 0.0045}px;
    }
    .siquan-player .container .left .music-controls .range .r1{
      width:${h * 0.0105}px;
      height:${h * 0.0105}px;
      top:-${h * 0.003}px;
    }
    .siquan-player .container .left .music-controls .time{
      font-size:${w * 0.012}px;
    }
    .siquan-player .container .left .music-controls .pl{
      width:${h * 0.06 * 3.75 + 60}px;
      height:${h * 0.06 * 1.25}px;
    }
    .siquan-player .container .left .music-controls .pl .iconbtn{
      width:${h * 0.06 * 1.25}px;
      height:${h * 0.06 * 1.25}px;
    }
    .siquan-player .container .right ul li{
      font-size:${w * 0.019}px;
      line-height:${w * 0.038}px;
    }
    .siquan-player .container .right ul li.act{
      font-size:${w * 0.034}px;
    }
    .dialog .actionbar{
      height:${h * 0.06}px;
    }
    .dialog .actionbar .title{
      font-size:${h * 0.025}px;
      line-height:${h * 0.06}px;
    }
    .musiclist.dialog .scroll-con ul li{
      font-size:${h * 0.02}px;
      height:${h * 0.045}px;
      line-height:${h * 0.045}px;
    }
    .dialog .scroll-con{
      height:calc(100% - ${h * 0.06 + 1}px);
    }
    .musiclist.dialog .scroll-con  ul li>*{
      height:${h * 0.045}px;
    }
    .musiclist.dialog .scroll-con  ul li .index,
    .musiclist.dialog .scroll-con  ul li .anim
    {
      width: ${h * 0.06}px;
    }
    .musiclist.dialog .scroll-con  ul li .name{
      width: calc(100% - ${h * 0.06}px);
    }
    .musiclist.dialog .scroll-con  ul li .anim div{
      height:${h * 0.015}px;
      width:${h * 0.045 * 0.05}px;
    }
    .musiclist.dialog .scroll-con  ul li .anim div:nth-child(1){
      left:${h * 0.06 * 0.375}px;
    }
    .musiclist.dialog .scroll-con  ul li .anim div:nth-child(2){
      left:${h * 0.06 * 0.525}px;
    }
    .musiclist.dialog .scroll-con  ul li .anim div:nth-child(3){
      left:${h * 0.06 * 0.675}px;
    }
    .musicinfo.dialog .d-c{
      font-size:${h * 0.024}px;
    }
    .s-tag{
      font-size:${h * 0.024 * 0.75}px;
    }`;
    resizer.innerHTML = styles;
  }
  window.onresize=r;
  r();
  if(!TAG){
    el.info.tags_f.style.display='none';
  }
  if(!INFO){
    el.info.pj_f.style.display='none';
  }
  var nowplay=-1;
  var rs=[];
  function play(i){
    rs.forEach(function(r){
      r.abort();
    })
    nowplay=i;
    if(i!=-1){
      try{
        document.querySelector(".musiclist ul li.act").classList.remove("act");
      }catch(e){}
      document.querySelectorAll(".musiclist ul li")[i].classList.add("act"); 
      if(SHOW_MID_IN_URL&&ENABLED_MID){
        window._p_hash_=true;
        history.replaceState({},'',window.location.pathname+'#mid='+musiclist[i].mid);   
      }
    }
    el.img.src=defimg;
    el.title.innerText=
    el.album.innerText=
    el.info.title.innerText=
    el.info.album.innerText=
    el.info.pj.innerText=
    el.info.singer.innerText=
    el.singer.innerText='...';
    el.audio.src='';
    LRC={0:'歌词加载中'};
    xrLRC();
    rs.push(musicapi.get(i==-1?lssong:musiclist[i],function(data){
      if(data.error){
        notice('歌曲获取失败',function(){
          alert(data.error);
        });
        el.nextbtn.click();
      }else{
        el.img.src=data.img;
        document.querySelector(".mbg img").src=data.img;
        el.title.innerText=el.info.title.innerText=data.songname;
        document.title=data.songname;
        _title=data.songname;
        el.audio.src=data.url;
        el.album.innerText=el.info.album.innerText=data.album;
        el.singer.innerText=el.info.singer.innerText=data.artist;
        LRC=data.lrc;
        xrLRC();
        if(MAINCOLORBG&&!BLURBG){
          colorfulImg(data.minipic||data.img,function(n,b){
            document.querySelector('.siquan-player').style.background=n;
            if(b!=-1){
              if((b&&mode==0)||(!b&&mode==1)){
                el.mode.click()
              }
            }
          });
        }
      }
    }))
    if(i==-1||!INFO||!ENABLED_MID) return;
    if(TAG)el.info.tags.innerHTML=musiclist[i].tag.map(function(v){return '<span class="s-tag">'+v+'</span>'}).join('');
    rs.push(musicapi._request(INFO_ROOT+musiclist[i].mid+'.txt',function(data){
      if(!data){
        el.info.pj.innerText='暂无';
      }else{
        el.info.pj.innerText=data;
      }
    }))
  }
  var lssong=null;
  function init(){
    var i=location.href.split('#')[1];
    var q={};
    if(i){
      i=i.split('&');
      i.forEach(function(it){
        var a=it.split('=');
        q[a[0]]=a[1];
      })
    }
    if(!isNaN(parseInt(q.index))){
      play(parseInt(q.index));
    }else if(q.type=='kugou'&&q.hash){
      lssong={
        kugou:{
          hash:q.hash,
          album_id:q.album_id||"",
        }
      }
      play(-1);
    }else if(q.type=='netease'&&q.id){
      lssong={
        netease:{
          id:q.id,
        }
      }
      play(-1);
    }else if(q.type=='qq'&&q.mid){
      lssong={
        qq:{
          mid:q.mid,
        }
      }
      play(-1);
    }else if(q.mid&&ENABLED_MID){
      musiclist.forEach(function(v,i){
        if(v.mid==q.mid){
          play(i);
        }
      })
    }else{
      play(START_PLAY=='first'?0:Math.floor(Math.random()*musiclist.length));
    }
  
  }
  window.onhashchange=function(){
    if(!window._p_hash_){
      musiclist.length>0&&init();
    }else{
      window._p_hash_=false;
    }
  }
  function xrLRC(){
    el.lrc.innerHTML='';
    for(var k in LRC){
      var li=document.createElement('li');
      li.innerText=LRC[k];
      el.lrc.append(li);
    }
  }
  var __=false;
  function ckqq(){
    if(!document.querySelector(".musicbox-author")||document.querySelector(".musicbox-author").innerText.trim()!='陈思全'){
      alert('该音乐盒子侵权！');
      document.write('<h1>你是否删除了.music-anthor？我劝你耗子尾汁！<h1>')
    }else{
      setTimeout(ckqq,10000);
    }
  }
  document.addEventListener('DOMContentLoaded',function(){
    ckqq();
  })
  el.audio.addEventListener('canplay',function(){
    if(!__&&AUTOPLAY){
      __=true;
      return;
    }
    try{this.play();}catch(e){}
  });
  var __h=false;
  el.audio.addEventListener('timeupdate',function(){
    if(__h) return;
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
    function move(e){
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
    function end(){
      document.removeEventListener('touchmove',move);
      document.removeEventListener('touchend',end);
      ___=true;
      el.audio.currentTime=el.audio.duration*per;
    }
    document.addEventListener('touchmove',move,{passive:false});
    document.addEventListener('touchend',end,{passive:false});
  },{
    passive:false // 阻止默认事件
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
  
  
  var qh=['order','loop','random'].indexOf(PLAY_MODE);
  var qhicon=['<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-repeat" viewBox="0 0 16 16"><path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"/></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-repeat-1" viewBox="0 0 16 16"><path d="M11 4v1.466a.25.25 0 0 0 .41.192l2.36-1.966a.25.25 0 0 0 0-.384l-2.36-1.966a.25.25 0 0 0-.41.192V3H5a5 5 0 0 0-4.48 7.223.5.5 0 0 0 .896-.446A4 4 0 0 1 5 4zm4.48 1.777a.5.5 0 0 0-.896.446A4 4 0 0 1 11 12H5.001v-1.466a.25.25 0 0 0-.41-.192l-2.36 1.966a.25.25 0 0 0 0 .384l2.36 1.966a.25.25 0 0 0 .41-.192V13h6a5 5 0 0 0 4.48-7.223Z"/><path d="M9 5.5a.5.5 0 0 0-.854-.354l-1.75 1.75a.5.5 0 1 0 .708.708L8 6.707V10.5a.5.5 0 0 0 1 0z"/></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-shuffle" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5"/><path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z"/></svg>'];
  el.sx.innerHTML=qhicon[qh];
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
  
  var modeicon=['<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-moon-fill" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278"/></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sun-fill" viewBox="0 0 16 16"><path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg>']
  var modecl=['dark','light']
  var mode=modecl.indexOf(DEFAULT_MODE);
  document.body.classList.add(DEFAULT_MODE);
  el.mode.innerHTML=modeicon[mode];
  
  el.mode.addEventListener('click',function(){
    document.body.classList.remove(modecl[mode]);
    mode=mode==1?0:1;
    this.innerHTML=modeicon[mode];
    document.body.classList.add(modecl[mode])
  })
  
  el.musiclistbtn.addEventListener('click',function(){
    document.querySelector(".dialog.musiclist").classList.add('show');
    var actli=document.querySelector(".musiclist li.act")
    actli&&actli.scrollIntoView({
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

  // hotkey
  document.addEventListener('keydown',function(e){
    if(e.key==" "){
      el.playbtn.click();
    }else if(e.key=="ArrowLeft"){
      el.lastbtn.click();
    }else if(e.key=="ArrowRight"){
      el.nextbtn.click();
    }
  });

  if(PERFORMANCE_MODE){
    document.addEventListener('visibilitychange', function() { 
      var isHidden = document.hidden; 
      if (isHidden) { 
        document.body.style.display='none';
      } else { 
        document.body.style.display='';
      } 
    });
    window.onfocus=function(){
      if(BLURBG&&!__xnjctz){
        clearInterval(xinnenginter);
        checkxinnengInterval();
      }
      document.title=_title;
      el.img.style.animationPlayState=""
      document.querySelector(".playing-anim").style.display=""
      __h=false;
    }
    window.onblur=function(){
      if(BLURBG&&!__xnjctz){
        clearInterval(xinnenginter);
      }
      document.title="[性能模式冻结中]"+_title;
      el.img.style.animationPlayState="paused"
      document.querySelector(".playing-anim").style.display="none";
      __h=true;
    }
  }

}();
