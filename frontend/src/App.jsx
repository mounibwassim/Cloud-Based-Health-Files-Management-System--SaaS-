import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StatesList from './pages/StatesList';
import StateDetail from './pages/StateDetail';
import FileRecords from './pages/FileRecords';

import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
        <Navbar />

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<StatesList />} />
            <Route path="/states/:id" element={<StateDetail />} />
            <Route path="/states/:stateId/files/:fileType" element={<FileRecords />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
