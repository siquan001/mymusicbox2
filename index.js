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
    if(img.indexOf('y.gtimg.cn')!=-1){
      d();
      return;
    }
    let imgEl = document.createElement('img');
    imgEl.src = img;
    imgEl.crossOrigin = 'Anonymous';
    imgEl.onload = function () {
        try {
            let canvas = document.createElement('canvas'),
                context = canvas.getContext && canvas.getContext('2d'),
                height, width, length, data,
                i = -4,
                blockSize = 50,
                count = 0,
                rgb = { r: 0, g: 0, b: 0 }
            height = canvas.height = imgEl.height
            width = canvas.width = imgEl.width
            context.drawImage(imgEl, 0, 0);
            data = context.getImageData(0, 0, width, height).data
            length = data.length
            while ((i += blockSize * 4) < length) {
                ++count;
                rgb.r += data[i];
                rgb.g += data[i + 1];
                rgb.b += data[i + 2];
            }
            rgb.r = ~~(rgb.r / count);
            rgb.g = ~~(rgb.g / count);
            rgb.b = ~~(rgb.b / count);
            var m=(rgb.r + rgb.g + rgb.b) / 3 > 150;
            function ccl(c){
                return 256-(256-c)/2;
            }
            var m2=(rgb.r/2)+','+(rgb.g/2)+','+(rgb.b/2);
            var m3=ccl(rgb.r)+','+ccl(rgb.g)+','+ccl(rgb.b);
            // if((rgb.r + rgb.g + rgb.b) / 1.5 < 150){
            //     m3='255,255,255';
            // }
            cb('rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',.5)', m,[['rgb('+m2+')','rgba('+m2+',.5)'],['rgb('+m3+')','rgba('+m3+',.5)']]);
        } catch (e) {
            d();
        }
    }
    imgEl.onerror = function () {
        d();
    }
    function d() {
        rs.push(musicapi._request('https://api.qjqq.cn/api/Imgcolor?img=' + img, function (n) {
            if (!n) {
                cb('rgba(0,0,0,0)', -1);
            } else {
                var h = n.RGB.slice(1);
                var r = parseInt(h.substring(0, 2), 16);
                var g = parseInt(h.substring(2, 4), 16);
                var b = parseInt(h.substring(4, 6), 16);
                var rgb={r,g,b};
                var m=(rgb.r + rgb.g + rgb.b) / 3 > 150;
                function ccl(c){
                    return 256-(256-c)/2;
                }
                var m2=(rgb.r/2)+','+(rgb.g/2)+','+(rgb.b/2);
                var m3=ccl(rgb.r)+','+ccl(rgb.g)+','+ccl(rgb.b);
                // if((rgb.r + rgb.g + rgb.b) / 1.5 < 150){
                //     m3='255,255,255';
                // }
                cb('rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',.5)', m,[['rgb('+m2+')','rgba('+m2+',.5)'],['rgb('+m3+')','rgba('+m3+',.5)']]);
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
  // 加载歌单
  function loadMusicList(){
    musicapi._request(MUSICLIST_URL,function(data){
      if(typeof data=='string') data=JSON.parse(data);
      if(data==false){
        alert('歌曲列表获取失败！');
      }else{
        musiclist=data;
        _b();
        var ul=document.querySelector(".musiclist ul");
        for(var i=0,ri=0;ri<musiclist.length;ri++){
          var r=musiclist[ri];
          if(r.tag.indexOf('Legray')!=-1) continue;
          playlist.push(ri);
          var li=document.createElement("li");
          li.innerHTML='<div class="anim"><div></div><div></div><div></div></div><div class="index"></div><div class="name"></div>'
          li.dataset.index=ri;
          li.querySelector(".name").innerHTML=r.artist+' - '+r.name;
          li.querySelector(".index").innerHTML=i;
          li.onclick=function(){
            play(this.dataset.index);
            /* 特效 START */
            try{
              sp.call(this);
            }catch(e){}
            /* 特效 END */
          }
          ul.appendChild(li);
          i++;
        }
        console.log(playlist);
        console.log('a');
        initByUrl();
      }
    });
    var _b=function _b(){}
    if(INFO&&INFO_URL){
      musicapi._request(INFO_URL,function(data){
        infolist=data;
        if(musiclist){
          infoloadedCallback();
        }else{
          _b=infoloadedCallback;
        }
      });
    }
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
    if(INFO_URL){
      if(infolist)
      el.info.pj.innerText=infolist[musiclist[nowplay].mid]||'暂无';
    }else{
      rs.push(musicapi._request(INFO_ROOT+musiclist[i].mid+'.txt',function(data){
        if(!data){
          el.info.pj.innerText='暂无';
        }else{
          el.info.pj.innerText=data;
        }
      }))
    }
    
  }

  function infoloadedCallback(){
    if(nowplay>=0){
      el.info.pj.innerText=infolist[musiclist[nowplay].mid]||'暂无';
    }
  }

  // 获取并设置歌曲信息
  function setSongData(i){
    if(i>=0){
      el.title.innerText=el.info.title.innerText=musiclist[i].name;
      document.title=_title=musiclist[i].name;
      el.singer.innerText=el.info.singer.innerText=musiclist[i].artist;
    }

    // 在i=-1时播放url的音乐信息
    rs.push(musicapi.get(i==-1?lssong:musiclist[i],function(data){
      if(nowplay!=i){
        return;
      }
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
        if(MAINCOLORBG){
          colorfulImg(data.minipic||data.img,function(n,b,tt){
            document.querySelector('.bg').style.background=n;
            if(MAINCOLORPLUS){
              document.getElementById('f').innerHTML='.siquan-player .container .right ul li{color:'+tt[0][1]+'}.siquan-player,.siquan-player .container .right ul li.act{color:'+tt[0][0]+'}'+
              '.siquan-player .container .left .music-controls .range .r1,.siquan-player .container .left .music-controls .range .r2{background-color:'+tt[0][0]+'}.siquan-player .container .left .music-controls .range{background-color:'+tt[0][1]+'}'+
              'body.dark .siquan-player .container .left .music-controls .range .r1,body.dark .siquan-player .container .left .music-controls .range .r2{background-color:'+tt[1][0]+'}body.dark .siquan-player .container .left .music-controls .range{background-color:'+tt[1][1]+'}'+
              'body.dark .siquan-player .container .right ul li{color:'+tt[1][1]+'}body.dark .siquan-player,body.dark .siquan-player .container .right ul li.act{color:'+tt[1][0]+'}';
            }
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
    LRC={0:'正在加载'};
  }

  // active Item
  function actItem(i){
    if(i!=-1){
      try{
        document.querySelector(".musiclist ul li.act").classList.remove("act");
      }catch(e){}
      try{
        document.querySelector(".musiclist ul li[data-index=\""+i+"\"]").classList.add("act"); 
      }catch(e){}


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
      console.log('p');
      play(START_PLAY=='first'?0:playlist[Math.floor(Math.random()*playlist.length)]);
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
      var i = -1;
      for (var k in LRC) {
          if (cur < k) {
              break;
          }
          i++;
      }
      var rli=el.lrc.querySelector('li.act');
      var tli;
      if(i!=-1){
          tli=el.lrc.querySelectorAll('li')[i];
          if(tli.classList.contains('act')){
              return then();
          }else{
              rli&&rli.classList.remove('act');
          }
          tli.classList.add('act');
      }else{
          rli&&rli.classList.remove('act');
          tli=el.lrc.querySelector('li');
      }
      function then(){
          rli=null;
          var tlitop=tli.offsetTop-el.lrc.offsetTop;
          var h=document.querySelector(".right").getBoundingClientRect().height/2-tli.getBoundingClientRect().height/2;      
          el.lrc.style.marginTop=h-tlitop+'px';
          tli=null;
      }
      then();
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
        play(playlist[Math.floor(Math.random()*playlist.length)]);
      }else{
        var a=document.querySelector('.musiclist li.act');
        if(a){
          if(!a.nextElementSibling){
            play(0);
          }else{
            a.nextElementSibling.click();
          }
        }else{
          play(playlist[Math.floor(Math.random()*playlist.length)]);
        }
      }
    })
    el.lastbtn.addEventListener('click',function(){
      if(nowplay==-1) return;
      if(switchMode==2){
        play(playlist[Math.floor(Math.random()*playlist.length)]);
      }else{
        var a=document.querySelector('.musiclist li.act');
        if(a){
          if(!a.previousElementSibling){
            play(playlist[playlist.length-1]);
          }else{
            a.previousElementSibling.click();
          }
        }else{
          play(playlist[Math.floor(Math.random()*playlist.length)]);
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
    mode=modecl.indexOf(DEFAULT_MODE);
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

    el.fullBtn.addEventListener('click',function(){
      if(document.fullscreenElement){
          document.exitFullscreen();
      }else{
          document.documentElement.requestFullscreen();
      }
  })

  document.addEventListener('fullscreenchange',function(){
      if(document.fullscreenElement){
          el.fullBtn.querySelector('.full').style.display='block';
          el.fullBtn.querySelector('.unfull').style.display='none';
      }else{
          el.fullBtn.querySelector('.unfull').style.display='block';
          el.fullBtn.querySelector('.full').style.display='none';
      }
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

  // 初始化所有
  function init(){
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
      fullBtn:document.querySelector(".full"),
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
    if(BLURBG){
      document.querySelector(".mbg").style.display='block';
    }
  }

  var noticeinter=null;
  //标题缓存（用于性能模式）
  var _title="我的音乐盒子";
  var isStopBlurBg=false;
  var LRC={0:'歌词加载中'};
  var defimg='https://image.gumengya.com/i/2023/10/15/652b46cf15392.png';
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
  var playlist=[];
  var infolist=null;
  
  init();

}();
