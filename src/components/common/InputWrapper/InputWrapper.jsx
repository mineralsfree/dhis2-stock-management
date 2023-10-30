
import styles from './InputWrapper.module.css'
export const InputWrapper = (props)=>{
    const {label, children} = props;
    return (<div className={styles.container}>
        <div className={styles.label}>{label}</div>
        {children}
    </div>)
}