import './TaskTen.css'
import GraphLoader from "./util/GraphLoader";
import GraphView from "./GraphView";
import {Button, InputLabel, TextField} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import {Graph} from "./graph/Graph";
import {GraphError} from "./graph/error/GraphError";

function TaskTen() {
  const graph = useRef<Graph | null>(null)
  const [answer, setAnswer] = useState<{ distance: number, path: string[] } | null>(null)
  const [u, setU] = useState<string>('')
  const [v, setV] = useState<string>('')
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
      graph.current = null
      return
    }

    setAnswer(null)

    setShouldRerender(true)
  }

  function onRunClick() {
    let res = null
    try {
      res = graph.current!.taskTen(u, v)
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

  return (
    <div id='task-ten'>
      <div className='description'>
        <h3>10. Веса IV c</h3>
        <p>10. Вывести кратчайший путь из вершины u до вершины v.</p>
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
              { !answer
                ? <></>
                :
                <>
                  <b>Ответ</b>
                  <span><b>Длина пути:</b>&nbsp;{answer.distance}</span>
                  <span><b>Кратчайший путь:</b>&nbsp;{answer.path.toString()}</span>
                </>
              }
              <div className='u-input'>
                <InputLabel><b>u</b></InputLabel>
                <TextField value={u}
                           type='text'
                           onChange={e => setU(e.target.value)}
                           size='small' />
              </div>
              <div className='v-input'>
                <InputLabel><b>v</b></InputLabel>
                <TextField value={v}
                           type='text'
                           onChange={e => setV(e.target.value)}
                           size='small' />
              </div>
              <Button onClick={onRunClick}>Выполнить</Button>
            </div>
          </>
        }
      </div>
    </div>
  )
}

export default TaskTen