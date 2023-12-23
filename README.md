# 陈思全的音乐盒子（新版）

这是我自己做的音乐盒子，里面放着我喜欢的音乐，音乐来源于酷狗音乐，QQ音乐，网易云音乐，你也可以按照下面的方式把它变成你的。

## 拿走方式

在index.js按照注释配置根配置

```javascript
// 你将会看到这样

var MUSICLIST_URL  = './musiclist.json'; //歌单文件
var INFO           = true;               // 显示你的评价 (取决于 INFO_ROOT/[mid].txt)
var TAG            = true;               // 显示歌曲标签 (取决于musiclist[i].tag)
var DEFAULT_MODE   = 'light';            // 默认模式 ，可选 light 亮色,dark 暗色
var INFO_ROOT      = './info/'           // 评价文件夹根目录 (结尾要加“/”)
var AUTOPLAY       = true;               // 自动播放
var START_PLAY     = 'random'            // 刚开始的播放策略，可选 random 随机播放，first 第一首播放
var PLAY_MODE      = 'loop';             // 播放模式，可选 loop 单曲循环，random 随机播放，order 顺序播放
var ENABLED_MID    = true;               // 是否启用歌曲mid，这主要应用于歌曲定位和评价显示
var SHOW_MID_IN_URL= true;               // 是否显示歌曲mid在歌曲链接中(这不会导致历史记录堆积)

/* ↑↑↑ 根配置 ↑↑↑ */

// ...
```

在`./musiclist.json`(或你在`MUSICLIST_URL`填的地址)按这种格式写

```json
[{
  "name":"歌曲名",
  "artist":"歌手名",
  // kugou,qq,netease有至少一个就行，按qq->kugou->netease解析
  "kugou":{
    "hash":"酷狗音乐hash值",
    "album_id":"酷狗音乐album_id值（无则不填）"
  },
  "qq":{
    "mid":"QQ音乐mid"
  },
  "netease":{
    "id":"网易云音乐id"
  },
  "mid":"自己随意，不重复即可", // 这主要应用于歌曲定位和评价显示，如ENABLED_MID=false,可不填
  "tag":["自己随意","想加多少加多少"], // TAG=false可不填 
},...]
```

如果`INFO=true`，那么你需要在`./info/`(或你在`INFO_ROOT`填的地址)内按照`[mid].txt`的方式写评价，就像这样：

```
INFO_ROOT
- 00001.txt 
- 00002.txt
```

把评价写在`[mid].txt`内

## 版权声明

本项目遵循MIT协议，版权属于陈思全（作者本人），你可以对其进行修改、分发、复用等，作者不对其后果负责，但你必须在项目中保留版权信息（我已经写了，你不删就行）

## 特别鸣谢

- [酷狗音乐](https://kugou.com/)
- [QQ音乐](https://y.qq.com/)
- [网易云音乐](https://music.163.com/)
- [故梦API](https://api.gumengya.com)
- [落月 - API](https://api.vkeys.cn/)


