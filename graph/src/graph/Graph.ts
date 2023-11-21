import {
    ConnectionAlreadyExists,
    ConnectionNotExists,
    GraphHasNegativeLoops, GraphHasNegativeWeights,
    GraphIsEmpty,
    GraphIsNotConnected,
    GraphNotWeightedUnoriented,
    InvalidOperandTypes,
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
            if (!this.oriented) {
                for (const [v, neighbors] of this.adj) {
                    for (const [u, w] of neighbors) {
                        this.adj.get(u)!.set(v, w)
                    }
                }
            }
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

    /**
     * Метод, определяющий, есть ли в графе вершина такая, что сумма
     * длин кратчайших путей от нее до всех остальных вершин
     * не превышает `P`. Построен на основе алгоритма Дейкстры.
     * В графе не может быть отрицательных весов.
     * @param P
     */
    taskEight(P: number): boolean {
        /**
         * Вспомогательная функция для определения вершины, до которой
         * путь кратчайший. Возвращает `null`, если пути вообще нет.
         * @param dist расстояния до других вершин
         * @param visited множество посещенных
         */
        const minDistance = (dist: Map<string, number>, visited: Set<string>): string | null => {
            let min = Infinity  // минимальное расстояние
            let minVertex: string | null = null  // метка вершины, до которой расстояние минимальное

            for (const vertex of this.adj.keys()) {
                if (!visited.has(vertex) && dist.get(vertex)! <= min) {
                    min = dist.get(vertex)!
                    minVertex = vertex
                }
            }

            return minVertex
        }

        /**
         * Алгоритм Дейкстры нахождения кратчайших путей.
         * @param source начальная вершина
         */
        const dijkstra = (source: string): Map<string, number> => {
            const dist: Map<string, number> = new Map()  // расстояния до других вершин
            const visited: Set<string> = new Set()  // для контроля уже посещенных вершин

            // инициализируем расстояния бесконечностью
            for (const vertex of this.adj.keys()) {
                dist.set(vertex, Infinity)
            }

            dist.set(source, 0)  // расстояние до самой себя 0

            for (let i = 0; i < this.adj.size - 1; i++) {
                const u = minDistance(dist, visited)
                if (u === null) {
                    break  // если нет путей в непосещенные вершины
                }

                visited.add(u)

                for (const [v, weight] of this.adj.get(u)!.entries()) {
                    if (weight < 0) {
                        throw new GraphHasNegativeWeights()
                    }

                    const newDist = dist.get(u)! + weight
                    if (newDist < dist.get(v)!) {
                        dist.set(v, newDist)
                    }
                }
            }

            return dist
        }

        // вычислить сумму длин кратчайших путей для каждой вершины
        for (const vertex of this.adj.keys()) {
            const dist = dijkstra(vertex)
            const sum = Array.from(dist.values())
                .reduce((acc, val) => acc + val, 0)

            if (sum > P) {
                return false
            }
        }

        return true
    }

    /**
     * Метод, возвращающий для данной вершины кратчайшие пути до других
     * вершин. При этом в графе могут присутствовать отрицательные веса,
     * но не может быть отрицательных циклов. В графе могут быть отрицательные
     * веса, но не может быть отрицательных циклов. Реализация построена
     * на основе алгоритма Беллмана-Форда.
     *
     * @param sourceVertex вершина, от которой искать кратчайшие пути
     */
    taskNine(sourceVertex: string): Map<string, { distance: number, path: string[] }> {
        if (!this.exists(sourceVertex)) {
            throw new NodeNotExists(sourceVertex)
        }

        const paths: Map<string, { distance: number, path: string[] }> = new Map()

        // инициализировать расстояния до всех вершин бесконечностью, кроме начальной вершины
        for (const vertex of this.adj.keys()) {
            paths.set(vertex, {
                distance: Infinity,
                path: []
            })
        }
        paths.set(sourceVertex, { distance: 0, path: [] })

        // релаксация ребер
        for (let i = 0; i < this.adj.size - 1; i++) {
            for (const [u, neighbors] of this.adj.entries()) {
                for (const [v, weight] of neighbors.entries()) {
                    const uDist = paths.get(u)!.distance
                    const vDist = paths.get(v)!.distance

                    if (uDist + weight < vDist) {  // если d(u) + w < d(v)
                        paths.set(v, {
                            distance: uDist + weight,
                            path: [...paths.get(u)!.path, u]
                        })  // то d(v) <- d(u) + w
                    }
                }
            }
        }

        // проверка на отрицательные циклы
        for (const [u, neighbors] of this.adj.entries()) {
            for (const [v, weight] of neighbors.entries()) {
                const uDist = paths.get(u)!.distance
                const vDist = paths.get(v)!.distance

                if (uDist + weight < vDist) {
                    throw new GraphHasNegativeLoops()
                }
            }
        }

        return paths
    }

    /**
     * Метод, который находит кратчайший путь между двумя данными
     * вершинами `u` и `v`. В графе могут быть отрицательные циклы.
     * Реализация построена на алгоритме Флойда.
     * @param u начальная вершина
     * @param v конечная вершина
     */
    public taskTen(u: string, v: string): { distance: number; path: string[] } {
        if (!this.exists(u)) {
            throw new NodeNotExists(u)
        }
        if (!this.exists(v)) {
            throw new NodeNotExists(v)
        }

        // Map, связывающая строковую метку вершины с числом
        const indexOf = new Map(Array.from(this.adj.keys()).map((v, i) => [v, i]))
        const labelOf = new Map(Array.from(this.adj.keys()).map((v, i) => [i, v]))
        // Список смежности, только метки теперь числа
        const adj = new Map(Array.from(this.adj.entries()).map((v, i) =>
            [i, new Map(Array.from(v[1]).map(v => [indexOf.get(v[0])!, v[1]]))]
        ))
        const vertices = Array.from(adj.keys())

        // инициализировать матрицу расстояний и матрицу следующих вершин
        const dist: number[][] = []
        const next: (number | null)[][] = []

        for (const i of vertices) {
            dist[i] = []
            next[i] = []
            for (const j of vertices) {
                dist[i][j] = i === j ? 0 : Infinity
                next[i][j] = null
            }
        }

        // заполнить матрицу расстояний на основе весов списка смежности
        for (const [src, neighbors] of adj.entries()) {
            for (const [dst, weight] of neighbors.entries()) {
                dist[src][dst] = weight
                next[src][dst] = dst // установить следующую вершину в соответствии с ребром
            }
        }

        // алгоритм Флойда
        for (const k of vertices) {
            for (const i of vertices) {
                for (const j of vertices) {
                    if (dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j]
                        next[i][j] = next[i][k]
                    }
                }
            }
        }

        // построить кратчайший путь
        const path: string[] = []
        let current = indexOf.get(u) ?? null
        let target = indexOf.get(v)!

        while (current !== target) {
            if (current === null) {
                // нет пути из `u` в `v`
                return { distance: Infinity, path: [] }
            }
            path.push(labelOf.get(current)!)
            current = next[current][target]
        }
        path.push(labelOf.get(target)!)

        return { distance: dist[indexOf.get(u)!][indexOf.get(v)!], path }
    }

    /**
     * Метод, находящий максимальный поток а графе, используя алгоритм
     * Форда-Фалкерсона.
     * @param source источник
     * @param sink сток
     */
    public taskEleven(source: string, sink: string): number {
        if (!this.exists(source)) {
            throw new NodeNotExists(source)
        }
        if (!this.exists(sink)) {
            throw new NodeNotExists(sink)
        }

        // создать остаточный граф с теми же вершинами, что и в изначальном
        const resGraph: Map<string, Map<string, number>> = new Map()
        for (const [vertex, edges] of this.adj.entries()) {
            resGraph.set(vertex, new Map(edges))
        }

        let maxFlow = 0

        // расширять поток, пока есть расширяющий путь
        let path = this.findAugmentingPath(resGraph, source, sink)
        while (path.length > 0) {
            // найти минимальную пропускную способность
            const minCapacity = this.findMinCapacity(resGraph, path)

            // обновить остаточный граф вычитанием минимальной пропускной способности
            for (let i = 0; i < path.length - 1; i++) {
                const u = path[i]
                const v = path[i + 1]

                resGraph.get(u)!.set(v, resGraph.get(u)!.get(v)! - minCapacity)

                // добавить обратную дугу с отрицательным весом
                if (!resGraph.has(v)) {
                    resGraph.set(v, new Map())
                }

                if (!resGraph.get(v)!.has(u)) {
                    resGraph.get(v)!.set(u, 0)
                }

                resGraph.get(v)!.set(u, resGraph.get(v)!.get(u)! + minCapacity)
            }

            // обновить значение максимального потока
            maxFlow += minCapacity

            // найти максимальный расширяющий путь
            path = this.findAugmentingPath(resGraph, source, sink)
        }

        return maxFlow
    }

    /**
     * Метод поиска расширяющих путей, построенный на DFS.
     * @param graph список смежности
     * @param source источник
     * @param sink сток
     * @private
     */
    private findAugmentingPath(graph: Map<string, Map<string, number>>, source: string, sink: string): string[] {
        const visited: Set<string> = new Set()
        const path: string[] = []

        this.fordDfs(graph, source, sink, visited, path)

        return path
    }

    /**
     * Обход в глубину.
     */
    private fordDfs(graph: Map<string, Map<string, number>>, current: string, sink: string, visited: Set<string>, path: string[]): void {
        visited.add(current)
        path.push(current)

        if (current === sink) {
            return
        }

        for (const neighbor of graph.get(current)!.keys()) {
            if (!visited.has(neighbor) && graph.get(current)!.get(neighbor)! > 0) {
                this.fordDfs(graph, neighbor, sink, visited, path)
                if (path[path.length - 1] === sink) {
                    return
                }
                path.pop()
            }
        }
    }

    /**
     * Вспомогательный метод, находящий минимальную пропускную способность
     * в пути.
     */
    private findMinCapacity(graph: Map<string, Map<string, number>>, path: string[]): number {
        let minCapacity = Infinity

        for (let i = 0; i < path.length - 1; i++) {
            const u = path[i]
            const v = path[i + 1]
            minCapacity = Math.min(minCapacity, graph.get(u)!.get(v)!)
        }

        return minCapacity
    }
}
