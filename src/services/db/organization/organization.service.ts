import { MESSAGES } from "@/core/constants/globalConstants";
import dbService from "../dbConnection";
import { resultQueryData } from "../utils/procedure.result";
import { ResultModel } from "../utils/result.model";

import { validateOrganizationSelIdDto } from "./dto/organization-sel-id.dto";

import { OrganizationSelIdQuery } from "./query/organization-sel-id.query";
import type {
  SpResultRecordFindIdType,
  TblOrganizationFindId,
  SpDefaultFeedback,
} from "./types/organization.type";

export class OrganizationService {
  // Serviço para buscar organização por ID
  async execOrganizationSelIdQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationSelIdDto(dataJsonDto);

      const queryString = OrganizationSelIdQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordFindIdType;

      const firstResultSet = resultData[0] as unknown[];
      const secondResultSet = resultData[1] as unknown[];

      // Verifica se o primeiro array é na verdade o feedback (isso acontece quando não há registros e a procedure "pula" o SELECT)
      const isFirstResultFeedback =
        firstResultSet.length > 0 &&
        typeof firstResultSet[0] === "object" &&
        firstResultSet[0] !== null &&
        "sp_error_id" in firstResultSet[0];

      let tblRecords: TblOrganizationFindId[] = [];
      let DefaultFeedback: SpDefaultFeedback[] = [];

      if (isFirstResultFeedback) {
        tblRecords = [];
        DefaultFeedback = firstResultSet as SpDefaultFeedback[];
      } else {
        tblRecords = firstResultSet as TblOrganizationFindId[];
        DefaultFeedback = (secondResultSet as SpDefaultFeedback[]) || [];
      }

      const qtRecords: number = tblRecords.length;
      const tblRecord = tblRecords[0] || null;
      const recordId: string = tblRecord?.id ?? "";

      const errorId: number = DefaultFeedback[0]?.sp_error_id ?? 0;
      let Feedback = DefaultFeedback[0]?.sp_message || "";

      if (qtRecords === 0 && errorId === 0) {
        Feedback = "Organization not found";
      }

      return resultQueryData<TblOrganizationFindId[]>(
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
      return new ResultModel(100404, errorMessage, "", []);
    }
  }
}

// Instância singleton do serviço de organização
const organizationService = new OrganizationService();
export default organizationService;
