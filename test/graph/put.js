var assert = require("assert"),
    async = require ('async'),
    env = require("./../../src/env"),
    mysql = require('mysql'),
    _ = require("underscore"),
    nosqlProxyFC = require("./../../src/db/dataProxyFC"),
    nosqlProxy = nosqlProxyFC.getNoSqlProxy(nosqlProxyFC.C.DEFAULT_NOSQLDB),
    sinon = require("sinon");

var put = require("./../../src/graph/put");
describe('Graph delete', function(){
    var enterpriseId;
    before(function(){
    });
    after(function(){

    });

    describe('#update data', function(){
        it('update by ID', function(done){
            var oldCount = 0;
            //构造删除数据
            nosqlProxy.query("department",{},null,null,null,function(record){
                return true;
            },function(err,rows){
                if(err){
                    throw err;
                }
                if(rows.length>0){
                    var delId = rows[0].id;

                    var newRecord = rows[0];

                    if(!newRecord.updateCount || !_.isNumber(newRecord.updateCount)){
                        newRecord.updateCount = 1;
                    }else{
                        oldCount = newRecord.updateCount;
                        newRecord.updateCount = newRecord.updateCount+1;
                    }


                    doupdate(delId,rows[0]);
                }
            });

            function doupdate(delId,record){
                var req = {
                    params : {
                        id:delId
                    },
                    body:record,
                    getHeader:function(){

                    },
                    setHeader:function(){

                    }
                };
                var res = {
                    end:function(result){
                        done();
                        assert(JSON.parse(result).updateCount == oldCount+1)
                    },
                    getHeader:function(){

                    },
                    setHeader:function(){

                    }
                }
                var next = {

                }
                //提交数据
                put.do(req,res,next);
            }

        });
    });
})
