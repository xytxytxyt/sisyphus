import { useEffect, useState } from 'react';

import { Job } from '../App';
import '../App.css';
import { getGoogleSearchUrl } from '../utils/utils';

interface JobInfoProps {
    currentJob: Job | undefined
}

function getFundingInfoUrl(companyName: string): string {
    let query = `site:techcrunch.com OR site:venturebeat.com "${companyName}" funding raise round seed`;
    let fundingUrl = getGoogleSearchUrl(query);
    return fundingUrl;
}

function getGlassdoorSearchUrl(companyName: string): string {
    let query = `site:glassdoor.com "${companyName}" reviews`
    let glassdoorSearchUrl = getGoogleSearchUrl(query);
    return glassdoorSearchUrl;
}

export default function JobInfo(props: JobInfoProps) {
    const [currentJobLocalCopy, setCurrentJobLocalCopy] = useState<Job>();

    let currentJob = props.currentJob;
    useEffect(
        () => {
            console.log('Received new job; processing for info: ', currentJob);
            setCurrentJobLocalCopy(currentJob);
        },
        [props],
    );

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

            <GlassdoorSearch
                companyName={currentJobLocalCopy.companyName}
            />
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

function GlassdoorSearch({ companyName }: { companyName: string }) {
    return (
        <p>
            <a href={getGlassdoorSearchUrl(companyName)}>Glassdoor search</a>
        </p>
    )
}
