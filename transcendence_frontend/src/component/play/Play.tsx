import React from 'react';
import styles from './playbutton.module.css';
import GlowButton from './Button';
import Link from 'next/link';

const PlayButton: React.FC = () => {
  return (
    <div className={styles.all}>
      <div className={styles.play}>
        <div className={styles.photo}>
          <div className={styles.left}>
            {/*<img src="./images/1r.png" className={styles.imageLeft} />
            <img src="./images/boost.png" className={styles.imageLeft} />*/}
          </div>
        </div>
        <Link href="/dashboard">
          <GlowButton />
        </Link>
      </div>
    </div>
  );
};

export default PlayButton;
