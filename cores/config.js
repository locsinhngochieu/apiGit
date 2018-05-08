exports.cors = {
    origin: "*"          // Origin cor CORS.
}
exports.db1={
    driver     : "mysql",    // or mariadb
    host       : "localhost",
    port       : "3306",
    username   : "test",
    password   : "123",
    database   : "test",
    pool       : true // optional for use pool directly
}