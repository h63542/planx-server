var mysql = require('mysql')
    logger = require("../logger").getLogger();


module.exports = MysqlProxy;

function MysqlProxy(datasource){
    this.databaseName = datasource.dbName;
    this.pool  = mysql.createPool(datasource.dbserver);
}

MysqlProxy.prototype = {
    getConn:getConn,
    getUniqueId:getUniqueId,
    queryRouter:queryRouter,
    updateRouter:updateRouter,
    deleteRouter:deleteRouter
}


function getConn(callback){
    that.pool.getConnection(function(err, conn) {
        if(err){
            logger.error(err);
            callback(err,-1);
        }else{
            callback(null,conn);
        }
    });
}

function getUniqueId(callback){
    var that = this;
    if(!getUniqueId.id){
        that.pool.getConnection(function(err, conn) {
            if(err){
                logger.error(err);
                conn.end();
                callback(err,-1);
            }
            var sql = "UPDATE "+that.databaseName+".ticket_mutex SET value=LAST_INSERT_ID(value+1) WHERE name='ENTITY';"
            conn.query(sql,function(err){
                if(err){
                    logger.error(err);
                    conn.end();
                    callback(err,-1);
                }
                conn.query("SELECT LAST_INSERT_ID()",function(err,rows){
                    if(err){
                        logger.error(err);
                        conn.end();
                        callback(err,-1);
                    }
                    getUniqueId.id = rows[0]["LAST_INSERT_ID()"];
                    var tmp = global.nodeID+""+process.pid+""+(new Date()).getMonth()+""+(new Date()).getDate()+""+(new Date()).getHours()+""+(new Date()).getMinutes()+""+(new Date()).getMilliseconds()+""+rows[0]["LAST_INSERT_ID()"];
                    conn.end();
                    callback(null,tmp);
                });
            });
        });
    }else{
        setTimeout(function(){
            var tmp = global.nodeID+""+process.pid+""+(new Date()).getMonth()+""+(new Date()).getDate()+""+(new Date()).getHours()+""+(new Date()).getMinutes()+""+(new Date()).getMilliseconds()+""+(getUniqueId.id++);
            callback(null,tmp)
            that.pool.getConnection(function(err, conn) {
                if(err){
                    logger.error(err);
                    callback(err,-1);
                }
                var sql = "UPDATE "+that.databaseName+".ticket_mutex SET value=LAST_INSERT_ID(value+1) WHERE name='ENTITY';"
                conn.query(sql,function(err){
                    if(err){
                        logger.error(err);
                    }
                });
            });
        },0);
    }
}

function updateRouter(id,table,callback){
    var that = this;
    that.pool.getConnection(function(err, conn) {
        if(err){
            logger.error(err);
            conn.end();
            callback(err,-1);
        }
        var sql = "INSERT "+that.databaseName+".record_router (id,tableName) values(?,?)";
        conn.query(sql,[id,table],function(err){
            if(err){
                logger.error(err);
                conn.end();
                callback(err,-1);
            }
            else{
                conn.end();
                callback(null)
            }
        });
    });
}
function queryRouter(id,callback){
    var that = this;
    that.pool.getConnection(function(err, conn) {
        if(err){
            logger.error(err);
            callback(err,-1);
        }
        var sql = "SELECT tableName FROM "+that.databaseName+".record_router WHERE id = ?";
        conn.query(sql,[id],function(err,rows){
            if(err){
                logger.error(err);
                conn.end();
                callback(err,-1);
            }
            else{
                if(rows.length>0){
                    conn.end();
                    callback(null,rows[0].tableName)
                }else{
                    conn.end();
                    callback({code:404,msg:id+" not exist!"});
                }
            }
        });
    });
}

function deleteRouter(id,callback){
    var that = this;
    that.pool.getConnection(function(err, conn) {
        if(err){
            logger.error(err);
            conn.end();
            callback(err,-1);
        }
        var sql = "delete FROM "+that.databaseName+".record_router WHERE id = ?";
        conn.query(sql,[id],function(err,rows){
            if(err){
                logger.error(err);
                conn.end();
                callback(err,-1);
            }
            else{
                conn.end();
                callback(null,id)
            }
        });
    });
}