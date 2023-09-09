import {IOrientedGraph} from '@graph/interfaces/IOrientedGraph';
import {
    ConnectionAlreadyExists,
    NodeAlreadyExists,
    NodeNotExists,
} from '@graph/error/GraphError';

export class OrientedGraph implements IOrientedGraph {
    private graph: Map<string, Array<string>>;

    public constructor() {
        this.graph = new Map()
    }

    public addNode(label: string): void {
        if (this.graph.has(label)) {
            throw new NodeAlreadyExists(label);
        }
        this.graph.set(label, [])
    }

    public connectNodes(a: string, b: string): void {
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

    public removeNode(label: string): void {
        if (!this.graph.has(label)) {
            throw new NodeNotExists(label);
        }

        this.graph.delete(label);
        for (let value of this.graph.values()) {
            delete value[value.indexOf(label)]
        }
    }

    
}