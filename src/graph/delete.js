/**
 * Created with JetBrains WebStorm.
 * User: huangzhi
 * Date: 13-6-1
 * Time: 下午2:52
 * To change this template use File | Settings | File Templates.
 */
var dataProxyFC = require("./../db/dataProxyFC"),
    nosqlProxy = dataProxyFC.getNoSqlProxy(dataProxyFC.C.DEFAULT_NOSQLDB),
    mysqlProxy = dataProxyFC.getSqlProxy(dataProxyFC.C.DEFAULT_SQLDB),
    async = require ('async'),
    logger = require("../logger").getLogger(),
    self = this,
    _ = require("underscore"),
    base = require("./base");
function Action(){

}

Action.prototype = base;

Action.prototype.do = function(req, res, next){
    var params = req.params;
    var that = this;
    var deleteId;
    //删除两个对象之间的关系
    if(params.masterId && params.relation && params.subId){
        //查找主ID表信息
        //查询从ID表信息
        //判断是否能够删除
        //更新主对象信息
        //更新从对象信息关系信息
        deleteId = params.subId;
        var queryRouter = function(callback){
            base.queryRouter.call(that,deleteId,callback);
        };
        var getSubRecord = base.getRecordByID;
        async.waterfall(
            [base.initDBConn,queryRouter,getSubRecord,updateSubRecord],
            function(err,newRecord){
                if(err){
                    doResopnse(req,res,records);
                }else{
                    doResopnse(req,res,deleteId);
                }
            }
        );
        function updateSubRecord(table,record,callback){
            var  relationArray = record[params.relation];
            if(relationArray && Object.prototype.toString.call(relationArray) === '[object Array]'){
                for(var i=0;i<relationArray.length;i++){
                    if(relationArray[i][id] == params.masterId){
                        relationArray = relationArray.splice(i,1);
                    }
                }
            }
            var updateData = {};
            updateData[params.relation] =   relationArray;
            nosqlProxy.update(deleteId,table,updateData,function(err,updateResult){
                if(err){
                    doError(callback,err);
                }else{
                    //输出响应信息
                    callback(null,table);
                }
            });

        }

    }
    //查询ID
    else if(params.id){
        //从router表中查找表信息和分区信息
        //从对应的表和分区中查找对象信息
        deleteId = params.id;
        var queryRouter = function(callback){
            base.queryRouter.call(that,params.id,callback);
        };
        async.waterfall(
            [base.initDBConn,queryRouter,adjustDendency,deleteSubRecord],
            function(err,result){
                if(err){
                    doResopnse(req,res,err);
                }else{
                    //删除路由信息
                   mysqlProxy.deleteRouter(deleteId,function(err,result){
                       if(err){
                           doResopnse(req,res,err);
                       }else{
                           doResopnse(req,res,deleteId);
                       }
                   })

                }
            }
        );
    }
    //分解步骤   实现错误，再实现
    function adjustDendency(masterID,masterTable,callback){
        //如果有被其他数据关联则不允许删除
        //查找元数据表，找到当前与table有关联关系的表
        nosqlProxy.get(masterTable,"metaTable",function(err,meta){
            if(err){
                doError(callback,err)
            }
            //遍历meta.antidependences,看这表是否有数据引用masterID，否在不允许删除
            nosqlProxy.query(meta.id,{},null,null,null,function(record){
                if(record[subTable]){
                    for(var i=0;i<record[subTable].length;i++){
                        if(record[subTable][i].id == params.subId){
                            return true;
                        }
                    }
                }
                return false;
            },function(err,result){
                if(err){
                    doError(callback,err)
                }
                if(result.length>0){
                    //不允许删除
                    callback({code:403});
                }else{
                    //允许删除
                    callback(null,masterTable,subTable);
                }
            });
        });
    }
    //删除字表记录
    function deleteSubRecord(masterTable,subTable,callback){
        nosqlProxy.delete(deleteId,subTable,function(err){
            if(err){
                doError(callback,err)
            }else{
                //删除成功
                callback(null,masterTable,subTable);
            }
        })
    }
}


module.exports = new Action();
