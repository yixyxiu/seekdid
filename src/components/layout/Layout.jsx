import React, {useEffect} from 'react'

import { changeLanguage, currentLanguage, i18n } from '../../utils/i18n'


import './layout.css'

import Sidebar from '../sidebar/Sidebar'
import TopNav from '../topnav/TopNav'
import Routes from '../Routes'

import { BrowserRouter, Route } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'

import ThemeAction from '../../redux/actions/ThemeAction'
import Footer from '../footer/Footer'

const Layout = () => {

    const themeReducer = useSelector(state => state.ThemeReducer)

    const dispatch = useDispatch()

    const initLanguage = () => {
        const lan = currentLanguage();
        changeLanguage(lan);
    }

    useEffect(() => {
        const themeClass = localStorage.getItem('themeMode', 'theme-mode-light')

        const colorClass = localStorage.getItem('colorMode', 'theme-mode-light')

        dispatch(ThemeAction.setMode(themeClass))

        dispatch(ThemeAction.setColor(colorClass))

        initLanguage();

    }, [dispatch])

    return (
        <BrowserRouter>
            <Route render={(props) => (
                <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
                    <Sidebar {...props}/>
                    <div className="layout__content">
                        <TopNav/>
                        <div className="p-3 md:p-7">
                            <Routes/>
                        </div>
                        <Footer></Footer>
                    </div>
                </div>
            )}/>
        </BrowserRouter>
    )
}

export default Layout
