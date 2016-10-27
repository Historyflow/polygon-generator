const random = require("geojson-random");
const fs = require("fs");

const breaker = require("./breaker");

const convertDate = (date) => {
  return `${date.getDate() < 10 ? "0"+date.getDate() : date.getDate()}-${date.getMonth() < 9 ? "0"+(date.getMonth() + 1) : date.getMonth() + 1}-${date.getFullYear()}`;
}

const periodize = (startDate, endDate, count) => {
  var pieces = [];
  breaker(endDate - startDate, count, pieces);
  var dates = pieces.map(element => {
    return new Date(element - (0 - endDate))
  });

  return dates.map((date, index) => {
    if (index === 0) {
      return [startDate, date]
    }
    if (index === dates.length) {
      return [date, endDate]
    }
    return [dates[index - 1], date]
  });
}

const generatePolygons = (count, bbox, startDate, endDate) => {
  var polygons = [];
  var periods = periodize(startDate, endDate, count);

  for (let i = 0; i < count; i++) {
    let polygon = random.polygon(1, 20, 4, bbox).features[0];
    polygon.properties.id = Math.round(Math.random() * 1000);
    polygon.properties.start_date = convertDate(periods[i][0]);
    polygon.properties.end_date = convertDate(periods[i][1]);
    polygons.push(polygon);
  }

  return polygons;
}

module.exports = function() {
  var polygons = generatePolygons(2, [68.0, 44.0, 92.0, 35.0], new Date("10/13/500"), new Date("2/22/1000"));
  polygons.forEach(element => {
    fs.writeFileSync(`${element.properties.id}.geojson`, JSON.stringify(element));
    console.log("Generated");
  });
}
