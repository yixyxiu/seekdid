import React from 'react'

import { Link } from 'react-router-dom'

import './sidebar.css'

//import logo from '../../assets/images/logo-full-light.png'

import sidebar_items from '../../assets/JsonData/sidebar_routes.json'
import { useTranslation } from 'react-i18next'

const SidebarItem = props => {

    const active = props.active ? 'active' : ''

    return (
        <div className="sidebar__item">
            <div className={`sidebar__item-inner ${active}`}>
                <i className={props.icon}></i>
                <span>
                    {props.title}
                </span>
            </div>
        </div>
    )
}

const Sidebar = props => {

    const isActiveItem = (item) => {
        let find = item.route === props.location.pathname;
        if (!find) {
            if (/^\/.*\.bit+$/.test(props.location.pathname)) {
                let reRoute = '/didgallery.bit';
                find = item.route == reRoute;
            }
        }

        return find;
    }
    //const activeItem = sidebar_items.findIndex(item => item.route === props.location.pathname)
    const [t] = useTranslation();

    return (
        <div className='sidebar hidden md:block'>
            <div className='sidebar__wapper'>
                <div className="sidebar__logo-wapper">
                    <div className='sidebar__logo'/>
                </div>
                <div className="sidebar__adv"></div>
                {
                    sidebar_items.map((item, index) => (
                        <Link to={item.route} key={`${index}-${item.route}`}>
                            <SidebarItem
                                title={t(item.display_name)}
                                icon={item.icon}
                                active={isActiveItem(item)}
                            />
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default Sidebar
