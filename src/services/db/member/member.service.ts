import { MESSAGES } from "@/core/constants/globalConstants";

import dbService from "../dbConnection";
import { processProcedureResultQueryWithoutId } from "../utils/process-procedure-result.query";
import { ResultModel } from "../utils/result.model";
import { validateMemberFindAllDto } from "./dto/member-find-all.dto";
import { validateMemberNotFindAllDto } from "./dto/member-not-find-all.dto";
import { validateMemberRoleFindAllDto } from "./dto/member-role-find-all.dto";
import { MemberRoleFindAllQuery } from "./query/member_role_find_all.query";
import { MemberFindAllQuery } from "./query/member-find-all.query";
import { MemberNotFindAllQuery } from "./query/member-not-find-all.query";
import type {
  SpResultRecordMemberFindAllType,
  SpResultRecordMemberNotFindAllType,
  SpResultRecordMemberRoleFindAllType,
  TblMemberFindAll,
  TblMemberNotFindAll,
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

  async execMemberFindAllQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      const validatedDto = validateMemberFindAllDto(dataJsonDto);

      const queryString = await MemberFindAllQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordMemberFindAllType;

      return processProcedureResultQueryWithoutId<TblMemberFindAll>(
        resultData as unknown[],
        "Member not found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execMemberNotFindAllQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      const validatedDto = validateMemberNotFindAllDto(dataJsonDto);

      const queryString = await MemberNotFindAllQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordMemberNotFindAllType;

      return processProcedureResultQueryWithoutId<TblMemberNotFindAll>(
        resultData as unknown[],
        "Member not found",
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
