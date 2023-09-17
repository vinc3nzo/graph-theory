import {
    ConnectionAlreadyExists,
    NodeAlreadyExists,
    NodeNotExists,
} from 'graph/error/GraphError';

export class OrientedGraph {
    private readonly graph: Map<string, string[]>;

    constructor() {
        this.graph = new Map()
    }

    addNode(label: string): void {
        if (this.graph.has(label)) {
            throw new NodeAlreadyExists(label);
        }
        this.graph.set(label, [])
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

    removeNode(label: string): void {
        if (!this.graph.has(label)) {
            throw new NodeNotExists(label);
        }

        this.graph.delete(label);
        for (let value of this.graph.values()) {
            delete value[value.indexOf(label)]
        }
    }

    getAdjacencyList(): Map<string, string[]> {
        return new Map(this.graph)
    }
}