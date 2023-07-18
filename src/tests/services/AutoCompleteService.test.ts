import "reflect-metadata";
import TrieSearch from "trie-search";
import { instance, mock, resetCalls, verify, when } from "ts-mockito";
import {
  InvalidCharacterError,
  ShortQueryError,
  LongQueryError,
} from "../../errors";
import { AutoCompleteService } from "../../services/v1/AutoCompleteService";
import dataParser from "../../data/DataParser";
import { Station } from "../../data/StationModel";

describe("AutoCompleteService", () => {
  let service: any;
  let trieMock: TrieSearch<any>;

  beforeEach(() => {
    trieMock = mock(TrieSearch);
    service = new AutoCompleteService();
    service["trie"] = trieMock; // Assign the TrieSearch mock to the "trie" property
  });

  afterEach(() => {
    resetCalls(trieMock);
  });
  describe("getAutoComplete", () => {
    it("should format stations", () => {
      // Mock station data
      const stations = [
        { EVA_NR: 1, DS100: "BALE", NAME: "Berlin Zoologischer Garten Bhf." },
        { EVA_NR: 2, DS100: "BBEV", NAME: "Berlin Ostbahnhof" },
      ];

      const formattedStations = service.formatStations(stations);

      expect(formattedStations).toEqual([
        "1 - BALE - Berlin Zoologischer Garten Bhf.",
        "2 - BBEV - Berlin Ostbahnhof",
      ]);
    });

    it("should transliterate the query correctly", () => {
      const service = new AutoCompleteService();

      const query = "München Österreich";
      const expectedTransliteratedQuery = "muenchen oesterreich";

      const transliteratedQuery = service["translierate"](query);

      expect(transliteratedQuery).toEqual(expectedTransliteratedQuery);
    });

    it("should throw InvalidCharacterError for invalid characters in query", async () => {
      const query = "123";

      await expect(service.getAutoComplete(query)).rejects.toThrow(
        InvalidCharacterError
      );
    });

    it("should throw ShortQueryError for queries shorter than the minimum length", async () => {
      const query = "be";

      await expect(service.getAutoComplete(query)).rejects.toThrow(
        ShortQueryError
      );
    });

    it("should throw LongQueryError for queries longer than the maximum length", async () => {
      const query = "a".repeat(51);

      await expect(service.getAutoComplete(query)).rejects.toThrow(
        LongQueryError
      );
    });

    // Add more test cases to cover different scenarios and edge cases
  });
});
