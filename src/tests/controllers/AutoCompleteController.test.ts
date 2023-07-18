import { Request, Response } from "express";
import { instance, mock, resetCalls, verify, when } from "ts-mockito";
import { AutoCompleteController } from "../../controllers/v1/AutoCompleteController";
import AutoCompleteService, {
  IAutoCompleteService,
} from "../../services/v1/AutoCompleteService";
import { AutoCompleteResponse } from "../../interfaces/AutoCompleteResponse";
import {
  InternalError,
  InvalidCharacterError,
  LongQueryError,
  ShortQueryError,
} from "../../errors";

describe("AutoCompleteController", () => {
  let serviceMock: IAutoCompleteService;
  let controller: AutoCompleteController;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    serviceMock = mock(AutoCompleteService);
    controller = new AutoCompleteController(instance(serviceMock));
    // Mock console.error function
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    resetCalls(serviceMock);
    consoleErrorSpy.mockRestore();
  });

  describe("getAutoComplete", () => {
    it("should return auto complete suggestions", async () => {
      const req: any = { params: { query: "Berlin" } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response<AutoCompleteResponse>;

      const autoCompleteSuggestions = ["Berlin Hbf", "Berlin Ostbahnhof"];
      when(serviceMock.getAutoComplete("Berlin")).thenResolve(
        autoCompleteSuggestions
      );

      await controller.getAutoComplete(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        station_list: autoCompleteSuggestions,
        time_taken: expect.any(String),
        number_of_stations_found: autoCompleteSuggestions.length.toString(),
      });
    });

    it("should return the same response for consecutive requests", async () => {
      const req: any = { params: { query: "alt" } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response<AutoCompleteResponse>;

      const autoCompleteSuggestions = ["Altendorf", "Altenberg"];
      when(serviceMock.getAutoComplete("alt")).thenResolve(
        autoCompleteSuggestions
      );

      await controller.getAutoComplete(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        station_list: autoCompleteSuggestions,
        time_taken: expect.any(String),
        number_of_stations_found: autoCompleteSuggestions.length.toString(),
      });

      // Reset the response mock
      // res.json.mockReset();

      // Make the second request
      await controller.getAutoComplete(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        station_list: autoCompleteSuggestions,
        time_taken: expect.any(String),
        number_of_stations_found: autoCompleteSuggestions.length.toString(),
      });
    });

    it("should return an empty response when suggestions are empty", async () => {
      const req: any = { params: { query: "nonexistent" } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response<AutoCompleteResponse>;

      const autoCompleteSuggestions: string[] = []; // Empty suggestions
      when(serviceMock.getAutoComplete("nonexistent")).thenResolve(
        autoCompleteSuggestions
      );

      await controller.getAutoComplete(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        station_list: [],
        time_taken: expect.any(String),
        number_of_stations_found: "0",
      });
    });

    it("should handle service error and return 500", async () => {
      const req: any = { params: { query: "error" } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response<AutoCompleteResponse>;

      const errorMessage = "Internal Server Error.";
      when(serviceMock.getAutoComplete("error")).thenReject(
        new InternalError(errorMessage)
      );

      await controller.getAutoComplete(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error_code: "500",
        error_description: "Internal Server Error.",
      });
    });
  });

  it("should throw error for short queries (includes empty string)", async () => {
    const req: any = { params: { query: "be" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    try {
      await controller.getAutoComplete(req, res);
    } catch (error: any) {
      error = error as ShortQueryError;
      expect(error.statusCode).toBe(400);
      expect(error.error_code).toBe("002");
      expect(error.message).toBe("Query must contain at least 3 characters.");
    }
  });

  it("should handle error and return 400 for invalid query", async () => {
    const req: any = { params: { query: "123" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    try {
      await controller.getAutoComplete(req, res);
    } catch (error: any) {
      error = error as InvalidCharacterError;
      expect(error.statusCode).toBe(400);
      expect(error.error_code).toBe("001");
      expect(error.message).toBe("Alphanumeric characters are not allowed.");
    }
  });

  it("should throw error for long queries", async () => {
    const req: any = { params: { query: "a".repeat(51) } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response<AutoCompleteResponse>;

    const errorMessage = "Query must not exceed 50 characters.";
    try {
      await controller.getAutoComplete(req, res);
    } catch (error: any) {
      error = error as LongQueryError;
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error_code: "003",
        error_description: errorMessage,
      });
    }
  });
});
