"use client";
import { Inter } from "next/font/google";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation"
import Image from "next/image";
export default function Home() {
  const router = useRouter()

  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [querySuggestions, setQuerySuggestions] = useState([])
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch('/api/autofill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({query: query})
    })
    .then(req => req.json())
    .then(res => {
      console.log(res)
      setQuerySuggestions(res.splice(0, 5))
    })
  }, [query])

  function search(e) {
    e.preventDefault()
    router.push('/search?type=text&query=' + query)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader()
    reader.onload = (e) => {
      console.log(file)
      localStorage.setItem(file.name, reader.result);
    }

    reader.readAsText(file);
    router.push('/search?type=' + 'file&' + 'query=' + file.name)
};

  return (
    <div className="w-screen h-screen bg-white flex flex-col items-center bg-[url('/wave_background.png')] bg-cover">
      <div className="text-center p-10 mt-[100px]">
      <Image
        src="/logo.jpg"
        width={150}
        height={150}
        alt="Logo"
        className="mx-auto"
      />
        {/* <h1 className="text-white text-6xl">GuluGulu</h1> */}
        <span className="text-[var(--purple)] text-6xl font-extrabold">G</span><span className="text-white text-6xl">ulu</span><span className="text-[var(--purple)] text-6xl font-extrabold">G</span><span className="text-white text-6xl">ulu</span>
      </div>
      <form className="w-[700px] mx-auto mt-2" onSubmit={search}>   
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input 
            type="search" 
            id="default-search" 
            className={(querySuggestions.length > 0 && showSuggestions) ? "block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-t-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" : "block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"} 
            placeholder="Search..." 
            required 
            onChange={(e) => {
              setQuery(e.target.value)
            }}
            onFocus={() => {
              setShowSuggestions(true)
            }}
            onBlur={() => {
              setShowSuggestions(false)
            }}
            autocomplete="one-time-code"
          />
          
          <svg onClick={() => {
              fileInputRef.current.click()
          }} className="mr-4 cursor-pointer absolute end-2.5 bottom-3.5" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#7C2E9A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/></svg>
          <input 
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
          />
          {showSuggestions && (
            <div className="absolute w-full bg-gray-700 rounded-b-lg">
              {
                querySuggestions.map((suggestion, i) => {
                  return (
                    <div onMouseDown={(e) => {
                      router.push('/search?type=text&query=' + suggestion)
                    }} key={i} className="w-full hover:bg-gray-500 text-gray-400 py-2 ps-10">
                      <span>{suggestion}</span>
                    </div>
                  )
                })
              }
            </div>
          )}
          
        </div>
      </form>
    </div>
  );
}
