import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  BookA,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  FolderEdit,
  Headphones,
  History,
  LayoutDashboard,
  Lock,
  LogOut,
  Plus,
  Search,
  Settings,
  Sparkles,
  Star,
  Trash2,
  Upload,
  Video,
  Volume2,
  X
} from 'lucide-react';
import { supabase } from './supabaseClient';

const ALFABE_STORAGE_VERSION = '2026-11-26-v3';

const ALFABE_DEFAULT_WORDS = [
  { id: 'alf-1', letter: 'A', word: 'Agir', image_url: '' },
  { id: 'alf-2', letter: 'B', word: 'Berf', image_url: '' },
  { id: 'alf-3', letter: 'C', word: 'Cemed', image_url: '' },
  { id: 'alf-4', letter: 'Ç', word: 'Çay', image_url: '' },
  { id: 'alf-5', letter: 'D', word: 'Dar', image_url: '' },
  { id: 'alf-6', letter: 'E', word: 'Ewr', image_url: '' },
  { id: 'alf-7', letter: 'Ê', word: 'Êvar', image_url: '' },
  { id: 'alf-8', letter: 'F', word: 'Fîl', image_url: '' },
  { id: 'alf-9', letter: 'G', word: 'Guh', image_url: '' },
  { id: 'alf-10', letter: 'H', word: 'Hêvî', image_url: '' },
  { id: 'alf-11', letter: 'I', word: 'Irmak', image_url: '' },
  { id: 'alf-12', letter: 'Î', word: 'Îsot', image_url: '' },
  { id: 'alf-13', letter: 'J', word: 'Jîn', image_url: '' },
  { id: 'alf-14', letter: 'K', word: 'Kevir', image_url: '' },
  { id: 'alf-15', letter: 'L', word: 'Lîmon', image_url: '' },
  { id: 'alf-16', letter: 'M', word: 'Masî', image_url: '' },
  { id: 'alf-17', letter: 'N', word: 'Nan', image_url: '' },
  { id: 'alf-18', letter: 'O', word: 'Oda', image_url: '' },
  { id: 'alf-19', letter: 'P', word: 'Pirtûk', image_url: '' },
  { id: 'alf-20', letter: 'Q', word: 'Qelem', image_url: '' },
  { id: 'alf-21', letter: 'R', word: 'Rojname', image_url: '' },
  { id: 'alf-22', letter: 'S', word: 'Stêrk', image_url: '' },
  { id: 'alf-23', letter: 'Ş', word: 'Şev', image_url: '' },
  { id: 'alf-24', letter: 'T', word: 'Tivir', image_url: '' },
  { id: 'alf-25', letter: 'U', word: 'Uçak', image_url: '' },
  { id: 'alf-26', letter: 'Û', word: 'Ûrmiye', image_url: '' },
  { id: 'alf-27', letter: 'V', word: 'Vîyon', image_url: '' },
  { id: 'alf-28', letter: 'W', word: 'Welat', image_url: '' },
  { id: 'alf-29', letter: 'X', word: 'Xwendin', image_url: '' },
  { id: 'alf-30', letter: 'Y', word: 'Yek', image_url: '' },
  { id: 'alf-31', letter: 'Z', word: 'Zarok', image_url: '' }
];

const KURDISH_LETTERS_POOL = [
  'A', 'B', 'C', 'Ç', 'D', 'E', 'Ê', 'F', 'G', 'H', 'I', 'Î', 'J', 'K', 'L',
  'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'Ş', 'T', 'U', 'Û', 'V', 'W', 'X', 'Y', 'Z'
];

function inferFirstLetter(item) {
  if (item?.letter && String(item.letter).trim()) {
    return String(item.letter).trim().charAt(0).toUpperCase();
  }
  const w = String(item?.word || '').trim();
  if (!w) return 'A';
  const first = w.charAt(0).toUpperCase();
  if (first === 'İ') return 'Î';
  return first;
}

function maskWordLetter(word) {
  const clean = String(word || '').trim();
  if (clean.length <= 1) {
    return { masked: '_', missingChar: clean || 'A' };
  }
  const idx = clean.length > 2 ? 1 : 0;
  const missingChar = clean.charAt(idx);
  const masked =
    clean.slice(0, idx) + '_' + clean.slice(idx + 1);
  return { masked, missingChar };
}

