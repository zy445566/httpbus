import * as path from 'path'
import * as http from 'http'
import * as net from 'net'
import { HttpBus } from './index'
import fetch from 'node-fetch'
import {equal} from 'assert'

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


async function run() {
    const portText = await (await fetch('http://127.0.0.1:8000/port')).text()
    equal(portText,'there is port','portText is error')
    const socketText = await (await fetch('http://127.0.0.1:8000/socket')).text()
    equal(socketText,'there is socket','socketText is error')
    httpBus.close()
    portHttp.close()
    socketHttp.close()
}

run();