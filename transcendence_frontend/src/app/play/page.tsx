'use client'
import React from 'react'
import styles from './play.module.css'
import Layout from 'src/component/Layout'
import PlayButton from 'src/component/play/Play'

const Play: React.FC = () => {
    return (
        <Layout>
        <div className={styles.all}>
            <div className={styles.all_game}>
                <PlayButton/>
            </div>
        </div>
        </Layout>
    )
}

export default Play