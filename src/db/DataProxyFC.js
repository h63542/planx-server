var mongodbProxyC = require("./mongodbProxy");
var mysqlProxyC = require("./mysqlProxy");

var nosqlproxyCache = {
}
var sqlproxyCache = {
}

module.exports = {
    "getNoSqlProxy":function(datasource){
        var datasourceTag = datasource.dbserver.host+":"+datasource.dbserver.port+"/"+datasource.dbName;
        if(!nosqlproxyCache[datasourceTag]){
            nosqlproxyCache[datasourceTag] =  new mongodbProxyC(datasource);
        }
        return  nosqlproxyCache[datasourceTag];
    },
    "getSqlProxy":function(datasource){
        var datasourceTag = datasource+":"+datasource.dbserver.port+"/"+datasource.dbName;
        if(!sqlproxyCache[datasourceTag]){
            sqlproxyCache[datasourceTag] =  new mysqlProxyC(datasource);
        }
        return  sqlproxyCache[datasourceTag];
    },
    C:{
        "DEFAULT_NOSQLDB":{
            "dbName":"planx_graph_r",
            dbserver:{
                host     : '127.0.0.1',
                port     : 27017,
                option:{
                    auto_reconnect:true ,
                    poolSize:5
                }
            }
        },
        "DEFAULT_SQLDB":{
            "dbName":"planx_graph",
            dbserver:{
                host     : '127.0.0.1',
                port     : 3306,
                user     : 'root',
                password : '983711'
            }
        }
    }
};
