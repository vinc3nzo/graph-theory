import {UnorientedGraph} from "@graph/impl/UnorientedGraph";

const graph = new UnorientedGraph();

console.log(graph.getAdjacencyList())
graph.addNode('aboba')
graph.addNode('boba')
graph.addNode('beeba')
graph.connectNodes('aboba', 'boba')
graph.connectNodes('aboba', 'beeba')
console.log(graph.getAdjacencyList())

graph.removeNode('aboba')
console.log(graph.getAdjacencyList())