const fs = require("fs");
const random = require("./geojson-random");
const geojsonExtent = require('geojson-extent');

const breaker = require("./breaker");

const convertDate = (date) => {
  return `${date.getDate() < 10 ? "0"+date.getDate() : date.getDate()}
          -${date.getMonth() < 9 ? "0"+(date.getMonth() + 1) : date.getMonth() + 1}
          -${date.getFullYear()}`;
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

const generateFeatures = (count, bbox, verticles, startDate, endDate) => {
  var polygons = [];
  var periods = periodize(startDate, endDate, count);

  for (let i = 0; i < count; i++) {
    let polygon = random.polygon(1, verticles, 4, bbox).features[0];
    polygon.properties.id = Math.round(Math.random() * 1000);
    polygon.properties.start_date = convertDate(periods[i][0]);
    polygon.properties.end_date = convertDate(periods[i][1]);
    polygon = geojsonExtent.bboxify(polygon);
    polygons.push(polygon);
  }

  return polygons;
}

const generateFeatureCollection = (count, bbox, verticles, startDate, endDate) => {
  var periods = periodize(startDate, endDate, count);
  let collection = random.polygon(count, verticles, 20, bbox);

  collection.features.forEach((feature, index) => {
    feature.properties.id = Math.round(Math.random() * 1000);
    feature.properties.start_date = convertDate(periods[index][0]);
    feature.properties.end_date = convertDate(periods[index][1]);
  });
  collection = geojsonExtent.bboxify(collection);
  return collection;
}

module.exports = function(name, type, count, verticles, bbox, startDate, endDate) {
  if (!name) name = "sample"
  if (!type) type = "polygons";
  if (!count) count = 20;
  if (!bbox) bbox = [68.0, 44.0, 92.0, 35.0];
  if (!verticles) verticles = 50;
  if (!startDate) startDate = new Date("10/13/500");
  if (!endDate) endDate = new Date("2/22/1000");

  if (type === "polygons") {
    var polygons = generateFeatures(count, bbox, verticles, startDate, endDate);
    polygons.forEach(element => {
      fs.writeFileSync(`${element.properties.id}.geojson`, JSON.stringify(element));
      console.log("Generated");
    });
  }
  if (type === "collection") {
    var collection = generateFeatureCollection(count, bbox, verticles, startDate, endDate);
    fs.writeFileSync(`${name}.geojson`, JSON.stringify(collection));
    console.log(`Collection ${name} generated`);
  }
}
