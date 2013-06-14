/**
 * Created with JetBrains WebStorm.
 * User: huangzhi
 * Date: 13-6-1
 * Time: 下午6:47
 * To change this template use File | Settings | File Templates.
 */

var Migration = require("./db/migration"),
    env = require("./env");
var m = new Migration("src/db/schema");
m.migration("V1",function(err){
    m.migration("V1_2",function(err){

    });
});



