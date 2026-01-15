import { MESSAGES } from "@/core/constants/globalConstants";
import dbService from "../dbConnection";
import { resultQueryData } from "../utils/procedure.result";
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

      const recordId: string = tblRecord?.id ?? "";

      const DefaultFeedback = resultData[1];
      const errorId: number = DefaultFeedback[0]?.sp_error_id ?? 0;
      let Feedback = DefaultFeedback[0]?.sp_message || "";

      if (qtRecords === 0 && errorId === 0) {
        Feedback = "Product not found";
      }

      return resultQueryData<SpResultRecordFindIdType>(
        0,
        recordId,
        errorId,
        Feedback,
        tblRecords,
        qtRecords,
        "",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, '', []);
    }
  }
}

// Instância singleton do serviço de autenticação
const organizationService = new OrganizationService();
export default organizationService;
