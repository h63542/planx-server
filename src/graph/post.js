/**
 * Created with JetBrains WebStorm.
 * User: huangzhi
 * Date: 13-6-1
 * Time: 下午2:52
 * To change this template use File | Settings | File Templates.
 */
var nosqlProxy = require("./../db/nosqlProxy"),
    mysqlProxy = require("../db/mysqlProxy"),
    logger = require("../logger").getLogger(),
    async = require("async"),
    _ = require("underscore"),
    base = require("./base"),
    self = this;
function Action(){
}

Action.prototype.do = function(req, res, next){
    var that = this;
    var params = req.params,
        postData = req.body,
        insertTable;
    if(params.id && params.relation){
        //查找主ID对应的表
        //获取主对象
        //获取新增对象唯一ID
        //插入新增对象
        //更新主对象
        insertTable = params.relation;
        var queryRouter = function(callback){
            base.queryRouter.call(that,params.id,callback);
        };

        var getMasterRecord = base.getRecordByID;

        async.waterfall(
            [base.initDBConn,queryRouter,getMasterRecord,getUniqueId,doInsertNewRecord,updateRouter,updateMasterRecord],
            function(err,newRecord){
                if(err){
                    doResopnse(req,res,err);
                }else{
                    doResopnse(req,res,newRecord);
                }
            }
        );


    }else if(params.table){
        insertTable = params.table;
        function init(callback){
            base.initDBConn(function(err,conn){
               if(err) throw err;
               callback(null,null,null);
            });
        }
        async.waterfall(
            [init,getUniqueId,doInsertNewRecord,updateRouter],
            function(err,newRecord){
                if(err){
                    doResopnse(req,res,err);
                }else{
                    doResopnse(req,res,newRecord);
                }
            }
        );
    }

    /**
     * 获取唯一ID，并更新主对象关系，刷新新增对象信息
     * 如果不是新增关系，mastertable ==null  && masterRecord ==null
     * @params newrecord
     * @params masterRecord
     * @params callback
     */
    function getUniqueId(mastertable,masterRecord,callback){
        mysqlProxy.getUniqueId(function(err,id){
            if(err){
                doError(callback,err)
            }else{
                var newrecord = postData;
                newrecord["id"] = id;

                //2、增加主对象到从对象的关系
                if(masterRecord){
                    //1、增加从对象到主对象的关系
                    if(!newrecord[mastertable]){
                        newrecord[mastertable] = [];
                    }
                    newrecord[mastertable].push({
                        id:masterRecord.id,
                        name:masterRecord.name,
                        _pinyin_name:masterRecord._pinyin_name?masterRecord._pinyin_name:"",
                        subordinate:false
                    })
                }
                callback(null,mastertable,newrecord,masterRecord);
            }
        });
    }
    /**
     * 插入新对象
     * @params newrecord
     * @params masterRecord
     * @params callback
     */
    function doInsertNewRecord(mastertable,newrecord,masterRecord,callback){
        nosqlProxy.insert(insertTable,newrecord,function(err,result){
            if(err){
                doError(callback,err);
            } else{
                callback(null,mastertable,newrecord,masterRecord);
            }
        });
    }
    function updateRouter(mastertable,newrecord,masterRecord,callback){
        mysqlProxy.updateRouter(newrecord.id,insertTable,function(err){
            if(err){
                doError(callback,err);
            } else{
                callback(null,mastertable,newrecord,masterRecord);
            }
        });
    }
    function updateMasterRecord(mastertable,newrecord,masterRecord,callback){
        nosqlProxy.update(masterRecord["id"],mastertable,masterRecord,function(err,updateResult){
            if(err){
                console.log(err);
                // 如果失败记录错误日志，同时删除已经添加的记录
                nosqlProxy.delete(newrecord.id,insertTable,function(err,result){
                    console.log(err);
                    if(err){
                        //如果删除失败，则记录到本地文件标记错误，离线错误处理
                        //TODO
                        doError(callback,err);
                    }else{
                        callback(null,newrecord);
                    }
                })
            }else{
                //输出响应信息
                callback(null,newrecord);
            }
        });
    }
}

module.exports = new Action();
