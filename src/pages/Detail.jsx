import React from 'react'

import { useParams } from "react-router-dom";

import { useTranslation } from 'react-i18next'


const Detail = () => {

    const [t] = useTranslation()

    const { name } = useParams();

    return (
        <div>
            Detail {t('common.hello')} {name}
        </div>
    )
}

export default Detail
