var assert = require("assert"),
    async = require ('async'),
    env = require("./../../src/env"),
    mysql = require('mysql'),
    nosqlProxyFC = require("./../../src/db/dataProxyFC"),
    nosqlProxy = nosqlProxyFC.getNoSqlProxy(nosqlProxyFC.C.DEFAULT_NOSQLDB),
    sinon = require("sinon");

describe('Graph get', function(){
    var enterpriseId;
    before(function(){
    });
    after(function(){

    });


    describe('#get', function(){
        var get = require("./../../src/graph/get");

        it('get by ID', function(done){
            //构造删除数据

            nosqlProxy.query("enterprise",{},null,null,null,function(record){
                return true;
            },function(err,rows){
                if(err){
                    throw err;
                }
                if(rows.length>0){
                    var getId = rows[0].id;
                    doGet(getId);
                }else{
                    console.log("enterprise table no data");
                    assert(false);
                    done();
                }
            });
            function doGet(getId){
                var req = {
                    params : {
                        id:getId
                    },
                    getHeader:function(){

                    },
                    setHeader:function(){

                    }
                };
                var res = {
                    end:function(result){
                        done();
                        assert(JSON.parse(result).id == getId)
                    },
                    getHeader:function(){

                    },
                    setHeader:function(){

                    }
                }
                var next = {

                }
                //提交数据
                get.do(req,res,next);
            }

        });
    })

    describe('#get', function(){
        var get = require("./../../src/graph/get");
        it('get by relation', function(done){
            //制作Stub,准备提交数据
            //判断是否存在企业数据，如果不存在，新增
            nosqlProxy.query("enterprise",{},null,null,null,function(record){
                return true;
            },function(err,rows){
                if(err){
                    throw err;
                }
                if(rows.length>0){
                    var getId = rows[0].id;
                    doGet(getId);
                }else{
                    console.log("enterprise table no data");
                    assert(false);
                    done();
                }
            });
            function doGet(getId){
                var req = {
                    params : {
                        id:getId,
                        relation:"department"
                    },
                    getHeader:function(){

                    },
                    setHeader:function(){

                    }

                };
                var res = {
                    end:function(result){
                        done();
                        assert(JSON.parse(result)[0].enterprise[0].id == getId)
                    } ,
                    getHeader:function(){

                    },
                    setHeader:function(){

                    }
                }
                var next = {

                }
                //提交数据
                get.do(req,res,next);
            }
        });
    });
})
