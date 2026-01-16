import { MESSAGES } from "@/core/constants/globalConstants";

import dbService from "../dbConnection";
import { processProcedureResult } from "../utils/process-procedure-result.query";
import { ResultModel } from "../utils/result.model";

import { validateOrganizationFindActiveDto } from "./dto/organization-find-active.dto";
import { validateOrganizationFindAllDto } from "./dto/organization-find-all.dto";
import { validateOrganizationFindByIdDto } from "./dto/organization-find-by-id.dto";

import { OrganizationFindActiveQuery } from "./query/organization-find-active.query";
import { OrganizationFindAllQuery } from "./query/organization-find-all.query";
import { OrganizationFindByIdQuery } from "./query/organization-find-by-id.query";

import type {
  SpResultRecordActiveType,
  SpResultRecordFindByIdType,
  SpResultRecordFindType,
  TblOrganizationActive,
  TblOrganizationFind,
  TblOrganizationFindById,
} from "./types/organization.type";

export class OrganizationService {
  // Serviço para buscar organização por ID
  async execOrganizationFindByIdQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationFindByIdDto(dataJsonDto);

      const queryString = await OrganizationFindByIdQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordFindByIdType;

      return processProcedureResult<TblOrganizationFindById>(
        resultData as unknown[],
        "Organization not found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execOrganizationFindAllQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationFindAllDto(dataJsonDto);

      const queryString = await OrganizationFindAllQuery(validatedDto);

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

  async execOrganizationFindActiveQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationFindActiveDto(dataJsonDto);

      const queryString = await OrganizationFindActiveQuery(validatedDto);

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
