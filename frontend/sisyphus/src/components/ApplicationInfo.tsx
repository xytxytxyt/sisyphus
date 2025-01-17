import { Job } from '../App';
import '../App.css';

interface ApplicationInfoProps {
    currentJob: Job | undefined
}

export default function JobSources(props: ApplicationInfoProps) {
    let currentJob = props.currentJob;

    if (currentJob === undefined) {
        return (<div id="applicationinfo" />)
    }

    return (
        <div id="applicationinfo">
          <h1>Application Info</h1>
          <p>quick brown fox</p>
        </div>
    )
}
