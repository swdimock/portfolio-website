import type { NextPage } from 'next'
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image'
import styles from '../styles/Home.module.sass'
import EmblaCarousel from '../components/EmblaCarousel';
import emailjs from 'emailjs-com';
import * as THREE from 'three';
import React, { useEffect } from 'react';

interface GridInterface {
  x: number;
  y: number;
  z: number;
}

const Home: NextPage = () => {

  const [emailSent, setEmailSent] = React.useState(false);

  // Deps
  const { t, lang } = useTranslation('common');
  const SLIDE_COUNT = 4;
  const slides = Array.from(Array(SLIDE_COUNT).keys());

  const submitForm = (event: any) => {
    event.preventDefault();

    // Submit the form here
    grecaptcha.enterprise.ready(() => {
        grecaptcha.enterprise.execute('6Lc6FvYcAAAAAAI4wmsKE240Ygtkk0XjYiSRAR3p', {action: 'login'}).then((token: any) => {
          emailjs.send('service_1lw7gcp', 'template_ud8u6vk', {
            from_name: event.target.elements.fromName.value,
            reply_to: event.target.elements.replyTo.value,
            quest: event.target.elements.quest.value,
          }, 'user_Aj40F31UVtxwEBGVj1F19')
          .then((result) => {
            if (result.status === 200) {
              setEmailSent(true);
            }
          }, error => {
            console.error(error);
          })
        });
    });
  }

  useEffect(() => {
    // Three Config
    const zoom = 15;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('three') as HTMLCanvasElement
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(zoom);

    // Lighting
    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5, 5);

    // Utilities
    const debug = () => {
      const lightDebug = new THREE.PointLightHelper(pointLight);
      const gridDebug = new THREE.GridHelper(200, 50);
      scene.add(gridDebug, lightDebug);
    }
    // debug();
    
    // Triangles
    const triangle = () => {
      const path = new THREE.Path();
      path.moveTo(0, -10);
      path.lineTo(-10, 5);
      path.lineTo(10, 5);
      path.lineTo(0, -10);

      const points = path.getPoints();
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0x333333 });
      return new THREE.Line(geometry, material);
    };

    // Group all of the triangles and add them to the scene
    const triangles = new THREE.Group();
    Array.from(Array(25).keys()).map(i => triangles.add(triangle()));
    scene.add(triangles);
  
    // Animation Loop
    let offset = 0;
    const animate = () => {

      // Update frame
      requestAnimationFrame(animate);

      // Rotate the triangles at varying rates
      offset = offset + 0.005;
      triangles.children.forEach((line, key: number) => line.rotation.z = (Math.PI / key) * offset);

      renderer.render(scene, camera);
      // composer.render();
    };
    animate();

    // Camera Control
    let visibleElement: string;
    const moveCamera = () => {

      // The top of the document
      const scrollTop = document.body.getBoundingClientRect().top;

      // Pan the camera to the left
      camera.rotation.y = (scrollTop * 0.0001) * -1;
      camera.position.y = (scrollTop * 0.001) * -1;
      camera.position.x = (scrollTop * 0.0005);
      camera.position.z = zoom + (scrollTop * 0.001);

      // Rotate the triangles group to make it look more dynamic
      triangles.rotation.x = (scrollTop * 0.00025);
      triangles.rotation.y = (scrollTop * 0.00025);
      triangles.rotation.z = (scrollTop * 0.0005);
    };
    document.body.onscroll = moveCamera;

    // Visibility Management
    const visible = (elementId: string, limited?: boolean) => {
      const element = document.getElementById(elementId);
      const bounds = element?.getBoundingClientRect();
      let offset = 0;

      if (limited && element) {
        offset = (window.innerHeight - (element.clientHeight + 150)) / 2;
      }

      if (bounds 
        && bounds.top >= offset
        && bounds.left >= 0
        && bounds.right <= window.innerWidth
        && bounds.bottom <= window.innerHeight - offset
        ) {
          return true;
        }
        return false;
    }

    // Show elements as we scroll through them
    document.addEventListener('scroll', (e) => {

      // Only show one element at a time
      let lastElement: Element;

      // Iterate through all elements and show them if within the window
      document.querySelectorAll('.on-hidden').forEach((element: Element) => {
        const id = element.getAttribute('id');
        if (id && visible(id, true)) {
          element.classList.add(styles.visible);

          if (lastElement && lastElement.classList.contains(styles.visible)) {
            lastElement.classList.remove(styles.visible);
          }
          lastElement = element;
        } else if (element.classList.contains(styles.visible)) {
          element.classList.remove(styles.visible);
        }
      })
    });

    // Mouse watcher
    const threeDee: NodeListOf<Element> = document.querySelectorAll('.three-dee');
    threeDee.forEach((element: any) => {
      const container = element.closest('section');
      if (container) {

        // Set up the parent container styles
        container.style.perspective = '1000px';

        // Track the mouse movement within the container
        container.addEventListener('mousemove', (event: any) => {
          let xAxis = (window.outerWidth / 2 - event.clientX) / 50;
          let yAxis = (window.outerHeight / 2 - event.clientY) / 50;
          element.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });

        // Reset the effect when entering the container
        container.addEventListener('mouseenter', () => {
          element.style.transition = 'none';
        });

        // Remove the effect when the mouse leaves
        container.addEventListener('mouseleave', () => {
          element.style.transition = 'transform 300ms ease';
          element.style.transform = 'rotateY(0deg) rotateX(0deg)';
        });
      }
    });

  });

  return (
    <>
      <Head>
        <script src="https://www.google.com/recaptcha/enterprise.js?render=6Lc6FvYcAAAAAAI4wmsKE240Ygtkk0XjYiSRAR3p" async></script>
      </Head>

      <canvas id="three"></canvas>

      <div className={styles.container}>

        <header className={styles.header}>
          <i>DIMOCK.IO</i>
          <div className={styles.social}>
            <a href="https://github.com/swdimock/" target="_blank" rel="noreferrer">
              <i className={styles.github}></i>
            </a>
            <a href="https://www.linkedin.com/in/sdimock/" target="_blank" rel="noreferrer">
              <i className={styles.linkedin}></i>
            </a>
          </div>
        </header>

        <main className={styles.main}>
          <section id="section-leader" className={styles.leader}>
            <img id="leader-image" className="three-dee" src="./leader.svg" alt="D." />
          </section>

          <section id="section-introduction" className={`${styles.columns} ${styles.introduction}`}>
            <h1 className="three-dee">{t('main.intro.heading')}</h1>
            <article dangerouslySetInnerHTML={{ __html: t('main.intro.article')}}></article>
          </section>

          <section id="section-experience" className={styles.experience}>

            <ul>
              <li id="exp-management" className="on-hidden">
                <h4>{t('main.experience.disciplines.management.title')}</h4>
                <p>{t('main.experience.disciplines.management.paragraph')}</p>
              </li>
              <li id="exp-development" className="on-hidden">
                <h4>{t('main.experience.disciplines.development.title')}</h4>
                <p>{t('main.experience.disciplines.development.paragraph')}</p>
              </li>
              <li id="exp-devops" className="on-hidden">
                <h4>{t('main.experience.disciplines.devops.title')}</h4>
                <p>{t('main.experience.disciplines.devops.paragraph')}</p>
              </li>
              <li id="exp-analytics" className="on-hidden">
                <h4>{t('main.experience.disciplines.analytics.title')}</h4>
                <p>{t('main.experience.disciplines.analytics.paragraph')}</p>
              </li>
            </ul>

          </section>

          {/* <section id="section-relation" className={styles.relations}>
            <h4>{t('main.relations.heading')}</h4>
            <article dangerouslySetInnerHTML={{ __html: t('main.relations.article')}}></article>
            <div className={styles.grid}>
              <img src="./relations/audi.svg" alt="Audi" />
              <img src="./relations/gm.svg" alt="General Motors" />
              <img src="./relations/ally.svg" alt="Ally" />
              <img src="./relations/shiftdigital.svg" alt="Shift Digital" />
              <img src="./relations/routeone.svg" alt="RouteOne" />
            </div>
          </section>

          <section id="section-examples" className={styles.examples}>
            <h4>{t('main.examples.heading')}</h4>
            <article dangerouslySetInnerHTML={{ __html: t('main.examples.article')}}></article>
            <div className={styles.carousel}>
              {/* @ts-ignore */}
              {/* <EmblaCarousel slides={slides} /> */}
            {/* </div>
          </section> */}
          
          <section id="section-contact" className={styles.contact}>
            <h4>{t('main.contact.heading')}</h4>
            <article>
              <div>
                <article dangerouslySetInnerHTML={{ __html: t('main.contact.article')}}></article>
                <form onSubmit={submitForm} className={emailSent ? 'hidden' : ''}>
                  <div className="form-field">
                    <input name="fromName" type="text" placeholder={t('form.name')} />
                  </div>
                  <div className="form-field">
                    <input name="replyTo" type="text" placeholder={t('form.email')} />
                  </div>
                  <div className="form-field">
                    <textarea name="quest" placeholder={t('form.message')}></textarea>
                  </div>
                  <div className="form-field">
                    <input type="submit" value={t('form.send')} />
                  </div>
                </form>
                <p className={emailSent ? '' : 'hidden'}>Email sent!  Thanks and talk to you soon.</p>
              </div>
                <div>
                  <div className={`${styles.portrait} three-dee shape`}></div>
                </div>
              </article>
          </section>
        </main>

        <footer id="footer" className={styles.footer}>
          {/* <img src="./konami.svg" alt="Konami" /> */}
        </footer>
      </div>
    </>
  )
}

export default Home
