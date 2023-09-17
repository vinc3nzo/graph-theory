import {
    ConnectionAlreadyExists,
    NodeAlreadyExists,
    NodeNotExists,
} from 'graph/error/GraphError';

import {Graph} from "../Graph";
import * as fs from "fs";

export class OrientedGraph extends Graph {
    constructor(arg?: OrientedGraph | string) {
        super(arg)
    }

    connectNodes(a: string, b: string): void {
        if (!this.graph.has(a)) {
            throw new NodeNotExists(a)
        }
        if (!this.graph.has(b)) {
            throw new NodeNotExists(b)
        }
        if (this.graph.get(a)!.includes(b)) {
            throw new ConnectionAlreadyExists(a, b)
        }
        this.graph.get(a)!.push(b);
    }

    load(filename: string): void {
        const graph = new OrientedGraph()
        const text = fs.readFileSync(filename, 'utf-8')
        graph.fillFromText(text)
        this.graph = graph.getAdjacencyList()
    }
}