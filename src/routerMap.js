/**
 * Created with JetBrains WebStorm.
 * User: huangzhi
 * Date: 13-6-10
 * Time: 下午9:39
 * To change this template use File | Settings | File Templates.
 */

var graphGet = require("./graph/get").do,
    graphDelete = require("./graph/delete").do,
    graphPost = require("./graph/post").do,
    graphPut = require("./graph/put").do;

function initRouter(router){
    router.get('/favicon.ico', function(req,res,next){

    });
    router.get('/:id', graphGet);
    router.get('/:id/:relation',graphGet);
    router.delete('/:id', graphDelete);
    router.delete('/:masterId/:relation/:subId', graphDelete);
    router.post('/:id/:relation', graphPost);
    router.post('/:table', graphPost);
    router.put('/:id',graphPut);
}

module.exports = {initRouter:initRouter};