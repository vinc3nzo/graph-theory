import './TaskNine.css'
import React, {useEffect, useRef, useState} from 'react'
import {Graph} from "./graph/Graph";
import GraphLoader from "./util/GraphLoader";
import GraphView from "./GraphView";
import {Button, InputLabel, Table, TableBody, TableCell, TableHead, TableRow, TextField} from "@mui/material";
import {GraphError} from "./graph/error/GraphError";

function TaskNine() {
  const graph = useRef<Graph | null>(null)
  const [answer, setAnswer] = useState<Map<string, { distance: number, path: string[] }> | null>(null)
  const [u, setU] = useState<string>('')
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

    if (!graph.current!.isWeighted()) {
      alert('В задании требуется взвешенный граф.')
      return
    }

    setAnswer(null)

    setShouldRerender(true)
  }

  function onRunClick() {
    let res = null
    try {
      res = graph.current!.taskNine(u)
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

    setAnswer(res)

    setShouldRerender(true)
  }

  function ShortestPaths() {
    return (
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align='right'><b>Вершина</b></TableCell>
            <TableCell align='center'><b>Длина</b></TableCell>
            <TableCell align='left'><b>Кратчайший путь</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            Array.from(answer!.entries()).map(item => {
              return (
                <TableRow key={item[0]}>
                  <TableCell align='right'>{item[0]}</TableCell>
                  <TableCell align='center'>{item[1].distance}</TableCell>
                  <TableCell align='left'>{item[1].path.toString()}</TableCell>
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    )
  }

  return (
    <div id='task-nine'>
      <div className='description'>
        <h3>9. Веса IV b</h3>
        <p>14. Вывести кратчайшие пути из вершины u во все остальные вершины.</p>
      </div>
      <div className='data'>
        <GraphLoader onGraphLoaded={onGraphLoaded} />
        { !graph.current
          ? <p>Загрузите описание взвешенного графа.</p>
          :
          <>
            <div className='input'>
              <GraphView graph={graph} maxWidth='100%' />
            </div>
            <div className='output'>
              <p>
                { answer ? <ShortestPaths /> : <></>}
              </p>
              <div className='u-input'>
                <InputLabel><b>u</b></InputLabel>
                <TextField value={u}
                           type='text'
                           onChange={e => setU(e.target.value)}
                           size='small' />
                <Button onClick={onRunClick}>Выполнить</Button>
              </div>
            </div>
          </>
        }
      </div>
    </div>
  )
}

export default TaskNine