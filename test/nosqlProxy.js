var assert = require("assert"),
    async = require ('async');

describe('DataBaseUtilTest', function(){
    var dataProxyFC = require("./../src/db/dataProxyFC");
    var testBase = {
        "dbName":"TestBase",
        dbserver:{
            host     : '127.0.0.1',
            port     : 27017,
            option:{
                auto_reconnect:true ,
                poolSize:5
            }
        }
    };
    var nosqlProxy = dataProxyFC.getNoSqlProxy(testBase),
        mysqlProxy = dataProxyFC.getSqlProxy(dataProxyFC.C.DEFAULT_SQLDB);

    var conn;
    before(function(done){
        var getConn = function(callback){
            nosqlProxy.getConn(function(err,_conn){
                if(!conn){
                    conn = _conn;
                }
                callback(null);
            });
        }
        var createDb = function(callback){
            nosqlProxy.dbCreate({},function(err,result){
                if(err){
                    throw err;
                }
                callback(null);
            });
        }
        var createTable = function(callback){
            nosqlProxy.tableList(function(err,tableList){
                if(tableList.indexOf("dc_universe")!=-1){
                    callback(null);
                }else{
                    nosqlProxy.tableCreate("dc_universe",{},function(result){
                        callback(null);

                    })
                }
            });
        }
        var insertData = function(callback){
            var testData = {
                name:"testName",
                value:"testValue"
            }
            nosqlProxy.insert('dc_universe',testData,function(err,result){
                console.log(result);
                if(err){
                    throw err;
                }
                callback(null,"finish!");
            })
        }
        async.waterfall([
            getConn,createDb,createTable,insertData
        ], function (err, result) {
            // result now equals 'done'
            console.log(result);
            done();
        });
    });
    after(function(){
//            r.dbDrop('TestBase').run(conn, function(err,result){
//                if(err){
//                    throw err;
//                }})
        }
    );
})
