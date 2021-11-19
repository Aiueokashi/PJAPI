const swaggerAutogen = require('swagger-autogen')()

const autoGen = true;
const outputFile = './swagger_output.json'
const endpointsFiles = ['./endpoints.js']
const doc = {
  "swagger": "2.0",
  "info": {
    "version": "0.1.0",
    "title": "PJAPI",
    "description": "Unofficial API for <b>プロジェクトセカイカラフルステージfeat.初音ミク</b>"
  },
  "host": "pjapi.aiueokashi001.repl.co",
  "basePath": "/",
  "tags": [],
  "schemes": [
    "https",
    "http"
  ],
  "consumes": [],
  "produces": []
}

if(autoGen){
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./app.js')
})
}else{
  require('./app.js')
}