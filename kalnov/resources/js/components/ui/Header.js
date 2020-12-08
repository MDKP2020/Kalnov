import React from 'react';
import DeanLogo from '../../../img/icons/dean.svg'

export const Header = (props) => {

    return (
        <div>
            <img src={DeanLogo} alt="Деканат"/>
            <span>Электронный деканат</span>
        </div>
    );
}
