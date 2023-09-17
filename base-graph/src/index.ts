import {WeightedUnorientedGraph} from "graph/impl/WeightedUnorientedGraph";

const graph = new WeightedUnorientedGraph();
console.log(graph.getAdjacencyList())
graph.addNode('aboba')
graph.addNode('boba')
graph.addNode('beeba')
graph.connectNodes('aboba', 'boba', 1)
graph.connectNodes('aboba', 'beeba', 5)
console.log(graph.getAdjacencyList())

graph.removeNode('aboba')
console.log(graph.getAdjacencyList())