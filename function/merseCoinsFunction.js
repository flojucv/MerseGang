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
module.exports.strRandom = function(o) {
    var a = 10,
        b = 'abcdefghijklmnopqrstuvwxyz',
        c = '',
        d = 0,
        e = ''+b;
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
module.exports.getRandomInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * 
 * @param {int} position La position du compte dans le tableau des comptes.
 * @param {*} addMerseCoins Le nombre de merseCoins que l'on souhaite ajouter.
 */
module.exports.addMerseCoins = function(position, addMerseCoins) {
  const bddCompte = require("../bdd/compte.json");
  const bddGrade = require("../bdd/grade.json");
  const compte = bddCompte[position];
  bddGrade.forEach((options) => {
    if(options.nomGrade === compte.grade) {
      const calcul = addMerseCoins*options.multiplicateur;
      compte.MerseCoins += parseInt(Math.round(calcul));
      saveBdd("compte", bddCompte);
    }
  })
}

module.exports.trouverCompteViaTwitch = async function(pseudoTwitch) {
  const bddCompte = require("../bdd/compte.json");
  let positionFinal = -1;


  await bddCompte.forEach((compte, position) => {
    if(compte.pseudoTwitch === pseudoTwitch.toLowerCase()) {
      positionFinal = position;
    }
  })

  return positionFinal;

}

module.exports.trouverCompteViaDiscord = async function(idDiscord) {
  const bddCompte = require("../bdd/compte.json");
  let positionFinal = -1;

  await bddCompte.forEach((compte, position) => {
    if(compte.idDiscord === idDiscord) {
      positionFinal = position;
    }
  })

  return positionFinal;
}