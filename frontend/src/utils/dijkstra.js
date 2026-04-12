/**
 * Dijkstra's Algorithm - Cheapest Path Finder
 * Uses routes.json graph to find the minimum-cost path between two planet IDs.
 */
import routesData from '../data/routes.json';

export const getCheapestPath = (sourceId, targetId) => {
    // Build adjacency list (bidirectional graph)
    const graph = {};
    for (const edge of routesData.edges) {
        if (!graph[edge.source]) graph[edge.source] = [];
        if (!graph[edge.target]) graph[edge.target] = [];
        graph[edge.source].push({ node: edge.target, cost: edge.cost, dist: edge.distanceLY });
        graph[edge.target].push({ node: edge.source, cost: edge.cost, dist: edge.distanceLY });
    }

    // Dijkstra
    const dist = {};
    const prev = {};
    const visited = new Set();
    const queue = []; // [ { node, cost } ]

    // Init
    for (const node of Object.keys(graph)) {
        dist[node] = Infinity;
    }
    dist[sourceId] = 0;
    queue.push({ node: sourceId, cost: 0 });

    while (queue.length > 0) {
        // Get the unvisited node with the smallest cost
        queue.sort((a, b) => a.cost - b.cost);
        const { node: current } = queue.shift();

        if (visited.has(current)) continue;
        visited.add(current);

        if (current === targetId) break;

        const neighbors = graph[current] || [];
        for (const { node: neighbor, cost } of neighbors) {
            if (visited.has(neighbor)) continue;
            const newCost = dist[current] + cost;
            if (newCost < dist[neighbor]) {
                dist[neighbor] = newCost;
                prev[neighbor] = current;
                queue.push({ node: neighbor, cost: newCost });
            }
        }
    }

    // Reconstruct path
    if (dist[targetId] === Infinity) {
        return { totalCost: null, path: [], found: false };
    }

    const path = [];
    let cur = targetId;
    while (cur) {
        path.unshift(cur);
        cur = prev[cur];
    }

    return {
        totalCost: dist[targetId],
        path,
        found: true
    };
};
