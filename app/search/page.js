"use client";
import SearchResult  from "./searchResult";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation"


export default function Search() {

    const router = useRouter()
    const searchParams = useSearchParams()
    
    
    const [loading, setLoading] = useState(false)
    const [type, setType] = useState(searchParams.get('type'))
    const [textQuery, setTextQuery] = useState((searchParams.get('type') === 'file') ? '' : searchParams.get('query'))
    const [fileQuery, setFileQuery] = useState((searchParams.get('type') === 'text') ? '' : searchParams.get('query'))
    const [searchResults, setSearchResults] = useState([])
    const [totalResults, setTotalResults] = useState(0)

    // Found n results in m seconds
    const [currentQuery, setCurrentQuery] = useState(searchParams.get('query'))
    const [timeTaken, setTimeTaken] = useState(null)

    const fileInputRef = useRef(null);
   
    useEffect(() => {
        if (type === 'text') getTextSearchResults()

        if (type === 'file') getFileSearchResults()
    }, [])

    async function getTextSearchResults() {
        if (textQuery === '') return
        setLoading(true)
        const start = performance.now()
        fetch('/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({query: textQuery})
        })
        .then(req => req.json())
        .then(res => {
            setLoading(false)
            console.log(res)
            setSearchResults(res.relevantDocs)
            setTotalResults(res.total)
            setCurrentQuery(textQuery)
            const end = performance.now()
            setTimeTaken(end - start)
        })
    }

    async function getFileSearchResults() {
        if (fileQuery === '') return 
        setLoading(true)
        const fileContents = localStorage.getItem(fileQuery)
        console.log(fileContents)
        const start = performance.now()
        fetch('/api/file', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({file: fileContents})
        })
        .then(req => req.json())
        .then(res => {
            console.log(res)
            setSearchResults(res.relevantDocs)
            setTotalResults(res.total)
            setLoading(false)
            setCurrentQuery(fileQuery)
            const end = performance.now()
            setTimeTaken(end - start)
        })
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setFileQuery(file.name)
            const reader = new FileReader()
            reader.onload = (e) => {
            console.log(file)
            localStorage.setItem(file.name, reader.result);
        }

        reader.readAsText(file);
        router.push('/search?type=file&query=' + file.name)
        // const reader = new FileReader()
        // reader.onload = (e) => {
        //     fetch('/api/file', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({file: reader.result})
        //     })
        //     .then(req => req.json())
        //     .then(res => {
        //         console.log(res)
        //         setSearchResults(res.relevantDocs)
        //         setTotalResults(res.total)
        //         setLoading(false)
        //     })
        // }

        // reader.readAsText(file);
          
    };
    
  return (
    <div className="w-screen h-screen bg-gradient-to-r from-[#0D1121] to-[#332E3E] grid grid-rows-[100px_50px_1fr] overflow-hidden">
        <div className="grid grid-cols-[300px_1fr]">
            <div className="flex flex-row justify-center items-center">
                <a href='/'>
                    <span className="text-[var(--purple)] text-4xl font-extrabold">G</span><span className="text-white text-4xl">ulu</span><span className="text-[var(--purple)] text-4xl font-extrabold">G</span><span className="text-white text-4xl">ulu</span>
                </a>
            </div>
            <div className="flex flex-row items-center">
                <div class="w-[600px]">   
                    <div className="relative">
                        {
                            (type === 'text') ?
                            (
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    router.push('/search?type=text&query=' + textQuery)
                                    getTextSearchResults()
                                }}>
                                    <input 
                                        type="search" 
                                        id="default-search" 
                                        defaultValue={searchParams.get('query')} 
                                        value={textQuery}
                                        className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
                                        placeholder="Search keywords" 
                                        required
                                        onChange={(e) => {
                                            setTextQuery(e.target.value)
                                        }} 
                                        autocomplete="one-time-code"
                                    />
                                    <div className="absolute end-2.5 bottom-2.5 flex flex-row items-center">
                                        <svg 
                                            onClick={() => {
                                                setTextQuery('')
                                            }}
                                            className="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        <div className="h-[30px] w-4 border-r-[1px] border-solid border-gray-400 mr-4"></div>
                                        <button type="submit">
                                            <svg 
                                                // onClick={() => {
                                                //     router.push('/search?type=text&query=' + textQuery)
                                                //     getTextSearchResults()
                                                // }}
                                                type="submit"
                                                className="w-[20px] h-[20px] text-gray-500 dark:text-gray-500 cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" 
                                                viewBox="0 0 20 20"
                                            >
                                                
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                            </svg>
                                        </button>
                                        
                                    </div>
                                </form>
                            ) : 
                            (
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    router.push('/search?type=file&query=' + fileQuery)
                                    getFileSearchResults()
                                }} className="w-full h-[54px] flex flex-row items-center border border-gray-300 rounded-lg bg-gray-700 dark:bg-gray-700 dark:border-gray-600">
                                    <div className="h-[60%] flex flex-row px-2">
                                        {
                                            (fileQuery === '') ?
                                            (
                                                <div className="flex flex-row items-center">
                                                    <span className="text-gray-500">Select file</span>
                                                </div>
                                            ) :
                                            (
                                                <div className="flex flex-row items-center rounded-md bg-gray-500 text-white text-center p-2">
                                                    <span className="text-sm">{fileQuery}</span>
                                                </div>
                                            )
                                        }
                                        
                                    </div>
                                    <div className="absolute end-2.5 bottom-2.5 flex flex-row items-center">
                                        <svg 
                                            onClick={() => {
                                                setFileQuery('')
                                            }}
                                            className="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        <div className="h-[30px] w-4 border-r-[1px] border-solid border-gray-400 mr-4"></div>
                                        <svg onClick={() => {
                                                fileInputRef.current.click()
                                            }} className="mr-4 cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#7C2E9A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/></svg>
                                        <input 
                                            type="file"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                        />
                                        <button type="submit">
                                            <svg 
                                                // onClick={() => {
                                                //     router.push('/search?type=file&query=' + fileQuery)
                                                //     getFileSearchResults()
                                                // }}
                                                className="w-[20px] h-[20px] text-gray-500 dark:text-gray-500 cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" 
                                                viewBox="0 0 20 20"
                                            >
                                                
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                            </svg>
                                        </button>
                                        
                                    </div>
                                </form>
                            )
                        }
                        
                    </div>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-[300px_1fr] border-b-[1px] border-solid border-gray-500">
            <div></div>
            <div className="flex flex-row items-end">
                <div className="flex flex-row">
                    <div onClick={() => {
                        setType("text")
                        router.push('/search?type=text&query=' + textQuery)
                    }} className={(type === 'text') ? "w-[60px] h-[40px] text-center border-b-4 border-solid border-[var(--purple)] cursor-pointer" : "w-[60px] h-[40px] text-center cursor-pointer"}>
                        <span className={(type === 'text') ? "text-[var(--purple)]" : "text-gray-500"}>Text</span>
                    </div>
                    <div onClick={() => {
                        setType("file")
                        router.push('/search?type=file&query=' + fileQuery)
                    }} className={(type === 'file') ? "w-[60px] h-[40px] text-center border-b-4 border-solid border-[var(--purple)] cursor-pointer" : "w-[60px] h-[40px] text-center cursor-pointer"}>
                        <span className={(type === 'file') ? "text-[var(--purple)]" : "text-gray-500"}>Files</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-[300px_1fr]">
            <div>
                
            </div>
            <div className="py-5">
                {
                    (loading) ? (
                        <h1 className="text-white 3xl">Searching...</h1>
                    ) : (
                        <div>
                            {<h1 className="text-white 3xl">{totalResults.toString() + " results found in " + (timeTaken/1000).toFixed(1) + " seconds for " + currentQuery}</h1>}
                            {
                                <div className="mt-4 overflow-y-auto h-[700px]">
                                    {
                                        searchResults.map(result => {
                                            return (
                                                <SearchResult key={result.id} document={result} />
                                            )
                                        })
                                    }
                                </div>
                                
                            }
                        </div>
                        
                    )
                    
                }
        </div>
        </div>
        
    </div>
  );
}

