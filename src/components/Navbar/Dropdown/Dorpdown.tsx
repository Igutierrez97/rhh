'use client'

import { useState } from "react";
import {signOut, useSession} from "next-auth/react"

export default function DropDown() {
const { data: session, status } = useSession();
const [open, setOpen] = useState(false)

const handleClick = () =>{
    setOpen(!open)
   
}



const logout = () =>{
    signOut()
}

  return (
    <div className="dropdown dropdown-end ">
      <div onClick={handleClick} tabIndex={0} role="button">
      <div className="avatar">
          <div className="w-12 rounded-full">
            <img src="/profile.jpg" />  
          </div>
        </div>
      </div>

      <ul
        tabIndex={0}
        className={`dropdown-content z-[1] menu p-2 shadow bg-base-300 rounded-box w-52 ${open ? 'block' : 'hidden'}`}
      >
        <p className=" h-10 flex justify-center items-center">
          <span>{session?.user?.email}</span>
        </p>
        <p className=" hover:bg-base-100 rounded-b-2xl cursor-pointer h-10 flex justify-center items-center" onClick={logout} >
          <a className="">Logout</a>
        </p>
      </ul>
    </div>
  );
}
