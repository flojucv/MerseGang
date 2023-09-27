const { saveBdd } = require("./bdd");

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
 * @param {int} position La position du compte dans le tableau des comptes.
 * @param {*} addMerseCoins Le nombre de merseCoins que l'on souhaite ajouter.
 * @param {boolean} multiplicateur true si le multiplicateur doit être appliquer, false ou rien si il ne doit pas être appliqué
 */
module.exports.addMerseCoins = async (position, addMerseCoins, multiplicateur = false) => {
  const bddCompte = require("../bdd/compte.json");
  const bddGrade = require("../bdd/grade.json");
  const compte = bddCompte[position];
  if (multiplicateur === true) {
    bddGrade.forEach((options) => {
      if (options.nomGrade === compte.grade) {
        const calcul = addMerseCoins * options.multiplicateur;
        compte.MerseCoins += parseInt(Math.round(calcul));
        saveBdd("compte", bddCompte);
      }
    })
  }else {
    compte.MerseCoins += parseInt(addMerseCoins);
    saveBdd("compte", bddCompte);
  }
}

/**
 * 
 * @param {string} pseudoTwitch Le pseudo twitch de la personne a qui on recherche le compte
 * @returns La position du compte de l'utilisateur dans le bdd
 */
module.exports.trouverCompteViaTwitch = async (pseudoTwitch) => {
  const bddCompte = require("../bdd/compte.json");
  let positionFinal = -1;


  await bddCompte.forEach((compte, position) => {
    if (compte.pseudoTwitch === pseudoTwitch.toLowerCase()) {
      positionFinal = position;
    }
  })

  return positionFinal;

}

/**
 * 
 * @param {int} idDiscord L'id discord de l'utilisateur a qui on recherche le compte
 * @returns La position du compte de l'utilisateur dans la bdd
 */
module.exports.trouverCompteViaDiscord = async (idDiscord) => {
  const bddCompte = require("../bdd/compte.json");
  let positionFinal = -1;

  await bddCompte.forEach((compte, position) => {
    if (compte.idDiscord === idDiscord) {
      positionFinal = position;
    }
  })

  return positionFinal;
}