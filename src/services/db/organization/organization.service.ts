import { MESSAGES } from "@/core/constants/globalConstants";

import dbService from "../dbConnection";
import { processProcedureResult } from "../utils/process-procedure-result";
import { ResultModel } from "../utils/result.model";

import { validateOrganizationSelIdDto } from "./dto/organization-sel-id.dto";

import { OrganizationSelIdQuery } from "./query/organization-sel-id.query";
import type {
  SpResultRecordFindIdType,
  TblOrganizationFindId,
} from "./types/organization.type";

export class OrganizationService {
  // Serviço para buscar organização por ID
  async execOrganizationSelIdQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationSelIdDto(dataJsonDto);

      const queryString = await OrganizationSelIdQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordFindIdType;

      return processProcedureResult<TblOrganizationFindId>(
        resultData as unknown[],
        "Organization not found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }
}

// Instância singleton do serviço de organização
const organizationService = new OrganizationService();
export default organizationService;
