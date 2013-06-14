var http = require('http'),
    logger = require("./logger").getLogger(),
    connect = require("connect"),
    env = require("./env"),
    routerMap = require("./routerMap");

function output(str){
    console.log(str);
}

function main(fn){
    fn();
}

var GRACE_EXIT_TIME = 1500;

var app = null;
var exitTimer = null;
var childReqCount = 0;

function aboutExit(){
    console.log("exit");
    if(exitTimer) return;

    app.stop();
    exitTimer = setTimeout(function(){
        output('worker will exit...');
        output('child req total : ' + childReqCount);

        process.exit(0);
    },GRACE_EXIT_TIME);
}
function allowCrossDomain(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, X-HTTP-Method, X-HTTP-METHOD-OVERRIDE');
    res.setHeader('Access-Control-Max-Age', '10');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};

function setCommonHeader(req, res, next){
    res.setHeader('Keep-Alive', 'timeout=1, max=100');
    next();

}

void main(function(){
    global.nodeID = 1;
    process.on('SIGINT'  ,aboutExit)
    process.on('SIGTERM' ,aboutExit)
    var connectRoute = require('./router'),
        connect = require('connect');
        app = connect();
    console.log(allowCrossDomain);

    app.use(connect.bodyParser())
        .use(connect.compress())
       .use(allowCrossDomain)
       .use(connectRoute(function (router) {
        routerMap.initRouter(router);
    }));

    process.on('message',function(m ,handle){
        if(handle){
            app.listen(handle, function(err){
                if(err){
                    output('worker listen error');
                }else{
                    process.send({'listenOK' : true});
                    output('worker listen ok');
                }
            });
        }
        if(m.status == 'update'){
            process.send({'status' : process.memoryUsage()});
        }
    });

    output('worker is running...');
});

