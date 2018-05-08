var model = require('./model');
exports.test=function(query,userinfo,fn){
    global.db.query('select * from users',function(data){
        console.log(data)
        fn(data[0])
    });
    
}
