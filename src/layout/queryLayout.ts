import { Node, Edge, MarkerType } from '@xyflow/react';
import { QueryModel, CTENode } from '../model/query';

export interface LayoutResult {
  nodes: Node[];
  edges: Edge[];
}

export function buildQueryGraph(model: QueryModel): LayoutResult {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  let currentX = 50;
  const X_GAP = 280;
  const Y_GAP = 120;

  // Render CTEs if present
  let cteYOffset = 50;
  if (model.ctes && model.ctes.length > 0) {
    model.ctes.forEach((cte: CTENode, index: number) => {
      const cteNodeId = `cte_${index}`;
      nodes.push({
        id: cteNodeId,
        type: 'cteNode',
        position: { x: currentX, y: cteYOffset },
        data: {
          name: cte.name,
          model: cte.model,
          summary: `${
            cte.model?.sources?.length
              ? cte.model.sources.map((s) => s.name).join(', ')
              : 'VALUES'
          } -> (${cte.name})`,
        },
      });
      cteYOffset += 140;
    });
    currentX += X_GAP;
  }

  // 1. Source tables
  const sourceNodes: string[] = [];
  const startY = Math.max(50, (model.sources.length - 1) * -40 + 150);

  model.sources.forEach((source, index) => {
    const nodeId = `source_${source.id || index}`;
    sourceNodes.push(nodeId);
    nodes.push({
      id: nodeId,
      type: 'tableNode',
      position: { x: currentX, y: startY + index * Y_GAP },
      data: {
        name: source.name,
        alias: source.alias,
        schema: source.schema,
      },
    });

    // If source references a CTE, connect the CTE node to this source node
    if (model.ctes && model.ctes.length > 0) {
      model.ctes.forEach((cte, cteIdx) => {
        const cteNameLower = cte.name.toLowerCase();
        const srcNameLower = source.name.toLowerCase();
        if (srcNameLower === cteNameLower) {
          edges.push({
            id: `edge_cte_${cteIdx}_${nodeId}`,
            source: `cte_${cteIdx}`,
            target: nodeId,
            type: 'flowEdge',
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed },
          });
        }
      });
    }
  });

  if (model.sources.length === 0) {
    // Dual / literal query without FROM
    const nodeId = 'source_dual';
    sourceNodes.push(nodeId);
    nodes.push({
      id: nodeId,
      type: 'tableNode',
      position: { x: currentX, y: 150 },
      data: {
        name: 'VALUES / DUAL',
        alias: undefined,
      },
    });
  }

  let previousNodeIds = [...sourceNodes];

  // 2. Joins
  if (model.joins.length > 0) {
    currentX += X_GAP;
    model.joins.forEach((join, index) => {
      const joinNodeId = `join_${join.id || index}`;
      nodes.push({
        id: joinNodeId,
        type: 'joinNode',
        position: { x: currentX, y: 150 + index * Y_GAP },
        data: {
          type: join.type,
          leftTable: join.leftTable,
          rightTable: join.rightTable,
          onCondition: join.onCondition,
          usingColumns: join.usingColumns,
        },
      });

      // Connect source tables to join node
      previousNodeIds.forEach((srcId) => {
        edges.push({
          id: `edge_${srcId}_${joinNodeId}`,
          source: srcId,
          target: joinNodeId,
          type: 'flowEdge',
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      });

      previousNodeIds = [joinNodeId];
    });
  }

  // 3. WHERE Filter
  const whereFilter = model.filters.find((f) => f.type === 'WHERE');
  if (whereFilter) {
    currentX += X_GAP;
    const filterNodeId = 'filter_where';
    nodes.push({
      id: filterNodeId,
      type: 'filterNode',
      position: { x: currentX, y: 150 },
      data: {
        type: 'WHERE',
        raw: whereFilter.raw,
        columns: whereFilter.columns,
      },
    });

    previousNodeIds.forEach((prevId) => {
      edges.push({
        id: `edge_${prevId}_${filterNodeId}`,
        source: prevId,
        target: filterNodeId,
        type: 'flowEdge',
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed },
      });
    });

    previousNodeIds = [filterNodeId];
  }

  // 4. GROUP BY Aggregate
  if (model.groupBy) {
    currentX += X_GAP;
    const aggNodeId = 'group_by_node';
    nodes.push({
      id: aggNodeId,
      type: 'aggregateNode',
      position: { x: currentX, y: 150 },
      data: {
        columns: model.groupBy.columns,
        raw: model.groupBy.raw,
      },
    });

    previousNodeIds.forEach((prevId) => {
      edges.push({
        id: `edge_${prevId}_${aggNodeId}`,
        source: prevId,
        target: aggNodeId,
        type: 'flowEdge',
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed },
      });
    });

    previousNodeIds = [aggNodeId];
  }

  // 5. HAVING Filter
  const havingFilter = model.having || model.filters.find((f) => f.type === 'HAVING');
  if (havingFilter) {
    currentX += X_GAP;
    const havingNodeId = 'filter_having';
    nodes.push({
      id: havingNodeId,
      type: 'filterNode',
      position: { x: currentX, y: 150 },
      data: {
        type: 'HAVING',
        raw: havingFilter.raw,
        columns: havingFilter.columns,
      },
    });

    previousNodeIds.forEach((prevId) => {
      edges.push({
        id: `edge_${prevId}_${havingNodeId}`,
        source: prevId,
        target: havingNodeId,
        type: 'flowEdge',
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed },
      });
    });

    previousNodeIds = [havingNodeId];
  }

  // 6. ORDER BY / LIMIT
  if (model.orderBy.length > 0 || model.limit) {
    currentX += X_GAP;
    const sortLimitNodeId = 'sort_limit_node';
    nodes.push({
      id: sortLimitNodeId,
      type: 'sortLimitNode',
      position: { x: currentX, y: 150 },
      data: {
        orderBy: model.orderBy,
        limit: model.limit,
      },
    });

    previousNodeIds.forEach((prevId) => {
      edges.push({
        id: `edge_${prevId}_${sortLimitNodeId}`,
        source: prevId,
        target: sortLimitNodeId,
        type: 'flowEdge',
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed },
      });
    });

    previousNodeIds = [sortLimitNodeId];
  }

  // 7. SELECT Output Projections
  currentX += X_GAP;
  const outputNodeId = 'output_node';
  nodes.push({
    id: outputNodeId,
    type: 'outputNode',
    position: { x: currentX, y: 150 },
    data: {
      projections: model.projections,
      isStar: model.hasStarProjection,
      queryType: model.queryType,
    },
  });

  previousNodeIds.forEach((prevId) => {
    edges.push({
      id: `edge_${prevId}_${outputNodeId}`,
      source: prevId,
      target: outputNodeId,
      type: 'flowEdge',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
    });
  });

  return { nodes, edges };
}
