(()=>{
    let v2={
        async getDetails(details={},platform){
            let midkey=platform=='qq'?'mid':'id';
            if(!details[midkey]){
                throw musicAll.ctErr(0,details,midkey);
            }
            let url='https://api.vkeys.cn/v2/music/'+(platform=='qq'?'tencent':'netease');
            let res;
            try{
                res=await musicAll.ajax(url,{
                    [midkey]:details[midkey],
                    quality:details.q||8
                })
            }catch(e){
                throw musicAll.ctErr(1,details,e);
            }
            if(res.code!=200){
                throw musicAll.ctErr(2,details,res);
            }
            let rd=res.data;
            return {
                img:rd.cover,
                music:rd.url,
                details:{
                    artist:rd.singer,
                    name:rd.song,
                    album:rd.album,
                    link:rd.link
                }
            }
        },
        async getLrc(details={},platform){
            let midkey=platform=='qq'?'mid':'id';
            if(!details[midkey]){
                throw musicAll.ctErr(0,details,midkey);
            }
            let url='https://api.vkeys.cn/v2/music/'+(platform=='qq'?'tencent':'netease')+'/lyric';
            let res;
            try{
                res=await musicAll.ajax(url,{
                    [midkey]:details[midkey]
                })
            }catch(e){
                throw musicAll.ctErr(1,details,e);
            }
            if(res.code!=200){
                throw musicAll.ctErr(2,details,res);
            }
            let rd=res.data;
            return{
                lrc:rd.lrc,
                trc:rd.trans,
                yrc:rd.yrc
            }
        }
    }

    window.vkeysQQEngine={
        platform:'qq',
        name:'vkeys',
        support:['img','music','details','lrc','yrc','trc'],
        requestFz:[['img','music','details'],['lrc','yrc','trc']],
        get:function(details,target){
            if(this.requestFz[0].find(t=>t==target)){
                return v2.getDetails(details,'qq')
            }else{
                return v2.getLrc(details,'qq')
            }
        }
    }

    window.vkeysNeteaseEngine={
        platform:'netease',
        name:'vkeys',
        support:['img','music','details','lrc','yrc','trc'],
        requestFz:[['img','music','details'],['lrc','yrc','trc']],
        get:function(details,target){
            if(this.requestFz[0].find(t=>t==target)){
                return v2.getDetails(details,'netease')
            }else{
                return v2.getLrc(details,'netease')
            }
        }
    }
})();