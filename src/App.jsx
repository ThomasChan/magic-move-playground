import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { getHighlighter } from 'shiki';
import { bundledThemesInfo } from 'shiki/themes';
import { bundledLanguagesInfo } from 'shiki/langs';
import { ShikiMagicMove } from 'shiki-magic-move/dist/react.mjs';
import { Loading } from './components/Loading.jsx';

import 'shiki-magic-move/dist/style.css';

export const PageWithHeader = ({children}) => (
  <div className="flex h-full flex-col">{children}</div>
);

export const App = () => {
  const [theme, _setTheme] = React.useState(localStorage.getItem('theme') || 'vitesse-dark');
  const [lang, _setLang] = React.useState(localStorage.getItem('lang') || 'jsx');
  const [code, setCode] = React.useState(localStorage.getItem('valueBefore') || '');
  const [valueBefore, _setValueBefore] = React.useState(localStorage.getItem('valueBefore') || '');
  const [valueAfter, _setValueAfter] = React.useState(localStorage.getItem('valueAfter') || '');
  const [duration, _setDuration] = React.useState(parseInt(localStorage.getItem('duration') || '750'));
  const [stagger, _setStagger] = React.useState(parseInt(localStorage.getItem('stagger') || '3'));
  const [useDebugStyles, _setUseDebugStyles] = React.useState(Boolean(localStorage.getItem('useDebugStyles') || 'true'));
  const [highlighter, setHighlighter] = React.useState(null);
  const setTheme = _ => {
    localStorage.setItem('theme', _);
    _setTheme(_);
  };
  const setLang = _ => {
    localStorage.setItem('lang', _);
    _setLang(_);
  };
  const setValueBefore = _ => {
    localStorage.setItem('valueBefore', _);
    _setValueBefore(_);
  };
  const setValueAfter = _ => {
    localStorage.setItem('valueAfter', _);
    _setValueAfter(_);
  };
  const setDuration = _ => {
    localStorage.setItem('duration', _);
    _setDuration(_);
  };
  const setStagger = _ => {
    localStorage.setItem('stagger', _);
    _setStagger(_);
  };
  const setUseDebugStyles = _ => {
    localStorage.setItem('useDebugStyles', _);
    _setUseDebugStyles(_);
  };

  React.useEffect(() => {
    getHighlighter({
      themes: [theme],
      langs: [lang],
    }).then(h => {
      setHighlighter(h);
    });
  }, [theme, lang]);

  const options = React.useMemo(() => ({
    duration: duration,
    stagger: stagger,
  }), [duration, stagger]);

  const onPlay = () => {
    setCode(valueBefore);
    setTimeout(() => {
      setCode(valueAfter);
      setTimeout(() => {
        setCode(valueBefore);
      }, duration * 4);
    }, duration * 2);
  };

  return <BrowserRouter>
    <Suspense
      fallback={
        <PageWithHeader>
          <Loading name="suspense"/>
        </PageWithHeader>
      }>
      <div className="flex flex-col font-sans px-4 py-4 gap-4">
        <div className="flex flex-col items-center flex-none  text-center">
          <span className="text-2xl font-light bg-gradient-to-r from-teal to-orange inline-block text-transparent bg-clip-text">
            <span>Shiki</span>
            <span className="font-bold mx-1">Magic</span>
            <span className="italic font-serif">Move</span>
          </span>
          <div className="text-stone:75">
            Smoothly animated code blocks with <a href="https://github.com/shikijs/shiki" target="_blank" rel="noreferrer" className="underline">Shiki</a>.
            <a href="https://github.com/shikijs/shiki-magic-move" target="_blank" rel="noreferrer" className="underline">GitHub</a>
          </div>
        </div>
        <div className="flex-none flex flex-wrap gap-4 items-center justify-between mb--4px">
          <select
            value={theme}
            onChange={e => {
              setHighlighter(null);
              setTheme(e.target.value);
            }}
            className="border border-gray:20 rounded px-2 py-1 text-sm">
            {bundledThemesInfo.map(t => <option
              key={t.id}
              value={t.id}>
              {t.displayName}
            </option>)}
          </select>
          <select
            value={lang}
            onChange={e => {
              setHighlighter(null);
              setLang(e.target.value);
            }}
            className="border border-gray:20 rounded px-2 py-1 text-sm">
            {bundledLanguagesInfo.map(t => <option
              key={t.id}
              value={t.id}>
              {t.name}
            </option>)}
          </select>
          <label className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              Duration
              <span className="op50 text-sm">{duration}ms</span>
            </div>
            <input
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              type="range" min="100" max="20000"
              className="w-40" />
          </label>
          <label className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              Stagger
              <span className="op50 text-sm">{stagger}ms</span>
            </div>
            <input
              value={stagger}
              onChange={e => setStagger(Number(e.target.value))}
              type="range" min="0" max="20"
              className="w-40" />
          </label>
          <label className="text-sm flex items-center gap-1">
            <input
              value={useDebugStyles}
              onChange={e => setUseDebugStyles(e.target.checked)}
              type="checkbox" />
            Style for debugging
          </label>
          <button className="border border-gray:20 rounded px-3 py-1" onClick={onPlay}>Play</button>
          {/* <button className="border border-gray:20 rounded px-3 py-1" onClick={onRecord}>Play And Export As Video</button> */}
        </div>
        <div className="grid md:grid-cols-2 gap-4 flex-auto h-[40vh]">
          <div className="flex flex-col gap-4">
            <h5>Before:</h5>
            <textarea
              value={valueBefore}
              onChange={e => setValueBefore(e.target.value)}
              className="font-mono w-full h-1/2 flex-auto p-4 border border-gray:20 rounded bg-transparent min-h-100" />
          </div>
          <div className="of-auto flex flex-col gap-4">
            <h5>After:</h5>
            <textarea
              value={valueAfter}
              onChange={e => setValueAfter(e.target.value)}
              className="font-mono w-full h-1/2 flex-auto p-4 border border-gray:20 rounded bg-transparent min-h-100" />
          </div>
        </div>
        <div className={`overflow-auto w-full ${useDebugStyles ? 'magic-move-debug-style' : ''}`}>
          {highlighter
            ? <ShikiMagicMove
              className="font-mono min-w-fit min-h-fit p-4 border border-gray:20 shadow-xl rounded-xl of-hidden"
              highlighter={highlighter}
              theme={theme}
              lang={lang}
              code={code}
              options={options} />
            : null}
        </div>
      </div>
    </Suspense>
  </BrowserRouter>
};
