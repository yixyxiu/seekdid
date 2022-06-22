import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../locales/en.json'
import zh from '../locales/zh.json'

i18n.use(initReactI18next).init({
    resources: {
        en,
        zh,
    },
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
})

export const changeLanguage = (lan) => {
    if (lan.indexOf('zh') !== -1) {
        i18n.changeLanguage('zh')
    } else {
        i18n.changeLanguage('en')
    }

    //把用户的语言写入缓存，供下次获取使用
    localStorage.setItem('locale', lan)
}

export const currentLanguage = () => {
    let language = localStorage.getItem('locale') || window.navigator.language.toLowerCase() || 'en';

    //判断用户的语言，跳转到不同的地方
    if (language.indexOf("zh") !== -1) {
        language = "zh";
    } else if (language.indexOf('en') !== -1) {
        language = "en";
    } else {
        //其它的都使用英文
        language = "en";
    }

    return language;
}

export default i18n
