import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";

import {Graph} from "./graph/Graph"
import {GraphError} from "./graph/error/GraphError"
import TaskOne from "./TaskOne"
import TaskTwo from "./TaskTwo"
import TaskThree from "./TaskThree"
import TaskFour from "./TaskFour"
import GraphLoader from "./util/GraphLoader"
import GraphDumper from "./util/GraphDumper"
import GraphView from "./GraphView"
import TaskFive from "./TaskFive";

function App() {
  const graph = useRef(new Graph(false, false))
  const [newNode, setNewNode] = useState<string>('')
  const [deleteNode, setDeleteNode] = useState<string>('')
  const [connNodeA, setConnNodeA] = useState<string>('')
  const [connNodeB, setConnNodeB] = useState<string>('')
  const [connNodeWeight, setConnNodeWeight] = useState<number | null>(null)
  const [delConnA, setDelConnA] = useState<string>('')
  const [delConnB, setDelConnB] = useState<string>('')
  const [shouldRerender, setShouldRerender] = useState<boolean>(true)

  const orientedSelection = useRef('unoriented')
  const weightedSelection = useRef('non-weighted')

  useEffect(() => {
      setShouldRerender(false)
    }, [shouldRerender]
  )

  function onCreateNodeClick() {
    if (!newNode) {
      alert('Незаполненные поля!')
      return
    }

    try {
      graph.current.addNode(newNode)
    }
    catch (e) {
      if (e instanceof GraphError) {
        alert(e.message)
        return
      }
    }
    setNewNode('')
    setShouldRerender(true)
  }

  function onDeleteNodeClick() {
    if (!deleteNode) {
      alert('Незаполненные поля!')
      return
    }

    try {
      graph.current.removeNode(deleteNode)
    }
    catch (e) {
      if (e instanceof GraphError) {
        alert(e.message)
        return
      }
    }
    setDeleteNode('')
    setShouldRerender(true)
  }

  function onConnectNodesClick() {
    if (!connNodeA || !connNodeB || (graph.current.isWeighted() && !connNodeWeight)) {
      alert('Незаполненные поля!')
      return
    }

    try {
      graph.current.connect(connNodeA, connNodeB, connNodeWeight ?? undefined)
    }
    catch (e) {
      if (e instanceof GraphError) {
        alert(e.message)
        return
      }
    }
    setConnNodeA('')
    setConnNodeB('')
    setConnNodeWeight(null)
    setShouldRerender(true)
  }

  function onDeleteConnectionClick() {
    if (!delConnA || !delConnB) {
      alert('Незаполненные поля!')
      return
    }

    try {
      graph.current.disconnect(delConnA, delConnB)
    }
    catch (e) {
      if (e instanceof GraphError) {
        alert(e.message)
        return
      }
    }
    setDelConnA('')
    setDelConnB('')
    setShouldRerender(true)
  }

  function onGraphLoaded(fileContent: string) {
    try {
      graph.current = new Graph(fileContent)
    }
    catch (e) {
      alert('Неверный формат файла!')
      return
    }

    if (graph.current.isOriented()) {
      orientedSelection.current = 'oriented'
    }
    else {
      orientedSelection.current = 'unoriented'
    }

    if (graph.current.isWeighted()) {
      weightedSelection.current = 'weighted'
    }
    else {
      weightedSelection.current = 'non-weighted'
    }

    setShouldRerender(true)
  }

  function onGraphOrientedChange(value: string) {
    orientedSelection.current = value
    graph.current.changeOriented(value === 'oriented')
    setShouldRerender(true)
  }

  function onGraphWeightedChange(value: string) {
    weightedSelection.current = value
    graph.current.changeWeighted(value === 'weighted')
    setShouldRerender(true)
  }

  return (
    <div id='app'>
      <header>
        <h2>Взаимодействие с графом</h2>
      </header>
      <div className='controls'>
        <div className='control' style={{ gridColumnStart: '2', gridColumnEnd: '4' }}>
          <InputLabel>Ориентированность</InputLabel>
          <Select value={orientedSelection.current}
                  onChange={e => onGraphOrientedChange(e.target.value)}>
            <MenuItem value='unoriented'>Неориентированный</MenuItem>
            <MenuItem value='oriented'>Ориентированный</MenuItem>
          </Select>
        </div>
        <div className='control' style={{ gridColumnStart: '4', gridColumnEnd: '6' }}>
          <InputLabel>Взвешенность</InputLabel>
          <Select value={weightedSelection.current}
                  onChange={e => onGraphWeightedChange(e.target.value)}>
            <MenuItem value='weighted'>Взвешенный</MenuItem>
            <MenuItem value='non-weighted'>Невзвешенный</MenuItem>
          </Select>
        </div>
        <div className='control' style={{gridTemplateColumns: '1fr 1fr 1fr', gridColumnStart: '2', gridColumnEnd: '6'}}>
          <GraphLoader onGraphLoaded={onGraphLoaded} />
          <GraphDumper graph={graph} />
        </div>
        <div className='control' style={{gridColumnStart: '2', gridColumnEnd: '4'}}>
          <InputLabel>Создать узел</InputLabel>
          <TextField value={newNode ?? ''}
                     type='text'
                     onChange={e => setNewNode(e.target.value)}
                     size='small'>
          </TextField>
          <Button onClick={onCreateNodeClick}>Добавить</Button>
        </div>
        <div className='control' style={{gridColumnStart: '4', gridColumnEnd: '6'}}>
          <InputLabel>Удалить узел</InputLabel>
          <TextField value={deleteNode ?? ''}
                     type='text'
                     onChange={e => setDeleteNode(e.target.value)}
                     size='small'>
          </TextField>
          <Button onClick={onDeleteNodeClick}>Удалить</Button>
        </div>
        <div className='control' style={{gridColumnStart: '2', gridColumnEnd: '4'}}>
          <InputLabel>Соединить узлы</InputLabel>
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr 1fr'}}>
            <TextField value={connNodeA ?? ''}
                       type='text'
                       onChange={e => setConnNodeA(e.target.value)}
                       size='small'
                       style={{paddingBottom: '0.5em'}}>
            </TextField>
            <TextField value={connNodeB ?? ''}
                       type='text'
                       onChange={e => setConnNodeB(e.target.value)}
                       size='small'
                       style={{paddingBottom: '0.5em'}}>
            </TextField>
            <TextField value={connNodeWeight ?? ''}
                       type='number'
                       onChange={e => setConnNodeWeight(Number(e.target.value))}
                       size='small'>
            </TextField>
          </div>
          <Button onClick={onConnectNodesClick}>Соединить</Button>
        </div>
        <div className='control' style={{gridColumnStart: '4', gridColumnEnd: '6'}}>
          <InputLabel>Удалить связь</InputLabel>
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr'}}>
            <TextField value={delConnA ?? ''}
                       type='text'
                       onChange={e => setDelConnA(e.target.value)}
                       size='small'
                       style={{paddingBottom: '0.5em'}}>
            </TextField>
            <TextField value={delConnB ?? ''}
                       type='text'
                       onChange={e => setDelConnB(e.target.value)}
                       size='small'>
            </TextField>
          </div>
          <Button onClick={onDeleteConnectionClick}>Удалить</Button>
        </div>
      </div>
      <main style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
        <div id='connections'>
          <GraphView graph={graph} />
        </div>
      </main>
      <hr />
      <div id='tasks'>
        <TaskOne />
        <hr />
        <TaskTwo />
        <hr />
        <TaskThree />
        <hr />
        <TaskFour />
        <hr />
        <TaskFive />
        <hr />
      </div>
    </div>
  );
}

export default App;
