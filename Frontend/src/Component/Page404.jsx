import { Link } from 'react-router-dom'


function Page404() {
  return (
    <div className="container-fluid p-0 position-relative">
      <iframe className='w-100 vh-100' src="https://lottie.host/embed/af6d9e62-3687-4fe8-a0f7-38df5bee86d7/rYEcru3gN6.json"></iframe>
      <div className="d-flex justify-content-between align-items-end">
        <Link to="/" className='position-absolute top-50 start-50 translate-middle fs-1 text-white text-decoration-none px-4 py-2 border border-light rounded-2'>Go Back</Link>
      </div>
    </div>
  )
}

export default Page404
