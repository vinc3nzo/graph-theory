import {
    ConnectionAlreadyExists,
    NodeNotExists,
} from 'graph/error/GraphError';

import {WeightedGraph} from "graph/WeightedGraph";
import * as fs from "fs";

export class WeightedOrientedGraph extends WeightedGraph {
    constructor(arg?: WeightedOrientedGraph | string) {
        super(arg)
    }

    connectNodes(a: string, b: string, weight: number): void {
        if (!this.adj.has(a)) {
            throw new NodeNotExists(a)
        }
        if (!this.adj.has(b)) {
            throw new NodeNotExists(b)
        }
        if (this.adj.get(a)!.has(b)) {
            throw new ConnectionAlreadyExists(a, b)
        }
        this.adj.get(a)!.set(b, weight)
    }

    load(filename: string): void {
        const graph = new WeightedOrientedGraph()
        const text = fs.readFileSync(filename, 'utf-8')
        graph.fillFromText(text)
        this.adj = graph.getAdjacencyList()
    }
}