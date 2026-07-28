import { useRef, useState } from 'react';

type DocUploadProps = {
  disabled?: boolean;
  onUpload: (fileName: string, text: string) => void;
};

export function DocUpload({ disabled, onUpload }: DocUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    setError('');
    const allowed = ['.txt', '.md', '.csv'];
    const lower = file.name.toLowerCase();
    if (!allowed.some((ext) => lower.endsWith(ext))) {
      setError('Upload .txt, .md, or .csv files for this MVP.');
      return;
    }
    if (file.size > 200_000) {
      setError('Max file size is 200 KB in the demo MVP.');
      return;
    }
    const text = await file.text();
    if (!text.trim()) {
      setError('File is empty.');
      return;
    }
    onUpload(file.name, text);
  };

  return (
    <div className="doc-upload">
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.md,.csv,text/plain,text/markdown"
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
      <p className="muted">FAQ, pricing sheet, onboarding notes (.txt / .md).</p>
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}
