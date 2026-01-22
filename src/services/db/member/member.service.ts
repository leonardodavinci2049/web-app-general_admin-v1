import { MESSAGES } from "@/core/constants/globalConstants";

import dbService from "../dbConnection";
import { processProcedureResultQueryWithoutId } from "../utils/process-procedure-result.query";
import { ResultModel } from "../utils/result.model";
import { validateMemberRoleFindAllDto } from "./dto/member_role_find_all.dto";
import { MemberRoleFindAllQuery } from "./query/member_role_find_all.query";
import type {
  SpResultRecordMemberRoleFindAllType,
  TblMemberRoleFindAll,
} from "./types/member.type";

export class MemberService {
  async execMemberRoleFindAllQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      const validatedDto = validateMemberRoleFindAllDto(dataJsonDto);

      const queryString = await MemberRoleFindAllQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordMemberRoleFindAllType;

      return processProcedureResultQueryWithoutId<TblMemberRoleFindAll>(
        resultData as unknown[],
        "Member roles not found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }
}

const memberService = new MemberService();
export default memberService;
