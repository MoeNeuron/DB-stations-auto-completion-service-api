import TrieSearch from "trie-search";
import getStations, { StationType } from "./getStations";

const autoComplete = async () => {
  const stations: StationType[] = await getStations();

  const trie = new TrieSearch();

  for (let station of stations) {
    const { NAME } = station;
    // const { EVA_NR, DS100, NAME } = station;
    // trie.add({  });
    trie.map(NAME.toLowerCase(), station);
  }

  // Perform autocompletion search
  const prefix = "BER";
  const autocompleteSuggestions = trie.get(prefix.toLowerCase());

  console.log(autocompleteSuggestions);
  console.log(autocompleteSuggestions.length);
};

autoComplete();
