import './TaskTwo.css'
import React, {MutableRefObject, useState} from "react";
import {Graph} from "./graph/Graph";
import {Button, InputLabel, TextField} from "@mui/material";
import {GraphError} from "./graph/error/GraphError";

export interface TaskTwoArgs {
  graph: MutableRefObject<Graph>
}

function TaskTwo({ graph } : TaskTwoArgs) {
  const [nodeName, setNodeName] = useState<string>('')
  const [answer, setAnswer] = useState<string | null>(null)

  function onRunClick() {
    let adj: Map<string, number>
    try {
      adj = graph.current.getAdjacent(nodeName)
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
    for (const [node, _] of graph.current.getAdjacencyList()) {
      if (nodeName !== node && !adj.has(node)) {
        resList.push(node.toString())
      }
    }

    setAnswer(resList.join(', '))
  }

  return (
    <div id='task-two'>
      <div className='description'>
        <h3>3. Список смежности (Ia)</h3>
        <p>20. Вывести все вершины орграфа, не смежные с данной.</p>
      </div>
      <div className='data'>
        <div className='input'>
          <InputLabel>Вершина</InputLabel>
          <TextField value={nodeName ?? ''}
                     type='text'
                     onChange={e => setNodeName(e.target.value)}
                     size='small'>
          </TextField>
          <Button onClick={onRunClick}>Вывести</Button>
        </div>
        <div className='output'>
          <p>Ответ:</p>
          <span>{answer ?? ''}</span>
        </div>
      </div>
    </div>
  )
}

export default TaskTwo