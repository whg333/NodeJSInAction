/**
 * Created by Administrator on 2016/4/19.
 */

var http = require('http');
var formidable = require('formidable');
var open = require('open');
var util = require('util');

var server = http.createServer(function(req, res){
    switch(req.method){
        case 'GET':
            show(req, res);
            break;
        case 'POST':
            upload(req, res);
            break;
    }
});
server.listen(3000, function(){
    console.log('Server listening on port 3000\nroot_dir='+__dirname);
    open('http://localhost:3000');
});

function show(req, res){
    var html = ''
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
    form.uploadDir = __dirname+'/upload';
    form.on('fileBegin', function(name, file) {
        //changed upload file path and name
        file.path = __dirname+'/upload/ch04_'+file.name
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
        res.setHeader('content-type', 'text/plain;charset=utf-8');
        res.end('received upload:\n\n'+util.inspect({fields: fields, files: files}));
    });
}

function isFormData(req){
    var type = req.headers['content-type'] || '';
    return 0 == type.indexOf('multipart/form-data');
}