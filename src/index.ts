import * as http from 'http'
import * as net from 'net'
import {Transform} from 'stream'

export class HttpBus {
    private server:http.Server
    constructor(proxyFunction:(req:http.IncomingMessage)=>net.NetConnectOpts) {
        this.server = http.createServer(async (req,res) => {
            const client = net.createConnection(await proxyFunction(req), () => {
                let httpHeaderStr = `${req.method} ${req.url} HTTP/${req.httpVersion}\r\n`
                for(let i=0;i<req.rawHeaders.length;i=i+2) {
                  httpHeaderStr+=`${req.rawHeaders[i]}: ${req.rawHeaders[i+1]}\r\n`
                }
                httpHeaderStr+=`\r\n`
                client.write(httpHeaderStr)
                req.pipe(client)
                client.pipe(res.socket)
              })
        })
    }

    listen(...args) {
        this.server.listen(...args)
    }

    close(callback?: (err?: Error) => void) {
        this.server.close(callback)
    }
}
  