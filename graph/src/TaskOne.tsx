import './TaskOne.css'
import {Graph} from './graph/Graph'
import React, {useEffect, useRef, useState} from 'react'
import {Table, TableBody, TableCell, TableHead, TableRow} from '@mui/material'
import GraphLoader from "./util/GraphLoader";
import GraphView from "./GraphView";

function TaskOne() {
  const graph = useRef<Graph | null>(null)
  const [shouldRerender, setShouldRerender] = useState<boolean>(false)

  useEffect(() => {
      setShouldRerender(false)
    }, [shouldRerender]
  )

  function onGraphLoaded(jsonContent: string) {
    try {
      graph.current = new Graph(jsonContent)
    }
    catch (e) {
      alert('Неверный формат файла')
      return
    }

    if (!graph.current.isOriented()) {
      graph.current = null
      alert('В задании требуется орграф!')
      return
    }

    setShouldRerender(true)
  }

  function VertexPowers() {
    const adjList = graph.current!.getAdjacencyList()
    const powers = new Map()

    for (const [k, v] of adjList) {
      powers.set(k, v.length)
      for (const [otherK, otherV] of adjList) {
        if (k === otherK) continue

        if (otherV.find(value => value[0] === k)) {
          powers.set(k, powers.get(k) + 1)
        }
      }
    }

    return (
      <TableBody>
        {graph.current!.getAdjacencyList().map(item => {
          return (
            <TableRow key={item[0]}>
              <TableCell align='right'>{item[0]}</TableCell>
              <TableCell align='left'>{powers.get(item[0])}</TableCell>
            </TableRow>
          )
        })
        }
      </TableBody>
    )
  }

  return (
    <div id='task-one'>
      <div className='description'>
        <h3>2. Список смежности (Ia)</h3>
        <p>5. Для каждой вершины орграфа вывести её степень.</p>
      </div>
      <div className='data'>
        <GraphLoader onGraphLoaded={onGraphLoaded} />
        { !graph.current
          ? <p>Загрузите описание ориентированного графа.</p>
          :
          <>
            <GraphView graph={graph} />
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align='right'><b>Вершина</b></TableCell>
                  <TableCell align='left'><b>Степень</b></TableCell>
                </TableRow>
              </TableHead>
              <VertexPowers />
            </Table>
          </>
        }
      </div>
    </div>
  )
}

export default TaskOne