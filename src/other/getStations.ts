import * as fs from "fs";
const csvParser = require("csv-parser");

const filePath = "./D_Bahnhof_2016_01_alle.csv";

export type StationType = {
  EVA_NR: string;
  DS100: string;
  NAME: string;
  VERKEHR: string;
  LAENGE: number;
  BREITE: number;
};

const getStations = () => {
  return new Promise<StationType[]>((resolve, reject) => {
    const stations: StationType[] = [];

    const readableStream = fs.createReadStream(filePath, "utf-8");

    readableStream
      .pipe(
        csvParser({
          separator: ";",
          mapHeaders: ({ header }: { header: string }) => header.trim(),
        })
      )
      .on("data", (data: any) => {
        const { EVA_NR, DS100, NAME, VERKEHR, LAENGE, BREITE } = data;

        const station: StationType = {
          EVA_NR,
          DS100,
          NAME,
          VERKEHR,
          LAENGE,
          BREITE,
        };

        stations.push(station);
      })
      .on("end", () => {
        console.log("CSV file parsing completed.");
        resolve(stations);
      })
      .on("error", (error: Error) => {
        console.error("An error occurred while parsing the CSV file:", error);
        reject(error);
      });
  });
};

export default getStations;
