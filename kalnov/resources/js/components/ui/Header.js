import React from 'react';
import DeanLogo from '../../../img/icons/dean.svg'
import {makeStyles, useTheme} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    header: {
        display: 'flex',
        alignItems: 'flex-end',
        backgroundColor: theme.palette.background,
        padding: "22px 60px"
    },
    logo: {
        marginRight: '20px'
    },
    name: {
        fontSize: '1.3rem'
    }
}))

export const Header = (props) => {
    const styles = useStyles(useTheme())

    return (
        <div className={styles.header}>
            <img src={DeanLogo} alt="Деканат" className={styles.logo}/>
            <span className={styles.name}>Электронный деканат</span>
        </div>
    );
}
