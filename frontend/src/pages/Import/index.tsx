import React, { useState, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(e: FormEvent): Promise<void> {
    const data = new FormData();
    e.preventDefault();

    data.append('file', uploadedFiles[0].file, uploadedFiles[0].name);
    try {
      await api.post('/transactions/import', data);

      history.push('/');
    } catch (err) {
      console.log(err.response.error);
    }
  }

  function submitFile(files: File[]): void {
    const file = files[0];

    const fileProps = [
      {
        file,
        name: file.name,
        readableSize: filesize(file.size),
      },
    ];

    setUploadedFiles(fileProps);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button
              disabled={!uploadedFiles.length}
              onClick={handleUpload}
              type="button"
            >
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
