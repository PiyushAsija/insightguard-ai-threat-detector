import { useState } from 'react';
import UploadZone from './components/UploadZone';
import LoadingScreen from './components/LoadingScreen';
import Dashboard from './components/Dashboard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function App() {
  const [view, setView] = useState('upload'); // 'upload' | 'loading' | 'results'
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (file) => {
    setError(null);
    setView('loading');

    const formData = new FormData();
    formData.append('logfile', file);

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
        // headers: {
        //   'X-API-Key': import.meta.env.VITE_APP_API_KEY || ''
        // }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed. Please try again.');
      }

      setAnalysisData(data);
      setView('results');
    } catch (err) {
      setError(err.message);
      setView('upload');
    }
  };

  const handleReset = () => {
    setView('upload');
    setAnalysisData(null);
    setError(null);
  };

  return (
    <>
      {view === 'upload' && (
        <UploadZone onAnalyze={handleAnalyze} error={error} />
      )}
      {view === 'loading' && (
        <LoadingScreen />
      )}
      {view === 'results' && analysisData && (
        <Dashboard data={analysisData} onReset={handleReset} />
      )}
    </>
  );
}
