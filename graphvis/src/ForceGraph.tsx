import { useEffect, useState } from 'react'
import {Graph, IVertex} from './graph/graph'
import {
  Graph as GraphD3,
  GraphConfiguration,
  GraphData,
} from 'react-d3-graph'
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material'

const myConfig: Partial<
  GraphConfiguration<
    | { id: string; color: string; size: number }
    | { id: string; color?: undefined; size?: undefined },
    { source: string; target: string }
  >
> = {
  nodeHighlightBehavior: false,
  width: 1500,
  height: 400,
  node: {
    color: '#000000',
    size: 500,
    labelProperty: 'id',
    highlightStrokeColor: 'red',
    fontSize: 19,
  },
  link: {
    type: 'CURVE_SMOOTH',
    highlightColor: 'lightgrey',
  },
}

function ForceGraph() {
  const [delay, setDelay] = useState('300')
  const [d3Data, setD3Data] = useState<GraphData<any, any> | null>(null)

  const [queue, setQueue] = useState<Array<string>>([])
  const [visited, setVisited] = useState<Array<string>>([])

  const [proceed, setProceed] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [started, setStarted] = useState(false)

  const [graph, setGraph] = useState(() => {
    const newGraph = new Graph(false)
    const vertices = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
    const edges = [
      ['a', 'b'],
      ['a', 'c'],
      ['c', 'd'],
      ['c', 'e'],
      ['a', 'f'],
      ['f', 'g'],
      ['b', 'c'],
      ['b', 'i'],
      ['i', 'e'],
      ['f', 'c'],
    ]

    vertices.forEach((v) => newGraph.addVertex(v))
    edges.forEach((e) => newGraph.addEdge(e[0], e[1]))
    return newGraph
  })

  useEffect(() => {
    setD3Data(graph.getD3Data())
  }, [graph])

  useEffect(() => {
    if (d3Data?.nodes.length === visited.length + 2
        && queue.length <= 1
        && queue.length <= 1)
    {
      setProceed(false)
      setShowAlert(true)
    }
  }, [d3Data?.nodes.length, queue.length, queue.length, visited.length])

  function bfsChange(vertex: string, parentVertex: string) {
    setD3Data((prev) => {
      if (prev) {
        return {
          links: prev.links.map((link) => ({
            ...link,
            strokeWidth:
              (link.source === parentVertex && link.target === vertex) ||
              (link.source === vertex && link.target === parentVertex)
                ? 4
                : link.strokeWidth,
            color:
              (link.source === parentVertex && link.target === vertex) ||
              (link.source === vertex && link.target === parentVertex)
                ? '#52fa00'
                : link.color,
          })),
          nodes: prev.nodes.map((n) => ({
            ...n,
            color: vertex === n.id ? '#105b06' : n.color,
          })),
        }
      }
      return null
    })
  }
  function changeQueue(newQueue: Array<string>) {
    setQueue(newQueue)
  }

  function changeVisited(v: string) {
    setVisited((prev) => [...prev, v])
  }

  const startBfs = () => {
    setProceed(true)
    graph.bfs('a', '_', Number(delay), bfsChange, changeQueue, changeVisited)
  }

  const reset = () => {
    setShowAlert(false)
    setD3Data(graph.getD3Data())
    setVisited([])
    setQueue([])
    setQueue([])
  }

  useEffect(() => {
    if (!!document) {
      document
        ?.querySelector('#read-button')
        ?.addEventListener('click', function () {
          try {
            // @ts-ignore
            let file = document?.querySelector('#file-input')?.files[0]
            let reader = new FileReader()
            reader.addEventListener('load', function (e) {
              try {
                let text = e.target?.result
                setGraph(() => {
                  try {
                    const graphJSON = JSON.parse(text as string) as {
                      oriented: boolean
                      vertices: IVertex
                    }
                    return new Graph(false, graphJSON.vertices)
                  } catch (e) {
                    alert('Неверный формат файла')
                    return new Graph()
                  }
                })
                setQueue([])
                setQueue([])
                setVisited([])
                setProceed(false)
                setShowAlert(false)
              }
              catch (e) {
                alert('Неверный формат файла')
              }
            })
            reader.readAsText(file)
          } catch (e) {
            alert('Неверный формат файла')
          }
        })
    }
  }, [])

  return (
    <div>
      {showAlert && (
        <Alert severity='success'
               sx={{ position: 'absolute', zIndex: 1000, right: 20, bottom: 20 }}>
          <AlertTitle>Обход завершен!</AlertTitle>
          Количество посещенных вершин — <strong>{visited.length}</strong>
        </Alert>
      )}
      {!started && (
        <Button sx={{ fontSize: 20 }}
                onClick={() => {
                  setStarted(true)
                  reset()
                }}>
          Начать!
        </Button>
      )}

      {d3Data && (
        <GraphD3
          id='force-graph'
          data={d3Data as any}
          config={myConfig}
        />
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          disabled={proceed || visited.length !== 0}
          variant={'contained'}
          onClick={startBfs}
        >
          BFS
        </Button>
        <Button disabled={proceed} variant={'outlined'} onClick={reset}>
          Cброс
        </Button>
        <TextField
          disabled={proceed}
          variant="outlined"
          value={delay}
          // @ts-ignore
          onChange={(e) => setDelay(e.target.value)}
          label={'Задержка (в мс)'}
        ></TextField>
      </Box>

      <Card sx={{ position: 'absolute', left: 10, top: 30, minWidth: '200px' }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Очередь
          </Typography>
          <List component="nav">
            {queue.map((el) => (
              <>
                <ListItem>
                  <ListItemText
                    sx={{ display: 'flex', justifyContent: 'center' }}
                    primary={el}
                  />
                </ListItem>
                <Divider />
              </>
            ))}
          </List>
        </CardContent>
      </Card>
      <Card sx={{ position: 'absolute', right: 10, top: 10}}>
        <CardContent>
          <Typography variant="h5" component="div">
            Посещенные
          </Typography>
          <List component="nav">
            {visited.map((el) => (
              <>
                <ListItem>
                  <ListItemText sx={{ display: 'flex', justifyContent: 'center' }}
                                primary={el} />
                </ListItem>
                <Divider />
              </>
            ))}
          </List>
        </CardContent>
      </Card>
    </div>
  );
}

export default ForceGraph