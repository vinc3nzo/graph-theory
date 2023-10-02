import './TaskThree.css'
import React, {useEffect, useRef, useState} from "react";
import {Graph} from "./graph/Graph";
import {Button} from "@mui/material";
import GraphLoader from "./util/GraphLoader";
import GraphView from "./GraphView";

function TaskThree() {
  const graphOne = useRef<Graph | null>(null)
  const graphTwo = useRef<Graph | null>(null)
  const graphRes = useRef<Graph | null>(null)
  const [shouldRerender, setShouldRerender] = useState<boolean>(false)

  useEffect(() => {
      setShouldRerender(false)
    }, [shouldRerender]
  )

  function onRunClick() {
    if (!graphOne.current || !graphTwo.current) {
      alert('Сначала загрузите описания орграфов!')
      return
    }

    graphRes.current = graphOne.current!.intersect(graphTwo.current)
    setShouldRerender(true)
  }

  function onGraphLoaded(jsonContent: string, which: React.MutableRefObject<Graph | null>) {
    try {
      which.current = new Graph(jsonContent)
    }
    catch (e) {
      alert('Неверный формат файла')
      return
    }

    if (!which.current.isOriented()) {
      which.current = null
      alert('В задании требуется орграф!')
      return
    }

    setShouldRerender(true)
  }

  const graphBlockStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1em'
  }

  return (
    <div id='task-three'>
      <div className='description'>
        <h3>4. Список смежности (Iб): несколько графов</h3>
        <p>8. Построить орграф, являющийся пересечением двух заданных.</p>
      </div>
      <div className='data'>
        <div style={graphBlockStyle}>
          <GraphLoader onGraphLoaded={(content) => onGraphLoaded(content, graphOne)} />
          { !graphOne.current
            ? <p>Загрузите описание ориентированного графа.</p>
            : <GraphView maxWidth='80%' graph={graphOne} />
          }
        </div>
        <div style={graphBlockStyle}>
          <GraphLoader onGraphLoaded={(content) => onGraphLoaded(content, graphTwo)} />
          { !graphTwo.current
            ? <p>Загрузите описание ориентированного графа.</p>
            : <GraphView maxWidth='80%' graph={graphTwo} />
          }
        </div>
        { graphRes.current &&
          <div style={graphBlockStyle}>
            <p style={{padding: '0 7em'}}><b>Результат</b></p>
            <GraphView maxWidth='80%' graph={graphRes} />
          </div>
        }
      </div>
      <Button onClick={onRunClick}>Вывести</Button>
    </div>
  )
}

export default TaskThree