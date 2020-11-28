const cp = require('child_process')
cp.exec('mongod',(err, std, stderr)=>{
    console.log(err, std, stderr)
})