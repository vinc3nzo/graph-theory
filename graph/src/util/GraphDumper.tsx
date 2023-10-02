import React from 'react';
import {Button} from "@mui/material";
import {Graph} from "../graph/Graph";

interface GraphDumperProps {
  graph: React.MutableRefObject<Graph>
}

function GraphDumper({ graph }: GraphDumperProps) {
  const handleWriteToFile = (event: React.MouseEvent) => {
    const graphStr = graph.current.dump()
    const blob = new Blob([graphStr], {type: "application/json;charset=utf-8"})
    const url = URL.createObjectURL(blob)
    const elem = document.createElement("a")
    elem.href = url
    elem.download = 'graph.json'
    document.body.appendChild(elem)
    elem.click()
    document.body.removeChild(elem)
  };

  return (
    <Button onClick={handleWriteToFile}>Записать в файл</Button>
  );
}

export default GraphDumper