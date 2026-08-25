export interface ColumnSchema {
  name: string;
  type: string;
  nullable: boolean;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  isUnique?: boolean;
  defaultValue?: string;
  references?: {
    table: string;
    column: string;
  };
}

export interface IndexSchema {
  name: string;
  columns: string[];
  isUnique: boolean;
}

export interface ForeignKeyReference {
  id: string;
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  constraintName?: string;
}

export interface TableSchema {
  name: string;
  columns: ColumnSchema[];
  primaryKey: string[];
  foreignKeys: ForeignKeyReference[];
  indexes: IndexSchema[];
  rowCount?: number;
  ddlSql?: string;
  sampleRows?: Array<Record<string, unknown>>;
}

export interface SchemaModel {
  tables: Record<string, TableSchema>;
  foreignKeys: ForeignKeyReference[];
  orphanTables: string[];
  missingIndexFkColumns: Array<{ table: string; column: string }>;
}
