import React from 'react'

import { useParams } from "react-router-dom";

import { useEffect, useState, useRef } from 'react';

import { useTranslation } from 'react-i18next'

import BitOwnerSummary from '../components/card/bitOwnerSummary';
import BitOwnerAccountList from '../components/list/bitOwnerAccountList';
import ExploreAccountInput from '../components/input/exploreAccountInput';


const Detail = () => {

    const [t] = useTranslation()
    
    const { name } = useParams();

    useEffect(() => {

        if (window.history.scrollRestoration) {
            window.history.scrollRestoration = 'auto';
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }, [name]);
    
    return (
        <div className='flex flex-col p-5 bg-main-card bg-box-shadow rounded-[10px]'>
            <BitOwnerSummary account={`${name}.bit`}/>
            {console.log('bitOnwersummary render')}
            <div className='h-[1px] seperator border-[0.5px] mt-6 mb-10'></div>
            <BitOwnerAccountList account={`${name}.bit`}/>
            <div className='h-[1px] seperator border-[0.5px] mt-6 mb-10'></div>
            <ExploreAccountInput/>
        </div>
    )
}

export default Detail
