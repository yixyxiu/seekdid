import React from 'react'

import { useTranslation } from 'react-i18next'


const Discover = () => {

    const [t] = useTranslation()

    return (
        <div>
            Discover {t('common.hello')}
            <h1 className="text-3xl font-bold underline">
            Hello world!
            </h1>
            <div class="flex flex-row w-full justify-center items-center pb-12 gap-5">
                <button class="flex-1 px-12 py-4 text-md text-primary bg-box text-center font-semibold shadow leading-none text-lg outline-black hover:bg-accent rounded-lg">Search</button>
                <button class="flex-1 px-12 py-4 text-md text-primary bg-box text-center font-semibold shadow leading-none text-lg outline-black hover:bg-fuchsia-600 rounded-lg">Clear</button>
                <button class="flex-1 px-12 py-4 text-md text-primary bg-box text-center font-semibold shadow leading-none text-lg outline-black default-btn rounded-lg">Clear</button>

            </div>
        </div>
    )
}

export default Discover
