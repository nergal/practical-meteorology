import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent, TouchEvent } from 'react';
import { atlas, type Locale } from './atlas';

type View = 'card' | 'detail' | 'credit';

type Page = {
  atlasView: View;
  genus: number;
  frame: number;
  depth: number;
  scroll: number;
  showArticle?: boolean;
};

const firstPage: Page = { atlasView: 'card', genus: 0, frame: 0, depth: 0, scroll: 0 };

const copy = {
  uk: {
    atlas: 'Атлас хмар',
    back: 'Назад',
    details: 'Докладніше',
    previousCloud: 'Попередній рід хмар',
    nextCloud: 'Наступний рід хмар',
    previousPhoto: 'Попереднє фото',
    nextPhoto: 'Наступне фото',
    openDetails: 'Відкрити опис',
    gallery: 'Фото хмар',
    article: 'Як розпізнати',
    photoBy: 'Фото:',
    cardCounter: (position: number, total: number) => `${position} із ${total}`,
    references: 'Джерела',
    credit: 'Відомості про фото',
    creator: 'Авторство',
    source: 'Першоджерело',
    license: 'Умови використання',
    modifications: 'Зміни',
    cloudPosition: (position: number, total: number) => `Рід хмар ${position} з ${total}`,
    photoPosition: (position: number, total: number) => `Фото ${position} із ${total}`,
  },
  en: {
    atlas: 'Cloud atlas',
    back: 'Back',
    details: 'Details',
    previousCloud: 'Previous cloud genus',
    nextCloud: 'Next cloud genus',
    previousPhoto: 'Previous photo',
    nextPhoto: 'Next photo',
    openDetails: 'Open details',
    gallery: 'Cloud photos',
    article: 'What to look for',
    photoBy: 'Photo:',
    cardCounter: (position: number, total: number) => `${position} of ${total}`,
    references: 'References',
    credit: 'Photo information',
    creator: 'Creator',
    source: 'Original source',
    license: 'Reuse terms',
    modifications: 'Modifications',
    cloudPosition: (position: number, total: number) => `Cloud genus ${position} of ${total}`,
    photoPosition: (position: number, total: number) => `Photo ${position} of ${total}`,
  },
};

function readPage(): Page {
  const candidate = window.history.state as Page | null;
  return candidate?.atlasView ? candidate : firstPage;
}

function ExternalLink({ href, label }: { href: string; label: string }) {
  return <a href={href} target="_blank" rel="noreferrer">{label}</a>;
}

