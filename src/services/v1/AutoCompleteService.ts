import TrieSearch from "trie-search";
import { injectable } from "tsyringe";
import { Station } from "../../data/StationModel";
import dataParser from "../../data/DataParser";
import {
  InvalidCharacterError,
  ShortQueryError,
  LongQueryError,
} from "../../errors";

export interface IAutoCompleteService {
  getAutoComplete(query: string): Promise<any>;
  translierate(query: string): string;
  formatStations(stations: Station[]): string[];
}

@injectable()
export class AutoCompleteService implements IAutoCompleteService {
  /**
   * The AutoCompleteService module handles the business logic for retrieving auto-complete suggestions.
   * It interacts with the data layer, performs data manipulation, and provides the necessary methods for auto-complete functionality.
   */

  private stations: Station[] = [];
  private trie: TrieSearch<Station> = new TrieSearch<Station>("NAME", {
    ignoreCase: true,
  });

  constructor() {}

  private async prepareStations(): Promise<void> {
    this.stations = await dataParser();
  }

  private async initialize(): Promise<void> {
    if (this.stations.length === 0) {
      await this.prepareStations();

      this.stations.forEach((station) => {
        const { NAME } = station;

        this.trie.map(this.translierate(NAME), station);
      });
    }
  }

  public translierate(query: string): string {
    let transliterated = query.toLowerCase();

    // Map specific characters
    transliterated = transliterated.replace(/ß/g, "ss");
    transliterated = transliterated.replace(/ö/g, "oe");
    transliterated = transliterated.replace(/ü/g, "ue");

    return transliterated;
  }

  public formatStations(stations: Station[]): string[] {
    return stations.map(
      (station) => `${station.EVA_NR} - ${station.DS100} - ${station.NAME}`
    );
  }

  public async getAutoComplete(query: string): Promise<any> {
    if (!/^[a-zA-ZäöüÄÖÜß\s]+$/.test(query)) {
      throw new InvalidCharacterError(
        "Alphanumeric characters are not allowed."
      );
    }

    if (query.length < Number(process.env.MIN_QUERY_LENGTH || 3)) {
      throw new ShortQueryError(
        `Query must contain at least ${
          process.env.MIN_QUERY_LENGTH || 3
        } characters.`
      );
    }
    if (query.length > Number(process.env.MAX_QUERY_LENGTH || 50)) {
      throw new LongQueryError(
        `Query must not exceed ${
          process.env.MAX_QUERY_LENGTH || 50
        } characters.`
      );
    }

    // if not done yet
    // initialize by parsing/retrieving data and trie data structure
    await this.initialize();

    const autocompleteSuggestions: Station[] = this.trie.search(
      this.translierate(query)
    );

    const formattedStations = this.formatStations(autocompleteSuggestions);

    return formattedStations;
  }
}

export default AutoCompleteService;
