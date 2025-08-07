import React from 'react'
import { BrainCircuit } from 'lucide-react'
import { Sun } from 'lucide-react';


const Navbar = () => {
  return (
    <div className="nav flex items-center justify-between h-[90px] bg-zinc-900" style={{ padding: "0px 150px" }}>
      <div className="logo flex items-center gap-[10px]">
        <BrainCircuit size={30} color="#9333ea" />
        <span className="text-2xl font-bold text-[#9333ea]">Codeify</span>
      </div>
      <div className="icons flex items-center gap-[20px]">
        <i className='cursor-pointer transition-all hover:text-[#9333ea]'><Sun  /></i>
      </div>
    </div>
  )
}

export default Navbar
