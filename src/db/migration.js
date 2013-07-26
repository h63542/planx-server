/**
 * Created with JetBrains WebStorm.
 * User: huangzhi
 * Date: 13-6-1
 * Time: 下午2:52
 * To change this template use File | Settings | File Templates.
 */
var fs = require("fs"),
    cwd = process.cwd(),
    logger = require("../logger").getLogger(),
    _ = require("underscore"),
    async = require("async"),
    nosqlProxyFC = require("./dataProxyFC"),
    nosqlProxy = nosqlProxyFC.getNoSqlProxy(nosqlProxyFC.C.DEFAULT_NOSQLDB),
    self = this;
function Migration(cfgPath){
    this.cfgPath = cfgPath;
}
Migration.prototype.migration = function(version,callback){
    var that = this;

    async.parallel([migrationNosql,migrationMysql],function(err){
        if(err){
            doError(callback,err);
        }else{
            console.log("Migration successful "+version);
            callback(null);
        }
    });

    function migrationNosql(callback){
        var data = fs.readFileSync(that.cfgPath+"/"+version +".json","UTF-8");
        this.config = JSON.parse(data);
        var changes = this.config.changeSet.changes;

        nosqlProxy.initDBConn(initConn);
        function initConn(err,conn){
            async.eachSeries(changes,doCommand,function(err){
                callback(err);
            })

            function doCommand(change,callback){
                console.log(change.action);
                if(typeof(dbCommands[change.action]) == "function"){
                    dbCommands[change.action].call({},conn,change,version,callback);
                }
            }
        }

    }
    function migrationMysql(callback){
        //执行this.cfgPath+"/"+version +".sql文件
        setTimeout(function(){
            callback(null);
        },10)
    }

}
var dbCommands = {
    "createNosqlDB":function(conn,change,version,callback){
        async.each(change.value,createDB,function(err){
            if(err){
                doError(callback,err);
            }else{
                callback(null);
            }
        })
        function createDB(db,callback){

            nosqlProxy.dbList(function(err,result){
                if(result.indexOf(db.name) == -1){
                    nosqlProxy.dbCreate(db.option,function(err){
                        if(err){
                            doError(callback,err);
                        }else{
                            callback(null)
                        }
                    })
                }else{
                    callback(null);
                }
            })
        }
    },
    "createNosqlTable":function(conn,change,version,callback){
        async.each(change.value,createTable,function(err){
            if(err){
                doError(callback,err);
            }else{
                callback(null);
            }
        })
        function createTable(table,callback){
            nosqlProxy.tableList(function(err,result){
                if(result.indexOf(table.id) == -1){
                    nosqlProxy.tableCreate(table.id,table.option,function(err){
                        console.log(table.id);
                        if(err){
                            doError(callback,err);
                        }else{
                            callback(null)
                        }
                    })
                }else{

                    callback(null)
                }
            })
        }
    },
    "execCommand":function(conn,change,version,callback){
        var script = require("./schema/"+version);
        if(script){
            script[change.value.action].call(script,self.conn,change.value.params,callback);
        }
    }
}

module.exports = Migration;
