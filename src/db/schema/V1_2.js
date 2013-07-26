/**
 * Created with JetBrains WebStorm.
 * User: huangzhi
 * Date: 13-6-1
 * Time: 下午2:52
 * To change this template use File | Settings | File Templates.
 */
var fs = require("fs"),
    cwd = process.cwd(),
    logger = require("../../logger").getLogger(),
    _ = require("underscore"),
    nosqlProxyFC = require("../dataProxyFC"),
    nosqlProxy = nosqlProxyFC.getNoSqlProxy(nosqlProxyFC.C.DEFAULT_NOSQLDB),
    self = this;

function Migration(){
}
Migration.prototype.initMetaTable = function(conn,params,callback){
    //创建元数据表
    //构造元数据数据
    var metaDatas = params;
    var antidependences = {

    };
    _.each(metaDatas,function(table){
        _.each(table.dependencies,function(item){
            if(!antidependences[item]){
                antidependences[item] = [];
            }
            antidependences[item].push(table.id);
        })
    });
    _.each(metaDatas,function(table){
        table["antidependences"] = antidependences[table.id]?antidependences[table.id]:[];
    })

    nosqlProxy.getConn(function(err,conn){
        //插入数据
        nosqlProxy.tableList(function(err,result){
            if(result && result.indexOf("metaTable") == -1){
                nosqlProxy.tableCreate("metaTable",{"primaryKey":"name"},function(err,result){
                    if(err) {
                        logger.debug("[ERROR] initMetaTable: %s:%s\n%s", err.name, err.msg, err.message);
                        callback(err);
                        return;
                    }

                    nosqlProxy.insert('metaTable',metaDatas,callback,function(err,result){
                        if(err) {
                            logger.debug("[ERROR] initMetaTable: %s:%s\n%s", err.name, err.msg, err.message);
                            callback(err);

                            return;
                        }
                        callback(null);

                    });
                })
            }else{
                nosqlProxy.insert('metaTable',metaDatas,callback,function(err,result){
                    if(err) {
                        logger.debug("[ERROR] initMetaTable: %s:%s\n%s", err.name, err.msg, err.message);
                        callback(err);

                        return;
                    }
                    callback(null);

                });
            }
        })
    })
}

module.exports = new Migration();
