import React from 'react'

import { useTranslation } from 'react-i18next'


const Home = () => {

    const [t] = useTranslation()

    return (
        <div>
            Home {t('common.hello')}
        </div>
    )
}

export default Home
