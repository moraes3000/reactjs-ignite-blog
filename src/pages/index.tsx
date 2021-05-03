import { GetStaticProps } from 'next';

import { getPrismicClient, } from '../services/prismic';
import Prismic from '@prismicio/client'

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar, FiUser } from "react-icons/fi";
import Link from 'next/link'
import { useState } from 'react';
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Header from '../components/Header';

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

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  // TODO
  const formattedPost = postsPagination.results.map(post => {
    return {
      ...post,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy', {
        locale: ptBR,
      }

      )
    }
  })

  const [posts, setPosts] = useState<Post[]>(formattedPost);
  const [nextPage, setNextPage] = useState(postsPagination.next_page)
  const [currentPage, setCurrentPage] = useState(1)

  async function handleNextPage(): Promise<void> {
    if (currentPage != 1 && nextPage == null) {
      return
    }

    const postsResults = await fetch(`${nextPage}`).then(response => response.json())
    // console.log(postsResults)
    setNextPage(postsResults.next_page)
    setCurrentPage(postsResults.page)

    const newPosts = postsResults.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: format(
          new Date(post.first_publication_date),
          'dd MMM yyyy', {
          locale: ptBR,
        }
        ),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author
        }
      }
    })

    setPosts([...posts, ...newPosts])
  }

  return (
    <>
      <Header />
      <main className={commonStyles.commonContainer}>
        {posts.map(post => (
          <section className={styles.postContainer} key={post.uid}>
            <Link href={`/post/${post.uid}`}>
              <a>
                <h1>{post.data.title}</h1>
                <h2>{post.data.subtitle}</h2>
                <small>
                  <ul>
                    <li><FiCalendar /> {post.first_publication_date}</li>
                    <li><FiUser /> {post.data.author}</li>
                  </ul>
                </small>
              </a>
            </Link>
          </section>
        ))}


        {nextPage && (
          <button type='button' onClick={handleNextPage} className={styles.btn}>Carregar mais posts</button>
        )}

      </main>
    </>
  )

}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query([
    Prismic.Predicates.at('document.type', 'posts')
  ], {
    pageSize: 1,
  });
  // console.log(JSON.stringify(postsResponse,null,2))

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author
      }
    }
  })

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  }

  return {
    props: {
      postsPagination,
    }
  }
};
