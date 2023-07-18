import { Request, Response } from "express";
import "reflect-metadata";
import { injectable, inject } from "tsyringe";
import { IAutoCompleteService } from "../../services/v1/AutoCompleteService";
import { AutoCompleteResponse } from "../../interfaces/AutoCompleteResponse";
import { BadRequestError, InternalError, EmptyQueryError } from "../../errors";

import { performance } from "perf_hooks";

@injectable()
export class AutoCompleteController {
  /**
   * The AutoCompleteController module acts as an intermediary between the API routes and the service layer.
   * It receives incoming requests, validates input, and invokes the appropriate service methods.
   * It also formats the responses and sends them back to the client.
   */

  constructor(
    @inject("IAutoCompleteService")
    private autoCompleteService: IAutoCompleteService
  ) {}

  public getAutoComplete = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { query } = req?.params;

      if (!query) {
        throw new EmptyQueryError("Empty query string passed");
      }

      // Capture the start time
      const startTime = performance.now();

      const autoCompleteSuggestions =
        await this.autoCompleteService.getAutoComplete(query.trim());

      // Capture the end time
      const endTime = performance.now();

      // Calculate the elapsed time (rounded 1 decimal point)
      const timeTaken = (endTime - startTime).toFixed(1);

      const response: AutoCompleteResponse = {
        station_list: autoCompleteSuggestions,
        time_taken: `${timeTaken} ms`,
        number_of_stations_found: autoCompleteSuggestions.length.toString(),
      };
      res.status(200).json(response);
    } catch (error) {
      console.error(
        "An error occurred while processing the autocomplete request:",
        error
      );
      if (error instanceof BadRequestError) {
        res.status(400).json(error.getErrorResponse());
      } else {
        res.status(500).json(new InternalError().getErrorResponse());
      }
    }
  };
}
