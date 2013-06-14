/**
 * Created with JetBrains WebStorm.
 * User: huangzhi
 * Date: 13-6-1
 * Time: 下午3:02
 * To change this template use File | Settings | File Templates.
 */

var log4js = require('log4js');
//console log is loaded by default, so you won't normally need to do this
//log4js.loadAppender('console');
log4js.loadAppender('file');
//log4js.addAppender(log4js.appenders.console());
log4js.addAppender(log4js.appenders.file('logs/server.log'), 'server');

var logger = log4js.getLogger('server');
logger.setLevel('DEBUG');

module.exports = {
    getLogger: function(){
        return logger;
    }
}