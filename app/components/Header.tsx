import { modalStateAtom } from '@/state/modal'
import userAtom from '@/state/user'
import { Link } from '@remix-run/react'
import { useAtomValue, useSetAtom } from 'jotai'
import { PlusIcon, SmileIcon, UploadIcon } from 'lucide-react'
import { Tooltip } from './ui/tooltip'

const Header = () => {
  const user = useAtomValue(userAtom)
  // const { handleUpload, dummyRequest } = useFileUpload()
  // const location = window.location.pathname
  const setEditQuoteModalState = useSetAtom(modalStateAtom('editQuote'))

  return (
    <header className='flex flex-row w-full justify-between py-2 px-4 border-b'>
      <Link to='/quotes' className='flex'>
        <h1 className='text-4xl italic font-semibold'>Quotes</h1>
        <h1 className='text-4xl italic font-light opacity-50'> - the app</h1>
      </Link>
      <div className='flex items-center gap-2'>
        {/* <Tooltip placement='bottom' title='Home'>
            <Button className={cn(location === '/' && 'border')}>
              <HomeIcon />
            </Button>
          </Tooltip>
        </Link> */}
        {/* <Link
          to={`random/${new Date().getTime()}`}
          className={cn(location.includes('random') && 'border')}
        >
          <Tooltip placement='bottom' title='Random Quote'>
            <Button className=''>
              <ArrowLeftRight />
            </Button>
          </Tooltip>
        </Link> */}
        {/* <Link to='staging'>
          <Tooltip placement='bottom' title='Quote Staging'>
            <Button className=''>
              <Edit />
            </Button>
          </Tooltip>
        </Link> */}
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
        <Tooltip content='Add Quote' onClick={() => setEditQuoteModalState({})}>
          {/* <Button className='' onClick={() => setEditQuoteModalState({})}> */}
          <PlusIcon />
          {/* </Button> */}
        </Tooltip>
        <Link to='users'>
          <Tooltip content='Change User'>
            {user ? user.name[0].toUpperCase() : <SmileIcon />}
            {/* <Button className='w-12'></Button> */}
          </Tooltip>
        </Link>
      </div>
    </header>
  )
}

export default Header
