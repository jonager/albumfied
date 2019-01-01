import React from 'react';
import styles from './Modal.css';

const Modal = props => {
    let showHideClassName = props.show ? 'DisplayBlock' : 'DisplayNone';

    return (
        <div className={`${styles.Modal} ${styles[showHideClassName]}`}>
            <section className={styles.ModalMain}>
                <button className={styles.CancelButton} onClick={props.clicked}>
                    <i className="far fa-times-circle" />
                </button>
                {props.children}
            </section>
        </div>
    );
};

export default Modal;
