var musicapi = {
  get: function (details, callback) {
    var r,k=0,errs={qq:{error:null},kugou:{error:null},netease:{error:null}},kgvip;
    function g(){
      if (details.qq && details.qq.mid && k<1) {
        r = musicapi._qq(details.qq.mid, function (res) {
          if (res.error) {
            errs.qq=res;
            k++;
            g();
            return;
          }
          callback(musicapi._compareDef(res, details.def));
        });
      } else if (details.kugou && details.kugou.hash && k<2) {
        r = musicapi._kugou(details.kugou.hash, details.kugou.album_id, function (res) {
          if (res.error||!res.url) {
            errs.kugou=res;
            k++;
            g();
            return;
          }
          if(res.ispriviage){
            kgvip=res;
            k++;
            g();
            return;
          }
          callback(musicapi._compareDef(res, details.def));
        });
      } else if (details.netease && details.netease.id && k<3) {
        r = musicapi._netease(details.netease.id, function (res) {
          if (res.error) {
            errs.netease=res;
            k++;
            g();
            return;
          }
          callback(musicapi._compareDef(res, details.def));
        });
      } else {
        if(k==0){
          callback({
            error: "no source",
            error_code: -100
          })
        }else if(kgvip){
          callback(kgvip);
        }else{
          console.log(errs);
          callback({
            error:"QQ:"+errs.qq.error+"\nKugou:"+errs.kugou.error+"\nNetease:"+errs.netease.error,
            errs:errs
          })
        }
        
      }
    }
    g()
    return r;
  },
  search: function (keyword, cb, details) {

  },
  _kugou: function (hash, album_id, cb) {
    var url = "https://wwwapi.kugou.com/yy/index.php?r=play/getdata&hash=" + hash.toUpperCase() +
      "&dfid=2mScsJ16ucV81qLdzD238ELf&appid=1014&mid=1b211caf58cd1e1fdfea5a4657cc21f5&platid=4" +
      (album_id ? ("&album_id=" + album_id) : "") +
      "&_=" + Date.now();
    var a = musicapi._jsonp(url, function (res) {
      if (res.err_code == 0) {
        cb({
          title: res.data.audio_name,
          songname: res.data.song_name,
          artist: res.data.author_name,
          lrc: musicapi.parseLrc(res.data.lyrics),
          url: res.data.play_url,
          album: res.data.album_name,
          img: res.data.img,
          lrcstr: res.data.lyrics,
          ispriviage: res.data.privilege >= 10,
        });
      } else {
        cb({
          error: '获取歌曲失败',
          code: res.err_code
        })
      }
    });
    return a;
  },
  _qq: function (mid, cb) {
    var c = 0, d = {},b;
    var a = musicapi._request('https://api.gumengya.com/Api/Tencent?format=json&id=' + mid, function (res) {
      if (res == false || !res.data) {
        a = musicapi._request('https://api.vkeys.cn/API/QQ_Music?q=8&mid=' + mid, function (r) {
          if (r == false || r.code != 200) {
            cb({
              error: '获取歌曲失败',
              code: 10000
            })
            b.abort();
          } else {
            var e = {
              title: r.data.singer + ' - ' + r.data.song,
              songname: r.data.song,
              artist: r.data.singer,
              url: r.data.url,
              album: r.data.album,
              img: r.data.cover,
            };
            for (var k in e) {
              d[k] = e[k];
            }
            c++;
            if (c == 2) {
              cb(d);
            }
          }
        })
        b = musicapi._request('https://api.vkeys.cn/API/QQ_Music/Lyric?mid=' + mid, function (r) {
          if (r == false || r.code != 200) {
            d.lrc = { 0: "歌词获取失败" }
            d.lrcstr = '[00:00.00] 歌词获取失败'
          } else {
            d.lrc = musicapi.parseLrc(r.data);
            d.lrcstr = r.data;
          }
          c++;
          if (c == 2) {
            cb(d);
          }
        })
        
      } else {
        cb({
          title: res.data.author + ' - ' + res.data.title,
          songname: res.data.title,
          artist: res.data.author,
          lrc: musicapi.parseLrc(res.data.lrc),
          url: res.data.url,
          album: '',
          img: res.data.pic,
          lrcstr: res.data.lrc,
        });
      }
    })
    return {
      abort: function () {
        a.abort();
        b&&b.abort();
      }
    };
  },
  _netease: function (id, cb) {
    var c = 0, d = {},b;
    var a = musicapi._request('https://api.gumengya.com/Api/Netease?format=json&id=' + id, function (res) {
      if (res == false || !res.data) {
        a = musicapi._request('https://api.vkeys.cn/API/Netease_Cloud?q=4&id=' + id, function (r) {
          if (r == false || r.code != 200) {
            cb({
              error: '获取歌曲失败',
              code: 10000
            })
            b.abort();
          } else {
            var e = {
              title: r.data.singer + ' - ' + r.data.song,
              songname: r.data.song,
              artist: r.data.singer,
              url: r.data.url,
              album: r.data.album,
              img: r.data.cover,
            };
            for (var k in e) {
              d[k] = e[k];
            }
            c++;
            if (c == 2) {
              cb(d);
            }
          }
        })
        b = musicapi._request('https://api.vkeys.cn/API/Netease_Cloud/Lyric?id=' + id, function (r) {
          if (r == false || r.code != 200) {
            d.lrc = { 0: "歌词获取失败" }
            d.lrcstr = '[00:00.00] 歌词获取失败'
          } else {
            d.lrc = musicapi.parseLrc(r.data);
            d.lrcstr = r.data;
          }
          c++;
          if (c == 2) {
            cb(d);
          }
        })
        
      } else {
        cb({
          title: res.data.author + ' - ' + res.data.title,
          songname: res.data.title,
          artist: res.data.author,
          lrc: musicapi.parseLrc(res.data.lrc),
          url: res.data.url,
          album: '',
          img: res.data.pic,
          lrcstr: res.data.lrc,
        });
      }
    })
    return {
      abort: function () {
        a.abort();
        b&&b.abort();
      }
    };
  },
  _request: function (url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        try {
          cb(JSON.parse(xhr.responseText));
        } catch (e) {
          cb(xhr.responseText)
        }
      }
      if (xhr.status > 400) {
        cb(false);
      }
    };
    xhr.onerror = function () {
      cb(false);
    }
    try {
      xhr.send();
    } catch (e) { }
    return {
      abort: function () {
        xhr.abort();
      }
    }
  },
  _jsonp: function (url, cb, cbname) {
    var script = document.createElement('script');
    var fnname = 'jsonp_' + Math.random().toString().replace('.', '');
    var urlm = url + (url.indexOf('?') >= 0 ? '&' : '?') + (cbname || 'callback') + '=' + fnname;
    script.src = urlm;
    window[fnname] = function () {
      delete window[fnname];
      cb.apply(null, arguments);
    }
    document.body.appendChild(script);
    script.onload = function () {
      document.body.removeChild(script);
    }
    return {
      abort: function () {
        try {
          script.remove();
          script = null;
        } catch (e) {/* script 因为document.body.innerHTML改变或已被删除 */ }
      }
    }
  },
  _kugou_search: function (keyword, cb, details) {

  },
  _qq_search: function (keyword, cb, details) {

  },
  _netease_search: function (keyword, cb, details) {

  },
  parseLrc: function (lrc) {
    var oLRC = [];
    if (lrc.length == 0) return;
    var lrcs = lrc.split('\n');//用回车拆分成数组
    for (var i in lrcs) {//遍历歌词数组
      lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, ""); //去除前后空格
      var t = lrcs[i].substring(lrcs[i].indexOf("[") + 1, lrcs[i].indexOf("]"));//取[]间的内容
      var s = t.split(":");//分离:前后文字
      if (!isNaN(parseInt(s[0]))) { //是数值
        var arr = lrcs[i].match(/\[(\d+:.+?)\]/g);//提取时间字段，可能有多个
        var start = 0;
        for (var k in arr) {
          start += arr[k].length; //计算歌词位置
        }
        var content = lrcs[i].substring(start);//获取歌词内容
        for (var k in arr) {
          var t = arr[k].substring(1, arr[k].length - 1);//取[]间的内容
          var s = t.split(":");//分离:前后文字
          oLRC.push({//对象{t:时间,c:歌词}加入ms数组
            t: (parseFloat(s[0]) * 60 + parseFloat(s[1])).toFixed(3),
            c: content
          });
        }
      }
    }
    oLRC.sort(function (a, b) {//按时间顺序排序
      return a.t - b.t;
    });
    var r = {};
    oLRC.forEach(function (a) {
      r[a.t] = a.c;
    })
    return r;
  },
  _compareDef: function (r, def) {
    if (!def) return r;
    for (var k in def) {
      r[k] = def[k];
    }
    return r;
  }
}