const handler = require('serve-handler')
const http = require('http')
const server = http.createServer((request, response) => handler(request, response, { public: "./public" }))
const PORT = process.env.PORT || 80
server.listen(PORT, () => console.log(`Frontend running at ${PORT} port`))