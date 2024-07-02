// import { RcFile } from 'antd/es/upload'
import { useAtomValue } from 'jotai'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
// import useQuoteApi from '../api/quote'
import { saveSnippetsDotTxt } from '../db/quote.db'
import userAtom from '../state/user'

const useFileUpload = () => {
  // const { upload } = useQuoteApi()
  const user = useAtomValue(userAtom)
  const navigate = useNavigate()

  return {
    handleUpload: (file: any): Promise<any> => {
      return new Promise(resolve => {
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = async () => {
          const binaryStr = reader.result
          if (!binaryStr || binaryStr instanceof ArrayBuffer) {
            return console.log('failed')
          }
          const clippings = binaryStr
            .split('==========')
            .map(entry => entry.split(/\r?\n/).filter(data => data.length))
          const parsedClippings = clippings
            .map(([source, meta, content]) => {
              const parts: string[] = meta?.split(' | ')
              const inception = parts?.pop()
              const createdAt = inception && new Date(inception.replace('Added on ', ''))
              return (
                createdAt &&
                content && { source, meta: parts?.join(' | '), content, createdAt, user }
              )
            })
            .filter(Boolean) as any[]

          // Save the snippets to server
          const res = await saveSnippetsDotTxt(parsedClippings)
          toast.success(`Added ${res.length} new quote(s)!`)
          resolve(res)
          navigate('staging')
        }
      })
    },

    dummyRequest: ({ onSuccess }: any) => {
      setTimeout(() => {
        onSuccess('ok')
      }, 0)
    },
  }
}

export default useFileUpload
