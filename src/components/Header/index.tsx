import styles from './header.module.scss'
export default function Header() {
  return (
    <>
      <header className={styles.headerContainer}>
        <h1>&lt;/&gt; <span>spacetraveling</span>.</h1>
      </header>
    </>
  )
}
