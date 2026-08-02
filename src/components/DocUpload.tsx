import { useRef, useState } from 'react';
import { extractPdfText } from '../lib/pdfText';

type DocUploadProps = {
  disabled?: boolean;
  onUpload: (fileName: string, text: string) => void;
};

const TEXT_EXTENSIONS = ['.txt', '.md', '.csv'];
const MAX_TEXT_BYTES = 200_000;
const MAX_PDF_BYTES = 2_000_000;

export function DocUpload({ disabled, onUpload }: DocUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    setError('');
    const lower = file.name.toLowerCase();
    const isPdf = lower.endsWith('.pdf');
    const isText = TEXT_EXTENSIONS.some((ext) => lower.endsWith(ext));

    if (!isPdf && !isText) {
      setError('Upload .txt, .md, .csv, or .pdf files.');
      return;
    }

    if (isPdf && file.size > MAX_PDF_BYTES) {
      setError('Max PDF size is 2 MB.');
      return;
    }

    if (!isPdf && file.size > MAX_TEXT_BYTES) {
      setError('Max text file size is 200 KB.');
      return;
    }

    try {
      const text = isPdf ? await extractPdfText(file) : await file.text();
      if (!text.trim()) {
        setError('No readable text found in this file.');
        return;
      }
      onUpload(file.name, text);
    } catch {
      setError('Could not read this file. Try another export or a .txt/.md upload.');
    }
  };

  return (
    <div className="doc-upload">
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.md,.csv,.pdf,text/plain,text/markdown,application/pdf"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
          event.target.value = '';
        }}
      />
      <button
        type="button"
        className="btn btn-secondary"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        Upload knowledge doc
      </button>
      <p className="muted">FAQ, policies, onboarding notes (.txt / .md / .pdf).</p>
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}
