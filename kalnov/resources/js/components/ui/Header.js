import React from 'react';
import DeanLogo from '../../../img/icons/dean.svg'
import {makeStyles, useTheme} from "@material-ui/core";
import {useHistory} from "react-router";

const useStyles = makeStyles((theme) => ({
    header: {
        display: 'flex',
        alignItems: 'flex-end',
        backgroundColor: theme.palette.background.main,
        padding: "22px 60px",
    },
    logo: {
        marginRight: '20px',
    },
    name: {
        fontSize: '1.3rem',
    },
    nameAndLogoWrapper: {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'flex-end',
    },
}))

export const Header = () => {
    const styles = useStyles(useTheme())
    const history = useHistory()

    const openMainPage = () => {
        history.push('/')
    }

    return (
        <div className={styles.header}>
            <span className={styles.nameAndLogoWrapper} onClick={openMainPage}>
                <img src={DeanLogo} alt="Деканат" className={styles.logo}/>
                <span className={styles.name}>Электронный деканат</span>
            </span>
        </div>
    );
}
