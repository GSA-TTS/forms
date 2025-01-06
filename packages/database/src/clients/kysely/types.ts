import type {
  ColumnType,
  Generated,
  Insertable,
  Kysely,
  Selectable,
  Updateable,
} from 'kysely';
import { type DbDate } from './db-helpers.js';

export type Engine = 'sqlite' | 'postgres';

export interface Database<T extends Engine = Engine> {
  users: UsersTable;
  sessions: SessionsTable<T>;
  forms: FormsTable;
  form_sessions: FormSessionsTable;
  form_documents: FormDocumentsTable;
}
export type DatabaseClient = Kysely<Database>;

interface UsersTable {
  id: string;
  email: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}
export type UsersSelectable = Selectable<UsersTable>;
export type UsersInsertable = Insertable<UsersTable>;
export type UsersUpdateable = Updateable<UsersTable>;

interface SessionsTable<T extends Engine> {
  id: string;
  user_id: string;
  session_token: string;
  expires_at: DbDate<T>;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}
export type SessionsSelectable<T extends Engine> = Selectable<SessionsTable<T>>;
export type SessionsInsertable<T extends Engine> = Insertable<SessionsTable<T>>;
export type SessionsUpdateable<T extends Engine> = Updateable<SessionsTable<T>>;

interface FormsTable {
  id: string;
  data: string; // Blueprint;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}
export type FormsTableSelectable = Selectable<FormsTable>;
export type FormsTableInsertable = Insertable<FormsTable>;
export type FormsTableUpdateable = Updateable<FormsTable>;

interface FormSessionsTable {
  id: string;
  form_id: string;
  data: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}
export type FormSessionsTableSelectable = Selectable<FormSessionsTable>;
export type FormSessionsTableInsertable = Insertable<FormSessionsTable>;
export type FormSessionsTableUpdateable = Updateable<FormSessionsTable>;

interface FormDocumentsTable {
  id: string;
  type: string;
  data: ColumnType<Buffer, Buffer, Buffer>;
  file_name: string;
  extract: string;
}
export type FormDocumentsTableSelectable = Selectable<FormDocumentsTable>;
export type FormDocumentsTableInsertable = Insertable<FormDocumentsTable>;
export type FormDocumentsTableUpdateable = Updateable<FormDocumentsTable>;
