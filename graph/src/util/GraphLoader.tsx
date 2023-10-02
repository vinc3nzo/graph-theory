import React, {useState} from 'react';
import {InputLabel} from "@mui/material";

interface GraphLoaderProps {
  onGraphLoaded: (graphData: string) => void
}

function GraphLoader({ onGraphLoaded }: GraphLoaderProps) {
  const [fileContent, setFileContent] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const jsonContent = e.target?.result as string
          setFileContent(jsonContent)
          onGraphLoaded(jsonContent)
        } catch (error) {
          setFileContent(null)
          alert('Ошибка при парсинге файла. Это точно текстовый файл?')
        }
      }

      reader.readAsText(file)
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1em'}}>
      {fileContent
        ? <InputLabel>Файл успешно загружен.</InputLabel>
        : <InputLabel>Загрузите файл...</InputLabel>
      }
      <input type="file" accept=".json" onChange={handleFileChange} />
    </div>
  );
}

export default GraphLoader;