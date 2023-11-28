import { GraphData } from 'react-d3-graph'

type KeyType = string | number

type VertexItemType = {
  weight: number
  value: KeyType
}

export interface IEdge {
  weight: number
  from: KeyType
  to: KeyType
}

export type IVertex = {
  [key in KeyType]: Array<VertexItemType>
}

export class Graph {
  private vertices: IVertex
  private oriented: boolean

  public constructor(oriented?: boolean, vertices?: IVertex) {
    this.vertices = vertices ?? {}
    this.oriented = Boolean(oriented)
  }

  public getD3Data() {
    const data: GraphData<any, any> = {
      nodes: Object.keys(this.vertices).map((vert) => ({
        id: vert,
      })),
      links: Object.entries(this.vertices)
        .map(([key, value]) => {
          return value.map((v) => {
            return {
              source: key,
              target: v.value,
              color: '#2f6bbe',
              strokeWidth: 2,
              markerWidth: 5,
            };
          });
        })
        .flat(),
    };
    const newLinks: typeof data.links = [];
    const prevLinks = data.links;
    // @ts-ignore
    prevLinks.forEach((link) => {
      if (
        !newLinks.find(
          // @ts-ignore
          (l) => l.source === link.target && l.target === link.source,
        )
      ) {
        newLinks.push(link);
      }
    });
    return {
      nodes: data.nodes,
      links: newLinks,
    };
  }

  async bfs(
    startVertex: KeyType,
    badVertex: KeyType,
    delay?: number,
    setD3Data?: (v: string, parentV: string) => void,
    setStack?: (arr: Array<string>) => void,
    setVisited?: (v: string) => void,
  ) {
    let list = this.vertices; // список смежности

    let stack = [startVertex]; // стек вершин для перебора
    let visited = { [startVertex]: 1 }; // посещенные вершины

    // кратчайшее расстояние от стартовой вершины
    let distance = { [startVertex]: 0 };
    // предыдущая вершина в цепочке
    let previous: { [key in string]: KeyType | null } = { [startVertex]: null };

    async function processItem(neighbour: VertexItemType, vertex: string) {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          if (!visited[neighbour.value] && neighbour.value !== badVertex) {
            // отмечаем вершину как посещенную
            visited[neighbour.value] = 1;
            if (setVisited) setVisited(neighbour.value as string);
            if (setD3Data) setD3Data(neighbour.value as string, vertex);
            // добавляем в стек
            stack.push(neighbour.value);
            previous[neighbour.value] = vertex;
            // сохраняем расстояние
            distance[neighbour.value] = distance[vertex] + 1;
          }
          resolve();
        }, delay ?? 1000);
      });
    }

    async function processArray(array: Array<VertexItemType>, vertex: string) {
      for (let i = 0; i < array.length; i++) {
        await processItem(array[i], vertex);
      }
    }

    async function handleVertex(vertex: KeyType) {
      // получаем список смежных вершин
      let reversedNeighboursList = [...list[vertex]].reverse();
      await processArray(reversedNeighboursList, vertex as string);
    }

    // перебираем вершины из стека, пока он не опустеет
    while (stack.length) {
      if (setStack) setStack(stack as Array<string>);
      let activeVertex = stack.pop();
      await handleVertex(activeVertex as KeyType);
    }

    return { distance, previous };
  }

  public addVertex(vertex: KeyType) {
    if (!this.vertices[vertex]) this.vertices[vertex] = [];
  }

  //откуда -> куда
  public addEdge(vertex1: KeyType, vertex2: KeyType, weight?: number) {
    if (!(vertex1 in this.vertices) || !(vertex2 in this.vertices)) {
      throw new Error('В графе нет таких вершин');
    }

    if (
      (!this.vertices[vertex1].find((el) => el.value === vertex2) &&
        !this.oriented) ||
      this.oriented
    ) {
      this.vertices[vertex1].push({
        value: vertex2,
        weight: weight ?? 0,
      });
    }

    if (
      !this.vertices[vertex2].find((el) => el.value === vertex1) &&
      !this.oriented
    ) {
      this.vertices[vertex2].push({
        value: vertex1,
        weight: weight ?? 0,
      });
    }
  }
}