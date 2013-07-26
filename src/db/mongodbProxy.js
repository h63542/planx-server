/**
 * Created with JetBrains WebStorm.
 * User: huangzhi
 * Date: 13-6-1
 * Time: 下午8:17
 * To change this template use File | Settings | File Templates.
 */
var DBNAME = "planx_graph_r",
    logger = require("../logger").getLogger(),
    mongodb = require("mongodb"),
    _ = require("underscore"),
    MongoClient = require('mongodb').MongoClient,
    self = this;

function mongodbProxy(datasource){
    this.dbName = datasource.dbName;
    this.dbserver = datasource.dbserver;
}


mongodbProxy.prototype.get = function(id,table,callback){
    var that = this;
    if(!that.db){
        this.assertDBState(callback);
        return;
    }

    that.db.collection(table, function(err,collection){
        if(err) {
            logger.error("[ERROR] findById: %s:%s\n%s", err.name, err.msg, err.message);
            callback(err);
        }else{
            collection.findOne({id: id}, function(err, document) {
                if(err) {
                    logger.error("[ERROR] findById: %s:%s\n%s", err.name, err.msg, err.message);
                    callback(err);
                }
                else {
                    callback(null,document);
                }
            });
        }

    });
}

mongodbProxy.prototype.update = function(id,table,record,callback){
    var that = this;
    if(!that.db){
        this.assertDBState(callback);
        return;
    }

    that.db.collection(table, function(err,collection){
        if(err) {
            logger.error("[ERROR] update: %s:%s\n%s", err.name, err.msg, err.message);
            callback(err);
        }else{
            var _id =  record._id;
            delete record._id;
            collection.update({
                    "id": record.id
                },{
                    $set:record
                }
                ,{
                },function(err){
                    if(err) {
                        logger.error("[ERROR] update: %s:%s\n%s", err.name, err.msg, err.message);
                        callback(err);
                    }
                    else {
                        callback(null,record);
                    }
                }
            )
        }
    });
}

mongodbProxy.prototype.insert = function(table,record,callback){
    var that = this;
    if(!that.db){
        this.assertDBState(callback);
        return;
    }

    that.db.collection(table, function(err,collection){
        if(err) {
            logger.error("[ERROR] insert: %s:%s\n%s", err.name, err.msg, err.message);
            callback(err);
        }else{
            collection.insert(record,{
                    safe:true
                },function(err,objects){
                    if(err) {
                        logger.error("[ERROR] insert: %s:%s\n%s", err.name, err.msg, err.message);
                        callback(err);
                    }
                    else {
                        callback(null,objects);
                    }
                }
            )
        }
    });
}


mongodbProxy.prototype.delete = function(id,table,callback){
    var that = this;
    if(!that.db){
        this.assertDBState(callback);
        return;
    }

    that.db.collection(table, function(err,collection){
        if(err) {
            logger.error("[ERROR] delete: %s:%s\n%s", err.name, err.msg, err.message);
            callback(err);
        }else{
            collection.remove(
                {
                    _id: id
                },function(err){
                    if(err) {
                        logger.error("[ERROR] delete: %s:%s\n%s", err.name, err.msg, err.message);
                        callback(err);
                    }
                    else {
                        callback(null,id);
                    }
                }
            )
        }
    });
}

mongodbProxy.prototype.query = function(table,option,page,pageno,sort,filter,callback){
    //TODO 增加缓存机制
    var that = this;
    if(arguments.length < 7 ){
        logger.error("[ERROR] query paramters not enough! current paramters are: %s", arguments.length);
        callback({
            name:"argumentsNotCorrect",
            msg:"query paramters not enough!"
        });
        return;
    }
    this.getConn(doquery);
    function doquery(err,db){
        if(err) {
            logger.error("[ERROR] query: %s:%s\n%s", err.name, err.msg, err.message);
            callback(err);
            return;
        }
        console.log(table);
        that.db.collection(table, function(err,collection){
            if(err) {
                logger.error(err);
                logger.error("[ERROR] query: %s:%s\n%s", err.name, err.msg, err.message);
                callback(err);
            }else{
                var sortField = {};
                if(sort){
                    sortField[sort] = -1;
                }
                if(page && pageno && _.isNumber(page) && _.isNumber(pageno)){
                    collection.find(option).limit(pageno).skip((page-1)*pageno).sort(sortField).toArray(function (err, docs) {
                        if (err) {
                            callback(err, null);
                        }
                        if(filter && typeof(filter)=="function"){
                            callback(null, _.filter(docs,filter));
                        } else{
                            callback(null, docs);
                        }
                    });
                }else{
                    collection.find(option).sort(sortField).toArray(function (err, docs) {
                        if (err) {
                            callback(err, null);
                        }
                        if(filter && typeof(filter)=="function"){
                            callback(null, _.filter(docs,filter));
                        } else{
                            callback(null, docs);
                        }
                    });
                }
             }
        });
    }
}

mongodbProxy.prototype.tableCreate = function(tableName,option,callback){
    var that = this;
    if(!that.db){
        this.assertDBState(callback);
        return;
    }

    that.db.createCollection(tableName, option,function(err, collection){
        if(err){
            console.log(err);
            doError(callback,err);
        }
        else {
            callback(null,tableName);
        }
    });
}

mongodbProxy.prototype.dbCreate = function(option,callback){
    var that = this;
    var mongoserver = new mongodb.Server(this.dbserver.host, this.dbserver.port, this.dbserver.option);
    that.db_connector = new mongodb.Db(that.dbName, mongoserver, {});
    that.db_connector.open(function(err,db){
        if(err){
            logger.error(err);
            throw err;
        }else{
            that.db = db;
            db.on("close", function(error){
                logger.error("Connection to the database was closed!"+error);
            });
            callback(null,db);
        }
    });
}

mongodbProxy.prototype.initDBConn = function(callback){
    var that = this;

    that.getConn(function(err,db){
        that.db = db;
        callback(err,db);

    });
}


mongodbProxy.prototype.tableList = function(callback){
    var that = this;
    if(!that.db){
        this.assertDBState(callback);
        return;
    }
    that.db.collectionNames(callback);
}

mongodbProxy.prototype.dbList = function(callback){
    var that = this;
    var adminDb = that.db.admin();
    // List all the available databases
    adminDb.listDatabases(function(err, dbs) {
        if(err) {
            logger.debug("[ERROR] query: %s:%s\n%s", err.name, err.msg, err.message);
            callback(err);
        }else{
            callback(null,dbs.databases);

        }
    });
}

mongodbProxy.prototype.getConn = function(callback){
    var that = this;

    if(!that.db){
        that.dbCreate({},callback);
    }else{
        callback(null,that.db);
    }
}

mongodbProxy.prototype.assertDBState = function(callback){
    logger.error("[ERROR] mongodb's db not init dbName: %s", this.dbName);
    logger.error((new Error()).stack);
    callback({
        name:"dbNotInit",
        msg:"proxy not init connection!"
    });
}



module.exports =  mongodbProxy;