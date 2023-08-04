// src/pages/credits.tsx
"use client"
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react'
import Layout from 'src/component/Layout'
import Credit_box from 'src/component/credit_box/Credit_box'
import styles from './credit.module.css'
import Credit_box1 from 'src/component/credit_box/Credit_box1'
import Credit_box2 from 'src/component/credit_box/Credit_box2'
import Credit_box3 from 'src/component/credit_box/Credit_box3'
import { fetchUser } from '../../api/api';
import { useRequireAuth } from 'src/api/HOC';

const ReactLogo = dynamic(
  () => import('src/component/3D/ReactLogo'),
  { ssr: false }
)

interface User {
  id: number;
  username: string;
  imageUrl: string;
}

const Credits: React.FC = () => {
  useRequireAuth();
  return (
    <Layout>
    <div className={styles.all}>
    <div className={styles.all_credits}>
      <div className={styles.all_credits_top}>
        <Credit_box/>
        <Credit_box1/>
      </div>
      <div className={styles.circle}>
        <ReactLogo/>
      </div>
      <div className={styles.all_credits_bottom}>
        <Credit_box2/>
        <Credit_box3/>
      </div>
    </div>
  </div>
    </Layout>
  )
}

export default Credits
