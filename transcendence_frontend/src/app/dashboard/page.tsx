'use client'
import React from 'react'
import styles from './dash.module.css'
import Layout from 'src/component/Layout'
import { AuthGuard } from 'src/api/HOC'

const Dashboard: React.FC = () => {
    return (
        <AuthGuard>
        <Layout>
        <div className={styles.all}>
            <div className={styles.all_game}>
                
            </div>
        </div>
        </Layout>
        </AuthGuard>

    )
}

export default Dashboard