import { MESSAGES } from "@/core/constants/globalConstants";

import dbService from "../dbConnection";
import { processProcedureResultMutation } from "../utils/process-procedure-result.mutation";
import { processProcedureResultQuery } from "../utils/process-procedure-result.query";
import { ResultModel } from "../utils/result.model";
import { validateOrganizationCheckNameExistDto } from "./dto/organization-check-name-exist.dto";
import { validateOrganizationCheckSlugExistDto } from "./dto/organization-check-slug-exist.dto";
import { validateOrganizationCheckSystemIdExistDto } from "./dto/organization-check-systen-id-exist.dto";
import { validateOrganizationCheckTermsExistDto } from "./dto/organization-check-terms-exist.dto";
import { validateOrganizationCreateDto } from "./dto/organization-create.dto";
import { validateOrganizationDeleteDto } from "./dto/organization-delete.dto";
import { validateOrganizationFindActiveDto } from "./dto/organization-find-active.dto";
import { validateOrganizationFindAllDto } from "./dto/organization-find-all.dto";
import { validateOrganizationFindByIdDto } from "./dto/organization-find-by-id.dto";
import { validateOrganizationUpdNameDto } from "./dto/organization-upd-name.dto";
import { validateOrganizationUpdSlugDto } from "./dto/organization-upd-slug.dto";
import { validateOrganizationUpdSystemIdDto } from "./dto/organization-upd-system-id.dto";
import { OrganizationCheckNameExistQuery } from "./query/organization-check-name-exist.query";
import { OrganizationCheckSlugExistQuery } from "./query/organization-check-slug-exist.query";
import { OrganizationCheckSystenIdExistQuery } from "./query/organization-check-systen-id-exist.query";
import { OrganizationCheckTermsExistQuery } from "./query/organization-check-terms-exist.query";
import { OrganizationCreateQuery } from "./query/organization-create.query";
import { OrganizationDeleteQuery } from "./query/organization-delete.query";
import { OrganizationFindActiveQuery } from "./query/organization-find-active.query";
import { OrganizationFindAllQuery } from "./query/organization-find-all.query";
import { OrganizationFindByIdQuery } from "./query/organization-find-by-id.query";
import { OrganizationUpdNameQuery } from "./query/organization-upd-name.query";
import { OrganizationUpdSlugQuery } from "./query/organization-upd-slug.query";
import { OrganizationUpdSystemIdQuery } from "./query/organization-upd-system-id.query";
import type {
  SpResultRecordActiveType,
  SpResultRecordCheckExistType,
  SpResultRecordCreateType,
  SpResultRecordDeleteType,
  SpResultRecordFindByIdType,
  SpResultRecordFindType,
  SpResultRecordUpdateType,
  TblOrganizationActive,
  TblOrganizationFind,
  TblOrganizationFindById,
} from "./types/organization.type";

export class OrganizationService {
  // ============================================================================
  // buscar organização
  // ============================================================================

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

      return processProcedureResultQuery<TblOrganizationFindById>(
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

      return processProcedureResultQuery<TblOrganizationFind>(
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

      return processProcedureResultQuery<TblOrganizationActive>(
        resultData as unknown[],
        "No active organization found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }
  // ============================================================================
  // verificar se termos da organização existe
  // ============================================================================

  async execOrganizationCheckTermsExistQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationCheckTermsExistDto(dataJsonDto);

      const queryString = await OrganizationCheckTermsExistQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordCheckExistType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "No active organization found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execOrganizationCheckNameExistQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationCheckNameExistDto(dataJsonDto);

      const queryString = await OrganizationCheckNameExistQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordCheckExistType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "Organization name check failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execOrganizationCheckSlugExistQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationCheckSlugExistDto(dataJsonDto);

      const queryString = await OrganizationCheckSlugExistQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordCheckExistType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "Organization slug check failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execOrganizationCheckSystenIdExistQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto =
        validateOrganizationCheckSystemIdExistDto(dataJsonDto);

      const queryString =
        await OrganizationCheckSystenIdExistQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordCheckExistType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "Organization System ID check failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }
  // ============================================================================
  // criar organização
  // ============================================================================

  async execOrganizationCreateQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationCreateDto(dataJsonDto);

      const queryString = await OrganizationCreateQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordCreateType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "Organization create failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }
  // ============================================================================
  // atualizar termos da organização
  // ============================================================================

  async execOrganizationUpdateNameQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationUpdNameDto(dataJsonDto);

      const queryString = await OrganizationUpdNameQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "Organization update name failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execOrganizationUpdateSlugQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationUpdSlugDto(dataJsonDto);

      const queryString = await OrganizationUpdSlugQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "Organization update slug failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execOrganizationUpdateSystemIdQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationUpdSystemIdDto(dataJsonDto);

      const queryString = await OrganizationUpdSystemIdQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "Organization update system ID failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }
  // ============================================================================
  // deletar organização
  // ============================================================================
  async execOrganizationDeleteQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationDeleteDto(dataJsonDto);

      const queryString = await OrganizationDeleteQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordDeleteType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "Organization delete failed",
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
