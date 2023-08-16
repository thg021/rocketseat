import http from 'node:http'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js' 
import { json } from './middlewares/json.js'
const LISTEN_PORT = 8888

const server = http.createServer(async(req, res) => {
    const {method, url } = req

    const router = routes.find(route => {
        return route.method === method && route.path.test(url)
    })  

    await json(req, res)

    if(router){
        const routeParams = req.url.match(router.path)

        const { query, ...params } = routeParams.groups
    
        req.params = params
        req.query = query ? extractQueryParams(query) : {}

        return router.handler(req, res)
    
    }

    return res.writeHead(404).end('404 Not Found')
})

server.listen(LISTEN_PORT, () => { 
    console.log(`listening server on port ${LISTEN_PORT}`) 
})