function arrow(direction: 'left' | 'right') {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={direction === 'left' ? 'M15 5 8 12l7 7' : 'm9 5 7 7-7 7'}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function App({ locale }: { locale: Locale }) {
  const [page, setPage] = useState<Page>(readPage);
  const heading = useRef<HTMLHeadingElement>(null);
  const article = useRef<HTMLElement>(null);
  const startTouch = useRef<{ x: number; y: number } | null>(null);
  const suppressClickUntil = useRef(0);
  const initialRender = useRef(true);

  const strings = copy[locale];
  const entries = atlas[locale];
  const entry = entries[page.genus] ?? entries[0];
  const photo = entry.photos[page.frame] ?? entry.photos[0];
  const card = page.atlasView === 'card';
  const detail = page.atlasView === 'detail';
  const credit = photo.credit;

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = strings.atlas;
  }, [locale, strings.atlas]);

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.history.replaceState(readPage(), '');
    const restorePage = () => setPage(readPage());
    window.addEventListener('popstate', restorePage);

    const listener = Capacitor.isNativePlatform()
      ? CapacitorApp.addListener('backButton', () => {
        if (readPage().depth > 0) window.history.back();
        else void CapacitorApp.exitApp();
      })
      : undefined;

    return () => {
      window.removeEventListener('popstate', restorePage);
      void listener?.then(handle => handle.remove());
    };
  }, []);

  useLayoutEffect(() => {
    if (page.showArticle && article.current) {
      article.current.scrollIntoView({ block: 'start' });
      article.current.focus({ preventScroll: true });
    } else {
      window.scrollTo(0, page.scroll);
      if (!initialRender.current) heading.current?.focus({ preventScroll: true });
    }
    initialRender.current = false;
  }, [page.atlasView, page.depth]);

  function replacePage(next: Page) {
    window.history.replaceState(next, '');
    setPage(next);
  }

  function open(nextView: View, genus: number, frame = 0, showArticle = false) {
    window.history.replaceState({ ...page, scroll: window.scrollY, showArticle: false }, '');
    const next = { atlasView: nextView, genus, frame, depth: page.depth + 1, scroll: 0, showArticle };
    window.history.pushState(next, '');
    setPage(next);
  }

  function moveBy(step: number) {
    const position = card ? page.genus : page.frame;
    const total = card ? entries.length : entry.photos.length;
    const next = position + step;

    if (next < 0 || next >= total) return;
    if (card) {
      replacePage({ ...page, genus: next, frame: 0, scroll: 0 });
      window.scrollTo(0, 0);
    } else {
      replacePage({ ...page, frame: next, scroll: window.scrollY });
    }
  }

  function handleKey(event: KeyboardEvent<HTMLElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      moveBy(event.key === 'ArrowLeft' ? -1 : 1);
    }
  }

  function beginTouch(event: TouchEvent<HTMLElement>) {
    const touch = event.touches[0];
    startTouch.current = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
    suppressClickUntil.current = 0;
  }

  function endTouch(event: TouchEvent<HTMLElement>) {
    const start = startTouch.current;
    const touch = event.changedTouches[0];
    startTouch.current = null;
    if (!start || !touch) return;

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    const horizontal = Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.3;
    const down = card && dy >= 55 && dy > Math.abs(dx) * 1.3;
    if (!horizontal && !down) return;

    suppressClickUntil.current = Date.now() + 450;
    if (horizontal) moveBy(dx < 0 ? 1 : -1);
    else open('detail', page.genus);
  }

  function stopSwipeClick(event: MouseEvent<HTMLElement>) {
    if (event.detail > 0 && Date.now() < suppressClickUntil.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  const swipe = {
    onPointerDown: () => { suppressClickUntil.current = 0; },
    onTouchStart: beginTouch,
    onTouchEnd: endTouch,
    onTouchCancel: () => { startTouch.current = null; },
    onClickCapture: stopSwipeClick,
    onKeyDown: handleKey,
  };

  function controls(position: number, total: number) {
    return (
      <div className="atlas-controls">
        <button
          type="button"
          className="atlas-arrow"
          aria-label={card ? strings.previousCloud : strings.previousPhoto}
          disabled={position === 0}
          onClick={() => moveBy(-1)}
        >
          {arrow('left')}
        </button>
        <span className="atlas-counter" aria-live="polite" aria-atomic="true">
          <span className="atlas-visually-hidden">
            {card ? strings.cloudPosition(position + 1, total) : strings.photoPosition(position + 1, total)}
            {card && `. ${entry.title}`}
          </span>
          <span aria-hidden="true">
            {card ? strings.cardCounter(position + 1, total) : strings.photoPosition(position + 1, total)}
          </span>
        </span>
        <button
          type="button"
          className="atlas-arrow"
          aria-label={card ? strings.nextCloud : strings.nextPhoto}
          disabled={position === total - 1}
          onClick={() => moveBy(1)}
        >
          {arrow('right')}
        </button>
      </div>
    );
  }

  function creditLine() {
    return (
      <p className="atlas-credit-line">
        {strings.photoBy} {credit.creator} ·{' '}
        <button
          type="button"
          className="atlas-source-button"
          onClick={() => open('credit', page.genus, page.frame)}
        >
          {credit.collection}
        </button>
      </p>
    );
  }

  function title() {
    return (
      <h1 className="atlas-heading" tabIndex={-1} ref={heading}>
        {entry.title}
        {entry.title !== entry.latin && <span className="atlas-latin" lang="la">{entry.latin}</span>}
      </h1>
    );
  }

  function renderParagraph(paragraph: string) {
    const parts = paragraph.split(/(\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g);
    return parts.map((part, index) => {
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (!link) return part.startsWith('*') && part.endsWith('*')
        ? <em key={index}>{part.slice(1, -1)}</em>
        : <Fragment key={index}>{part}</Fragment>;
      const [, label, href] = link;
      if (/^https:\/\//.test(href)) return <ExternalLink key={index} href={href} label={label} />;
      const genus = entries.findIndex(item => `${item.id}.md` === href);
      if (genus === -1) return <Fragment key={index}>{label}</Fragment>;
      return (
        <a
          href={`#${entries[genus].id}`}
          key={index}
          onClick={event => {
            event.preventDefault();
            open('detail', genus, 0, true);
          }}
        >
          {label}
        </a>
      );
    });
  }

  return (
    <main className="atlas" data-genus={entry.id} data-view={page.atlasView}>
      <div className={`atlas-${page.atlasView}`} {...(card ? swipe : {})}>
        {!card && (
          <div className="atlas-tools">
            <button type="button" className="atlas-back" onClick={() => window.history.back()}>
              {arrow('left')}{strings.back}
            </button>
          </div>
        )}
        {card ? (
          <>
            <div className="atlas-media">
              <button
                type="button"
                className="atlas-photo-action"
                aria-label={`${strings.openDetails} · ${entry.title}`}
                aria-describedby="atlas-card-photo-description"
                onClick={() => open('detail', page.genus)}
              >
                <img className="atlas-photo" src={photo.url} alt={photo.alt} draggable={false} />
              </button>
            </div>
            <span id="atlas-card-photo-description" className="atlas-visually-hidden">{photo.alt}</span>
            {creditLine()}
            {title()}
            <p className="atlas-description">{entry.description}</p>
            <button
              type="button"
              className="atlas-details-button"
              onClick={() => open('detail', page.genus)}
            >
              {strings.details}
            </button>
            {controls(page.genus, entries.length)}
          </>
        ) : detail ? (
          <>
            {title()}
            <section className="atlas-gallery" aria-label={strings.gallery} {...swipe}>
              <div className="atlas-media">
                <img className="atlas-photo" src={photo.url} alt={photo.alt} draggable={false} />
              </div>
              {controls(page.frame, entry.photos.length)}
              <p className="atlas-caption">{photo.caption}</p>
              {creditLine()}
            </section>
            <article className="atlas-article" aria-label={strings.article} tabIndex={-1} ref={article}>
              {entry.sections.map(({ title: sectionTitle, paragraphs }, index) => (
                <section className="atlas-section" key={index}>
                  {(sectionTitle || index === 0) && <h2>{sectionTitle || strings.article}</h2>}
                  {paragraphs.map((paragraph, i) => <p key={i}>{renderParagraph(paragraph)}</p>)}
                </section>
              ))}
              {entry.references.length > 0 && (
                <ul className="atlas-references" aria-label={strings.references}>
                  {entry.references.map(reference => (
                    <li key={reference.url}>
                      <ExternalLink href={reference.url} label={reference.label} />
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </>
        ) : (
          <>
            <h1 className="atlas-heading" tabIndex={-1} ref={heading}>{strings.credit}</h1>
            <dl className="atlas-credit-record">
              <div><dt>{strings.creator}</dt><dd>{credit.creator}</dd></div>
              <div>
                <dt>{strings.source}</dt>
                <dd><ExternalLink href={credit.sourceUrl} label={credit.title} /></dd>
                <dd>{credit.collectionUrl
                  ? <ExternalLink href={credit.collectionUrl} label={credit.collection} />
                  : credit.collection}</dd>
              </div>
              <div>
                <dt>{strings.license}</dt>
                <dd>{credit.licenseUrl
                  ? <ExternalLink href={credit.licenseUrl} label={credit.license} />
                  : credit.license}</dd>
              </div>
              <div><dt>{strings.modifications}</dt><dd>{credit.modifications}</dd></div>
            </dl>
          </>
        )}
      </div>
    </main>
  );
}
