/**
 * Created with JetBrains WebStorm.
 * User: huangzhi
 * Date: 13-6-1
 * Time: 下午2:52
 * To change this template use File | Settings | File Templates.
 */
var nosqlProxy = require("./../db/nosqlProxy"),
    logger = require("../logger").getLogger(),
    async = require("async"),
    _ = require("underscore"),
    base = require("./base"),
    self = this;
function Action(){
}

Action.prototype.do = function(req, res, next){
    var params = req.params,
        putData = req.body;
    if(params.id){
        //获取ID对应的表信息
        //更新表数据
        var queryRouter = base.queryRouter;
        async.waterfall(
            [base.initDBConn,queryRouter,updateRecord,getNewRecord],
            function(err,newRecord){
                if(err){
                    doResopnse(res,err);
                }else{
                    doResopnse(res,newRecord);
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
            nosqlProxy.get(id,table,function(err,record){
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
