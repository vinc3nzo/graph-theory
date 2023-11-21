import './TaskEleven.css'
import React, {useState, useRef, useEffect} from 'react'
import {Graph} from "./graph/Graph"
import {GraphError} from "./graph/error/GraphError";
import GraphLoader from "./util/GraphLoader";
import GraphView from "./GraphView";
import {Button, InputLabel, TextField} from "@mui/material";

function TaskEleven() {
  const graph = useRef<Graph | null>(null)
  const [s, setS] = useState<string>('')
  const [t, setT] = useState<string>('')
  const [answer, setAnswer] = useState<number | null>(null)
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

    if (!graph.current!.isWeighted() || !graph.current!.isOriented()) {
      alert('В задании требуется взвешенный ориентированный граф.')
      graph.current = null
      return
    }

    setAnswer(null)

    setShouldRerender(true)
  }

  function onRunClick() {
    let res = null
    try {
      res = graph.current!.taskEleven(s, t)
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
    <div id='task-eleven'>
      <div className='description'>
        <h3>11. Максимальный поток</h3>
        <p>Алгоритм Форда-Фалкерсона</p>
      </div>
      <div className='data'>
        <GraphLoader onGraphLoaded={onGraphLoaded} />
        { !graph.current
          ? <p>Загрузите описание взвешенного ориентированного графа.</p>
          :
          <>
            <div className='input'>
              <GraphView graph={graph} maxWidth='100%' />
            </div>
            <div className='output'>
              { answer === null
                ? <></>
                : <b>Ответ:&nbsp;{answer}</b>
              }
              <div className='u-input'>
                <InputLabel><b>s</b></InputLabel>
                <TextField value={s}
                           type='text'
                           onChange={e => setS(e.target.value)}
                           size='small' />
              </div>
              <div className='v-input'>
                <InputLabel><b>t</b></InputLabel>
                <TextField value={t}
                           type='text'
                           onChange={e => setT(e.target.value)}
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

export default TaskEleven