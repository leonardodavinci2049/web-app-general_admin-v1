import type { RowDataPacket } from "mysql2";

// Login feedback information

export interface SpDefaultFeedback extends RowDataPacket {
  sp_return_id: string;
  sp_message: string;
  sp_error_id: number;
}

// Database operation result
export interface SpOperationResult {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  info: string;
  serverStatus: number;
  warningStatus: number;
  changedRows: number;
}

export interface TblMemberRoleFindAll extends RowDataPacket {
  id: number;
  role: string;
  name: string;
}

export interface TblMemberFindAll extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  image: string;
  organization: string;
  role: string;
  createdAt: Date;
}

export interface TblMemberNotFindAll extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  image: string;
  organization: string;
  role: string;
  createdAt: Date;
}

export type SpResultRecordCreateType = [SpDefaultFeedback[], SpOperationResult];
export type SpResultRecordUpdateType = [SpDefaultFeedback[], SpOperationResult];
export type SpResultRecordDeleteType = [SpDefaultFeedback[], SpOperationResult];
export type SpResultRecordCheckExistType = [
  SpDefaultFeedback[],
  SpOperationResult,
];
// Or keep the tuple type and create a related interface

export type SpResultRecordMemberRoleFindAllType = [
  TblMemberRoleFindAll[], // Primeiro item: array de usuários
  SpDefaultFeedback[], // Terceiro item: resultado SQL
  SpOperationResult, // Segundo item: array de feedbacks
];

export type SpResultRecordMemberFindAllType = [
  TblMemberFindAll[], // Primeiro item: array de usuários
  SpDefaultFeedback[], // Terceiro item: resultado SQL
  SpOperationResult, // Segundo item: array de feedbacks
];

export type SpResultRecordMemberNotFindAllType = [
  TblMemberNotFindAll[], // Primeiro item: array de usuários
  SpDefaultFeedback[], // Terceiro item: resultado SQL
  SpOperationResult, // Segundo item: array de feedbacks
];
