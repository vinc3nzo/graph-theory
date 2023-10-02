import React from "react";
import {Graph} from "./graph/Graph";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";

interface GraphViewProps {
  graph: React.MutableRefObject<Graph | null>
  maxWidth?: string
}

function GraphView({ graph, maxWidth = '40%' } : GraphViewProps) {
  return (
    <Table style={{maxWidth: maxWidth, overflowX: 'scroll'}} size="small">
      <TableHead>
        <TableRow>
          <TableCell align='right'><b>Вершина</b></TableCell>
          <TableCell align='left'><b>Связи</b></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {graph.current?.getAdjacencyList().map(item => {
            let connections = ''
            for (const conn of item[1]) {
              connections += conn[0]
              if (graph.current!.isWeighted()) {
                connections += '[' + conn[1] + ']'
              }
              connections += ' '
            }

            return (
              <TableRow key={item[0]}>
                <TableCell align='right'>{item[0]}</TableCell>
                <TableCell align='left'>{connections}</TableCell>
              </TableRow>
            )
          })
        }
      </TableBody>
    </Table>
  )
}

export default GraphView