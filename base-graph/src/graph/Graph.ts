import * as fs from 'fs';
import {ConnectionAlreadyExists, NodeAlreadyExists, NodeNotExists} from "./error/GraphError";


export class Graph {
    private adj: Map<string, Map<string, number>>
    private weighted: boolean
    private oriented: boolean

    constructor(weighted: boolean, oriented: boolean)
    constructor(filename: string)
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

    addNode(label: string) {
        if (this.adj.has(label)) {
            throw new NodeAlreadyExists(label);
        }
        this.adj[label] = new Map()
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
        if (this.adj[a].has(b)) {
            throw new ConnectionAlreadyExists(a, b)
        }

        if (this.weighted) {
            this.adj[a][b] = weight
            if (!this.oriented) {
                this.adj[b][a] = weight
            }
        }
        else {
            if (weight != null) {
                throw new Error('Attempt to use weights in a non-weighted graph')
            }
            this.adj[a][b] = 0
            if (!this.oriented) {
                this.adj[b][a] = 0
            }
        }
    }

    exists(label: string): boolean {
        return this.adj.has(label)
    }

    connected(a: string, b: string): boolean {
        return this.adj.has(a) && this.adj[a].has(b)
    }

    private loadFromFile(filename: string) {
        const text = fs.readFileSync(filename, 'utf-8')
        const obj: Graph = JSON.parse(text)
        this.weighted = obj.weighted
        this.oriented = obj.oriented
        this.adj = new Map()

        const keys = 
    }

    dump(filename: string): void {
        let output = ''
        if (this.weighted) {
            output += 'w'
        }
        if (this.oriented) {
            output += ' o'
        }

        if (this.weighted) {
            for (const [k, v] of this.adj) {
                output += k + ':'
                for (const [label, weight] of v) {
                    output += ' ' + label + '[' + weight + ']'
                }
                output += '\n'
            }
        }
        else {
            for (const [k, v] of this.adj.entries()) {
                output += k + ':'
                for (const label of v) {
                    output += ' ' + label
                }
                output += '\n'
            }
        }
        fs.writeFileSync(filename, output, 'utf-8')
    }

    private objToMap(): Map<string, Map<string, number>> {
        const map = new Map()
        for (let )
    }

    getAdjacencyList(): Map<string, Map<string, number>> {
        return new Map(this.adj)
    }
}