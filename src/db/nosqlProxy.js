/**
 * Created with JetBrains WebStorm.
 * User: huangzhi
 * Date: 13-6-1
 * Time: 下午8:17
 * To change this template use File | Settings | File Templates.
 */
var DBNAME = "planx_graph_r",
    logger = require("../logger").getLogger(),
    r = require("rethinkdb"),
    self = this;
    self.r = r;

RethinkdbProxy.prototype.get = function(id,table,callback){
    self.r.table(table).get(id).run(self.conn, function(err, result){
        if(err) {
            logger.debug("[ERROR] findById: %s:%s\n%s", err.name, err.msg, err.message);
            callback(err);
        }
        else {
            callback(null,result);
        }
    })
}

RethinkdbProxy.prototype.update = function(id,table,record,callback){
    self.r.table(table).get(id).update(record).run(self.conn, function(err, result){
        if(err) {
            logger.debug("[ERROR] findById: %s:%s\n%s", err.name, err.msg, err.message);
            callback(err);
        }
        else {
            callback(null,result);
        }
    })
}

RethinkdbProxy.prototype.insert = function(table,record,callback){
    self.r.table(table).insert(record).run(self.conn, function(err, result){
        if(err) {
            logger.debug("[ERROR] findById: %s:%s\n%s", err.name, err.msg, err.message);
            callback(err);
        }
        else {
            callback(null,result);
        }
    })
}


RethinkdbProxy.prototype.delete = function(id,table,callback){
    self.r.table(table).get(id).delete().run(self.conn, function(err, result){
        if(err) {
            logger.debug("[ERROR] findById: %s:%s\n%s", err.name, err.msg, err.message);
            callback(err);
        }
        else {
            callback(null,id);
        }
    })
}

RethinkdbProxy.prototype.query = function(table,filter,callback){
    this.getConn(doquery);
    function doquery(err,conn){
        if(filter && typeof(filter)=="function"){
            self.r.table(table).filter(filter).run(self.conn,function(err, rows){
                if(err) {
                    logger.debug("[ERROR] findById: %s:%s\n%s", err.name, err.msg, err.message);
                    doError(callback,err);
                }
                else {
                    rows.toArray(function(err, result) {
                        if(err) {
                            doError(callback,err);
                        }else{
                            callback(null,result);
                        }
                    })
                }
            });
        }else{
            self.r.table(table).run(self.conn,function(err, rows){
                if(err) {
                    logger.debug("[ERROR] findById: %s:%s\n%s", err.name, err.msg, err.message);
                    callback(err);
                }
                else {
                    rows.toArray(function(err, result) {
                        if(err){
                            doError(callback,err);
                        }else{
                            callback(null,result);
                        }

                    })
                }
            });
        }
    }

}

RethinkdbProxy.prototype.tableCreate = function(tableName,option,callback){
    self.r.db(DBNAME).tableCreate(tableName,option).run(self.conn, function(err){
        if(err){
            doError(callback,err);
        }
        else {
            callback(null,tableName);
        }
    })
}

RethinkdbProxy.prototype.dbCreate = function(dbName,option,callback){
    self.r.dbCreate(dbName).run(self.conn, function(err){
        if(err){
            doError(callback,err);
        }
        else {
            callback(null,dbName);
        }
    })
}

RethinkdbProxy.prototype.initDBConn = function(callback){
    this.getConn(function(err,conn){
        self.r = r;
        self.conn = conn;
        callback(err,conn);

    });
}

RethinkdbProxy.prototype.getConn = function(callback){
    if(!self.conn){
        r.connect({host:'localhost', port:28015},
            function(err, _conn) {
                if(err){
                    logger.error(err);
                    throw err;
                }else{
                    self.conn = _conn;
                    self.conn.use(DBNAME);
                    callback(null,_conn);
                }

            })
    }else{
        callback(null,self.conn);
    }
}
RethinkdbProxy.prototype.getR = function(){
    return self.r;
}



function RethinkdbProxy(){

}
module.exports = new RethinkdbProxy();
