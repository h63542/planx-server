var assert = require("assert"),
    async = require ('async'),
    env = require("./../../src/env"),
    mysql = require('mysql'),
    nosqlProxyFC = require("./../../src/db/dataProxyFC"),
    nosqlProxy = nosqlProxyFC.getNoSqlProxy(nosqlProxyFC.C.DEFAULT_NOSQLDB),

sinon = require("sinon");

var del = require("./../../src/graph/delete");
describe('Graph delete', function(){
    var enterpriseId;
    before(function(){
    });
    after(function(){

    });

    describe('#delete data', function(){
        it('delete by ID', function(done){
            //构造删除数据
            nosqlProxy.query("department",{},null,null,null,function(record){
                return true;
            },function(err,rows){
                if(err){
                    throw err;
                }
                if(rows.length>0){
                    var delId = rows[0].id;
                    dodel(delId);
                }
            });

            function dodel(delId){
                var req = {
                    params : {
                        id:delId
                    }
                };
                var res = {
                    end:function(result){
                        done();
                        console.log(result);
                        assert(result == delId)
                    },
                    getHeader:function(){

                    },
                    setHeader:function(){

                    }
                }
                var next = {

                }
                //提交数据
                del.do(req,res,next);
            }

        });
//        it('delete by relation', function(done){
//            nosqlProxy.query("department",{},null,null,null,function(record){
//                return true;
//            },function(err,rows){
//                if(err){
//                    throw err;
//                }
//                if(rows.length>0){
//                    var delId = rows[0].id;
//                    var enterpriseId = rows[0].enterprise[0].id;
//                    dodel(enterpriseId,delId);
//                }
//            });
//
//            function dodel(enterpriseId,delId){
//
//                var req = {
//                    params : {
//                        masterId:enterpriseId,
//                        subId:delId,
//                        relation:"department"
//                    },
//                    getHeader:function(){
//
//                    },
//                    setHeader:function(){
//
//                    }
//                };
//                var res = {
//                    end:function(result){
//                        done();
//                        console.log(result);
//                        assert(result == delId)
//                    },
//                    getHeader:function(){
//
//                    },
//                    setHeader:function(){
//
//                    }
//                }
//                var next = {
//
//                }
//                //提交数据
//                del.do(req,res,next);
//            }
//
//        });
    });
})
