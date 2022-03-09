# httpbus
http bus server, Nginx-like programmable package

# Installation 
```sh
npm install httpbus
```

# example
```ts
import * as path from 'path'
import * as http from 'http'
import * as net from 'net'
import { HttpBus } from 'httpbus'

const socketPath = path.join(__dirname,'test.sock')
const httpBus = new HttpBus(function (req:http.IncomingMessage):net.NetConnectOpts {
    if(req.url==='/socket' || req.headers['go-socket']==='true') {
        return {
            path:socketPath
        }
    } else {
        return {
            port:9000
        }
    }
})
httpBus.listen(8000)


const portHttp = http.createServer((req,res)=>{
    res.end('there is port')
}).listen(9000)

const socketHttp = http.createServer((req,res)=>{
    res.end('there is socket')
}).listen(socketPath)
```