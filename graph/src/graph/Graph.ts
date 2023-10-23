import {
    ConnectionAlreadyExists,
    ConnectionNotExists, GraphIsEmpty, GraphIsNotConnected, GraphNotWeightedUnoriented, InvalidOperandTypes,
    NodeAlreadyExists,
    NodeNotExists,
    WeightsInNonWeightedGraph
} from "./error/GraphError";


type Edge = {
    from: string,
    to: string,
    weight: number,
}

export class Graph {

    private adj: Map<string, Map<string, number>> = new Map()
    private weighted: boolean = false
    private oriented: boolean = false

    constructor(weighted: boolean, oriented: boolean)
    constructor(textRepr: string)
    constructor(other: Graph)
    constructor(arg1: boolean | string | Graph, arg2?: boolean) {
        if (typeof arg1 === 'boolean' && typeof arg2 === 'boolean') {
            this.weighted = arg1
            this.oriented = arg2
            this.adj = new Map()
        }
        else if (typeof arg1 === 'string' && arg2 == null) {
            this.loadFromFile(arg1)
        }
        else if (arg1 instanceof Graph && arg2 == null) {
            this.weighted = arg1.weighted
            this.oriented = arg1.oriented
            this.adj = new Map(arg1.adj)
        }
        else {
            throw new Error('Invalid arguments')
        }
    }

    isWeighted(): boolean {
        return this.weighted
    }

    isOriented(): boolean {
        return this.oriented
    }

    changeOriented(oriented: boolean) {
        if (oriented !== this.oriented) {
            this.oriented = oriented
            this.adj = new Map()
        }
    }

    changeWeighted(weighted: boolean) {
        if (weighted !== this.weighted) {
            this.weighted = weighted
            this.adj = new Map()
        }
    }

    addNode(label: string) {
        if (this.adj.has(label)) {
            throw new NodeAlreadyExists(label)
        }
        this.adj.set(label, new Map())
    }

    removeNode(label: string) {
        if (!this.adj.has(label)) {
            throw new NodeNotExists(label)
        }

        this.adj.delete(label)
        for (let value of this.adj.values()) {
            value.delete(label)
        }
    }

    connect(a: string, b: string, weight?: number) {
        if (!this.adj.has(a)) {
            throw new NodeNotExists(a)
        }
        if (!this.adj.has(b)) {
            throw new NodeNotExists(b)
        }
        if (this.adj.get(a)!.has(b)) {
            throw new ConnectionAlreadyExists(a, b)
        }

        if (this.weighted) {
            this.adj.get(a)!.set(b, weight!)
            if (!this.oriented) {
                this.adj.get(b)!.set(a, weight!)
            }
        }
        else {
            if (weight) {
                throw new WeightsInNonWeightedGraph()
            }
            this.adj.get(a)!.set(b, 0)
            if (!this.oriented) {
                this.adj.get(b)!.set(a, 0)
            }
        }
    }

    disconnect(a: string, b: string) {
        if (!this.adj.has(a)) {
            throw new NodeNotExists(a)
        }
        if (!this.adj.has(b)) {
            throw new NodeNotExists(b)
        }
        if (!this.adj.get(a)!.has(b)) {
            throw new ConnectionNotExists(a, b)
        }

        this.adj.get(a)!.delete(b)
        if (!this.oriented) {
            this.adj.get(b)!.delete(a)
        }
    }

    exists(label: string): boolean {
        return this.adj.has(label)
    }

    connected(a: string, b: string): boolean {
        return this.adj.has(a) && this.adj.get(a)!.has(b)
    }

    getAdjacent(label: string): Map<string, number> {
        if (!this.adj.has(label)) {
            throw new NodeNotExists(label)
        }
        return this.adj.get(label)!
    }

    private loadFromFile(content: string) {
        const obj: any = JSON.parse(content)
        this.weighted = obj.weighted
        this.oriented = obj.oriented
        this.adj = this.objToMap(obj.adj)
    }

    dump(): string {
        let adjListObj: any = {}
        for (const [k, v] of this.adj) {
            let innerObject: any = {}
            for (const [k, w] of v) {
                innerObject[k] = w
            }
            adjListObj[k] = innerObject
        }

        let graphObj: any = {
            weighted: this.weighted,
            oriented: this.oriented,
            adj: adjListObj
        }

        return JSON.stringify(graphObj)
    }

    getAdjacencyList(): [string, [string, number][]][] {
        let res: [string, [string, number][]][] = []
        for (const entry of this.adj.entries()) {
            res.push([entry[0], [...entry[1].entries()]])
        }
        return res
    }

