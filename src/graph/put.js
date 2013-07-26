/**
 * Created with JetBrains WebStorm.
 * User: huangzhi
 * Date: 13-6-1
 * Time: 下午2:52
 * To change this template use File | Settings | File Templates.
 */
var nosqlProxyFC = require("./../db/dataProxyFC"),
    nosqlProxy = nosqlProxyFC.getNoSqlProxy(nosqlProxyFC.C.DEFAULT_NOSQLDB),

    logger = require("../logger").getLogger(),
    async = require("async"),
    _ = require("underscore"),
    base = require("./base"),
    self = this;
function Action(){
}

Action.prototype.do = function(req, res, next){
    var params = req.params,
        putData = req.body,
        that = this;
    if(params.id){

        var updateId = params.id;
        //获取ID对应的表信息
        //更新表数据
        var queryRouter = function(callback){
            base.queryRouter.call(that,params.id,callback);
        };

        async.waterfall(
            [base.initDBConn,queryRouter,updateRecord,getNewRecord],
            function(err,newRecord){
                if(err){
                    doResopnse(req,res,err);
                }else{
                    doResopnse(req,res,newRecord);
                }
            }
        );

        function updateRecord(id,table,callback){
            nosqlProxy.update(id,table,putData,function(err,updateResult){
                if(err){
                    doError(callback,err);
                }else{
                    //输出响应信息
                    callback(null,table);
                }
            });
        }

        function getNewRecord(table,callback){
            nosqlProxy.get(updateId,table,function(err,record){
                if(err){
                    doError(callback,err)
                }else{
                    callback(null,record);
                }
            })
        }
    }
}

module.exports = new Action();
