'use client';
import { PaginatedSearchRagResult, Site } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LoaderCircle, Search } from 'lucide-react';
import { Button } from './baseComponents/button';
import SearchResultItem from './SearchResultItem';
import { Input } from './baseComponents/textInput';
import CustomSelect from './baseComponents/select';
import AiSearch from './icons/AiSearch';
import { chatResponse } from './mocks/mocks';

type ChatRoundTrip = {
  titles: string[];
  question: string;
  answer: string;
};

const SearchResult = ({ data }: { data: Site }) => {
  const [result, setResult] = useState<PaginatedSearchRagResult>({} as PaginatedSearchRagResult);

  const router = useRouter();
  const query = useSearchParams();
  const [searchText, setSearchText] = useState('');
  const [authorized, setAuthorized] = useState(true);
  const [selectedOption, setSelectedOption] = useState('Select a time frame');
  const [selectedSearchOption, setSelectedSearchOption] = useState('search');
  const [selectedResults, setSelectedResults] = useState<Map<string, string>>(new Map<string, string>());
  const [isLoading, setLoading] = useState(true);
  const [isAsking, setAsking] = useState(false);
  const [chat, setChat] = useState<ChatRoundTrip[]>([]);
  const [questionText, setQuestionText] = useState('');
  const lastSearchText = useRef<string>(searchText);
  const showAiSearch = data.root.staticAttributes?.naturalSearchEnabled === 'true';
  const showAiQuestion = data.root.staticAttributes?.ragSearchEnabled === 'true';

  const options = [
    // { value: '', text: 'Select a time frame' },
    { value: 'Today', text: 'Today' },
    { value: 'Last Week', text: 'Last Week' },
    { value: 'Last Month', text: 'Last Month' },
    { value: 'Last Quarter', text: 'Last Quarter' },
    { value: 'Last Year', text: 'Last Year' },
  ];

  const buildSearchOptions = () => {
    const opts = [{ value: 'search', text: 'Search' }];

    if (showAiSearch) {
      opts.push({ value: 'ai-search', text: 'AI Search' });
    }
    if (showAiQuestion) {
      opts.push({ value: 'ai-question', text: 'AI Question' });
    }

    return opts;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionText(e.target.value);
  };

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

  const handleSearchOptionChange = (value: string) => {
    setSelectedSearchOption(value);
  };

  function enableSearch(queryText: string, timeSlice: string) {}

  const syncSelectedResults = (items?: PaginatedSearchRagResult['result']) => {
    setSelectedResults(new Map((items ?? []).map(item => [item.nodeData.id, item.nodeData.title || ''])));
  };

  /** route client to server api exposed for default search */
  const fetchSearch = async (queryParams: URLSearchParams) => {
    const queryCallParams = new URLSearchParams();

    if (queryParams.has('query')) {
      queryCallParams.append('query', queryParams.get('query') ?? '');
    }
    if (queryParams.has('time')) {
      const date = optionToDate(queryParams.get('time') ?? '');

      queryCallParams.append('startDate', date.toISOString());
    }

    if (queryCallParams.size >= 2 && queryCallParams.has('query') && queryCallParams.has('startDate')) {
      setLoading(true);
      const response = await fetch(`/api/search?${queryCallParams.toString()}`);
      setChat([]);
      setResult({} as PaginatedSearchRagResult);
      setSelectedResults(new Map<string, string>());
      if (response.ok) {
        const search = (await response.json()) as PaginatedSearchRagResult;

        console.log('Fetched data:', search);
        setResult(search);
        syncSelectedResults(search.result);
      } else {
        console.log('Fetched rag data error', response);
        setResult({} as PaginatedSearchRagResult);
        setSelectedResults(new Map<string, string>());
      }
    }
    setLoading(false);
  };

  /** route client to server api exposed for natural search */
  const fetchNaturalSearch = async (queryParams: URLSearchParams) => {
    const queryCallParams = new URLSearchParams();

    if (queryParams.has('query')) {
      queryCallParams.append('query', queryParams.get('query') ?? '');
    }
    if (queryParams.has('time')) {
      queryCallParams.append('pastDays', optionToDays(queryParams.get('time') ?? ''));
    }

    queryCallParams.append('rag', 'false');

    if (queryCallParams.size === 3 && queryCallParams.has('query') && queryCallParams.has('pastDays') && authorized) {
      setLoading(true);
      setChat([]);
      setResult({} as PaginatedSearchRagResult);
      setSelectedResults(new Map<string, string>());
      const response = await fetch(`/api/search?${queryCallParams.toString()}`);
      if (response.ok) {
        const data = (await response.json()) as PaginatedSearchRagResult;

        console.log('Fetched rag data:', data);
        setResult(data);
        syncSelectedResults(data.result);
      } else {
        console.log('Fetched rag data error', response);
        setResult({} as PaginatedSearchRagResult);
        setSelectedResults(new Map<string, string>());
        if (response.status === 401 || response.status == 403) {
          setAuthorized(false);
        }
      }
    }
    setLoading(false);
  };

  const fetchNaturalAsk = async (queryParams: URLSearchParams) => {
    const queryCallParams = new URLSearchParams();

    if (queryParams.has('query')) {
      queryCallParams.append('query', queryParams.get('query') ?? '');
    }
    if (queryParams.has('time')) {
      queryCallParams.append('pastDays', optionToDays(queryParams.get('time') ?? ''));
    }

    queryCallParams.append('rag', 'true');

    if (queryCallParams.size === 3 && queryCallParams.has('query') && queryCallParams.has('pastDays') && authorized) {
      setLoading(true);
      setChat([]);
      setResult({} as PaginatedSearchRagResult);
      setSelectedResults(new Map<string, string>());

      const response = await fetch(`/api/search?${queryCallParams.toString()}`);
      if (response.ok) {
        const data = (await response.json()) as PaginatedSearchRagResult;

        console.log('Fetched rag data:', data);
        setResult({ ...data });
        syncSelectedResults(data.result);
      } else {
        console.log('Fetched rag data error', response);
        setResult({} as PaginatedSearchRagResult);
        setSelectedResults(new Map<string, string>());
        if (response.status === 401 || response.status == 403) {
          setAuthorized(false);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const queryText = query.get('query');
    const timeText = query.get('time');

    if (queryText) {
      setSearchText(queryText);
    } else {
      setSearchText('');
      setChat([]);
      setResult({} as PaginatedSearchRagResult);
      setSelectedResults(new Map<string, string>());
    }
    if (timeText) {
      setSelectedOption(timeText);
    } else {
      setSelectedOption('Last Year');
      setChat([]);
      setResult({} as PaginatedSearchRagResult);
      setSelectedResults(new Map<string, string>());
    }

    enableSearch(searchText, selectedOption);

    if (query.get('t')) {
      if (query.get('t') === 'n') {
        fetchNaturalSearch(query);
      } else if (query.get('t') === 'a') {
        fetchNaturalAsk(query);
      }
    } else {
      fetchSearch(query);
    }
  }, [query]); // Refetch data when query parameters change

  const getQueryParams = (): URLSearchParams => {
    const queryParams = new URLSearchParams();
    if (searchText) {
      queryParams.append('query', searchText);
    }
    queryParams.append('time', selectedOption);

    return queryParams;
  };

  const handleSearch = async () => {
    if (!searchText || searchText.trim() === '') return;

    const queryParams = getQueryParams();

    queryParams.delete('t');

    console.log('Search query params:', queryParams.toString());

    // Update the URL with query parameters
    router.push(`/search?${queryParams.toString()}`);
  };

  const handleAiSearch = async () => {
    if (!searchText || searchText.trim() === '') return;

    const queryParams = getQueryParams();

    queryParams.append('t', 'n');

    // Update the URL with query parameters
    router.push(`/search?${queryParams.toString()}`);
  };

  const handleAiAsk = async () => {
    if (!searchText || searchText.trim() === '') return;

    const queryParams = getQueryParams();

    queryParams.append('t', 'a');

    // Update the URL with query parameters
    router.push(`/search?${queryParams.toString()}`);
  };

  const handleOnSearchFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior

    lastSearchText.current = searchText;
    if (selectedSearchOption === 'search') {
      handleSearch();
    } else if (selectedSearchOption === 'ai-search') {
      handleAiSearch();
    } else if (selectedSearchOption === 'ai-question') {
      handleAiAsk();
    }
  };

  const handleAnswerToSelection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`Question about selected results: ${questionText}`);

    const selectedKeys = Array.from(selectedResults.keys());
    const queryCallParams = new URLSearchParams();

    queryCallParams.append('query', questionText);

    try {
      if (questionText.trim() === '') return;

      setAsking(true);
      const response = await fetch(`/api/askabout?${queryCallParams.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedKeys),
      });

      if (response.ok) {
        const data = await response.json();

        console.log('askabout response:', data);

        const newChatRoundTrip: ChatRoundTrip = {
          titles: Array.from(selectedResults.values()),
          question: questionText,
          answer: data?.answer || 'No answer provided',
        };

        setChat(prevChat => [...prevChat, newChatRoundTrip]);
        setQuestionText('');
      } else {
        console.log('askabout error', response);
        if (response.status === 401 || response.status == 403) {
          setAuthorized(false);
        } else {
          const newChatRoundTrip: ChatRoundTrip = {
            titles: Array.from(selectedResults.values()),
            question: questionText,
            answer: `for error ${response.status} as answer`,
          };

          setChat(prevChat => [...prevChat, newChatRoundTrip]);
        }
      }
      setAsking(false);
    } catch (error) {
      console.error('Error during fetch:', error);
      setAsking(false);
    }
  };

  const changeSelected = (id: string, ref: string, title: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`Checkbox for item ${id} changed to ${event.target.checked} for ref:${ref}`);
    // Implement any additional logic for handling the checkbox state change here
    if (event.target.checked) {
      setSelectedResults(prev => new Map(prev).set(ref, title));
    } else {
      setSelectedResults(prev => {
        const newSet = new Map(prev);
        newSet.delete(ref);
        return newSet;
      });
    }
    console.log(
      `Selected results: ${Array.from(selectedResults.entries())
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ')}`,
    );
  };

  return (
    <div className="max-w-page mx-auto px-space-md pt-space-2xl pb-space-4xl">
      <form onSubmit={handleOnSearchFormSubmit}>
        <div className="flex flex-col sm:flex-row gap-space-xs">
          <div className="flex grow-1 flex-col gap-space-2xs">
            <div className="flex flex-col sm:flex-row gap-space-xs">
              <CustomSelect
                placeholder=""
                options={buildSearchOptions()}
                className="w-full sm:w-auto"
                value={selectedSearchOption}
                onChange={handleSearchOptionChange}
              />
              <Input
                type="text"
                id="searchText"
                value={searchText}
                onChange={handleTextChange}
                className="grow-1"
                Icon={<Search />}
                placeholder="Enter search text to enable search"
              />
            </div>
          </div>
        </div>
      </form>

      {
        /* Render search results */
        isLoading ? (
          <div className="mt-space-3xl flex flex-col items-center gap-space-xs">
            <LoaderCircle className="w-6 h-6 animate-spin text-primary" />
            <p className="text-body-sm text-copy-muted">Loading data...</p>
          </div>
        ) : (
          <div className="mt-space-2xl flex flex-col items-center gap-space-2xl">
            {result?.answer && (
              <div className="w-full flex flex-col gap-space-xs bg-surface p-space-lg rounded-card">
                <h2 className="text-h3 text-heading">The globe overview</h2>
                <p className="text-body text-copy">{result?.answer}</p>
              </div>
            )}
            {result.count > 0 && (
              <div className="flex w-full flex-col md:flex-row md:justify-between md:items-end gap-space-md">
                <div className="flex flex-col gap-space-2xs">
                  <p className="eyebrow text-primary">Response references</p>
                  <p className="text-body-sm text-copy-muted">{result.count} items that match with:</p>
                  <h2 className="text-h2 text-heading">{lastSearchText.current}</h2>
                </div>
                <div className="flex flex-col gap-space-2xs">
                  <label className="text-body-sm text-copy-muted whitespace-nowrap">Select time period</label>
                  <CustomSelect
                    placeholder=""
                    options={options}
                    value={selectedOption}
                    onChange={handleOptionChange}
                    className="w-full md:w-auto"
                  />
                </div>
              </div>
            )}
            <div className="w-full flex flex-col divide-y divide-line">
              {result?.count > 0 ? (
                result.result.map((result, index) => {
                  return (
                    <SearchResultItem
                      result={result}
                      data={data}
                      key={result.nodeData.id}
                      onChangeSelected={changeSelected}
                      index={index}
                    />
                  );
                })
              ) : (
                <div className="flex flex-col items-center gap-space-sm text-center py-space-2xl">
                  <span className="flex items-center justify-center w-button h-button rounded-full bg-surface text-primary">
                    <Search className="w-4 h-4" />
                  </span>
                  {!authorized && query.get('t') === 'n' ? (
                    <p className="text-body text-copy-muted">You are not authorized to use AI features</p>
                  ) : (
                    <div className="flex flex-col items-center gap-space-xs">
                      <h2 className="text-h2 text-heading">No results found</h2>
                      <p className="text-body text-copy-muted max-w-reading">
                        Search content inside {data.root.title}, our AI will give you an overview of what found and the
                        list of results.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            {chat.length > 0 ? (
              <div className="w-full">
                <h3 className="text-h3 mb-space-sm text-heading">AI Chat History</h3>
                {chat.map((item, index) => (
                  <div key={index} className="mt-space-sm mb-space-sm text-left">
                    <div className="text-body text-copy text-left bg-surface rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-lg p-space-sm my-space-2xs inline-block max-w-full">
                      <p>{item.question}</p>
                    </div>
                    <div className="text-body text-copy text-right bg-primary-lightest rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-none p-space-sm my-space-2xs inline-block max-w-full ml-space-6xl">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-space-sm"></div>
            )}
            {authorized && selectedResults.size > 0 ? (
              <div className="grid w-full gap-space-2xs">
                <h3 className="text-lead font-title text-heading">Using the set of selected results</h3>
                <ul className="flex flex-col gap-space-3xs text-body-sm text-copy list-none pl-0 m-0">
                  {Array.from(selectedResults.entries()).map(([key, value], index) => {
                    return (
                      <li key={index} className="search-ask-about-selected-item">
                        <p>
                          <span className="mr-space-2xs text-heading">•</span>
                          <i>{value}</i>
                        </p>
                      </li>
                    );
                  })}
                </ul>
                <form onSubmit={handleAnswerToSelection} className="flex w-full gap-space-2xs">
                  <Input
                    type="text"
                    id="questionText"
                    value={questionText}
                    onChange={handleQuestionTextChange}
                    className="grow-1"
                    placeholder="Enter question about selected results"
                  />
                  <Button type="submit" disabled={isAsking}>
                    Ask
                  </Button>
                </form>
                {isAsking ? (
                  <div className="flex flex-col items-center gap-space-xs">
                    <LoaderCircle className="w-6 h-6 animate-spin text-primary" />
                    <p className="text-body-sm text-copy-muted">Asking...</p>
                  </div>
                ) : (
                  <div className="mt-space-sm"></div>
                )}
              </div>
            ) : (
              <div className="mt-space-sm"></div>
            )}
          </div>
        )
      }
    </div>
  );
};

export default SearchResult;

function optionToDate(selectedOption: string): Date {
  const date = new Date();

  switch (selectedOption) {
    case 'Today':
      date.setDate(date.getDate() - 1);
      break;
    case 'Last Week':
      date.setDate(date.getDate() - 7);
      break;
    case 'Last Month':
      date.setMonth(date.getMonth() - 1);
      break;
    case 'Last Quarter':
      date.setMonth(date.getMonth() - 3);
      break;
    case 'Last Year':
      date.setFullYear(date.getFullYear() - 1);
      break;
    default:
      date.setDate(date.getDate() - 7);
      break;
  }

  // reset the hour, minute and second to 0
  date.setHours(0, 0, 0, 0);
  return date;
}

function optionToDays(selectedOption: string): string {
  switch (selectedOption) {
    case 'Today':
      return '1';
    case 'Last Week':
      return '7';
    case 'Last Month':
      return '30';
    case 'Last Quarter':
      return '120';
    case 'Last Year':
      return '365';
    default:
      return '7';
  }
}
