/**
 * Created with JetBrains WebStorm.
 * User: huangzhi
 * Date: 13-6-10
 * Time: 下午10:31
 * To change this template use File | Settings | File Templates.
 */

global.doError = doError;
global.doResopnse = doResopnse;
var logger = require("./logger").getLogger();

function doError(callback,err){
    logger.error(new Error(err.msg,err.name));
    callback(err);
}
function doResopnse(req,res,jsonObj){
    var executeTime = new Date().getTime()-res.getHeader("beginTime");
    res.setHeader("executeTime",executeTime);
    var requestId = res.getHeader("requestId");
    var jsons = JSON.stringify(jsonObj);
    res.setHeader('Content-Type', 'application/json;charset=UTF-8');
    res.setHeader('Content-Length', jsons.length);
    res.end(jsons);
}