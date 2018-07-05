import React from 'react';
import styles from './Modal.css';

const Modal = (props) => {
    let showHideClassName = props.show ? 'DisplayBlock' : 'DisplayNone';

    return (
        <div className={`${styles.Modal} ${styles[showHideClassName]}`}>
          <section className={styles.ModalMain}>
            <button onClick={props.clicked}><i className="fas fa-times"></i></button>
            {props.children}
          </section>
        </div>
      );
}
 
export default Modal;