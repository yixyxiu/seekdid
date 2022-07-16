import React from 'react'

import './topnav.css'

import { Link } from 'react-router-dom'

import Dropdown from '../dropdown/Dropdown'
import DropdownMenu from '../dropdown/DropdownMenu'


import ThemeMenu from '../thememenu/ThemeMenu'

import LanguageMenu from '../languageMenu'

import logo from '../../assets/images/logo-green.webp'

import notifications from '../../assets/JsonData/notification.json'

import user_menu from '../../assets/JsonData/user_menus.json'

import sidebar_items from '../../assets/JsonData/sidebar_routes.json'

import { useTranslation } from 'react-i18next'

const curr_user = {
    display_name: 'Coming soon..',
    image: ''
}

const coming_soon_menu = [{
    "icon": "bx bx-error-circle",
    "content": "Coming soon.."
}]


const renderNotificationItem = (item, index) => (
    <div className="notification-item" key={index}>
        <i className={item.icon}></i>
        <span>{item.content}</span>
    </div>
)

const renderLanguageItem = (item, index) => (
    <Link to='/' key={index}>
        <div className="notification-item" key={index}>
            <i className={item.icon}></i>
            <span>{item.content}</span>
        </div>
    </Link>
)

const renderUserToggle = (user) => (
   
    <div className="topnav__right-user">
        <div className="topnav__right-user__image">
            <img src={user.image} alt="" />
        </div>
        <div className="topnav__right-user__name">
            {user.display_name}
        </div>
    </div>
    
)

const renderUserMenu =(item, index) => (
    <Link to='/' key={index}>
        <div className="notification-item">
            <i className={item.icon}></i>
            <span>{item.content}</span>
        </div>
    </Link>
)

const RenderNavMenu = (item, index) => {
    const [t] = useTranslation()
    return(
    <Link to={item.route} key={index}>
        <div className="notification-item" key={index}>
            <i className={item.icon}></i>
            <span>{t(item.display_name)}</span>
        </div>
    </Link>)
}

const Topnav = () => {
    return (
        <div className='topnav'>
            {/*
            <div className="topnav__search">
                <input type="text" placeholder='Search here...' />
                <i className='bx bx-search'></i>
            </div>*/
            }
            
            <div className="topnav__logo">
                
            </div>
            <div className="topnav__right">
                <div className="topnav__right-item">
                    <LanguageMenu></LanguageMenu>
                </div>
                <div className="topnav__right-item">
                    
                    {/* Notification*/ }
                    {/*
                    <Dropdown
                        icon='bx bx-bell'
                        badge='12'
                        contentData={notifications}
                        renderItems={(item, index) => renderNotificationItem(item, index)}
                        renderFooter={() => <Link to='/'>View All</Link>}
                    />*/
                    
                    }
                    {
                        /*
                        <Dropdown
                        icon='bx bx-globe'
                        contentData={coming_soon_menu}
                        renderItems={(item, index) => renderLanguageItem(item, index)}
                        />
                         */
                    }
                    
                    {/* dropdown here */}
                </div>
                <div className="topnav__right-item">
                    <ThemeMenu/>
                </div>
                <div className="topnav__right-item">
                    {/* UserInfo */}
                    <Dropdown
                        icon='bx bx-wallet-alt'
                        /*customToggle={() => renderUserToggle(curr_user)}*/
                        contentData={coming_soon_menu}
                        renderItems={(item, index) => renderUserMenu(item, index)}
                    />
                </div>
                <div className="topnav__right-item topnav__right-more__menu hidden md:block">
                    {/* UserInfo */}
                    <DropdownMenu
                        icon='bx bx-menu'
                        /*customToggle={() => renderUserToggle(curr_user)}*/
                        contentData={sidebar_items}
                        renderItems={(item, index) => RenderNavMenu(item, index)}
                    />
                </div>
            </div>
        </div>
    )
}

export default Topnav
