import {Graph} from 'graph/Graph'

const graph = new Graph('graph.txt');
console.log(graph.getAdjacencyList());

graph.removeNode('b')
console.log(graph.getAdjacencyList())

graph.dump('out_graph.txt')
