const db = require('./db');

/**
 * 
 * @param {Object} o Un objet json contenant au maximum les paramètres suivant : {
                                                                                    includeUpperCase: true,
                                                                                    includeNumbers: true,
                                                                                    length: 5,
                                                                                    startsWithLowerCase: true
                                                                                 }
 * @returns {String} Une chaine de caractère aléatoire.
 */
module.exports.strRandom = (o) => {
  var a = 10,
    b = 'abcdefghijklmnopqrstuvwxyz',
    c = '',
    d = 0,
    e = '' + b;
  if (o) {
    if (o.startsWithLowerCase) {
      c = b[Math.floor(Math.random() * b.length)];
      d = 1;
    }
    if (o.length) {
      a = o.length;
    }
    if (o.includeUpperCase) {
      e += b.toUpperCase();
    }
    if (o.includeNumbers) {
      e += '1234567890';
    }
  }
  for (; d < a; d++) {
    c += e[Math.floor(Math.random() * e.length)];
  }
  return c;
}

/**
 * 
 * @param {int} min Le nombre minimum (inclus) pour l'intervale de valeur.
 * @param {int} max Le nombre maximum (exclus) pour l'intervale de valeur.
 * @returns {int} Un nombre aléatoire compris entre le minimum (inclus) et le maximum (exclus).
 */
module.exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * 
 * @param {string} id L'id de l'utilisateur.
 * @param {*} addMerseCoins Le nombre de merseCoins que l'on souhaite ajouter.
 * @param {boolean} multiplicateur true si le multiplicateur doit être appliquer, false ou rien si il ne doit pas être appliqué
 * @param {twitch | discord} plateforme La plateforme de l'utilisateur (twitch ou discord).
 */
module.exports.addMerseCoins = async (id, addMerseCoins, multiplicateur = false, plateforme = "twitch") => {

  let sqlCompte = "SELECT * FROM compte INNER JOIN grade ON compte.grade = grade.id_grade";
  sqlCompte += (plateforme == "twitch") ? " WHERE twitch = ?" : " WHERE discord = ?";
  const response = await db.query(sqlCompte, [id]);

  if (multiplicateur === true && response.length != 0) {
    const calcul = addMerseCoins * response[0].multiplicateur;

    if(response[0].mariage != null) {
      let sql = "UPDATE compte SET mersecoins = mersecoins+? ";
      sql += (plateforme == "twitch") ? " WHERE twitch = ? OR twitch = ?" : " WHERE discord = ? OR twitch = ?";
      await db.query(sql, [parseInt(calcul), id, response[0].mariage]);
    } else {
      let sql = "UPDATE compte SET mersecoins = mersecoins+?";
      sql += (plateforme == "twitch") ? " WHERE twitch = ?" : " WHERE discord = ?";
      await db.query(sql, [parseInt(calcul), id]);
    }

    return Math.floor(calcul);

  } else if(response.length != 0) {
    if(response[0].mariage != null) {
      let sql = "UPDATE compte SET mersecoins = mersecoins+?";
      sql += (plateforme == "twitch") ? " WHERE twitch = ? OR twitch = ?" : " WHERE discord = ? OR twitch = ?";
      await db.query(sql, [parseInt(addMerseCoins), id, response[0].mariage]);
    } else {
      let sql = "UPDATE compte SET mersecoins = mersecoins+?";
      sql += (plateforme == "twitch") ? " WHERE twitch = ?" : " WHERE discord = ?";
      await db.query(sql, [parseInt(addMerseCoins), id]);
    }

    return Math.floor(addMerseCoins);
  }
}

/**
 * 
 * @param {string} id L'id de l'utilisateur.
 * @param {twitch | discord} plateforme La plateforme de l'utilisateur (twitch ou discord).
 * @returns {int | undefined} Le nombre de merseCoins de l'utilisateur ou undefined si l'utilisateur n'existe pas.
 */
module.exports.getMerseCoins = async (id, plateforme="discord") => {
  let sql = "SELECT mersecoins FROM compte";
  sql += (plateforme == "discord") ? " WHERE discord = ?" : " WHERE twitch = ?";

  const response = await db.query(sql, [id]);
  if (response.length != 0) {
    return response[0].mersecoins;
  } else {
    return undefined;
  }
}