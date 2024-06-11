import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function SearchResult({key, document}) {

//   const fixedString = escapeInvalidJSON(document.content)
//   console.log(fixedString)
  const docText = JSON.parse(document.content)['QW']['@oValue']
  const docTitle = JSON.parse(document.content)['QW']['WS']['@value']
  const matchedText = document.matchedText
  // const docSummary = (JSON.parse(document.content)['QW']['AJJBQK']) ? JSON.parse(document.content)['QW']['AJJBQK']['@value'] : '--'
  // const docDecision = (JSON.parse(document.content)['QW']['PJJG']) ? JSON.parse(document.content)['QW']['PJJG']['@value'] : '--'
  // const docReason = (JSON.parse(document.content)['QW']['CPFXGC'] && JSON.parse(document.content)['QW']['CPFXGC']['AY']) ? JSON.parse(document.content)['QW']['CPFXGC']['AY']['@value'] : '其他理由'
  // const docNumber = (JSON.parse(document.content)['QW']['WS']['AH']) ? JSON.parse(document.content)['QW']['WS']['AH']['@value'] : '--'
  // const docCourt = (JSON.parse(document.content)['QW']['WS']['JBFY']) ? JSON.parse(document.content)['QW']['WS']['JBFY']['@value'] : '--'
  const docSummary = JSON.parse(document.content)['QW']['AJJBQK']?.['@value'] 
  const docDecision = JSON.parse(document.content)['QW']['PJJG']?.['@value']
  const docReason = JSON.parse(document.content)['QW']['CPFXGC']?.['AY']?.['@value'] 
  const docNumber = JSON.parse(document.content)['QW']['WS']['AH']?.['@value'] 
  const docCourt = JSON.parse(document.content)['QW']['WS']['JBFY']?.['@value'] 
  const keyword_indices = []
  document.matchedTerms.sort((a, b) => b.length - a.length).forEach(term => {
    const index = docText.indexOf(term)
    keyword_indices.push(index)
  })
  const snippetStart = Math.min(...keyword_indices)
  let highlightedSnippet = docText.substring(snippetStart, snippetStart + 50)
    document.matchedTerms.forEach(word => {
        const regex = new RegExp(`(${word})`, 'gi');
        highlightedSnippet = highlightedSnippet.replace(regex, '<span style="color: #7C2E9A; font-weight: bold;">' + word + '</span>')
    })
  
    
  return (
    // <div className="h-[200px] w-[700px] rounded bg-gray-200 p-4 mb-4 hover:bg-gray-400 opacity-70">
    //     <p dangerouslySetInnerHTML={{ __html: text }} className="truncate"/>
    // </div>
    <Link href={"/case/" + document.id}>
      <div className="h-[200px] w-[700px] rounded bg-gray-200 p-6 mb-4 hover:bg-gray-400 opacity-70">
        <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis mb-2">
          <span className="text-[20px]">{(docSummary) ? docSummary : '--'}</span>
        </div>
        <div className="w-full py-[10px] whitespace-nowrap overflow-hidden text-ellipsis border-b-[1px] border-solid border-gray-400">
          {
            // (matchedText.length > 0) ? 
            // (
            //   <p dangerouslySetInnerHTML={{ __html: document.matchedText }} className="truncate text-gray-700"/>
            // ) : 
            // (
            //   <p className="text-gray-700">{docSummary}</p>
            // )
            <p dangerouslySetInnerHTML={{ __html: highlightedSnippet }} className="truncate text-gray-700"/>
          }
        </div>
        <div className="w-full py-[10px] whitespace-nowrap overflow-hidden text-ellipsis">
          <span className="text-gray-700">{'[判决结果]: ' + (docDecision) ? docDecision : '--'}</span>
        </div>
        <div className="w-full flex flex-row justify-between items-center">
          <div className="w-[30%] h-50px bg-gray-300 overflow-hidden text-gray-700 px-2 py-[5px] whitespace-nowrap text-ellipsis text-center">{(docReason) ? docReason : '其他理由'}</div>
          <div className="w-[30%] h-50px bg-gray-300 overflow-hidden text-gray-700 px-2 py-[5px] whitespace-nowrap text-ellipsis text-center">{(docNumber) ? docNumber : '--'}</div>
          <div className="w-[30%] h-50px bg-gray-300 overflow-hidden text-gray-700 px-2 py-[5px] whitespace-nowrap text-ellipsis text-center">{(docCourt) ? docCourt : '--'}</div>
        </div>  
      </div>
    </Link>
    

  );
}
