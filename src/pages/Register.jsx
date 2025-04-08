import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  RiUserLine, 
  RiMailLine, 
  RiPhoneLine, 
  RiMapPinLine,
  RiEyeLine,
  RiEyeOffLine,
  RiLockLine,
  RiErrorWarningLine
} from 'react-icons/ri';
import axios from 'axios';
import { URL } from '../url';


const Register = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [selectedLga, setSelectedLGA] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('')
  const [lgarea, setLGArea] = useState([])
  const [error, setError] = useState(false)
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

      const fetchLGA = async () => {
        const res = await axios.get(`${URL}/api/deliveryrates`)
        console.log("delivery rates", res.data)
        setLGArea(res.data)
      }
    
      useEffect(() => {
        fetchLGA()
      }, [])

      const handleLGA = (e) => {
        const value = e.target.value;
        if(value !== ''){ // Only update if  valid option is selected
        setSelectedLGA(value)
        }
      }

      const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
          const res = await axios.post(URL + "/api/auth/register", {firstName, lastName, email, phone, password, lga:selectedLga, address, state, country })
    
          // const { accessToken, user } = res.data;
    
          if (res.status == 200) {
            // localStorage.setItem("access_token", accessToken)
            // login(user)
            setIsLoading(false)
            console.log(res.data)
            navigate("/login")
          }
    
        }
        catch (err) {
          console.log(err)
        } finally {
          setIsLoading(false)
        }
      }

      const navigate = useNavigate()

    
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Fields */}
             <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
               {/* First Name */}
               <div>
                 <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                   First Name
                 </label>
                 <div className="mt-1 relative rounded-md shadow-sm">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                     <RiUserLine className="h-5 w-5 text-gray-400" />
                   </div>
                   <input
                     type="text"
                     name="firstName"
                     id="firstName"
                     placeholder='First Name'
                     onChange={(e) => setFirstName(e.target.value)}
                     className={`block w-full pl-10 pr-3 py-2 border ${
                       errors.firstName ? 'border-red-300' : 'border-gray-300'
                     } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                   />
                 </div>
                 {errors.firstName && (
                   <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                 )}
               </div>

               {/* Last Name */}
               <div>
                 <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                   Last Name
                 </label>
                 <div className="mt-1 relative rounded-md shadow-sm">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                     <RiUserLine className="h-5 w-5 text-gray-400" />
                   </div>
                   <input
                     type="text"
                     name="lastName"
                     id="lastName"
                     onChange={(e) => setLastName(e.target.value)}
                     className={`block w-full pl-10 pr-3 py-2 border ${
                       errors.lastName ? 'border-red-300' : 'border-gray-300'
                     } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                   />
                 </div>
                 {errors.lastName && (
                   <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                 )}
               </div>
             </div>

             {/* Email */}
             <div>
               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                 Email address
               </label>
               <div className="mt-1 relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                   <RiMailLine className="h-5 w-5 text-gray-400" />
                 </div>
                 <input
                   type="email"
                   name="email"
                   id="email"
                   onChange={(e) => setEmail(e.target.value)}
                   className={`block w-full pl-10 pr-3 py-2 border ${
                     errors.email ? 'border-red-300' : 'border-gray-300'
                   } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                 />
               </div>
               {errors.email && (
                 <p className="mt-1 text-sm text-red-600">{errors.email}</p>
               )}
             </div>

             {/* Phone */}
             <div>
               <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                 Phone number
               </label>
               <div className="mt-1 relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                   <RiPhoneLine className="h-5 w-5 text-gray-400" />
                 </div>
                 <input
                   type="tel"
                   name="phone"
                   id="phone"
                
            
                   onChange={(e) => setPhone(e.target.value)}
                   className={`block w-full pl-10 pr-3 py-2 border ${
                     errors.phone ? 'border-red-300' : 'border-gray-300'
                   } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                 />
               </div>
               {errors.phone && (
                 <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
               )}
             </div>

                {/* Password */}
                <div>
               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                 Password
               </label>
               <div className="mt-1 relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                   <RiLockLine className="h-5 w-5 text-gray-400" />
                 </div>
                 <input
                   type={showPassword ? "text" : "password"}
                   name="password"
                   id="password"     
                   onChange={(e) => setPassword(e.target.value)}
                   className={`block w-full pl-10 pr-10 py-2 border ${
                     errors.password ? 'border-red-300' : 'border-gray-300'
                   } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                 />
                 <button
                   type="button"
                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
                   onClick={() => setShowPassword(!showPassword)}
                 >
                   {showPassword ? (
                     <RiEyeOffLine className="h-5 w-5 text-gray-400" />
                   ) : (
                     <RiEyeLine className="h-5 w-5 text-gray-400" />
                   )}
                 </button>
               </div>
               {errors.password && (
                 <p className="mt-1 text-sm text-red-600">{errors.password}</p>
               )}
             </div>

                {/* Address */}
                <div>
                 <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                   Address
                 </label>
                 <div className="mt-1 relative rounded-md shadow-sm">
                  
                   <textarea
                     type="text"
                     name="address"
                     id="address"
               
                     onChange={(e) => setAddress(e.target.value)}
                     className={`block w-full pl-3 pr-3 py-2 border ${
                       errors.state ? 'border-red-300' : 'border-gray-300'
                     } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                   />
                 </div>
                 {errors.state && (
                   <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                 )}
               </div>


            {/* town */}
             <div>
               <label htmlFor="lga" className="block text-sm font-medium text-gray-700">
                 Town
               </label>
             <select
                   value={selectedLga}
                  onChange={handleLGA}
                  className={`block w-full pl-2 pr-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="" disabled>Select a town</option>
                    {lgarea?.map((item) => (
                  <option key={item.id} value={item.lga}>
                    {item.lga}
                </option>
              ))}
            </select>
            </div>        

             {/* Location Fields */}
             <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
             

               {/* State */}
               <div>
                 <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                   State
                 </label>
                 <div className="mt-1 relative rounded-md shadow-sm">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                     <RiMapPinLine className="h-5 w-5 text-gray-400" />
                   </div>
                   <input
                     type="text"
                     name="state"
                     id="state"
               
                     onChange={(e) => setState(e.target.value)}
                     className={`block w-full pl-10 pr-3 py-2 border ${
                       errors.state ? 'border-red-300' : 'border-gray-300'
                     } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                   />
                 </div>
                 {errors.state && (
                   <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                 )}
               </div>

               {/* Country */}
               <div>
                 <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                   Country
                 </label>
                 <div className="mt-1 relative rounded-md shadow-sm">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                     <RiMapPinLine className="h-5 w-5 text-gray-400" />
                   </div>
                   <input
                     type="text"
                     name="country"
                     id="country"
                     onChange={(e) => setCountry(e.target.value)}
                     className={`block w-full pl-10 pr-3 py-2 border ${
                       errors.country ? 'border-red-300' : 'border-gray-300'
                     } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                   />
                 </div>
                 {errors.country && (
                   <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                 )}
               </div>
             </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
              
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-[#4F7942] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>

            {/* General Error Message */}
            {errors.submit && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <RiErrorWarningLine className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {errors.submit}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* Terms and Privacy Policy */}
            <div className="text-sm text-center text-gray-600">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="font-medium text-blue-600 hover:text-blue-500">
                Terms of Service
              </Link>
            
            </div>
          </form>

       

          {/* Help Section */}
          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              Need help?{' '}
              <Link to="/contact" className="font-medium text-blue-600 hover:text-blue-500">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Password Requirements */}
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-4 sm:px-10">
          <p className="text-xs text-gray-500">
            Password must contain:
          </p>
          <ul className="mt-1 text-xs text-gray-500 list-disc list-inside">
            <li>At least 8 characters</li>
            <li>At least one uppercase letter</li>
            <li>At least one number</li>
            <li>At least one special character</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;