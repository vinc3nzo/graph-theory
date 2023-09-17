import {BaseGraph} from "./BaseGraph";
import {NodeAlreadyExists, NodeNotExists} from "./error/GraphError";

import * as fs from 'fs';

export abstract class WeightedGraph extends BaseGraph {
    protected adj: Map<string, Map<string, number>>

    protected constructor(arg?: WeightedGraph | string) {
        super()
        if (!arg) {
            this.adj = new Map()
        }
        else {
            if (arg instanceof WeightedGraph) {
                this.adj = new Map(arg.adj)
            }
            else {
                this.load(arg)
            }
        }
    }

    addNode(label: string): void {
        if (this.adj.has(label)) {
            throw new NodeAlreadyExists(label);
        }
        this.adj.set(label, new Map())
    }

    abstract connectNodes(a: string, b: string, weight: number): void

    protected fillFromText(text: string): void {
        const lines = text.trim().split('\n');

        for (const line of lines) {
            let [source, destinationsText] = line.split(':');
            if (!this.exists(source)) {
                this.addNode(source)
            }

            destinationsText = destinationsText.trim()
            if (destinationsText === '') {
                continue
            }

            const destinations = destinationsText.split(' ');
            for (const destination of destinations) {
                const [node, weight] = destination.split('[');
                const destinationNode = node.trim();
                const destinationWeight = parseFloat(weight.slice(0, -1));

                if (!this.exists(destinationNode)) {
                    this.addNode(destinationNode)
                }

                if (!this.connected(source, destinationNode)) {
                    this.connectNodes(source, destinationNode, destinationWeight)
                }
            }
        }
    }

    removeNode(label: string): void {
        if (!this.adj.has(label)) {
            throw new NodeNotExists(label);
        }

        this.adj.delete(label);
        for (let value of this.adj.values()) {
            value.delete(label)
        }
    }

    exists(label: string): boolean {
        return this.adj.has(label)
    }

    connected(a: string, b: string): boolean {
        return this.adj.get(a)?.get(b) != undefined
    }

    getAdjacencyList(): Map<string, Map<string, number>> {
        return new Map(this.adj)
    }

    dump(filename: string): void {
        let output = ''
        for (const [k, v] of this.adj) {
            output += k + ':'
            for (const [label, weight] of v) {
                output += ' ' + label + '[' + weight + ']'
            }
            output += '\n'
        }
        fs.writeFileSync(filename, output, 'utf-8')
    }
}