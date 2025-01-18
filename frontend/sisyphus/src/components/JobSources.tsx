import { Dispatch, useState } from 'react';
import { Job, backendHost } from '../App';
import '../App.css';

interface JobSourcesProps {
    setCurrentJob: Dispatch<Job | undefined>
}

interface LinkedInJobCompanySearchResponse {
    id: string,
    name: string,
    url: string,
}

function getLinkedInJobIdFromJobUrl(url: string): string {
    let withoutQueryString = url.split('?')[0].trim();
    if (withoutQueryString.slice(-1) === '/') {
        withoutQueryString = withoutQueryString.slice(0, -1);
    }
    let withoutQueryStringSplit = withoutQueryString.split('/')
    let jobId = withoutQueryStringSplit[withoutQueryStringSplit.length - 1];
    return jobId
}

export default function JobSources(props: JobSourcesProps) {
    let setCurrentJob = props.setCurrentJob

    const [linkedInJobUrl, setLinkedInJobUrl] = useState<string>();
    const [linkedInJobId, setLinkedInJobId] = useState<string>();
    const [generalCompanyName, setGeneralCompanyName] = useState<string>();
    const [linkedInExternalWaiting, setLinkedInExternalWaiting] = useState<boolean>(false);

    return (
        <div id="jobsources">
            <h1>Job Sources</h1>

            <div>
                <h2>LinkedIn</h2>
                <p>Under construction</p>
            </div>

            <div>
                <h2>LinkedIn External</h2>
                <p><input
                    name='linkedInJobUrl'
                    type='text'
                    defaultValue='Job URL'
                    onChange={(e) => {
                        if (e.target.value.trim().length == 0) {
                            setLinkedInJobId(undefined);
                        } else {
                            let linkedInJobUrl = e.target.value;
                            let linkedInJobId = getLinkedInJobIdFromJobUrl(linkedInJobUrl);
                            setLinkedInJobUrl(linkedInJobUrl);
                            setLinkedInJobId(linkedInJobId);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            if (linkedInJobId === undefined) {
                                setCurrentJob(undefined);
                            } else {
                                console.log(`Looking up company for LinkedIn job id ${linkedInJobId}`);
                                setLinkedInExternalWaiting(true);
                                fetch(
                                    `${backendHost}/linkedin/job/${linkedInJobId}/company`,
                                    {
                                        headers: {
                                            'Accept': 'application/json',
                                        }
                                    }
                                ).then(response => {
                                    return response.json() as Promise<LinkedInJobCompanySearchResponse>;
                                }).then(linkedInJobCompanySearchResponse => {
                                    setCurrentJob({
                                        linkedInJobUrl: linkedInJobUrl,
                                        linkedInJobId: linkedInJobId,
                                        companyName: linkedInJobCompanySearchResponse.name,
                                    })
                                    setLinkedInExternalWaiting(false);
                                })
                            }
                        }
                    }}
                />{linkedInExternalWaiting && ' ⏳'}</p>

            </div>

            <div>
                <h2>General</h2>
                <input
                    name="generalCompany"
                    type='text'
                    defaultValue='company name'
                    onChange={(e) => {
                        if (e.target.value.trim().length == 0) {
                            setGeneralCompanyName(undefined);
                        } else {
                            setGeneralCompanyName(e.target.value.trim());
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            if (generalCompanyName === undefined) {
                                setCurrentJob(undefined);
                            } else {
                                setCurrentJob({
                                    companyName: generalCompanyName,
                                });
                            }
                        }
                    }}
                />
            </div>
        </div>
    )
}
