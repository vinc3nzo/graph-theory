import './TaskOne.css'
import {Graph} from './graph/Graph'
import React, {MutableRefObject} from 'react'
import {Table, TableBody, TableCell, TableHead, TableRow} from '@mui/material'

export interface TaskOneArgs {
  graph: MutableRefObject<Graph>
}

function TaskOne({ graph } : TaskOneArgs) {
  return (
    <div id='task-one'>
      <div className='description'>
        <h3>2. Список смежности (Ia)</h3>
        <p>5. Для каждой вершины орграфа вывести её степень.</p>
      </div>
      <div className='data'>
        <Table style={{maxWidth: '40%'}} size="small">
          <TableHead>
            <TableRow>
              <TableCell align='right'><b>Вершина</b></TableCell>
              <TableCell align='left'><b>Степень</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              !graph.current.isOriented()
                ? (<></>)
                : graph.current.getAdjacencyList().map(item => {
                    return (
                      <TableRow key={item[0]}>
                        <TableCell align='right'>{item[0]}</TableCell>
                        <TableCell align='left'>{item[1].length}</TableCell>
                      </TableRow>
                    )
                  }
                )
            }
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default TaskOne