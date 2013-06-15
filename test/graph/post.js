var assert = require("assert"),
    async = require ('async'),
    env = require("./../../src/env"),
    mysql = require('mysql'),
    nosqlProxy = require("./../../src/db/nosqlProxy"),
    sinon = require("sinon");
global.nodeID = 1;

var post = require("./../../src/graph/post");
describe('DataBaseUtilTest', function(){
    var enterpriseId;
    before(function(done){
        initEnterprise(function(err,id){
            enterpriseId = id;
            done();
        });
    });
    after(function(){

    });

    describe('#post data', function(){
        it('should return newRecord', function(done){
            //制作Stub,准备提交数据
            //判断是否存在企业数据，如果不存在，新增
            var req = {
                params : {
                    id:enterpriseId,
                    relation:"department"
                },
                body:{
                   "name":"美容部"
                },
                getHeader:function(){
                    return "";
                },
                setHeader:function(){

                }
            };
            var res = {
                end:function(msg){
                    done();
                    assert(JSON.parse(msg).name == "美容部")
                },
                getHeader:function(){
                    return "";
                },
                setHeader:function(){

                }
            }
            var next = {

            }
            //提交数据
            post.do(req,res,next);
        })
    });
})
function initEnterprise(callback){
    nosqlProxy.getConn(function(err,conn){
        nosqlProxy.getR().table("enterprise").filter(function(record){return true}).run(conn,function(err,row){
            if(err){
                throw err;
            }
            row.toArray(function(err, result) {
                if(err) {
                    debug("[ERROR] %s:%s\n%s", err.name, err.msg, err.message);
                    res.send([]);
                }
                if(result.length > 0){
                    callback(null,result[0].id);
                }else{
                    var req = {
                        params : {
                            table:"enterprise"
                        },
                        body:{
                            "name":"名轩美容美发中心"
                        },
                        getHeader:function(){
                            return "";
                        },
                        setHeader:function(){

                        }
                    };
                    var res = {
                        end:function(msg){
                            console.log(msg);
                            callback(null,msg);
                        },
                        getHeader:function(){
                            return "";
                        },
                        setHeader:function(){

                        }
                    }
                    var next = {

                    }
                    //插入测试企业数据
                    post.do(req,res,next);
                }
            });
        });

    });
}
