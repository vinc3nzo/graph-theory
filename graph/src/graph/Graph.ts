import {
    ConnectionAlreadyExists,
    ConnectionNotExists,
    NodeAlreadyExists,
    NodeNotExists,
    WeightsInNonWeightedGraph
} from "./error/GraphError";


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
}