import {
    ConnectionAlreadyExists,
    NodeNotExists,
} from 'graph/error/GraphError';

import {WeightedGraph} from "../WeightedGraph";
import * as fs from "fs";


export class WeightedUnorientedGraph extends WeightedGraph {
    constructor(arg?: WeightedUnorientedGraph | string) {
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
        this.adj.get(b)!.set(a, weight)
    }

    load(filename: string): void {
        const graph = new WeightedUnorientedGraph()
        const text = fs.readFileSync(filename, 'utf-8')
        graph.fillFromText(text)
        this.adj = graph.getAdjacencyList()
    }
}