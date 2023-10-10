import './TaskFour.css'
import React, {useEffect, useRef, useState} from "react";
import {Graph} from "./graph/Graph";
import GraphLoader from "./util/GraphLoader";
import GraphView from "./GraphView";

function TaskFour() {
  const graph = useRef<Graph | null>(null)
  const [answer, setAnswer] = useState<string>('')
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

    if (graph.current.isOriented()) {
      graph.current = null
      alert('В задании требуется неориентированный граф!')
      return
    }

    setAnswer(graph.current!.connectedComponents().toString())
    setShouldRerender(true)
  }

  return (
    <div id='task-four'>
      <div className='description'>
        <h3>5. Обходы графа II</h3>
        <p>5. Подсчитать количество связных компонент графа.</p>
      </div>
      <div className='data'>
        <GraphLoader onGraphLoaded={onGraphLoaded} />
        { !graph.current
          ? <p>Загрузите описание неориентированного графа.</p>
          :
          <>
            <GraphView graph={graph} />
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

export default TaskFour