    private objToMap(obj: any): Map<string, Map<string, number>> {
        const map = new Map()
        const keys = Object.keys(obj)
        for (const key of keys) {
            const inner: any = obj[key]
            const innerMap: Map<string, number> = new Map()
            const innerKeys = Object.keys(inner)
            for (const key of innerKeys) {
                innerMap.set(key, inner[key] as number)
            }
            map.set(key, innerMap)
        }
        return map
    }

    intersect(other: Graph): Graph {
        if (!this.oriented || !other.oriented) {
            throw new InvalidOperandTypes()
        }

        const res = new Graph(this.weighted || other.weighted, true)
        const intersection = new Map<string, Map<string, number>>()

        const commonNodes = Array.from(this.adj.keys()).filter(node => other.adj.has(node))

        for (const node of commonNodes) {
            const neighborsA = this.adj.get(node) || new Map<string, number>()
            const neighborsB = other.adj.get(node) || new Map<string, number>()
            const commonNeighbors = new Map<string, number>()

            for (const [neighbor, weightA] of neighborsA) {
                if (neighborsB.has(neighbor)) {
                    const weightB = neighborsB.get(neighbor) || 0
                    commonNeighbors.set(neighbor, Math.min(weightA, weightB))
                }
            }

            intersection.set(node, commonNeighbors)
        }

        res.adj = intersection
        return res
    }

    public connectedComponents(): number {
        const visited: Set<string> = new Set()

        let count = 0 // количество компонент
        for (const node of this.adj.keys()) {
            if (!visited.has(node)) { // если еще не посетили, выполнить DFS
                count++ // новая компонента
                this.dfs(node, visited) // DFS посещаем все узлы в этой компоненте связности
            }
        }

        return count
    }

    private dfs(node: string, visited: Set<string>) {
        visited.add(node)

        const neighbors = this.adj.get(node)!
        for (const neighbor of neighbors.keys()) {
            if (!visited.has(neighbor)) {
                this.dfs(neighbor, visited) // рекурсивно обойти соседние узлы
            }
        }
    }

    public shortestPathLengthsFrom(u: string): Map<string, number> {
        if (!this.adj.has(u)) {
            throw new NodeNotExists(u)
        }

        const shortestPaths: Map<string, number> = new Map()

        for (const node of this.adj.keys()) {
            shortestPaths.set(node, -1) // пока считаем, что расстояния до других узлов -1
        }
        shortestPaths.set(u, 0) // расстояние до самого себя 0

        const queue = [u] // очередь обхода
        while (queue.length > 0) {
            const currentNode = queue.shift()!
            const neighbors = this.adj.get(currentNode)!

            for (const neighbor of neighbors.keys()) {
                if (shortestPaths.get(neighbor) === -1) { // если узел еще не был посещен
                    // установить кратчайшее расстояние до него
                    shortestPaths.set(neighbor, shortestPaths.get(currentNode)! + 1)
                    queue.push(neighbor) // добавить соседний узел в очередь обхода
                }
            }
        }

        return shortestPaths
    }

    public mst(): Graph {
        if (!this.weighted || this.oriented) {
            throw new GraphNotWeightedUnoriented()
        }

        const mst = new Graph(true, false) // минимальное остовное дерево
        const visited = new Set<string>() // множество посещенных вершин

        // взять любую вершину как начальную (здесь первая)
        const startVertex = this.adj.keys().next().value
        if (!startVertex) {
            throw new GraphIsEmpty()
        }
        visited.add(startVertex)
        mst.addNode(startVertex)

        while (visited.size < this.adj.size) { // пока не посетим все вершины
            // ребра, которые соединяют посещенные вершины с непосещенными
            const edges: Array<Edge> = []

            for (const vertex of visited) { // найти такие ребра
                for (const [neighbor, weight] of this.adj.get(vertex)!) {
                    if (!visited.has(neighbor)) {
                        edges.push({ from: vertex, to: neighbor, weight });
                    }
                }
            }

            if (edges.length === 0) {
                // Не все вершины еще посещены, но мы не смогли найти новые ребра.
                // Это значит, что граф несвязный.
                throw new GraphIsNotConnected()
            }

            // выбрать ребро с наименьшим весом
            edges.sort((a, b) => a.weight - b.weight)
            const { from, to, weight } = edges[0]

            // добавить ребро в минимальное остовное дерево
            mst.addNode(to)
            mst.connect(from, to, weight)
            visited.add(to)
        }

        return mst
    }
}