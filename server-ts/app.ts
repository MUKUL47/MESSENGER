import Server from './src/server';
import os from 'os'
import clusters from 'cluster'
if(clusters.isMaster){
    new Server().start().then(console.info).catch(console.error)
    for(let i = 0; i < os.cpus().length; i++) clusters.fork()
}else{
    new Server().setPort(Number(process.env.PORT)+clusters.worker.id).start().then(console.info).catch(console.error)
}