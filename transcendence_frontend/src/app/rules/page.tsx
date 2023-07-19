'use client'
import Layout from 'src/component/Layout'
import styles from './rules.module.css'

const Rules:React.FC = () => {
  return (
    <Layout>
      <div className={styles.all}>
        <div className={styles.all_rules}>
          <span className={styles.all_rules_title}>RULES</span>
          <div className={styles.all_rules_textRules}>
            <p className={styles.p}>Pong est un jeu vidéo classique qui simule un jeu de tennis de table en utilisant des graphismes simples. Voici les règles de base du jeu :</p>
            <p className={styles.p}>Deux joueurs s'affrontent, chacun contrôlant une raquette à l'écran.Le jeu commence avec une balle au milieu de l'écran.</p>
            <p className={styles.p}>Les joueurs doivent faire rebondir la balle avec leur raquette pour l'envoyer vers le côté opposé de l'écran, et essayer de faire en sorte que l'adversaire ne puisse pas la renvoyer.Si un joueur manque la balle, l'autre joueur marque un point.</p>
            <p className={styles.p}>Le premier joueur à atteindre un nombre prédéfini de points (généralement 11 ou 21) remporte le jeu.</p>
            <p className={styles.p}>Voici quelques règles supplémentaires qui peuvent varier selon les versions du jeu :</p>
            <p className={styles.p}>La balle peut rebondir sur les murs de chaque côté de l'écran, mais pas sur les murs supérieur et inférieur.Les joueurs peuvent déplacer leur raquette verticalement le long de l'écran pour frapper la balle.</p>
            <p className={styles.p}>La balle peut changer de direction et de vitesse après avoir été touchée par une raquette, ce qui peut rendre le jeu plus difficile. Certains jeux de Pong ont des fonctionnalités supplémentaires, comme des obstacles ou des bonus qui apparaissent à l'écran.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Rules
