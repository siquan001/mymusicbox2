!function(){
  /**
   * @param {string} text 提示文字
   */
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
  
  
  /**
   * @param {string} url 图片链接
   * @param {function} cb 回调函数，参数为颜色字符串和是否为亮色
   * @description 获取图片主题色
   * @author BrownHu
   * @link https://juejin.cn/post/6844903678231445512
   * @from 稀土掘金
   * @note 对于一些地方做了修改和适配，对无法获取的图片使用https://api.qjqq.cn/api/Imgcolor siquan001
   */
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

  // 格式化时间
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

  function performanse_test(){
    var xinnenginter;
    var zhenshu=0;
    var lowzhenshu=0;
    
    function cxinneng(){
      function xnjc(){
        requestAnimationFrame(function(){
          zhenshu++;
          (!isStopBlurBg)&&xnjc();
        })
      }
      setTimeout(function(){
        xnjc();
        checkxinnengInterval();
      },2000)
    }
    cxinneng();
    function checkxinnengInterval(){
      xinnenginter=setInterval(function(){
          if(zhenshu<=16){
            lowzhenshu++;
            if(lowzhenshu>5){
              if(confirm('你的电脑性能较差，是否取消模糊背景功能？')){
                clearTimeout(bx);
                localStorage.chaxinneng='yes';
                document.querySelector(".mbg").style.display='none';
              }else{
                localStorage.chaxinneng='no';
              }
              isStopBlurBg=true;
              clearInterval(xinnenginter);
            }
          }
          zhenshu=0;
        },1000)
    }
    var bx=setTimeout(function(){
      clearInterval(xinnenginter);
      localStorage.chaxinneng='no';
    },6e5);
  }

  // 加载歌单
  function loadMusicList(){
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
              sp.call(this);
            }catch(e){}
            /* 特效 END */
          }
          ul.appendChild(li);
        });
        initByUrl();
      }
    })
  }
  
  // 特效
  function sp(){
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
  }

  // 页面resize样式
  function resize(){
    var resizer = document.querySelector("#resizer");
    var w = window.innerWidth;
    var h = window.innerHeight;
    if (w < 700) {
      resizer.innerHTML = '';
      return;
    }
    var styles = `.siquan-player .container .left .music-album-pic{
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
  // 根据索引播放音乐
  function play(i){
    rs.forEach(function(r){
      r.abort();
    })
    nowplay=i;
    redef();
    actItem(i);
    xrLRC();
    setSongData(i);
    setTagAndInfo(i);
    
  }

  // 设置歌曲标签和评价
  function setTagAndInfo(i){
    // TAG
    if(TAG)el.info.tags.innerHTML=musiclist[i].tag.map(function(v){return '<span class="s-tag">'+v+'</span>'}).join('');
    
    // 评价
    if(i==-1||!INFO||!ENABLED_MID) return;
    rs.push(musicapi._request(INFO_ROOT+musiclist[i].mid+'.txt',function(data){
      if(!data){
        el.info.pj.innerText='暂无';
      }else{
        el.info.pj.innerText=data;
      }
    }))
  }

  // 获取并设置歌曲信息
  function setSongData(i){
    // 在i=-1时播放url的音乐信息
    rs.push(musicapi.get(i==-1?lssong:musiclist[i],function(data){
      if(data.error){
        notice('歌曲获取失败',function(){
          alert(data.error);
        });
        //歌曲获取失败切下一首
        el.nextbtn.click();
      }else{
        el.img.src=data.img;
        document.querySelector(".mbg img").src=data.img;
        el.title.innerText=el.info.title.innerText=data.songname;
        document.title=_title=data.songname;
        el.audio.src=data.url;
        el.album.innerText=el.info.album.innerText=data.album;
        el.singer.innerText=el.info.singer.innerText=data.artist;
        LRC=data.lrc;
        xrLRC();

        // 设置主题色
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
  }

  // 恢复空内容
  function redef(){
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
  }

  // active Item
  function actItem(i){
    if(i!=-1){
      try{
        document.querySelector(".musiclist ul li.act").classList.remove("act");
      }catch(e){}
      document.querySelectorAll(".musiclist ul li")[i].classList.add("act"); 

      if(SHOW_MID_IN_URL&&ENABLED_MID){
        // 不追踪此次hash变化
        window._p_hash_=true;
        // 修改hash
        history.replaceState({},'',window.location.pathname+'#mid='+musiclist[i].mid);   
      }
    }
  }

  // 根据URL初始化
  function initByUrl(){
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

  // hashchange监听
  window.onhashchange=function(){
    if(!window._p_hash_){
      musiclist.length>0&&initByUrl();
    }else{
      window._p_hash_=false;
    }
  }

  // 重置歌词
  function xrLRC(){
    el.lrc.innerHTML='';
    for(var k in LRC){
      var li=document.createElement('li');
      li.innerText=LRC[k];
      el.lrc.append(li);
    }
  }

  // license检查
  function licenseCheck(){
    function ckqq(){
      if(!document.querySelector(".musicbox-author")||document.querySelector(".musicbox-author").innerText.trim()!='陈思全'){
        alert('该音乐盒子侵权！');
        document.write('<h1>你是否删除了.music-anthor？我劝你耗子尾汁！<h1>')
      }else{
        setTimeout(ckqq,10000);
      }
    }
    setTimeout(function(){
      ckqq();
    },1000)
  }
  
  // audio事件初始化
  function initAudioEvents(){
    if(AUTOPLAY){
      el.audio.addEventListener('canplay',function(){
        try{this.play();}catch(e){}
      });
    }
  
    el.audio.addEventListener('timeupdate',function(){
      if(activing) return;
      var cur=el.audio.currentTime;
      var max=el.audio.duration;
      var per=cur/max;
      if(rangeDragging){
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
    
    el.audio.addEventListener('play',function(){
      el.container.classList.add('playing');
      el.playbtn.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause" viewBox="0 0 16 16">  <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5"/></svg>'
    })
    
    el.audio.addEventListener('pause',function(){
      el.container.classList.remove('playing');
      el.playbtn.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>'
    });
    el.audio.addEventListener('ended',function(){
      if(switchMode==1){
        this.currentTime=0;
        this.play();
      }else{
        el.nextbtn.click();
      }
    })
  }

  // 音乐播放器元素事件（除拖动条）
  function initPlayerEvents(){
    el.img.onerror=function(){
      this.src=defimg;
    }

    el.playbtn.addEventListener('click',function(){
      if(el.container.classList.contains('playing')){
        el.audio.pause();
      }else{
        el.audio.play();
      }
    })

    switchMode=['order','loop','random'].indexOf(PLAY_MODE);
    var qhicon=['<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-repeat" viewBox="0 0 16 16"><path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-repeat-1" viewBox="0 0 16 16"><path d="M11 4v1.466a.25.25 0 0 0 .41.192l2.36-1.966a.25.25 0 0 0 0-.384l-2.36-1.966a.25.25 0 0 0-.41.192V3H5a5 5 0 0 0-4.48 7.223.5.5 0 0 0 .896-.446A4 4 0 0 1 5 4zm4.48 1.777a.5.5 0 0 0-.896.446A4 4 0 0 1 11 12H5.001v-1.466a.25.25 0 0 0-.41-.192l-2.36 1.966a.25.25 0 0 0 0 .384l2.36 1.966a.25.25 0 0 0 .41-.192V13h6a5 5 0 0 0 4.48-7.223Z"/><path d="M9 5.5a.5.5 0 0 0-.854-.354l-1.75 1.75a.5.5 0 1 0 .708.708L8 6.707V10.5a.5.5 0 0 0 1 0z"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-shuffle" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5"/><path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z"/></svg>'];
    el.switchBtn.innerHTML=qhicon[switchMode];
    el.nextbtn.addEventListener('click',function(){
      if(nowplay==-1) return;
      if(switchMode==2){
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
      if(switchMode==2){
        play(Math.floor(Math.random()*musiclist.length));
      }else{
        if(nowplay==0){
          play(musiclist.length-1);
        }else{
          play(nowplay-1);
        }
      }
    })

    el.switchBtn.addEventListener('click',function(){
      if(switchMode==2){
        switchMode=0;
      }else{
        switchMode++;
      }
      this.innerHTML=qhicon[switchMode];
    });
  }

  // 音乐播放器拖动条事件
  function initProgressEvents(){
    el.range.r1.addEventListener('mousedown',function(){
      rangeDragging=false;
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
        rangeDragging=true;
        el.audio.currentTime=el.audio.duration*per;
      }
    })
    
    el.range.r1.addEventListener('touchstart',function(){
      rangeDragging=false;
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
        rangeDragging=true;
        el.audio.currentTime=el.audio.duration*per;
      }
      document.addEventListener('touchmove',move,{passive:false});
      document.addEventListener('touchend',end,{passive:false});
    },{
      passive:false // 阻止默认事件
    })
    
    el.range.r.addEventListener('click',function(e){
      if(rangeDragging){
        var per=(e.pageX-el.range.r.getBoundingClientRect().left)/el.range.r.getBoundingClientRect().width;
        el.audio.currentTime=el.audio.duration*per;
      }
    })
  }

  // 四个角的按钮事件
  function initBtnsEvents(){
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
  }

  // 对话框事件
  function initDialog(){
    // dialog close
    document.querySelectorAll(".dialog .close").forEach(function(el){
      el.addEventListener('click',function(){
        this.parentElement.parentElement.parentElement.parentElement.classList.remove('show');
      })
    })
  }

  // 热键
  function initHotKey(){
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
  }

  // 性能模式
  function initPerformanceMode(){
    document.addEventListener('visibilitychange', function() { 
      var isHidden = document.hidden; 
      if (isHidden) { 
        document.body.style.display='none';
      } else { 
        document.body.style.display='';
      } 
    });
    window.onfocus=function(){
      if(BLURBG&&!isStopBlurBg){
        clearInterval(xinnenginter);
        checkxinnengInterval();
      }
      document.title=_title;
      el.img.style.animationPlayState=""
      document.querySelector(".playing-anim").style.display=""
      activing=false;
    }
    window.onblur=function(){
      if(BLURBG&&!isStopBlurBg){
        clearInterval(xinnenginter);
      }
      document.title="[性能模式冻结中]"+_title;
      el.img.style.animationPlayState="paused"
      document.querySelector(".playing-anim").style.display="none";
      activing=true;
    }
  }

  function initPage(){
    document.body.innerHTML='<div class="notice"></div><div class="mbg"><img src="" alt=""><div class="mcover"></div></div><div class="siquan-player"><audio src="" id="audio"></audio><div class="container"><div class="topper"><div class="topper-left"><div class="iconbtn" id="siquan-player-musiclist"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-music-note-list" viewBox="0 0 16 16"><path d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2 2.5.895 2.5 2"/><path fill-rule="evenodd" d="M12 3v10h-1V3z"/><path d="M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1z"/><path fill-rule="evenodd" d="M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5m0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5m0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5"/></svg></div></div><div class="topper-right"><div class="iconbtn" id="siquan-player-musicinfo"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg></div></div></div><div class="left"><div class="music-album-pic"><div class="playing-anim"><div></div><div></div><div></div></div><img id="img" src="https://image.gumengya.cn/i/2023/10/15/652b46cf15392.png" alt=""></div><div class="music-info"><div class="music-title" id="music-title">...</div><div class="music-message"><div>歌手：<span id="music-singer">...</span></div><div>专辑：<span id="music-album">...</span></div></div><div class="music-singer-m" id="music-singer-m"></div></div><div class="music-controls"><div class="range"><div class="r1"></div><div class="r2"></div><div class="r3"></div></div><div class="time"><div class="l">00:00</div><div class="r">00:00</div></div><div class="pl"><div class="iconbtn lastbtn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-skip-start-fill" viewBox="0 0 16 16"><path d="M4 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.54-.313 1.232.066 1.232.696v7.384c0 .63-.692 1.01-1.232.697L5 8.753V12a.5.5 0 0 1-1 0z"/></svg></div><div class="iconbtn playbtn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg></div><div class="iconbtn nextbtn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-skip-end-fill" viewBox="0 0 16 16"><path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.693 3.3 4 3.678 4 4.308v7.384c0 .63.692 1.01 1.233.697L11.5 8.753V12a.5.5 0 0 0 1 0z"/></svg></div></div></div></div><div class="right"><ul></ul></div><div class="flbtn"><div class="iconbtn mode"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sun-fill" viewBox="0 0 16 16"><path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg></div><div class="iconbtn sx"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-repeat" viewBox="0 0 16 16"><path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"/></svg></div></div></div></div><div class="dialog musiclist"><div class="d-c"><div class="actionbar"><div class="left"></div><div class="title">播放列表</div><div class="right"><div class="iconbtn close"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg></div></div></div><div class="scroll-con"><ul></ul></div></div></div><div class="dialog musicinfo"><div class="d-c"><div class="actionbar"><div class="title">歌曲信息</div><div class="right"><div class="iconbtn close"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg></div></div></div><div class="scroll-con"><div class="a" style="padding: 10px;line-height:1.5em;"><b>歌曲名</b>：<span class="info-name"></span><br><b>歌手</b>：<span class="info-singer"></span><br><b>专辑</b>：<span class="info-album"></span><br><div class="info-tags"><b>标签</b>：<span class="in"></span><br></div><div class="info-pj"><b>我的评价</b>：<div class="in" style="text-indent: 2em;"></div></div><b>音乐盒子制作者：</b>:<span class="musicbox-author"><a href="https://siquan001.github.io/" target="_blank">陈思全</a></span></div></div></div></div>';
  }

  // 初始化所有
  function init(){
    initPage();
    el={
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
      switchBtn:document.querySelector(".sx"),
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
    loadMusicList();
    window.onresize=resize;
    resize();
    licenseCheck();
    initAudioEvents();
    initPlayerEvents();
    initProgressEvents();
    initBtnsEvents();
    initDialog();
    initHotKey();
    if(PERFORMANCE_MODE)initPerformanceMode();
    if(!TAG){
      el.info.tags_f.style.display='none';
    }
    if(!INFO){
      el.info.pj_f.style.display='none';
    }
    // 在开启模糊背景功能时检测电脑性能
    if(BLURBG&&localStorage.chaxinneng!='yes'){
      document.querySelector(".mbg").style.display='block';
      if(!localStorage.chaxinneng)performanse_test();
    }
  }

  var noticeinter=null;
  //标题缓存（用于性能模式）
  var _title="我的音乐盒子";
  var isStopBlurBg=false;
  var LRC={0:'歌词加载中'};
  var defimg='https://image.gumengya.cn/i/2023/10/15/652b46cf15392.png';
  // 页面主题
  var mode;
  // 临时歌曲
  var lssong=null;
  var el;
  // 切换模式
  var switchMode;
  // 页面是否处于焦点
  var activing=false;
  var rangeDragging=true;
  // 当前播放索引
  var nowplay=-1;
  // 歌单
  var musiclist=[];
  // abort list
  var rs=[];
  
  init();

}();
