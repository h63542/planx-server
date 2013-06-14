/**
 * Created with JetBrains WebStorm.
 * User: huangzhi
 * Date: 13-6-1
 * Time: 下午10:07
 * To change this template use File | Settings | File Templates.
 */
var nosqlProxy = require("./../db/nosqlProxy"),
    mysqlProxy = require("./../db/mysqlProxy"),
    logger = require("./../logger").getLogger();
module.exports = {
    initDBConn:initDBConn,
    queryRouter:queryRouter,
    getRecordByID:getRecordByID
}

function initDBConn(callback){
    nosqlProxy.initDBConn(function(err){
        if(err){
            doError(callback,err);
        }
        else{
            callback(null);
        }
    });
}

//查找id对应的真实表和分区
function queryRouter(id,callback){
    mysqlProxy.queryRouter(id,function(err,table){
        if(err){
            doError(callback,err)
        }else{
            callback(null,id,table);
        }
    });
}
/**
 * 获取主对象信息
 */
function getRecordByID(id,table,callback){
    nosqlProxy.get(id,table,function(err,masterRecord){
        if(err){
            doError(callback,err)
        }else{
            callback(null,table,masterRecord);
        }
    })
}
