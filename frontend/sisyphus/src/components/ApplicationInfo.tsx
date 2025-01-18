import { useEffect, useState } from 'react';

import { Job } from '../App';
import '../App.css';

interface ApplicationInfoProps {
    currentJob: Job | undefined
}

function getCareersUrl(companyName: string): string {
    let query = `${companyName} careers`;
    let careersUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    return careersUrl;
}

function getValuesUrl(companyName: string): string {
    let query = `${companyName} values`;
    let valuesUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    return valuesUrl;
}

export default function JobSources(props: ApplicationInfoProps) {
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
        return (<div id="applicationinfo" />)
    }

    return (
        <div id="applicationinfo">
            <h1>Application Info</h1>

            <p>
                Consider:<br />
                <ul>
                    <li>requirements fit</li>
                    <li>responsibilities fit</li>
                    <li>keywords fit</li>
                    <li>mission fit</li>
                    <li>values fit</li>
                </ul>
            </p>

            <CompanyCareersInfo
                companyName={currentJobLocalCopy.companyName}
            />

            <CompanyValuesInfo
                companyName={currentJobLocalCopy.companyName}
            />
        </div>
    )
}

function CompanyCareersInfo({ companyName }: { companyName: string }) {
    return (
        <p>
            <a href={getCareersUrl(companyName)}>Company careers information</a>
        </p>
    )
}

function CompanyValuesInfo({ companyName }: { companyName: string }) {
    return (
        <p>
            <a href={getValuesUrl(companyName)}>Company values information</a>
        </p>
    )
}
