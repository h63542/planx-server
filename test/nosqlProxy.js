var assert = require("assert"),
    async = require ('async');
    describe('DataBaseUtilTest', function(){
        var nosqlProxy = require("./../src/db/nosqlProxy");
        var mysqlProxy = require("./../src/db/mysqlProxy");
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
                r.dbList().run(conn, function(err,dbList){
                    if(dbList!=null && dbList.indexOf("TestBase") != -1){
                        callback(null);
                    }else{
                        r.dbCreate('TestBase').run(conn, function(err,result){
                            if(err){
                                throw err;
                            }
                            conn.use("TestBase");
                            callback(null);
                        })
                    }
                });
            }
            var createTable = function(callback){
                r.db('TestBase').tableList().run(conn, function(err,tableList){
                    if(tableList.indexOf("dc_universe")!=-1){
                        r.db('TestBase').tableDrop("dc_universe").run(conn, function(result){
                            r.db('TestBase').tableCreate('dc_universe').run(conn, function(result){
                                callback(null);
                            })
                        });
                    }else{
                        r.db('TestBase').tableCreate('dc_universe').run(conn, function(result){
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
                r.db('TestBase').table('dc_universe').insert(testData)
                    .run(conn, function(err,result){
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

        describe('#get()', function(){
            it('should return original table access info', function(done){

            })
        });
        describe('#update()', function(){
            it('should return original table access info', function(done){

            })
        });
        describe('#delete()', function(){
            it('should return original table access info', function(done){

            })
        });
        describe('#query()', function(){
            it('should return original table access info', function(done){

            })
        });
        describe('#tableCreate()', function(){
            it('should return original table access info', function(done){

            })
        });

    })
