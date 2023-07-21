const { createLogger, format, transports} = require("winston");
var date = new Date();
const dateJour = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;


const logger = createLogger({
    transports: [
        new transports.Console({
            format: format.simple()
        }),
        new transports.File({
            filename: `./logs/${dateJour}.log`,
            level: "info",
            format: format.combine(format.timestamp(), format.json())
        })
    ]
})

module.exports = logger;