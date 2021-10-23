const cron = require('node-cron');
var git = require( 'simple-git' );
var fs = require( 'fs' );
var path = require( 'path' );

var git_url = 'https://github.com/Sekai-World/sekai-master-db-diff';
var local_folder = 'asset';

//git().clone(git_url,local_folder).then().catch(console.log)
cron.schedule('* */1 * * *', () => {
  git(local_folder).pull().then(()=>{console.log('done')})
})

require('./API/app.js')