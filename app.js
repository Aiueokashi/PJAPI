const express = require('express');
const cron = require('node-cron');
const git = require( 'simple-git' );
const fs = require( 'fs' );
const swaggerUi = require('swagger-ui-express');
const path = require( 'path' );
const swaggerFile = require('./swagger_output.json')
const app = express();
const axios = require('axios');
const port = 3000

var git_url = 'https://github.com/Sekai-World/sekai-master-db-diff';
var local_folder = 'asset';

//git().clone(git_url,local_folder).then().catch(console.log)
cron.schedule('* */10 * * *', () => {
  git(local_folder).pull().then(()=>{console.log('done')})
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

require('./endpoints')(app)


app.listen(port, () => console.log(`listening on port ${port}!`))