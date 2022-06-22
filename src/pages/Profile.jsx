import React from 'react'

import { useParams } from "react-router-dom";

import { useTranslation } from 'react-i18next'


const Profile = () => {

    const [t] = useTranslation()

    const { name } = useParams();

    return (
        <div>
            Profile {t('common.hello')} {name}
        </div>
    )
}

export default Profile
