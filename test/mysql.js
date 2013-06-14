var assert = require("assert"),
    mysql = require('mysql'),
    async = require("async"),
    mysqlProxy = require("../src/db/mysqlProxy");
describe('Mysql', function(){

    describe('#getUniqueId()', function(){
        it('should return Unique ID', function(done){
            global.nodeID = 1;
            mysqlProxy.getUniqueId(function(err,id){
                done();
                assert.equal(1,1);
            });
        })
    });


    describe('#updateRouter()', function(){
        before(function(){
        });
        after(function(){
            //删除测试数据
        })

        it('should return TestTable', function(done){
            async.waterfall([mysqlProxy.getUniqueId,addTestData,mysqlProxy.queryRouter],function(err,result){
                if(err){
                   throw err;
                }
                done();
                assert(result == "testTable");
            });

            function addTestData(id,callback){
                mysqlProxy.updateRouter(id,"testTable",function(err){
                    callback(err,id);
                });
            }
        })
    });

})

