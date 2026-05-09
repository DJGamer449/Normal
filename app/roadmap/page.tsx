'use client';
import { useEffect, useState } from 'react';
export default function Roadmap(){const [data,setData]=useState<any>(null);useEffect(()=>{setData(JSON.parse(localStorage.getItem('studytwin')||'{}'));},[]);return <div className='space-y-3'><h1 className='text-2xl font-semibold'>roadmap</h1><div className='card'><pre className='text-xs whitespace-pre-wrap'>{JSON.stringify(data,null,2)}</pre></div></div>}
