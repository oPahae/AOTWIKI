import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const page404 = () => {
    const router = useRouter()
    useEffect(() => {
        router.push('/')
    }, [])
    return (
        <div className='bg-black h-screen'>

        </div>
    )
}

export default page404
