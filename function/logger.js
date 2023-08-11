const { createLogger, format, transports} = require("winston");
var date = new Date();
let month = date.getMonth()+1;
if(month < 10)
    month = `0${month}`;
let jour = date.getDate();
if(jour < 10)
    jour = `0${jour}`;
const dateJour = `${date.getFullYear()}-${month}-${jour}`;


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