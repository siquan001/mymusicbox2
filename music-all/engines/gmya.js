(()=>{
    function cl(u){
        var url=new URL(u);
        url.protocol='https:'
        url.host='ws.stream.qqmusic.qq.com';
        return url.href;
    }
    async function get(details,platform){
        let midkey=platform=='qq'?'mid':'id';
        if(!details[midkey]){
            throw musicAll.ctErr(0,details,midkey);
        }
        let url='https://api.gmya.net/Api/'+(platform=='qq'?'Tencent':'Netease');
        let data={
            format : 'json',
            id : details[midkey],
            appkey : 'e0e1b6a0eb55ea709950db7c4671ff16',
        }
        let result;
        try{
            result=await musicAll.ajax(url,data);
        }catch(e){
            throw musicAll.ctErr(1,details,e);
        }
        if(result.code!=200){
            throw musicAll.ctErr(2,details,result);
        }
        let rd=result.data;
        return {
            img:rd.pic,
            music:platform=='qq'?cl(rd.url):rd.url,
            lrc:rd.lrc,
            details:{
                artist:rd.author,
                name:rd.title,
                link:rd.link
            }
        }
    }

    window.gmyaQQEngine={
        platform:'qq',
        name:"gmya",
        support:['img','music','lrc','details'],
        requestFz:[['img','music','lrc','details']],
        get:function(details){
            return get(details,'qq');
        }
    }

    window.gmyaNeteaseEngine={
        platform:'netease',
        name:"gmya",
        support:['img','music','lrc','details'],
        requestFz:[['img','music','lrc','details']],
        get:function(details){
            return get(details,'netease');
        }
    }
})();


