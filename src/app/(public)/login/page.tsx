"use client"
import { use, useState } from "react"
import { useRouter } from "next/navigation"
const apiUrl =
  (process.env.NEXT_PUBLIC_BASE_URL ?? "") +
  (process.env.NEXT_PUBLIC_API_VERSION ?? "");

export default function Page() {
    const router = useRouter()
    const [otp,Setotp] = useState("")
    const [mobile,setMobile] = useState("")
    const [otpbtn,Setotpbtn] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    
    const getOTP = async(e:any) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        setIsLoading(true)
        
        try {
            const response = await fetch(`${apiUrl}/public/send-login-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({mobile}),
            })
            
            const data = await response.json()
            
            if (response.ok && data.success) {
                setSuccess("OTP sent successfully!")
                Setotpbtn(true)
                setTimeout(() => setSuccess(""), 3000)
            } else {
                setError(data.message || "Failed to send OTP. Please try again.")
            }
        } catch (err) {
            setError("Network error. Please check your connection.")
        } finally {
            setIsLoading(false)
        }
    }
    
    const verifyOTP = async(e:any) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        setIsLoading(true)
        
        try {
            const response = await fetch(`${apiUrl}/public/verify-otp-login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({mobile,otp}),
            })
            
            const data = await response.json()
            
            if (response.ok && data.success === true) {
                const token = data?.data?.token
                if (token) {
                    localStorage.setItem("ilb-token", token)
                    setSuccess("Login successful! Redirecting...")
                    setTimeout(() => {
                        router.push("/")
                    }, 1000)
                } else {
                    setError("Invalid response from server.")
                }
            } else {
                setError(data.message || "Invalid OTP. Please try again.")
                Setotp("")
            }
        } catch (err) {
            setError("Network error. Please check your connection.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-background animate-gradient">
            <style jsx>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 6s ease infinite;
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeInUp {
                    animation: fadeInUp 0.6s ease-out forwards;
                }
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        max-height: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        max-height: 500px;
                        transform: translateY(0);
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.5s ease-out forwards;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
            
            <div className="bg-card shadow-2xl rounded-2xl p-8 w-full max-w-md animate-fadeInUp transform hover:scale-[1.02] transition-transform duration-300 border">
                <h4 className="text-center text-2xl font-semibold text-card-foreground mb-6 animate-fadeInUp">Login</h4>
                
                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded-lg animate-fadeIn animate-shake">
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="mb-4 p-3 bg-primary/10 border border-primary text-primary rounded-lg animate-fadeIn">
                        <p className="text-sm font-medium">{success}</p>
                    </div>
                )}
                
                <form className="flex flex-col space-y-4">
                    <div className="animate-fadeInUp" style={{animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards'}}>
                        <label htmlFor="mobile" className="text-sm font-medium text-muted-foreground">Mobile Number</label>
                        <input
                            type="tel"
                            id="mobile"
                            pattern="[0-9]{10}"
                            maxLength={10}
                            value={mobile}
                            onChange={(e:any)=>setMobile(e.target.value.replace(/\D/g, ''))}
                            className="w-full border border-border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all duration-300 bg-background"
                            placeholder="Enter 10-digit number"
                            disabled={otpbtn}
                        />
                    </div>
                    
                    {!otpbtn && (
                        <button
                            type="button"
                            className="text-primary-foreground bg-gradient-to-r from-primary to-accent hover:from-primary hover:to-accent/80 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg py-2 font-medium transform active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center animate-fadeInUp"
                            onClick={getOTP}
                            disabled={isLoading || mobile.length !== 10}
                            style={{animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards'}}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                'Get OTP'
                            )}
                        </button>
                    )}
                    
                    {otpbtn && (
                        <div className="animate-slideDown space-y-4">
                            <div>
                                <label htmlFor="otp" className="text-sm font-medium text-muted-foreground">OTP</label>
                                <input
                                    type="text"
                                    id="otp"
                                    maxLength={6}
                                    value={otp}
                                    className="w-full text-foreground border border-border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary bg-background transition-all duration-300"
                                    onChange={(e:any)=>Setotp(e.target.value.replace(/\D/g, ''))}
                                    placeholder="Enter OTP"
                                    autoFocus
                                />
                            </div>
                            <button
                                type="button"
                                className="w-full text-primary-foreground bg-gradient-to-r from-primary to-accent hover:from-primary hover:to-accent/80 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg py-2 font-medium transform active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                onClick={verifyOTP}
                                disabled={isLoading || otp.length < 4}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    'Verify OTP'
                                )}
                            </button>
                            
                            <button
                                type="button"
                                className="w-full text-primary hover:text-primary/80 text-sm font-medium underline transition-colors duration-200"
                                onClick={() => {
                                    Setotpbtn(false)
                                    Setotp("")
                                    setError("")
                                    setSuccess("")
                                }}
                            >
                                Change Mobile Number
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}