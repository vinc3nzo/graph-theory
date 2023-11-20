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

export class InvalidOperandTypes extends GraphError {
    constructor() {
        super('Неверные типы операндов.');
    }
}

export class GraphNotWeightedUnoriented extends GraphError {
    constructor() {
        super('Операция может быть выполнена только для взвешенного неориентированного графа.')
    }
}

export class GraphIsEmpty extends GraphError {
    constructor() {
        super('Операция может быть выполнена только на непустом графе.')
    }
}

export class GraphIsNotConnected extends GraphError {
    constructor() {
        super('Граф несвязный.')
    }
}

export class GraphHasNegativeWeights extends GraphError {
    constructor() {
        super('В графе есть отрицательные веса.')
    }
}

export class GraphHasNegativeLoops extends GraphError {
    constructor() {
        super('В графе есть отрицательные циклы.')
    }
}