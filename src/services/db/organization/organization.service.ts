import dbService from "../dbConnection";
import { MESSAGES, resultQueryData } from "../utils/global.result";
import { ResultModel } from "../utils/result.model";

import { validateOrganizationSelIdDto } from "./dto/organization-sel-id.dto";

import { OrganizationSelIdQuery } from "./query/organization-sel-id.query";
import type { SpResultRecordFindIdType } from "./types/organization.type";

export class OrganizationService {
  // Serviço para cadastro de usuário
  async execOrganizationSelIdQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationSelIdDto(dataJsonDto);

      const queryString = OrganizationSelIdQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordFindIdType;

      const tblRecords = resultData[0];
      const qtRecords: number = tblRecords.length;
      const tblRecord = tblRecords[0] || 0;
      const recordId: number = tblRecord?.ORGANIZATION_ID ?? 0;

      return resultQueryData<SpResultRecordFindIdType>(
        recordId,
        0,
        "",
        resultData,
        qtRecords,
        "",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }
}

// Instância singleton do serviço de autenticação
const organizationService = new OrganizationService();
export default organizationService;
