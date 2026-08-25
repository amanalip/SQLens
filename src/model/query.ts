export type QueryType = 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'UNKNOWN';

export interface TableSource {
  id: string;
  name: string;
  alias?: string;
  schema?: string;
}

export type JoinType = 'INNER' | 'LEFT' | 'RIGHT' | 'FULL' | 'CROSS' | 'NATURAL' | 'JOIN';

export interface JoinClause {
  id: string;
  type: JoinType;
  leftTable: string;
  rightTable: string;
  onCondition?: string;
  usingColumns?: string[];
}

export interface FilterCondition {
  id: string;
  raw: string;
  type: 'WHERE' | 'HAVING';
  columns: string[];
}

export interface AggregateClause {
  id: string;
  columns: string[];
  raw: string;
}

export interface SortClause {
  id: string;
  column: string;
  direction: 'ASC' | 'DESC';
}

export interface LimitClause {
  count: number;
  offset?: number;
}

export interface Projection {
  id: string;
  raw: string;
  expr: string;
  alias?: string;
  table?: string;
  isStar?: boolean;
}

export interface CTENode {
  name: string;
  model: QueryModel;
}

export interface SubqueryNode {
  id: string;
  alias?: string;
  location: 'FROM' | 'JOIN' | 'WHERE' | 'HAVING' | 'SELECT';
  model: QueryModel;
}

export interface QueryModel {
  id: string;
  rawSql: string;
  queryType: QueryType;
  ctes: CTENode[];
  sources: TableSource[];
  joins: JoinClause[];
  filters: FilterCondition[];
  groupBy?: AggregateClause;
  having?: FilterCondition;
  orderBy: SortClause[];
  limit?: LimitClause;
  projections: Projection[];
  subqueries: SubqueryNode[];
  hasStarProjection: boolean;
  hasCartesianJoin: boolean;
  hasCorrelatedSubquery: boolean;
}
