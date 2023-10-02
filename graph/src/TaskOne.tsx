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
              <TableBody>
                {graph.current!.getAdjacencyList().map(item => {
                    return (
                      <TableRow key={item[0]}>
                        <TableCell align='right'>{item[0]}</TableCell>
                        <TableCell align='left'>{item[1].length}</TableCell>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </>
        }
      </div>
    </div>
  )
}

export default TaskOne