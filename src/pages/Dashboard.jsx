import React, {useEffect} from 'react'

import { useSelector } from 'react-redux'

import { useTranslation } from 'react-i18next'

import BitBornList from '../components/list/bitBornList'
import BitMintList from '../components/list/bitMintList'
import BitSoldList from '../components/list/bitSoldList'
import BitOfferList from '../components/list/bitOfferList'
import BitListingList from '../components/list/bitListingList'
import BitSoldSummary from '../components/soldSummary/soldSummary'

import DailyRegCountChart from '../components/charts/DailyRegChart'
import DailyOwnerChart from '../components/charts/DailyOwnerChart'


const Dashboard = () => {

    //const themeReducer = useSelector(state => state.ThemeReducer.mode)
    const [t] = useTranslation()

    useEffect(() => {
        
    }, []);

    document.title = t('page-title.dashboard');
    
    return (
        <div>
            <div className="grid gap-4 md:flex md:flex-row">
                <div className="w-full md:w-7/12 grid-cols-1 md:grid-cols-2 ">
                    <BitSoldSummary/>
                </div>
                <div className="w-full md:w-5/12 flex flex-col gap-4">
                    <BitBornList/>
                    <BitMintList/>
                </div>
                
            </div>
            <div className="w-full grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-4">
                <BitListingList/>
                <BitOfferList/>
                <BitSoldList/>
            </div>
            
            <div className="row">   
                <div className="col-12">
                    <div className="card">
                        <DailyRegCountChart/>
                    </div>
                </div>
                <div className="col-12">
                    <div className="card">
                        <DailyOwnerChart/>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default Dashboard
