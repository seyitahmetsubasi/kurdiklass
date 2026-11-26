import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import {
  BookOpen,
  Video,
  FileText,
  Headphones,
  Plus,
  Trash2,
  Search,
  Lock,
  LogOut,
  Edit3,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Heart,
  Flame,
  Award,
  RotateCcw,
  BookA,
  X,
  FolderEdit,
  Settings,
  ClipboardList,
  Download,
  Upload,
  Filter,
  Volume2,
  Image as ImageIcon,
  LayoutDashboard,
  ChevronDown,
  Check,
  Star,
  History,
  Eye,
  Zap
} from 'lucide-react';

const ALFABE_DEFAULT_WORDS = [
  { id: 'alf-1', word: 'Agir', letter: 'A', image_url: '' },
  { id: 'alf-2', word: 'bilbil', letter: 'B', image_url: '' },
  { id: 'alf-3', word: 'cemed', letter: 'C', image_url: '' },
  { id: 'alf-4', word: 'çay', letter: 'Ç', image_url: '' },
  { id: 'alf-5', word: 'dar', letter: 'D', image_url: '' },
  { id: 'alf-6', word: 'endezyar', letter: 'E', image_url: '' },
  { id: 'alf-7', word: 'êlek', letter: 'Ê', image_url: '' },
  { id: 'alf-8', word: 'ferheng', letter: 'F', image_url: '' },
  { id: 'alf-9', word: 'gore', letter: 'G', image_url: '' },
  { id: 'alf-10', word: 'guh', letter: 'G', image_url: '' },
  { id: 'alf-11', word: 'gûz', letter: 'G', image_url: '' },
  { id: 'alf-12', word: 'hesp', letter: 'H', image_url: '' },
  { id: 'alf-13', word: 'heyv', letter: 'H', image_url: '' },
  { id: 'alf-14', word: 'îsot', letter: 'Î', image_url: '' },
  { id: 'alf-15', word: 'jûjî', letter: 'J', image_url: '' },
  { id: 'alf-16', word: 'ker', letter: 'K', image_url: '' },
  { id: 'alf-17', word: 'lembe', letter: 'L', image_url: '' },
  { id: 'alf-18', word: 'masî', letter: 'M', image_url: '' },
  { id: 'alf-19', word: 'nan', letter: 'N', image_url: '' },
  { id: 'alf-20', word: 'nivîn', letter: 'N', image_url: '' },
  { id: 'alf-21', word: 'pisîk', letter: 'P', image_url: '' },
  { id: 'alf-22', word: 'qaz', letter: 'Q', image_url: '' },
  { id: 'alf-23', word: 'roj', letter: 'R', image_url: '' },
  { id: 'alf-24', word: 'rovî', letter: 'R', image_url: '' },
  { id: 'alf-25', word: 'stêrk', letter: 'S', image_url: '' },
  { id: 'alf-26', word: 'şêr', letter: 'Ş', image_url: '' },
  { id: 'alf-27', word: 'telefon', letter: 'T', image_url: '' },
  { id: 'alf-28', word: 'tivir', letter: 'T', image_url: '' },
  { id: 'alf-29', word: 'werdek', letter: 'W', image_url: '' },
  { id: 'alf-30', word: 'xiyar', letter: 'X', image_url: '' },
  { id: 'alf-31', word: 'zebeş', letter: 'Z', image_url: '' }
];

