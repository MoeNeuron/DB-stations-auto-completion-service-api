import * as fs from "fs";
import csvParser from "csv-parser";
import { Station } from "./StationModel";
import { InternalError } from "../errors";

const filePath = "./src/data/stations.csv";

const dataParser = (): Promise<Station[]> => {
  /**
   * The dataParser module is responsible for parsing and retrieving the station data.
   * It reads the station data from a data source, processes it, and returns the parsed data in a usable format.
   */

  return new Promise<Station[]>((resolve, reject) => {
    const stations: Station[] = [];
    const readableStream = fs.createReadStream(filePath, "utf-8");

    readableStream
      .on("error", (error: Error) => {
        console.error("An error occurred while reading the CSV file:", error);
        reject(new InternalError().getErrorResponse());
      })
      .pipe(
        csvParser({
          separator: ";",
          mapHeaders: ({ header }: { header: string }) => header.trim(),
        })
      )
      .on("data", (data: any) => {
        const { EVA_NR, DS100, NAME, VERKEHR, LAENGE, BREITE } = data;

        const station: Station = {
          EVA_NR,
          DS100,
          NAME,
          VERKEHR,
          LAENGE: parseFloat(LAENGE),
          BREITE: parseFloat(BREITE),
        };

        stations.push(station);
      })
      .on("end", () => {
        // console.log("CSV file parsing completed.");
        resolve(stations);
      });
  });
};

export default dataParser;
