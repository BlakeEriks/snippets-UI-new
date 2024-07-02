import Header from '@/components/Header'
import { type MetaFunction } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
// import Header from '~/components/Header'

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

// export const loader: LoaderFunction = async ({ request }) => {
//   await requireUserId(request)
//   return redirect('/home')
// }

export default function Index() {
  // const user = useAtomValue(userAtom)
  // const navigate = useNavigate()
  // const location = useLocation()

  // useEffect(() => {
  //   if (!user) navigate('/users')
  // }, [user, navigate])

  return (
    <div className='font-sans p-4'>
      <Header />
      <ul className='list-disc mt-4 pl-6 space-y-2'>This is where the rendered quotes will be.</ul>
      <Outlet />
    </div>
  )
}