function ALFABE({
  exercises = [],
  gamesReset = false,
  isAdmin = false,
  xpPoints = 0,
  streakDays = 0,
  completedUnits = [],
  wordBank = ALFABE_DEFAULT_WORDS,
  onAwardXp,
  onDeductHeartOrReset,
  onCompleteUnit,
  onTriggerPhotoUpload,
  onSaveWordImage,
  inlinePhotoSaving = false,
  exMsg = '',
  ui = {}
}) {
  const activeExercises = gamesReset ? [] : exercises;
  const unitNames = [...new Set(activeExercises.map((e) => e.unit_title).filter(Boolean))];
  const [currentUnit, setCurrentUnit] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [pickedOption, setPickedOption] = useState('');
  const [pickedWords, setPickedWords] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [heartsLeft, setHeartsLeft] = useState(5);
  const [finished, setFinished] = useState(false);

  const activeWords = Array.isArray(wordBank) && wordBank.length >= 4
    ? wordBank
    : ALFABE_DEFAULT_WORDS;
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedWordKey, setSelectedWordKey] = useState('');
  const [selectedImageKey, setSelectedImageKey] = useState('');
  const [matchedPairs, setMatchedPairs] = useState({});
  const [pairFeedback, setPairFeedback] = useState(null);

  const totalRounds = Math.ceil(activeWords.length / 4);
  const currentFourWords = activeWords.slice(roundIndex * 4, roundIndex * 4 + 4);

  const unitQuestions = currentUnit
    ? activeExercises.filter((e) => e.unit_title === currentUnit)
    : [];
  const currentQuestion = unitQuestions[stepIndex] || null;

  const openUnit = (name) => {
    setCurrentUnit(name);
    setStepIndex(0);
    setPickedOption('');
    setPickedWords([]);
    setFeedback(null);
    setHeartsLeft(5);
    setFinished(false);
  };

  const evaluateAnswer = () => {
    if (!currentQuestion) return;
    let userAnswer = '';
    if (currentQuestion.exercise_type === 'sentence') {
      userAnswer = pickedWords.join(' ').trim();
    } else if (currentQuestion.exercise_type === 'match') {
      userAnswer = String((currentQuestion.options || []).length);
    } else {
      userAnswer = pickedOption.trim();
    }
    const isCorrect =
      currentQuestion.exercise_type === 'match' ||
      userAnswer.toLowerCase() === String(currentQuestion.correct_answer || '').trim().toLowerCase();

    if (isCorrect) {
      setFeedback({ ok: true, msg: ui.learn_correct_msg || 'Pir baş e! Bersiva te rast e.' });
      if (typeof onAwardXp === 'function') onAwardXp(15);
    } else {
      const nextHearts = Math.max(0, heartsLeft - 1);
      setHeartsLeft(nextHearts);
      setFeedback({
        ok: false,
        msg: `${ui.learn_wrong_prefix || 'Bersiva rast:'} ${currentQuestion.correct_answer}`
      });
      if (typeof onDeductHeartOrReset === 'function') onDeductHeartOrReset(nextHearts);
    }
  };

  const goNext = () => {
    setFeedback(null);
    setPickedOption('');
    setPickedWords([]);
    if (heartsLeft <= 0) {
      setFinished(true);
      return;
    }
    if (stepIndex + 1 < unitQuestions.length) {
      setStepIndex((i) => i + 1);
    } else {
      setFinished(true);
      if (currentUnit && typeof onCompleteUnit === 'function') {
        onCompleteUnit(currentUnit);
      }
    }
  };

  const handleSelectPair = (wordId, imageId) => {
    if (wordId) setSelectedWordKey(wordId === selectedWordKey ? '' : wordId);
    if (imageId) setSelectedImageKey(imageId === selectedImageKey ? '' : imageId);

    const activeW = wordId ? (wordId === selectedWordKey ? '' : wordId) : selectedWordKey;
    const activeI = imageId ? (imageId === selectedImageKey ? '' : imageId) : selectedImageKey;

    if (activeW && activeI) {
      if (activeW === activeI) {
        const nextMatched = { ...matchedPairs, [activeW]: true };
        setMatchedPairs(nextMatched);
        setPairFeedback({ ok: true, msg: 'Rast hat hevberkirin! (+10 XP)' });
        if (typeof onAwardXp === 'function') onAwardXp(10);
        if (Object.keys(nextMatched).length === currentFourWords.length) {
          if (typeof onCompleteUnit === 'function') {
            onCompleteUnit(`ALFABE-R${roundIndex + 1}`);
          }
        }
      } else {
        const nextHearts = Math.max(0, heartsLeft - 1);
        setHeartsLeft(nextHearts);
        setPairFeedback({ ok: false, msg: 'Ev peyv û wêne li hev nayên — dîsa biceribîne!' });
        if (typeof onDeductHeartOrReset === 'function') onDeductHeartOrReset(nextHearts);
      }
      setSelectedWordKey('');
      setSelectedImageKey('');
    }
  };

  const changeRound = (nextIdx) => {
    const bounded = Math.max(0, Math.min(totalRounds - 1, nextIdx));
    setRoundIndex(bounded);
    setSelectedWordKey('');
    setSelectedImageKey('');
    setMatchedPairs({});
    setPairFeedback(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-red-700" />
            <span>{ui.learn_title || 'Hînbûn û Lîstika Kurdî'}</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {ui.learn_subtitle || 'Qonaxekê hilbijêre, bersivên rast bide û xalên XP bi dest bixe!'}
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm font-bold">
          <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-xl">
            <Zap className="w-4 h-4" />
            <span>{xpPoints} {ui.learn_xp_label || 'XP'}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-xl">
            <Flame className="w-4 h-4" />
            <span>{streakDays} roj</span>
          </span>
          <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-xl">
            <Heart className="w-4 h-4 fill-rose-600 text-rose-600" />
            <span>{heartsLeft}</span>
          </span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Lîstika ALFABE: 4 Peyv û 4 Wêne
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Her peyvekê bi wêneyê wê yê rast re hevber bike ({activeWords.length} peyv)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={roundIndex <= 0}
              onClick={() => changeRound(roundIndex - 1)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50"
            >
              ← Berê
            </button>
            <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800">
              Lîstik {roundIndex + 1} / {totalRounds}
            </span>
            <button
              type="button"
              disabled={roundIndex >= totalRounds - 1}
              onClick={() => changeRound(roundIndex + 1)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50"
            >
              Pêş →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              4 Peyv
            </div>
            {currentFourWords.map((item) => {
              const isMatched = Boolean(matchedPairs[item.id]);
              const isPicked = selectedWordKey === item.id;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2"
                >
                  <button
                    type="button"
                    disabled={isMatched}
                    onClick={() => handleSelectPair(item.id, '')}
                    className={`flex-1 px-4 py-3.5 rounded-xl border text-left font-extrabold text-base transition flex items-center justify-between ${
                      isMatched
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : isPicked
                        ? 'bg-red-50 border-red-700 text-red-800 ring-2 ring-red-200'
                        : 'bg-white border-slate-200 hover:border-red-300 text-slate-900'
                    }`}
                  >
                    <span>
                      <span className="text-xs font-bold text-red-700 mr-2">[{item.letter}]</span>
                      {item.word}
                    </span>
                    {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </button>

                  {isAdmin && (
                    <button
                      type="button"
                      disabled={inlinePhotoSaving}
                      onClick={(e) => {
                        if (typeof onSaveWordImage === 'function') {
                          onSaveWordImage(e, item);
                        } else if (typeof onTriggerPhotoUpload === 'function') {
                          onTriggerPhotoUpload(e, { wordItem: item, mode: 'alfabe_word' });
                        }
                      }}
                      title={`Tenê wêne lê zêde bike: ${item.word}`}
                      className="shrink-0 px-3 py-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-300 text-slate-700 hover:text-red-700 text-xs font-bold inline-flex items-center gap-1.5 transition"
                    >
                      <ImageIcon className="w-4 h-4 text-red-700" />
                      <span>{inlinePhotoSaving ? '...' : 'Wêne'}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              4 Wêne
            </div>
            <div className="grid grid-cols-2 gap-3">
              {currentFourWords.map((item) => {
                const isMatched = Boolean(matchedPairs[item.id]);
                const isPicked = selectedImageKey === item.id;
                return (
                  <button
                    key={`img-${item.id}`}
                    type="button"
                    disabled={isMatched}
                    onClick={() => handleSelectPair('', item.id)}
                    className={`min-h-36 h-36 rounded-xl border overflow-hidden flex flex-col items-center justify-center p-2 transition relative ${
                      isMatched
                        ? 'bg-emerald-50 border-emerald-300'
                        : isPicked
                        ? 'bg-red-50 border-red-700 ring-2 ring-red-200'
                        : 'bg-white border-slate-200 hover:border-red-300'
                    }`}
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.word}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 gap-1">
                        <ImageIcon className="w-7 h-7" />
                        <span className="text-[11px] font-bold text-slate-500">
                          Wêne ({item.letter})
                        </span>
                      </div>
                    )}
                    {isMatched && (
                      <span className="absolute top-1.5 right-1.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {item.word}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {pairFeedback && (
          <div
            className={`p-3 rounded-xl text-xs font-bold ${
              pairFeedback.ok
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {pairFeedback.msg}
          </div>
        )}
      </div>

      {exMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 text-red-800 border border-red-200 text-sm font-medium">
          {exMsg}
        </div>
      )}

      {!currentUnit ? (
        unitNames.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center space-y-3">
            <Award className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-slate-600 font-medium">
              {ui.learn_empty_units ||
                'Hîn lîstik nehatine zêdekirin. Ji panela Rêveber (Admin) dikarî lîstikên nû lê zêde bikî.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {unitNames.map((unitName, idx) => {
              const count = activeExercises.filter((e) => e.unit_title === unitName).length;
              const isDone = completedUnits.includes(unitName);
              return (
                <button
                  key={unitName}
                  type="button"
                  onClick={() => openUnit(unitName)}
                  className="text-left bg-white border border-slate-200 hover:border-red-300 rounded-2xl p-5 hover:shadow-md transition space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-red-700">
                    <span>{ui.learn_stage_prefix || 'Qonax'} {idx + 1}</span>
                    {isDone && (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Temam</span>
                      </span>
                    )}
                  </div>
                  <div className="text-lg font-extrabold text-slate-900">{unitName}</div>
                  <div className="text-xs text-slate-500">
                    {count} {ui.learn_question_count_suffix || 'pirs'}
                  </div>
                </button>
              );
            })}
          </div>
        )
      ) : finished ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4">
          <Award className="w-12 h-12 text-red-700 mx-auto" />
          <h2 className="text-2xl font-extrabold text-slate-900">
            {heartsLeft > 0
              ? ui.learn_win_title || 'Pîroz be! Te ev qonax qedand!'
              : ui.learn_lose_title || 'Dilên te qediyan — ji nû ve biceribîne!'}
          </h2>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => openUnit(currentUnit)}
              className="inline-flex items-center gap-1.5 bg-red-700 hover:bg-red-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{ui.learn_replay_btn || 'Dîsa Bilîze'}</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentUnit(null)}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-5 py-2.5 rounded-xl text-sm"
            >
              {ui.learn_back_units_btn || 'Vegere Qonaxan'}
            </button>
          </div>
        </div>
      ) : currentQuestion ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-500">
            <span>{currentUnit}</span>
            <span>
              {stepIndex + 1} / {unitQuestions.length}
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900">{currentQuestion.question_text}</h2>

          {currentQuestion.image_url && (
            <div className="space-y-2">
              <img
                src={currentQuestion.image_url}
                alt={currentQuestion.question_text}
                className="max-h-64 rounded-xl border border-slate-200 object-contain bg-white p-1"
              />
            </div>
          )}

          {isAdmin && typeof onTriggerPhotoUpload === 'function' && (
            <div>
              <button
                type="button"
                disabled={inlinePhotoSaving}
                onClick={(e) =>
                  onTriggerPhotoUpload(e, { exerciseId: currentQuestion.id, mode: 'question' })
                }
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg"
              >
                <ImageIcon className="w-3.5 h-3.5 text-red-700" />
                <span>{inlinePhotoSaving ? 'Tê barkirin...' : 'Wêneyê Pirsê Biguherîne'}</span>
              </button>
            </div>
          )}

          {currentQuestion.exercise_type === 'sentence' ? (
            <div className="space-y-3">
              <div className="min-h-12 p-3 rounded-xl border border-slate-300 bg-slate-50 flex flex-wrap gap-2">
                {pickedWords.length === 0 ? (
                  <span className="text-sm text-slate-400">
                    {ui.learn_sentence_placeholder || 'Li jêr li peyvan bitikîne da ku hevokê ava bikî...'}
                  </span>
                ) : (
                  pickedWords.map((w, i) => (
                    <button
                      key={`${w}-${i}`}
                      type="button"
                      onClick={() =>
                        setPickedWords((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="px-3 py-1 rounded-lg bg-red-700 text-white text-sm font-bold"
                    >
                      {w}
                    </button>
                  ))
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {(currentQuestion.options || []).map((opt, idx) => (
                  <button
                    key={`${opt}-${idx}`}
                    type="button"
                    onClick={() => setPickedWords((prev) => [...prev, opt])}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:border-red-300 text-sm font-semibold text-slate-800"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(currentQuestion.options || []).map((opt, idx) => {
                const label = opt.includes('=') ? opt.split('=')[0].trim() : opt;
                const active = pickedOption === opt;
                return (
                  <button
                    key={`${opt}-${idx}`}
                    type="button"
                    onClick={() => setPickedOption(opt)}
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

          {feedback && (
            <div
              className={`p-3.5 rounded-xl text-sm font-bold ${
                feedback.ok
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {feedback.msg}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentUnit(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              ← {ui.learn_back_units_btn || 'Vegere Qonaxan'}
            </button>
            {!feedback ? (
              <button
                type="button"
                onClick={evaluateAnswer}
                className="bg-red-700 hover:bg-red-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm"
              >
                {ui.learn_check_btn || 'Kontrol Bike'}
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm"
              >
                {ui.learn_next_btn || 'Pirsê Din'}
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || 'kurdiklass2025';

const LANGUAGE_OPTIONS = [
  { code: 'KU', name: 'Kurmancî', nativeName: 'Kurmancî' },
  { code: 'ZZA', name: 'Zazakî / Kirmanckî', nativeName: 'Zazakî' },
  { code: 'CKB', name: 'Sorani', nativeName: 'Soranî' },
  { code: 'TR', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'EN', name: 'English', nativeName: 'English' },
  { code: 'DE', name: 'German', nativeName: 'Deutsch' },
  { code: 'FR', name: 'French', nativeName: 'Français' },
  { code: 'IT', name: 'Italian', nativeName: 'Italiano' }
];

const kurdishAlphabet = [
  'A', 'B', 'C', 'Ç', 'D', 'E', 'Ê', 'F', 'G', 'H', 'I', 'Î', 'J', 'K', 'L',
  'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'Ş', 'T', 'U', 'Û', 'V', 'W', 'X', 'Y', 'Z'
];

const BUILTIN_DICTIONARY = [
  {
    id: 'builtin-1',
    word: 'heval',
    part_of_speech: 'navdêr',
    meaning_tr: 'arkadaş, dost',
    meaning_en: 'friend',
    meaning_ku: 'kesê ku mirov pê re dostanî û hevaltî dike',
    example_sentence: 'Ew hevalê min ê herî baş e.',
    meanings_i18n: {
      KU: 'kesê ku mirov pê re dostanî û hevaltî dike',
      ZZA: 'embaz, dost',
      CKB: 'هاوڕێ، دۆست',
      TR: 'arkadaş, dost',
      EN: 'friend',
      DE: 'Freund, Freundin',
      FR: 'ami, amie',
      IT: 'amico, amica'
    },
    examples_i18n: {
      KU: 'Ew hevalê min ê herî baş e.',
      TR: 'O benim en iyi arkadaşım.',
      EN: 'He/She is my best friend.'
    }
  },
  {
    id: 'builtin-2',
    word: 'dibistan',
    part_of_speech: 'navdêr',
    meaning_tr: 'okul',
    meaning_en: 'school',
    meaning_ku: 'cîhê perwerde û hînbûnê',
    example_sentence: 'Zarok her sibeh diçin dibistanê.',
    meanings_i18n: {
      KU: 'cîhê perwerde û hînbûnê',
      ZZA: 'mekteb, wendegeh',
      CKB: 'قوتابخانە',
      TR: 'okul',
      EN: 'school',
      DE: 'Schule',
      FR: 'école',
      IT: 'scuola'
    },
    examples_i18n: {
      KU: 'Zarok her sibeh diçin dibistanê.',
      TR: 'Çocuklar her sabah okula gidiyor.',
      EN: 'Children go to school every morning.'
    }
  },
  {
    id: 'builtin-3',
    word: 'pirtûk',
    part_of_speech: 'navdêr',
    meaning_tr: 'kitap',
    meaning_en: 'book',
    meaning_ku: 'berhema nivîskî ya xwendinê',
    example_sentence: 'Ez îşev pirtûkekê dixwînim.',
    meanings_i18n: {
      KU: 'berhema nivîskî ya xwendinê',
      ZZA: 'kîtab',
      CKB: 'کتێب',
      TR: 'kitap',
      EN: 'book',
      DE: 'Buch',
      FR: 'livre',
      IT: 'libro'
    },
    examples_i18n: {
      KU: 'Ez îşev pirtûkekê dixwînim.',
      TR: 'Bu akşam bir kitap okuyorum.',
      EN: 'I am reading a book tonight.'
    }
  },
  {
    id: 'builtin-4',
    word: 'av',
    part_of_speech: 'navdêr',
    meaning_tr: 'su',
    meaning_en: 'water',
    meaning_ku: 'şileya jiyanê ya bêreng û bêbêhn',
    example_sentence: 'Ava kaniyê pir sar û zelal e.',
    meanings_i18n: {
      KU: 'şileya jiyanê ya bêreng û bêbêhn',
      ZZA: 'awe',
      CKB: 'ئاو',
      TR: 'su',
      EN: 'water',
      DE: 'Wasser',
      FR: 'eau',
      IT: 'acqua'
    },
    examples_i18n: {
      KU: 'Ava kaniyê pir sar û zelal e.',
      TR: 'Pınarın suyu çok soğuk ve berrak.',
      EN: 'The spring water is very cold and clear.'
    }
  },
  {
    id: 'builtin-5',
    word: 'mamoste',
    part_of_speech: 'navdêr',
    meaning_tr: 'öğretmen',
    meaning_en: 'teacher',
    meaning_ku: 'kesê ku ders dide û fêr dike',
    example_sentence: 'Mamoste bi sebir dersê şirove dike.',
    meanings_i18n: {
      KU: 'kesê ku ders dide û fêr dike',
      ZZA: 'malim, mamoste',
      CKB: 'مامۆستا',
      TR: 'öğretmen',
      EN: 'teacher',
      DE: 'Lehrer, Lehrerin',
      FR: 'enseignant, professeur',
      IT: 'insegnante, maestro'
    },
    examples_i18n: {
      KU: 'Mamoste bi sebir dersê şirove dike.',
      TR: 'Öğretmen sabırla dersi açıklıyor.',
      EN: 'The teacher explains the lesson patiently.'
    }
  },
  {
    id: 'builtin-6',
    word: 'xwendin',
    part_of_speech: 'lêker',
    meaning_tr: 'okumak, öğrenmek',
    meaning_en: 'to read, to study',
    meaning_ku: 'bi çav an bi dengekî bilind nivîsekê şopandin',
    example_sentence: 'Em bi hev re kurdî dixwînin.',
    meanings_i18n: {
      KU: 'bi çav an bi dengekî bilind nivîsekê şopandin',
      ZZA: 'wendiş',
      CKB: 'خوێندنەوە',
      TR: 'okumak, öğrenmek',
      EN: 'to read, to study',
      DE: 'lesen, lernen',
      FR: 'lire, étudier',
      IT: 'leggere, studiare'
    },
    examples_i18n: {
      KU: 'Em bi hev re kurdî dixwînin.',
      TR: 'Birlikte Kürtçe okuyoruz.',
      EN: 'We study Kurdish together.'
    }
  },
  {
    id: 'builtin-7',
    word: 'nivîsandin',
    part_of_speech: 'lêker',
    meaning_tr: 'yazmak',
    meaning_en: 'to write',
    meaning_ku: 'bi tîp û peyvan ramanan tomar kirin',
    example_sentence: 'Ew her roj çîrokekê dinivîse.',
    meanings_i18n: {
      KU: 'bi tîp û peyvan ramanan tomar kirin',
      ZZA: 'nuştiş',
      CKB: 'نووسین',
      TR: 'yazmak',
      EN: 'to write',
      DE: 'schreiben',
      FR: 'écrire',
      IT: 'scrivere'
    },
    examples_i18n: {
      KU: 'Ew her roj çîrokekê dinivîse.',
      TR: 'O her gün bir hikâye yazıyor.',
      EN: 'He/She writes a story every day.'
    }
  },
  {
    id: 'builtin-8',
    word: 'roj',
    part_of_speech: 'navdêr',
    meaning_tr: 'gün, güneş',
    meaning_en: 'day, sun',
    meaning_ku: 'demjimêrên ronahiyê an yekeya demê ya 24 saetan',
    example_sentence: 'Îro rojeke gelekî xweş e.',
    meanings_i18n: {
      KU: 'demjimêrên ronahiyê an yekeya demê ya 24 saetan',
      ZZA: 'roc, tîje',
      CKB: 'ڕۆژ، خۆر',
      TR: 'gün, güneş',
      EN: 'day, sun',
      DE: 'Tag, Sonne',
      FR: 'jour, soleil',
      IT: 'giorno, sole'
    },
    examples_i18n: {
      KU: 'Îro rojeke gelekî xweş e.',
      TR: 'Bugün çok güzel bir gün.',
      EN: 'Today is a very nice day.'
    }
  },
  {
    id: 'builtin-9',
    word: 'şev',
    part_of_speech: 'navdêr',
    meaning_tr: 'gece',
    meaning_en: 'night',
    meaning_ku: 'dema tarîtiyê ya piştî rojavabûnê',
    example_sentence: 'Şev bêdeng û stêrkbar bû.',
    meanings_i18n: {
      KU: 'dema tarîtiyê ya piştî rojavabûnê',
      ZZA: 'şew',
      CKB: 'شەو',
      TR: 'gece',
      EN: 'night',
      DE: 'Nacht',
      FR: 'nuit',
      IT: 'notte'
    },
    examples_i18n: {
      KU: 'Şev bêdeng û stêrkbar bû.',
      TR: 'Gece sessiz ve yıldızlıydı.',
      EN: 'The night was quiet and starry.'
    }
  },
  {
    id: 'builtin-10',
    word: 'mal',
    part_of_speech: 'navdêr',
    meaning_tr: 'ev, yuva',
    meaning_en: 'home, house',
    meaning_ku: 'cîhê jiyan û rûniştinê yê malbatê',
    example_sentence: 'Em êvarê vedigerin malê.',
    meanings_i18n: {
      KU: 'cîhê jiyan û rûniştinê yê malbatê',
      ZZA: 'key, çê',
      CKB: 'ماڵ',
      TR: 'ev, yuva',
      EN: 'home, house',
      DE: 'Haus, Zuhause',
      FR: 'maison, foyer',
      IT: 'casa'
    },
    examples_i18n: {
      KU: 'Em êvarê vedigerin malê.',
      TR: 'Akşam eve dönüyoruz.',
      EN: 'We are returning home in the evening.'
    }
  },
  {
    id: 'builtin-11',
    word: 'zarok',
    part_of_speech: 'navdêr',
    meaning_tr: 'çocuk',
    meaning_en: 'child',
    meaning_ku: 'mirovê biçûk di temenê zarokatiyê de',
    example_sentence: 'Zarok li baxçe dilîzin.',
    meanings_i18n: {
      KU: 'mirovê biçûk di temenê zarokatiyê de',
      ZZA: 'qij, doman',
      CKB: 'منداڵ',
      TR: 'çocuk',
      EN: 'child',
      DE: 'Kind',
      FR: 'enfant',
      IT: 'bambino, bambina'
    },
    examples_i18n: {
      KU: 'Zarok li baxçe dilîzin.',
      TR: 'Çocuklar bahçede oynuyor.',
      EN: 'Children are playing in the yard.'
    }
  },
  {
    id: 'builtin-12',
    word: 'ziman',
    part_of_speech: 'navdêr',
    meaning_tr: 'dil',
    meaning_en: 'language, tongue',
    meaning_ku: 'sîstema deng û peyvan a têkiliya mirovan',
    example_sentence: 'Zimanê kurdî pir dewlemend e.',
    meanings_i18n: {
      KU: 'sîstema deng û peyvan a têkiliya mirovan',
      ZZA: 'ziwan',
      CKB: 'زمان',
      TR: 'dil',
      EN: 'language, tongue',
      DE: 'Sprache, Zunge',
      FR: 'langue, langage',
      IT: 'lingua'
    },
    examples_i18n: {
      KU: 'Zimanê kurdî pir dewlemend e.',
      TR: 'Kürtçe çok zengin bir dil.',
      EN: 'The Kurdish language is very rich.'
    }
  },
  {
    id: 'builtin-13',
    word: 'hêvî',
    part_of_speech: 'navdêr',
    meaning_tr: 'umut',
    meaning_en: 'hope',
    meaning_ku: 'bawerî û hêviya tiştên baş ên pêşerojê',
    example_sentence: 'Hêvî her tim ronahiyê dide.',
    meanings_i18n: {
      KU: 'bawerî û hêviya tiştên baş ên pêşerojê',
      ZZA: 'umîd, hêvî',
      CKB: 'هیوا، ئومێد',
      TR: 'umut',
      EN: 'hope',
      DE: 'Hoffnung',
      FR: 'espoir',
      IT: 'speranza'
    },
    examples_i18n: {
      KU: 'Hêvî her tim ronahiyê dide.',
      TR: 'Umut her zaman ışık verir.',
      EN: 'Hope always gives light.'
    }
  },
  {
    id: 'builtin-14',
    word: 'aşîtî',
    part_of_speech: 'navdêr',
    meaning_tr: 'barış',
    meaning_en: 'peace',
    meaning_ku: 'rewşa aramî, lihevkirin û bêşeriyê',
    example_sentence: 'Em ji bo aştiyê dixebitin.',
    meanings_i18n: {
      KU: 'rewşa aramî, lihevkirin û bêşeriyê',
      ZZA: 'haştî, aştî',
      CKB: 'ئاشتی',
      TR: 'barış',
      EN: 'peace',
      DE: 'Frieden',
      FR: 'paix',
      IT: 'pace'
    },
    examples_i18n: {
      KU: 'Em ji bo aştiyê dixebitin.',
      TR: 'Barış için çalışıyoruz.',
      EN: 'We work for peace.'
    }
  },
  {
    id: 'builtin-15',
    word: 'şîn',
    part_of_speech: 'rengdêr',
    meaning_tr: 'mavi, yeşil',
    meaning_en: 'blue, green',
    meaning_ku: 'rengê esmanî an rengê giha û pelên şîn',
    example_sentence: 'Esman îro şîn û vekirî ye.',
    meanings_i18n: {
      KU: 'rengê esmanî an rengê giha û pelên şîn',
      ZZA: 'kewe, keske',
      CKB: 'شین',
      TR: 'mavi, yeşil',
      EN: 'blue, green',
      DE: 'blau, grün',
      FR: 'bleu, vert',
      IT: 'blu, verde'
    },
    examples_i18n: {
      KU: 'Esman îro şîn û vekirî ye.',
      TR: 'Gökyüzü bugün mavi ve açık.',
      EN: 'The sky is blue and clear today.'
    }
  },
  {
    id: 'builtin-16',
    word: 'sor',
    part_of_speech: 'rengdêr',
    meaning_tr: 'kırmızı',
    meaning_en: 'red',
    meaning_ku: 'rengê agir û gulên sor',
    example_sentence: 'Guleke sor li ser maseyê ye.',
    meanings_i18n: {
      KU: 'rengê agir û gulên sor',
      ZZA: 'sûr',
      CKB: 'سوور',
      TR: 'kırmızı',
      EN: 'red',
      DE: 'rot',
      FR: 'rouge',
      IT: 'rosso'
    },
    examples_i18n: {
      KU: 'Guleke sor li ser maseyê ye.',
      TR: 'Masanın üzerinde kırmızı bir gül var.',
      EN: 'There is a red rose on the table.'
    }
  },
  {
    id: 'builtin-17',
    word: 'spî',
    part_of_speech: 'rengdêr',
    meaning_tr: 'beyaz',
    meaning_en: 'white',
    meaning_ku: 'rengê berf û şîrî',
    example_sentence: 'Berfa spî hemû çiya girtiye.',
    meanings_i18n: {
      KU: 'rengê berf û şîrî',
      ZZA: 'sipî',
      CKB: 'سپی',
      TR: 'beyaz',
      EN: 'white',
      DE: 'weiß',
      FR: 'blanc',
      IT: 'bianco'
    },
    examples_i18n: {
      KU: 'Berfa spî hemû çiya girtiye.',
      TR: 'Beyaz kar bütün dağları kaplamış.',
      EN: 'White snow has covered all the mountains.'
    }
  },
  {
    id: 'builtin-18',
    word: 'baş',
    part_of_speech: 'rengdêr',
    meaning_tr: 'iyi, güzel',
    meaning_en: 'good, well',
    meaning_ku: 'tiştê kêrhatî, qenc û erênî',
    example_sentence: 'Sibeha we bi xêr û baş be.',
    meanings_i18n: {
      KU: 'tiştê kêrhatî, qenc û erênî',
      ZZA: 'rınd, baş',
      CKB: 'باش',
      TR: 'iyi, güzel',
      EN: 'good, well',
      DE: 'gut',
      FR: 'bon, bien',
      IT: 'buono, bene'
    },
    examples_i18n: {
      KU: 'Sibeha we bi xêr û baş be.',
      TR: 'Sabahınız hayırlı ve iyi olsun.',
      EN: 'Good morning to you.'
    }
  },
  {
    id: 'builtin-19',
    word: 'hatin',
    part_of_speech: 'lêker',
    meaning_tr: 'gelmek',
    meaning_en: 'to come',
    meaning_ku: 'ber bi cîhekî an kesekî ve çûn',
    example_sentence: 'Mêvanên me îro tên.',
    meanings_i18n: {
      KU: 'ber bi cîhekî an kesekî ve çûn',
      ZZA: 'ameyîş',
      CKB: 'هاتن',
      TR: 'gelmek',
      EN: 'to come',
      DE: 'kommen',
      FR: 'venir',
      IT: 'venire'
    },
    examples_i18n: {
      KU: 'Mêvanên me îro tên.',
      TR: 'Misafirlerimiz bugün geliyor.',
      EN: 'Our guests are coming today.'
    }
  },
  {
    id: 'builtin-20',
    word: 'çûn',
    part_of_speech: 'lêker',
    meaning_tr: 'gitmek',
    meaning_en: 'to go',
    meaning_ku: 'ji cîhekî dûr ketin an ber bi cihekî din ve rê ketin',
    example_sentence: 'Em sibehê zû diçin rêwîtiyê.',
    meanings_i18n: {
      KU: 'ji cîhekî dûr ketin an ber bi cihekî din ve rê ketin',
      ZZA: 'şîyayîş',
      CKB: 'چوون',
      TR: 'gitmek',
      EN: 'to go',
      DE: 'gehen, fahren',
      FR: 'aller, partir',
      IT: 'andare'
    },
    examples_i18n: {
      KU: 'Em sibehê zû diçin rêwîtiyê.',
      TR: 'Yarın sabah erken yolculuğa çıkıyoruz.',
      EN: 'We are going on a trip early tomorrow.'
    }
  },
  {
    id: 'builtin-21',
    word: 'dîtin',
    part_of_speech: 'lêker',
    meaning_tr: 'görmek',
    meaning_en: 'to see',
    meaning_ku: 'bi çavan ferq kirin an hev dîtin',
    example_sentence: 'Min hevalê xwe li kolanê dît.',
    meanings_i18n: {
      KU: 'bi çavan ferq kirin an hev dîtin',
      ZZA: 'vînayîş',
      CKB: 'بینین',
      TR: 'görmek',
      EN: 'to see',
      DE: 'sehen',
      FR: 'voir',
      IT: 'vedere'
    },
    examples_i18n: {
      KU: 'Min hevalê xwe li kolanê dît.',
      TR: 'Arkadaşımı sokakta gördüm.',
      EN: 'I saw my friend on the street.'
    }
  },
  {
    id: 'builtin-22',
    word: 'bihîstin',
    part_of_speech: 'lêker',
    meaning_tr: 'duymak, işitmek',
    meaning_en: 'to hear',
    meaning_ku: 'bi guhan deng fêm kirin',
    example_sentence: 'Min dengê stranê baş bihîst.',
    meanings_i18n: {
      KU: 'bi guhan deng fêm kirin',
      ZZA: 'hesayîş',
      CKB: 'بیستن',
      TR: 'duymak, işitmek',
      EN: 'to hear',
      DE: 'hören',
      FR: 'entendre',
      IT: 'sentire'
    },
    examples_i18n: {
      KU: 'Min dengê stranê baş bihîst.',
      TR: 'Şarkının sesini iyi duydum.',
      EN: 'I heard the sound of the song well.'
    }
  },
  {
    id: 'builtin-23',
    word: 'axaftin',
    part_of_speech: 'lêker',
    meaning_tr: 'konuşmak',
    meaning_en: 'to speak, to talk',
    meaning_ku: 'bi zimên raman û hestan vegotin',
    example_sentence: 'Ew bi kurdî û tirkî diaxive.',
    meanings_i18n: {
      KU: 'bi zimên raman û hestan vegotin',
      ZZA: 'qiseykerdiş',
      CKB: 'قسەکردن',
      TR: 'konuşmak',
      EN: 'to speak, to talk',
      DE: 'sprechen',
      FR: 'parler',
      IT: 'parlare'
    },
    examples_i18n: {
      KU: 'Ew bi kurdî û tirkî diaxive.',
      TR: 'O Kürtçe ve Türkçe konuşuyor.',
      EN: 'He/She speaks Kurdish and Turkish.'
    }
  },
  {
    id: 'builtin-24',
    word: 'xwaringeh',
    part_of_speech: 'navdêr',
    meaning_tr: 'lokanta, restoran',
    meaning_en: 'restaurant',
    meaning_ku: 'cîhê ku xwarin tê çêkirin û xwarin',
    example_sentence: 'Em ê nîvro li xwaringehê bixwin.',
    meanings_i18n: {
      KU: 'cîhê ku xwarin tê çêkirin û xwarin',
      ZZA: 'lokanta',
      CKB: 'چێشتخانە',
      TR: 'lokanta, restoran',
      EN: 'restaurant',
      DE: 'Restaurant',
      FR: 'restaurant',
      IT: 'ristorante'
    },
    examples_i18n: {
      KU: 'Em ê nîvro li xwaringehê bixwin.',
      TR: 'Öğlen lokantada yiyeceğiz.',
      EN: 'We will eat at the restaurant at noon.'
    }
  },
  {
    id: 'builtin-25',
    word: 'nexweşxane',
    part_of_speech: 'navdêr',
    meaning_tr: 'hastane',
    meaning_en: 'hospital',
    meaning_ku: 'navenda tenduristiyê ya dermankirina nexweşan',
    example_sentence: 'Nexweşxane nêzîkî navenda bajêr e.',
    meanings_i18n: {
      KU: 'navenda tenduristiyê ya dermankirina nexweşan',
      ZZA: 'nêweşxane',
      CKB: 'نەخۆشخانە',
      TR: 'hastane',
      EN: 'hospital',
      DE: 'Krankenhaus',
      FR: 'hôpital',
      IT: 'ospedale'
    },
    examples_i18n: {
      KU: 'Nexweşxane nêzîkî navenda bajêr e.',
      TR: 'Hastane şehir merkezine yakın.',
      EN: 'The hospital is near the city center.'
    }
  },
  {
    id: 'builtin-26',
    word: 'bijîşk',
    part_of_speech: 'navdêr',
    meaning_tr: 'doktor, hekim',
    meaning_en: 'doctor, physician',
    meaning_ku: 'pisporê bijîşkî û dermankirinê',
    example_sentence: 'Bijîşk şîretên baş dide nexweşan.',
    meanings_i18n: {
      KU: 'pisporê bijîşkî û dermankirinê',
      ZZA: 'doktor, hekîm',
      CKB: 'پزیشک، دکتۆر',
      TR: 'doktor, hekim',
      EN: 'doctor, physician',
      DE: 'Arzt, Ärztin',
      FR: 'médecin',
      IT: 'medico, dottore'
    },
    examples_i18n: {
      KU: 'Bijîşk şîretên baş dide nexweşan.',
      TR: 'Doktor hastalara iyi tavsiyeler veriyor.',
      EN: 'The doctor gives good advice to patients.'
    }
  },
  {
    id: 'builtin-27',
    word: 'welat',
    part_of_speech: 'navdêr',
    meaning_tr: 'ülke, vatan',
    meaning_en: 'country, homeland',
    meaning_ku: 'ax û erdnîgariya ku gelek lê dijî',
    example_sentence: 'Her welat xwedî çandeke taybet e.',
    meanings_i18n: {
      KU: 'ax û erdnîgariya ku gelek lê dijî',
      ZZA: 'welat',
      CKB: 'وڵات',
      TR: 'ülke, vatan',
      EN: 'country, homeland',
      DE: 'Land, Heimat',
      FR: 'pays',
      IT: 'paese'
    },
    examples_i18n: {
      KU: 'Her welat xwedî çandeke taybet e.',
      TR: 'Her ülkenin kendine özgü bir kültürü var.',
      EN: 'Every country has a special culture.'
    }
  },
  {
    id: 'builtin-28',
    word: 'bajêr',
    part_of_speech: 'navdêr',
    meaning_tr: 'şehir',
    meaning_en: 'city',
    meaning_ku: 'navenda niştecihbûnê ya mezin',
    example_sentence: 'Ev bajêr pir qerebalix û zindî ye.',
    meanings_i18n: {
      KU: 'navenda niştecihbûnê ya mezin',
      ZZA: 'şar',
      CKB: 'شار',
      TR: 'şehir',
      EN: 'city',
      DE: 'Stadt',
      FR: 'ville',
      IT: 'città'
    },
    examples_i18n: {
      KU: 'Ev bajêr pir qerebalix û zindî ye.',
      TR: 'Bu şehir çok kalabalık ve canlı.',
      EN: 'This city is very crowded and lively.'
    }
  },
  {
    id: 'builtin-29',
    word: 'gund',
    part_of_speech: 'navdêr',
    meaning_tr: 'köy',
    meaning_en: 'village',
    meaning_ku: 'cîhê niştecihbûnê yê biçûk di nav xwezayê de',
    example_sentence: 'Gundê me di nav daristanê de ye.',
    meanings_i18n: {
      KU: 'cîhê niştecihbûnê yê biçûk di nav xwezayê de',
      ZZA: 'dew',
      CKB: 'گوند',
      TR: 'köy',
      EN: 'village',
      DE: 'Dorf',
      FR: 'village',
      IT: 'villaggio'
    },
    examples_i18n: {
      KU: 'Gundê me di nav daristanê de ye.',
      TR: 'Köyümüz ormanın içinde.',
      EN: 'Our village is in the forest.'
    }
  },
  {
    id: 'builtin-30',
    word: 'çiya',
    part_of_speech: 'navdêr',
    meaning_tr: 'dağ',
    meaning_en: 'mountain',
    meaning_ku: 'bilindahiya mezin û kevirîn a ser rûyê erdê',
    example_sentence: 'Serê çiyê hîn jî bi berfê ye.',
    meanings_i18n: {
      KU: 'bilindahiya mezin û kevirîn a ser rûyê erdê',
      ZZA: 'ko',
      CKB: 'چیا، شاخ',
      TR: 'dağ',
      EN: 'mountain',
      DE: 'Berg',
      FR: 'montagne',
      IT: 'montagna'
    },
    examples_i18n: {
      KU: 'Serê çiyê hîn jî bi berfê ye.',
      TR: 'Dağın zirvesi hâlâ karlı.',
      EN: 'The mountain peak is still covered with snow.'
    }
  }
];

const defaultCategories = [
  { slug: 'zarok', name: 'Zarok' },
  { slug: 'ders', name: 'Ders' },
  { slug: 'pirtuk', name: 'Pirtûk' },
  { slug: 'video', name: 'Vîdyo' },
  { slug: 'ferheng', name: 'Ferheng' }
];

const defaultLevels = ['Destpêk (A1-A2)', 'Navîn (B1-B2)', 'Pêşketî (C1)'];
const defaultGrades = [
  'Pêşdibistan',
  'Pola 1-4',
  'Pola 5-8',
  'Lîse / Zanîngeh',
  'Hemû Ast'
];

const defaultMediaTypes = [
  { id: 'video', label: 'Vîdyo', icon: Video },
  { id: 'document', label: 'Belge / PDF', icon: FileText },
  { id: 'audio', label: 'Deng', icon: Headphones },
  { id: 'book', label: 'Pirtûk', icon: BookOpen }
];

const DEFAULT_UI_TEXTS = {
  brand_first: 'Kurdi',
  brand_second: 'Klass',
  nav_site: 'Malper',
  nav_learn: 'Hînbûn / Lîstik',
  nav_ferheng: 'Ferheng',
  nav_admin: 'Rêveber',
  hero_badge: 'PLATFORMA PERWERDEHIYA KURDÎ',
  hero_title: 'Çavkanî, Ders û Materyalên Fêrbûna Kurdî',
  hero_subtitle:
    'Vîdyo, pirtûk, belge, deng û çalakiyên perwerdehiyê yên ji bo xwendekar û mamosteyan li yek cihî.',
  search_placeholder: 'Li ders, pirtûk, vîdyo an mijarekê bigere...',
  all_categories_label: 'Hemû Beş',
  filter_title: 'Parzûn:',
  filter_level_label: 'Ast',
  filter_level_all: 'Hemû Ast',
  filter_media_label: 'Cureyê Materyalê',
  filter_media_all: 'Hemû Cure',
  reset_filters_btn: 'Parzûnan Paqij Bike',
  list_all_title: 'Hemû Materyal',
  list_count_suffix: 'materyal',
  loading_text: 'Materyal tên barkirin...',
  empty_title: 'Hîn materyal nehatine zêdekirin',
  empty_subtitle: 'Ji beşa Rêveber (Admin) dikarî ders, PDF, vîdyo û pirtûkan bar bikî.',
  empty_button: 'Here Beşa Rêveber',
  card_guide_badge: 'RÊBERA MAMOSTEYAN',
  meta_level_prefix: 'Ast:',
  meta_grade_prefix: 'Pol:',
  tab_content: 'Naveroka Dersê',
  tab_guide: 'Rêbera Mamosteyan',
  guide_heading: 'Not û Rêbera Mamosteyan',
  guide_empty_text: 'Ji bo vê dersê hîn noteke nivîskî nehatiye nivîsandin.',
  guide_download_btn: 'Rêbera Mamosteyan (PDF) Daxe',
  btn_open_material: 'Materyalê Veke',
  learn_title: 'Hînbûn û Lîstika Kurdî',
  learn_subtitle: 'Qonaxekê hilbijêre, bersivên rast bide û xalên XP bi dest bixe!',
  learn_xp_label: 'XP',
  learn_stage_prefix: 'Qonax',
  learn_question_count_suffix: 'pirs',
  learn_empty_units: 'Hîn lîstik nehatine zêdekirin. Ji panela Rêveber (Admin) dikarî lîstikên nû lê zêde bikî.',
  learn_win_title: 'Pîroz be! Te ev qonax qedand!',
  learn_lose_title: 'Dilên te qediyan — ji nû ve biceribîne!',
  learn_replay_btn: 'Dîsa Bilîze',
  learn_back_units_btn: 'Vegere Qonaxan',
  learn_type_choice: 'Hilbijartina Rast',
  learn_type_sentence: 'Avakirina Hevokê',
  learn_type_match: 'Hevberkirin',
  learn_type_fill: 'Dagirtina Valahiyê',
  learn_type_image: 'Wêne û Peyv',
  learn_sentence_placeholder: 'Li jêr li peyvan bitikîne da ku hevokê ava bikî...',
  learn_correct_msg: 'Pir baş e! Bersiva te rast e.',
  learn_wrong_prefix: 'Bersiva rast:',
  learn_check_btn: 'Kontrol Bike',
  learn_next_btn: 'Pirsê Din',
  ferheng_search_placeholder: 'Peyvekê binivîse (Kurmancî, Tirkî, îngilîzî...)',
  ferheng_search_btn: 'Lê bigere',
  ferheng_empty_text: 'Peyvek nehat dîtin. Bi tîp an peyveke din biceribîne.',
  footer_text: 'KurdiKlass — Platforma Perwerdehî û Çavkaniyên Kurdî'
};

const UI_FIELD_LABELS = [
  { key: 'brand_first', label: 'Navê Malperê (Beşa Yekem)' },
  { key: 'brand_second', label: 'Navê Malperê (Beşa Duyem)' },
  { key: 'nav_site', label: 'Menû: Malper' },
  { key: 'nav_learn', label: 'Menû: Hînbûn / Lîstik' },
  { key: 'nav_ferheng', label: 'Menû: Ferheng' },
  { key: 'nav_admin', label: 'Menû: Rêveber' },
  { key: 'hero_badge', label: 'Etîketa Jorîn (Badge)' },
  { key: 'hero_title', label: 'Sernavê Sereke (Hero)' },
  { key: 'hero_subtitle', label: 'Binnivîsa Sereke' },
  { key: 'search_placeholder', label: 'Qutiya Lêgerînê (Placeholder)' },
  { key: 'all_categories_label', label: 'Bişkojka Hemû Beşan' },
  { key: 'list_all_title', label: 'Sernavê Lîsteya Materyalan' },
  { key: 'footer_text', label: 'Nivîsa Binê Malperê (Footer)' }
];

const getYouTubeEmbedUrl = (url = '') => {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const normalizeKurdish = (text = '') =>
  text
    .toLowerCase()
    .replace(/[îìí]/g, 'i')
    .replace(/[êëèé]/g, 'e')
    .replace(/[ûùú]/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/['’ʼ`-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const sanitizeWiktionaryText = (raw = '') =>
  String(raw || '')
    .replace(/\{\{[^{}]*\}\}/g, ' ')
    .replace(/\[\[(?:[^|\]]*\|)?([^\]]+)\]\]/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/'{2,}/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const isLikelyInflectedForm = (gloss = '') => {
  const g = gloss.toLowerCase();
  return (
    g.includes('inflection of ') ||
    g.includes('plural of ') ||
    g.includes('participle of ') ||
    g.includes('imperative of ') ||
    g.includes('subjunctive of ') ||
    g.includes('past participle of ') ||
    g.includes('form of ')
  );
};

const extractPosFromWiktionarySection = (sectionText = '') => {
  const posMatch = sectionText.match(
    /^===\s*(Noun|Verb|Adjective|Adverb|Pronoun|Numeral|Conjunction|Preposition|Postposition|Interjection|Particle|Proper noun|Phrase|Idiom|Letter)\s*===/im
  );
  if (!posMatch) return 'navdêr';
  const map = {
    noun: 'navdêr',
    'proper noun': 'navdêr',
    verb: 'lêker',
    adjective: 'rengdêr',
    adverb: 'hoker',
    pronoun: 'cînavk',
    numeral: 'hejmar',
    interjection: 'baneşan'
  };
  return map[posMatch[1].toLowerCase()] || 'navdêr';
};

const extractGlossesFromWiktionary = (wikitext = '', targetLangCode = 'EN') => {
  if (!wikitext) return { pos: 'navdêr', meanings: [], examples: [] };
  const lines = wikitext.split('\n');
  let inKurdishSection = false;
  let currentPos = 'navdêr';
  const meanings = [];
  const examples = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const h2 = line.match(/^==\s*([^=]+)\s*==\s*$/);
    if (h2) {
      const secName = h2[1].trim().toLowerCase();
      if (inKurdishSection && secName !== 'kurdish' && secName !== 'northern kurdish') {
        break;
      }
      inKurdishSection = secName === 'kurdish' || secName === 'northern kurdish';
      continue;
    }
    if (!inKurdishSection) continue;
    const h3 = line.match(/^===\s*([^=]+)\s*===\s*$/);
    if (h3) {
      currentPos = extractPosFromWiktionarySection(`=== ${h3[1]} ===`);
      continue;
    }
    const defMatch = line.match(/^#\s+([^:*#].*)$/);
    if (defMatch) {
      const cleaned = sanitizeWiktionaryText(defMatch[1]);
      if (cleaned && cleaned.length > 1 && !isLikelyInflectedForm(cleaned)) {
        meanings.push(cleaned);
      }
      continue;
    }
    const exMatch = line.match(/^#:\s*(.+)$/);
    if (exMatch) {
      const cleanedEx = sanitizeWiktionaryText(exMatch[1]);
      if (cleanedEx && cleanedEx.length > 2) {
        examples.push(cleanedEx);
      }
    }
  }
  if (meanings.length === 0) {
    const fallbackLines = lines
      .filter((l) => /^#\s+[^:*#]/.test(l))
      .map((l) => sanitizeWiktionaryText(l.replace(/^#\s+/, '')))
      .filter((t) => t && t.length > 1 && !isLikelyInflectedForm(t));
    meanings.push(...fallbackLines.slice(0, 3));
  }
  const uniqueMeanings = [...new Set(meanings)].slice(0, 4);
  const uniqueExamples = [...new Set(examples)].slice(0, 2);
  return {
    pos: currentPos,
    meanings: uniqueMeanings,
    examples: uniqueExamples,
    langCode: targetLangCode
  };
};

const fetchWiktionaryEntry = async (rawTerm, selectedLang = 'KU') => {
  const cleanTerm = String(rawTerm || '').trim();
  if (!cleanTerm) return null;
  const candidateTitles = [cleanTerm];
  const lower = cleanTerm.toLocaleLowerCase('tr');
  if (!candidateTitles.includes(lower)) candidateTitles.push(lower);
  const capitalized = lower.charAt(0).toLocaleUpperCase('tr') + lower.slice(1);
  if (!candidateTitles.includes(capitalized)) candidateTitles.push(capitalized);
  for (const title of candidateTitles) {
    try {
      const endpoint = `https://en.wiktionary.org/w/api.php?action=query&prop=revisions|extracts&rvprop=content&rvslots=main&explaintext=1&exlimit=1&format=json&origin=*&titles=${encodeURIComponent(
        title
      )}`;
      const res = await fetch(endpoint);
      if (!res.ok) continue;
      const data = await res.json();
      const pages = data?.query?.pages || {};
      const page = Object.values(pages).find((p) => p && !p.missing);
      if (!page) continue;
      const wikitext =
        page?.revisions?.[0]?.slots?.main?.['*'] ||
        page?.revisions?.[0]?.['*'] ||
        '';
      const parsed = extractGlossesFromWiktionary(wikitext, selectedLang);
      let glossText = parsed.meanings.join(' ; ');
      if (!glossText && page.extract) {
        const cleanExtract = sanitizeWiktionaryText(page.extract);
        if (cleanExtract && !isLikelyInflectedForm(cleanExtract)) {
          glossText = cleanExtract.slice(0, 240);
        }
      }
      if (!glossText) continue;
      const primaryExample = parsed.examples[0] || '';
      const i18nMap = {
        KU: selectedLang === 'KU' ? glossText : '',
        ZZA: selectedLang === 'ZZA' ? glossText : '',
        CKB: selectedLang === 'CKB' ? glossText : '',
        TR: selectedLang === 'TR' ? glossText : '',
        EN: glossText,
        DE: selectedLang === 'DE' ? glossText : '',
        FR: selectedLang === 'FR' ? glossText : '',
        IT: selectedLang === 'IT' ? glossText : ''
      };
      if (selectedLang) {
        i18nMap[selectedLang] = glossText;
      }
      return {
        id: `wikt-${normalizeKurdish(page.title || cleanTerm)}`,
        word: page.title || cleanTerm,
        part_of_speech: parsed.pos || 'navdêr',
        meaning_tr: selectedLang === 'TR' ? glossText : '',
        meaning_en: glossText,
        meaning_ku: selectedLang === 'KU' ? glossText : '',
        example_sentence: primaryExample,
        meanings_i18n: i18nMap,
        examples_i18n: primaryExample ? { [selectedLang || 'EN']: primaryExample } : {},
        sourceType: 'wiktionary'
      };
    } catch {
      // Sonraki adaya geç
    }
  }
  return null;
};

export default function App() {
  const [viewMode, setViewMode] = useState('student');
  const [lessons, setLessons] = useState([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [dynamicLevels, setDynamicLevels] = useState(defaultLevels);
  const [dynamicGrades, setDynamicGrades] = useState(defaultGrades);
  const [dynamicMediaTypes, setDynamicMediaTypes] = useState(defaultMediaTypes);
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
  const [uploadingField, setUploadingField] = useState(null);
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
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [newCatName, setNewCatName] = useState('');
  const [catMsg, setCatMsg] = useState('');
  const [exercises, setExercises] = useState([]);
  const [gamesReset, setGamesReset] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [builtWords, setBuiltWords] = useState([]);
  const [answerState, setAnswerState] = useState(null);
  const [comboCount, setComboCount] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [xpPoints, setXpPoints] = useState(() => {
    const saved = localStorage.getItem('kk_xp');
    return saved ? parseInt(saved, 10) || 0 : 0;
  });
  const [streakDays, setStreakDays] = useState(() => {
    const saved = localStorage.getItem('kk_streak');
    return saved ? parseInt(saved, 10) || 0 : 0;
  });
  const [completedUnits, setCompletedUnits] = useState(() => {
    try {
      const saved = localStorage.getItem('kk_completed_units');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [unitCompleted, setUnitCompleted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioPlayerRef = useRef(null);
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
  const [exMsg, setExMsg] = useState('');
  const [alfabeWords, setAlfabeWords] = useState(() => {
    try {
      const saved = localStorage.getItem('kk_alfabe_words');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return ALFABE_DEFAULT_WORDS;
  });
  const [alfabeRoundForm, setAlfabeRoundForm] = useState({
    roundTitle: '',
    wordsText: '',
    imagesText: ''
  });
  const [uploadingExImg, setUploadingExImg] = useState(false);
  const [uploadingExAudio, setUploadingExAudio] = useState(false);
  const [inlinePhotoSaving, setInlinePhotoSaving] = useState(false);
  const [inlinePhotoTarget, setInlinePhotoTarget] = useState(null);
  const inlinePhotoInputRef = useRef(null);
  const [adminExUnitFilter, setAdminExUnitFilter] = useState('all');
  const [adminExSearch, setAdminExSearch] = useState('');
  const [dictionaryWords, setDictionaryWords] = useState([]);
  const [totalWordCount, setTotalWordCount] = useState(0);
  const [ferhengQuery, setFerhengQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('all');
  const [selectedWordDetail, setSelectedWordDetail] = useState(null);
  const [wiktionaryMatches, setWiktionaryMatches] = useState([]);
  const [searchingDict, setSearchingDict] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kk_search_history') || '[]');
    } catch {
      return [];
    }
  });
  const [favoriteWords, setFavoriteWords] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kk_favorite_words') || '[]');
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
    examples_i18n: {
      KU: '',
      ZZA: '',
      CKB: '',
      TR: '',
      EN: '',
      DE: '',
      FR: '',
      IT: ''
    }
  });
  const [wordMsg, setWordMsg] = useState('');
  const [uploadingWordAudio, setUploadingWordAudio] = useState(false);
  const [syncingProgress, setSyncingProgress] = useState('');
  const [selectedLang, setSelectedLang] = useState(() => {
    try {
      return localStorage.getItem('kk_lang') || 'KU';
    } catch {
      return 'KU';
    }
  });
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langDropdownRef = useRef(null);
  const [rawUi, setRawUi] = useState(DEFAULT_UI_TEXTS);
  const [settingsMsg, setSettingsMsg] = useState('');
  const ui = { ...DEFAULT_UI_TEXTS, ...rawUi };
  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedLevel !== 'all' ||
    selectedMedia !== 'all' ||
    Boolean(searchQuery.trim());
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSelectedMedia('all');
    setSearchQuery('');
  };
  const persistProgressSnapshot = async (nextXp, nextStreak, nextUnits) => {
    try {
      localStorage.setItem('kk_xp', String(nextXp));
      localStorage.setItem('kk_streak', String(nextStreak));
      localStorage.setItem('kk_completed_units', JSON.stringify(nextUnits));
    } catch {
      // ignore storage errors
    }
    try {
      await supabase.from('site_settings').upsert(
        [
          { key: 'learner_xp_remote', value: String(nextXp) },
          { key: 'learner_streak_remote', value: String(nextStreak) },
          { key: 'learner_units_remote', value: JSON.stringify(nextUnits) }
        ],
        { onConflict: 'key' }
      );
    } catch {
      // ignore remote sync errors
    }
  };
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setLangMenuOpen(false);
        setActiveLesson(null);
        setSelectedWordDetail(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  useEffect(() => {
    if (sessionStorage.getItem('kurdiklass_admin') === '1') {
      setIsAdmin(true);
    }
    fetchAllData();
  }, []);
  const fetchAllData = async () => {
    setLoading(true);
    const { data: lessonsData } = await supabase
      .from('lessons')
      .select('*')
      .order('created_at', { ascending: false });
    if (lessonsData) {
      setLessons(lessonsData);
      const lessonLevels = lessonsData.map((l) => l.level).filter(Boolean);
      setDynamicLevels([...new Set([...defaultLevels, ...lessonLevels])]);
      const lessonGrades = lessonsData.map((l) => l.grade_level).filter(Boolean);
      setDynamicGrades([...new Set([...defaultGrades, ...lessonGrades])]);
      const extraMediaIds = lessonsData.map((l) => l.media_type).filter(Boolean);
      const mergedMedia = [...defaultMediaTypes];
      extraMediaIds.forEach((mId) => {
        if (!mergedMedia.some((dm) => dm.id === mId)) {
          mergedMedia.push({
            id: mId,
            label: mId.charAt(0).toUpperCase() + mId.slice(1),
            icon: FileText
          });
        }
      });
      setDynamicMediaTypes(mergedMedia);
    }
    const { data: exData } = await supabase
      .from('kurmanci_exercises')
      .select('*')
      .order('sort_order', { ascending: true });
    if (exData) setExercises(exData);
    const { count: wordTotal } = await supabase
      .from('dictionary')
      .select('*', { count: 'exact', head: true });
    if (typeof wordTotal === 'number') setTotalWordCount(wordTotal);
    const { data: dictData } = await supabase
      .from('dictionary')
      .select('*')
      .order('word', { ascending: true })
      .limit(1000);
    if (dictData) setDictionaryWords(dictData);
    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('key, value');
    if (settingsData && settingsData.length > 0) {
      const map = {};
      settingsData.forEach((row) => {
        map[row.key] = row.value;
      });
      if (map.categories_json) {
        try {
          const parsedCats = JSON.parse(map.categories_json);
          if (Array.isArray(parsedCats) && parsedCats.length > 0) {
            setCategories(parsedCats);
          }
        } catch {
          // ignore
        }
      }
      if (map.alfabe_words_json) {
        try {
          const parsedWords = JSON.parse(map.alfabe_words_json);
          if (Array.isArray(parsedWords) && parsedWords.length > 0) {
            setAlfabeWords(parsedWords);
            localStorage.setItem('kk_alfabe_words', JSON.stringify(parsedWords));
          }
        } catch {
          // ignore
        }
      }
      if (map.games_reset === 'true') {
        setGamesReset(true);
      }
      const activeLang = (() => {
        try {
          return localStorage.getItem('kk_lang') || 'KU';
        } catch {
          return 'KU';
        }
      })();
      const langPrefix = `${activeLang.toLowerCase()}_`;
      const uiMap = { ...DEFAULT_UI_TEXTS };
      Object.keys(DEFAULT_UI_TEXTS).forEach((k) => {
        if (map[k] !== undefined) uiMap[k] = map[k];
      });
      Object.keys(DEFAULT_UI_TEXTS).forEach((k) => {
        if (map[`${langPrefix}${k}`] !== undefined) {
          uiMap[k] = map[`${langPrefix}${k}`];
        }
      });
      setRawUi(uiMap);
      if (map.learner_xp_remote) {
        const remoteXp = parseInt(map.learner_xp_remote, 10) || 0;
        const localXp = parseInt(localStorage.getItem('kk_xp') || '0', 10) || 0;
        const bestXp = Math.max(remoteXp, localXp);
        setXpPoints(bestXp);
        localStorage.setItem('kk_xp', String(bestXp));
      }
      if (map.learner_streak_remote) {
        const remoteStreak = parseInt(map.learner_streak_remote, 10) || 0;
        const localStreak = parseInt(localStorage.getItem('kk_streak') || '0', 10) || 0;
        const bestStreak = Math.max(remoteStreak, localStreak);
        setStreakDays(bestStreak);
        localStorage.setItem('kk_streak', String(bestStreak));
      }
      if (map.learner_units_remote) {
        try {
          const remoteUnits = JSON.parse(map.learner_units_remote);
          if (Array.isArray(remoteUnits)) {
            const localUnits = JSON.parse(localStorage.getItem('kk_completed_units') || '[]');
            const mergedUnits = [...new Set([...(Array.isArray(localUnits) ? localUnits : []), ...remoteUnits])];
            setCompletedUnits(mergedUnits);
            localStorage.setItem('kk_completed_units', JSON.stringify(mergedUnits));
          }
        } catch {
          // ignore
        }
      }
    }
    setLoading(false);
  };
  const handleSelectLanguage = async (langCode) => {
    setSelectedLang(langCode);
    setLangMenuOpen(false);
    try {
      localStorage.setItem('kk_lang', langCode);
    } catch {
      // ignore
    }
    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('key, value');
    const map = {};
    (settingsData || []).forEach((row) => {
      map[row.key] = row.value;
    });
    const langPrefix = `${langCode.toLowerCase()}_`;
    const uiMap = { ...DEFAULT_UI_TEXTS };
    Object.keys(DEFAULT_UI_TEXTS).forEach((k) => {
      if (map[k] !== undefined) uiMap[k] = map[k];
    });
    Object.keys(DEFAULT_UI_TEXTS).forEach((k) => {
      if (map[`${langPrefix}${k}`] !== undefined) {
        uiMap[k] = map[`${langPrefix}${k}`];
      }
    });
    setRawUi(uiMap);
  };
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSCODE) {
      setIsAdmin(true);
      sessionStorage.setItem('kurdiklass_admin', '1');
      setAuthError('');
      setPasswordInput('');
    } else {
      setAuthError('Şîfre şaş e! Ji kerema xwe dîsa biceribîne.');
    }
  };
  const handleLogout = () => {
    if (audioPlayerRef.current) audioPlayerRef.current.pause();
    setIsPlayingAudio(false);
    setIsAdmin(false);
    sessionStorage.removeItem('kurdiklass_admin');
    resetForm();
  };
  const handleFileUpload = async (event, fieldName) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingField(fieldName);
    setStatusMsg({ type: '', text: '' });
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from('materyal')
      .upload(filePath, file);
    if (uploadError) {
      setStatusMsg({ type: 'error', text: 'Barkirina pelî têk çû: ' + uploadError.message });
    } else {
      const { data: publicUrlData } = supabase.storage
        .from('materyal')
        .getPublicUrl(filePath);
      if (publicUrlData?.publicUrl) {
        setFormData((prev) => ({ ...prev, [fieldName]: publicUrlData.publicUrl }));
        setStatusMsg({ type: 'success', text: 'Pel bi serkeftî hat barkirin!' });
      }
    }
    setUploadingField(null);
    event.target.value = '';
  };
  const handleSaveLesson = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });
    const payload = {
      title: formData.title.trim(),
      category_slug: formData.category_slug,
      media_type: formData.media_type,
      media_url: formData.media_url.trim(),
      thumbnail_url: formData.thumbnail_url.trim(),
      level: formData.level,
      grade_level: formData.grade_level,
      description: formData.description.trim(),
      teacher_guide: formData.teacher_guide.trim(),
      guide_pdf_url: formData.guide_pdf_url.trim()
    };
    if (editingId) {
      const { error } = await supabase.from('lessons').update(payload).eq('id', editingId);
      if (error) {
        setStatusMsg({ type: 'error', text: 'Çewtî çêbû: ' + error.message });
      } else {
        setStatusMsg({ type: 'success', text: 'Ders bi serkeftî hat nûkirin!' });
        resetForm();
        fetchAllData();
      }
    } else {
      const { error } = await supabase.from('lessons').insert([payload]);
      if (error) {
        setStatusMsg({ type: 'error', text: 'Çewtî çêbû: ' + error.message });
      } else {
        setStatusMsg({ type: 'success', text: 'Materyala nû li malperê hat zêdekirin!' });
        resetForm();
        fetchAllData();
      }
    }
  };
  const startEditing = (lesson) => {
    setActiveLesson(null);
    setViewMode('admin');
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
  const resetForm = () => {
    setEditingId(null);
    setFormData({
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
  };
  const handleDeleteLesson = async (id) => {
    if (!window.confirm('Tu piştrast î ku dixwazî vê materyalê jê bibî?')) return;
    const { error } = await supabase.from('lessons').delete().eq('id', id);
    if (!error) {
      fetchAllData();
    }
  };
  const handleUpdateCategoryName = (slug, newName) => {
    setCategories((prev) =>
      prev.map((c) => (c.slug === slug ? { ...c, name: newName } : c))
    );
  };
  const handleSaveCategories = async () => {
    const { error } = await supabase
      .from('site_settings')
      .upsert(
        { key: 'categories_json', value: JSON.stringify(categories) },
        { onConflict: 'key' }
      );
    setCatMsg(
      error
        ? 'Çewtî: ' + error.message
        : 'Navên beşan hatin tomarkirin!'
    );
    setTimeout(() => setCatMsg(''), 3500);
  };
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const slug = newCatName
      .toLowerCase()
      .trim()
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ı/g, 'i')
      .replace(/î/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ş/g, 's')
      .replace(/ü/g, 'u')
      .replace(/û/g, 'u')
      .replace(/ê/g, 'e')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    if (!slug) return;
    const updated = [...categories, { slug, name: newCatName.trim() }];
    setCategories(updated);
    setNewCatName('');
    await supabase
      .from('site_settings')
      .upsert(
        { key: 'categories_json', value: JSON.stringify(updated) },
        { onConflict: 'key' }
      );
    setCatMsg('Beşa nû hat zêdekirin!');
    setTimeout(() => setCatMsg(''), 3000);
  };
  const handleDeleteCategory = async (slug) => {
    if (categories.length <= 1) return;
    const updated = categories.filter((c) => c.slug !== slug);
    setCategories(updated);
    if (selectedCategory === slug) setSelectedCategory('all');
    await supabase
      .from('site_settings')
      .upsert(
        { key: 'categories_json', value: JSON.stringify(updated) },
        { onConflict: 'key' }
      );
    setCatMsg('Beş hat jêbirin.');
    setTimeout(() => setCatMsg(''), 3000);
  };
  const handleSaveAllUiTexts = async (e) => {
    e.preventDefault();
    const langPrefix = `${selectedLang.toLowerCase()}_`;
    const rows = Object.entries(ui).map(([k, v]) => ({
      key: `${langPrefix}${k}`,
      value: v
    }));
    if (selectedLang === 'KU') {
      Object.entries(ui).forEach(([k, v]) => {
        rows.push({ key: k, value: v });
      });
    }
    const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
    setSettingsMsg(
      error
        ? 'Çewtî: ' + error.message
        : `Hemû nivîsên malperê (${selectedLang}) bi serkeftî hatin tomarkirin!`
    );
    setTimeout(() => setSettingsMsg(''), 3500);
  };
  const recordSearchHistory = (term) => {
    const clean = term.trim();
    if (!clean) return;
    setSearchHistory((prev) => {
      const next = [clean, ...prev.filter((t) => t.toLowerCase() !== clean.toLowerCase())].slice(0, 8);
      try {
        localStorage.setItem('kk_search_history', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };
  const toggleFavoriteWord = (word) => {
    if (!word) return;
    setFavoriteWords((prev) => {
      const exists = prev.includes(word);
      const next = exists ? prev.filter((w) => w !== word) : [word, ...prev];
      try {
        localStorage.setItem('kk_favorite_words', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };
  const getWordMeaningByLang = (item, lang = selectedLang) => {
    if (!item) return '';
    const i18n = item.meanings_i18n || {};
    if (i18n[lang]) return i18n[lang];
    if (lang === 'TR' && item.meaning_tr) return item.meaning_tr;
    if (lang === 'EN' && item.meaning_en) return item.meaning_en;
    if (lang === 'KU' && item.meaning_ku) return item.meaning_ku;
    return (
      i18n.KU ||
      i18n.TR ||
      i18n.EN ||
      item.meaning_ku ||
      item.meaning_tr ||
      item.meaning_en ||
      Object.values(i18n).find(Boolean) ||
      ''
    );
  };
  const getWordExampleByLang = (item, lang = selectedLang) => {
    if (!item) return '';
    const exMap = item.examples_i18n || {};
    return exMap[lang] || exMap.KU || exMap.EN || exMap.TR || item.example_sentence || '';
  };
  const playDictionaryPronunciation = (item) => {
    if (!item) return;
    if (item.audio_url) {
      playCurrentAudio(item.audio_url);
      return;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(item.word);
        utter.lang = selectedLang === 'TR' ? 'tr-TR' : selectedLang === 'EN' ? 'en-US' : 'ku';
        window.speechSynthesis.speak(utter);
      } catch {
        // ignore speech errors
      }
    }
  };
  const handleWordAudioUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingWordAudio(true);
    const fileExt = file.name.split('.').pop();
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `dictionary_audio/${safeName}`;
    const { error: uploadError } = await supabase.storage.from('materyal').upload(filePath, file);
    if (uploadError) {
      setWordMsg('Barkirina dengî têk çû: ' + uploadError.message);
    } else {
      const { data: publicData } = supabase.storage.from('materyal').getPublicUrl(filePath);
      if (publicData?.publicUrl) {
        setWordForm((prev) => ({ ...prev, audio_url: publicData.publicUrl }));
        setWordMsg('Dengê telaffuzê hat barkirin!');
      }
    }
    setUploadingWordAudio(false);
    e.target.value = '';
  };
  const handleSaveWord = async (e) => {
    e.preventDefault();
    const activeMeaning = (
      wordForm.meanings_i18n?.[selectedLang] ?? wordForm.meaning_tr ?? ''
    ).trim();
    if (!wordForm.word.trim() || !activeMeaning) return;
    const activeExample = (
      wordForm.examples_i18n?.[selectedLang] ?? wordForm.example_sentence ?? ''
    ).trim();
    const updatedMeanings = {
      ...(wordForm.meanings_i18n || {}),
      [selectedLang]: activeMeaning
    };
    const updatedExamples = {
      ...(wordForm.examples_i18n || {}),
      ...(activeExample ? { [selectedLang]: activeExample } : {})
    };
    const payload = {
      word: wordForm.word.trim(),
      part_of_speech: wordForm.part_of_speech,
      meaning_tr: selectedLang === 'TR' ? activeMeaning : (wordForm.meaning_tr || '').trim(),
      meaning_en: selectedLang === 'EN' ? activeMeaning : (wordForm.meaning_en || '').trim(),
      meaning_ku: selectedLang === 'KU' ? activeMeaning : (wordForm.meaning_ku || '').trim(),
      example_sentence: activeExample,
      audio_url: (wordForm.audio_url || '').trim(),
      meanings_i18n: updatedMeanings,
      examples_i18n: updatedExamples
    };
    if (editingWordId) {
      const { error } = await supabase.from('dictionary').update(payload).eq('id', editingWordId);
      if (error) {
        setWordMsg('Çewtî: ' + error.message);
      } else {
        setWordMsg('Peyv bi serkeftî hat nûkirin!');
        resetWordForm();
        fetchAllData();
      }
    } else {
      const { error } = await supabase.from('dictionary').insert([payload]);
      if (error) {
        setWordMsg('Çewtî: ' + error.message);
      } else {
        setWordMsg('Peyva nû li ferhengê hat zêdekirin!');
        resetWordForm();
        fetchAllData();
      }
    }
    setTimeout(() => setWordMsg(''), 3500);
  };
  const startEditingWord = (item) => {
    setEditingWordId(item.id);
    setWordForm({
      word: item.word || '',
      part_of_speech: item.part_of_speech || 'navdêr',
      meaning_tr: item.meaning_tr || '',
      meaning_en: item.meaning_en || '',
      meaning_ku: item.meaning_ku || '',
      example_sentence: item.example_sentence || '',
      audio_url: item.audio_url || '',
      meanings_i18n: {
        KU: item.meanings_i18n?.KU || item.meaning_ku || '',
        ZZA: item.meanings_i18n?.ZZA || '',
        CKB: item.meanings_i18n?.CKB || '',
        TR: item.meanings_i18n?.TR || item.meaning_tr || '',
        EN: item.meanings_i18n?.EN || item.meaning_en || '',
        DE: item.meanings_i18n?.DE || '',
        FR: item.meanings_i18n?.FR || '',
        IT: item.meanings_i18n?.IT || ''
      },
      examples_i18n: {
        KU: item.examples_i18n?.KU || item.example_sentence || '',
        ZZA: item.examples_i18n?.ZZA || '',
        CKB: item.examples_i18n?.CKB || '',
        TR: item.examples_i18n?.TR || '',
        EN: item.examples_i18n?.EN || '',
        DE: item.examples_i18n?.DE || '',
        FR: item.examples_i18n?.FR || '',
        IT: item.examples_i18n?.IT || ''
      }
    });
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
      examples_i18n: {
        KU: '',
        ZZA: '',
        CKB: '',
        TR: '',
        EN: '',
        DE: '',
        FR: '',
        IT: ''
      }
    });
  };
  const handleDeleteWord = async (id) => {
    if (!window.confirm('Tu piştrast î ku dixwazî vê peyvê jê bibî?')) return;
    const { error } = await supabase.from('dictionary').delete().eq('id', id);
    if (!error) {
      if (editingWordId === id) resetWordForm();
      fetchAllData();
    }
  };
  const handleBulkImportDictionary = async () => {
    setSyncingProgress('Peyvên bingehîn tên tomarkirin...');
    let added = 0;
    const existingSet = new Set(
      dictionaryWords.map((w) => normalizeKurdish(w.word || ''))
    );
    for (const entry of BUILTIN_DICTIONARY) {
      const key = normalizeKurdish(entry.word);
      if (existingSet.has(key)) continue;
      const { error } = await supabase.from('dictionary').insert([
        {
          word: entry.word,
          part_of_speech: entry.part_of_speech,
          meaning_tr: entry.meaning_tr,
          meaning_en: entry.meaning_en,
          meaning_ku: entry.meaning_ku,
          example_sentence: entry.example_sentence,
          meanings_i18n: entry.meanings_i18n,
          examples_i18n: entry.examples_i18n
        }
      ]);
      if (!error) {
        added += 1;
        existingSet.add(key);
      }
    }
    setSyncingProgress('');
    setWordMsg(`${added} peyvên nû li ferhengê hatin zêdekirin.`);
    fetchAllData();
    setTimeout(() => setWordMsg(''), 4000);
  };
  useEffect(() => {
    const trimmed = ferhengQuery.trim();
    if (!trimmed || trimmed.length < 2) {
      setWiktionaryMatches([]);
      setSearchingDict(false);
      return;
    }
    let cancelled = false;
    setSearchingDict(true);
    const timer = setTimeout(async () => {
      try {
        const entry = await fetchWiktionaryEntry(trimmed, selectedLang);
        if (cancelled) return;
        if (entry) {
          setWiktionaryMatches([entry]);
        } else {
          setWiktionaryMatches([]);
        }
      } catch {
        if (!cancelled) setWiktionaryMatches([]);
      } finally {
        if (!cancelled) setSearchingDict(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [ferhengQuery, selectedLang]);
  const handleDictionarySearchSubmit = (e) => {
    e.preventDefault();
    if (ferhengQuery.trim()) {
      recordSearchHistory(ferhengQuery.trim());
    }
  };
  const effectiveExercises = (() => {
    const base = gamesReset ? exercises : [...exercises];
    return [...base].sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
  })();
  const combinedDictionary = (() => {
    const map = new Map();
    BUILTIN_DICTIONARY.forEach((item) => {
      const key = normalizeKurdish(item.word || '');
      if (key) {
        map.set(key, { ...item, sourceType: 'builtin' });
      }
    });
    dictionaryWords.forEach((item) => {
      const key = normalizeKurdish(item.word || '');
      if (key) {
        const prev = map.get(key);
        map.set(key, {
          ...(prev || {}),
          ...item,
          meanings_i18n: {
            ...(prev?.meanings_i18n || {}),
            ...(item.meanings_i18n || {})
          },
          examples_i18n: {
            ...(prev?.examples_i18n || {}),
            ...(item.examples_i18n || {})
          },
          sourceType: 'db'
        });
      }
    });
    wiktionaryMatches.forEach((item) => {
      const key = normalizeKurdish(item.word || '');
      if (key) {
        const existing = map.get(key);
        if (existing) {
          map.set(key, {
            ...existing,
            meanings_i18n: {
              ...(item.meanings_i18n || {}),
              ...(existing.meanings_i18n || {})
            },
            examples_i18n: {
              ...(item.examples_i18n || {}),
              ...(existing.examples_i18n || {})
            }
          });
        } else {
          map.set(key, { ...item, sourceType: 'wiktionary' });
        }
      }
    });
    return Array.from(map.values());
  })();
  const filteredDictionary = (() => {
    const rawQ = ferhengQuery.trim();
    const normQ = normalizeKurdish(rawQ);
    if (!normQ) {
      return combinedDictionary
        .filter((item) => {
          if (selectedLetter === 'all') return true;
          const firstChar = (item.word || '').trim().charAt(0).toLocaleUpperCase('tr');
          return normalizeKurdish(firstChar) === normalizeKurdish(selectedLetter);
        })
        .sort((a, b) =>
          (a.word || '').localeCompare(b.word || '', ['ku', 'tr', 'en'], {
            sensitivity: 'base'
          })
        );
    }
    return combinedDictionary
      .map((item) => {
        const wNorm = normalizeKurdish(item.word || '');
        const trNorm = normalizeKurdish(item.meaning_tr || '');
        const enNorm = normalizeKurdish(item.meaning_en || '');
        const kuNorm = normalizeKurdish(item.meaning_ku || '');
        const activeLangMeaningNorm = normalizeKurdish(getWordMeaningByLang(item, selectedLang));
        const allI18nValues = Object.values(item.meanings_i18n || {})
          .map((v) => normalizeKurdish(String(v || '')))
          .filter(Boolean);
        let score = 0;
        if (wNorm === normQ) score = 100;
        else if (activeLangMeaningNorm === normQ) score = 96;
        else if (trNorm.split(/[,;/]/).map((s) => s.trim()).includes(normQ)) score = 95;
        else if (enNorm.split(/[,;/]/).map((s) => s.trim()).includes(normQ)) score = 95;
        else if (allI18nValues.includes(normQ)) score = 92;
        else if (wNorm.startsWith(normQ)) score = 80;
        else if (activeLangMeaningNorm.startsWith(normQ)) score = 78;
        else if (trNorm.startsWith(normQ) || enNorm.startsWith(normQ)) score = 75;
        else if (allI18nValues.some((v) => v.startsWith(normQ))) score = 72;
        else if (wNorm.includes(normQ)) score = 60;
        else if (activeLangMeaningNorm.includes(normQ)) score = 55;
        else if (trNorm.includes(normQ) || enNorm.includes(normQ)) score = 50;
        else if (allI18nValues.some((v) => v.includes(normQ))) score = 45;
        else if (kuNorm.includes(normQ)) score = 35;
        return { ...item, _score: score };
      })
      .filter((item) => item._score > 0)
      .sort(
        (a, b) =>
          b._score - a._score ||
          (a.word || '').localeCompare(b.word || '', ['ku', 'tr', 'en'], {
            sensitivity: 'base'
          })
      );
  })();
  const filteredLessons = lessons.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category_slug === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || item.level === selectedLevel;
    const matchesMedia = selectedMedia === 'all' || item.media_type === selectedMedia;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.teacher_guide && item.teacher_guide.toLowerCase().includes(q));
    return matchesCategory && matchesLevel && matchesMedia && matchesSearch;
  });
  const handleOpenLesson = (lesson) => {
    setActiveLesson(lesson);
    setLessonTab('content');
    setMediaLoadError('');
  };
  const renderLessonMediaViewer = (lesson) => {
    if (!lesson?.media_url) {
      return (
        <div className="p-8 text-center bg-slate-100 rounded-xl text-slate-600">
          Vê materyalê hîn lînkeke medyayê tune.
        </div>
      );
    }
    const ytEmbed = getYouTubeEmbedUrl(lesson.media_url);
    if (ytEmbed || lesson.media_type === 'video') {
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
      return (
        <div className="space-y-3">
          <video
            src={lesson.media_url}
            controls
            onError={() =>
              setMediaLoadError('Vîdyo nehat barkirin. Lînkê kontrol bikin an di pencereya nû de vekin.')
            }
            className="w-full max-h-[480px] rounded-xl bg-black"
          />
          {mediaLoadError && (
            <p className="text-sm text-red-600 font-medium">{mediaLoadError}</p>
          )}
        </div>
      );
    }
    if (lesson.media_type === 'audio') {
      return (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
          <p className="text-sm font-medium text-slate-700">Dengê Dersê:</p>
          <audio
            src={lesson.media_url}
            controls
            onError={() =>
              setMediaLoadError('Pelê dengî nehat barkirin.')
            }
            className="w-full"
          />
          {mediaLoadError && (
            <p className="text-sm text-red-600 font-medium">{mediaLoadError}</p>
          )}
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <iframe
          src={lesson.media_url}
          title={lesson.title}
          className="w-full h-[520px] rounded-xl border border-slate-200 bg-white"
        />
        <div className="flex justify-end">
          <a
            href={lesson.media_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:text-red-800"
          >
            <span>Di Pencereya Nû de Veke</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  };
  const getCategoryName = (slug) => {
    const found = categories.find((c) => c.slug === slug);
    return found ? found.name : slug;
  };
  const exerciseUnits = [...new Set(effectiveExercises.map((ex) => ex.unit_title).filter(Boolean))];
  const unitExercises = selectedUnit
    ? effectiveExercises.filter((ex) => ex.unit_title === selectedUnit)
    : [];
  const currentExercise = unitExercises[currentExIndex] || null;
  const playCurrentAudio = (url) => {
    const targetUrl = url || currentExercise?.audio_url;
    if (!targetUrl) return;
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    const audio = new Audio(targetUrl);
    audioPlayerRef.current = audio;
    setIsPlayingAudio(true);
    audio.onended = () => setIsPlayingAudio(false);
    audio.onerror = () => setIsPlayingAudio(false);
    audio.play().catch(() => setIsPlayingAudio(false));
  };
  const stopAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
    }
    setIsPlayingAudio(false);
  };
  const startUnit = (unitTitle) => {
    stopAudio();
    setSelectedUnit(unitTitle);
    setCurrentExIndex(0);
    setSelectedOption('');
    setBuiltWords([]);
    setAnswerState(null);
    setUnitCompleted(false);
    setHearts(5);
  };
  const exitUnit = () => {
    const wasZarokUnit =
      typeof selectedUnit === 'string' && selectedUnit.trim().toUpperCase().startsWith('ZAROK:');
    stopAudio();
    setSelectedUnit(null);
    setCurrentExIndex(0);
    setSelectedOption('');
    setBuiltWords([]);
    setAnswerState(null);
    setUnitCompleted(false);
    if (wasZarokUnit) {
      setViewMode('student');
      setSelectedCategory('zarok');
    }
  };
  const handleToggleWordToken = (word) => {
    if (answerState) return;
    setBuiltWords((prev) => [...prev, word]);
  };
  const handleRemoveBuiltWord = (idxToRemove) => {
    if (answerState) return;
    setBuiltWords((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };
  const handleCheckAnswer = () => {
    if (!currentExercise || answerState) return;
    let isCorrect = false;
    if (currentExercise.exercise_type === 'sentence') {
      const constructed = builtWords.join(' ').trim();
      isCorrect =
        normalizeKurdish(constructed) === normalizeKurdish(currentExercise.correct_answer || '');
    } else if (currentExercise.exercise_type === 'match') {
      isCorrect = true;
    } else {
      isCorrect =
        normalizeKurdish(selectedOption) === normalizeKurdish(currentExercise.correct_answer || '');
    }
    if (isCorrect) {
      const nextCombo = comboCount + 1;
      const earnedXp = 15 + Math.min(nextCombo - 1, 5) * 5;
      const nextXp = xpPoints + earnedXp;
      const nextStreak = streakDays === 0 ? 1 : streakDays;
      setComboCount(nextCombo);
      setXpPoints(nextXp);
      setStreakDays(nextStreak);
      setAnswerState({
        correct: true,
        message: `${ui.learn_correct_msg} (+${earnedXp} XP)`
      });
      persistProgressSnapshot(nextXp, nextStreak, completedUnits);
    } else {
      const nextHearts = Math.max(0, hearts - 1);
      setComboCount(0);
      setHearts(nextHearts);
      setAnswerState({
        correct: false,
        message: `${ui.learn_wrong_prefix} ${currentExercise.correct_answer}`
      });
      persistProgressSnapshot(xpPoints, streakDays, completedUnits);
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
      setCurrentExIndex((prev) => prev + 1);
    } else {
      setUnitCompleted(true);
      const nextXp = xpPoints + 25;
      const nextStreak = streakDays === 0 ? 1 : streakDays;
      const nextUnits =
        selectedUnit && !completedUnits.includes(selectedUnit)
          ? [...completedUnits, selectedUnit]
          : completedUnits;
      setXpPoints(nextXp);
      setStreakDays(nextStreak);
      setCompletedUnits(nextUnits);
      persistProgressSnapshot(nextXp, nextStreak, nextUnits);
    }
  };
  const handleExImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingExImg(true);
    const fileExt = file.name.split('.').pop();
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `exercises/${safeName}`;
    const { error: uploadError } = await supabase.storage.from('materyal').upload(filePath, file);
    if (uploadError) {
      setExMsg('Barkirina wêneyî têk çû: ' + uploadError.message);
    } else {
      const { data: publicData } = supabase.storage.from('materyal').getPublicUrl(filePath);
      if (publicData?.publicUrl) {
        setExForm((prev) => ({ ...prev, image_url: publicData.publicUrl }));
        setExMsg('Wêneyê pirsê bi serkeftî hat barkirin!');
      }
    }
    setUploadingExImg(false);
    e.target.value = '';
  };
  const handleExAudioUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingExAudio(true);
    const fileExt = file.name.split('.').pop();
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `exercises/audio/${safeName}`;
    const { error: uploadError } = await supabase.storage.from('materyal').upload(filePath, file);
    if (uploadError) {
      setExMsg('Barkirina dengî têk çû: ' + uploadError.message);
    } else {
      const { data: publicData } = supabase.storage.from('materyal').getPublicUrl(filePath);
      if (publicData?.publicUrl) {
        setExForm((prev) => ({ ...prev, audio_url: publicData.publicUrl }));
        setExMsg('Dengê pirsê bi serkeftî hat barkirin!');
      }
    }
    setUploadingExAudio(false);
    e.target.value = '';
  };
  const handleTriggerInlinePhotoUpload = (e, target) => {
    e.stopPropagation();
    if (!isAdmin || !inlinePhotoInputRef.current) return;
    setInlinePhotoTarget(target);
    inlinePhotoInputRef.current.value = '';
    inlinePhotoInputRef.current.click();
  };
  const handleSaveWordImage = (e, wordItem) => {
    handleTriggerInlinePhotoUpload(e, {
      wordId: wordItem.id,
      wordLabel: wordItem.word,
      mode: 'alfabe_word'
    });
  };
  const handleCreateAlfabeRound = async (e) => {
    e.preventDefault();
    const wordLines = alfabeRoundForm.wordsText
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 4);

    if (wordLines.length !== 4) {
      setExMsg('Ji kerema xwe tam 4 peyv binivîse.');
      return;
    }

    const imageLines = alfabeRoundForm.imagesText
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 4);

    const newEntries = wordLines.map((w, idx) => {
      const cleanChar = w.trim().charAt(0).toLocaleUpperCase('tr') || 'A';
      return {
        id: `alf-custom-${Date.now()}-${idx}`,
        word: w,
        letter: cleanChar,
        image_url: imageLines[idx] || ''
      };
    });

    const merged = [...newEntries, ...alfabeWords];
    setAlfabeWords(merged);
    try {
      localStorage.setItem('kk_alfabe_words', JSON.stringify(merged));
    } catch {
      // ignore storage errors
    }

    await supabase
      .from('site_settings')
      .upsert(
        { key: 'alfabe_words_json', value: JSON.stringify(merged) },
        { onConflict: 'key' }
      );

    if (alfabeRoundForm.roundTitle.trim()) {
      const unitLabel = alfabeRoundForm.roundTitle.trim();
      const exRows = newEntries.map((entry, idx) => ({
        unit_title: unitLabel,
        exercise_type: 'image',
        question_text: `Wêneyê "${entry.word}" hilbijêre`,
        options: newEntries.map((x) => x.word),
        correct_answer: entry.word,
        explanation: `${entry.letter} — ${entry.word}`,
        image_url: entry.image_url,
        audio_url: '',
        sort_order: exercises.length + idx + 1
      }));
      const { error } = await supabase.from('kurmanci_exercises').insert(exRows);
      if (!error) {
        fetchAllData();
      }
    }

    setAlfabeRoundForm({ roundTitle: '', wordsText: '', imagesText: '' });
    setExMsg('Lîstika nû ya 4 peyv û 4 wêneyan hat zêdekirin!');
  };
  const handleInlinePhotoFileSelected = async (e) => {
    const file = e.target.files?.[0];
    const target = inlinePhotoTarget;
    setInlinePhotoTarget(null);
    if (!file || !target || !isAdmin) return;
    setInlinePhotoSaving(true);
    setStatusMsg({ type: '', text: '' });
    setExMsg('');
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const folder =
        target.mode === 'question'
          ? 'exercises'
          : target.mode === 'alfabe_word'
          ? 'alfabe'
          : 'thumbnails';
      const filePath = `${folder}/${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from('materyal')
        .upload(filePath, file);
      if (uploadError) {
        throw new Error(uploadError.message);
      }
      const { data: publicData } = supabase.storage.from('materyal').getPublicUrl(filePath);
      const newUrl = publicData?.publicUrl;
      if (!newUrl) {
        throw new Error('URL-ya giştî ya wêneyî nehat wergirtin.');
      }
      if (target.mode === 'question' && target.exerciseId) {
        const { error: updateErr } = await supabase
          .from('kurmanci_exercises')
          .update({ image_url: newUrl })
          .eq('id', target.exerciseId);
        if (updateErr) throw new Error(updateErr.message);
        setExercises((prev) =>
          prev.map((item) =>
            item.id === target.exerciseId ? { ...item, image_url: newUrl } : item
          )
        );
        setBrokenExImages((prev) => {
          const copy = { ...prev };
          delete copy[target.exerciseId];
          return copy;
        });
        if (editingExId === target.exerciseId) {
          setExForm((prev) => ({ ...prev, image_url: newUrl }));
        }
        setExMsg('Wêneyê lîstikê bi serkeftî hat guhertin!');
      } else if (target.mode === 'alfabe_word' && target.wordId) {
        const updatedWords = alfabeWords.map((w) =>
          w.id === target.wordId ? { ...w, image_url: newUrl } : w
        );
        setAlfabeWords(updatedWords);
        try {
          localStorage.setItem('kk_alfabe_words', JSON.stringify(updatedWords));
        } catch {
          // ignore storage errors
        }
        await supabase
          .from('site_settings')
          .upsert(
            { key: 'alfabe_words_json', value: JSON.stringify(updatedWords) },
            { onConflict: 'key' }
          );
        setExMsg(`"${target.wordLabel || ''}" ji bo wêne bi serkeftî hat barkirin!`);
      } else if (target.mode === 'lesson' && target.lessonId) {
        const { error: updateErr } = await supabase
          .from('lessons')
          .update({ thumbnail_url: newUrl })
          .eq('id', target.lessonId);
        if (updateErr) throw new Error(updateErr.message);
        setLessons((prev) =>
          prev.map((item) =>
            item.id === target.lessonId ? { ...item, thumbnail_url: newUrl } : item
          )
        );
        setBrokenThumbs((prev) => {
          const copy = { ...prev };
          delete copy[target.lessonId];
          return copy;
        });
        if (activeLesson?.id === target.lessonId) {
          setActiveLesson((prev) => (prev ? { ...prev, thumbnail_url: newUrl } : prev));
        }
        if (editingId === target.lessonId) {
          setFormData((prev) => ({ ...prev, thumbnail_url: newUrl }));
        }
        setStatusMsg({ type: 'success', text: 'Wêneyê materyalê bi serkeftî hat guhertin!' });
      }
    } catch (err) {
      const errText = 'Guhertina wêneyî têk çû: ' + (err?.message || 'Çewtiya nenas');
      if (target.mode === 'question' || target.mode === 'alfabe_word') {
        setExMsg(errText);
      } else {
        setStatusMsg({ type: 'error', text: errText });
      }
    } finally {
      setInlinePhotoSaving(false);
      e.target.value = '';
    }
  };
  const handleSaveExercise = async (e) => {
    e.preventDefault();
    if (!exForm.unit_title.trim() || !exForm.question_text.trim() || !exForm.correct_answer.trim()) {
      return;
    }
    const parsedOptions = exForm.options_raw
      .split(/\n|\|/)
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      unit_title: exForm.unit_title.trim(),
      exercise_type: exForm.exercise_type,
      question_text: exForm.question_text.trim(),
      options:
        parsedOptions.length > 0
          ? parsedOptions
          : [exForm.correct_answer.trim()],
      correct_answer: exForm.correct_answer.trim(),
      explanation: exForm.explanation.trim(),
      image_url: exForm.image_url.trim(),
      audio_url: exForm.audio_url.trim(),
      sort_order: editingExId
        ? undefined
        : exercises.length > 0
        ? Math.max(...exercises.map((x) => x.sort_order || 0)) + 1
        : 1
    };
    if (payload.sort_order === undefined) {
      delete payload.sort_order;
    }
    if (editingExId) {
      const { error } = await supabase
        .from('kurmanci_exercises')
        .update(payload)
        .eq('id', editingExId);
      if (error) {
        setExMsg('Çewtî: ' + error.message);
      } else {
        setGamesReset(false);
        await supabase
          .from('site_settings')
          .upsert({ key: 'games_reset', value: 'false' }, { onConflict: 'key' });
        setExMsg('Lîstik bi serkeftî hat nûkirin!');
        resetExForm();
        fetchAllData();
      }
    } else {
      const { error } = await supabase.from('kurmanci_exercises').insert([payload]);
      if (error) {
        setExMsg('Çewtî: ' + error.message);
      } else {
        setGamesReset(false);
        await supabase
          .from('site_settings')
          .upsert({ key: 'games_reset', value: 'false' }, { onConflict: 'key' });
        setExMsg('Lîstika nû hat zêdekirin!');
        resetExForm();
        fetchAllData();
      }
    }
    setTimeout(() => setExMsg(''), 3500);
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
  const handleDeleteExercise = async (id) => {
    if (!window.confirm('Tu piştrast î ku dixwazî vê lîstikê jê bibî?')) return;
    const { error } = await supabase.from('kurmanci_exercises').delete().eq('id', id);
    if (!error) {
      if (editingExId === id) resetExForm();
      fetchAllData();
    }
  };
  const handleResetAllGames = async () => {
    const confirmed = window.confirm(
      'Hişyarî: Ev kiryar dê hemû lîstik û pirsên di tabloya kurmanci_exercises de û her wiha xalên XP û qonaxên qedandî jê bibe/sifir bike. Tu piştrast î?'
    );
    if (!confirmed) return;
    stopAudio();
    const { error: deleteExError } = await supabase
      .from('kurmanci_exercises')
      .delete()
      .not('id', 'is', null);
    if (deleteExError) {
      setExMsg('Sifirkirina lîstikan têk çû: ' + deleteExError.message);
      return;
    }
    setExercises([]);
    setGamesReset(true);
    setSelectedUnit(null);
    setCurrentExIndex(0);
    setSelectedOption('');
    setBuiltWords([]);
    setAnswerState(null);
    setComboCount(0);
    setHearts(5);
    setXpPoints(0);
    setStreakDays(0);
    setCompletedUnits([]);
    setUnitCompleted(false);
    await persistProgressSnapshot(0, 0, []);
    await supabase
      .from('site_settings')
      .upsert({ key: 'games_reset', value: 'true' }, { onConflict: 'key' });
    setExMsg('Hemû lîstik û pirs hatin sifirkirin.');
    setTimeout(() => setExMsg(''), 4000);
  };
  const adminExerciseUnits = [...new Set(exercises.map((ex) => ex.unit_title).filter(Boolean))];
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
                        selectedLang === opt.code ? 'font-bold text-red-700 bg-red-50/50' : 'text-slate-700'
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
                  <p className="text-sm text-slate-500 max-w-md mx-auto">{ui.empty_subtitle}</p>
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
                    const mediaObj = dynamicMediaTypes.find((m) => m.id === lesson.media_type);
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
                                setBrokenThumbs((prev) => ({ ...prev, [lesson.id]: true }))
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
                              title="Wêneyê materyalê biguherîne"
                              className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-slate-800 border border-slate-200 shadow-sm px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1"
                            >
                              <ImageIcon className="w-3.5 h-3.5 text-red-700" />
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
                              {ui.meta_level_prefix} <strong className="text-slate-700">{lesson.level}</strong>
                            </span>
                            <span>
                              {ui.meta_grade_prefix} <strong className="text-slate-700">{lesson.grade_level}</strong>
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
              onTriggerPhotoUpload={handleTriggerInlinePhotoUpload}
              onSaveWordImage={handleSaveWordImage}
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
                    {exerciseUnits.map((uTitle, idx) => (
                      <button
                        key={uTitle}
                        type="button"
                        onClick={() => startUnit(uTitle)}
                        className="p-4 rounded-xl border border-slate-200 hover:border-red-300 text-left bg-slate-50/60 hover:bg-red-50/30 transition"
                      >
                        <div className="text-xs font-bold text-red-700">
                          {ui.learn_stage_prefix} {idx + 1}
                        </div>
                        <div className="font-bold text-slate-900 mt-0.5">{uTitle}</div>
                      </button>
                    ))}
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
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                      <span>{selectedUnit}</span>
                      <span>
                        {currentExIndex + 1} / {unitExercises.length}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">{currentExercise.question_text}</p>
                    {currentExercise.image_url && !brokenExImages[currentExercise.id] && (
                      <img
                        src={currentExercise.image_url}
                        alt={currentExercise.question_text}
                        onError={() =>
                          setBrokenExImages((prev) => ({ ...prev, [currentExercise.id]: true }))
                        }
                        className="max-h-60 rounded-xl border border-slate-200 object-contain bg-white p-1"
                      />
                    )}
                    {currentExercise.audio_url && (
                      <button
                        type="button"
                        onClick={() =>
                          isPlayingAudio ? stopAudio() : playCurrentAudio(currentExercise.audio_url)
                        }
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800"
                      >
                        <Volume2 className="w-4 h-4 text-red-700" />
                        <span>{isPlayingAudio ? 'Deng rawestîne' : 'Deng guhdar bike'}</span>
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
                          const label = opt.includes('=') ? opt.split('=')[0].trim() : opt;
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
                  {combinedDictionary.length} peyv (DB: {totalWordCount || dictionaryWords.length})
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
                          <p className="text-sm font-semibold text-slate-800">{meaningText}</p>
                        )}
                        {exampleText && (
                          <p className="text-xs italic text-slate-500">“{exampleText}”</p>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                        <span>{item.sourceType === 'wiktionary' ? 'Wiktionary' : 'Ferheng'}</span>
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
                    <h1 className="text-xl font-extrabold text-slate-900">Têketina Rêveber</h1>
                    <p className="text-xs text-slate-500">Şîfreya rêveberiyê binivîse</p>
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
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900">
                        Lîstika Nû ya ALFABE: 4 Peyv û 4 Wêne
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        4 peyv û (heke hebe) 4 lînkên wêneyan binivîse da ku rasterast li serê lîstikê werin zêdekirin.
                      </p>
                    </div>
                  </div>
                  {exMsg && (
                    <div className="p-3 rounded-xl bg-red-50 text-red-800 border border-red-200 text-xs font-bold">
                      {exMsg}
                    </div>
                  )}
                  <form onSubmit={handleCreateAlfabeRound} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Navê Qonaxê (Opsiyonel)
                      </label>
                      <input
                        type="text"
                        value={alfabeRoundForm.roundTitle}
                        onChange={(e) =>
                          setAlfabeRoundForm((prev) => ({ ...prev, roundTitle: e.target.value }))
                        }
                        placeholder="Mînak: ALFABE - Koma 1"
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
                          setAlfabeRoundForm((prev) => ({ ...prev, wordsText: e.target.value }))
                        }
                        placeholder={'Agir\nBilbil\nCemed\nÇay'}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        4 Lînkên Wêneyan (Opsiyonel)
                      </label>
                      <textarea
                        rows={3}
                        value={alfabeRoundForm.imagesText}
                        onChange={(e) =>
                          setAlfabeRoundForm((prev) => ({ ...prev, imagesText: e.target.value }))
                        }
                        placeholder="https://... (her rêzek ji bo wêneyekî)"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div className="md:col-span-3 flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-sm font-bold"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Lîstika 4 Peyv û 4 Wêneyan Lê Zêde Bike</span>
                      </button>
                    </div>
                  </form>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
                  <h2 className="text-lg font-extrabold text-slate-900">
                    {editingId ? 'Materyalê Biguherîne' : 'Materyala Nû Lê Zêde Bike'}
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
                  <form onSubmit={handleSaveLesson} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sernav</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Beş</label>
                      <select
                        value={formData.category_slug}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, category_slug: e.target.value }))
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
                          setFormData((prev) => ({ ...prev, media_type: e.target.value }))
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
                            setFormData((prev) => ({ ...prev, media_url: e.target.value }))
                          }
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm"
                        />
                        <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold cursor-pointer flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingField === 'media_url' ? '...' : 'Bar Bike'}</span>
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
                        Wêneyê Bergê (Thumbnail URL)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.thumbnail_url}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, thumbnail_url: e.target.value }))
                          }
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm"
                        />
                        <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold cursor-pointer flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingField === 'thumbnail_url' ? '...' : 'Wêne'}</span>
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
                      <label className="block text-xs font-bold text-slate-700 mb-1">Ast</label>
                      <input
                        type="text"
                        value={formData.level}
                        onChange={(e) => setFormData((prev) => ({ ...prev, level: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Pol</label>
                      <input
                        type="text"
                        value={formData.grade_level}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, grade_level: e.target.value }))
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        PDF-ya Rêbera Mamosteyan (URL)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.guide_pdf_url}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, guide_pdf_url: e.target.value }))
                          }
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm"
                        />
                        <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold cursor-pointer flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingField === 'guide_pdf_url' ? '...' : 'PDF'}</span>
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
                          setFormData((prev) => ({ ...prev, description: e.target.value }))
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
                          setFormData((prev) => ({ ...prev, teacher_guide: e.target.value }))
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
                            {getCategoryName(item.category_slug)} • {item.level} • {item.grade_level}
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
                    {catMsg && <span className="text-xs font-bold text-emerald-700">{catMsg}</span>}
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
                          onChange={(e) => handleUpdateCategoryName(cat.slug, e.target.value)}
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
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-red-700" />
                      <span>Lîstik û Pirs ({exercises.length})</span>
                    </h2>
                    <button
                      type="button"
                      onClick={handleResetAllGames}
                      className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold"
                    >
                      Hemû Lîstikan Sifir Bike
                    </button>
                  </div>
                  <form onSubmit={handleSaveExercise} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Navê Qonaxê (Unit)
                      </label>
                      <input
                        type="text"
                        required
                        value={exForm.unit_title}
                        onChange={(e) =>
                          setExForm((prev) => ({ ...prev, unit_title: e.target.value }))
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Cureyê Pirsê
                      </label>
                      <select
                        value={exForm.exercise_type}
                        onChange={(e) =>
                          setExForm((prev) => ({ ...prev, exercise_type: e.target.value }))
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      >
                        <option value="choice">{ui.learn_type_choice}</option>
                        <option value="sentence">{ui.learn_type_sentence}</option>
                        <option value="match">{ui.learn_type_match}</option>
                        <option value="fill">{ui.learn_type_fill}</option>
                        <option value="image">{ui.learn_type_image}</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nivîsa Pirsê
                      </label>
                      <input
                        type="text"
                        required
                        value={exForm.question_text}
                        onChange={(e) =>
                          setExForm((prev) => ({ ...prev, question_text: e.target.value }))
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Vebijêrk (her rêzek vebijêrkek)
                      </label>
                      <textarea
                        rows={3}
                        value={exForm.options_raw}
                        onChange={(e) =>
                          setExForm((prev) => ({ ...prev, options_raw: e.target.value }))
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
                            setExForm((prev) => ({ ...prev, correct_answer: e.target.value }))
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
                            setExForm((prev) => ({ ...prev, explanation: e.target.value }))
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Wêneyê Pirsê (URL)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={exForm.image_url}
                          onChange={(e) =>
                            setExForm((prev) => ({ ...prev, image_url: e.target.value }))
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
                        Dengê Pirsê (URL)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={exForm.audio_url}
                          onChange={(e) =>
                            setExForm((prev) => ({ ...prev, audio_url: e.target.value }))
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
                        {editingExId ? 'Pirsê Nû Bike' : 'Pirsê Lê Zêde Bike'}
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
                      placeholder="Di pirsan de bigere..."
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div className="divide-y divide-slate-100">
                    {filteredAdminExercises.map((ex) => (
                      <div
                        key={ex.id}
                        className="py-3 flex items-center justify-between gap-3 flex-wrap"
                      >
                        <div>
                          <div className="font-bold text-sm text-slate-900">{ex.question_text}</div>
                          <div className="text-xs text-slate-500">
                            {ex.unit_title} • Bersiv: {ex.correct_answer}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEditingExercise(ex)}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteExercise(ex.id)}
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700"
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
                        <span className="text-xs font-bold text-amber-700">{syncingProgress}</span>
                      )}
                      {wordMsg && <span className="text-xs font-bold text-emerald-700">{wordMsg}</span>}
                      <button
                        type="button"
                        onClick={handleBulkImportDictionary}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                      >
                        Peyvên Bingehîn Bar Bike
                      </button>
                    </div>
                  </div>
                  <form onSubmit={handleSaveWord} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Peyv</label>
                      <input
                        type="text"
                        required
                        value={wordForm.word}
                        onChange={(e) => setWordForm((prev) => ({ ...prev, word: e.target.value }))}
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
                          setWordForm((prev) => ({ ...prev, part_of_speech: e.target.value }))
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
                        value={wordForm.meanings_i18n?.[selectedLang] ?? wordForm.meaning_tr ?? ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setWordForm((prev) => ({
                            ...prev,
                            meaning_tr: selectedLang === 'TR' ? val : prev.meaning_tr,
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
                        value={wordForm.examples_i18n?.[selectedLang] ?? wordForm.example_sentence ?? ''}
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
                            setWordForm((prev) => ({ ...prev, audio_url: e.target.value }))
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
                          <span className="font-bold text-sm text-slate-900">{wItem.word}</span>
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
                      <span className="text-xs font-bold text-emerald-700">{settingsMsg}</span>
                    )}
                  </div>
                  <form onSubmit={handleSaveAllUiTexts} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {UI_FIELD_LABELS.map((f) => (
                      <div key={f.key}>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {f.label}
                        </label>
                        <input
                          type="text"
                          value={ui[f.key] || ''}
                          onChange={(e) =>
                            setRawUi((prev) => ({ ...prev, [f.key]: e.target.value }))
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
                <h3 className="text-base font-bold text-slate-900">{ui.guide_heading}</h3>
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
