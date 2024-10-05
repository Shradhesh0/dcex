/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/no-children-prop */
/* eslint-disable react/jsx-key */

"use client" ;

import { useSession } from "next-auth/react"
import {useRouter} from 'next/navigation'
import { PrimaryButton, TabButton } from "./Button";
import { useEffect, useState } from "react";
import { TokenWithbalance, useTokens } from "../api/hooks/useTokens";
import { TokenList } from "./TokenList";
import { Swap } from "./Swap";
import Image from "next/image";


type Tab = "tokens" | "send" |"add_funds" |"swap" |"withdraw"

const tabs:{id:Tab ; name:string}[] = [
  {id:"tokens" ,name:"Tokens"} , 
  {id:"send" ,name:"Send"},
  {id:"add_funds" ,name:"Add funds"} ,
  {id:"withdraw" ,name:"Withdraw"},
  {id:"swap" ,name:"Swap"} 
]

export const ProfileCard = ({publicKey}:{
  publicKey: string
})=>{
  const session = useSession() ;
  const router = useRouter() ;

  const [selectedTab,setSelectedTab] = useState<Tab>("tokens")
  const {tokenBalances ,loading} = useTokens(publicKey) ;


  if(sessionStorage && sessionStorage.status === 'loading'){
    //todo:replace
    return (
      <div>
        Loading ...
      </div>
    )
  }
  
  if(!session.data?.user){
     router.push('/')
  }

    return <div className="pt-8 flex justify-center">
         <div className="max-w-4xl bg-white rounded  shadow w-full " >
             <Greeting image={session.data?.user?.image ?? ''} name={session.data?.user?.name ?? '' } />
             
             <div className="w-full flex px-10">
             {tabs.map(t=> <TabButton active={t.id === selectedTab} onClick={
              ()=>setSelectedTab(t.id)
             }>{t.name.toLocaleUpperCase()}</TabButton>)}
             </div>

            <div className={`${selectedTab === "tokens" ?"visible":"hidden"}` }>
             <Assests tokenBalances={tokenBalances } publicKey={publicKey} loading={loading} />
            </div>
            <div className={`${selectedTab === "withdraw" ?"visible":"hidden"}` }>
            <DontSupport children={"Not supported in India"} />
              
            </div>
            <div className={`${selectedTab === "add_funds" ?"visible":"hidden"}` }>
              <DontSupport children={"Need a banking API"} />
            </div>
            <div className={`${selectedTab === "send" ?"visible":"hidden"}` }>
            <DontSupport children={"This part is TODO"} />
              
            </div>
            <div className={`${selectedTab === "swap" ?"visible":"hidden"}` }>
             <Swap tokenBalances={tokenBalances}  publicKey={publicKey} />
            </div>
         </div>
      </div>
    
}

function DontSupport({children}:{
  children: React.ReactNode
}){
  return (
    <div className="font-bold mt-4 bg-slate-200 flex justify-center">
      <div className="pt-10 pb-20" > {children}</div>
      
    </div>
  )
}

function Assests({publicKey,tokenBalances,loading}:{
  publicKey: string;
  tokenBalances:{
    totalBalance:number,
    tokens:TokenWithbalance[]
  }|null;
  loading:boolean;
}){
  
  const[copied,setCopied] = useState(false) ; 
  
 

  
  useEffect(()=>{
    if(copied){
      let timeout = setTimeout(()=>{
        setCopied(false)
      },3000)
      return ()=>{
        clearTimeout(timeout)
      }
    }
  },[copied])

  if(loading){
    return "Loading..."
  }

 
  return(
    <div className="text-slate-500 mt-4 " >
      <div className="ml-14">
      Account assests
      </div>
      <div className="flex justify-between  mx-12" >
        
      <div className="flex" >
        <div className="text-5xl font-bold text-black " >
          ${tokenBalances?.totalBalance}
        </div>
        <div className="font-slate-500 font-bold text-3xl flex-col justify-end pt-3 pl-2" >
          USD
        </div>
      </div>
      <div>
        <PrimaryButton onClick={()=>{
          navigator.clipboard.writeText(publicKey)
          setCopied(true)
        }}>{copied ? "Copied" : "Your Wallet Address"}</PrimaryButton>
      </div>
      </div>

      <div className="pt-4 bg-slate-50 m-12" >
        <TokenList tokens= {tokenBalances?.tokens || []} />
      </div>
    </div>
  )
}

function Greeting({
  image,name
}:{
  image: string;
  name: string;
}){
  return (
    <div className="flex p-12" >
      <Image src={image} className="rounded-full w-16 h-16 mr-4" alt={""} />
      <div className="text-2xl font-semibold flex flex-col justify-center" >
        Welcome , {name}
      </div>
    </div>
  )
}