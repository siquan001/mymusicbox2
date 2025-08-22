(()=>{
    window.gequbaoEngine={
        platform:'gequbao',
        name:"siquan",
        support:['img','music','lrc','details'],
        requestFz:[['img','music','lrc','details']],
        get:async function(details){
            if(!details.id){
                throw musicAll.ctErr(0,details,'id');
            }
            let url='https://siquan-api.xhyu.top/api/gequbao';
            let data={
                id : details.id,
            }
            let result;
            try{
                result=await musicAll.ajax(url,data);
            }catch(e){
                throw musicAll.ctErr(1,details,e);
            }
            if(result.code!=0){
                throw musicAll.ctErr(2,details,result);
            }
            let rd=result.data;
            return {
                img:rd.img,
                music:rd.url,
                lrc:rd.lrc,
                details:{
                    artist:rd.artist,
                    name:rd.name
                }
            }
        }
    }
})();