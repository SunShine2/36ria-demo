var static = require('node-static');
//指向静态文件资源位置
var files = new static.Server('./public');

var http = require('http');
var server = http.createServer(function(req,res){
    //页面交给node-static渲染
    req.addListener('end',function(){
        files.serve(req,res);
    })
}).listen(7878);