function ALFABE({
  exercises = [],
  gamesReset = false,
  isAdmin = false,
  xpPoints = 0,
  streakDays = 0,
  completedUnits = [],
  wordBank = ALFABE_DEFAULT_WORDS,
  dictionaryItems = [],
  selectedLang = 'KU',
  onAwardXp,
  onDeductHeartOrReset,
  onCompleteUnit,
  onEditGameInAdmin,
  onTriggerPhotoUpload,
  inlinePhotoSaving = false,
  exMsg = '',
  ui
}) {
  const effectiveBank = Array.isArray(wordBank) && wordBank.length > 0
    ? wordBank
    : ALFABE_DEFAULT_WORDS;

  const [gameMode, setGameMode] = useState('match');

  const customMatchRounds = (() => {
    if (gamesReset || !Array.isArray(exercises)) return [];
    const grouped = new Map();
    exercises.forEach((ex) => {
      if (!ex || ex.exercise_type !== 'match') return;
      const uTitle = (ex.unit_title || '').trim() || 'Lîstika Hevberkirinê';
      if (!grouped.has(uTitle)) {
        grouped.set(uTitle, {
          roundTitle: uTitle,
          sourceExercise: ex,
          items: []
        });
      }
      const roundObj = grouped.get(uTitle);
      const opts = Array.isArray(ex.options) ? ex.options : [];
      if (opts.length > 0) {
        opts.forEach((optStr, idx) => {
          const parts = String(optStr).split('=');
          const wPart = (parts[0] || ex.question_text || '').trim();
          const imgPart = (parts[1] || ex.image_url || '').trim();
          if (wPart && roundObj.items.length < 4) {
            roundObj.items.push({
              id: `${ex.id}-${idx}`,
              exerciseId: ex.id,
              unitTitle: uTitle,
              word: wPart,
              image_url: imgPart
            });
          }
        });
      } else if (ex.question_text && roundObj.items.length < 4) {
        roundObj.items.push({
          id: `${ex.id}-main`,
          exerciseId: ex.id,
          unitTitle: uTitle,
          word: ex.question_text.trim(),
          image_url: (ex.image_url || '').trim()
        });
      }
    });

    return Array.from(grouped.values()).filter((r) => r.items.length > 0);
  })();

  const customModeExercises = (() => {
    if (gamesReset || !Array.isArray(exercises)) return [];
    return exercises.filter((ex) =>
      ['first_letter', 'memory', 'missing_letter'].includes(ex?.exercise_type)
    );
  })();

  const totalRounds =
    customMatchRounds.length + Math.max(1, Math.ceil(effectiveBank.length / 4));
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedWordId, setSelectedWordId] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [localHearts, setLocalHearts] = useState(5);

  const [firstLetterIdx, setFirstLetterIdx] = useState(0);
  const [firstLetterSolved, setFirstLetterSolved] = useState(false);

  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedCardIds, setFlippedCardIds] = useState([]);
  const [matchedPairKeys, setMatchedPairKeys] = useState([]);

  const [missingIdx, setMissingIdx] = useState(0);
  const [missingSolved, setMissingSolved] = useState(false);

  useEffect(() => {
    setRoundIndex(0);
    setFirstLetterIdx(0);
    setMissingIdx(0);
    setFeedback(null);
  }, [gameMode]);

  const currentRoundItems = (() => {
    if (roundIndex < customMatchRounds.length) {
      return customMatchRounds[roundIndex].items;
    }
    const bankOffset = (roundIndex - customMatchRounds.length) * 4;
    return effectiveBank.slice(bankOffset, bankOffset + 4);
  })();

  const activeCustomRound =
    roundIndex < customMatchRounds.length ? customMatchRounds[roundIndex] : null;

  const activeCustomExercise = (() => {
    if (customModeExercises.length === 0) return null;
    const byType = customModeExercises.find((e) => e.exercise_type === gameMode);
    return byType || customModeExercises[0] || null;
  })();

  const [shuffledImages, setShuffledImages] = useState([]);

  useEffect(() => {
    setSelectedWordId(null);
    setMatchedIds([]);
    setFeedback(null);
    const copy = [...currentRoundItems];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setShuffledImages(copy);
  }, [roundIndex, effectiveBank, customMatchRounds.length]);

  useEffect(() => {
    setFirstLetterSolved(false);
    setFeedback(null);
  }, [firstLetterIdx, roundIndex, gameMode]);

  useEffect(() => {
    setMissingSolved(false);
    setFeedback(null);
  }, [missingIdx, roundIndex, gameMode]);

  useEffect(() => {
    if (gameMode !== 'memory') return;
    const pairItems = currentRoundItems.slice(0, 4);
    const deck = [];
    pairItems.forEach((item, idx) => {
      const ltr = inferFirstLetter(item);
      const pairKey = item.id || `pair-${idx}`;
      deck.push({
        uid: `${pairKey}-L`,
        pairKey,
        kind: 'letter',
        label: ltr,
        subLabel: 'Tîp'
      });
      deck.push({
        uid: `${pairKey}-W`,
        pairKey,
        kind: 'word',
        label: item.word,
        subLabel: ltr,
        image_url: item.image_url || ''
      });
    });
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    setMemoryCards(deck);
    setFlippedCardIds([]);
    setMatchedPairKeys([]);
    setFeedback(null);
  }, [gameMode, roundIndex, currentRoundItems]);

  const handleSelectWord = (item) => {
    if (matchedIds.includes(item.id)) return;
    setSelectedWordId(item.id);
    setFeedback(null);
  };

  const handleSelectImage = (imgItem) => {
    if (!selectedWordId || matchedIds.includes(imgItem.id)) return;
    if (selectedWordId === imgItem.id) {
      const nextMatched = [...matchedIds, imgItem.id];
      setMatchedIds(nextMatched);
      setSelectedWordId(null);
      setFeedback({ type: 'ok', text: ui.alfabe_match_ok });
      if (typeof onAwardXp === 'function') onAwardXp(10);

      if (nextMatched.length === currentRoundItems.length) {
        const roundKey = activeCustomRound
          ? activeCustomRound.roundTitle
          : `ALFABE-${roundIndex + 1}`;
        if (typeof onCompleteUnit === 'function') onCompleteUnit(roundKey);
      }
    } else {
      const nextH = Math.max(0, localHearts - 1);
      setLocalHearts(nextH);
      setFeedback({ type: 'err', text: ui.alfabe_match_err });
      if (typeof onDeductHeartOrReset === 'function') onDeductHeartOrReset(nextH);
    }
  };

  const currentFirstLetterTarget =
    currentRoundItems[firstLetterIdx % Math.max(1, currentRoundItems.length)] ||
    effectiveBank[0];

  const firstLetterChoices = (() => {
    const correctLetter = inferFirstLetter(currentFirstLetterTarget);
    const distractors = KURDISH_LETTERS_POOL.filter((l) => l !== correctLetter).slice(
      (firstLetterIdx * 3 + roundIndex) % 24,
      ((firstLetterIdx * 3 + roundIndex) % 24) + 5
    );
    const combined = [correctLetter, ...distractors].slice(0, 6);
    return combined.sort((a, b) => a.localeCompare(b, 'ku'));
  })();

  const handlePickFirstLetter = (chosenLetter) => {
    const correctLetter = inferFirstLetter(currentFirstLetterTarget);
    if (chosenLetter === correctLetter) {
      setFirstLetterSolved(true);
      setFeedback({
        type: 'ok',
        text: `Rast e! "${currentFirstLetterTarget.word}" bi tîpa "${correctLetter}" dest pê dike.`
      });
      if (typeof onAwardXp === 'function') onAwardXp(10);
      if (typeof onCompleteUnit === 'function') {
        onCompleteUnit(`TIPA-PESIN-${currentFirstLetterTarget.word}`);
      }
    } else {
      setFeedback({
        type: 'err',
        text: `Şaş e! Tîpa pêşîn a "${currentFirstLetterTarget.word}" ne "${chosenLetter}" ye.`
      });
    }
  };

  const handleFlipMemoryCard = (card) => {
    if (matchedPairKeys.includes(card.pairKey)) return;
    if (flippedCardIds.includes(card.uid)) return;
    if (flippedCardIds.length >= 2) return;

    const nextFlipped = [...flippedCardIds, card.uid];
    setFlippedCardIds(nextFlipped);

    if (nextFlipped.length === 2) {
      const [firstId, secondId] = nextFlipped;
      const c1 = memoryCards.find((c) => c.uid === firstId);
      const c2 = memoryCards.find((c) => c.uid === secondId);
      if (c1 && c2 && c1.pairKey === c2.pairKey && c1.kind !== c2.kind) {
        const nextMatchedPairs = [...matchedPairKeys, c1.pairKey];
        setMatchedPairKeys(nextMatchedPairs);
        setFlippedCardIds([]);
        setFeedback({
          type: 'ok',
          text: `Li hev hat! Tîp û peyva "${c2.label}" hatin dîtin.`
        });
        if (typeof onAwardXp === 'function') onAwardXp(10);
        if (nextMatchedPairs.length * 2 === memoryCards.length) {
          if (typeof onCompleteUnit === 'function') {
            onCompleteUnit(`BIRE-${roundIndex + 1}`);
          }
        }
      } else {
        setFeedback({
          type: 'err',
          text: 'Ev her du kart li hev nehatin — dîsa biceribîne!'
        });
        setTimeout(() => {
          setFlippedCardIds([]);
        }, 700);
      }
    }
  };

  const currentMissingTarget =
    currentRoundItems[missingIdx % Math.max(1, currentRoundItems.length)] ||
    effectiveBank[0];

  const { masked: maskedWordDisplay, missingChar: expectedMissingChar } =
    maskWordLetter(currentMissingTarget?.word || '');

  const missingLetterChoices = (() => {
    const targetChar = String(expectedMissingChar || 'a').toLowerCase();
    const pool = KURDISH_LETTERS_POOL.map((l) => l.toLowerCase()).filter(
      (c) => c !== targetChar
    );
    const picks = pool.slice(
      (missingIdx * 2 + roundIndex) % 24,
      ((missingIdx * 2 + roundIndex) % 24) + 5
    );
    return [targetChar, ...picks].slice(0, 6).sort();
  })();

  const handlePickMissingChar = (charOption) => {
    const targetChar = String(expectedMissingChar || '').toLowerCase();
    if (charOption.toLowerCase() === targetChar) {
      setMissingSolved(true);
      setFeedback({
        type: 'ok',
        text: `Bijî! Peyv temam bû: "${currentMissingTarget.word}".`
      });
      if (typeof onAwardXp === 'function') onAwardXp(10);
      if (typeof onCompleteUnit === 'function') {
        onCompleteUnit(`TIPA-KEM-${currentMissingTarget.word}`);
      }
    } else {
      setFeedback({
        type: 'err',
        text: `Şaş e! Tîpa "${charOption}" li vê valahiyê nayê.`
      });
    }
  };

  const resolveWordPreview = (wordText) => {
    if (!Array.isArray(dictionaryItems)) return '';
    const clean = String(wordText || '').trim().toLowerCase();
    const found = dictionaryItems.find(
      (d) => String(d.word || '').trim().toLowerCase() === clean
    );
    if (!found) return '';
    return (
      found.meanings_i18n?.[selectedLang] ||
      found.meaning_ku ||
      found.meaning_tr ||
      found.meaning_en ||
      ''
    );
  };

  const editableExerciseForCurrentMode =
    activeCustomRound?.sourceExercise || activeCustomExercise || exercises[0] || null;

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-red-700" />
            <span>{ui.learn_title}</span>
          </h1>
          <p className="text-sm text-slate-600">{ui.learn_subtitle}</p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold">
            {xpPoints} {ui.learn_xp_label}
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 text-xs font-extrabold">
            {streakDays} {ui.learn_streak_suffix}
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-extrabold">
            {completedUnits.length} {ui.learn_done_badge}
          </div>
        </div>
      </div>

      {exMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          {exMsg}
        </div>
      )}

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setGameMode('match')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition ${
            gameMode === 'match'
              ? 'bg-red-700 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          1. Hevberkirin (Peyv + Wêne)
        </button>
        <button
          type="button"
          onClick={() => setGameMode('first_letter')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition ${
            gameMode === 'first_letter'
              ? 'bg-red-700 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          2. Tîpa Pêşîn Bibîne
        </button>
        <button
          type="button"
          onClick={() => setGameMode('memory')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition ${
            gameMode === 'memory'
              ? 'bg-red-700 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          3. Lîstika Bîrê (Tîp - Peyv)
        </button>
        <button
          type="button"
          onClick={() => setGameMode('missing_letter')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition ${
            gameMode === 'missing_letter'
              ? 'bg-red-700 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          4. Tîpa Kêm Dagire
        </button>
      </div>

      <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              {gameMode === 'match' &&
                (activeCustomRound
                  ? activeCustomRound.roundTitle
                  : ui.alfabe_game_title)}
              {gameMode === 'first_letter' &&
                'Lîstika Tîpa Pêşîn: Peyv bi kîjan tîpê dest pê dike?'}
              {gameMode === 'memory' &&
                'Lîstika Bîrê: Tîpê û peyva wê li hev bîne'}
              {gameMode === 'missing_letter' &&
                'Lîstika Tîpa Kêm: Tîpa winda hilbijêre û peyvê temam bike'}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {gameMode === 'match' && ui.alfabe_game_desc}
              {gameMode === 'first_letter' &&
                'Li peyvê an wêneyê binêre û tîpa destpêkê ya rast hilbijêre.'}
              {gameMode === 'memory' &&
                'Du kartan veke; heke tîp û peyva li gorî wê tîpê li hev hatin, cot tê dîtin.'}
              {gameMode === 'missing_letter' &&
                'Tîpa vala (_) di peyvê de bi tîpa rast dagire.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isAdmin && editableExerciseForCurrentMode && (
              <button
                type="button"
                onClick={() =>
                  typeof onEditGameInAdmin === 'function' &&
                  onEditGameInAdmin(editableExerciseForCurrentMode)
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-extrabold border border-amber-300"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Lîstikê Biguherîne (Admin)</span>
              </button>
            )}
            <span className="text-xs font-bold text-slate-500 px-2.5 py-1 rounded-lg bg-white border border-slate-200">
              {effectiveBank.length} {ui.alfabe_letters_suffix}
            </span>
            <button
              type="button"
              onClick={() => setRoundIndex((prev) => Math.max(0, prev - 1))}
              disabled={roundIndex === 0}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 text-xs font-bold text-slate-700"
            >
              {ui.alfabe_prev_btn}
            </button>
            <span className="text-xs font-extrabold text-slate-800 px-2">
              {ui.alfabe_round_prefix} {roundIndex + 1} / {totalRounds}
            </span>
            <button
              type="button"
              onClick={() =>
                setRoundIndex((prev) => Math.min(totalRounds - 1, prev + 1))
              }
              disabled={roundIndex >= totalRounds - 1}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 text-xs font-bold text-slate-700"
            >
              {ui.alfabe_next_btn}
            </button>
          </div>
        </div>

        {gameMode === 'match' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2.5">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                {ui.alfabe_words_col}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentRoundItems.map((item) => {
                  const isMatched = matchedIds.includes(item.id);
                  const isSelected = selectedWordId === item.id;
                  const meaningHint = resolveWordPreview(item.word);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={isMatched}
                      onClick={() => handleSelectWord(item)}
                      className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between gap-1 ${
                        isMatched
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 opacity-75'
                          : isSelected
                          ? 'bg-red-700 border-red-700 text-white shadow-sm'
                          : 'bg-white border-slate-200 hover:border-red-300 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-base">{item.word}</span>
                        {item.letter && (
                          <span
                            className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {item.letter}
                          </span>
                        )}
                      </div>
                      {meaningHint && (
                        <span
                          className={`text-[11px] line-clamp-1 ${
                            isSelected ? 'text-red-100' : 'text-slate-500'
                          }`}
                        >
                          {meaningHint}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                {ui.alfabe_images_col}
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {shuffledImages.map((imgItem) => {
                  const isMatched = matchedIds.includes(imgItem.id);
                  return (
                    <div
                      key={imgItem.id}
                      onClick={() => !isMatched && handleSelectImage(imgItem)}
                      className={`relative min-h-[118px] rounded-xl border p-2.5 flex flex-col items-center justify-center text-center transition ${
                        isMatched
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : selectedWordId
                          ? 'bg-white border-slate-300 hover:border-red-500 cursor-pointer'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      {imgItem.image_url ? (
                        <img
                          src={imgItem.image_url}
                          alt={imgItem.word}
                          className="w-full h-20 object-contain rounded-lg"
                        />
                      ) : (
                        <div className="text-xs font-bold text-slate-400 px-2">
                          {imgItem.letter ? `${imgItem.letter} — ` : ''}
                          {imgItem.word}
                        </div>
                      )}

                      {isMatched && (
                        <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700">
                          <Check className="w-3.5 h-3.5" />
                          <span>{imgItem.word}</span>
                        </span>
                      )}

                      {isAdmin && typeof onTriggerPhotoUpload === 'function' && (
                        <button
                          type="button"
                          disabled={inlinePhotoSaving}
                          onClick={(e) =>
                            onTriggerPhotoUpload(e, {
                              wordItem: imgItem,
                              mode: imgItem.exerciseId ? 'question' : 'alfabe_word',
                              exerciseId: imgItem.exerciseId
                            })
                          }
                          title={ui.alfabe_add_photo_title}
                          className="mt-1.5 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-red-50 text-[10px] font-bold text-slate-700 hover:text-red-700"
                        >
                          <Upload className="w-3 h-3 text-red-700" />
                          <span>{inlinePhotoSaving ? '...' : ui.alfabe_photo_btn}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {gameMode === 'first_letter' && currentFirstLetterTarget && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-xs font-extrabold text-red-700 uppercase">
                  Peyva #{firstLetterIdx + 1} ji {currentRoundItems.length} peyvan
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {currentFirstLetterTarget.word}
                </div>
                {resolveWordPreview(currentFirstLetterTarget.word) && (
                  <div className="text-xs text-slate-500">
                    {resolveWordPreview(currentFirstLetterTarget.word)}
                  </div>
                )}
              </div>

              {currentFirstLetterTarget.image_url && (
                <img
                  src={currentFirstLetterTarget.image_url}
                  alt={currentFirstLetterTarget.word}
                  className="w-24 h-24 object-contain rounded-xl border border-slate-100"
                />
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {firstLetterChoices.map((ltr) => (
                <button
                  key={ltr}
                  type="button"
                  onClick={() => handlePickFirstLetter(ltr)}
                  className="py-3.5 rounded-xl bg-white hover:bg-red-700 hover:text-white border border-slate-200 text-lg font-extrabold text-slate-900 transition"
                >
                  {ltr}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() =>
                  setFirstLetterIdx((prev) =>
                    prev > 0 ? prev - 1 : Math.max(0, currentRoundItems.length - 1)
                  )
                }
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700"
              >
                Peyva Berê
              </button>
              <button
                type="button"
                onClick={() =>
                  setFirstLetterIdx(
                    (prev) => (prev + 1) % Math.max(1, currentRoundItems.length)
                  )
                }
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                {firstLetterSolved ? 'Peyva Din →' : 'Derbas Bike'}
              </button>
            </div>
          </div>
        )}

        {gameMode === 'memory' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>
                Cotên hatî dîtin: {matchedPairKeys.length} /{' '}
                {Math.max(1, Math.floor(memoryCards.length / 2))}
              </span>
              <button
                type="button"
                onClick={() => {
                  const copy = [...memoryCards];
                  for (let i = copy.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [copy[i], copy[j]] = [copy[j], copy[i]];
                  }
                  setMemoryCards(copy);
                  setFlippedCardIds([]);
                  setMatchedPairKeys([]);
                  setFeedback(null);
                }}
                className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
              >
                Kartên Bîrê Tev Bide
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {memoryCards.map((card) => {
                const isMatched = matchedPairKeys.includes(card.pairKey);
                const isFlipped = flippedCardIds.includes(card.uid) || isMatched;
                return (
                  <button
                    key={card.uid}
                    type="button"
                    disabled={isMatched}
                    onClick={() => handleFlipMemoryCard(card)}
                    className={`min-h-[104px] p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                      isMatched
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : isFlipped
                        ? 'bg-white border-red-400 text-slate-900 shadow-xs'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-800 text-white'
                    }`}
                  >
                    {isFlipped ? (
                      <>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">
                          {card.kind === 'letter' ? 'Tîp' : 'Peyv'}
                        </span>
                        <span
                          className={`font-extrabold ${
                            card.kind === 'letter' ? 'text-2xl' : 'text-base'
                          }`}
                        >
                          {card.label}
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-extrabold tracking-widest">?</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {gameMode === 'missing_letter' && currentMissingTarget && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-xs font-extrabold text-red-700 uppercase">
                  Peyva #{missingIdx + 1} ji {currentRoundItems.length} peyvan
                </div>
                <div className="text-2xl font-extrabold tracking-widest text-slate-900">
                  {missingSolved ? currentMissingTarget.word : maskedWordDisplay}
                </div>
                {resolveWordPreview(currentMissingTarget.word) && (
                  <div className="text-xs text-slate-500">
                    {resolveWordPreview(currentMissingTarget.word)}
                  </div>
                )}
              </div>

              {currentMissingTarget.image_url && (
                <img
                  src={currentMissingTarget.image_url}
                  alt={currentMissingTarget.word}
                  className="w-24 h-24 object-contain rounded-xl border border-slate-100"
                />
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {missingLetterChoices.map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => handlePickMissingChar(ch)}
                  className="py-3.5 rounded-xl bg-white hover:bg-red-700 hover:text-white border border-slate-200 text-lg font-extrabold text-slate-900 uppercase transition"
                >
                  {ch}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() =>
                  setMissingIdx((prev) =>
                    prev > 0 ? prev - 1 : Math.max(0, currentRoundItems.length - 1)
                  )
                }
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700"
              >
                Peyva Berê
              </button>
              <button
                type="button"
                onClick={() =>
                  setMissingIdx(
                    (prev) => (prev + 1) % Math.max(1, currentRoundItems.length)
                  )
                }
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                {missingSolved ? 'Peyva Din →' : 'Derbas Bike'}
              </button>
            </div>
          </div>
        )}

        {feedback && (
          <div
            className={`p-3 rounded-xl text-xs sm:text-sm font-bold ${
              feedback.type === 'ok'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {feedback.text}
          </div>
        )}
      </div>
    </section>
  );
}

function AdminGameEditorModal({
  exercise,
  onClose,
  onSaved,
  onUploadImage
}) {
  const [unitTitle, setUnitTitle] = useState(exercise?.unit_title || '');
  const [exerciseType, setExerciseType] = useState(
    exercise?.exercise_type || 'match'
  );
  const [questionText, setQuestionText] = useState(
    exercise?.question_text || ''
  );
  const [optionsRaw, setOptionsRaw] = useState(
    Array.isArray(exercise?.options) ? exercise.options.join('\n') : ''
  );
  const [correctAnswer, setCorrectAnswer] = useState(
    exercise?.correct_answer || ''
  );
  const [explanation, setExplanation] = useState(exercise?.explanation || '');
  const [imageUrl, setImageUrl] = useState(exercise?.image_url || '');
  const [audioUrl, setAudioUrl] = useState(exercise?.audio_url || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setUnitTitle(exercise?.unit_title || '');
    setExerciseType(exercise?.exercise_type || 'match');
    setQuestionText(exercise?.question_text || '');
    setOptionsRaw(
      Array.isArray(exercise?.options) ? exercise.options.join('\n') : ''
    );
    setCorrectAnswer(exercise?.correct_answer || '');
    setExplanation(exercise?.explanation || '');
    setImageUrl(exercise?.image_url || '');
    setAudioUrl(exercise?.audio_url || '');
    setErrorMsg('');
  }, [exercise]);

  if (!exercise) return null;

  const handleImagePick = async (e) => {
    const file = e.target.files?.[0];
    if (!file || typeof onUploadImage !== 'function') return;
    setUploading(true);
    setErrorMsg('');
    try {
      const url = await onUploadImage(file, 'exercises');
      if (url) setImageUrl(url);
    } catch (err) {
      setErrorMsg('Wêne nehat barkirin: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      const parsedOptions = optionsRaw
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      const payload = {
        unit_title: unitTitle.trim(),
        exercise_type: exerciseType,
        question_text: questionText.trim(),
        options: parsedOptions,
        correct_answer: correctAnswer.trim(),
        explanation: explanation.trim(),
        image_url: imageUrl.trim(),
        audio_url: audioUrl.trim()
      };

      const { error } = await supabase
        .from('kurmanci_exercises')
        .update(payload)
        .eq('id', exercise.id);

      if (error) throw error;
      if (typeof onSaved === 'function') await onSaved();
      onClose();
    } catch (err) {
      setErrorMsg('Tomarkirin bi ser neket: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-extrabold text-slate-900">
            Lîstikê Biguherîne (Admin Formu — #{exercise.id})
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Navê Lîstikê / Qonaxê
            </label>
            <input
              type="text"
              required
              value={unitTitle}
              onChange={(e) => setUnitTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Cureyê Lîstikê
            </label>
            <select
              value={exerciseType}
              onChange={(e) => setExerciseType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            >
              <option value="match">Hevberkirin (Match)</option>
              <option value="first_letter">Tîpa Pêşîn Bibîne (First Letter)</option>
              <option value="memory">Lîstika Bîrê (Memory Cards)</option>
              <option value="missing_letter">Tîpa Kêm Dagire (Missing Letter)</option>
              <option value="choice">Hilbijartin (Choice)</option>
              <option value="sentence">Hevok (Sentence)</option>
              <option value="fill">Valahî Dagirtin (Fill)</option>
              <option value="image">Wêne (Image)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Sernav / Pirs
            </label>
            <input
              type="text"
              required
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Vebijêrk / Peyv=Wêne (Her rêzek yek)
            </label>
            <textarea
              rows={4}
              value={optionsRaw}
              onChange={(e) => setOptionsRaw(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Bersiva Rast
            </label>
            <input
              type="text"
              required
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Wêne (Ji Komputerê)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
              <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? '...' : 'Wêne'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagePick}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Deng (Audio URL)
            </label>
            <input
              type="text"
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ravekirin
            </label>
            <input
              type="text"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
            >
              Betal Bike
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold"
            >
              {saving ? 'Tê tomarkirin...' : 'Guherandinê Tomar Bike'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
const ADMIN_PASSCODE = 'kurdiklass2026';

const DEFAULT_CATEGORIES = [
  { slug: 'ders', name: 'Ders' },
  { slug: 'zarok', name: 'Zarok' },
  { slug: 'ferheng', name: 'Ferheng' },
  { slug: 'lîstik', name: 'Lîstik' },
  { slug: 'wêje', name: 'Wêje' }
];

const DEFAULT_MEDIA_TYPES = [
  { id: 'video', label: 'Vîdyo', icon: Video },
  { id: 'audio', label: 'Deng', icon: Headphones },
  { id: 'pdf', label: 'PDF / Belge', icon: FileText },
  { id: 'image', label: 'Wêne / Infografîk', icon: Eye }
];

const DEFAULT_LEVELS = [
  'Destpêk (A1-A2)',
  'Navîn (B1-B2)',
  'Pêşketî (C1-C2)',
  'Zarok'
];

const DEFAULT_GRADES = [
  'Pola 1-4',
  'Pola 5-8',
  'Lîse / Zanîngeh',
  'Hemû Ast'
];

const LANGUAGE_OPTIONS = [
  { code: 'KU', nativeName: 'Kurmancî' },
  { code: 'ZZA', nativeName: 'Kirmanckî (Zazakî)' },
  { code: 'CKB', nativeName: 'Soranî' },
  { code: 'TR', nativeName: 'Türkçe' },
  { code: 'EN', nativeName: 'English' },
  { code: 'DE', nativeName: 'Deutsch' },
  { code: 'FR', nativeName: 'Français' },
  { code: 'IT', nativeName: 'Italiano' }
];

const UI_FIELD_LABELS = [
  { key: 'brand_first', label: 'Navê Markayê (Beşa 1)' },
  { key: 'brand_second', label: 'Navê Markayê (Beşa 2)' },
  { key: 'nav_site', label: 'Menû: Malper' },
  { key: 'nav_learn', label: 'Menû: Hînbûn / Lîstik' },
  { key: 'nav_ferheng', label: 'Menû: Ferheng' },
  { key: 'nav_admin', label: 'Menû: Rêveber' },
  { key: 'hero_badge', label: 'Etîketa Hero' },
  { key: 'hero_title', label: 'Sernavê Hero' },
  { key: 'hero_subtitle', label: 'Binsernavê Hero' },
  { key: 'search_placeholder', label: 'Cihê Lêgerînê (Malper)' },
  { key: 'all_categories_label', label: 'Etîketa Hemû Beşan' },
  { key: 'filter_title', label: 'Sernavê Parzûnan' },
  { key: 'filter_level_all', label: 'Parzûna Astê (Hemû)' },
  { key: 'filter_media_all', label: 'Parzûna Medyayê (Hemû)' },
  { key: 'reset_filters_btn', label: 'Bişkojka Paqijkirina Parzûnan' },
  { key: 'list_all_title', label: 'Sernavê Lîsteya Materyalan' },
  { key: 'list_count_suffix', label: 'Paşgira Hejmara Materyalan' },
  { key: 'loading_text', label: 'Nivîsa Barkirinê' },
  { key: 'empty_title', label: 'Sernavê Vala' },
  { key: 'empty_subtitle', label: 'Binsernavê Vala' },
  { key: 'empty_button', label: 'Bişkojka Vala' },
  { key: 'card_guide_badge', label: 'Etîketa Rêbera Mamosteyan' },
  { key: 'meta_level_prefix', label: 'Pêşgira Astê' },
  { key: 'meta_grade_prefix', label: 'Pêşgira Polê' },
  { key: 'btn_open_material', label: 'Bişkojka Vekirina Materyalê' },
  { key: 'tab_content', label: 'Tab: Naverok' },
  { key: 'tab_guide', label: 'Tab: Rêbera Mamosteyan' },
  { key: 'guide_heading', label: 'Sernavê Rêberê' },
  { key: 'guide_empty_text', label: 'Nivîsa Rêbera Vala' },
  { key: 'guide_download_btn', label: 'Bişkojka Daxistina PDF' },
  { key: 'learn_title', label: 'Sernavê Hînbûn / Lîstik' },
  { key: 'learn_subtitle', label: 'Binsernavê Hînbûn / Lîstik' },
  { key: 'learn_xp_label', label: 'Etîketa XP' },
  { key: 'learn_streak_suffix', label: 'Paşgira Rêza Rojan' },
  { key: 'learn_done_badge', label: 'Etîketa Qonaxên Qediyayî' },
  { key: 'learn_stage_prefix', label: 'Pêşgira Qonaxê' },
  { key: 'learn_win_title', label: 'Sernavê Serkeftinê' },
  { key: 'learn_lose_title', label: 'Sernavê Têkçûnê' },
  { key: 'learn_replay_btn', label: 'Bişkojka Dubarekirinê' },
  { key: 'learn_back_units_btn', label: 'Bişkojka Vegerê' },
  { key: 'learn_sentence_placeholder', label: 'Cihê Avakirina Hevokê' },
  { key: 'learn_check_btn', label: 'Bişkojka Kontrolkirinê' },
  { key: 'learn_next_btn', label: 'Bişkojka Pirsê Din' },
  { key: 'learn_correct_msg', label: 'Peyama Bersiva Rast' },
  { key: 'learn_wrong_prefix', label: 'Pêşgira Bersiva Şaş' },
  { key: 'learn_type_choice', label: 'Cureyê Pirsê: Hilbijartin' },
  { key: 'learn_type_sentence', label: 'Cureyê Pirsê: Hevok' },
  { key: 'learn_type_match', label: 'Cureyê Pirsê: Hevberkirin' },
  { key: 'learn_type_fill', label: 'Cureyê Pirsê: Valahî Dagirtin' },
  { key: 'learn_type_image', label: 'Cureyê Pirsê: Wêne' },
  { key: 'alfabe_game_title', label: 'Sernavê Lîstika ALFABE' },
  { key: 'alfabe_game_desc', label: 'Şiroveya Lîstika ALFABE' },
  { key: 'alfabe_letters_suffix', label: 'Paşgira Hejmara Tîpan' },
  { key: 'alfabe_prev_btn', label: 'Bişkojka Paş' },
  { key: 'alfabe_round_prefix', label: 'Pêşgira Gerê' },
  { key: 'alfabe_next_btn', label: 'Bişkojka Pêş' },
  { key: 'alfabe_words_col', label: 'Stûna Peyvan' },
  { key: 'alfabe_images_col', label: 'Stûna Wêneyan' },
  { key: 'alfabe_match_ok', label: 'Peyama Hevberkirina Rast' },
  { key: 'alfabe_match_err', label: 'Peyama Hevberkirina Şaş' },
  { key: 'alfabe_add_photo_title', label: 'Sernavê Barkirina Wêneyî' },
  { key: 'alfabe_photo_btn', label: 'Bişkojka Wêneyî' },
  { key: 'ferheng_search_placeholder', label: 'Cihê Lêgerîna Ferhengê' },
  { key: 'ferheng_search_btn', label: 'Bişkojka Lêgerînê (Ferheng)' },
  { key: 'ferheng_empty_text', label: 'Nivîsa Vala ya Ferhengê' },
  { key: 'footer_text', label: 'Nivîsa Binê Rûpelê (Footer)' }
];

const UI_TRANSLATIONS = {
  KU: {
    brand_first: 'Kurdi',
    brand_second: 'Klass',
    nav_site: 'Malper',
    nav_learn: 'Hînbûn / Lîstik',
    nav_ferheng: 'Ferheng',
    nav_admin: 'Rêveber',
    hero_badge: 'Platforma Perwerdehiya Kurdî (Kurmancî)',
    hero_title: 'Materyal, Ders, Lîstik û Ferhenga Kurdî li Yek Cihî',
    hero_subtitle:
      'Ji bo xwendekar, mamoste û fêrkerên zimanê Kurdî vîdyo, deng, pirtûk, lîstikên înteraktîf û ferhenga peyvan.',
    search_placeholder: 'Li ders, materyal an pirtûkan bigere...',
    all_categories_label: 'Hemû Beş',
    filter_title: 'Parzûn',
    filter_level_all: 'Hemû Ast',
    filter_media_all: 'Hemû Medya',
    reset_filters_btn: 'Parzûnan Paqij Bike',
    list_all_title: 'Hemû Materyal',
    list_count_suffix: 'materyal',
    loading_text: 'Materyal tên barkirin...',
    empty_title: 'Hîn materyal nehatiye dîtin',
    empty_subtitle:
      'Li gorî parzûnên hilbijartî materyal tune ye an hîn materyal nehatiye zêdekirin.',
    empty_button: 'Biçe Panela Rêveber',
    card_guide_badge: 'Rêbera Mamosteyan',
    meta_level_prefix: 'Ast:',
    meta_grade_prefix: 'Pol:',
    btn_open_material: 'Materyalê Veke',
    tab_content: 'Naverok',
    tab_guide: 'Rêbera Mamosteyan',
    guide_heading: 'Not û Rêbera Mamosteyan',
    guide_empty_text: 'Ji bo vê materyalê hîn notên rêberê nehatine nivîsandin.',
    guide_download_btn: 'PDF-ya Rêberê Daxe',
    learn_title: 'Hînbûn û Lîstikên Ziman',
    learn_subtitle:
      'Bi lîstikên hevberkirin, tîpa pêşîn, bîr û tîpa kêm peyv û tîpên Kurdî fêr bibe.',
    learn_xp_label: 'XP',
    learn_streak_suffix: 'Roj Rêz',
    learn_done_badge: 'Qonax Qediya',
    learn_stage_prefix: 'Qonax',
    learn_win_title: 'Pîroz be! Te qonax bi serkeftî qedand.',
    learn_lose_title: 'Dilên te qediyan — dîsa biceribîne!',
    learn_replay_btn: 'Dîsa Bilîze',
    learn_back_units_btn: 'Vegere Qonaxan',
    learn_sentence_placeholder: 'Peyvan hilbijêre da ku hevokê ava bikî...',
    learn_check_btn: 'Kontrol Bike',
    learn_next_btn: 'Pirsê Din',
    learn_correct_msg: 'Bijî! Bersiva te rast e.',
    learn_wrong_prefix: 'Bersiva rast:',
    learn_type_choice: 'Hilbijartina Pir-Vebijêrk',
    learn_type_sentence: 'Avakirina Hevokê',
    learn_type_match: 'Hevberkirin',
    learn_type_fill: 'Dagirtina Valahiyê',
    learn_type_image: 'Naskirina Wêneyî',
    alfabe_game_title: 'Lîstika Hevberkirina Peyv û Wêneyan (ALFABE)',
    alfabe_game_desc:
      'Peyvekê hilbijêre û piştre wêneyê li gorî wê yekê bitikîne.',
    alfabe_letters_suffix: 'tîp/peyv',
    alfabe_prev_btn: 'Paş',
    alfabe_round_prefix: 'Ger',
    alfabe_next_btn: 'Pêş',
    alfabe_words_col: 'Peyv',
    alfabe_images_col: 'Wêne',
    alfabe_match_ok: 'Rast e! Peyv û wêne li hev hatin.',
    alfabe_match_err: 'Şaş e! Careke din biceribîne.',
    alfabe_add_photo_title: 'Wêneyekî ji komputerê bar bike',
    alfabe_photo_btn: 'Wêne',
    ferheng_search_placeholder: 'Peyvekê bi Kurdî, Tirkî an Îngilîzî binivîse...',
    ferheng_search_btn: 'Bigere',
    ferheng_empty_text: 'Peyvek nehat dîtin.',
    footer_text: 'KurdiKlass — Platforma Perwerdehiya Kurdî'
  }
};

const BUILTIN_DICTIONARY = [
  {
    id: 'b-1',
    word: 'av',
    part_of_speech: 'navdêr',
    meaning_ku: 'Şileya bêreng û bêbêhn a jiyanê',
    meaning_tr: 'su',
    meaning_en: 'water',
    example_sentence: 'Zarok ava sar vexwar.',
    meanings_i18n: {
      KU: 'Şileya bêreng û bêbêhn a jiyanê',
      TR: 'su',
      EN: 'water',
      DE: 'Wasser',
      FR: 'eau',
      IT: 'acqua'
    },
    examples_i18n: {
      KU: 'Zarok ava sar vexwar.'
    }
  },
  {
    id: 'b-2',
    word: 'bijîşk',
    part_of_speech: 'navdêr',
    meaning_ku: 'Kesê ku nexweşiyan derman dike',
    meaning_tr: 'doktor, hekim',
    meaning_en: 'doctor, physician',
    example_sentence: 'Bijîşk li nexweşxaneyê kar dike.',
    meanings_i18n: {
      KU: 'Kesê ku nexweşiyan derman dike',
      TR: 'doktor, hekim',
      EN: 'doctor, physician',
      DE: 'Arzt',
      FR: 'médecin',
      IT: 'medico'
    },
    examples_i18n: {
      KU: 'Bijîşk li nexweşxaneyê kar dike.'
    }
  },
  {
    id: 'b-3',
    word: 'heval',
    part_of_speech: 'navdêr',
    meaning_ku: 'Dost, hevrê, kesê nêzîk',
    meaning_tr: 'arkadaş, dost',
    meaning_en: 'friend',
    example_sentence: 'Hevalên min îro hatin serdana min.',
    meanings_i18n: {
      KU: 'Dost, hevrê, kesê nêzîk',
      TR: 'arkadaş, dost',
      EN: 'friend',
      DE: 'Freund',
      FR: 'ami',
      IT: 'amico'
    },
    examples_i18n: {
      KU: 'Hevalên min îro hatin serdana min.'
    }
  },
  {
    id: 'b-4',
    word: 'pirtûk',
    part_of_speech: 'navdêr',
    meaning_ku: 'Berhema nivîskî ya çapkirî',
    meaning_tr: 'kitap',
    meaning_en: 'book',
    example_sentence: 'Ez her şev pirtûkekê dixwînim.',
    meanings_i18n: {
      KU: 'Berhema nivîskî ya çapkirî',
      TR: 'kitap',
      EN: 'book',
      DE: 'Buch',
      FR: 'livre',
      IT: 'libro'
    },
    examples_i18n: {
      KU: 'Ez her şev pirtûkekê dixwînim.'
    }
  }
];

function normalizeKurdish(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/î/g, 'i')
    .replace(/ê/g, 'e')
    .replace(/û/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/[’ʻʼ']/g, '')
    .trim();
}

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();
  const match = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  if (!match || !match[1]) return null;
  return `https://www.youtube.com/embed/${match[1]}`;
}

function cleanWikitextValue(raw) {
  if (!raw) return '';
  return String(raw)
    .replace(/\{\{[^{}]*\}\}/g, ' ')
    .replace(/\[\[(?:[^|\]]*\|)?([^\]]+)\]\]/g, '$1')
    .replace(/'''?/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchWiktionaryEntry(word, selectedLang = 'KU') {
  const cleanWord = String(word || '').trim();
  if (cleanWord.length < 2) return null;

  const wikiHosts = ['ku.wiktionary.org', 'en.wiktionary.org'];
  for (const host of wikiHosts) {
    try {
      const endpoint = `https://${host}/w/api.php?action=query&prop=revisions&rvprop=content&rvslots=main&format=json&origin=*&titles=${encodeURIComponent(
        cleanWord
      )}`;
      const res = await fetch(endpoint);
      if (!res.ok) continue;
      const data = await res.json();
      const pages = data?.query?.pages || {};
      const page = Object.values(pages)[0];
      if (!page || page.missing !== undefined) continue;

      const wikitext =
        page?.revisions?.[0]?.slots?.main?.['*'] ||
        page?.revisions?.[0]?.['*'] ||
        '';
      if (!wikitext) continue;

      const lines = wikitext
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.startsWith('#') && !l.startsWith('#*') && !l.startsWith('#:'));

      const definitions = lines
        .slice(0, 3)
        .map((line) => cleanWikitextValue(line.replace(/^#+\s*/, '')))
        .filter(Boolean);

      if (definitions.length > 0) {
        const joinedDef = definitions.join(' • ');
        return {
          id: `wiki-${host}-${cleanWord.toLowerCase()}`,
          word: cleanWord,
          part_of_speech: 'wîkîferheng',
          meaning_ku: host.startsWith('ku.') ? joinedDef : '',
          meaning_tr: '',
          meaning_en: host.startsWith('en.') ? joinedDef : '',
          example_sentence: '',
          meanings_i18n: {
            [selectedLang]: joinedDef,
            KU: host.startsWith('ku.') ? joinedDef : '',
            EN: host.startsWith('en.') ? joinedDef : ''
          },
          examples_i18n: {},
          sourceType: 'wiktionary'
        };
      }
    } catch {
      // Sonraki Wiktionary kaynağına geçilir
    }
  }
  return null;
}

export default function App() {
  const [viewMode, setViewMode] = useState('student');
  const [selectedLang, setSelectedLang] = useState(() => {
    try {
      return localStorage.getItem('kk_lang') || 'KU';
    } catch {
      return 'KU';
    }
  });
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const [lessons, setLessons] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [exercises, setExercises] = useState([]);
  const [dictionaryWords, setDictionaryWords] = useState([]);
  const [totalWordCount, setTotalWordCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonTab, setLessonTab] = useState('content');
  const [mediaLoadError, setMediaLoadError] = useState('');
  const [brokenThumbs, setBrokenThumbs] = useState({});
  const [brokenExImages, setBrokenExImages] = useState({});

  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category_slug: 'ders',
    media_type: 'video',
    media_url: '',
    thumbnail_url: '',
    level: 'Destpêk (A1-A2)',
    grade_level: 'Pola 1-4',
    description: '',
    teacher_guide: '',
    guide_pdf_url: ''
  });
  const [uploadingField, setUploadingField] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const [newCatName, setNewCatName] = useState('');
  const [catMsg, setCatMsg] = useState('');

  const [selectedUnit, setSelectedUnit] = useState(null);
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [builtWords, setBuiltWords] = useState([]);
  const [answerState, setAnswerState] = useState(null);
  const [comboCount, setComboCount] = useState(0);
  const [xpPoints, setXpPoints] = useState(() => {
    try {
      return Number(localStorage.getItem('kk_xp') || '0') || 0;
    } catch {
      return 0;
    }
  });
  const [streakDays, setStreakDays] = useState(() => {
    try {
      return Number(localStorage.getItem('kk_streak') || '0') || 0;
    } catch {
      return 0;
    }
  });
  const [hearts, setHearts] = useState(5);
  const [unitCompleted, setUnitCompleted] = useState(false);
  const [completedUnits, setCompletedUnits] = useState(() => {
    try {
      const raw = localStorage.getItem('kk_completed_units');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioPlayerRef = useRef(null);

  const [modalEditingGame, setModalEditingGame] = useState(null);
  const [editingExId, setEditingExId] = useState(null);
  const [exForm, setExForm] = useState({
    unit_title: '',
    exercise_type: 'choice',
    question_text: '',
    options_raw: '',
    correct_answer: '',
    explanation: '',
    image_url: '',
    audio_url: ''
  });
  const [uploadingExImg, setUploadingExImg] = useState(false);
  const [uploadingExAudio, setUploadingExAudio] = useState(false);
  const [exMsg, setExMsg] = useState('');
  const [gamesReset, setGamesReset] = useState(false);
  const [adminExUnitFilter, setAdminExUnitFilter] = useState('all');
  const [adminExSearch, setAdminExSearch] = useState('');

  const [alfabeWords, setAlfabeWords] = useState(() => {
    try {
      const ver = localStorage.getItem('kk_alfabe_version');
      const saved = localStorage.getItem('kk_alfabe_words');
      if (ver === ALFABE_STORAGE_VERSION && saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return ALFABE_DEFAULT_WORDS;
  });
  const [alfabeEditMsg, setAlfabeEditMsg] = useState('');

  const [alfabeRoundForm, setAlfabeRoundForm] = useState({
    roundTitle: '',
    wordsText: ''
  });
  const [alfabeRoundFiles, setAlfabeRoundFiles] = useState([]);
  const [uploadingAlfabeRound, setUploadingAlfabeRound] = useState(false);

  const [inlinePhotoSaving, setInlinePhotoSaving] = useState(false);
  const inlinePhotoTargetRef = useRef(null);
  const inlinePhotoInputRef = useRef(null);

  const [ferhengQuery, setFerhengQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('all');
  const [selectedWordDetail, setSelectedWordDetail] = useState(null);
  const [wiktionaryResults, setWiktionaryResults] = useState([]);
  const [searchingDict, setSearchingDict] = useState(false);
  const [favoriteWords, setFavoriteWords] = useState(() => {
    try {
      const saved = localStorage.getItem('kk_fav_words');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('kk_search_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [editingWordId, setEditingWordId] = useState(null);
  const [wordForm, setWordForm] = useState({
    word: '',
    part_of_speech: 'navdêr',
    meaning_tr: '',
    meaning_en: '',
    meaning_ku: '',
    example_sentence: '',
    audio_url: '',
    meanings_i18n: {
      KU: '',
      ZZA: '',
      CKB: '',
      TR: '',
      EN: '',
      DE: '',
      FR: '',
      IT: ''
    },
    examples_i18n: {}
  });
  const [uploadingWordAudio, setUploadingWordAudio] = useState(false);
  const [wordMsg, setWordMsg] = useState('');
  const [syncingProgress, setSyncingProgress] = useState('');

  const [rawUi, setRawUi] = useState(() => {
    try {
      const saved = localStorage.getItem('kk_ui_texts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [settingsMsg, setSettingsMsg] = useState('');

  const langDropdownRef = useRef(null);

  const ui = {
    ...(UI_TRANSLATIONS[selectedLang] || UI_TRANSLATIONS.KU),
    ...(rawUi || {})
  };

  const dynamicMediaTypes = DEFAULT_MEDIA_TYPES;
  const dynamicLevels = DEFAULT_LEVELS;
  const dynamicGrades = DEFAULT_GRADES;

  const kurdishAlphabet = KURDISH_LETTERS_POOL;

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [lessonsRes, exercisesRes, dictRes, countRes, settingsRes] =
        await Promise.all([
          supabase.from('lessons').select('*').order('id', { ascending: false }),
          supabase
            .from('kurmanci_exercises')
            .select('*')
            .order('id', { ascending: true }),
          supabase
            .from('dictionary')
            .select('*')
            .order('word', { ascending: true })
            .limit(300),
          supabase
            .from('dictionary')
            .select('*', { count: 'exact', head: true }),
          supabase.from('site_settings').select('*')
        ]);

      if (!lessonsRes.error && Array.isArray(lessonsRes.data)) {
        setLessons(lessonsRes.data);
      }
      if (!exercisesRes.error && Array.isArray(exercisesRes.data)) {
        setExercises(exercisesRes.data);
      }
      if (!dictRes.error && Array.isArray(dictRes.data)) {
        setDictionaryWords(dictRes.data);
      }
      if (!countRes.error && typeof countRes.count === 'number') {
        setTotalWordCount(countRes.count);
      }

      if (!settingsRes.error && Array.isArray(settingsRes.data)) {
        const map = {};
        settingsRes.data.forEach((row) => {
          if (row?.key) map[row.key] = row.value;
        });

        if (map.categories_json) {
          try {
            const parsedCats = JSON.parse(map.categories_json);
            if (Array.isArray(parsedCats) && parsedCats.length > 0) {
              setCategories(parsedCats);
            }
          } catch {}
        }

        if (map.ui_texts_json) {
          try {
            const parsedUi = JSON.parse(map.ui_texts_json);
            if (parsedUi && typeof parsedUi === 'object') {
              setRawUi((prev) => ({ ...prev, ...parsedUi }));
            }
          } catch {}
        }

        if (map.alfabe_words_json) {
          try {
            const parsedWords = JSON.parse(map.alfabe_words_json);
            if (Array.isArray(parsedWords) && parsedWords.length > 0) {
              setAlfabeWords(parsedWords);
              localStorage.setItem('kk_alfabe_version', ALFABE_STORAGE_VERSION);
              localStorage.setItem('kk_alfabe_words', JSON.stringify(parsedWords));
            }
          } catch {}
        }

        if (map.xp_points !== undefined) {
          const xpVal = Number(map.xp_points) || 0;
          setXpPoints(xpVal);
          localStorage.setItem('kk_xp', String(xpVal));
        }

        if (map.streak_days !== undefined) {
          const stVal = Number(map.streak_days) || 0;
          setStreakDays(stVal);
          localStorage.setItem('kk_streak', String(stVal));
        }

        if (map.completed_units_json) {
          try {
            const cuVal = JSON.parse(map.completed_units_json);
            if (Array.isArray(cuVal)) {
              setCompletedUnits(cuVal);
              localStorage.setItem('kk_completed_units', JSON.stringify(cuVal));
            }
          } catch {}
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('kk_lang', selectedLang);
    } catch {}
  }, [selectedLang]);

  useEffect(() => {
    try {
      localStorage.setItem('kk_xp', String(xpPoints));
    } catch {}
  }, [xpPoints]);

  useEffect(() => {
    try {
      localStorage.setItem('kk_streak', String(streakDays));
    } catch {}
  }, [streakDays]);

  useEffect(() => {
    try {
      localStorage.setItem('kk_completed_units', JSON.stringify(completedUnits));
    } catch {}
  }, [completedUnits]);

  useEffect(() => {
    try {
      localStorage.setItem('kk_fav_words', JSON.stringify(favoriteWords));
    } catch {}
  }, [favoriteWords]);

  useEffect(() => {
    try {
      localStorage.setItem('kk_search_history', JSON.stringify(searchHistory));
    } catch {}
  }, [searchHistory]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveLesson(null);
        setSelectedWordDetail(null);
        setModalEditingGame(null);
        setLangMenuOpen(false);
      }
    };
    const handleClickOutside = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const uploadImageToBucket = async (file, folder = 'general') => {
    const ext = (file.name.split('.').pop() || 'png').toLowerCase();
    const safeName = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)}.${ext}`;
    const { error } = await supabase.storage
      .from('materyal')
      .upload(safeName, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('materyal').getPublicUrl(safeName);
    return data?.publicUrl || '';
  };

  const handleInlineAlfabeFieldChange = (id, field, value) => {
    setAlfabeWords((prev) =>
      prev.map((w) => (w.id === id ? { ...w, [field]: value } : w))
    );
  };

  const handleSaveAllAlfabeWords = async () => {
    try {
      localStorage.setItem('kk_alfabe_version', ALFABE_STORAGE_VERSION);
      localStorage.setItem('kk_alfabe_words', JSON.stringify(alfabeWords));
      await supabase
        .from('site_settings')
        .upsert(
          [{ key: 'alfabe_words_json', value: JSON.stringify(alfabeWords) }],
          { onConflict: 'key' }
        );
      setAlfabeEditMsg('Hemû tîp û peyvên ALFABE hatin tomarkirin.');
      setTimeout(() => setAlfabeEditMsg(''), 3000);
    } catch (err) {
      setAlfabeEditMsg('Çewtî: ' + err.message);
    }
  };

  const handleResetAlfabeDefaultWords = async () => {
    setAlfabeWords(ALFABE_DEFAULT_WORDS);
    try {
      localStorage.setItem('kk_alfabe_version', ALFABE_STORAGE_VERSION);
      localStorage.setItem(
        'kk_alfabe_words',
        JSON.stringify(ALFABE_DEFAULT_WORDS)
      );
      await supabase
        .from('site_settings')
        .upsert(
          [
            {
              key: 'alfabe_words_json',
              value: JSON.stringify(ALFABE_DEFAULT_WORDS)
            }
          ],
          { onConflict: 'key' }
        );
      setAlfabeEditMsg('Lîsteya standard a ALFABE hat vegerandin.');
      setTimeout(() => setAlfabeEditMsg(''), 3000);
    } catch (err) {
      setAlfabeEditMsg('Çewtî: ' + err.message);
    }
  };

  const handleAlfabeRoundFilesChange = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 4);
    setAlfabeRoundFiles(files);
  };

  const handleCreateAlfabeRound = async (e) => {
    e.preventDefault();
    const rawWords = alfabeRoundForm.wordsText
      .split(/[\n,]+/)
      .map((w) => w.trim())
      .filter(Boolean)
      .slice(0, 4);

    if (rawWords.length === 0) {
      setExMsg('Ji kerema xwe herî kêm peyvekê binivîse.');
      return;
    }

    setUploadingAlfabeRound(true);
    setExMsg('');
    try {
      const uploadedUrls = [];
      for (let i = 0; i < rawWords.length; i++) {
        const file = alfabeRoundFiles[i];
        if (file) {
          const url = await uploadImageToBucket(file, 'alfabe-rounds');
          uploadedUrls.push(url);
        } else {
          uploadedUrls.push('');
        }
      }

      const roundTitle =
        alfabeRoundForm.roundTitle.trim() ||
        `Lîstika 4 Peyv û 4 Wêneyan #${exercises.length + 1}`;

      const optionsEncoded = rawWords.map(
        (w, idx) => `${w}=${uploadedUrls[idx] || ''}`
      );

      const payload = {
        unit_title: roundTitle,
        exercise_type: 'match',
        question_text: `${roundTitle}: Peyv û wêneyan li hev bîne`,
        options: optionsEncoded,
        correct_answer: rawWords.join(', '),
        explanation: 'Her peyvekê bi wêneyê wê yê lihevhatî re hevber bike.',
        image_url: uploadedUrls[0] || '',
        audio_url: ''
      };

      const { error } = await supabase
        .from('kurmanci_exercises')
        .insert([payload]);
      if (error) throw error;

      setAlfabeRoundForm({ roundTitle: '', wordsText: '' });
      setAlfabeRoundFiles([]);
      setGamesReset(false);
      setExMsg(
        'Lîstika nû ya 4 peyv û 4 wêneyan hat zêdekirin û di Admin panelê de çalak bû.'
      );
      await fetchAllData();
    } catch (err) {
      setExMsg('Çewtî: ' + err.message);
    } finally {
      setUploadingAlfabeRound(false);
    }
  };

  const handleTriggerInlinePhotoUpload = (e, target) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    inlinePhotoTargetRef.current = target;
    if (inlinePhotoInputRef.current) {
      inlinePhotoInputRef.current.value = '';
      inlinePhotoInputRef.current.click();
    }
  };

  const handleInlinePhotoFileSelected = async (e) => {
    const file = e.target.files?.[0];
    const target = inlinePhotoTargetRef.current;
    if (!file || !target) return;

    setInlinePhotoSaving(true);
    try {
      const publicUrl = await uploadImageToBucket(file, 'inline-photos');
      if (!publicUrl) return;

      if (target.mode === 'lesson' && target.lessonId) {
        const { error } = await supabase
          .from('lessons')
          .update({ thumbnail_url: publicUrl })
          .eq('id', target.lessonId);
        if (error) throw error;
        setLessons((prev) =>
          prev.map((l) =>
            l.id === target.lessonId ? { ...l, thumbnail_url: publicUrl } : l
          )
        );
      } else if (target.mode === 'alfabe_word' && target.wordItem) {
        const updatedList = alfabeWords.map((w) =>
          w.id === target.wordItem.id ? { ...w, image_url: publicUrl } : w
        );
        setAlfabeWords(updatedList);
        localStorage.setItem('kk_alfabe_version', ALFABE_STORAGE_VERSION);
        localStorage.setItem('kk_alfabe_words', JSON.stringify(updatedList));
        await supabase
          .from('site_settings')
          .upsert(
            [{ key: 'alfabe_words_json', value: JSON.stringify(updatedList) }],
            { onConflict: 'key' }
          );
      } else if (target.mode === 'question' && target.exerciseId) {
        const targetEx = exercises.find((ex) => ex.id === target.exerciseId);
        let nextOptions = Array.isArray(targetEx?.options)
          ? [...targetEx.options]
          : [];
        if (target.wordItem?.word && nextOptions.length > 0) {
          nextOptions = nextOptions.map((optStr) => {
            const [wPart] = String(optStr).split('=');
            if ((wPart || '').trim() === target.wordItem.word.trim()) {
              return `${wPart.trim()}=${publicUrl}`;
            }
            return optStr;
          });
        }
        const { error } = await supabase
          .from('kurmanci_exercises')
          .update({
            image_url: publicUrl,
            ...(nextOptions.length > 0 ? { options: nextOptions } : {})
          })
          .eq('id', target.exerciseId);
        if (error) throw error;
        await fetchAllData();
      }
    } catch (err) {
      setExMsg('Barkirina wêneyî bi ser neket: ' + err.message);
    } finally {
      setInlinePhotoSaving(false);
      inlinePhotoTargetRef.current = null;
    }
  };
  const handleSelectLanguage = (code) => {
    setSelectedLang(code);
    setLangMenuOpen(false);
  };

  const getCategoryName = (slug) => {
    const found = categories.find((c) => c.slug === slug);
    return found ? found.name : slug;
  };

  const handleOpenLesson = (lesson) => {
    setActiveLesson(lesson);
    setLessonTab('content');
    setMediaLoadError('');
  };

  const renderLessonMediaViewer = (lesson) => {
    const url = (lesson.media_url || '').trim();
    if (!url) {
      return (
        <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600">
          Ji bo vê materyalê hîn lînka medyayê nehatiye zêdekirin.
        </div>
      );
    }

    const ytEmbed = getYouTubeEmbedUrl(url);
    if (ytEmbed) {
      return (
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
          <iframe
            src={ytEmbed}
            title={lesson.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    if (lesson.media_type === 'video' || /\.(mp4|webm|ogg)(\?|$)/i.test(url)) {
      return (
        <div className="space-y-2">
          <video
            src={url}
            controls
            onError={() => setMediaLoadError('Vîdyo nehat vekirin.')}
            className="w-full max-h-[460px] rounded-xl bg-black"
          />
          {mediaLoadError && (
            <p className="text-xs text-red-600 font-semibold">{mediaLoadError}</p>
          )}
        </div>
      );
    }

    if (lesson.media_type === 'audio' || /\.(mp3|wav|ogg|m4a)(\?|$)/i.test(url)) {
      return (
        <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <audio
            src={url}
            controls
            onError={() => setMediaLoadError('Pelê dengî nehat vekirin.')}
            className="w-full"
          />
          {mediaLoadError && (
            <p className="text-xs text-red-600 font-semibold">{mediaLoadError}</p>
          )}
        </div>
      );
    }

    if (/\.pdf(\?|$)/i.test(url)) {
      return (
        <div className="space-y-3">
          <iframe
            src={url}
            title={lesson.title}
            className="w-full h-[480px] rounded-xl border"
          />
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Di pencereya nû de veke</span>
          </a>
        </div>
      );
    }

    return (
      <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 flex-wrap">
        <span className="text-sm text-slate-700 break-all">{url}</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-700 text-white text-xs font-bold"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>{ui.btn_open_material}</span>
        </a>
      </div>
    );
  };

  const filteredLessons = lessons.filter((item) => {
    const matchesCat =
      selectedCategory === 'all' || item.category_slug === selectedCategory;
    const matchesLvl = selectedLevel === 'all' || item.level === selectedLevel;
    const matchesMedia =
      selectedMedia === 'all' || item.media_type === selectedMedia;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.grade_level && item.grade_level.toLowerCase().includes(q));
    return matchesCat && matchesLvl && matchesMedia && matchesSearch;
  });

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedLevel !== 'all' ||
    selectedMedia !== 'all' ||
    searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSelectedMedia('all');
    setSearchQuery('');
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (passwordInput.trim() === ADMIN_PASSCODE) {
      setIsAdmin(true);
      setAuthError('');
      setPasswordInput('');
    } else {
      setAuthError('Şîfre şaş e! Ji kerema xwe dîsa biceribîne.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setEditingId(null);
    setEditingExId(null);
    setEditingWordId(null);
    setModalEditingGame(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category_slug: categories[0]?.slug || 'ders',
      media_type: dynamicMediaTypes[0]?.id || 'video',
      media_url: '',
      thumbnail_url: '',
      level: dynamicLevels[0] || 'Destpêk (A1-A2)',
      grade_level: dynamicGrades[0] || 'Pola 1-4',
      description: '',
      teacher_guide: '',
      guide_pdf_url: ''
    });
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(fieldName);
    setStatusMsg({ type: '', text: '' });
    try {
      const publicUrl = await uploadImageToBucket(file, 'lessons');
      if (publicUrl) {
        setFormData((prev) => ({ ...prev, [fieldName]: publicUrl }));
        setStatusMsg({ type: 'success', text: 'Pel bi serkeftî hat barkirin.' });
      }
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: 'Barkirina pelê bi ser neket: ' + err.message
      });
    } finally {
      setUploadingField(null);
    }
  };

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });
    try {
      if (editingId) {
        const { error } = await supabase
          .from('lessons')
          .update(formData)
          .eq('id', editingId);
        if (error) throw error;
        setStatusMsg({ type: 'success', text: 'Materyal bi serkeftî hat nûkirin.' });
      } else {
        const { error } = await supabase.from('lessons').insert([formData]);
        if (error) throw error;
        setStatusMsg({ type: 'success', text: 'Materyala nû hat tomarkirin.' });
      }
      resetForm();
      await fetchAllData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Çewtî çêbû: ' + err.message });
    }
  };

  const startEditing = (lesson) => {
    setEditingId(lesson.id);
    setFormData({
      title: lesson.title || '',
      category_slug: lesson.category_slug || 'ders',
      media_type: lesson.media_type || 'video',
      media_url: lesson.media_url || '',
      thumbnail_url: lesson.thumbnail_url || '',
      level: lesson.level || 'Destpêk (A1-A2)',
      grade_level: lesson.grade_level || 'Pola 1-4',
      description: lesson.description || '',
      teacher_guide: lesson.teacher_guide || '',
      guide_pdf_url: lesson.guide_pdf_url || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteLesson = async (id) => {
    try {
      const { error } = await supabase.from('lessons').delete().eq('id', id);
      if (error) throw error;
      setLessons((prev) => prev.filter((item) => item.id !== id));
      setStatusMsg({ type: 'success', text: 'Materyal hat jêbirin.' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Jêbirin bi ser neket: ' + err.message });
    }
  };

  const handleUpdateCategoryName = (slug, newName) => {
    setCategories((prev) =>
      prev.map((c) => (c.slug === slug ? { ...c, name: newName } : c))
    );
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const clean = newCatName.trim();
    if (!clean) return;
    const slug =
      normalizeKurdish(clean)
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || `bes-${Date.now()}`;
    if (categories.some((c) => c.slug === slug)) return;
    setCategories((prev) => [...prev, { slug, name: clean }]);
    setNewCatName('');
  };

  const handleDeleteCategory = (slug) => {
    setCategories((prev) => prev.filter((c) => c.slug !== slug));
  };

  const handleSaveCategories = async () => {
    try {
      await supabase
        .from('site_settings')
        .upsert([{ key: 'categories_json', value: JSON.stringify(categories) }], {
          onConflict: 'key'
        });
      setCatMsg('Beş hatin tomarkirin.');
      setTimeout(() => setCatMsg(''), 3000);
    } catch (err) {
      setCatMsg('Çewtî: ' + err.message);
    }
  };

  const effectiveExercises = gamesReset ? [] : exercises;
  const exerciseUnits = [
    ...new Set(effectiveExercises.map((ex) => ex.unit_title).filter(Boolean))
  ];
  const unitExercises = selectedUnit
    ? effectiveExercises.filter((ex) => ex.unit_title === selectedUnit)
    : [];
  const currentExercise = unitExercises[currentExIndex] || null;

  const stopAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      audioPlayerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  const playCurrentAudio = (url) => {
    stopAudio();
    if (!url) return;
    const audio = new Audio(url);
    audioPlayerRef.current = audio;
    setIsPlayingAudio(true);
    audio.onended = () => setIsPlayingAudio(false);
    audio.onerror = () => setIsPlayingAudio(false);
    audio.play().catch(() => setIsPlayingAudio(false));
  };

  const startUnit = (unitTitle) => {
    stopAudio();
    setSelectedUnit(unitTitle);
    setCurrentExIndex(0);
    setSelectedOption('');
    setBuiltWords([]);
    setAnswerState(null);
    setComboCount(0);
    setHearts(5);
    setUnitCompleted(false);
  };

  const exitUnit = () => {
    stopAudio();
    const wasZarok =
      selectedUnit && selectedUnit.toUpperCase().startsWith('ZAROK:');
    setSelectedUnit(null);
    setCurrentExIndex(0);
    setSelectedOption('');
    setBuiltWords([]);
    setAnswerState(null);
    setUnitCompleted(false);
    if (wasZarok) {
      setViewMode('student');
      setSelectedCategory('zarok');
    }
  };

  const handleToggleWordToken = (token) => {
    setBuiltWords((prev) => [...prev, token]);
  };

  const handleRemoveBuiltWord = (idx) => {
    setBuiltWords((prev) => prev.filter((_, i) => i !== idx));
  };

  const persistProgress = async (nextXp, nextStreak, nextUnits) => {
    try {
      await supabase.from('site_settings').upsert(
        [
          { key: 'xp_points', value: String(nextXp) },
          { key: 'streak_days', value: String(nextStreak) },
          { key: 'completed_units_json', value: JSON.stringify(nextUnits) }
        ],
        { onConflict: 'key' }
      );
    } catch {}
  };

  const handleCheckAnswer = () => {
    if (!currentExercise) return;
    let candidate = '';
    if (currentExercise.exercise_type === 'sentence') {
      candidate = builtWords.join(' ').trim();
    } else {
      candidate = selectedOption.trim();
    }
    const isRight =
      currentExercise.exercise_type === 'match' ||
      candidate.toLowerCase() ===
        String(currentExercise.correct_answer || '').trim().toLowerCase();

    if (isRight) {
      const nextCombo = comboCount + 1;
      const earned = 15 + Math.min(nextCombo * 2, 10);
      const nextXp = xpPoints + earned;
      setComboCount(nextCombo);
      setXpPoints(nextXp);
      setAnswerState({
        correct: true,
        message: `${ui.learn_correct_msg} (+${earned} XP)`
      });
      persistProgress(nextXp, streakDays, completedUnits);
    } else {
      const nextHearts = Math.max(0, hearts - 1);
      setComboCount(0);
      setHearts(nextHearts);
      setAnswerState({
        correct: false,
        message: `${ui.learn_wrong_prefix} ${currentExercise.correct_answer}`
      });
    }
  };

  const handleNextExercise = () => {
    stopAudio();
    setAnswerState(null);
    setSelectedOption('');
    setBuiltWords([]);
    if (hearts <= 0) {
      setUnitCompleted(true);
      return;
    }
    if (currentExIndex + 1 < unitExercises.length) {
      setCurrentExIndex((i) => i + 1);
    } else {
      const nextUnits =
        selectedUnit && !completedUnits.includes(selectedUnit)
          ? [...completedUnits, selectedUnit]
          : completedUnits;
      const nextStreak = streakDays + 1;
      setCompletedUnits(nextUnits);
      setStreakDays(nextStreak);
      setUnitCompleted(true);
      persistProgress(xpPoints, nextStreak, nextUnits);
    }
  };

  const resetExForm = () => {
    setEditingExId(null);
    setExForm({
      unit_title: '',
      exercise_type: 'choice',
      question_text: '',
      options_raw: '',
      correct_answer: '',
      explanation: '',
      image_url: '',
      audio_url: ''
    });
  };

  const handleExImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingExImg(true);
    try {
      const publicUrl = await uploadImageToBucket(file, 'exercises');
      if (publicUrl) setExForm((prev) => ({ ...prev, image_url: publicUrl }));
    } catch (err) {
      setExMsg('Wêne nehat barkirin: ' + err.message);
    } finally {
      setUploadingExImg(false);
    }
  };

  const handleExAudioUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingExAudio(true);
    try {
      const ext = file.name.split('.').pop() || 'mp3';
      const path = `exercises/aud-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from('materyal')
        .upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from('materyal').getPublicUrl(path);
      if (data?.publicUrl) setExForm((prev) => ({ ...prev, audio_url: data.publicUrl }));
    } catch (err) {
      setExMsg('Deng nehat barkirin: ' + err.message);
    } finally {
      setUploadingExAudio(false);
    }
  };

  const handleSaveExercise = async (e) => {
    e.preventDefault();
    const optionsArray = exForm.options_raw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      unit_title: exForm.unit_title.trim(),
      exercise_type: exForm.exercise_type,
      question_text: exForm.question_text.trim(),
      options: optionsArray,
      correct_answer: exForm.correct_answer.trim(),
      explanation: exForm.explanation.trim(),
      image_url: exForm.image_url.trim(),
      audio_url: exForm.audio_url.trim()
    };
    try {
      if (editingExId) {
        const { error } = await supabase
          .from('kurmanci_exercises')
          .update(payload)
          .eq('id', editingExId);
        if (error) throw error;
        setExMsg('Lîstik / pirs bi serkeftî hat nûkirin.');
      } else {
        const { error } = await supabase
          .from('kurmanci_exercises')
          .insert([payload]);
        if (error) throw error;
        setExMsg('Lîstik / pirs bi serkeftî hat zêdekirin.');
      }
      setGamesReset(false);
      resetExForm();
      await fetchAllData();
    } catch (err) {
      setExMsg('Çewtî: ' + err.message);
    }
  };

  const startEditingExercise = (ex) => {
    setEditingExId(ex.id);
    setExForm({
      unit_title: ex.unit_title || '',
      exercise_type: ex.exercise_type || 'choice',
      question_text: ex.question_text || '',
      options_raw: Array.isArray(ex.options) ? ex.options.join('\n') : '',
      correct_answer: ex.correct_answer || '',
      explanation: ex.explanation || '',
      image_url: ex.image_url || '',
      audio_url: ex.audio_url || ''
    });
  };

  const handleEditGameInAdmin = (ex) => {
    if (!ex || !isAdmin) return;
    setModalEditingGame(ex);
    startEditingExercise(ex);
  };

  const handleDeleteExercise = async (id) => {
    try {
      const { error } = await supabase
        .from('kurmanci_exercises')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setExercises((prev) => prev.filter((item) => item.id !== id));
      if (editingExId === id) resetExForm();
      if (modalEditingGame?.id === id) setModalEditingGame(null);
      setExMsg('Lîstik / pirs hat jêbirin.');
    } catch (err) {
      setExMsg('Jêbirin bi ser neket: ' + err.message);
    }
  };

  const handleResetAllGames = async () => {
    try {
      await supabase.from('kurmanci_exercises').delete().neq('id', 0);
      setExercises([]);
      setGamesReset(true);
      setSelectedUnit(null);
      setModalEditingGame(null);
      setXpPoints(0);
      setStreakDays(0);
      setCompletedUnits([]);
      localStorage.setItem('kk_xp', '0');
      localStorage.setItem('kk_streak', '0');
      localStorage.setItem('kk_completed_units', '[]');
      await persistProgress(0, 0, []);
      setExMsg('Hemû lîstik û pêşketin hatin sifirkirin.');
    } catch (err) {
      setExMsg('Sifirkirin bi ser neket: ' + err.message);
    }
  };

  const getWordMeaningByLang = (item, lang = 'KU') => {
    if (!item) return '';
    if (item.meanings_i18n && item.meanings_i18n[lang]) {
      return item.meanings_i18n[lang];
    }
    if (lang === 'TR') return item.meaning_tr || item.meaning_en || item.meaning_ku || '';
    if (lang === 'EN') return item.meaning_en || item.meaning_tr || item.meaning_ku || '';
    if (lang === 'KU') return item.meaning_ku || item.meaning_tr || item.meaning_en || '';
    return (
      item.meaning_tr ||
      item.meaning_en ||
      item.meaning_ku ||
      (item.meanings_i18n ? Object.values(item.meanings_i18n).find(Boolean) : '') ||
      ''
    );
  };

  const getWordExampleByLang = (item, lang = 'KU') => {
    if (!item) return '';
    if (item.examples_i18n && item.examples_i18n[lang]) {
      return item.examples_i18n[lang];
    }
    return item.example_sentence || '';
  };

  const combinedDictionary = (() => {
    const map = new Map();
    BUILTIN_DICTIONARY.forEach((b) => {
      map.set(normalizeKurdish(b.word), {
        ...b,
        sourceType: b.sourceType || 'builtin'
      });
    });
    dictionaryWords.forEach((d) => {
      const key = normalizeKurdish(d.word);
      const prev = map.get(key) || {};
      map.set(key, {
        ...prev,
        ...d,
        meanings_i18n: {
          ...(prev.meanings_i18n || {}),
          ...(d.meanings_i18n || {})
        },
        examples_i18n: {
          ...(prev.examples_i18n || {}),
          ...(d.examples_i18n || {})
        },
        sourceType: 'db'
      });
    });
    wiktionaryResults.forEach((w) => {
      const key = normalizeKurdish(w.word);
      if (!map.has(key)) {
        map.set(key, { ...w, sourceType: 'wiktionary' });
      }
    });
    return Array.from(map.values()).sort((a, b) =>
      String(a.word || '').localeCompare(String(b.word || ''), 'ku')
    );
  })();

  const filteredDictionary = combinedDictionary.filter((item) => {
    const q = normalizeKurdish(ferhengQuery);
    if (q) {
      const wordMatch = normalizeKurdish(item.word || '').includes(q);
      const meaningAll = [
        item.meaning_tr,
        item.meaning_en,
        item.meaning_ku,
        ...Object.values(item.meanings_i18n || {})
      ]
        .filter(Boolean)
        .join(' ');
      const meaningMatch = normalizeKurdish(meaningAll).includes(q);
      return wordMatch || meaningMatch;
    }
    if (selectedLetter && selectedLetter !== 'all') {
      const firstChar = normalizeKurdish((item.word || '').trim().charAt(0));
      return firstChar === normalizeKurdish(selectedLetter);
    }
    return true;
  });

  useEffect(() => {
    const trimmed = ferhengQuery.trim();
    if (!trimmed || trimmed.length < 2) {
      setWiktionaryResults([]);
      setSearchingDict(false);
      return;
    }

    let cancelled = false;
    setSearchingDict(true);
    const timer = setTimeout(async () => {
      try {
        const entry = await fetchWiktionaryEntry(trimmed, selectedLang);
        if (!cancelled) {
          setWiktionaryResults(entry ? [entry] : []);
        }
      } catch {
        if (!cancelled) setWiktionaryResults([]);
      } finally {
        if (!cancelled) setSearchingDict(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [ferhengQuery, selectedLang]);

  const handleDictionarySearchSubmit = async (e) => {
    e.preventDefault();
    const clean = ferhengQuery.trim();
    if (!clean) return;
    setSearchHistory((prev) => [clean, ...prev.filter((t) => t !== clean)].slice(0, 8));
    setSearchingDict(true);
    try {
      const entry = await fetchWiktionaryEntry(clean, selectedLang);
      if (entry) {
        setWiktionaryResults((prev) => {
          const filtered = prev.filter(
            (item) => normalizeKurdish(item.word) !== normalizeKurdish(entry.word)
          );
          return [entry, ...filtered];
        });
      }
    } finally {
      setSearchingDict(false);
    }
  };

  const toggleFavoriteWord = (word) => {
    setFavoriteWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [word, ...prev]
    );
  };

  const playDictionaryPronunciation = (item) => {
    stopAudio();
    if (item?.audio_url) {
      const audio = new Audio(item.audio_url);
      audioPlayerRef.current = audio;
      audio.play().catch(() => {});
      return;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && item?.word) {
      const utter = new SpeechSynthesisUtterance(item.word);
      utter.lang = 'ku';
      window.speechSynthesis.speak(utter);
    }
  };

  const resetWordForm = () => {
    setEditingWordId(null);
    setWordForm({
      word: '',
      part_of_speech: 'navdêr',
      meaning_tr: '',
      meaning_en: '',
      meaning_ku: '',
      example_sentence: '',
      audio_url: '',
      meanings_i18n: {
        KU: '',
        ZZA: '',
        CKB: '',
        TR: '',
        EN: '',
        DE: '',
        FR: '',
        IT: ''
      },
      examples_i18n: {}
    });
  };

  const handleWordAudioUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingWordAudio(true);
    try {
      const ext = file.name.split('.').pop() || 'mp3';
      const path = `dictionary/aud-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from('materyal')
        .upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from('materyal').getPublicUrl(path);
      if (data?.publicUrl) setWordForm((prev) => ({ ...prev, audio_url: data.publicUrl }));
    } catch (err) {
      setWordMsg('Deng nehat barkirin: ' + err.message);
    } finally {
      setUploadingWordAudio(false);
    }
  };

  const handleSaveWord = async (e) => {
    e.preventDefault();
    const activeMeaning =
      wordForm.meanings_i18n?.[selectedLang] ||
      wordForm.meaning_tr ||
      wordForm.meaning_en ||
      wordForm.meaning_ku ||
      '';
    const payload = {
      word: wordForm.word.trim(),
      part_of_speech: wordForm.part_of_speech.trim() || 'navdêr',
      meaning_tr: wordForm.meanings_i18n?.TR || wordForm.meaning_tr || activeMeaning,
      meaning_en: wordForm.meanings_i18n?.EN || wordForm.meaning_en || activeMeaning,
      meaning_ku: wordForm.meanings_i18n?.KU || wordForm.meaning_ku || activeMeaning,
      example_sentence:
        wordForm.examples_i18n?.[selectedLang] || wordForm.example_sentence || '',
      audio_url: wordForm.audio_url || '',
      meanings_i18n: {
        ...(wordForm.meanings_i18n || {}),
        [selectedLang]: activeMeaning
      },
      examples_i18n: wordForm.examples_i18n || {}
    };
    try {
      if (editingWordId) {
        const { error } = await supabase
          .from('dictionary')
          .update(payload)
          .eq('id', editingWordId);
        if (error) throw error;
        setWordMsg('Peyv hat nûkirin.');
      } else {
        const { error } = await supabase.from('dictionary').insert([payload]);
        if (error) throw error;
        setWordMsg('Peyv hat zêdekirin.');
      }
      resetWordForm();
      await fetchAllData();
    } catch (err) {
      setWordMsg('Çewtî: ' + err.message);
    }
  };

  const startEditingWord = (wItem) => {
    setEditingWordId(wItem.id);
    setWordForm({
      word: wItem.word || '',
      part_of_speech: wItem.part_of_speech || 'navdêr',
      meaning_tr: wItem.meaning_tr || '',
      meaning_en: wItem.meaning_en || '',
      meaning_ku: wItem.meaning_ku || '',
      example_sentence: wItem.example_sentence || '',
      audio_url: wItem.audio_url || '',
      meanings_i18n: {
        KU: wItem.meaning_ku || '',
        ZZA: '',
        CKB: '',
        TR: wItem.meaning_tr || '',
        EN: wItem.meaning_en || '',
        DE: '',
        FR: '',
        IT: '',
        ...(wItem.meanings_i18n || {})
      },
      examples_i18n: wItem.examples_i18n || {}
    });
  };

  const handleDeleteWord = async (id) => {
    try {
      const { error } = await supabase.from('dictionary').delete().eq('id', id);
      if (error) throw error;
      setDictionaryWords((prev) => prev.filter((w) => w.id !== id));
      setWordMsg('Peyv hat jêbirin.');
    } catch (err) {
      setWordMsg('Jêbirin bi ser neket: ' + err.message);
    }
  };

  const handleBulkImportDictionary = async () => {
    setSyncingProgress('Peyvên bingehîn tên barkirin...');
    try {
      const rows = BUILTIN_DICTIONARY.map(({ id, sourceType, ...rest }) => rest);
      const { error } = await supabase.from('dictionary').insert(rows);
      if (error) throw error;
      setWordMsg(`${rows.length} peyvên bingehîn hatin barkirin.`);
      await fetchAllData();
    } catch (err) {
      setWordMsg('Barkirin bi ser neket: ' + err.message);
    } finally {
      setSyncingProgress('');
    }
  };

  const handleSaveAllUiTexts = async (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('kk_ui_texts', JSON.stringify(ui));
      await supabase
        .from('site_settings')
        .upsert([{ key: 'ui_texts_json', value: JSON.stringify(ui) }], {
          onConflict: 'key'
        });
      setSettingsMsg('Hemû nivîs hatin tomarkirin.');
      setTimeout(() => setSettingsMsg(''), 3000);
    } catch (err) {
      setSettingsMsg('Çewtî: ' + err.message);
    }
  };

  const adminExerciseUnits = [
    ...new Set(exercises.map((ex) => ex.unit_title).filter(Boolean))
  ];
  const filteredAdminExercises = exercises.filter((ex) => {
    const matchesUnit =
      adminExUnitFilter === 'all' || ex.unit_title === adminExUnitFilter;
    const q = adminExSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (ex.question_text && ex.question_text.toLowerCase().includes(q)) ||
      (ex.unit_title && ex.unit_title.toLowerCase().includes(q)) ||
      (ex.correct_answer && ex.correct_answer.toLowerCase().includes(q));
    return matchesUnit && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <input
        ref={inlinePhotoInputRef}
        type="file"
        accept="image/*"
        onChange={handleInlinePhotoFileSelected}
        className="hidden"
      />

      {isAdmin && modalEditingGame && (
        <AdminGameEditorModal
          exercise={modalEditingGame}
          onClose={() => setModalEditingGame(null)}
          onSaved={async () => {
            setExMsg('Guherandina lîstikê hat tomarkirin.');
            await fetchAllData();
          }}
          onUploadImage={uploadImageToBucket}
        />
      )}

      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setViewMode('student');
              setActiveLesson(null);
            }}
            className="flex items-center gap-2.5 text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-red-700 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
              K
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              {ui.brand_first}
              <span className="text-red-700">{ui.brand_second}</span>
            </span>
          </button>

          <nav className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setViewMode('student');
                setActiveLesson(null);
              }}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${
                viewMode === 'student'
                  ? 'bg-red-700 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {ui.nav_site}
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('learn');
                setActiveLesson(null);
              }}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'learn'
                  ? 'bg-red-700 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{ui.nav_learn}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('ferheng');
                setActiveLesson(null);
              }}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'ferheng'
                  ? 'bg-red-700 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BookA className="w-4 h-4" />
              <span>{ui.nav_ferheng}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('admin');
                setActiveLesson(null);
              }}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'admin'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{ui.nav_admin}</span>
            </button>

            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen((prev) => !prev)}
                className="px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1"
                title="Ziman hilbijêre"
              >
                <span>{selectedLang}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-40">
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => handleSelectLanguage(opt.code)}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 ${
                        selectedLang === opt.code
                          ? 'font-bold text-red-700 bg-red-50/50'
                          : 'text-slate-700'
                      }`}
                    >
                      <span>{opt.nativeName}</span>
                      {selectedLang === opt.code && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {viewMode === 'student' && (
          <div className="space-y-8">
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 text-white rounded-3xl p-6 sm:p-10 shadow-sm">
              <div className="max-w-3xl space-y-4">
                <span className="inline-block text-xs font-bold tracking-wider uppercase bg-white/10 text-red-200 px-3 py-1 rounded-full">
                  {ui.hero_badge}
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
                  {ui.hero_title}
                </h1>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  {ui.hero_subtitle}
                </p>
                <div className="pt-2 relative">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 mt-1" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={ui.search_placeholder}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition ${
                    selectedCategory === 'all'
                      ? 'bg-red-700 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {ui.all_categories_label}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition ${
                      selectedCategory === cat.slug
                        ? 'bg-red-700 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase">
                    <Filter className="w-3.5 h-3.5" />
                    <span>{ui.filter_title}</span>
                  </span>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700"
                  >
                    <option value="all">{ui.filter_level_all}</option>
                    {dynamicLevels.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedMedia}
                    onChange={(e) => setSelectedMedia(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700"
                  >
                    <option value="all">{ui.filter_media_all}</option>
                    {dynamicMediaTypes.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs font-bold text-red-700 hover:text-red-800 underline"
                  >
                    {ui.reset_filters_btn}
                  </button>
                )}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-slate-900">
                  {selectedCategory === 'all'
                    ? ui.list_all_title
                    : getCategoryName(selectedCategory)}
                </h2>
                <span className="text-sm font-semibold text-slate-500">
                  {filteredLessons.length} {ui.list_count_suffix}
                </span>
              </div>

              {loading ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
                  {ui.loading_text}
                </div>
              ) : filteredLessons.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center space-y-3">
                  <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-800">{ui.empty_title}</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    {ui.empty_subtitle}
                  </p>
                  <button
                    type="button"
                    onClick={() => setViewMode('admin')}
                    className="mt-2 inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white text-sm font-bold px-4 py-2.5 rounded-xl"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{ui.empty_button}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLessons.map((lesson) => {
                    const mediaObj = dynamicMediaTypes.find(
                      (m) => m.id === lesson.media_type
                    );
                    const MediaIcon = mediaObj?.icon || FileText;
                    const showThumb = lesson.thumbnail_url && !brokenThumbs[lesson.id];
                    return (
                      <article
                        key={lesson.id}
                        onClick={() => handleOpenLesson(lesson)}
                        className="group bg-white border border-slate-200 hover:border-red-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex flex-col"
                      >
                        <div className="relative h-44 bg-white flex items-center justify-center overflow-hidden border-b border-slate-100">
                          {showThumb ? (
                            <img
                              src={lesson.thumbnail_url}
                              alt={lesson.title}
                              onError={() =>
                                setBrokenThumbs((prev) => ({
                                  ...prev,
                                  [lesson.id]: true
                                }))
                              }
                              className="w-full h-full object-contain p-2 group-hover:scale-105 transition duration-300"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                              <MediaIcon className="w-10 h-10" />
                              <span className="text-xs font-bold uppercase tracking-wider">
                                {mediaObj?.label || lesson.media_type}
                              </span>
                            </div>
                          )}
                          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                            <span className="bg-slate-900/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                              {getCategoryName(lesson.category_slug)}
                            </span>
                            {lesson.teacher_guide && (
                              <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-1 rounded-lg">
                                {ui.card_guide_badge}
                              </span>
                            )}
                          </div>
                          {isAdmin && (
                            <button
                              type="button"
                              disabled={inlinePhotoSaving}
                              onClick={(e) =>
                                handleTriggerInlinePhotoUpload(e, {
                                  lessonId: lesson.id,
                                  mode: 'lesson'
                                })
                              }
                              title="Wêneyê materyalê ji komputerê bar bike"
                              className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-slate-800 border border-slate-200 shadow-sm px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1"
                            >
                              <Upload className="w-3.5 h-3.5 text-red-700" />
                              <span>{inlinePhotoSaving ? '...' : 'Wêne'}</span>
                            </button>
                          )}
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-red-700 transition line-clamp-2">
                              {lesson.title}
                            </h3>
                            {lesson.description && (
                              <p className="text-sm text-slate-600 line-clamp-2">
                                {lesson.description}
                              </p>
                            )}
                          </div>
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                            <span>
                              {ui.meta_level_prefix}{' '}
                              <strong className="text-slate-700">{lesson.level}</strong>
                            </span>
                            <span>
                              {ui.meta_grade_prefix}{' '}
                              <strong className="text-slate-700">
                                {lesson.grade_level}
                              </strong>
                            </span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {viewMode === 'learn' && (
          <div className="space-y-6">
            <ALFABE
              exercises={effectiveExercises}
              gamesReset={gamesReset}
              isAdmin={isAdmin}
              xpPoints={xpPoints}
              streakDays={streakDays}
              completedUnits={completedUnits}
              wordBank={alfabeWords}
              dictionaryItems={combinedDictionary}
              selectedLang={selectedLang}
              onAwardXp={(pts) => setXpPoints((prev) => prev + pts)}
              onDeductHeartOrReset={(nextHearts) => {
                if (nextHearts <= 0) setHearts(0);
              }}
              onCompleteUnit={(unitName) => {
                if (!unitName) return;
                setCompletedUnits((prev) =>
                  prev.includes(unitName) ? prev : [...prev, unitName]
                );
              }}
              onEditGameInAdmin={handleEditGameInAdmin}
              onTriggerPhotoUpload={handleTriggerInlinePhotoUpload}
              inlinePhotoSaving={inlinePhotoSaving}
              exMsg={exMsg}
              ui={ui}
            />

            {exerciseUnits.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Qonaxên Lîstikê (Kurmancî Exercises)
                  </h2>
                  {selectedUnit && (
                    <button
                      type="button"
                      onClick={exitUnit}
                      className="text-xs font-bold text-red-700 hover:underline"
                    >
                      Derkeve ({selectedUnit})
                    </button>
                  )}
                </div>

                {!selectedUnit ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {exerciseUnits.map((uTitle, idx) => {
                      const unitSample = effectiveExercises.find(
                        (e) => e.unit_title === uTitle
                      );
                      return (
                        <div
                          key={uTitle}
                          className="p-4 rounded-xl border border-slate-200 hover:border-red-300 bg-slate-50/60 hover:bg-red-50/30 transition flex items-start justify-between gap-2"
                        >
                          <button
                            type="button"
                            onClick={() => startUnit(uTitle)}
                            className="text-left flex-1"
                          >
                            <div className="text-xs font-bold text-red-700">
                              {ui.learn_stage_prefix} {idx + 1}
                            </div>
                            <div className="font-bold text-slate-900 mt-0.5">{uTitle}</div>
                          </button>
                          {isAdmin && unitSample && (
                            <button
                              type="button"
                              onClick={() => handleEditGameInAdmin(unitSample)}
                              title="Biguherîne (Admin)"
                              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:border-red-300 text-slate-700 hover:text-red-700"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : unitCompleted ? (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                    <div className="text-xl font-extrabold text-slate-900">
                      {hearts > 0 ? ui.learn_win_title : ui.learn_lose_title}
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => startUnit(selectedUnit)}
                        className="px-4 py-2 rounded-xl bg-red-700 text-white text-sm font-bold"
                      >
                        {ui.learn_replay_btn}
                      </button>
                      <button
                        type="button"
                        onClick={exitUnit}
                        className="px-4 py-2 rounded-xl bg-slate-200 text-slate-800 text-sm font-bold"
                      >
                        {ui.learn_back_units_btn}
                      </button>
                    </div>
                  </div>
                ) : currentExercise ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-bold text-slate-500">
                      <span>{selectedUnit}</span>
                      <div className="flex items-center gap-3">
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => handleEditGameInAdmin(currentExercise)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Biguherîne</span>
                          </button>
                        )}
                        <span>
                          {currentExIndex + 1} / {unitExercises.length}
                        </span>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-slate-900">
                      {currentExercise.question_text}
                    </p>
                    {currentExercise.image_url && !brokenExImages[currentExercise.id] && (
                      <img
                        src={currentExercise.image_url}
                        alt={currentExercise.question_text}
                        onError={() =>
                          setBrokenExImages((prev) => ({
                            ...prev,
                            [currentExercise.id]: true
                          }))
                        }
                        className="max-h-60 rounded-xl border border-slate-200 object-contain bg-white p-1"
                      />
                    )}
                    {currentExercise.audio_url && (
                      <button
                        type="button"
                        onClick={() =>
                          isPlayingAudio
                            ? stopAudio()
                            : playCurrentAudio(currentExercise.audio_url)
                        }
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800"
                      >
                        <Volume2 className="w-4 h-4 text-red-700" />
                        <span>
                          {isPlayingAudio ? 'Deng rawestîne' : 'Deng guhdar bike'}
                        </span>
                      </button>
                    )}

                    {currentExercise.exercise_type === 'sentence' ? (
                      <div className="space-y-3">
                        <div className="min-h-12 p-3 rounded-xl border border-slate-300 bg-slate-50 flex flex-wrap gap-2">
                          {builtWords.length === 0 ? (
                            <span className="text-sm text-slate-400">
                              {ui.learn_sentence_placeholder}
                            </span>
                          ) : (
                            builtWords.map((w, idx) => (
                              <button
                                key={`${w}-${idx}`}
                                type="button"
                                onClick={() => handleRemoveBuiltWord(idx)}
                                className="px-3 py-1 rounded-lg bg-red-700 text-white text-sm font-bold"
                              >
                                {w}
                              </button>
                            ))
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(currentExercise.options || []).map((opt, idx) => (
                            <button
                              key={`${opt}-${idx}`}
                              type="button"
                              onClick={() => handleToggleWordToken(opt)}
                              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:border-red-300 text-sm font-semibold"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(currentExercise.options || []).map((opt, idx) => {
                          const label = opt.includes('=')
                            ? opt.split('=')[0].trim()
                            : opt;
                          const active = selectedOption === opt;
                          return (
                            <button
                              key={`${opt}-${idx}`}
                              type="button"
                              onClick={() => setSelectedOption(opt)}
                              className={`p-3.5 rounded-xl border text-left text-sm font-bold transition ${
                                active
                                  ? 'border-red-700 bg-red-50 text-red-800'
                                  : 'border-slate-200 bg-white hover:border-red-300 text-slate-800'
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {answerState && (
                      <div
                        className={`p-3.5 rounded-xl text-sm font-bold ${
                          answerState.correct
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        <div>{answerState.message}</div>
                        {currentExercise.explanation && (
                          <div className="text-xs font-medium mt-1 opacity-90">
                            {currentExercise.explanation}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-end gap-2">
                      {!answerState ? (
                        <button
                          type="button"
                          onClick={handleCheckAnswer}
                          className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-sm font-bold"
                        >
                          {ui.learn_check_btn}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleNextExercise}
                          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold"
                        >
                          {ui.learn_next_btn}
                        </button>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}

        {viewMode === 'ferheng' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                  <BookA className="w-6 h-6 text-red-700" />
                  <span>{ui.nav_ferheng}</span>
                </h1>
                <span className="text-xs font-bold text-slate-500">
                  {combinedDictionary.length} peyv (DB:{' '}
                  {totalWordCount || dictionaryWords.length})
                </span>
              </div>

              <form onSubmit={handleDictionarySearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={ferhengQuery}
                    onChange={(e) => setFerhengQuery(e.target.value)}
                    placeholder={ui.ferheng_search_placeholder}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-sm font-bold"
                >
                  {ui.ferheng_search_btn}
                </button>
              </form>

              {searchingDict && (
                <div className="text-xs font-semibold text-slate-500">
                  Li Wîkîferheng / Wiktionary tê gerîn...
                </div>
              )}

              {searchHistory.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="inline-flex items-center gap-1 text-slate-400 font-semibold">
                    <History className="w-3.5 h-3.5" />
                    <span>Dawî:</span>
                  </span>
                  {searchHistory.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setFerhengQuery(term)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-1 overflow-x-auto pb-1 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLetter('all');
                    setFerhengQuery('');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    selectedLetter === 'all' && !ferhengQuery
                      ? 'bg-red-700 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  HEMÛ
                </button>
                {kurdishAlphabet.map((ltr) => (
                  <button
                    key={ltr}
                    type="button"
                    onClick={() => {
                      setSelectedLetter(ltr);
                      setFerhengQuery('');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      selectedLetter === ltr && !ferhengQuery
                        ? 'bg-red-700 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {ltr}
                  </button>
                ))}
              </div>
            </div>

            {filteredDictionary.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center text-slate-500">
                {ui.ferheng_empty_text}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDictionary.slice(0, 60).map((item) => {
                  const meaningText = getWordMeaningByLang(item, selectedLang);
                  const exampleText = getWordExampleByLang(item, selectedLang);
                  const isFav = favoriteWords.includes(item.word);
                  return (
                    <div
                      key={item.id || item.word}
                      onClick={() => setSelectedWordDetail(item)}
                      className="bg-white border border-slate-200 hover:border-red-300 rounded-2xl p-5 shadow-sm hover:shadow transition cursor-pointer flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-lg font-extrabold text-slate-900">
                              {item.word}
                            </span>
                            {item.part_of_speech && (
                              <span className="ml-2 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                {item.part_of_speech}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                playDictionaryPronunciation(item);
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-red-700"
                              title="Telaffuz"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavoriteWord(item.word);
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-red-700"
                              title="Bijare"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  isFav ? 'fill-amber-400 text-amber-500' : ''
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                        {meaningText && (
                          <p className="text-sm font-semibold text-slate-800">
                            {meaningText}
                          </p>
                        )}
                        {exampleText && (
                          <p className="text-xs italic text-slate-500">“{exampleText}”</p>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                        <span>
                          {item.sourceType === 'wiktionary' ? 'Wiktionary' : 'Ferheng'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-red-700 font-semibold">
                          <Eye className="w-3 h-3" />
                          <span>Hûrgilî</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {viewMode === 'admin' && (
          <div className="space-y-8">
            {!isAdmin ? (
              <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-xl font-extrabold text-slate-900">
                      Têketina Rêveber
                    </h1>
                    <p className="text-xs text-slate-500">
                      Şîfreya rêveberiyê binivîse
                    </p>
                  </div>
                </div>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Şîfre..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {authError && (
                    <p className="text-xs font-bold text-red-600">{authError}</p>
                  )}
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-sm font-bold"
                  >
                    Têkeve
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-5 h-5 text-red-700" />
                    <h1 className="text-xl font-extrabold text-slate-900">
                      Panela Rêveber (Admin)
                    </h1>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Derkeve</span>
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-red-700" />
                        <span>
                          Rêveberiya Hînbûn / Lîstik (31 Tîp û Peyvên ALFABE)
                        </span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Her tîp û peyvê sererast bike û wêneyan rasterast ji komputerê bar
                        bike.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={handleResetAlfabeDefaultWords}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                      >
                        Standard Bike
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveAllAlfabeWords}
                        className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold"
                      >
                        Hemû Tîp û Peyvan Tomar Bike
                      </button>
                    </div>
                  </div>

                  {alfabeEditMsg && (
                    <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                      {alfabeEditMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[460px] overflow-y-auto pr-1">
                    {alfabeWords.map((item, idx) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2"
                      >
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                          <span>#{idx + 1}</span>
                          <span>ID: {item.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item.letter || ''}
                            onChange={(e) =>
                              handleInlineAlfabeFieldChange(
                                item.id,
                                'letter',
                                e.target.value
                              )
                            }
                            aria-label={`Tîp ${idx + 1}`}
                            className="w-14 px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-extrabold text-center text-red-700"
                          />
                          <input
                            type="text"
                            value={item.word || ''}
                            onChange={(e) =>
                              handleInlineAlfabeFieldChange(
                                item.id,
                                'word',
                                e.target.value
                              )
                            }
                            aria-label={`Peyv ${idx + 1}`}
                            placeholder="Peyv..."
                            className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-sm font-bold text-slate-900"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <span className="text-[11px] text-slate-500 truncate">
                            {item.image_url
                              ? 'Wêne barkirî ye'
                              : 'Wêne nehatiye barkirin'}
                          </span>
                          <button
                            type="button"
                            disabled={inlinePhotoSaving}
                            onClick={(e) =>
                              handleTriggerInlinePhotoUpload(e, {
                                wordItem: item,
                                mode: 'alfabe_word'
                              })
                            }
                            className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-red-50 hover:border-red-300 text-xs font-bold text-slate-700 hover:text-red-700"
                          >
                            <Upload className="w-3.5 h-3.5 text-red-700" />
                            <span>{inlinePhotoSaving ? '...' : 'Wêne Bar Bike'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900">
                        Lîstika Nû ya ALFABE: 4 Peyv û 4 Wêne
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        4 peyvan binivîse û wêneyan rasterast ji komputerê hilbijêre. Her
                        lîstika nû li jêr di &quot;Lîstik û Pirs&quot; de tê guherandin.
                      </p>
                    </div>
                  </div>

                  {exMsg && (
                    <div className="p-3 rounded-xl bg-red-50 text-red-800 border border-red-200 text-xs font-bold">
                      {exMsg}
                    </div>
                  )}

                  <form
                    onSubmit={handleCreateAlfabeRound}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Navê Qonaxê / Lîstikê
                      </label>
                      <input
                        type="text"
                        value={alfabeRoundForm.roundTitle}
                        onChange={(e) =>
                          setAlfabeRoundForm((prev) => ({
                            ...prev,
                            roundTitle: e.target.value
                          }))
                        }
                        placeholder="Mînak: ALFABE - Koma Nû"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        4 Peyv (her rêzek an bi bêhnokê)
                      </label>
                      <textarea
                        rows={3}
                        value={alfabeRoundForm.wordsText}
                        onChange={(e) =>
                          setAlfabeRoundForm((prev) => ({
                            ...prev,
                            wordsText: e.target.value
                          }))
                        }
                        placeholder={'Agir\nBilbil\nCemed\nÇay'}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        4 Wêne Ji Komputerê Hilbijêre
                      </label>
                      <label className="w-full min-h-[78px] px-3 py-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-red-50/40 hover:border-red-300 transition cursor-pointer flex flex-col items-center justify-center text-center gap-1">
                        <Upload className="w-4 h-4 text-red-700" />
                        <span className="text-xs font-bold text-slate-700">
                          {alfabeRoundFiles.length > 0
                            ? `${alfabeRoundFiles.length} wêne hatin hilbijartin`
                            : 'Wêneyan ji komputerê hilbijêre (heta 4)'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleAlfabeRoundFilesChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div className="md:col-span-3 flex justify-end">
                      <button
                        type="submit"
                        disabled={uploadingAlfabeRound}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 disabled:opacity-60 text-white text-sm font-bold"
                      >
                        <Plus className="w-4 h-4" />
                        <span>
                          {uploadingAlfabeRound
                            ? 'Wêne tên barkirin...'
                            : 'Lîstika 4 Peyv û 4 Wêneyan Lê Zêde Bike'}
                        </span>
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
                  <h2 className="text-lg font-extrabold text-slate-900">
                    {editingId
                      ? 'Materyalê Biguherîne'
                      : 'Materyala Nû Lê Zêde Bike'}
                  </h2>

                  {statusMsg.text && (
                    <div
                      className={`p-3.5 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                        statusMsg.type === 'error'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {statusMsg.type === 'error' ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      <span>{statusMsg.text}</span>
                    </div>
                  )}

                  <form
                    onSubmit={handleSaveLesson}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Sernav
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, title: e.target.value }))
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Beş
                      </label>
                      <select
                        value={formData.category_slug}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            category_slug: e.target.value
                          }))
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      >
                        {categories.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Cureyê Materyalê
                      </label>
                      <select
                        value={formData.media_type}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            media_type: e.target.value
                          }))
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      >
                        {dynamicMediaTypes.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Lînka Medyayê (URL)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.media_url}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              media_url: e.target.value
                            }))
                          }
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm"
                        />
                        <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold cursor-pointer flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" />
                          <span>
                            {uploadingField === 'media_url' ? '...' : 'Bar Bike'}
                          </span>
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(e, 'media_url')}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Wêneyê Bergê (Ji Komputerê)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.thumbnail_url}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              thumbnail_url: e.target.value
                            }))
                          }
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm"
                        />
                        <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold cursor-pointer flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" />
                          <span>
                            {uploadingField === 'thumbnail_url' ? '...' : 'Wêne'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'thumbnail_url')}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Ast
                      </label>
                      <input
                        type="text"
                        value={formData.level}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, level: e.target.value }))
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Pol
                      </label>
                      <input
                        type="text"
                        value={formData.grade_level}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            grade_level: e.target.value
                          }))
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        PDF-ya Rêbera Mamosteyan
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.guide_pdf_url}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              guide_pdf_url: e.target.value
                            }))
                          }
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm"
                        />
                        <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold cursor-pointer flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" />
                          <span>
                            {uploadingField === 'guide_pdf_url' ? '...' : 'PDF'}
                          </span>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileUpload(e, 'guide_pdf_url')}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Kurte / Şirove
                      </label>
                      <textarea
                        rows={2}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value
                          }))
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Notên Rêbera Mamosteyan
                      </label>
                      <textarea
                        rows={3}
                        value={formData.teacher_guide}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            teacher_guide: e.target.value
                          }))
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-sm font-bold"
                      >
                        {editingId ? 'Nû Bike' : 'Tomar Bike'}
                      </button>
                      {editingId && (
                        <button
                          type="button"
                          onClick={resetForm}
                          className="px-4 py-2.5 rounded-xl bg-slate-200 text-slate-800 text-sm font-bold"
                        >
                          Betal Bike
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Materyalên Heyî ({lessons.length})
                  </h2>
                  <div className="divide-y divide-slate-100">
                    {lessons.map((item) => (
                      <div
                        key={item.id}
                        className="py-3 flex items-center justify-between gap-3 flex-wrap"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{item.title}</div>
                          <div className="text-xs text-slate-500">
                            {getCategoryName(item.category_slug)} • {item.level} •{' '}
                            {item.grade_level}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEditing(item)}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                            title="Biguherîne"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteLesson(item.id)}
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700"
                            title="Jê Bibe"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                      <FolderEdit className="w-5 h-5 text-red-700" />
                      <span>Rêveberiya Beşan</span>
                    </h2>
                    {catMsg && (
                      <span className="text-xs font-bold text-emerald-700">{catMsg}</span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((cat) => (
                      <div
                        key={cat.slug}
                        className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                      >
                        <input
                          type="text"
                          value={cat.name}
                          onChange={(e) =>
                            handleUpdateCategoryName(cat.slug, e.target.value)
                          }
                          className="flex-1 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold"
                        />
                        {categories.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.slug)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <form onSubmit={handleAddCategory} className="flex gap-2">
                      <input
                        type="text"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="Navê beşa nû..."
                        className="px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                      >
                        Beş Lê Zêde Bike
                      </button>
                    </form>
                    <button
                      type="button"
                      onClick={handleSaveCategories}
                      className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold"
                    >
                      Beşan Tomar Bike
                    </button>
                  </div>
                </div>

                <div
                  id="admin-exercises-section"
                  className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-red-700" />
                        <span>Lîstik û Pirs ({exercises.length})</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Hemû lîstikên nû û heyî li vir têne guherandin an jêbirin.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetAllGames}
                      className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold"
                    >
                      Hemû Lîstikan Sifir Bike
                    </button>
                  </div>

                  {editingExId && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-bold flex items-center justify-between gap-2">
                      <span>Niha Lîstik / Pirs #{editingExId} tê guherandin.</span>
                      <button
                        type="button"
                        onClick={resetExForm}
                        className="underline font-extrabold"
                      >
                        Formê Paqij Bike
                      </button>
                    </div>
                  )}

                  <form
                    onSubmit={handleSaveExercise}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Navê Qonaxê / Lîstikê (Unit)
                      </label>
                      <input
                        type="text"
                        required
                        value={exForm.unit_title}
                        onChange={(e) =>
                          setExForm((prev) => ({
                            ...prev,
                            unit_title: e.target.value
                          }))
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Cureyê Pirsê / Lîstikê
                      </label>
                      <select
                        value={exForm.exercise_type}
                        onChange={(e) =>
                          setExForm((prev) => ({
                            ...prev,
                            exercise_type: e.target.value
                          }))
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      >
                        <option value="choice">{ui.learn_type_choice}</option>
                        <option value="sentence">{ui.learn_type_sentence}</option>
                        <option value="match">{ui.learn_type_match}</option>
                        <option value="first_letter">
                          Tîpa Pêşîn Bibîne (First Letter)
                        </option>
                        <option value="memory">Lîstika Bîrê (Memory Cards)</option>
                        <option value="missing_letter">
                          Tîpa Kêm Dagire (Missing Letter)
                        </option>
                        <option value="fill">{ui.learn_type_fill}</option>
                        <option value="image">{ui.learn_type_image}</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nivîsa Pirsê / Sernavê Lîstikê
                      </label>
                      <input
                        type="text"
                        required
                        value={exForm.question_text}
                        onChange={(e) =>
                          setExForm((prev) => ({
                            ...prev,
                            question_text: e.target.value
                          }))
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Vebijêrk / Peyv=Wêne (her rêzek yek)
                      </label>
                      <textarea
                        rows={3}
                        value={exForm.options_raw}
                        onChange={(e) =>
                          setExForm((prev) => ({
                            ...prev,
                            options_raw: e.target.value
                          }))
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Bersiva Rast
                        </label>
                        <input
                          type="text"
                          required
                          value={exForm.correct_answer}
                          onChange={(e) =>
                            setExForm((prev) => ({
                              ...prev,
                              correct_answer: e.target.value
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Ravekirin
                        </label>
                        <input
                          type="text"
                          value={exForm.explanation}
                          onChange={(e) =>
                            setExForm((prev) => ({
                              ...prev,
                              explanation: e.target.value
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Wêneyê Pirsê / Lîstikê (Ji Komputerê)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={exForm.image_url}
                          onChange={(e) =>
                            setExForm((prev) => ({
                              ...prev,
                              image_url: e.target.value
                            }))
                          }
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm"
                        />
                        <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold cursor-pointer flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingExImg ? '...' : 'Wêne'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleExImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Dengê Pirsê / Lîstikê
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={exForm.audio_url}
                          onChange={(e) =>
                            setExForm((prev) => ({
                              ...prev,
                              audio_url: e.target.value
                            }))
                          }
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm"
                        />
                        <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold cursor-pointer flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingExAudio ? '...' : 'Deng'}</span>
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={handleExAudioUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-sm font-bold"
                      >
                        {editingExId
                          ? 'Lîstik / Pirsê Nû Bike'
                          : 'Lîstik / Pirsê Lê Zêde Bike'}
                      </button>
                      {editingExId && (
                        <button
                          type="button"
                          onClick={resetExForm}
                          className="px-4 py-2.5 rounded-xl bg-slate-200 text-slate-800 text-sm font-bold"
                        >
                          Betal Bike
                        </button>
                      )}
                    </div>
                  </form>

                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
                    <select
                      value={adminExUnitFilter}
                      onChange={(e) => setAdminExUnitFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold"
                    >
                      <option value="all">Hemû Qonax</option>
                      {adminExerciseUnits.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={adminExSearch}
                      onChange={(e) => setAdminExSearch(e.target.value)}
                      placeholder="Di lîstik û pirsan de bigere..."
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div className="divide-y divide-slate-100">
                    {filteredAdminExercises.map((ex) => (
                      <div
                        key={ex.id}
                        className={`py-3 px-2 rounded-xl flex items-center justify-between gap-3 flex-wrap ${
                          editingExId === ex.id ? 'bg-amber-50/70' : ''
                        }`}
                      >
                        <div>
                          <div className="font-bold text-sm text-slate-900">
                            {ex.question_text}
                          </div>
                          <div className="text-xs text-slate-500">
                            {ex.unit_title} • Cure: {ex.exercise_type} • Bersiv:{' '}
                            {ex.correct_answer}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditGameInAdmin(ex)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold border border-amber-300"
                            title="Formu Aç (Admin)"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Biguherîne (Form)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteExercise(ex.id)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700"
                            title="Jê Bibe"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h2 className="text-lg font-extrabold text-slate-900">
                      Rêveberiya Ferhengê ({combinedDictionary.length})
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      {syncingProgress && (
                        <span className="text-xs font-bold text-amber-700">
                          {syncingProgress}
                        </span>
                      )}
                      {wordMsg && (
                        <span className="text-xs font-bold text-emerald-700">
                          {wordMsg}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={handleBulkImportDictionary}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                      >
                        Peyvên Bingehîn Bar Bike
                      </button>
                    </div>
                  </div>

                  <form
                    onSubmit={handleSaveWord}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Peyv
                      </label>
                      <input
                        type="text"
                        required
                        value={wordForm.word}
                        onChange={(e) =>
                          setWordForm((prev) => ({ ...prev, word: e.target.value }))
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Cureyê Peyvê
                      </label>
                      <input
                        type="text"
                        value={wordForm.part_of_speech}
                        onChange={(e) =>
                          setWordForm((prev) => ({
                            ...prev,
                            part_of_speech: e.target.value
                          }))
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Wate ({selectedLang})
                      </label>
                      <input
                        type="text"
                        required
                        value={
                          wordForm.meanings_i18n?.[selectedLang] ??
                          wordForm.meaning_tr ??
                          ''
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          setWordForm((prev) => ({
                            ...prev,
                            meaning_tr:
                              selectedLang === 'TR' ? val : prev.meaning_tr,
                            meanings_i18n: {
                              ...(prev.meanings_i18n || {}),
                              [selectedLang]: val
                            }
                          }));
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Hevoka Mînak ({selectedLang})
                      </label>
                      <input
                        type="text"
                        value={
                          wordForm.examples_i18n?.[selectedLang] ??
                          wordForm.example_sentence ??
                          ''
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          setWordForm((prev) => ({
                            ...prev,
                            example_sentence: val,
                            examples_i18n: {
                              ...(prev.examples_i18n || {}),
                              [selectedLang]: val
                            }
                          }));
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Dengê Telaffuzê
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={wordForm.audio_url}
                          onChange={(e) =>
                            setWordForm((prev) => ({
                              ...prev,
                              audio_url: e.target.value
                            }))
                          }
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm"
                        />
                        <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold cursor-pointer flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingWordAudio ? '...' : 'Deng'}</span>
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={handleWordAudioUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="md:col-span-3 flex items-center gap-3">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-sm font-bold"
                      >
                        {editingWordId ? 'Peyvê Nû Bike' : 'Peyvê Lê Zêde Bike'}
                      </button>
                      {editingWordId && (
                        <button
                          type="button"
                          onClick={resetWordForm}
                          className="px-4 py-2.5 rounded-xl bg-slate-200 text-slate-800 text-sm font-bold"
                        >
                          Betal Bike
                        </button>
                      )}
                    </div>
                  </form>

                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {dictionaryWords.map((wItem) => (
                      <div
                        key={wItem.id}
                        className="py-2.5 flex items-center justify-between gap-3"
                      >
                        <div>
                          <span className="font-bold text-sm text-slate-900">
                            {wItem.word}
                          </span>
                          <span className="ml-2 text-xs text-slate-500">
                            {getWordMeaningByLang(wItem, selectedLang)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEditingWord(wItem)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteWord(wItem.id)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-red-700" />
                      <span>Mîhengên Nivîsên Malperê ({selectedLang})</span>
                    </h2>
                    {settingsMsg && (
                      <span className="text-xs font-bold text-emerald-700">
                        {settingsMsg}
                      </span>
                    )}
                  </div>
                  <form
                    onSubmit={handleSaveAllUiTexts}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {UI_FIELD_LABELS.map((f) => (
                      <div key={f.key}>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {f.label}
                        </label>
                        <input
                          type="text"
                          value={ui[f.key] || ''}
                          onChange={(e) =>
                            setRawUi((prev) => ({
                              ...prev,
                              [f.key]: e.target.value
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                        />
                      </div>
                    ))}
                    <div className="md:col-span-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-sm font-bold"
                      >
                        Hemû Nivîsan Tomar Bike
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {activeLesson && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveLesson(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-red-700 uppercase">
                  {getCategoryName(activeLesson.category_slug)} • {activeLesson.level}
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                  {activeLesson.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveLesson(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <button
                type="button"
                onClick={() => setLessonTab('content')}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${
                  lessonTab === 'content'
                    ? 'bg-red-700 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {ui.tab_content}
              </button>
              <button
                type="button"
                onClick={() => setLessonTab('guide')}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${
                  lessonTab === 'guide'
                    ? 'bg-red-700 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {ui.tab_guide}
              </button>
            </div>

            {lessonTab === 'content' ? (
              <div className="space-y-4">
                {renderLessonMediaViewer(activeLesson)}
                {activeLesson.description && (
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {activeLesson.description}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900">
                  {ui.guide_heading}
                </h3>
                {activeLesson.teacher_guide ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 whitespace-pre-line">
                    {activeLesson.teacher_guide}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">{ui.guide_empty_text}</p>
                )}
                {activeLesson.guide_pdf_url && (
                  <a
                    href={activeLesson.guide_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold"
                  >
                    <Download className="w-4 h-4" />
                    <span>{ui.guide_download_btn}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedWordDetail && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedWordDetail(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {selectedWordDetail.word}
                </h2>
                {selectedWordDetail.part_of_speech && (
                  <span className="text-xs font-bold text-red-700">
                    {selectedWordDetail.part_of_speech}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedWordDetail(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {getWordMeaningByLang(selectedWordDetail, selectedLang) && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800">
                {getWordMeaningByLang(selectedWordDetail, selectedLang)}
              </div>
            )}

            {getWordExampleByLang(selectedWordDetail, selectedLang) && (
              <div className="text-xs italic text-slate-600">
                “{getWordExampleByLang(selectedWordDetail, selectedLang)}”
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => playDictionaryPronunciation(selectedWordDetail)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800"
              >
                <Volume2 className="w-4 h-4 text-red-700" />
                <span>Telaffuz</span>
              </button>
              <button
                type="button"
                onClick={() => toggleFavoriteWord(selectedWordDetail.word)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold"
              >
                <Star className="w-4 h-4" />
                <span>
                  {favoriteWords.includes(selectedWordDetail.word)
                    ? 'Di Bijareyan de Ye'
                    : 'Lê Zêde Bike Bijareyan'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-white border-t border-slate-200 py-5 px-4 sm:px-6 text-center text-xs text-slate-500">
        {ui.footer_text}
      </footer>
    </div>
  );
}
