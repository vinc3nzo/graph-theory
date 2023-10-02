import './TaskTwo.css'
import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {Graph} from "./graph/Graph";
import {Button, InputLabel, Table, TableBody, TableCell, TableHead, TableRow, TextField} from "@mui/material";
import {GraphError} from "./graph/error/GraphError";
import GraphLoader from "./util/GraphLoader";
import GraphView from "./GraphView";

function TaskTwo() {
  const graph = useRef<Graph | null>(null)
  const [nodeName, setNodeName] = useState<string>('')
  const [answer, setAnswer] = useState<string>('')
  const [shouldRerender, setShouldRerender] = useState<boolean>(false)

  useEffect(() => {
      setShouldRerender(false)
    }, [shouldRerender]
  )

  function onRunClick() {
    if (!graph.current) {
      alert('Сначала загрузите описание орграфа!')
      return
    }

    let adj: Map<string, number>
    try {
      adj = graph.current!.getAdjacent(nodeName)
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

    let resList: string[] = []
    for (const [node, _] of graph.current!.getAdjacencyList()) {
      if (nodeName !== node && !adj.has(node)) {
        resList.push(node.toString())
      }
    }
    setAnswer(resList.join(', '))
  }

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
    <div id='task-two'>
      <div className='description'>
        <h3>3. Список смежности (Ia)</h3>
        <p>20. Вывести все вершины орграфа, не смежные с данной.</p>
      </div>
      <div className='data'>
        <GraphLoader onGraphLoaded={onGraphLoaded} />
        { !graph.current
          ? <p>Загрузите описание ориентированного графа.</p>
          :
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1em'}}>
              <GraphView graph={graph} />
              <div className='input'>
                <InputLabel>Вершина</InputLabel>
                <TextField value={nodeName ?? ''}
                           type='text'
                           onChange={e => setNodeName(e.target.value)}
                           size='small'>
                </TextField>
                <Button onClick={onRunClick}>Вывести</Button>
              </div>
            </div>
            <div className='output'>
              {answer &&
                <p>
                  <b>Ответ:&nbsp;</b>
                  <span>{answer}</span>
                </p>
              }
            </div>
          </>
        }
      </div>
    </div>
  )
}

export default TaskTwo