export class GraphError extends Error {
    public constructor(what: string) {
        super(what);
    }
}

export class NodeNotExists extends GraphError {
    public constructor(node: string) {
        super(`The requested node "${node}" doesn't exist in the graph.`);
    }
}

export class NodeAlreadyExists extends GraphError {
    public constructor(node: string) {
        super(`The node "${node}" already exists in the graph.`);
    }
}

export class ConnectionAlreadyExists extends GraphError {
    public constructor(a: string, b: string) {
        super(`A connection between node "${a}" and node "${b}" already exists.`);
    }
}