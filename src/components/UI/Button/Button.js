import React from 'react';
import styles from './Button.css';

const Button = props => {
    return (
        <button
            className={[styles.Button, styles[props.btnType]].join(' ')}
            onClick={() => {
                props.clicked();
                if (props.clicked2) {
                    props.clicked2();
                }
                if (props.clicked3) {
                    props.clicked3();
                }
            }}>
            {props.children}
        </button>
    );
};

export default Button;
