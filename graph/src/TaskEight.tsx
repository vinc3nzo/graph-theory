import './TaskEight.css'
import {Graph} from './graph/Graph'
import React, {useEffect, useRef, useState} from 'react'
import GraphLoader from "./util/GraphLoader"
import GraphView from "./GraphView"
import { GraphError } from "./graph/error/GraphError"
import {Button, InputLabel, TextField} from "@mui/material";

function TaskEight() {
  const graph = useRef<Graph | null>(null)
  const [answer, setAnswer] = useState<boolean | null>(null)
  const [p, setP] = useState<number>(0)
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

    if (graph.current!.isOriented() || !graph.current!.isWeighted()) {
      alert('В задании требуется взвешенный неориентированный граф.')
      return
    }

    setAnswer(null)
    
    setShouldRerender(true)
  }

  function onRunClick() {
    setAnswer(graph.current!.taskEight(p))
  }

  return (
    <div id='task-eight'>
      <div className='description'>
        <h3>8. Веса IV а</h3>
        <p>2. Определить, есть ли в графе вершина, минимальные стоимости путей от которой до остальных в сумме не превосходят P.</p>
      </div>
      <div className='data'>
        <GraphLoader onGraphLoaded={onGraphLoaded} />
        { !graph.current
          ? <p>Загрузите описание взвешенного неориентированного графа.</p>
          :
          <>
            <div className='input'>
              <GraphView graph={graph} maxWidth='100%' />
            </div>
            <div className='output'>
              <p>
                <b>Ответ: </b>
                { answer !== null ? <span>{ answer ? 'Да' : 'Нет' }</span> : <></>}
              </p>
              <div className='p-input'>
                <InputLabel><b>P</b></InputLabel>
                <TextField value={p}
                           type='number'
                           onChange={e => setP(parseInt(e.target.value))}
                           size='small' />
                <Button onClick={onRunClick}>Проверить</Button>
              </div>
            </div>
          </>
        }
      </div>
    </div>
  )
}

export default TaskEight