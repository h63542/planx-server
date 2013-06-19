var http = require('http'),
    logger = require("./logger").getLogger(),
    connect = require("connect"),
    env = require("./env"),
    flash = require('connect-flash'),
    express = require('express'),
    passport = require('passport'),
    user = require('./auth/user'),
    util = require('util'),
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
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,Origin, Accept, Content-Type, X-HTTP-Method, X-HTTP-METHOD-OVERRIDE');
    res.setHeader('Access-Control-Max-Age', '10');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.end("POST, GET, PUT, DELETE");
    }
    else {
        next();
    }
};

function statistics(req, res, next){
    var beginTime = (new Date()).getTime();
    var requestId = nodeID+"-"+beginTime;
    res.setHeader("beginTime",beginTime);
    res.setHeader("requestId",requestId);
    logger.debug("["+req.url+" "+req.method+"]"+"nodeId:"+nodeID+" request beigin!");
    next();
}


function setCommonHeader(req, res, next){
    res.setHeader('Keep-Alive', 'timeout=1, max=100');
    next();

}

void main(function(){
    process.on('SIGINT'  ,aboutExit)
    process.on('SIGTERM' ,aboutExit)

    app = express();
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser())
        .use(express.timeout(1000*3))
        .use(express.static(__dirname + '/../public'))
        .use(express.compress())
        .use(allowCrossDomain)
        .use(express.logger())
        .use(express.cookieParser())
        .use(express.methodOverride())
        .use(flash())
        .use(express.session({ secret: 'keyboard cat' }))
        .use(passport.initialize())
        .use(passport.session())
        .use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    require('./auth/auth');

    routerMap.initRouter(app);

    process.on('message',function(m ,handle){
        if(handle){
            global.nodeID = m.nodeId;
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

