import { GetStaticProps } from 'next';
import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar, FiUser } from "react-icons/fi";
import Link from 'next/link'

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  // TODO
  return (
    <>
      <Header />

      <section className={styles.postContainer}>
        <Link href='/'>
          <a>
            <h1>Como Utilizar hooks</h1>
            <h2>Pensando em sincronização em vez de ciclos de vida.</h2>

            <small><span><FiCalendar />15 Mar 2021</span> <FiUser />Bruno Moraes</small>
          </a>
        </Link>
      </section>

    </>
  )

}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
