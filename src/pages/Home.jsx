import React from 'react'

import localeMgr from '../utils/localeSwitcher'

const Home = () => {
    return (
        <div>
            Home {localeMgr.getLanguage()}
        </div>
    )
}

export default Home
