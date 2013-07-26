/**
 * Created with JetBrains WebStorm.
 * User: huangzhi
 * Date: 13-6-1
 * Time: 下午8:17
 * To change this template use File | Settings | File Templates.
 */
var logger = require("../logger").getLogger(),
    r = require("rethinkdb"),
    self = this;
    self.r = r;

RethinkdbProxy.prototype.get = function(id,table,callback){
    var that = this;

    if(that.conn){
        callback("proxy not init connection!");
        return;
    }

    self.r.table(table).get(id).run(that.conn, function(err, result){
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
    var that = this;

    if(!that.conn){
        callback("proxy not init connection!");
        return;
    }

    self.r.table(table).get(id).update(record).run(that.conn, function(err, result){
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
    var that = this;

    if(!that.conn){
        callback("proxy not init connection!");
        return;
    }

    self.r.table(table).insert(record).run(that.conn, function(err, result){
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
    var that = this;

    if(!that.conn){
        callback("proxy not init connection!");
        return;
    }

    self.r.table(table).get(id).delete().run(that.conn, function(err, result){
        if(err) {
            logger.debug("[ERROR] findById: %s:%s\n%s", err.name, err.msg, err.message);
            callback(err);
        }
        else {
            callback(null,id);
        }
    })
}


RethinkdbProxy.prototype.query = function(table,option,page,pageno,sort,filter,callback){
    var that = this;

    this.getConn(doquery);
    function doquery(err,conn){
        if(filter && typeof(filter)=="function"){
            self.r.table(table).filter(filter).run(conn,function(err, rows){
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
            self.r.table(table).run(conn,function(err, rows){
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
    var that = this;

    if(!that.conn){
        callback("proxy not init connection!");
        return;
    }

    self.r.db(that.dbName).tableCreate(tableName,option).run(that.conn, function(err){
        if(err){
            doError(callback,err);
        }
        else {
            callback(null,tableName);
        }
    })
}

RethinkdbProxy.prototype.dbCreate = function(option,callback){
    var that = this;

    if(!that.conn){
        callback("proxy not init connection!");
        return;
    }

    self.r.dbCreate(that.dbName).run(that.conn, function(err){
        if(err){
            doError(callback,err);
        }
        else {
            callback(null,that.dbName);
        }
    })
}

RethinkdbProxy.prototype.initDBConn = function(callback){
    var that = this;

    this.getConn(function(err,conn){
        self.r = r;
        that.conn = conn;
        callback(err,conn);

    });
}

RethinkdbProxy.prototype.getConn = function(callback){
    var that = this;

    if(!that.conn){
        r.connect({host:'localhost', port:28015},
            function(err, _conn) {
                if(err){
                    logger.error(err);
                    throw err;
                }else{
                    that.conn = _conn;
                    that.conn.use(that.dbName);
                    callback(null,_conn);
                }

            })
    }else{
        callback(null,that.conn);
    }
}

mongodbProxy.prototype.tableList = function(callback){
    var that = this;

    if(!that.conn){
        callback("proxy not init connection!");
        return;
    }

    self.r.db(that.dbName).tableList().run(that.conn,function(err,result){
        if(err){
            logger.error(err);
            callback(err);
        }else{
            callback(null,result);
        }

    });
}

mongodbProxy.prototype.dbList = function(callback){
    var that = this;

    if(!that.conn){
        callback("proxy not init connection!");
        return;
    }

    self.r.dbList().run(that.conn,function(err,result){
        if(err){
            logger.error(err);
            callback(err);
        }else{
            callback(null,result);
        }

    });
}

mongodbProxy.prototype.db = function(dbName){
    this.dbName = dbName;
}


function RethinkdbProxy(dbName){
    this.dbName = dbName;
}

module.exports = RethinkdbProxy();
