const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./endpoints.js']
const doc = {
    info: {
        version: "0.1.0",
        title: "PJAPI",
        description: "Unofficial API for <b>プロジェクトセカイカラフルステージfeat.初音ミク</b>"
    },
    host: "pjapi.aiueokashi001.repl.co",
    basePath: "/",
    schemes: ['https']
}

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./app.js')
})