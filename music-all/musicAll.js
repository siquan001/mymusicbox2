const _config={
    getSort:{
        img:[],
        music:[],
        lrc:[],
        trc:[],
        arc:[],
        details:[],
    },
}

const _engine={}

const musicAll={
    config(){
        return _config;
    },
    get(details,cbs){
        let platformPx={};
        let plEnginePx={};
        let q_cache={}
        initPlPx();
        pxPlE();
        for(let k in platformPx){
            ft(platformPx[k],k);
        }

        function ft(platforms,k){
            let reqsthens=[];
            // 按平台和引擎优先级获取数据
            function qq(i,j){
                let pl=platforms[i];
                if(q_cache[k][pl]){
                    cbs[k](q_cache[k][pl]);// 若该平台已经有相关数据请求完成，则直接返回
                    return;
                }
                
                let ens=plEnginePx[pl];
                let en=_engine[pl][ens[j]];
                let det=details[pl];
                if(!det){
                    if(platforms.length==i+1){
                        console.error(`在获取 ${k} 时所有平台均失败！`)
                        cbs[k](false);
                    }
                    qq(i+1,0);
                    return;
                }
                if(en.support.find(k2=>k2==k)){// 选择支持获取该数据的引擎
                    // 若该引擎已经发起过请求而且会返回响应结果，则不进行重复请求，仅通知要callback和传入next
                    for(let x=0;x<reqsthens.length;x++){
                        if(reqsthens[x].pl==pl&&reqsthens[x].en==ens[j]){
                            if(reqsthens[x].actuallyRequest.find(k2=>k2==k)){
                                reqsthens[x].returns.push(k);
                                reqsthens[x].nexts.push(next);
                                return;
                            }                            
                        }
                    }

                    let actuallyRequest=[k];
                    if(en.requestFz){
                        // 获取本次请求实际上会请求的数据
                        for(let reqs of en.requestFz){
                            if(reqs.find(k2=>k2==k)){
                                actuallyRequest=reqs;
                                break;
                            }
                        }
                    }
                    let ri=reqsthens.length;
                    let rf=function(r){
                        let ks=reqsthens[ri].returns;
                        ks.forEach(k2=>{
                            if(k2=='img'){
                                musicAll.check(r[k2],'img',ok=>ok?cbs[k2](r[k2]):reqsthens[ri].cf('Failed to load '+k2+' img'));
                            }else if(k2=='music'){
                                musicAll.check(r[k2],'music',ok=>ok?cbs[k2](r[k2]):reqsthens[ri].cf('Failed to load '+k2+' music'));
                            }else{
                                try{
                                    cbs[k2](r[k2])
                                }catch(e){
                                    console.error(e);
                                }
                            }
                        });
                        for(let k2 in r){
                            if(q_cache[k2]){
                                if(k2=='img'){
                                    musicAll.check(r[k2],'img',ok=>{
                                        if(ok){
                                            q_cache[k2][pl]=r[k2];
                                        }
                                    });
                                }else if(k2=='music'){
                                    musicAll.check(r[k2],'music',ok=>{
                                        if(ok){
                                            q_cache[k2][pl]=r[k2];
                                        }
                                    });
                                }else{
                                    q_cache[k2][pl]=r[k2];
                                }
                            }
                        }
                    }
                    let cf=function(reason){
                        let ks=reqsthens[ri].returns;
                        console.warn(`在尝试于 ${pl} 平台的 ${ens[j]} 引擎获取 ${ks.join(',')} 时，出现错误，原因如下`,reason);
                        reqsthens[ri].nexts.forEach(ne=>ne());
                    }
                    reqsthens[ri]={
                        returns:[k],
                        nexts:[next],
                        actuallyRequest,
                        rf,cf,
                        pl,en:ens[j]
                    }
                    en.get(det,k).then(rf).catch(cf)
                }else{
                    next();
                }
                function next(){
                    if(ens.length==j+1){
                        console.warn(`在尝试于 ${pl} 平台获取 ${k} 时，所有引擎均失败`);
                        if(platforms.length==i+1){
                            console.error(`在获取 ${k} 时所有平台均失败！`)
                            cbs[k](false);
                        }
                        qq(i+1,0);
                    }else{
                        qq(i,j+1);
                    }
                }
            }
            qq(0,0);
        }

        function pxPlE(){
            for(let pl in _engine){
                plEnginePx[pl]=Object.keys(_engine[pl]);
                plEnginePx[pl].sort((a,b)=>_engine[pl][b].w-_engine[pl][a].w);
            }
        }
        
        function initPlPx(){
            for(let ts in cbs){
                platformPx[ts]=[];
                q_cache[ts]={};
                for(let pl of _config.getSort[ts]){
                    if(checkPl(pl,ts)){
                        platformPx[ts].push(pl);
                    }else{
                        console.warn(`在配置中获取 ${ts} 选择了 ${pl} 作为优先级平台，但 ${pl} 中并没有支持获取 ${ts} 的引擎（API）`);
                    }
                }
                for(let pl in _engine){
                    if(_config.getSort[ts].find(p=>p==pl)){
                        continue;
                    }
                    if(checkPl(pl,ts)){
                        platformPx[ts].push(pl);
                    }
                }
            }
        }

        function checkPl(pl,ts){
            for(en in _engine[pl]){
                if(_engine[pl][en].support.find(t=>t==ts)){
                    return true;
                }
            }
        }
    },
    check(url,type='music',cb){
        if(type=='music'){
            let a=document.createElement('audio');
            a.src=url;
            document.body.append(a);
            a.oncanplay=function(){
                cb(true);
            }
            a.onerror=function(){
                cb(false);
            }
        }else if(type=='img'){
            let i=new Image();
            i.src=url;
            i.onload=function(){
                cb(true);
            }
            i.onerror=function(){
                cb(false);
            }
        }
    },
    search(keyword,pl,details){
        return new Promise((r,j)=>{
            let ens=Object.keys(_engine[pl]);
            ens.sort((a,b)=>_engine[pl][a].w-_engine[pl][b].w);
            let errs={};
            function qq(i){
                let en=_engine[pl][ens[i]];
                if(en.search){
                    en.search(keyword,details).then(rs=>{
                        r(rs);
                    }).catch(e=>{
                        errs[ens[i]]=e;
                        console.warn(`在 ${pl} 平台使用 ${ens[i]} 引擎搜索时失败，原因：`,e);
                        if(ens.length==i+1){
                            j({errs})
                        }
                    })
                }
            }
            qq(0);
        })
    },
    addEngine(engine,w){
        let pl=engine.platform;
        let n=engine.name;
        delete engine.platform;
        delete engine.name;
        engine.w=w;
        if(!_engine[pl]){
            _engine[pl]={};
        }
        _engine[pl][n]=engine;
        
    },
    listEngine(){
        let r={};
        for(let k in _engine){
            r[k]=Object.keys(_engine[k]);
        }
    },
    ajax(url,data,method){
        return new Promise((r,j)=>{
            let n=new XMLHttpRequest();
            if(method=='POST'){
                n.body=data;                
            }else if(data){
                let q='';
                for(let k in data){
                    q+='&'+k+'='+data[k];
                }
                if(url.indexOf('?')!=-1){
                    url=url+q;
                }else{
                    url=url+q.replace('&','?');
                }
            }
            n.open(method||'GET',url);
            n.onreadystatechange=function(){
                if(n.readyState==4&&n.status==200){
                    let res=n.responseText;
                    try {
                        res=JSON.parse(res);
                    } catch (error) {}
                    r(res);
                }else if(n.readyState==4&&n.status>=400){
                    j(n);
                }
            }
            n.onerror=function(){
                j(n);
            }
            if(method=='POST'){
                n.send(data);
            }else{
                n.send();
            }
        })
    },
    ctErr(type,details,content){
        switch(type){
            case 0:
                return {
                    reason:'no '+content,
                    from:details
                }
            case 1:
                return {
                    reason:"Network Error",
                    request:content,
                    from:details
                }
            case 2:
                return {
                    reason:"API Error",
                    res:content,
                    from:details
                }
        }
    },
    parseLrc(lrc){
        lrc=lrc||"[00:00.00] 暂无歌词";
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
    }
}