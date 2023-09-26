export class GraphError extends Error {}

export class NodeNotExists extends GraphError {
    constructor(node: string) {
        super(`Запрошенный узел "${node}" не существует в графе.`);
    }
}

export class NodeAlreadyExists extends GraphError {
    constructor(node: string) {
        super(`Узел "${node}" уже есть в графе.`);
    }
}

export class ConnectionAlreadyExists extends GraphError {
    constructor(a: string, b: string) {
        super(`Связь между узлом "${a}" и узлом "${b}" уже существует.`);
    }
}

export class ConnectionNotExists extends GraphError {
    constructor(a: string, b: string) {
        super(`Связи между узлами "${a}" и "${b}" не существует.`);
    }
}

export class WeightsInNonWeightedGraph extends GraphError {
    constructor() {
        super('Попытка использовать вес в невзвешенном графе.');
    }
}