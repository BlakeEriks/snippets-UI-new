import { cn } from '@/lib/styles'
import { User } from '@prisma/client'
import { Link, useLocation } from '@remix-run/react'
import { ArrowLeftRight, PlusIcon, SmileIcon, UploadIcon } from 'lucide-react'
import { Tooltip } from './ui/tooltip'

const Header = ({ user }: { user: User }) => {
  const { pathname } = useLocation()
  // const { handleUpload, dummyRequest } = useFileUpload()

  return (
    <header className='flex flex-row w-full justify-between py-2 px-4 border-b'>
      <Link to='/books' className={cn('flex', pathname.includes('books') && 'pointer-events-none')}>
        <h1 className='text-4xl italic font-semibold'>Quotes</h1>
        <h1 className='text-4xl italic font-light opacity-50'> - the app</h1>
      </Link>
      <div className='flex items-center gap-2'>
        <Tooltip content='Random Quote' asChild>
          {/* <Link to={`random/${new Date().getTime()}`}> */}
          <ArrowLeftRight />
          {/* </Link> */}
        </Tooltip>
        <Tooltip content='Upload Snippets'>
          {/* <Upload
            beforeUpload={handleUpload}
            name='file'
            customRequest={dummyRequest}
            showUploadList={false}
          > */}
          {/* <Button className=''> */}
          <UploadIcon />
          {/* </Button> */}
          {/* </Upload> */}
        </Tooltip>
        <Tooltip content='Add Quote' asChild>
          <Link to='quotes/new'>
            <PlusIcon />
          </Link>
        </Tooltip>
        <Link to='users'>
          <Tooltip content='Change User'>
            {/* {user ? 'user' : <SmileIcon />} */}
            {user ? user.name[0].toUpperCase() : <SmileIcon />}
          </Tooltip>
        </Link>
      </div>
    </header>
  )
}

export default Header
