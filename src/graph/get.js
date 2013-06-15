/**
 * Created with JetBrains WebStorm.
 * User: huangzhi
 * Date: 13-6-1
 * Time: 下午2:52
 * To change this template use File | Settings | File Templates.
 */
var nosqlProxy = require("./../db/nosqlProxy"),
    logger = require("../logger").getLogger(),
    async = require ('async'),
    _ = require("underscore"),
    base = require("./base"),
    self = this;
function Action(){
}
Action.prototype.do = function(req, res, next){
    var that = this;
    var params = req.params;
    //查询关系
    //查出id对象对应的relation列表
    //再更具relation列表查出relation对象对应的详细信息
    var queryBeginTime = (new Date()).getTime();
    if(params.id && params.relation){

        //查询主对象表
        //查询主对象
        //过滤出主对象param.relation字段关联的数据
        var getMasterRecord = base.getRecordByID;

        var queryRouter = function(callback){
            base.queryRouter.call(that,params.id,callback);

        };
        async.waterfall(
            [base.initDBConn,queryRouter,getMasterRecord,querySubRecord],
            function(err,records){
                if(err){
                    console.log(err.stack);
                    doResopnse(req,res,err);
                }else{
                    doResopnse(req,res,records);
                }
            }
        );

        function querySubRecord(masterTable,masterRecord,callback){
            nosqlProxy.query(params.relation,function(record){
                return true;
            },function(err,result){
                result = _.filter(result,function(record){
                    var relationDatas = record[masterTable];
                    for(var i=0;i<relationDatas.length;i++){
                        if(relationDatas[i].id == params.id){
                            return true;
                        }
                    }
                    return false;
                });
                if(err){
                    doError(callback,err)
                }else{
                    callback(null,result);
                }
            })
        }

        function filterRecord(masterRecord,callback){
            var relationDatas = masterRecord[params.relation];
            if(!relationDatas || relationDatas.length<=0){
                callback(null,[]);
                return;
            }
            nosqlProxy.query(params.relation,function(record){
                return true;
            },function(err,result){

                result = _.filter(result,function(record){
                    for(var i=0;i<relationDatas.length;i++){
                        if(relationDatas[i].id == record["id"]){
                            return true;
                        }
                    }
                    return false;
                });
                if(err){
                    doError(callback,err)
                }else{
                    callback(null,result);
                }
            })
        }
    }
    //查询ID
    else if(params.id){
        //从router表中查找表信息和分区信息
        //从对应的表和分区中查找对象信息
        var getMasterRecord = base.getRecordByID;
        var queryRouter = function(callback){
            base.queryRouter.call(that,params.id,callback);
        };
        async.waterfall(
            [base.initDBConn,queryRouter,getMasterRecord,getAntidependences],
            function(err,record){
                if(err){
                    logger.error(err);
                    logger.error(err.stack);
                    doResopnse(req,res,err);
                }else{
                    doResopnse(req,res,record);
                }
            }
        );
    }
    function getAntidependences(masterTable,masterRecord,callback){
        //查询meat表，找出Antidependences,获取关联记录
        nosqlProxy.get(masterTable,"metaTable",function(err,meta){
            if(err){
                doError(callback,err)
                return;
            }
            var antidependences = {};
            async.each(meta.antidependences,getAntiDependencies,function(err){
                if(err){
                    doError(callback,err)
                }else{
                    callback(null,masterRecord);
                }
            })
            function getAntiDependencies(table,callback){
                nosqlProxy.getConn(function(err,conn){
                    nosqlProxy.getR().db('planx_graph_r').tableList().run(conn,function(err,result){
                        if(result.indexOf(table) == -1){
                            callback(null,masterRecord);
                        }else{
                            setAntiDependencies(table,callback);
                        }
                    });
                });
                function setAntiDependencies(tabel,callback){
                    nosqlProxy.query(table,function(record){
                        return true;
                    },function(err,result){
                        if(err){
                            doError(callback,err)
                        }
                        result = _.filter(result,function(record){
                            if(record[masterTable]){
                                for(var i=0;i<record[masterTable].length;i++){
                                    if(record[masterTable][i].id == params.id){
                                        return true;
                                    }
                                }
                            }
                            return false;
                        });

                        if(result.length>0){
                            var tmp = [];
                            for(var j=0;j<result.length;j++){
                                tmp.push({
                                    id:result[j].id,
                                    name:result[j].name,
                                    _pinyin_name:result[j]._pinyin_name?result[j]._pinyin_name:"",
                                    subordinate:true
                                })
                            }
                            antidependences[tabel] = tmp;
                            _.extend(masterRecord,antidependences);
                            callback(null,masterRecord);
                        }else{
                            //允许删除
                            callback(null,masterRecord);
                        }
                    });
                }

            }
        });
    }

}

module.exports = new Action();
