var assert = require("assert"),
    async = require ('async'),
    env = require("./../../src/env"),
    mysql = require('mysql'),
    nosqlProxy = require("./../../src/db/nosqlProxy"),
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
            //构造删除数据
            nosqlProxy.query("department",function(record){
                return true;
            },function(err,rows){
                if(err){
                    throw err;
                }
                if(rows.length>0){
                    var delId = rows[0].id;
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
                        assert(JSON.parse(result).id == delId)
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
