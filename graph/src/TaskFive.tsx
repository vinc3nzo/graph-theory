import './TaskFive.css'
import {Graph} from './graph/Graph'
import React, {useEffect, useRef, useState} from 'react'
import {Button, InputLabel, Table, TableBody, TableCell, TableHead, TableRow, TextField} from '@mui/material'
import GraphLoader from "./util/GraphLoader";
import GraphView from "./GraphView";
import {GraphError} from "./graph/error/GraphError";

function TaskFive() {
  const graph = useRef<Graph | null>(null)
  const lengths = useRef<Map<string, number> | null>(null)
  const [nodeName, setNodeName] = useState<string>('')
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

    lengths.current = null

    setShouldRerender(true)
  }

  function ShortestPaths() {
    return (
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align='right'><b>Вершина</b></TableCell>
            <TableCell align='left'><b>Длина кратчайшего пути</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { graph.current!.getAdjacencyList().map(item => {
              return (
                <TableRow key={item[0]}>
                  <TableCell align='right'>{item[0]}</TableCell>
                  <TableCell align='left'>{lengths.current!.get(item[0])}</TableCell>
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    )
  }

  function onRunClick() {
    try {
      lengths.current = graph.current!.shortestPathLengthsFrom(nodeName)
    }
    catch (e) {
      if (e instanceof GraphError) {
        alert(e.message)
        return
      }
      else {
        throw e
      }
    }
    setShouldRerender(true)
  }

  return (
    <div id='task-five'>
      <div className='description'>
        <h3>6. Обходы графа II</h3>
        <p>27. Найти длины кратчайших (по числу дуг) путей из вершины <b>u</b> во все остальные.</p>
      </div>
      <div className='data'>
        <GraphLoader onGraphLoaded={onGraphLoaded} />
        { !graph.current
          ? <p>Загрузите описание любого графа.</p>
          :
          <>
            <div className='input'>
              <GraphView graph={graph} />
            </div>
            <div className='output'>
              { lengths.current && <ShortestPaths /> }
              <div className='node-name-input'>
                <InputLabel>Вершина</InputLabel>
                <TextField value={nodeName ?? ''}
                           type='text'
                           onChange={e => setNodeName(e.target.value)}
                           size='small' />
                <Button onClick={onRunClick}>Вывести</Button>
              </div>
            </div>
          </>
        }
      </div>
    </div>
  )
}

export default TaskFive