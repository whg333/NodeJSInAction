/**
 * Created by Administrator on 2016/4/19.
 */

var http = require('http');
var formidable = require('formidable');
var open = require('open');
var util = require('util');

var url = require('url');
var path = require('path');
var fs = require('fs');

var root = __dirname;
var uploadDir = root+'/upload';

var server = http.createServer(function(req, res){
    switch(req.method){
        case 'GET':
            if(req.url == '/favicon.ico'){

            } else if(req.url == '/'){
                show(req, res);
            }else {
                var reqUrl = url.parse(req.url);
                var filePath = path.join(root, reqUrl.pathname);
                fs.createReadStream(filePath).pipe(res);
            }
            break;
        case 'POST':
            upload(req, res);
            break;
    }
});
server.listen(3000, function(){
    console.log('Server listening on port 3000\nroot_dir='+root);
    open('http://localhost:3000');
});

function show(req, res){
    var files = fs.readdirSync(uploadDir);
    var list = '<ol>';
    for(var index in files){
        console.log(files[index]);
        list += '<li><img src="/upload/'+files[index]+'" width="20%"/></li>';
    }
    list += '</ol>';
    var html = list
        + '<form method="post" action="/" enctype="multipart/form-data">'
        + '<p><input type="text" name="name" /></p>'
        + '<p><input type="file" name="file" /></p>'
        + '<p><input type="submit" name="Upload" /></p>'
        + '</form>';
    res.writeHead(200, {'content-type':'text/html', 'content-length':Buffer.byteLength(html)});
    res.end(html);
}

function upload(req, res){
    if(!isFormData(req)){
        res.statusCode = 400;
        res.end('Bad Request: expecting multipart/form-data');
        return;
    }

    var form = new formidable.IncomingForm();
    form.uploadDir = uploadDir;
    form.on('fileBegin', function(name, file) {
        //changed upload file path and name
        file.path = root+'/upload/ch04_'+file.name
    });
    form.on('progress', function(received, expected){
        console.log(Math.floor(received / expected * 100));
    });
    /*form.on('field', function(field, value){
        console.log(field);
        console.log(value);
    });
    form.on('file', function(name, file){
        console.log(name);
        console.log(file);
    });
    form.on('end', function(){
        res.end('upload conplete!');
    });*/
    form.parse(req, function(err, fields, files) {
        //res.setHeader('content-type', 'text/plain;charset=utf-8');
        //res.end('received upload:\n\n'+util.inspect({fields: fields, files: files}));

        show(req, res);
    });
}

function isFormData(req){
    var type = req.headers['content-type'] || '';
    return 0 == type.indexOf('multipart/form-data');
}