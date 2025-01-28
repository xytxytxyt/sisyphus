import { Dispatch, useEffect, useState } from 'react';
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

function getLinkedInJobUrlFromJobId(id: string): string {
    return `https://www.linkedin.com/comm/jobs/view/${id}/`;
}

function handleNewLinkedInJob(
    jobId: string | undefined,
    jobUrl: string | undefined,
    setCurrentJob: Dispatch<Job | undefined>,
    setWaiting: Dispatch<boolean>,
) {
    if (jobId === undefined) {
        setCurrentJob(undefined);
    } else {
        console.log(`Looking up company for LinkedIn job id ${jobId}`);
        setWaiting(true);
        fetch(
            `${backendHost}/linkedin/job/${jobId}/company`,
            {
                headers: {
                    'Accept': 'application/json',
                }
            }
        ).then(response => {
            return response.json() as Promise<LinkedInJobCompanySearchResponse>;
        }).then(linkedInJobCompanySearchResponse => {
            setCurrentJob({
                linkedInJobUrl: jobUrl,
                linkedInJobId: jobId,
                companyName: linkedInJobCompanySearchResponse.name,
            })
            setWaiting(false);
        })
    }
}

export default function JobSources(props: JobSourcesProps) {
    let setCurrentJob = props.setCurrentJob

    const [linkedInJobsSearchConfigs, setLinkedInJobsSearchConfigs] = useState<LinkedInJobsSearchConfig[]>([]);
    const [linkedInJobsSearchConfigsWaiting, setLinkedInJobsSearchConfigsWaiting] = useState<boolean>(false);

    useEffect(
        () => {
            console.log('Loading LinkedIn job search configs');
            setLinkedInJobsSearchConfigsWaiting(true);
            fetch(
                `${backendHost}/linkedin/search_configs`,
                {
                    headers: {
                        'Accept': 'application/json',
                    }
                }
            ).then(response => {
                return response.json() as Promise<LinkedInJobsSearchConfigsResponse>;
            }).then(linkedInJobsSearchConfigsResponse => {
                setLinkedInJobsSearchConfigs(
                    Object.values(
                        linkedInJobsSearchConfigsResponse.configs
                    ).map(config => {
                        return {
                            configName: config.config_name,
                            keywords: config.keywords,
                        }
                    })
                );
                setLinkedInJobsSearchConfigsWaiting(false);
            })
        },
        [],
    );

    const [linkedInJobUrl, setLinkedInJobUrl] = useState<string>();
    const [linkedInJobId, setLinkedInJobId] = useState<string>();
    const [generalCompanyName, setGeneralCompanyName] = useState<string>();
    const [linkedInExternalWaiting, setLinkedInExternalWaiting] = useState<boolean>(false);

    return (
        <div id="jobsources">
            <h1>Job Sources</h1>

            <div>
                <h2>LinkedIn</h2>
                <p>{linkedInJobsSearchConfigsWaiting && ' ⏳'}</p>
                <LinkedInJobsSearches
                    linkedInJobsSearchConfigs={linkedInJobsSearchConfigs}
                    setCurrentJob={setCurrentJob}
                />
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
                            handleNewLinkedInJob(linkedInJobId, linkedInJobUrl, setCurrentJob, setLinkedInExternalWaiting);
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

interface LinkedInJobsSearchConfig {
    configName: string
    keywords: string
}

interface LinkedInJobsSearchConfigResponse {
    config_name: string
    keywords: string
}

interface LinkedInJobsSearchConfigsResponse {
    configs: { [configName: string] : LinkedInJobsSearchConfigResponse }
}

function LinkedInJobsSearches({ linkedInJobsSearchConfigs, setCurrentJob }: { linkedInJobsSearchConfigs: LinkedInJobsSearchConfig[], setCurrentJob: Dispatch<Job | undefined> }) {
    return (
        <ul>
            {linkedInJobsSearchConfigs.map(config => {
                return (
                    <li key={config.configName}>
                        {config.configName} - {config.keywords}
                        <LinkedInJobsSearch
                            configName={config.configName}
                            setCurrentJob={setCurrentJob}
                        />
                    </li>
                )
            })}
        </ul>
    )
}

interface LinkedInJobSearchResult {
    id: string
    title: string
}

function LinkedInJobsSearch({ configName, setCurrentJob }: { configName: string, setCurrentJob: Dispatch<Job | undefined> }) {
    const [searching, setSearching] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<LinkedInJobSearchResult[]>();
    const [lookingUpJob, setLookingUpJob] = useState<boolean[]>([]);

    function getSetSingleLookingUpJob(i: number) {
        const setSingleLookingUpJob = (v: boolean) => {
            let newLookingUpJob: boolean[] = Object.assign([], lookingUpJob);
            newLookingUpJob[i] = v;
            setLookingUpJob(newLookingUpJob);
        }
        return setSingleLookingUpJob;
    }

    return (
        <>
            &nbsp;
            <button
                onClick={(e) => {
                    if (e.button == 0) {
                        console.log(`Searching: ${configName}`);
                        setSearching(true);
                        fetch(
                            `${backendHost}/linkedin/search_jobs/${configName}`,
                            {
                                headers: {
                                    'Accept': 'application/json',
                                }
                            }
                        ).then(response => {
                            return response.json() as Promise<LinkedInJobSearchResult[]>;
                        }).then(linkedInJobSearchResults => {
                            setSearchResults(linkedInJobSearchResults);
                            setLookingUpJob(new Array<boolean>(linkedInJobSearchResults.length).fill(false));
                            setSearching(false);
                        })
                    }
                }}
            >🔍</button>
            <p>{searching && ' ⏳'}</p>
            <p>{(searchResults && searchResults.length == 0) && 'No results'}</p>
            <ul>
                {searchResults && searchResults.map((result, i) => {
                    return (
                        <li key={result.id}>
                            <a href={getLinkedInJobUrlFromJobId(result.id)}>{result.title}</a>
                            &nbsp;
                            <button
                                onClick={(e) => {
                                    if (e.button == 0) {
                                        handleNewLinkedInJob(result.id, undefined, setCurrentJob, getSetSingleLookingUpJob(i));
                                    }
                                }}
                            >🔍</button>
                            &nbsp;
                            {lookingUpJob[i] && ' ⏳'}
                        </li>
                    )
                })}
            </ul>
        </>
    )
}
