const fs=require('fs');
let b={};
fs.readdirSync('./info/').forEach((fileName)=>{
    b[fileName.replace('.txt','')]=fs.readFileSync(`./info/${fileName}`, 'utf-8');
})
fs.writeFileSync('./info.json',JSON.stringify(b));
