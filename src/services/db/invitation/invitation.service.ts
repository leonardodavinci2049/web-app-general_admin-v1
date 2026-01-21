import { MESSAGES } from "@/core/constants/globalConstants";

import dbService from "../dbConnection";
import { processProcedureResultQuery } from "../utils/process-procedure-result.query";
import { ResultModel } from "../utils/result.model";
import { validateInvitationFindAllDto } from "./dto/invitation_find_all.dto";
import { InvitationFindAllQuery } from "./query/invitation_find_all.query";
import type {
  SpResultRecordFindAllType,
  TblInvitationFindAll,
} from "./types/invitation.type";

export class InvitationService {
  async execInvitationFindAllQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      const validatedDto = validateInvitationFindAllDto(dataJsonDto);

      const queryString = await InvitationFindAllQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordFindAllType;

      return processProcedureResultQuery<TblInvitationFindAll>(
        resultData as unknown[],
        "Invitations not found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }
}

const invitationService = new InvitationService();
export default invitationService;
