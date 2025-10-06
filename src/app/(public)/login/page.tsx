"use client"
import { use, useState } from "react"
import { useRouter } from "next/navigation"
const apiUrl = 'http://localhost:3005/api/v1'

export default function Page() {
    const router = useRouter()
    const [otp,Setotp] = useState("")
    const [mobile,setMobile] = useState("")
    const [otpbtn,Setotpbtn] = useState(false)
    const getOTP = async(e:any) => {
        e.preventDefault()
        Setotpbtn(true)
        const response = await fetch(`${apiUrl}/public/send-login-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({mobile}),

        })
    }
    const verifyOTP = async(e:any) => {
        e.preventDefault()
        const response = await fetch(`${apiUrl}/public/verify-otp-login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({mobile,otp}),

        })
        const data = await response.json()
        console.log(data)
        if(data.success===true){
            router.push("/")
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-yellow-500 to-pink-500">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm">
                <h4 className="text-center text-2xl font-semibold text-gray-800 mb-6">Login</h4>
                <form className="flex flex-col space-y-4">
                    <label htmlFor="mobile" className="text-sm font-medium text-gray-700">Mobile Number</label>
                    <input type="tel" id="mobile" pattern="[0-9]{10}" maxLength={10} onChange={(e:any)=>setMobile(e.target.value)} className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" placeholder="Please input number" />
                    <button className="text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg py-2" onClick={getOTP}>Get OTP</button>
                    {otpbtn && <>
                    <label htmlFor="otp" className="text-sm font-medium text-gray-700">OTP</label>
                    <input type="text" name="" id="otp" className="text-black border border-gray-300 rounded-lg p-2" onChange={(e:any)=>Setotp(e.target.value)} />
                    <button className="text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg py-2" onClick={verifyOTP}>Verify OTP</button>
                    </>
                    }
                </form>
            </div>

        </div>
    )
}