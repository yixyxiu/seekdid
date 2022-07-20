import React, {useRef, useState, useEffect} from 'react'

import { changeLanguage, currentLanguage } from '../../utils/i18n'


import './languagemenu.css'
import DropdownMenu from '../dropdown/DropdownMenu'


const LanguageMenu = () => {
    const [lang, setLanguage] = useState([]);
    const lang_menus_data = [
        {"icon":"🇨🇳", "key":"zh", "caption":"简体中文"},
        {"icon":"🇬🇧", "key":"en", "caption":"English"},
    ]

    const getLanguageMenu = (locale) => {
        let config = {};
        lang_menus_data.forEach(element => {
            if (element.key === locale) {
                config = element;
            }
        });

        return config;
    }

    const renderLanguageItem = (item, index) => (
        <div className="menu-item" key={index} onClick={() => changeLang(item.key)}>
            <i className={item.icon}>{item.icon}</i>
            <span>{item.caption}</span>
        </div>)

    const renderCurrentLanguage = (lang) => { 
        let config = getLanguageMenu(lang);
        console.log(config.icon + ''+ config.key);
        if (config) {
            return (
                <span className="menu-toggle-btn"> {config.icon}</span>
            )
        }
        else {
            return (
                <span className="menu-toggle-btn"> 🇬🇧</span>
            )
        }            
        
    }

    const changeLang = (lang) => {
        changeLanguage(lang);
        setLanguage(lang);
    }

    useEffect(() => {
       

    }, []);

    return (
        <div>
            <DropdownMenu
                customToggle={() => renderCurrentLanguage(currentLanguage())}
                contentData={lang_menus_data}
                renderItems={(item, index) => renderLanguageItem(item, index)}
            ></DropdownMenu>  
        </div>
    )
}

export default LanguageMenu
