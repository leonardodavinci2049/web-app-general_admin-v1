import { MESSAGES } from "@/core/constants/globalConstants";

import dbService from "../dbConnection";
import { processProcedureResult } from "../utils/process-procedure-result";
import { ResultModel } from "../utils/result.model";

import { validateOrganizationSelActiveDto } from "./dto/organization-sel-active.dto";
import { validateOrganizationSelAllDto } from "./dto/organization-sel-all.dto";
import { validateOrganizationSelIdDto } from "./dto/organization-sel-id.dto";

import { OrganizationSelActiveQuery } from "./query/organization-sel-active.query";
import { OrganizationSelAllQuery } from "./query/organization-sel-all.query";
import { OrganizationSelIdQuery } from "./query/organization-sel-id.query";

import type {
  SpResultRecordActiveType,
  SpResultRecordFindIdType,
  SpResultRecordFindType,
  TblOrganizationActive,
  TblOrganizationFind,
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

  async execOrganizationSelAllQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationSelAllDto(dataJsonDto);

      const queryString = await OrganizationSelAllQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordFindType;

      return processProcedureResult<TblOrganizationFind>(
        resultData as unknown[],
        "Organization not found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execOrganizationSelActiveQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationSelActiveDto(dataJsonDto);

      const queryString = await OrganizationSelActiveQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordActiveType;

      return processProcedureResult<TblOrganizationActive>(
        resultData as unknown[],
        "No active organization found",
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
