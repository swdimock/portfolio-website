import '../styles/globals.sass'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation';
import type { AppProps } from 'next/app'


function MyApp({ Component, pageProps }: AppProps) {
  const { t, lang } = useTranslation('common');

  return (
  <>
    <Head>
      <title>{t('head.title')}</title>
      <meta name="description" content={t('head.description')} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Component {...pageProps} />
  </>)
}
export default MyApp
