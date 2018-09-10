module.exports = {
    rethinkdb: {
        host: process.env.DB_HOST || "127.0.0.1",
        port: process.env.DB_PORT || 28015,
        db: process.env.DB_NAME || 'UserlogInformation'
    },
    tables:
    [{
        table: "userlog",
        id: "uId"
    }]
}