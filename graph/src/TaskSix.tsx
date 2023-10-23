import './TaskSix.css';
import React, {useEffect, useRef, useState} from "react";
import GraphLoader from "./util/GraphLoader";
import {Graph} from "./graph/Graph";
import GraphView from "./GraphView";

function TaskSix() {
  const graph = useRef<Graph | null>(null)
  const resMst = useRef<Graph | null>(null)
  const [shouldRerender, setShouldRerender] = useState<boolean>(false)

  useEffect(() => {
      setShouldRerender(false)
    }, [shouldRerender]
  )

  function onGraphLoaded(content: string) {
    try {
      graph.current = new Graph(content)
    }
    catch (e) {
      alert('Неверный формат файла')
      return
    }

    if (graph.current.isOriented() || !graph.current.isWeighted()) {
      graph.current = null
      alert('В задании требуется взвешенный неориентированный граф!')
      return
    }

    resMst.current = graph.current?.mst()

    setShouldRerender(true)
  }

  return (
    <div id='task-six'>
      <div className='description'>
        <h3>7. Каркас III</h3>
        <p>
          Дан взвешенный неориентированный граф из N вершин и M ребер. Требуется найти в
          нем каркас минимального веса. (<b>Алгоритм Прима</b>)
        </p>
      </div>
      <div className='task'>
        <GraphLoader onGraphLoaded={onGraphLoaded}/>
        {
          !graph.current
          ? (<p>Загрузите описание взвешенного неориентированного графа.</p>)
          : (
              <div className='output'>
                <GraphView maxWidth='80%' graph={graph} />
                <GraphView maxWidth='80%' graph={resMst} />
              </div>
            )
        }
      </div>
    </div>
  )
}

export default TaskSix