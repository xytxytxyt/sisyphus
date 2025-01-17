import { useState } from 'react';

import { Job } from '../App';
import '../App.css';

interface JobInfoProps {
    currentJob: Job | undefined
}

export default function JobSources(props: JobInfoProps) {
    const [currentJobLocalCopy, setCurrentJobLocalCopy] = useState<Job>();

    // to-do: make this work
    let currentJob = props.currentJob;
    if (JSON.stringify(currentJob) !== JSON.stringify(currentJobLocalCopy)) {
        console.log('Received new job ', currentJob);
        setCurrentJobLocalCopy(currentJob);
    }

    if (currentJob === undefined) {
        return (<div id="jobinfo" />)
    }

    return (
        <div id="jobinfo">
          <h1>Job Info</h1>
          <p>quick brown fox</p>
        </div>
    )
}
