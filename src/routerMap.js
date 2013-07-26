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
var oauth2 = require('./auth/oauth2'),
    login = require("./auth/login"),
    user = require('./auth/user'),
    passport = require('passport');


function initRouter(router){
    router.get('/favicon.ico', function(req,res,next){
        res.end("");
    });
    initAuthRouter();

    router.get('/:id',passport.authenticate('bearer', { session: false }), graphGet);
    router.get('/:id/:relation',passport.authenticate('bearer', { session: false }),graphGet);
    router.delete('/:id', graphDelete);
    router.delete('/:masterId/:relation/:subId', graphDelete);
    router.post('/:id/:relation', graphPost);
    router.post('/:table', graphPost);
    router.put('/:id',graphPut);

    function initAuthRouter(){
        router.get('/', login.index);
        router.get('/login', login.loginForm);
        router.post('/login', login.login);
        router.get('/logout', login.logout);
        router.get('/account', login.account);
        router.get('/login/authorize', login.authlogin);
        router.get('/dialog/authorize', oauth2.authorization);
        router.post('/dialog/authorize/decision', oauth2.decision);
        router.get('/dialog/authorize/decision', oauth2.decision);
        router.post('/oauth/token', oauth2.token);
        router.get('/api/userinfo', user.info);
        router.get('/api/validate', user.validate);
    }
}

module.exports = {initRouter:initRouter};