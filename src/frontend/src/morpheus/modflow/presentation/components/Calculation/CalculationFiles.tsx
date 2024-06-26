import React, {useEffect, useState} from 'react';
import {Grid, List, ListContent, ListIcon, ListItem} from 'semantic-ui-react';

interface IProps {
  files: string[];
  fetchFile: (file: string) => Promise<string | undefined>;
}

const CalculationFiles = ({files, fetchFile}: IProps) => {

  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);

  const handleFetchFile = async (file: string) => {
    const fileContent = await fetchFile(file);
    setContent(fileContent || null);
    setSelectedFile(file);
  };

  useEffect(() => {
    if (!files.length) {
      setContent(null);
    }

    const listFile = files.find((file) => file.endsWith('.list'));
    if (listFile) {
      handleFetchFile(listFile);
    }

  }, [files]);


  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={4}>
          <h3>Files</h3>
          <List>
            {files.map((file, index) => (
              <ListItem key={index}>
                <ListIcon name="file"/>
                <ListContent onClick={() => handleFetchFile(file)}>
                  <span style={{
                    cursor: 'pointer',
                    fontWeight: selectedFile === file ? 'bold' : 'normal',
                  }}
                  >{file}</span>
                </ListContent>
              </ListItem>
            ))}
          </List>
        </Grid.Column>
        <Grid.Column width={12}>
          <h3>File Content</h3>
          <pre>
            {content}
          </pre>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default CalculationFiles;
