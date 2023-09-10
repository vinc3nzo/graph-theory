import {IWeightedUnorientedGraph} from "@graph/interfaces/IWeightedUnorientedGraph";
import {
    ConnectionAlreadyExists,
    NodeAlreadyExists,
    NodeNotExists,
} from '@graph/error/GraphError';

export class WeightedUnorientedGraph<T> implements IWeightedUnorientedGraph<T> {
    private readonly graph: Map<string, Array<[string, T]>>;

    constructor() {
        this.graph = new Map()
    }

    addNode(label: string): void {
        if (this.graph.has(label)) {
            throw new NodeAlreadyExists(label);
        }
        this.graph.set(label, [])
    }

    connectNodes(a: string, b: string, weight: T): void {
        if (!this.graph.has(a)) {
            throw new NodeNotExists(a)
        }
        if (!this.graph.has(b)) {
            throw new NodeNotExists(b)
        }

        let existingConnection = this.graph.get(a)!.find(
            (value) => value[0] == b
        )
        if (existingConnection) {
            throw new ConnectionAlreadyExists(a, b)
        }

        this.graph.get(a)!.push([b, weight])
        this.graph.get(b)!.push([a, weight])
    }

    removeNode(label: string): void {
        if (!this.graph.has(label)) {
            throw new NodeNotExists(label);
        }

        this.graph.delete(label);
        for (let value of this.graph.values()) {
            delete value[value.findIndex((record) => record[0] == label)]
        }
    }

    getAdjacencyList(): Map<string, [string, T][]> {
        return new Map(this.graph)
    }
}