import { useEffect, useState } from 'react';

import { Job } from '../App';
import '../App.css';

interface JobInfoProps {
    currentJob: Job | undefined
}

function getFundingInfoUrl(companyName: string): string {
    let query = `site:techcrunch.com OR site:venturebeat.com "${companyName}" funding raise round seed`;
    let fundingUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    return fundingUrl;
}

export default function JobSources(props: JobInfoProps) {
    const [currentJobLocalCopy, setCurrentJobLocalCopy] = useState<Job>();

    let currentJob = props.currentJob;
    useEffect(
        () => {
            console.log('Received new job ', currentJob);
            setCurrentJobLocalCopy(currentJob);
        },
        [props],
    )

    if (currentJobLocalCopy === undefined) {
        return (<div id="jobinfo" />)
    }

    return (
        <div id="jobinfo">
            <h1>Job Info</h1>

            <p>Company: {currentJobLocalCopy.companyName}</p>

            {(currentJobLocalCopy !== undefined && currentJobLocalCopy.linkedInJobUrl !== undefined) && <JobPost linkedInJobUrl={currentJobLocalCopy.linkedInJobUrl} />}

            <CompanyFundingInfo
                companyName={currentJobLocalCopy.companyName}
            />

            <p>Glassdoor page (coming soon)</p>
        </div>
    )
}

function JobPost({ linkedInJobUrl }: { linkedInJobUrl: string }) {
    return (
        <p>
            <a href={linkedInJobUrl}>LinkedIn job post</a>
        </p>
    )
}

function CompanyFundingInfo({ companyName }: { companyName: string }) {
    return (
        <p>
            <a href={getFundingInfoUrl(companyName)}>Funding information</a>
        </p>
    )
}
