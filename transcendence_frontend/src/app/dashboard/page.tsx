'use client'
import React from 'react'
import styles from './dash.module.css'
import Layout from 'src/component/Layout'
import Game from 'src/component/game/Game'

const Dashboard: React.FC = () => {
    return (
        <Layout>
        <div className={styles.all}>
            <div className={styles.all_game}>
                <Game/>
            </div>
        </div>
        </Layout>
    )
}

export default Dashboard