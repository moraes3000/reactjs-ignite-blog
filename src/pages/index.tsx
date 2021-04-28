import { GetStaticProps } from 'next';
import Header from '../components/Header';

import { getPrismicClient, } from '../services/prismic';
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'

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

export default function Home({ postsItem }) {
  // TODO
  return (
    <>
      {postsItem.map(post => (
        <section className={styles.postContainer} key={post.title}>
          <Link href={`/post/${post.slugs}`}>
            <a>
              <h1>{post.title}</h1>
              <h2>{post.excerpt}</h2>

              <small><span><FiCalendar />{post.updateAt}</span> <FiUser />{post.author}</small>
            </a>
          </Link>
        </section>
      ))}
    </>
  )

}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query([
    Prismic.Predicates.at('document.type', 'post')
  ], {
    fetch: ['post.title', 'post.author', 'post.content'],
    pageSize: 2,
  });
  console.log(JSON.stringify(postsResponse, null, 2))

  const postsItem = postsResponse.results.map(post => {
    return {
      post: post.uid,
      // title: post.data.title[0].text
      title: RichText.asText(post.data.title),
      slugs: post.slugs,
      subtitle: RichText.asText(post.data.content),
      author: RichText.asText(post.data.author),
      excerpt: post.data.content.find(content => content.type == 'paragraph')?.text ?? 'vazio',
      updateAt: new Date(post.first_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })

    }
  })

  return {
    props: {
      postsItem
    }
  }
};
