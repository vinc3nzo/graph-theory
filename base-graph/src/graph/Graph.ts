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
        const lines = fs.readFileSync(filename, 'utf-8').split('\n')
        const firstLine = lines[0].trim()
        const graphParams = firstLine.split(' ')

        this.adj = new Map()
        this.weighted = graphParams.includes('w')
        this.oriented = graphParams.includes('o')

        for (const line of lines.slice(1)) {
            if (line.trim() !== '') {
                const [node, neighborsStr] = line.split(':')
                const neighbors = neighborsStr.trim().split(' ')

                if (!this.exists(node)) {
                    this.addNode(node)
                }

                for (const neighbor of neighbors) {
                    if (neighbor.trim() !== '') {
                        if (this.weighted) {
                            const [neighborNode, weight] = neighbor.split('[')
                            const destinationNode = neighborNode.trim()
                            const destinationWeight = parseFloat(weight.slice(0, -1))

                            if (!this.exists(destinationNode)) {
                                this.addNode(destinationNode)
                            }

                            if (!this.connected(node, destinationNode)) {
                                this.connect(node, destinationNode, destinationWeight)
                                if (!this.oriented) {
                                    this.connect(destinationNode, node, destinationWeight)
                                }
                            }
                        }
                        else {
                            if (!this.exists(neighbor)) {
                                this.addNode(neighbor)
                            }
                            if (!this.connected(node, neighbor)) {
                                this.connect(node, neighbor)
                                if (!this.oriented) {
                                    this.connect(neighbor, node)
                                }
                            }
                        }
                    }
                }
            }
        }
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

    getAdjacencyList(): Map<string, Map<string, number>> {
        return new Map(this.adj)
    }
}