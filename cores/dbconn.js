const Sequelize = require('sequelize');
const strdb1 = new Sequelize('test', 'test', '123', {
    host: 'localhost',
    dialect: 'mysql'
});
exports.condb1 = function (str) {
    strdb1
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
        const User = strdb1.define('user', {
            firstName: {
              type: Sequelize.STRING
            },
            lastName: {
              type: Sequelize.STRING
            }
          });
          User.sync({force: true}).then(() => {
            // Table created
            return User.create({
              firstName: 'John1',
              lastName: 'Hancock1'
            });
          });
          console.log(1)
}
exports.query=function(str,cb){
    strdb1.query(str).then(function(projects) {
            console.log(projects[0]);
        cb(projects[0]);
    })
}