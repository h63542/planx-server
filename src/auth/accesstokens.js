var tokens = {};


exports.find = function(key, done) {
  var token = tokens[key];
  return done(null, token);
};

exports.save = function(token, userID, clientID, done) {
  tokens[token] = { userID: userID, clientID: clientID };
  return done(null);
};


//增加轮训检查token超时，如果超时则设置token超时标记，并延迟删除token