/**
 * Created with JetBrains WebStorm.
 * User: huangzhi
 * Date: 13-6-10
 * Time: 下午10:31
 * To change this template use File | Settings | File Templates.
 */

global.doError = doError;
global.doResopnse = doResopnse;
global.nodeID = 1;
var logger = require("./logger").getLogger();

function doError(callback,err){
    logger.error(err);
    logger.error(err.stack);
    callback(err);
}
function doResopnse(res,jsonObj){
    var jsons = JSON.stringify(jsonObj);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Length', jsons.length);
    res.end(jsons);
}