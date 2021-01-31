import Server from './src/server';
import os from 'os'
import clusters from 'cluster'
if(clusters.isMaster){
    if(process.env.MODE !== 'PROD') {
        new Server().start().then(console.info).catch(console.error)
    }else{
        for(let i = 0; i < os.cpus().length; i++) clusters.fork()
    }
}else{
    new Server().start().then(console.info).catch(console.error)
}