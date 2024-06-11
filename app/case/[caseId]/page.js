"use client";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"
// import path from 'path'
// import fs from 'fs'

export default function Case({ params }) {

  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [caseData, setCaseData] = useState(null)

    useEffect(() => {
      setLoading(true)
      fetch('/api/case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({case: params.caseId})
      })
      .then(req => req.json())
      .then(res => {
        console.log(res)
        console.log(typeof res)
        setCaseData(JSON.parse(res))
        setLoading(false)
      })
    }, [])

    const docTitle = (caseData?.['writ']?.['QW']?.['PJJG']?.['@value']) ? caseData?.['writ']?.['QW']?.['PJJG']?.['@value'] : ''
    
  return (
    <div className="h-screen w-screen bg-white flex flex-col justify-center">
      {!loading && (
        <div className="mx-auto border-solid border-black border-2 w-[70%] h-[90%] bg-[#fefcaf] p-4 text-center">
          <div className="h-[150px] w-[100%] p-4 overflow-hidden text-ellipsis">
            <h1 className="text-4xl">关于{docTitle.substring(0, 45) + '...'}</h1>
          </div>
          <div className="grid grid-cols-3 border-b-2 border-solid border-gray-500">
            <div className="text-center">
              <span>案由: {caseData?.['writ']?.['QW']?.['CPFXGC']?.['AY']?.['@value']}</span>
            </div>
            <div className="text-center">
              <span>案号: {caseData?.['writ']?.['QW']?.['WS']?.['AH']?.['@value']}</span>
            </div>
            <div className="text-center">
              <span>审理法院: {caseData?.['writ']?.['QW']?.['WS']?.['JBFY']?.['@value']}</span>
            </div>
          </div>
          <div className="p-4 text-center h-[610px] overflow-y-auto">
            <p>{(caseData) ? caseData['writ']['QW']['@value'] : ''}</p>
          </div>
        </div>
      )}
       
    </div>
  );
}

