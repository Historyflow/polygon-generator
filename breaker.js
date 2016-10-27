function breaker(number, count, pieces, randomMax, randomMin) {
  if (!randomMax) randomMax = 86400000 * 365 * 9;
  if (!randomMin) randomMin = 86400000 * 365 * 2;

  var defaultPiece = Math.round(number / count);
  var newPiece;

  if (Math.round(Math.random())) {
    newPiece = defaultPiece + Math.round(Math.random() * (randomMax - randomMin) + randomMin);
  } else {
    newPiece = defaultPiece - Math.round(Math.random() * (randomMax - randomMin) + randomMin);
  }

  if (Math.abs(newPiece) >= Math.abs(number)) {
    pieces.push(number);
  } else {
    number = number - newPiece;
    pieces.push(number - newPiece);
    count--;

    if (count > 0) {
      breaker(number, count, pieces, randomMax, randomMin);
    }
  }
}

module.exports = breaker;
