import { useState } from 'react';
import './App.css';

import ApplicationInfo from './components/ApplicationInfo';
import JobSources from './components/JobSources';
import JobInfo from './components/JobInfo';

export const backendHost = 'http://127.0.0.1:8000';

export interface Job {
  linkedInJobUrl?: string
  linkedInJobId?: string
  companyName: string
}

function App() {
  const [currentJob, setCurrentJob] = useState<Job>();

  return (
    <>
      <div className="flexbox-container" id="container">
        <JobSources
          setCurrentJob={setCurrentJob}
        />

        <JobInfo
          currentJob={currentJob}
        />

        <ApplicationInfo
          currentJob={currentJob}
        />
      </div>
    </>
  )
}

export default App
