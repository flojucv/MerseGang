/**
 * 
 * @param {*} channel le channel twitch correspondant au message de log
 * @returns Retourne l'heure et la minute ainsi que le channel twitch
 */
module.exports.msgLog = (channel) => {
    const date = new Date()

    let heure = date.getHours();
    let minute = date.getMinutes();

    if (minute < 10)
        minute = `0${minute}`;
    if (heure < 10)
        heure = `0${heure}`;
    return `[${heure}:${minute}] info: [${channel}]`
}

/**
 * 
 * @param {String} fileName le nom du fichier.
 * @param {number} length La longueur du fichier max.
 * @returns Le nom du fichier a afficher
 */
module.exports.logFile = (fileName, length) => {
    let fName = ""
    if (fileName.length > (length+3))
        fName = `${fileName.substring(0, length)}...`
    else {
        fName = `${fileName}`;
        for (let i = fileName.length; i < (length+3); i++) {
            fName += ' ';
        }
    }

    return fName;
}