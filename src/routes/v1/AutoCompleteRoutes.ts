import { Router } from "express";
import { AutoCompleteController } from "../../controllers/v1/AutoCompleteController";
import { MethodNotAllowedError } from "../../errors";

const router = Router();

const autoCompleteRoutes = (
  autoCompleteController: AutoCompleteController
): Router => {
  router
    .route("/auto-complete/:query")
    .get(autoCompleteController.getAutoComplete)
    .all((_, res) => {
      // Handle disallowed methods
      res.status(405).json(new MethodNotAllowedError().getErrorResponse());
    });

  return router;
};

export default autoCompleteRoutes;
