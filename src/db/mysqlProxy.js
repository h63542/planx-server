var mysql = require('mysql')
    logger = require("../logger").getLogger();
var pool  = mysql.createPool({
    host     : '127.0.0.1',
    port     : 3306,
    user     : 'root',
    password : '983711'
});

module.exports = {
    getConn:getConn,
    getUniqueId:getUniqueId,
    queryRouter:queryRouter,
    updateRouter:updateRouter,
    deleteRouter:deleteRouter
}

function getConn(callback){
    pool.getConnection(function(err, conn) {
        if(err){
            logger.error(err);
            callback(err,-1);
        }else{
            callback(null,conn);
        }
    });
}

function getUniqueId(callback){
    if(!getUniqueId.id){
        pool.getConnection(function(err, conn) {
            if(err){
                logger.error(err);
                callback(err,-1);
            }
            var sql = "UPDATE planx_graph.ticket_mutex SET value=LAST_INSERT_ID(value+1) WHERE name='ENTITY';"
            conn.query(sql,function(err){
                if(err){
                    logger.error(err);
                    callback(err,-1);
                }
                conn.query("SELECT LAST_INSERT_ID()",function(err,rows){
                    if(err){
                        logger.error(err);
                        callback(err,-1);
                    }
                    getUniqueId.id = rows[0]["LAST_INSERT_ID()"];
                    var tmp = global.nodeID+""+process.pid+""+(new Date()).getMonth()+""+(new Date()).getDate()+""+(new Date()).getHours()+""+(new Date()).getMinutes()+""+(new Date()).getMilliseconds()+""+rows[0]["LAST_INSERT_ID()"];
                    callback(null,tmp);
                });
            });
        });
    }else{
        setTimeout(function(){
            var tmp = global.nodeID+""+process.pid+""+(new Date()).getMonth()+""+(new Date()).getDate()+""+(new Date()).getHours()+""+(new Date()).getMinutes()+""+(new Date()).getMilliseconds()+""+(getUniqueId.id++);
            callback(null,tmp)
            pool.getConnection(function(err, conn) {
                if(err){
                    logger.error(err);
                    callback(err,-1);
                }
                var sql = "UPDATE planx_graph.ticket_mutex SET value=LAST_INSERT_ID(value+1) WHERE name='ENTITY';"
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
    pool.getConnection(function(err, conn) {
        if(err){
            logger.error(err);
            callback(err,-1);
        }
        var sql = "INSERT planx_graph.record_router (id,tableName) values(?,?)";
        conn.query(sql,[id,table],function(err){
            if(err){
                logger.error(err);
                callback(err,-1);
            }
            else{
                callback(null)
            }
        });
    });
}
function queryRouter(id,callback){
    pool.getConnection(function(err, conn) {
        if(err){
            logger.error(err);
            callback(err,-1);
        }
        var sql = "SELECT tableName FROM planx_graph.record_router WHERE id = ?";
        conn.query(sql,[id],function(err,rows){
            if(err){
                logger.error(err);
                callback(err,-1);
            }
            else{
                if(rows.length>0){
                    callback(null,rows[0].tableName)
                }else{
                    console.log(id);
                    callback({code:404,msg:id+" not exist!"});
                }
            }
        });
    });
}

function deleteRouter(id,callback){
    pool.getConnection(function(err, conn) {
        if(err){
            logger.error(err);
            callback(err,-1);
        }
        var sql = "delete FROM planx_graph.record_router WHERE id = ?";
        conn.query(sql,[id],function(err,rows){
            if(err){
                logger.error(err);
                callback(err,-1);
            }
            else{
                callback(null,id)
            }
        });
    });
}