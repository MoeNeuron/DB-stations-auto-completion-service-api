"use strict";
exports.__esModule = true;
var fs = require("fs");
var csvParser = require("csv-parser");
var filePath = "./D_Bahnhof_2016_01_alle.csv";
var getStations = function () {
    return new Promise(function (resolve, reject) {
        var stations = [];
        var readableStream = fs.createReadStream(filePath, "utf-8");
        readableStream
            .pipe(csvParser({
            separator: ";",
            mapHeaders: function (_a) {
                var header = _a.header;
                return header.trim();
            }
        }))
            .on("data", function (data) {
            var EVA_NR = data.EVA_NR, DS100 = data.DS100, NAME = data.NAME, VERKEHR = data.VERKEHR, LAENGE = data.LAENGE, BREITE = data.BREITE;
            var station = {
                EVA_NR: EVA_NR,
                DS100: DS100,
                NAME: NAME,
                VERKEHR: VERKEHR,
                LAENGE: LAENGE,
                BREITE: BREITE
            };
            stations.push(station);
        })
            .on("end", function () {
            console.log("CSV file parsing completed.");
            resolve(stations);
        })
            .on("error", function (error) {
            console.error("An error occurred while parsing the CSV file:", error);
            reject(error);
        });
    });
};
exports["default"] = getStations;
