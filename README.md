# Backend AutoComplete

The Backend AutoComplete is a RESTful API that provides auto-complete suggestions for station names. It utilizes a Trie data structure for efficient search and supports special characters like umlauts (ä, ö, ü) and ß.

## Features

- Auto-complete suggestions: Given a partial station name query, the API returns a list of suggested station names that match the query.
- Handling special characters: The API supports special characters like umlauts (ä, ö, ü) and ß in the station names, providing accurate suggestions.
- Performance: The Trie data structure used in the backend ensures fast and efficient search operations, allowing for quick response times even with a large dataset.

## Technologies Used

- `Node.js`: The application is built using Node.js, a powerful JavaScript runtime environment.
- `Express.js`: Express.js is used as the web framework for handling HTTP requests and responses.
- `TypeScript`: The application is written in TypeScript, providing static typing and improved maintainability.
- `Trie data structure`: The Trie data structure is used to efficiently store and search for station names.
- Other Modular architectures/patterns: `MVC` and `Dependency Injection`.
- (and for sure there is more room for improvement)

## Getting Started (Locally)

### A quick start via `docker-compose`:

```bash
docker-compose up
```

The server should be available at [`http://localhost:3000`](http://localhost:3000).

NOTE: This setup may add a fraction of `ms` delay, particularly if you deploy the container on a cluster.

### Alternative setup:

To build, test, and run the application, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies:

```bash
npm install
```

3. Build the application:

```bash
npm run build
```

4. Run the tests (optional):

```bash
npm run test
```

5. Start the application:

```bash
npm run dev
```

The server should be available at [`http://localhost:3000`](http://localhost:3000).
Make sure to set up the necessary environment variables for the application, such as the port number and any configuration options specific to your environment. Refer to the `.env` file for the available options (discarded in `.gitignore` for demonstration purposes of its content).

## API Endpoints

The API is versrioned and current version is `1`.

| Method | Endpoint                       | Description                                             |
| ------ | ------------------------------ | ------------------------------------------------------- |
| `GET`  | `/api/v1/auto-complete/:query` | Retrieves auto-complete suggestions for the given query |

The `query` parameter represents the partial station name to search for.

## Examples

- Request: `GET /api/v1/auto-complete/altdoe`
  Response:
  ```json
  {
    "station_list": ["8011016 - BAD - Altdöbern"],
    "time_taken": "0.2 ms",
    "number_of_stations_found": "1"
  }
  ```

As you see here, the umlaut in the query parameter `altdoe` gets successfully resolved to `altdö`.
