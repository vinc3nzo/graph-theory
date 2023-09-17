import {WeightedGraph} from "./graph/WeightedGraph";
import {WeightedUnorientedGraph} from "./graph/impl/WeightedUnorientedGraph";

const graph: WeightedGraph = new WeightedUnorientedGraph('graph.txt');
console.log(graph.getAdjacencyList());

graph.removeNode('b')
console.log(graph.getAdjacencyList())

graph.dump('out_graph.txt')
