import {IUnorientedGraph} from '@graph/interfaces/IUnorientedGraph';
import {
    ConnectionAlreadyExists,
    NodeAlreadyExists,
    NodeNotExists,
} from '@graph/error/GraphError';

export class UnorientedGraph implements IUnorientedGraph {
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
        this.graph.get(b)!.push(a);
    }

    removeNode(label: string): void {
        if (!this.graph.has(label)) {
            throw new NodeNotExists(label);
        }

        this.graph.delete(label);
        for (let value of this.graph.values()) {
            value.splice(value.indexOf(label), 1)
        }
    }

    getAdjacencyList(): Map<string, string[]> {
        return new Map(this.graph)
    }
}