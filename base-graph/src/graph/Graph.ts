import {BaseGraph} from "./BaseGraph";
import {NodeAlreadyExists, NodeNotExists} from "./error/GraphError";

import * as fs from 'fs';

export abstract class Graph extends BaseGraph {
    protected graph: Map<string, string[]>;

    protected constructor(arg?: Graph | string) {
        super()
        if (!arg) {
            this.graph = new Map()
        }
        else {
            if (arg instanceof Graph) {
                this.graph = new Map(arg.graph)
            }
            else {
                this.load(arg)
            }
        }
    }

    addNode(label: string): void {
        if (this.graph.has(label)) {
            throw new NodeAlreadyExists(label);
        }
        this.graph.set(label, [])
    }

    abstract connectNodes(a: string, b: string): void;

    protected fillFromText(text: string): void {
        const lines = text.split('\n')
        for (const line of lines) {
            if (line.trim() !== '') {
                const [node, neighborsStr] = line.split(':')
                const neighbors = neighborsStr.trim().split(' ')

                if (!this.exists(node)) {
                    this.addNode(node)
                }

                for (const neighbor of neighbors) {
                    if (neighbor.trim() !== '') {
                        if (!this.exists(neighbor)) {
                            this.addNode(neighbor)
                        }
                        if (!this.connected(node, neighbor)) {
                            this.connectNodes(node, neighbor)
                        }
                    }
                }
            }
        }
    }

    removeNode(label: string): void {
        if (!this.graph.has(label)) {
            throw new NodeNotExists(label);
        }

        this.graph.delete(label);
        for (let value of this.graph.values()) {
            let elemIndex = value.indexOf(label);
            if (elemIndex != -1) {
                value.splice(elemIndex, 1)
            }
        }
    }

    exists(label: string): boolean {
        return this.graph.has(label)
    }

    connected(a: string, b: string): boolean {
        return this.graph.get(a)!.includes(b)
    }

    getAdjacencyList(): Map<string, string[]> {
        return new Map(this.graph)
    }

    dump(filename: string): void {
        let output = ''
        for (const [k, v] of this.graph.entries()) {
            output += k + ':'
            for (const label of v) {
                output += ' ' + label
            }
            output += '\n'
        }
        fs.writeFileSync(filename, output, 'utf-8')
    }
}