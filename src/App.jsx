import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Search,
  BookOpen,
  Video,
  FileText,
  Headphones,
  Plus,
  Trash2,
  Edit3,
  Lock,
  LogOut,
  Filter,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X,
  Upload,
  FolderEdit,
  Settings,
  ClipboardList,
  Download,
  BookA,
  Sparkles,
  Award,
  Heart,
  RotateCcw,
  ChevronDown,
  Flame,
  Check,
  Zap,
  Image as ImageIcon,
  Eye,
  LayoutDashboard,
  Volume2,
  Star,
  History
} from 'lucide-react';
// =========================================================================
// SUPABASE BAĞLANTI AYARLARI
// =========================================================================
const SUPABASE_URL = 'https://mzsxryxuvyllljvbrzul.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_a_Ujek9gxuIV9vESF2xl4A_ibpGwUV_';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// Not: İstemci tarafı ADMIN_PASS yalnızca arayüz kilidi içindir;
// üretim güvenliği için Supabase RLS politikaları ile desteklenmelidir.
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS || 'kurdiklass2026';
const DEFAULT_CATEGORIES = [
  { slug: 'zanist', name: 'ZANIST', sort_order: 1 },
  { slug: 'birkari', name: 'BÎRKARÎ', sort_order: 2 },
  { slug: 'ziman-u-wejeya-kurdi', name: 'ZIMAN û WÊJEYA KURDÎ', sort_order: 3 },
  { slug: 'zarok', name: 'ZAROK', sort_order: 4 },
  { slug: 'huner', name: 'HUNER', sort_order: 5 },
  { slug: 'teknoloji', name: 'TEKNOLOJÎ', sort_order: 6 }
];
const LANGUAGE_OPTIONS = [
  { code: 'KU', nativeName: 'Kurmancî' },
  { code: 'ZZA', nativeName: 'Zazakî' },
  { code: 'CKB', nativeName: 'Soranî' },
  { code: 'TR', nativeName: 'Türkçe' },
  { code: 'EN', nativeName: 'English' },
  { code: 'DE', nativeName: 'Deutsch' },
  { code: 'FR', nativeName: 'Français' },
  { code: 'IT', nativeName: 'Italiano' }
];
const ALFABE_BASE_URL = '';
const ALFABE_DEFAULT_EXT = 'png';
const ALFABE_SHEET_SRC = '/alfabe-gisti-2.png';
const ALFABE_IMAGE_URLS = {
  Agir: '',
  Bilbil: '',
  Cemed: '',
  Çay: '',
  Dar: '',
  Endezyar: '',
  Êlek: '',
  Ferheng: '',
  Gore: '',
  Hesp: '',
  Tivir: '',
  Îsot: '',
  Jûjî: '',
  Ker: '',
  Lembe: '',
  Masî: '',
  Nan: '',
  Roj: '',
  Pisîk: '',
  Qaz: '',
  Rovî: '',
  Stêrk: '',
  Şêr: '',
  Telefon: '',
  Guh: '',
  Gûz: '',
  Nivîn: '',
  Werdek: '',
  Xiyar: '',
  Heyv: '',
  Zebeş: ''
};
const RAW_ALFABE_ITEMS = [
  { letter: 'A', word: 'Agir', image: '' },
  { letter: 'B', word: 'Bilbil', image: '' },
  { letter: 'C', word: 'Cemed', image: '' },
  { letter: 'Ç', word: 'Çay', image: '' },
  { letter: 'D', word: 'Dar', image: '' },
  { letter: 'E', word: 'Endezyar', image: '' },
  { letter: 'Ê', word: 'Êlek', image: '' },
  { letter: 'F', word: 'Ferheng', image: '' },
  { letter: 'G', word: 'Gore', image: '' },
  { letter: 'H', word: 'Hesp', image: '' },
  { letter: 'I', word: 'Tivir', image: '' },
  { letter: 'Î', word: 'Îsot', image: '' },
  { letter: 'J', word: 'Jûjî', image: '' },
  { letter: 'K', word: 'Ker', image: '' },
  { letter: 'L', word: 'Lembe', image: '' },
  { letter: 'M', word: 'Masî', image: '' },
  { letter: 'N', word: 'Nan', image: '' },
  { letter: 'O', word: 'Roj', image: '' },
  { letter: 'P', word: 'Pisîk', image: '' },
  { letter: 'Q', word: 'Qaz', image: '' },
  { letter: 'R', word: 'Rovî', image: '' },
  { letter: 'S', word: 'Stêrk', image: '' },
  { letter: 'Ş', word: 'Şêr', image: '' },
  { letter: 'T', word: 'Telefon', image: '' },
  { letter: 'U', word: 'Guh', image: '' },
  { letter: 'Û', word: 'Gûz', image: '' },
  { letter: 'V', word: 'Nivîn', image: '' },
  { letter: 'W', word: 'Werdek', image: '' },
  { letter: 'X', word: 'Xiyar', image: '' },
  { letter: 'Y', word: 'Heyv', image: '' },
  { letter: 'Z', word: 'Zebeş', image: '' }
];
const ALFABE_ITEMS = RAW_ALFABE_ITEMS.map((item, idx) => {
  const customUrl = (ALFABE_IMAGE_URLS[item.word] || '').trim();
  const baseUrl = ALFABE_BASE_URL.trim().replace(/\/+$/, '');
  const slug = item.word
    .toLocaleLowerCase('tr')
    .replace(/ê/g, 'e')
    .replace(/î/g, 'i')
    .replace(/û/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/\s+/g, '-');
  const resolvedImage =
    (item.image || '').trim() ||
    customUrl ||
    (baseUrl ? `${baseUrl}/${slug}.${ALFABE_DEFAULT_EXT}` : '');
  const row = Math.floor(idx / 5);
  const col = idx < 30 ? idx % 5 : 2;
  return {
    ...item,
    cellIndex: idx,
    gridRow: row,
    gridCol: col,
    image: resolvedImage
  };
});
const ALFABE_WORD_IMAGE_MAP = ALFABE_ITEMS.reduce((acc, item) => {
  acc[item.word.toLocaleLowerCase('tr')] = item.image || '';
  acc[item.letter.toLocaleLowerCase('tr')] = item.image || '';
  return acc;
}, {});
const ALFABE_CELL_META_MAP = ALFABE_ITEMS.reduce((acc, item) => {
  acc[item.word.toLocaleLowerCase('tr')] = item;
  acc[item.letter.toLocaleLowerCase('tr')] = item;
  return acc;
}, {});
let cachedAlfabeSheetImg = null;
const loadAlfabeSheetImage = () => {
  if (!ALFABE_SHEET_SRC || typeof window === 'undefined') return Promise.resolve(null);
  if (cachedAlfabeSheetImg && cachedAlfabeSheetImg.complete && cachedAlfabeSheetImg.naturalWidth > 0) {
    return Promise.resolve(cachedAlfabeSheetImg);
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      cachedAlfabeSheetImg = img;
      resolve(img);
    };
    img.onerror = () => resolve(null);
    img.src = ALFABE_SHEET_SRC;
  });
};
const cropAlfabeCellFromSheet = async (cellMeta) => {
  if (!cellMeta || typeof document === 'undefined') return '';
  const sheetImg = await loadAlfabeSheetImage();
  if (!sheetImg) return '';
  const w = sheetImg.naturalWidth;
  const h = sheetImg.naturalHeight;
  const gridLeft = w * 0.06;
  const gridWidth = w * 0.88;
  const gridTop = h * 0.178;
  const gridHeight = h * 0.785;
  const colSpan = gridWidth / 5;
  const rowSpan = gridHeight / 7;
  const sx = gridLeft + cellMeta.gridCol * colSpan + colSpan * 0.14;
  const sy = gridTop + cellMeta.gridRow * rowSpan + rowSpan * 0.28;
  const sw = colSpan * 0.72;
  const sh = rowSpan * 0.44;
  const canvas = document.createElement('canvas');
  canvas.width = 240;
  canvas.height = 180;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.fillStyle = '#cbe7b8';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(sheetImg, sx, sy, sw, sh, 12, 12, canvas.width - 24, canvas.height - 24);
  return canvas.toDataURL('image/png');
};
const buildAlfabeExercises = () => {
  const chunks = [];
  for (let i = 0; i < ALFABE_ITEMS.length; i += 4) {
    chunks.push(ALFABE_ITEMS.slice(i, i + 4));
  }
  return chunks.map((group, idx) => ({
    id: `alfabe-match-${idx + 1}`,
    unit_title: 'ALFABE',
    exercise_type: 'match',
    question_text: `Peyvên ALFABE bi wêneyên wan re bighîne hev (${group.map((g) => g.word).join(', ')})`,
    options: group.map((g) => `${g.letter} — ${g.word}=${g.image || `img:${g.word}`}`),
    match_pairs: group.map((g, pIdx) => ({
      id: pIdx,
      left: `${g.letter} — ${g.word}`,
      right: g.word,
      word: g.word,
      letter: g.letter,
      cellMeta: g,
      image: g.image || ''
    })),
    correct_answer: String(group.length),
    explanation: group.map((g) => `${g.letter} — ${g.word}`).join(' • '),
    image_url: '',
    audio_url: '',
    sort_order: idx + 1
  }));
};
const BUILTIN_ALFABE_EXERCISES = buildAlfabeExercises();
const normalizeKurdish = (str = '') =>
  str
    .toLocaleLowerCase('tr')
    .replace(/[êéèë]/g, 'e')
    .replace(/[îíìïı]/g, 'i')
    .replace(/[ûúùü]/g, 'u')
    .replace(/[ş]/g, 's')
    .replace(/[ç]/g, 'c')
    .trim();
const sanitizeSearch = (str = '') => str.replace(/[,()%*\\]/g, ' ').trim();
const slugify = (str = '') =>
  normalizeKurdish(str)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `beş-${Date.now()}`;
const getYouTubeEmbedUrl = (url = '') => {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : '';
};
const getWordMeaningByLang = (item, lang = 'KU') => {
  const i18n = item?.meanings_i18n || {};
  if (i18n[lang]) return i18n[lang];
  const legacyMap = {
    TR: item?.meaning_tr,
    EN: item?.meaning_en,
    KU: item?.meaning_ku
  };
  if (legacyMap[lang]) return legacyMap[lang];
  return (
    i18n.KU ||
    i18n.TR ||
    i18n.EN ||
    item?.meaning_ku ||
    item?.meaning_tr ||
    item?.meaning_en ||
    ''
  );
};
const getWordExampleByLang = (item, lang = 'KU') => {
  const exI18n = item?.examples_i18n || {};
  return exI18n[lang] || exI18n.KU || item?.example_sentence || '';
};
const BUILTIN_DICTIONARY = [
  { id: 'bi-1', word: 'heval', part_of_speech: 'navdêr', meaning_tr: 'arkadaş, dost', meaning_en: 'friend', meaning_ku: 'Kesê ku mirov pê re dostanî dike.', example_sentence: 'Ew hevalê min ê herî baş e.', meanings_i18n: { KU: 'Kesê ku mirov pê re dostanî dike.', TR: 'arkadaş, dost', EN: 'friend' }, examples_i18n: { KU: 'Ew hevalê min ê herî baş e.' } },
  { id: 'bi-2', word: 'bijîşk', part_of_speech: 'navdêr', meaning_tr: 'doktor, hekim', meaning_en: 'doctor', meaning_ku: 'Kesê ku nexweşan derman dike.', example_sentence: 'Bijîşk li nexweşxaneyê dixebite.', meanings_i18n: { KU: 'Kesê ku nexweşan derman dike.', TR: 'doktor, hekim', EN: 'doctor' }, examples_i18n: { KU: 'Bijîşk li nexweşxaneyê dixebite.' } },
  { id: 'bi-3', word: 'silav', part_of_speech: 'navdêr', meaning_tr: 'selam, merhaba', meaning_en: 'hello, greeting', meaning_ku: 'Peyva pêşwazîkirinê.', example_sentence: 'Silav û rêz ji bo we hemûyan.', meanings_i18n: { KU: 'Peyva pêşwazîkirinê.', TR: 'selam, merhaba', EN: 'hello, greeting' }, examples_i18n: { KU: 'Silav û rêz ji bo we hemûyan.' } },
  { id: 'bi-4', word: 'rojbaş', part_of_speech: 'baneşan', meaning_tr: 'günaydın, iyi günler', meaning_en: 'good morning, good day', meaning_ku: 'Silava sibeh û nîvro.', example_sentence: 'Rojbaş hevalno, hûn çawa ne?', meanings_i18n: { KU: 'Silava sibeh û nîvro.', TR: 'günaydın, iyi günler', EN: 'good morning, good day' }, examples_i18n: { KU: 'Rojbaş hevalno, hûn çawa ne?' } },
  { id: 'bi-5', word: 'spas', part_of_speech: 'navdêr', meaning_tr: 'teşekkür', meaning_en: 'thank you, thanks', meaning_ku: 'Peyva rêzdarî û minetdariyê.', example_sentence: 'Gelek spas ji bo alîkariya te.', meanings_i18n: { KU: 'Peyva rêzdarî û minetdariyê.', TR: 'teşekkür', EN: 'thank you, thanks' }, examples_i18n: { KU: 'Gelek spas ji bo alîkariya te.' } },
  { id: 'bi-6', word: 'av', part_of_speech: 'navdêr', meaning_tr: 'su', meaning_en: 'water', meaning_ku: 'Şileya bingehîn a jiyanê.', example_sentence: 'Av jiyan e.', meanings_i18n: { KU: 'Şileya bingehîn a jiyanê.', TR: 'su', EN: 'water' }, examples_i18n: { KU: 'Av jiyan e.' } },
  { id: 'bi-7', word: 'nan', part_of_speech: 'navdêr', meaning_tr: 'ekmek', meaning_en: 'bread', meaning_ku: 'Xwarina bingehîn a ji ardê.', example_sentence: 'Nanê germ gelekî xweş e.', meanings_i18n: { KU: 'Xwarina bingehîn a ji ardê.', TR: 'ekmek', EN: 'bread' }, examples_i18n: { KU: 'Nanê germ gelekî xweş e.' } },
  { id: 'bi-8', word: 'pirtûk', part_of_speech: 'navdêr', meaning_tr: 'kitap', meaning_en: 'book', meaning_ku: 'Berhema nivîskî ya xwendinê.', example_sentence: 'Ez her roj pirtûkekê dixwînim.', meanings_i18n: { KU: 'Berhema nivîskî ya xwendinê.', TR: 'kitap', EN: 'book' }, examples_i18n: { KU: 'Ez her roj pirtûkekê dixwînim.' } },
  { id: 'bi-9', word: 'dibistan', part_of_speech: 'navdêr', meaning_tr: 'okul', meaning_en: 'school', meaning_ku: 'Saziya perwerdehiyê.', example_sentence: 'Zarok sibehê zû diçin dibistanê.', meanings_i18n: { KU: 'Saziya perwerdehiyê.', TR: 'okul', EN: 'school' }, examples_i18n: { KU: 'Zarok sibehê zû diçin dibistanê.' } },
  { id: 'bi-10', word: 'mamoste', part_of_speech: 'navdêr', meaning_tr: 'öğretmen', meaning_en: 'teacher', meaning_ku: 'Kesê ku dersê dide xwendekaran.', example_sentence: 'Mamoste dersa Kurdî dide.', meanings_i18n: { KU: 'Kesê ku dersê dide xwendekaran.', TR: 'öğretmen', EN: 'teacher' }, examples_i18n: { KU: 'Mamoste dersa Kurdî dide.' } }
];
const DEFAULT_UI = {
  brand_first: 'Kurdi',
  brand_second: 'Klass',
  nav_site: 'Malper',
  nav_learn: 'Hînbûn / Lîstik',
  nav_ferheng: 'Ferheng',
  nav_admin: 'Rêveber',
  all_categories_label: 'HEMÛ BEŞ',
  hero_badge: 'ÇAVKANIYÊN PERWERDEHIYÊ',
  hero_title: 'Navenda Fêrbûn û Materyalên Kurdî',
  hero_subtitle: 'Vîdyo, belge, lîstik û rêberên mamosteyan ji bo hemû astan.',
  search_placeholder: 'Li ders, mijar an peyvekê bigere...',
  tab_content: 'Naveroka Dersê',
  tab_guide: 'Rêbera Mamosteyan',
  btn_open_material: 'Materyalê Veke',
  guide_heading: 'Plana Dersê û Rêberê Mamosteyan',
  guide_download_btn: 'PDFya Rêberê Daxe',
  guide_empty_text: 'Ji bo vê dersê hîn nivîsa rêberê nehatiye zêdekirin.',
  meta_level_prefix: 'Ast:',
  meta_grade_prefix: 'Pol:',
  filter_title: 'Parzûn (Fîltre)',
  filter_level_label: 'Ast (Seviye)',
  filter_level_all: 'Hemû Ast',
  filter_media_label: 'Cureyê Materyalê',
  filter_media_all: 'Hemû Cure',
  reset_filters_btn: 'Parzûnan Paqij Bike',
  level_1: 'Destpêk',
  level_2: 'Navîn',
  level_3: 'Pêşketî',
  grade_1: 'Pêşdibistan',
  grade_2: 'Dibistana Seretayî',
  grade_3: 'Dibistana Navîn',
  grade_4: 'Lîse / Mezinan',
  media_video: 'Vîdyo',
  media_document: 'Belge / PDF',
  media_audio: 'Deng / Podcast',
  media_interactive: 'Lîstik / Çalakî',
  list_all_title: 'Hemû Ders û Materyal',
  list_count_suffix: 'materyal hatin dîtin',
  loading_text: 'Materyal tên barkirin...',
  empty_title: 'Hîn materyal nehatiye dîtin',
  empty_subtitle: 'Tu dikarî ji Panela Rêveber materyalên nû li vê beşê zêde bikî.',
  empty_button: 'Materyal Zêde Bike',
  card_guide_badge: 'RÊBER',
  footer_text: 'Platforma Perwerdehiya Vekirî ya Kurdî • KurdiKlass',
  ferheng_search_placeholder: 'heval, bijîşk, doctor, arkadaş...',
  ferheng_search_btn: 'Bigere',
  ferheng_empty_text: 'Peyva ku tu lê digerî nehat dîtin.',
  learn_title: 'Rêwîtiya Fêrbûna Kurmancî',
  learn_subtitle: 'Beşa lîstikan amade ye. Tu dikarî lîstikên nû zêde bikî.',
  learn_xp_label: 'Pûan',
  learn_empty_units: 'Hîn lîstik nehatine zêdekirin.',
  learn_stage_prefix: 'Qonax',
  learn_question_count_suffix: 'lîstik',
  learn_win_title: 'Pîroz be! Te ev qonax bi serkeftî qedand!',
  learn_lose_title: 'Dilên te qediyan! Careke din biceribîne.',
  learn_replay_btn: 'Dîsa Bilîze',
  learn_back_units_btn: 'Vegere Qonaxan',
  learn_type_choice: 'Vebijêrka Rast',
  learn_type_sentence: 'Hevokê Saz Bike',
  learn_type_match: 'Peyvan Bighîne Hev',
  learn_type_fill: 'Valahiyê Tije Bike',
  learn_type_image: 'Wêneyê Bibîne, Peyvê Hilbijêre',
  learn_sentence_placeholder: 'Li peyvên jêrîn bitikîne da ku hevokê rêz bikî...',
  learn_correct_msg: 'Gelek baş e! Bersiva te rast e.',
  learn_wrong_prefix: 'Bersiva rast:',
  learn_check_btn: 'Kontrol Bike',
  learn_next_btn: 'Berdewam Bike'
};
const UI_TRANSLATIONS = {
  KU: {},
  ZZA: {
    nav_site: 'Keyepel',
    nav_learn: 'Muşayîş / Kayî',
    nav_ferheng: 'Ferheng',
    nav_admin: 'Îdarekar',
    all_categories_label: 'PÊRO BEŞÎ',
    hero_badge: 'ÇAVKANÎYÊ PERWERDEYÎ',
    hero_title: 'Merkezê Musayîş û Materyalanê Kirmanckî',
    hero_subtitle: 'Vîdyoyî, belgeyî, kayî û rêberê mamostayan seba pêro sewîyan.',
    search_placeholder: 'Ders, mijar ya zi çekuyêk bigêre...',
    tab_content: 'Tedeokê Dersî',
    tab_guide: 'Rêberê Mamostayan',
    btn_open_material: 'Materyalî Rake',
    guide_heading: 'Planê Dersî û Rêberê Mamostayan',
    guide_download_btn: 'PDFyê Rêberî Daxî',
    guide_empty_text: 'Seba na derse hewna nuşteyê rêberî çin o.',
    meta_level_prefix: 'Sewîye:',
    meta_grade_prefix: 'Sinif:',
    filter_title: 'Fîltre',
    filter_level_label: 'Sewîye',
    filter_level_all: 'Pêro Sewîyeyî',
    filter_media_label: 'Tevrê Materyalî',
    filter_media_all: 'Pêro Tevrî',
    reset_filters_btn: 'Fîltran Pak Bike',
    level_1: 'Destpêk',
    level_2: 'Miyanên',
    level_3: 'Averşîyayîş',
    grade_1: 'Ver-Mekteb',
    grade_2: 'Mektebo Verên',
    grade_3: 'Mektebo Miyanên',
    grade_4: 'Lîse / Pîlî',
    media_video: 'Vîdyo',
    media_document: 'Belge / PDF',
    media_audio: 'Veng / Podcast',
    media_interactive: 'Kayî / Çalakî',
    list_all_title: 'Pêro Ders û Materyalî',
    list_count_suffix: 'materyalî vînîyayî',
    loading_text: 'Materyalî bar benê...',
    empty_title: 'Hewna materyal nêvînîya',
    empty_subtitle: 'Ti şênayî Panelê Îdarekarî ra materyalê neweyî îlawe bikê.',
    empty_button: 'Materyal Îlawe Bike',
    card_guide_badge: 'RÊBER',
    footer_text: 'Platformê Perwerdeyê Akerdeyî yê Kurdî • KurdiKlass',
    ferheng_search_placeholder: 'heval, bijîşk, doctor, arkadaş...',
    ferheng_search_btn: 'Bigêre',
    ferheng_empty_text: 'Çekuya ke ti gêrenê nêvînîya.',
    learn_title: 'Raywanîya Musayîşê Kurmancî',
    learn_subtitle: 'Beşê kayan amade yo; ti şênayî kayê neweyî îlawe bikê.',
    learn_xp_label: 'Pûan',
    learn_empty_units: 'Hewna kayî çin ê.',
    learn_stage_prefix: 'Merhele',
    learn_question_count_suffix: 'kayî',
    learn_win_title: 'Bimbarek bo! To na merhele bi serkewtiş qedênaye!',
    learn_lose_title: 'Zerreyê to qedîyayî! Reyna biceribne.',
    learn_replay_btn: 'Reyna Kay Bike',
    learn_back_units_btn: 'Ageyre Merheleyan',
    learn_type_choice: 'Weçînayîşo Rast',
    learn_type_sentence: 'Cumle Vıraze',
    learn_type_match: 'Çekuyan Pê Girede',
    learn_type_fill: 'Vengî Pirr Bike',
    learn_type_image: 'Resimî Vîne, Çekuye Weçîne',
    learn_sentence_placeholder: 'Çekuyanê cêrênan ser o bitikne ke cumle rêz bikê...',
    learn_correct_msg: 'Zaf weş o! Cewabê to rast o.',
    learn_wrong_prefix: 'Cewabo rast:',
    learn_check_btn: 'Kontrol Bike',
    learn_next_btn: 'Dewam Bike'
  },
  CKB: {
    nav_site: 'ماڵپەڕ',
    nav_learn: 'فێربوون / یاری',
    nav_ferheng: 'فەرهەنگ',
    nav_admin: 'بەڕێوەبەر',
    all_categories_label: 'هەموو بەشەکان',
    hero_badge: 'سەرچاوەکانی پەروەردە',
    hero_title: 'ناوەندی فێربوون و ماددەکانی کوردی',
    hero_subtitle: 'ڤیدیۆ، بەڵگەنامە، یاری و ڕێبەری مامۆستایان بۆ هەموو ئاستەکان.',
    search_placeholder: 'بەدوای وانە، بابەت یان وشەیەکدا بگەڕێ...',
    tab_content: 'ناوەڕۆکی وانە',
    tab_guide: 'ڕێبەری مامۆستایان',
    btn_open_material: 'کردنەوەی ماددە',
    guide_heading: 'پلانی وانە و ڕێبەری مامۆستایان',
    guide_download_btn: 'داگرتنی PDF ڕێبەر',
    guide_empty_text: 'بۆ ئەم وانەیە هێشتا دەقی ڕێبەر زیاد نەکراوە.',
    meta_level_prefix: 'ئاست:',
    meta_grade_prefix: 'پۆل:',
    filter_title: 'پاڵاوتن',
    filter_level_label: 'ئاست',
    filter_level_all: 'هەموو ئاستەکان',
    filter_media_label: 'جۆری ماددە',
    filter_media_all: 'هەموو جۆرەکان',
    reset_filters_btn: 'پاککردنەوەی پاڵاوتن',
    level_1: 'سەرەتایی',
    level_2: 'ناوەند',
    level_3: 'پێشکەوتوو',
    grade_1: 'باخچەی ساوایان',
    grade_2: 'قوتابخانەی سەرەتایی',
    grade_3: 'ناوەندی',
    grade_4: 'ئامادەیی / گەورەساڵان',
    media_video: 'ڤیدیۆ',
    media_document: 'بەڵگە / PDF',
    media_audio: 'دەنگ / پۆدکاست',
    media_interactive: 'یاری / چالاکی',
    list_all_title: 'هەموو وانە و ماددەکان',
    list_count_suffix: 'ماددە دۆزرانەوە',
    loading_text: 'ماددەکان بار دەکرێن...',
    empty_title: 'هێشتا هیچ ماددەیەک نەدۆزراوەتەوە',
    empty_subtitle: 'دەتوانیت لە پانێڵی بەڕێوەبەر ماددەی نوێ زیاد بکەیت.',
    empty_button: 'زیادکردنی ماددە',
    card_guide_badge: 'ڕێبەر',
    footer_text: 'پلاتفۆرمی پەروەردەی کراوەی کوردی • KurdiKlass',
    ferheng_search_placeholder: 'heval, bijîşk, doctor, arkadaş...',
    ferheng_search_btn: 'گەڕان',
    ferheng_empty_text: 'ئەو وشەیەی بەدوایدا دەگەڕێیت نەدۆزرایەوە.',
    learn_title: 'گەشتی فێربوونی کورمانجی',
    learn_subtitle: 'بەشی یارییەکان ئامادەیە؛ دەتوانیت یاری نوێ زیاد بکەیت.',
    learn_xp_label: 'خاڵ',
    learn_empty_units: 'هێشتا هیچ یارییەک زیاد نەکراوە.',
    learn_stage_prefix: 'قۆناغ',
    learn_question_count_suffix: 'یاری',
    learn_win_title: 'پیرۆزە! ئەم قۆناغەت بە سەرکەوتوویی تەواو کرد!',
    learn_lose_title: 'دڵەکانت تەواو بوون! دووبارە هەوڵ بدەرەوە.',
    learn_replay_btn: 'دووبارە یاری بکە',
    learn_back_units_btn: 'گەڕانەوە بۆ قۆناغەکان',
    learn_type_choice: 'هەڵبژاردنی دروست',
    learn_type_sentence: 'ڕستە دروست بکە',
    learn_type_match: 'وشەکان بەیەکەوە ببەستەرەوە',
    learn_type_fill: 'بۆشایی پڕ بکەرەوە',
    learn_type_image: 'وێنەکە بدۆزەرەوە، وشەکە هەڵبژێرە',
    learn_sentence_placeholder: 'لەسەر وشەکانی خوارەوە کلیک بکە بۆ ڕێکخستنی ڕستە...',
    learn_correct_msg: 'زۆر باشە! وەڵامەکەت دروستە.',
    learn_wrong_prefix: 'وەڵامی دروست:',
    learn_check_btn: 'پشکنین',
    learn_next_btn: 'بەردەوام بە'
  },
  TR: {
    nav_site: 'Site',
    nav_learn: 'Öğren / Oyun',
    nav_ferheng: 'Sözlük',
    nav_admin: 'Yönetici',
    all_categories_label: 'TÜM BÖLÜMLER',
    hero_badge: 'EĞİTİM KAYNAKLARI',
    hero_title: 'Kürtçe Öğrenme ve Materyal Merkezi',
    hero_subtitle: 'Tüm seviyeler için videolar, belgeler, oyunlar ve öğretmen rehberleri.',
    search_placeholder: 'Ders, konu veya kelime ara...',
    tab_content: 'Ders İçeriği',
    tab_guide: 'Öğretmen Rehberi',
    btn_open_material: 'Materyali Aç',
    guide_heading: 'Ders Planı ve Öğretmen Rehberi',
    guide_download_btn: 'Rehber PDF İndir',
    guide_empty_text: 'Bu ders için henüz rehber metni eklenmemiş.',
    meta_level_prefix: 'Seviye:',
    meta_grade_prefix: 'Sınıf:',
    filter_title: 'Filtre',
    filter_level_label: 'Seviye',
    filter_level_all: 'Tüm Seviyeler',
    filter_media_label: 'Materyal Türü',
    filter_media_all: 'Tüm Türler',
    reset_filters_btn: 'Filtreleri Temizle',
    level_1: 'Başlangıç',
    level_2: 'Orta',
    level_3: 'İleri',
    grade_1: 'Okul Öncesi',
    grade_2: 'İlkokul',
    grade_3: 'Ortaokul',
    grade_4: 'Lise / Yetişkin',
    media_video: 'Video',
    media_document: 'Belge / PDF',
    media_audio: 'Ses / Podcast',
    media_interactive: 'Oyun / Etkinlik',
    list_all_title: 'Tüm Ders ve Materyaller',
    list_count_suffix: 'materyal bulundu',
    loading_text: 'Materyaller yükleniyor...',
    empty_title: 'Henüz materyal bulunamadı',
    empty_subtitle: 'Yönetici Panelinden bu bölüme yeni materyaller ekleyebilirsiniz.',
    empty_button: 'Materyal Ekle',
    card_guide_badge: 'REHBER',
    footer_text: 'Açık Kürtçe Eğitim Platformu • KurdiKlass',
    ferheng_search_placeholder: 'heval, bijîşk, doctor, arkadaş...',
    ferheng_search_btn: 'Ara',
    ferheng_empty_text: 'Aradığınız kelime bulunamadı.',
    learn_title: 'Kurmancî Öğrenme Yolculuğu',
    learn_subtitle: 'Oyun bölümü hazır; yeni oyunlar ekleyebilirsiniz.',
    learn_xp_label: 'Puan',
    learn_empty_units: 'Henüz oyun eklenmemiş.',
    learn_stage_prefix: 'Aşama',
    learn_question_count_suffix: 'oyun',
    learn_win_title: 'Tebrikler! Bu aşamayı başarıyla tamamladın!',
    learn_lose_title: 'Canların bitti! Tekrar dene.',
    learn_replay_btn: 'Tekrar Oyna',
    learn_back_units_btn: 'Aşamalara Dön',
    learn_type_choice: 'Doğru Seçenek',
    learn_type_sentence: 'Cümle Kur',
    learn_type_match: 'Kelimeleri Eşleştir',
    learn_type_fill: 'Boşluğu Doldur',
    learn_type_image: 'Görseli Bul, Kelimeyi Seç',
    learn_sentence_placeholder: 'Cümleyi sıralamak için aşağıdaki kelimelere tıkla...',
    learn_correct_msg: 'Harika! Cevabın doğru.',
    learn_wrong_prefix: 'Doğru cevap:',
    learn_check_btn: 'Kontrol Et',
    learn_next_btn: 'Devam Et'
  },
  EN: {
    nav_site: 'Site',
    nav_learn: 'Learn / Game',
    nav_ferheng: 'Dictionary',
    nav_admin: 'Admin',
    all_categories_label: 'ALL SECTIONS',
    hero_badge: 'EDUCATIONAL RESOURCES',
    hero_title: 'Kurdish Learning & Material Hub',
    hero_subtitle: 'Videos, documents, games, and teacher guides for all levels.',
    search_placeholder: 'Search lessons, topics, or words...',
    tab_content: 'Lesson Content',
    tab_guide: 'Teacher Guide',
    btn_open_material: 'Open Material',
    guide_heading: 'Lesson Plan & Teacher Guide',
    guide_download_btn: 'Download Guide PDF',
    guide_empty_text: 'No guide text has been added for this lesson yet.',
    meta_level_prefix: 'Level:',
    meta_grade_prefix: 'Grade:',
    filter_title: 'Filter',
    filter_level_label: 'Level',
    filter_level_all: 'All Levels',
    filter_media_label: 'Material Type',
    filter_media_all: 'All Types',
    reset_filters_btn: 'Clear Filters',
    level_1: 'Beginner',
    level_2: 'Intermediate',
    level_3: 'Advanced',
    grade_1: 'Preschool',
    grade_2: 'Elementary',
    grade_3: 'Middle School',
    grade_4: 'High School / Adult',
    media_video: 'Video',
    media_document: 'Document / PDF',
    media_audio: 'Audio / Podcast',
    media_interactive: 'Game / Activity',
    list_all_title: 'All Lessons & Materials',
    list_count_suffix: 'materials found',
    loading_text: 'Loading materials...',
    empty_title: 'No materials found yet',
    empty_subtitle: 'You can add new materials to this section from the Admin Panel.',
    empty_button: 'Add Material',
    card_guide_badge: 'GUIDE',
    footer_text: 'Open Kurdish Education Platform • KurdiKlass',
    ferheng_search_placeholder: 'heval, bijîşk, doctor, arkadaş...',
    ferheng_search_btn: 'Search',
    ferheng_empty_text: 'The word you are looking for was not found.',
    learn_title: 'Kurmanji Learning Journey',
    learn_subtitle: 'The game section is ready; you can add new games.',
    learn_xp_label: 'Points',
    learn_empty_units: 'No games added yet.',
    learn_stage_prefix: 'Stage',
    learn_question_count_suffix: 'games',
    learn_win_title: 'Congratulations! You completed this stage!',
    learn_lose_title: 'Out of hearts! Try again.',
    learn_replay_btn: 'Play Again',
    learn_back_units_btn: 'Back to Stages',
    learn_type_choice: 'Correct Choice',
    learn_type_sentence: 'Build the Sentence',
    learn_type_match: 'Match the Words',
    learn_type_fill: 'Fill in the Blank',
    learn_type_image: 'Find the Image, Pick the Word',
    learn_sentence_placeholder: 'Click the words below to order the sentence...',
    learn_correct_msg: 'Great job! Your answer is correct.',
    learn_wrong_prefix: 'Correct answer:',
    learn_check_btn: 'Check',
    learn_next_btn: 'Continue'
  },
  DE: {
    nav_site: 'Startseite',
    nav_learn: 'Lernen / Spiel',
    nav_ferheng: 'Wörterbuch',
    nav_admin: 'Admin',
    all_categories_label: 'ALLE BEREICHE',
    hero_badge: 'BILDUNGSRESSOURCEN',
    hero_title: 'Kurdisches Lern- & Materialzentrum',
    hero_subtitle: 'Videos, Dokumente, Spiele und Lehrerhandbücher für alle Niveaus.',
    search_placeholder: 'Nach Lektionen, Themen oder Wörtern suchen...',
    tab_content: 'Lektionsinhalt',
    tab_guide: 'Lehrerhandbuch',
    btn_open_material: 'Material öffnen',
    guide_heading: 'Unterrichtsplan & Lehrerhandbuch',
    guide_download_btn: 'Handbuch-PDF laden',
    guide_empty_text: 'Für diese Lektion wurde noch kein Handbuchtext hinzugefügt.',
    meta_level_prefix: 'Niveau:',
    meta_grade_prefix: 'Stufe:',
    filter_title: 'Filter',
    filter_level_label: 'Niveau',
    filter_level_all: 'Alle Niveaus',
    filter_media_label: 'Materialart',
    filter_media_all: 'Alle Arten',
    reset_filters_btn: 'Filter zurücksetzen',
    level_1: 'Anfänger',
    level_2: 'Mittelstufe',
    level_3: 'Fortgeschritten',
    grade_1: 'Vorschule',
    grade_2: 'Grundschule',
    grade_3: 'Sekundarstufe I',
    grade_4: 'Gymnasium / Erwachsene',
    media_video: 'Video',
    media_document: 'Dokument / PDF',
    media_audio: 'Audio / Podcast',
    media_interactive: 'Spiel / Aktivität',
    list_all_title: 'Alle Lektionen & Materialien',
    list_count_suffix: 'Materialien gefunden',
    loading_text: 'Materialien werden geladen...',
    empty_title: 'Noch keine Materialien gefunden',
    empty_subtitle: 'Über das Admin-Panel können neue Materialien hinzugefügt werden.',
    empty_button: 'Material hinzufügen',
    card_guide_badge: 'HANDBUCH',
    footer_text: 'Offene Kurdische Bildungsplattform • KurdiKlass',
    ferheng_search_placeholder: 'heval, bijîşk, doctor, arkadaş...',
    ferheng_search_btn: 'Suchen',
    ferheng_empty_text: 'Das gesuchte Wort wurde nicht gefunden.',
    learn_title: 'Kurmancî-Lernreise',
    learn_subtitle: 'Der Spielbereich ist bereit; neue Spiele können hinzugefügt werden.',
    learn_xp_label: 'Punkte',
    learn_empty_units: 'Noch keine Spiele hinzugefügt.',
    learn_stage_prefix: 'Stufe',
    learn_question_count_suffix: 'Spiele',
    learn_win_title: 'Glückwunsch! Du hast diese Stufe abgeschlossen!',
    learn_lose_title: 'Keine Herzen mehr! Versuch es noch einmal.',
    learn_replay_btn: 'Nochmal spielen',
    learn_back_units_btn: 'Zurück zu den Stufen',
    learn_type_choice: 'Richtige Wahl',
    learn_type_sentence: 'Satz bilden',
    learn_type_match: 'Wörter zuordnen',
    learn_type_fill: 'Lücke füllen',
    learn_type_image: 'Bild finden, Wort wählen',
    learn_sentence_placeholder: 'Klicke unten auf die Wörter, um den Satz zu ordnen...',
    learn_correct_msg: 'Sehr gut! Deine Antwort ist richtig.',
    learn_wrong_prefix: 'Richtige Antwort:',
    learn_check_btn: 'Prüfen',
    learn_next_btn: 'Weiter'
  },
  FR: {
    nav_site: 'Site',
    nav_learn: 'Apprendre / Jeu',
    nav_ferheng: 'Dictionnaire',
    nav_admin: 'Admin',
    all_categories_label: 'TOUTES SECTIONS',
    hero_badge: 'RESSOURCES ÉDUCATIVES',
    hero_title: 'Centre d’Apprentissage et de Ressources Kurdes',
    hero_subtitle: 'Vidéos, documents, jeux et guides pédagogiques pour tous niveaux.',
    search_placeholder: 'Rechercher des cours, sujets ou mots...',
    tab_content: 'Contenu du cours',
    tab_guide: 'Guide enseignant',
    btn_open_material: 'Ouvrir le matériel',
    guide_heading: 'Plan de cours et guide enseignant',
    guide_download_btn: 'Télécharger le PDF',
    guide_empty_text: 'Aucun texte de guide n’a encore été ajouté pour ce cours.',
    meta_level_prefix: 'Niveau :',
    meta_grade_prefix: 'Classe :',
    filter_title: 'Filtre',
    filter_level_label: 'Niveau',
    filter_level_all: 'Tous les niveaux',
    filter_media_label: 'Type de support',
    filter_media_all: 'Tous les types',
    reset_filters_btn: 'Réinitialiser les filtres',
    level_1: 'Débutant',
    level_2: 'Intermédiaire',
    level_3: 'Avancé',
    grade_1: 'Maternelle',
    grade_2: 'École primaire',
    grade_3: 'Collège',
    grade_4: 'Lycée / Adultes',
    media_video: 'Vidéo',
    media_document: 'Document / PDF',
    media_audio: 'Audio / Podcast',
    media_interactive: 'Jeu / Activité',
    list_all_title: 'Tous les cours et ressources',
    list_count_suffix: 'ressources trouvées',
    loading_text: 'Chargement des ressources...',
    empty_title: 'Aucune ressource trouvée pour le moment',
    empty_subtitle: 'Vous pouvez ajouter de nouvelles ressources depuis le panneau admin.',
    empty_button: 'Ajouter une ressource',
    card_guide_badge: 'GUIDE',
    footer_text: 'Plateforme Éducative Kurde Ouverte • KurdiKlass',
    ferheng_search_placeholder: 'heval, bijîşk, doctor, arkadaş...',
    ferheng_search_btn: 'Rechercher',
    ferheng_empty_text: 'Le mot recherché est introuvable.',
    learn_title: 'Parcours d’Apprentissage du Kurmanji',
    learn_subtitle: 'La section jeux est prête ; vous pouvez ajouter de nouveaux jeux.',
    learn_xp_label: 'Points',
    learn_empty_units: 'Aucun jeu ajouté pour le moment.',
    learn_stage_prefix: 'Étape',
    learn_question_count_suffix: 'jeux',
    learn_win_title: 'Bravo ! Tu as terminé cette étape !',
    learn_lose_title: 'Plus de vies ! Réessaie.',
    learn_replay_btn: 'Rejouer',
    learn_back_units_btn: 'Retour aux étapes',
    learn_type_choice: 'Bon choix',
    learn_type_sentence: 'Construire la phrase',
    learn_type_match: 'Associer les mots',
    learn_type_fill: 'Compléter le blanc',
    learn_type_image: 'Trouver l’image, choisir le mot',
    learn_sentence_placeholder: 'Clique sur les mots ci-dessous pour ordonner la phrase...',
    learn_correct_msg: 'Très bien ! Ta réponse est juste.',
    learn_wrong_prefix: 'Bonne réponse :',
    learn_check_btn: 'Vérifier',
    learn_next_btn: 'Continuer'
  },
  IT: {
    nav_site: 'Sito',
    nav_learn: 'Impara / Gioco',
    nav_ferheng: 'Dizionario',
    nav_admin: 'Admin',
    all_categories_label: 'TUTTE LE SEZIONI',
    hero_badge: 'RISORSE EDUCATIVE',
    hero_title: 'Centro di Apprendimento e Materiali Curdi',
    hero_subtitle: 'Video, documenti, giochi e guide per insegnanti per tutti i livelli.',
    search_placeholder: 'Cerca lezioni, argomenti o parole...',
    tab_content: 'Contenuto lezione',
    tab_guide: 'Guida insegnante',
    btn_open_material: 'Apri materiale',
    guide_heading: 'Piano di lezione e guida insegnante',
    guide_download_btn: 'Scarica PDF guida',
    guide_empty_text: 'Nessun testo di guida aggiunto ancora per questa lezione.',
    meta_level_prefix: 'Livello:',
    meta_grade_prefix: 'Classe:',
    filter_title: 'Filtro',
    filter_level_label: 'Livello',
    filter_level_all: 'Tutti i livelli',
    filter_media_label: 'Tipo materiale',
    filter_media_all: 'Tutti i tipi',
    reset_filters_btn: 'Azzera filtri',
    level_1: 'Principiante',
    level_2: 'Intermedio',
    level_3: 'Avanzato',
    grade_1: 'Scuola dell’infanzia',
    grade_2: 'Scuola primaria',
    grade_3: 'Scuola secondaria I grado',
    grade_4: 'Scuola superiore / Adulti',
    media_video: 'Video',
    media_document: 'Documento / PDF',
    media_audio: 'Audio / Podcast',
    media_interactive: 'Gioco / Attività',
    list_all_title: 'Tutte le lezioni e i materiali',
    list_count_suffix: 'materiali trovati',
    loading_text: 'Caricamento materiali...',
    empty_title: 'Nessun materiale trovato finora',
    empty_subtitle: 'Puoi aggiungere nuovi materiali dal pannello amministratore.',
    empty_button: 'Aggiungi materiale',
    card_guide_badge: 'GUIDA',
    footer_text: 'Piattaforma Educativa Curda Aperta • KurdiKlass',
    ferheng_search_placeholder: 'heval, bijîşk, doctor, arkadaş...',
    ferheng_search_btn: 'Cerca',
    ferheng_empty_text: 'La parola cercata non è stata trovata.',
    learn_title: 'Percorso di Apprendimento del Kurmanji',
    learn_subtitle: 'La sezione giochi è pronta; puoi aggiungere nuovi giochi.',
    learn_xp_label: 'Punti',
    learn_empty_units: 'Nessun gioco aggiunto finora.',
    learn_stage_prefix: 'Tappa',
    learn_question_count_suffix: 'giochi',
    learn_win_title: 'Complimenti! Hai completato questa tappa!',
    learn_lose_title: 'Cuori esauriti! Riprova.',
    learn_replay_btn: 'Gioca ancora',
    learn_back_units_btn: 'Torna alle tappe',
    learn_type_choice: 'Scelta corretta',
    learn_type_sentence: 'Componi la frase',
    learn_type_match: 'Abbina le parole',
    learn_type_fill: 'Riempi lo spazio',
    learn_type_image: 'Trova l’immagine, scegli la parola',
    learn_sentence_placeholder: 'Tocca le parole qui sotto per ordinare la frase...',
    learn_correct_msg: 'Ottimo! La tua risposta è corretta.',
    learn_wrong_prefix: 'Risposta corretta:',
    learn_check_btn: 'Controlla',
    learn_next_btn: 'Continua'
  }
};
const UI_FIELD_LABELS = Object.keys(DEFAULT_UI).map((key) => ({
  key,
  label: key
}));
const fetchFromWiktionary = async (rawWord) => {
  const cleanWord = rawWord.trim().toLowerCase();
  if (!cleanWord || cleanWord.length < 2) return null;
  try {
    const res = await fetch(
      `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(cleanWord)}`
    );
    if (res.ok) {
      const data = await res.json();
      const kuEntries = data.kmr || data.ku || [];
      if (kuEntries.length > 0) {
        const firstEntry = kuEntries[0];
        const posMap = {
          Noun: 'navdêr',
          Verb: 'lêker',
          Adjective: 'rengdêr',
          Adverb: 'hoker',
          Pronoun: 'cînavk',
          Interjection: 'baneşan'
        };
        const definitions = kuEntries
          .flatMap((e) => (e.definitions || []).map((d) => d.definition.replace(/<[^>]+>/g, '')))
          .filter(Boolean)
          .slice(0, 3);
        if (definitions.length > 0) {
          return {
            word: cleanWord,
            part_of_speech: posMap[firstEntry.partOfSpeech] || 'navdêr',
            meaning_tr: '',
            meaning_en: definitions.join('; '),
            meaning_ku: '',
            example_sentence: '',
            meanings_i18n: { EN: definitions.join('; ') },
            examples_i18n: {}
          };
        }
      }
    }
    const candidates = [cleanWord, cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1)];
    for (const titleCandidate of candidates) {
      const kuRes = await fetch(
        `https://ku.wiktionary.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(
          titleCandidate
        )}&format=json&origin=*`
      );
      if (kuRes.ok) {
        const kuData = await kuRes.json();
        const pages = kuData?.query?.pages || {};
        const page = Object.values(pages)[0];
        if (page && !page.missing && page.extract) {
          const lines = page.extract
            .split('\n')
            .map((l) => l.trim())
            .filter((l) => l && !l.startsWith('=='));
          const summary = lines.slice(1, 3).join(' ') || lines[0] || '';
          if (summary) {
            return {
              word: cleanWord,
              part_of_speech: 'navdêr',
              meaning_tr: '',
              meaning_en: '',
              meaning_ku: summary.slice(0, 280),
              example_sentence: '',
              meanings_i18n: { KU: summary.slice(0, 280) },
              examples_i18n: {}
            };
          }
        }
      }
    }
  } catch (err) {
    console.error('Wiktionary API error:', err);
  }
  return null;
};
export default function App() {
  const [viewMode, setViewMode] = useState('student');
  const [selectedLang, setSelectedLang] = useState(() => localStorage.getItem('kk_lang') || 'KU');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langDropdownRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const fetchRequestRef = useRef(0);
  const [rawUi, setRawUi] = useState(DEFAULT_UI);
  const ui = { ...rawUi, ...(UI_TRANSLATIONS[selectedLang] || {}) };
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonTab, setLessonTab] = useState('content');
  const [brokenThumbs, setBrokenThumbs] = useState({});
  const [brokenExImages, setBrokenExImages] = useState({});
  const [croppedAlfabeImages, setCroppedAlfabeImages] = useState({});
  const [mediaLoadError, setMediaLoadError] = useState('');
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('kk_admin') === 'true');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [uploadingField, setUploadingField] = useState('');
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [catMsg, setCatMsg] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [settingsMsg, setSettingsMsg] = useState('');
  const emptyLessonForm = {
    title: '',
    description: '',
    category_slug: 'zanist',
    media_type: 'video',
    media_url: '',
    thumbnail_url: '',
    level: DEFAULT_UI.level_1,
    grade_level: DEFAULT_UI.grade_2,
    teacher_guide: '',
    guide_pdf_url: ''
  };
  const [formData, setFormData] = useState(emptyLessonForm);
  const [ferhengWords, setFerhengWords] = useState([]);
  const [totalWordCount, setTotalWordCount] = useState(0);
  const [searchingDict, setSearchingDict] = useState(false);
  const [ferhengQuery, setFerhengQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('all');
  const [selectedWordDetail, setSelectedWordDetail] = useState(null);
  const [editingWordId, setEditingWordId] = useState(null);
  const [wordMsg, setWordMsg] = useState('');
  const [syncingProgress, setSyncingProgress] = useState('');
  const [uploadingWordAudio, setUploadingWordAudio] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kk_search_history') || '[]');
    } catch {
      return [];
    }
  });
  const [favoriteWords, setFavoriteWords] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kk_fav_words') || '[]');
    } catch {
      return [];
    }
  });
  const [wordForm, setWordForm] = useState({
    word: '',
    part_of_speech: 'navdêr',
    meaning_tr: '',
    meaning_ku: '',
    example_sentence: '',
    audio_url: '',
    meanings_i18n: {},
    examples_i18n: {}
  });
  const [exercises, setExercises] = useState([]);
  const [alfabeReset, setAlfabeReset] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [builtWords, setBuiltWords] = useState([]);
  const [answerState, setAnswerState] = useState(null);
  const [unitCompleted, setUnitCompleted] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [comboCount, setComboCount] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [xpPoints, setXpPoints] = useState(() => Number(localStorage.getItem('kk_xp') || 0));
  const [streakDays, setStreakDays] = useState(() => Number(localStorage.getItem('kk_streak') || 0));
  const [completedUnits, setCompletedUnits] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kk_completed_units') || '[]');
    } catch {
      return [];
    }
  });
  const [shuffledRightOptions, setShuffledRightOptions] = useState([]);
  const [matchLeftSelected, setMatchLeftSelected] = useState(null);
  const [matchRightSelected, setMatchRightSelected] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [matchWrongFlash, setMatchWrongFlash] = useState(false);
  const [editingExId, setEditingExId] = useState(null);
  const [exMsg, setExMsg] = useState('');
  const [uploadingExImg, setUploadingExImg] = useState(false);
  const [uploadingExAudio, setUploadingExAudio] = useState(false);
  const [adminExUnitFilter, setAdminExUnitFilter] = useState('all');
  const [adminExSearch, setAdminExSearch] = useState('');
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
  const kurdishAlphabet = [
    'A', 'B', 'C', 'Ç', 'D', 'E', 'Ê', 'F', 'G', 'H', 'I', 'Î',
    'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'Ş', 'T',
    'U', 'Û', 'V', 'W', 'X', 'Y', 'Z'
  ];
  const dynamicLevels = [ui.level_1, ui.level_2, ui.level_3];
  const dynamicGrades = [ui.grade_1, ui.grade_2, ui.grade_3, ui.grade_4];
  const dynamicMediaTypes = [
    { id: 'video', label: ui.media_video, icon: Video },
    { id: 'document', label: ui.media_document, icon: FileText },
    { id: 'audio', label: ui.media_audio, icon: Headphones },
    { id: 'interactive', label: ui.media_interactive, icon: BookOpen }
  ];
  useEffect(() => {
    fetchCategories();
    fetchSiteSettings();
    fetchLessons();
    fetchExercises();
    fetchDictionary('', 'all');
  }, []);
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangMenuOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setLangMenuOpen(false);
        setActiveLesson(null);
        setSelectedWordDetail(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);
  const handleSelectLanguage = (code) => {
    setSelectedLang(code);
    localStorage.setItem('kk_lang', code);
    setLangMenuOpen(false);
  };
  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (!error && data && data.length > 0) setCategories(data);
  };
  const fetchSiteSettings = async () => {
    const { data, error } = await supabase.from('site_settings').select('*');
    if (!error && data) {
      const merged = { ...DEFAULT_UI };
      data.forEach((row) => {
        if (row.key in DEFAULT_UI && row.value) merged[row.key] = row.value;
      });
      setRawUi(merged);
      const remoteXpRow = data.find((r) => r.key === 'learner_xp_remote');
      const remoteStreakRow = data.find((r) => r.key === 'learner_streak_remote');
      const remoteUnitsRow = data.find((r) => r.key === 'learner_units_remote');
      const localXp = Number(localStorage.getItem('kk_xp') || 0);
      const remoteXp = Number(remoteXpRow?.value || 0);
      if (!Number.isNaN(remoteXp) && remoteXp > localXp) {
        setXpPoints(remoteXp);
        localStorage.setItem('kk_xp', String(remoteXp));
      }
      const localStreak = Number(localStorage.getItem('kk_streak') || 0);
      const remoteStreak = Number(remoteStreakRow?.value || 0);
      if (!Number.isNaN(remoteStreak) && remoteStreak > localStreak) {
        setStreakDays(remoteStreak);
        localStorage.setItem('kk_streak', String(remoteStreak));
      }
      if (remoteUnitsRow?.value) {
        try {
          const parsedRemote = JSON.parse(remoteUnitsRow.value);
          if (Array.isArray(parsedRemote) && parsedRemote.length > 0) {
            setCompletedUnits((prev) => {
              const union = [...new Set([...prev, ...parsedRemote])];
              localStorage.setItem('kk_completed_units', JSON.stringify(union));
              return union;
            });
          }
        } catch {
          // geçersiz json yoksayılır
        }
      }
    }
  };
  const persistProgressSnapshot = async (nextXp, nextStreak, nextUnits) => {
    localStorage.setItem('kk_xp', String(nextXp));
    localStorage.setItem('kk_streak', String(nextStreak));
    localStorage.setItem('kk_completed_units', JSON.stringify(nextUnits));
    await supabase.from('site_settings').upsert(
      [
        { key: 'learner_xp_remote', value: String(nextXp) },
        { key: 'learner_streak_remote', value: String(nextStreak) },
        { key: 'learner_units_remote', value: JSON.stringify(nextUnits) }
      ],
      { onConflict: 'key' }
    );
  };
  const fetchLessons = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setLessons(data);
    } finally {
      setLoading(false);
    }
  };
  const fetchExercises = async () => {
    const { data, error } = await supabase
      .from('kurmanci_exercises')
      .select('*')
      .order('sort_order', { ascending: true });
    if (!error && data) setExercises(data);
  };
  const effectiveExercises = (() => {
    const hasCustomAlfabe = exercises.some(
      (ex) => (ex.unit_title || '').trim().toUpperCase() === 'ALFABE'
    );
    if (hasCustomAlfabe || alfabeReset) return exercises;
    return [...BUILTIN_ALFABE_EXERCISES, ...exercises];
  })();
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASS) {
      setIsAdmin(true);
      localStorage.setItem('kk_admin', 'true');
      setAuthError('');
      setPasswordInput('');
    } else {
      setAuthError('Şîfre çewt e. Ji kerema xwe dîsa biceribîne.');
    }
  };
  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('kk_admin');
    setViewMode('student');
  };
  const handleFileUpload = async (event, field) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingField(field);
    const fileExt = file.name.split('.').pop();
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${field}/${safeName}`;
    const { error: uploadError } = await supabase.storage.from('materyal').upload(filePath, file);
    if (uploadError) {
      setStatusMsg({ type: 'error', text: 'Barkirin têk çû: ' + uploadError.message });
    } else {
      const { data: publicData } = supabase.storage.from('materyal').getPublicUrl(filePath);
      if (publicData?.publicUrl) {
        setFormData((prev) => ({ ...prev, [field]: publicData.publicUrl }));
      }
    }
    setUploadingField('');
    event.target.value = '';
  };
  const resetForm = () => {
    setEditingId(null);
    setFormData(emptyLessonForm);
  };
  const startEditing = (lesson) => {
    setActiveLesson(null);
    setViewMode('admin');
    setEditingId(lesson.id);
    setFormData({
      title: lesson.title || '',
      description: lesson.description || '',
      category_slug: lesson.category_slug || 'zanist',
      media_type: lesson.media_type || 'video',
      media_url: lesson.media_url || '',
      thumbnail_url: lesson.thumbnail_url || '',
      level: lesson.level || DEFAULT_UI.level_1,
      grade_level: lesson.grade_level || DEFAULT_UI.grade_2,
      teacher_guide: lesson.teacher_guide || '',
      guide_pdf_url: lesson.guide_pdf_url || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleSaveLesson = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    const payload = { ...formData, title: formData.title.trim() };
    const query = editingId
      ? supabase.from('lessons').update(payload).eq('id', editingId)
      : supabase.from('lessons').insert([payload]);
    const { error } = await query;
    if (error) {
      setStatusMsg({ type: 'error', text: 'Çewtî: ' + error.message });
    } else {
      setStatusMsg({
        type: 'success',
        text: editingId ? 'Ders bi serkeftî hat nûkirin!' : 'Materyala nû hat zêdekirin!'
      });
      resetForm();
      fetchLessons();
    }
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 4000);
  };
  const handleDeleteLesson = async (id) => {
    if (!window.confirm('Tu piştrast î ku dixwazî vî materyalî jê bibî?')) return;
    const { error } = await supabase.from('lessons').delete().eq('id', id);
    if (error) {
      setStatusMsg({ type: 'error', text: 'Çewtî: ' + error.message });
    } else {
      setLessons((prev) => prev.filter((item) => item.id !== id));
      if (activeLesson?.id === id) setActiveLesson(null);
      if (editingId === id) resetForm();
      setStatusMsg({ type: 'success', text: 'Materyal hat jêbirin.' });
    }
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 3500);
  };
  const handleUpdateCategoryName = (slug, name) => {
    setCategories((prev) => prev.map((c) => (c.slug === slug ? { ...c, name } : c)));
  };
  const handleSaveCategories = async () => {
    const rows = categories.map((c, idx) => ({
      slug: c.slug,
      name: c.name,
      sort_order: c.sort_order ?? idx + 1
    }));
    const { error } = await supabase.from('categories').upsert(rows, { onConflict: 'slug' });
    setCatMsg(error ? 'Çewtî: ' + error.message : 'Navên beşan hatin tomarkirin!');
    setTimeout(() => setCatMsg(''), 3500);
  };
  const handleAddCategory = async (e) => {
    e.preventDefault();
    const name = newCatName.trim();
    if (!name) return;
    let slug = slugify(name);
    if (categories.some((c) => c.slug === slug)) slug = `${slug}-${Date.now()}`;
    const row = { slug, name, sort_order: categories.length + 1 };
    const { error } = await supabase.from('categories').upsert([row], { onConflict: 'slug' });
    if (error) {
      setCatMsg('Çewtî: ' + error.message);
    } else {
      setCategories((prev) => [...prev, row]);
      setNewCatName('');
      setCatMsg('Beşa nû hat zêdekirin!');
    }
    setTimeout(() => setCatMsg(''), 3500);
  };
  const handleDeleteCategory = async (slug) => {
    if (!window.confirm('Tu piştrast î ku dixwazî vê beşê jê bibî?')) return;
    const { error } = await supabase.from('categories').delete().eq('slug', slug);
    if (error) {
      setCatMsg('Çewtî: ' + error.message);
    } else {
      setCategories((prev) => prev.filter((c) => c.slug !== slug));
      if (selectedCategory === slug) setSelectedCategory('all');
      setCatMsg('Beş hat jêbirin.');
    }
    setTimeout(() => setCatMsg(''), 3500);
  };
  const handleSaveAllUiTexts = async (e) => {
    e.preventDefault();
    const rows = UI_FIELD_LABELS.map((f) => ({ key: f.key, value: rawUi[f.key] || '' }));
    const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
    setSettingsMsg(error ? 'Çewtî: ' + error.message : 'Hemû nivîsên malperê hatin tomarkirin!');
    setTimeout(() => setSettingsMsg(''), 3500);
  };
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSelectedMedia('all');
    setSearchQuery('');
  };
  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedLevel !== 'all' ||
    selectedMedia !== 'all' ||
    searchQuery.trim() !== '';
  const recordSearchHistory = (term) => {
    const cleaned = term.trim();
    if (!cleaned) return;
    setSearchHistory((prev) => {
      const next = [cleaned, ...prev.filter((t) => t !== cleaned)].slice(0, 6);
      localStorage.setItem('kk_search_history', JSON.stringify(next));
      return next;
    });
  };
  const toggleFavoriteWord = (word) => {
    setFavoriteWords((prev) => {
      const exists = prev.includes(word);
      const next = exists ? prev.filter((w) => w !== word) : [word, ...prev];
      localStorage.setItem('kk_fav_words', JSON.stringify(next));
      return next;
    });
  };
  const speakWord = (word) => {
    if (!word || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(word);
    utter.lang = 'ku';
    window.speechSynthesis.speak(utter);
  };
  const playDictionaryPronunciation = (item) => {
    if (!item) return;
    if (item.audio_url) {
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
      const audio = new Audio(item.audio_url);
      audioPlayerRef.current = audio;
      audio.play().catch(() => speakWord(item.word));
      return;
    }
    speakWord(item.word);
  };
  const handleWordAudioUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingWordAudio(true);
    const fileExt = file.name.split('.').pop();
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `dictionary_audio/${safeName}`;
    const { error: uploadError } = await supabase.storage.from('materyal').upload(filePath, file);
    if (uploadError) {
      setWordMsg('Barkirin têk çû: ' + uploadError.message);
    } else {
      const { data: publicData } = supabase.storage.from('materyal').getPublicUrl(filePath);
      if (publicData?.publicUrl) {
        setWordForm((prev) => ({ ...prev, audio_url: publicData.publicUrl }));
      }
    }
    setUploadingWordAudio(false);
    event.target.value = '';
  };
  const fetchDictionary = async (searchText = '', letter = 'all') => {
    const requestId = ++fetchRequestRef.current;
    setSearchingDict(true);
    try {
      let query = supabase
        .from('dictionary')
        .select('*', { count: 'exact' })
        .order('word', { ascending: true });
      const q = sanitizeSearch(searchText);
      if (q) {
        query = query.or(
          `word.ilike.%${q}%,meaning_tr.ilike.%${q}%,meaning_ku.ilike.%${q}%,meaning_en.ilike.%${q}%,meanings_i18n::text.ilike.%${q}%,examples_i18n::text.ilike.%${q}%`
        );
      } else if (letter !== 'all') {
        const normLetter = normalizeKurdish(letter);
        query = query.ilike('word', `${normLetter}%`);
      }
      const { data, count, error } = await query.limit(100);
      if (requestId !== fetchRequestRef.current) return;
      let results = !error && data ? data : [];
      if (
        q &&
        q.length >= 2 &&
        !results.some((r) => normalizeKurdish(r.word) === normalizeKurdish(q))
      ) {
        const liveEntry = await fetchFromWiktionary(q);
        if (requestId !== fetchRequestRef.current) return;
        if (liveEntry) {
          results = [
            {
              id: `wiktionary-${normalizeKurdish(liveEntry.word)}`,
              sourceType: 'wiktionary',
              ...liveEntry
            },
            ...results
          ];
        }
      }
      setFerhengWords(results);
      if (count !== null && !q && letter === 'all') {
        setTotalWordCount(count);
      }
    } catch (err) {
      console.error('Dictionary fetch error:', err);
    } finally {
      if (requestId === fetchRequestRef.current) {
        setSearchingDict(false);
      }
    }
  };
  useEffect(() => {
    if (viewMode !== 'ferheng') return;
    const timer = setTimeout(() => {
      fetchDictionary(ferhengQuery, selectedLetter);
    }, 250);
    return () => clearTimeout(timer);
  }, [ferhengQuery, selectedLetter, viewMode]);
  const handleDictionarySearchSubmit = (e) => {
    e.preventDefault();
    if (ferhengQuery.trim()) recordSearchHistory(ferhengQuery);
    fetchDictionary(ferhengQuery, selectedLetter);
  };
  const handleBulkImportDictionary = async () => {
    setSyncingProgress('Peyvên bingehîn tên barkirin...');
    const sampleWords = BUILTIN_DICTIONARY.map(
      ({ word, part_of_speech, meaning_tr, meaning_ku, example_sentence, meanings_i18n, examples_i18n }) => ({
        word,
        part_of_speech,
        meaning_tr,
        meaning_ku,
        example_sentence,
        meanings_i18n,
        examples_i18n
      })
    );
    const { error } = await supabase.from('dictionary').insert(sampleWords);
    if (error) {
      setSyncingProgress('Çewtî: ' + error.message);
    } else {
      setSyncingProgress('Peyv bi serkeftî hatin zêdekirin!');
      fetchDictionary(ferhengQuery, selectedLetter);
    }
    setTimeout(() => setSyncingProgress(''), 4000);
  };
  const handleSaveWord = async (e) => {
    e.preventDefault();
    const activeMeaning = (
      wordForm.meanings_i18n?.[selectedLang] ||
      wordForm.meaning_tr ||
      wordForm.meaning_ku ||
      ''
    ).trim();
    if (!wordForm.word.trim() || !activeMeaning) return;
    const mergedMeanings = {
      ...(wordForm.meanings_i18n || {}),
      [selectedLang]: activeMeaning,
      ...(wordForm.meaning_tr ? { TR: wordForm.meaning_tr } : {}),
      ...(wordForm.meaning_ku ? { KU: wordForm.meaning_ku } : {})
    };
    const activeExample = (wordForm.examples_i18n?.[selectedLang] || wordForm.example_sentence || '').trim();
    const mergedExamples = {
      ...(wordForm.examples_i18n || {}),
      ...(activeExample ? { [selectedLang]: activeExample } : {}),
      ...(wordForm.example_sentence ? { KU: wordForm.example_sentence } : {})
    };
    const payload = {
      word: wordForm.word.trim(),
      part_of_speech: wordForm.part_of_speech,
      meaning_tr: wordForm.meaning_tr || (selectedLang === 'TR' ? activeMeaning : ''),
      meaning_ku: wordForm.meaning_ku || (selectedLang === 'KU' ? activeMeaning : ''),
      example_sentence: wordForm.example_sentence || activeExample,
      audio_url: (wordForm.audio_url || '').trim(),
      meanings_i18n: mergedMeanings,
      examples_i18n: mergedExamples
    };
    const query = editingWordId
      ? supabase.from('dictionary').update(payload).eq('id', editingWordId)
      : supabase.from('dictionary').insert([payload]);
    const { error } = await query;
    if (error) {
      setWordMsg('Çewtî: ' + error.message);
    } else {
      setWordMsg(editingWordId ? 'Peyv hat nûkirin!' : 'Peyva nû hat zêdekirin!');
      resetWordForm();
      fetchDictionary(ferhengQuery, selectedLetter);
    }
    setTimeout(() => setWordMsg(''), 3500);
  };
  const startEditingWord = (item) => {
    setEditingWordId(item.id);
    setWordForm({
      word: item.word || '',
      part_of_speech: item.part_of_speech || 'navdêr',
      meaning_tr: item.meaning_tr || '',
      meaning_ku: item.meaning_ku || '',
      example_sentence: item.example_sentence || '',
      audio_url: item.audio_url || '',
      meanings_i18n: item.meanings_i18n || {},
      examples_i18n: item.examples_i18n || {}
    });
  };
  const resetWordForm = () => {
    setEditingWordId(null);
    setWordForm({
      word: '',
      part_of_speech: 'navdêr',
      meaning_tr: '',
      meaning_ku: '',
      example_sentence: '',
      audio_url: '',
      meanings_i18n: {},
      examples_i18n: {}
    });
  };
  const handleDeleteWord = async (id) => {
    if (!window.confirm('Tu piştrast î ku dixwazî vê peyvê jê bibî?')) return;
    const { error } = await supabase.from('dictionary').delete().eq('id', id);
    if (error) {
      setWordMsg('Çewtî: ' + error.message);
    } else {
      setFerhengWords((prev) => prev.filter((item) => item.id !== id));
      if (selectedWordDetail?.id === id) setSelectedWordDetail(null);
      if (editingWordId === id) resetWordForm();
      setWordMsg('Peyv hat jêbirin.');
    }
    setTimeout(() => setWordMsg(''), 3500);
  };
  const filteredDictionary = (() => {
    const rawQ = ferhengQuery.trim();
    const normQ = normalizeKurdish(rawQ);
    const normLetter = selectedLetter === 'all' ? 'all' : normalizeKurdish(selectedLetter);
    const dbList = ferhengWords.map((w) => ({
      ...w,
      sourceType: w.sourceType || 'db'
    }));
    const seenWords = new Set(dbList.map((w) => normalizeKurdish(w.word)));
    const builtinList = BUILTIN_DICTIONARY.filter(
      (b) => !seenWords.has(normalizeKurdish(b.word))
    ).map((b) => ({
      ...b,
      sourceType: 'builtin'
    }));
    const combined = [...dbList, ...builtinList].filter((item) => {
      if (normLetter === 'all') return true;
      return normalizeKurdish(item.word || '').startsWith(normLetter);
    });
    if (!normQ) return combined;
    return combined
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
  const handleResetGamesSection = async () => {
    if (audioPlayerRef.current) audioPlayerRef.current.pause();
    setIsPlayingAudio(false);
    localStorage.removeItem('kk_xp');
    localStorage.removeItem('kk_streak');
    localStorage.removeItem('kk_completed_units');
    localStorage.removeItem('kk_last_day');
    await supabase.from('site_settings').upsert(
      [
        { key: 'learner_xp_remote', value: '0' },
        { key: 'learner_streak_remote', value: '0' },
        { key: 'learner_units_remote', value: '[]' }
      ],
      { onConflict: 'key' }
    );
    const { error } = await supabase.from('kurmanci_exercises').delete().not('id', 'is', null);
    setExercises([]);
    setAlfabeReset(true);
    setSelectedUnit(null);
    setCurrentExIndex(0);
    setSelectedOption('');
    setBuiltWords([]);
    setAnswerState(null);
    setUnitCompleted(false);
    setHearts(5);
    setComboCount(0);
    setXpPoints(0);
    setStreakDays(0);
    setCompletedUnits([]);
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
    setExMsg(
      error
        ? 'State û depoya herêmî hat sifirkirin; DB jêbirin: ' + error.message
        : 'Beşa lîstikan li ser arayû, localStorage û DB bi temamî hat sifirkirin.'
    );
    setTimeout(() => setExMsg(''), 4000);
  };
  const uploadExFile = async (event, folder, setBusy, field) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const fileExt = file.name.split('.').pop();
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${folder}/${safeName}`;
    const { error: uploadError } = await supabase.storage.from('materyal').upload(filePath, file);
    if (uploadError) {
      setExMsg('Barkirin têk çû: ' + uploadError.message);
      setTimeout(() => setExMsg(''), 4000);
    } else {
      const { data: publicData } = supabase.storage.from('materyal').getPublicUrl(filePath);
      if (publicData?.publicUrl) {
        setExForm((prev) => ({ ...prev, [field]: publicData.publicUrl }));
        setBrokenExImages((prev) => ({ ...prev, [publicData.publicUrl]: false }));
      }
    }
    setBusy(false);
    event.target.value = '';
  };
  const handleExImageUpload = (event) =>
    uploadExFile(event, 'exercises', setUploadingExImg, 'image_url');
  const handleExAudioUpload = (event) =>
    uploadExFile(event, 'exercise_audio', setUploadingExAudio, 'audio_url');
  const handleSaveExercise = async (e) => {
    e.preventDefault();
    const parsedOptions = exForm.options_raw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    if (!exForm.question_text.trim() || parsedOptions.length < 2) {
      setExMsg('Ji kerema xwe pirs û herî kêm 2 vebijêrk (bi bêhnokê veqetandî) binivîse.');
      return;
    }
    const finalCorrect =
      exForm.exercise_type === 'match'
        ? String(parsedOptions.length)
        : exForm.correct_answer.trim();
    if (exForm.exercise_type !== 'match' && !finalCorrect) {
      setExMsg('Ji kerema xwe bersiva rast binivîse.');
      return;
    }
    if (exForm.exercise_type === 'image_choice' && !exForm.image_url.trim()) {
      setExMsg('Ji bo vê cureyê lîstikê wêne pêwîst e. Wêneyek bar bike.');
      return;
    }
    if (
      exForm.exercise_type !== 'match' &&
      exForm.exercise_type !== 'sentence' &&
      !parsedOptions.some((o) => o.toLowerCase() === finalCorrect.toLowerCase())
    ) {
      setExMsg('Bersiva rast divê di nav vebijêrkan de hebe.');
      return;
    }
    const payload = {
      unit_title: exForm.unit_title.trim(),
      exercise_type: exForm.exercise_type,
      question_text: exForm.question_text.trim(),
      options: parsedOptions,
      correct_answer: finalCorrect,
      explanation: exForm.explanation.trim(),
      image_url: exForm.image_url.trim(),
      audio_url: exForm.audio_url.trim()
    };
    if (editingExId) {
      const { error } = await supabase
        .from('kurmanci_exercises')
        .update(payload)
        .eq('id', editingExId);
      if (error) {
        setExMsg('Çewtî: ' + error.message);
      } else {
        setExercises((prev) =>
          prev.map((item) => (item.id === editingExId ? { ...item, ...payload } : item))
        );
        setExMsg('Lîstik bi serkeftî hat nûkirin!');
        resetExForm();
      }
    } else {
      const newRecord = {
        id: `local-ex-${Date.now()}`,
        ...payload,
        sort_order: exercises.length + 1
      };
      const { data: inserted, error } = await supabase
        .from('kurmanci_exercises')
        .insert([{ ...payload, sort_order: exercises.length + 1 }])
        .select();
      if (error) {
        setExercises((prev) => [...prev, newRecord]);
        setExMsg('Lîstik li beşa nû hat zêdekirin.');
      } else {
        setExercises((prev) => [...prev, ...(inserted && inserted.length ? inserted : [newRecord])]);
        setExMsg('Lîstika nû hat zêdekirin!');
      }
      if (payload.unit_title.toUpperCase() === 'ALFABE') {
        setAlfabeReset(false);
      }
      resetExForm();
    }
    setTimeout(() => setExMsg(''), 4000);
  };
  const startEditingExercise = (ex) => {
    setEditingExId(ex.id);
    setExForm({
      unit_title: ex.unit_title || '',
      exercise_type: ex.exercise_type || 'choice',
      question_text: ex.question_text || '',
      options_raw: Array.isArray(ex.options) ? ex.options.join(', ') : '',
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
    if (error) {
      setExMsg('Çewtî: ' + error.message);
    } else {
      setExercises((prev) => prev.filter((item) => item.id !== id));
      if (editingExId === id) resetExForm();
      setExMsg('Lîstik hat jêbirin.');
    }
    setTimeout(() => setExMsg(''), 3500);
  };
  const isZarokUnit = (title = '') => {
    const t = title.toLowerCase().trim();
    return t.startsWith('zarok');
  };
  const unitList = [
    ...new Set(
      effectiveExercises
        .filter((ex) => !isZarokUnit(ex.unit_title))
        .map((ex) => ex.unit_title)
    )
  ];
  const zarokUnitList = [
    ...new Set(
      effectiveExercises
        .filter((ex) => isZarokUnit(ex.unit_title))
        .map((ex) => ex.unit_title)
    )
  ];
  const allExerciseUnits = [
    ...new Set(effectiveExercises.map((ex) => ex.unit_title).filter(Boolean))
  ];
  const filteredAdminExercises = effectiveExercises.filter((ex) => {
    if (adminExUnitFilter !== 'all' && ex.unit_title !== adminExUnitFilter) return false;
    const q = normalizeKurdish(adminExSearch);
    if (!q) return true;
    return (
      normalizeKurdish(ex.question_text || '').includes(q) ||
      normalizeKurdish(ex.unit_title || '').includes(q) ||
      normalizeKurdish(ex.correct_answer || '').includes(q)
    );
  });
  const unitExercises = (() => {
    if (!selectedUnit) return [];
    return effectiveExercises.filter((ex) => ex.unit_title === selectedUnit);
  })();
  const currentEx = unitExercises[currentExIndex];
  const playCurrentAudio = (url) => {
    if (!url) return;
    try {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      const [baseUrl, hashPart] = url.split('#t=');
      let startSec = 0;
      let endSec = null;
      if (hashPart) {
        const parts = hashPart.split(',');
        startSec = parseFloat(parts[0]) || 0;
        if (parts[1]) endSec = parseFloat(parts[1]);
      }
      const audio = new Audio(baseUrl);
      audio.preload = 'auto';
      audioPlayerRef.current = audio;
      setIsPlayingAudio(true);
      audio.onloadedmetadata = () => {
        if (startSec > 0) {
          audio.currentTime = startSec;
        }
      };
      audio.ontimeupdate = () => {
        if (endSec !== null && audio.currentTime >= endSec) {
          audio.pause();
          setIsPlayingAudio(false);
        }
      };
      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => setIsPlayingAudio(false);
      audio.play().catch((err) => {
        console.error('Audio play error:', err);
        setIsPlayingAudio(false);
      });
    } catch {
      setIsPlayingAudio(false);
    }
  };
  useEffect(() => {
    setIsPlayingAudio(false);
    setMediaLoadError('');
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    if (currentEx?.audio_url && viewMode === 'learn' && selectedUnit && !unitCompleted) {
      const timer = setTimeout(() => {
        playCurrentAudio(currentEx.audio_url);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [currentEx?.id, viewMode, selectedUnit, unitCompleted]);
  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
    };
  }, []);
  const resolveMatchVisual = (rawRight, leftText) => {
    const cleanedRight = (rawRight || '').trim();
    const isUrl = /^https?:\/\//i.test(cleanedRight);
    const wordCandidate = cleanedRight.startsWith('img:')
      ? cleanedRight.replace(/^img:/i, '').trim()
      : cleanedRight;
    const leftParts = (leftText || '').split('—');
    const letter = leftParts.length > 1 ? leftParts[0].trim() : '';
    const wordFromLeft = leftParts.length > 1 ? leftParts.slice(1).join('—').trim() : wordCandidate;
    const cellMeta =
      ALFABE_CELL_META_MAP[wordCandidate.toLocaleLowerCase('tr')] ||
      ALFABE_CELL_META_MAP[wordFromLeft.toLocaleLowerCase('tr')] ||
      ALFABE_CELL_META_MAP[letter.toLocaleLowerCase('tr')] ||
      null;
    const mappedImage =
      (isUrl ? cleanedRight : '') ||
      ALFABE_WORD_IMAGE_MAP[wordCandidate.toLocaleLowerCase('tr')] ||
      ALFABE_WORD_IMAGE_MAP[wordFromLeft.toLocaleLowerCase('tr')] ||
      ALFABE_WORD_IMAGE_MAP[letter.toLocaleLowerCase('tr')] ||
      '';
    return {
      right: cleanedRight,
      image: mappedImage,
      word: wordFromLeft || wordCandidate,
      letter,
      cellMeta
    };
  };
  const parsedMatchPairs = (() => {
    if (!currentEx || currentEx.exercise_type !== 'match') return [];
    if (Array.isArray(currentEx.match_pairs) && currentEx.match_pairs.length > 0) {
      return currentEx.match_pairs.map((mp, idx) => {
        const resolved = resolveMatchVisual(mp.image || mp.right || mp.word, mp.left);
        return {
          id: mp.id ?? idx,
          left: mp.left,
          right: mp.right || resolved.right,
          image: mp.image || resolved.image,
          word: mp.word || resolved.word,
          letter: mp.letter || resolved.letter,
          cellMeta: mp.cellMeta || resolved.cellMeta
        };
      });
    }
    return (currentEx.options || [])
      .map((pairStr, idx) => {
        const parts = pairStr.split('=');
        if (parts.length < 2) return null;
        const left = parts[0].trim();
        const rawRight = parts.slice(1).join('=').trim();
        const resolved = resolveMatchVisual(rawRight, left);
        return {
          id: idx,
          left,
          ...resolved
        };
      })
      .filter(Boolean);
  })();
  useEffect(() => {
    if (currentEx?.exercise_type === 'match') {
      const rightItems = parsedMatchPairs.map((p) => ({
        id: p.id,
        right: p.right,
        image: p.image || '',
        word: p.word || '',
        letter: p.letter || '',
        cellMeta: p.cellMeta || null
      }));
      const shuffled = [...rightItems].sort(() => Math.random() - 0.5);
      setShuffledRightOptions(shuffled);
      setMatchLeftSelected(null);
      setMatchRightSelected(null);
      setMatchedPairs([]);
      setMatchWrongFlash(false);
    }
  }, [currentEx?.id]);
  useEffect(() => {
    if (currentEx?.exercise_type !== 'match' || parsedMatchPairs.length === 0) return;
    let cancelled = false;
    (async () => {
      for (const p of parsedMatchPairs) {
        const key = (p.word || p.right || String(p.id)).toLocaleLowerCase('tr');
        if (p.image || croppedAlfabeImages[key] || !p.cellMeta) continue;
        const cropped = await cropAlfabeCellFromSheet(p.cellMeta);
        if (!cancelled && cropped) {
          setCroppedAlfabeImages((prev) => ({ ...prev, [key]: cropped }));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentEx?.id]);
  const handleMatchSelect = (side, pairId) => {
    if (answerState || matchedPairs.includes(pairId) || hearts === 0) return;
    const nextLeft = side === 'left' ? pairId : matchLeftSelected;
    const nextRight = side === 'right' ? pairId : matchRightSelected;
    setMatchLeftSelected(nextLeft);
    setMatchRightSelected(nextRight);
    if (nextLeft !== null && nextRight !== null) {
      if (nextLeft === nextRight) {
        const updated = [...matchedPairs, nextLeft];
        setMatchedPairs(updated);
        setMatchLeftSelected(null);
        setMatchRightSelected(null);
        if (updated.length === parsedMatchPairs.length) {
          setAnswerState('correct');
          const nextXp = xpPoints + 15;
          setXpPoints(nextXp);
          setComboCount((c) => c + 1);
          persistProgressSnapshot(nextXp, streakDays, completedUnits);
        }
      } else {
        setMatchWrongFlash(true);
        setHearts((prev) => Math.max(0, prev - 1));
        setComboCount(0);
        setTimeout(() => {
          setMatchLeftSelected(null);
          setMatchRightSelected(null);
          setMatchWrongFlash(false);
        }, 550);
      }
    }
  };
  const startUnit = (unitName) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    setIsPlayingAudio(false);
    setSelectedUnit(unitName);
    setCurrentExIndex(0);
    setSelectedOption('');
    setBuiltWords([]);
    setAnswerState(null);
    setComboCount(0);
    setHearts(5);
    setUnitCompleted(false);
  };
  const closeActiveUnit = () => {
    const wasZarok = selectedUnit?.toUpperCase().startsWith('ZAROK:');
    if (audioPlayerRef.current) audioPlayerRef.current.pause();
    setIsPlayingAudio(false);
    setSelectedUnit(null);
    if (wasZarok) {
      setViewMode('student');
      setSelectedCategory('zarok');
    }
  };
  const toggleSentenceWord = (word, idx) => {
    if (answerState) return;
    const existsIndex = builtWords.findIndex((item) => item.idx === idx);
    if (existsIndex > -1) {
      setBuiltWords((prev) => prev.filter((_, i) => i !== existsIndex));
    } else {
      setBuiltWords((prev) => [...prev, { word, idx }]);
    }
  };
  const checkExerciseAnswer = () => {
    if (!currentEx || currentEx.exercise_type === 'match') return;
    const userAnswer =
      currentEx.exercise_type === 'sentence'
        ? builtWords.map((w) => w.word).join(' ').trim()
        : selectedOption.trim();
    if (!userAnswer) return;
    if (userAnswer.toLowerCase() === currentEx.correct_answer.trim().toLowerCase()) {
      setAnswerState('correct');
      const bonus = comboCount >= 2 ? 15 : 10;
      const nextXp = xpPoints + bonus;
      setXpPoints(nextXp);
      setComboCount((c) => c + 1);
      persistProgressSnapshot(nextXp, streakDays, completedUnits);
    } else {
      setAnswerState('wrong');
      setComboCount(0);
      setHearts((prev) => Math.max(0, prev - 1));
    }
  };
  const updateStreak = () => {
    const today = new Date().toISOString().slice(0, 10);
    const last = localStorage.getItem('kk_last_day');
    if (last === today) return streakDays;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const nextStreak = last === yesterday ? streakDays + 1 : 1;
    setStreakDays(nextStreak);
    localStorage.setItem('kk_streak', String(nextStreak));
    localStorage.setItem('kk_last_day', today);
    return nextStreak;
  };
  const goToNextExercise = () => {
    if (hearts === 0) return;
    if (currentExIndex + 1 < unitExercises.length) {
      setCurrentExIndex((prev) => prev + 1);
      setSelectedOption('');
      setBuiltWords([]);
      setAnswerState(null);
    } else {
      setUnitCompleted(true);
      const nextStreak = updateStreak();
      const updatedUnits =
        selectedUnit && !completedUnits.includes(selectedUnit)
          ? [...completedUnits, selectedUnit]
          : completedUnits;
      setCompletedUnits(updatedUnits);
      persistProgressSnapshot(xpPoints, nextStreak, updatedUnits);
    }
  };
  const filteredLessons = lessons.filter((l) => {
    if (selectedCategory !== 'all' && l.category_slug !== selectedCategory) return false;
    if (selectedLevel !== 'all' && l.level !== selectedLevel) return false;
    if (selectedMedia !== 'all' && l.media_type !== selectedMedia) return false;
    const q = normalizeKurdish(searchQuery);
    if (!q) return true;
    return (
      normalizeKurdish(l.title || '').includes(q) ||
      normalizeKurdish(l.description || '').includes(q)
    );
  });
  const mediaIconFor = (type) =>
    (dynamicMediaTypes.find((m) => m.id === type) || dynamicMediaTypes[0]).icon;
  const wrongAnswerLocked = answerState === 'wrong';
  const outOfHearts = hearts === 0 && !unitCompleted;
  const renderEmbeddedMedia = (lesson) => {
    const url = (lesson?.media_url || '').trim();
    if (!url) {
      return (
        <p className="text-xs text-slate-400">
          Lînka materyalê ya derveyî nehatiye zêdekirin.
        </p>
      );
    }
    const ytEmbed = getYouTubeEmbedUrl(url);
    const isAudio =
      lesson.media_type === 'audio' || /\.(mp3|wav|ogg|m4a)(\?|$)/i.test(url);
    const isPdf =
      lesson.media_type === 'document' || /\.pdf(\?|$)/i.test(url);
    const isVideoFile = /\.(mp4|webm|ogg)(\?|$)/i.test(url);
    return (
      <div className="space-y-3">
        {ytEmbed && (
          <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-200 bg-black">
            <iframe
              src={ytEmbed}
              title={lesson.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
        {!ytEmbed && isVideoFile && (
          <video
            controls
            src={url}
            onError={() => setMediaLoadError('Vîdyo nehat barkirin; lînkê vekirî biceribîne.')}
            className="w-full rounded-xl border border-slate-200 bg-black"
          />
        )}
        {isAudio && (
          <audio
            controls
            src={url}
            onError={() => setMediaLoadError('Pelê dengî nehat barkirin.')}
            className="w-full"
          />
        )}
        {isPdf && (
          <iframe
            src={url}
            title={lesson.title}
            className="w-full h-80 rounded-xl border border-slate-200"
          />
        )}
        {mediaLoadError && (
          <p className="text-xs text-red-700 font-medium">{mediaLoadError}</p>
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-bold px-5 py-2.5 rounded-lg text-sm"
        >
          <ExternalLink className="w-4 h-4" />
          <span>{ui.btn_open_material}</span>
        </a>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* ÜST MENÜ */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <button
            type="button"
            aria-label={ui.brand_first + ui.brand_second}
            title={ui.brand_first + ui.brand_second}
            onClick={() => setViewMode('student')}
            className="flex items-center gap-2.5 font-extrabold text-xl text-slate-900"
          >
            <span>
              {ui.brand_first}
              <span className="text-red-700">{ui.brand_second}</span>
            </span>
          </button>
          <nav aria-label="Menuya Sereke" className="flex items-center gap-1 sm:gap-2">
            {[
              { id: 'student', label: ui.nav_site, icon: LayoutDashboard },
              { id: 'learn', label: ui.nav_learn, icon: Sparkles },
              { id: 'ferheng', label: ui.nav_ferheng, icon: BookA },
              { id: 'admin', label: ui.nav_admin, icon: Lock }
            ].map((item) => {
              const Icon = item.icon;
              const active = viewMode === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-label={item.label}
                  title={item.label}
                  onClick={() => {
                    setViewMode(item.id);
                    if (item.id === 'learn') setSelectedUnit(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    active
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              );
            })}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                aria-label="Ziman hilbijêre"
                title="Ziman hilbijêre"
                onClick={() => setLangMenuOpen((o) => !o)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold text-slate-700 border border-slate-200 hover:border-red-300 hover:bg-red-50/40"
              >
                <span>{selectedLang}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-40">
                  {LANGUAGE_OPTIONS.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => handleSelectLanguage(l.code)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-red-50/50 flex items-center justify-between ${
                        selectedLang === l.code ? 'font-bold text-red-700 bg-red-50/40' : 'text-slate-700'
                      }`}
                    >
                      <span>{l.nativeName}</span>
                      {selectedLang === l.code && <Check className="w-4 h-4 text-red-700" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ===================== MALPER (ÖĞRENCİ) ===================== */}
        {viewMode === 'student' && (
          <div className="space-y-8">
            <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 border border-slate-800">
              <span className="inline-block bg-red-700 text-xs font-bold tracking-wide px-3 py-1 rounded-full mb-4">
                {ui.hero_badge}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-3 max-w-3xl">{ui.hero_title}</h1>
              <p className="text-slate-300 max-w-2xl mb-6">{ui.hero_subtitle}</p>
              <div className="relative max-w-xl">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={ui.search_placeholder}
                  className="w-full rounded-xl pl-12 pr-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </section>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                  selectedCategory === 'all'
                    ? 'bg-red-700 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-red-300 hover:text-red-700'
                }`}
              >
                {ui.all_categories_label}
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                    selectedCategory === c.slug
                      ? 'bg-red-700 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-red-300 hover:text-red-700'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-end gap-4">
              <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                <Filter className="w-4 h-4 text-red-700" />
                <span>{ui.filter_title}</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  {ui.filter_level_label}
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-700"
                >
                  <option value="all">{ui.filter_level_all}</option>
                  {dynamicLevels.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  {ui.filter_media_label}
                </label>
                <select
                  value={selectedMedia}
                  onChange={(e) => setSelectedMedia(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-700"
                >
                  <option value="all">{ui.filter_media_all}</option>
                  {dynamicMediaTypes.map((m) => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </select>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="ml-auto text-xs font-bold text-red-700 hover:text-red-800 underline px-2 py-2"
                >
                  {ui.reset_filters_btn}
                </button>
              )}
            </div>
            {selectedCategory === 'zarok' && zarokUnitList.length > 0 && (
              <section className="bg-red-50/60 border border-red-200 rounded-2xl p-5">
                <h2 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-red-700" />
                  <span>Lîstikên Zarokan</span>
                </h2>
                <div className="flex flex-wrap gap-3">
                  {zarokUnitList.map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => {
                        startUnit(u);
                        setViewMode('learn');
                      }}
                      className="bg-red-700 hover:bg-red-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition"
                    >
                      {u.replace(/^ZAROK:\s*/i, '')}
                    </button>
                  ))}
                </div>
              </section>
            )}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">{ui.list_all_title}</h2>
              <span className="text-sm text-slate-500">
                {filteredLessons.length} {ui.list_count_suffix}
              </span>
            </div>
            {loading ? (
              <p className="text-center text-slate-500 py-12">{ui.loading_text}</p>
            ) : filteredLessons.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800">{ui.empty_title}</h3>
                <p className="text-sm text-slate-500 mb-4">{ui.empty_subtitle}</p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-5 py-2 rounded-lg text-sm"
                    >
                      {ui.reset_filters_btn}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setViewMode('admin')}
                    className="bg-red-700 hover:bg-red-800 text-white font-bold px-5 py-2 rounded-lg text-sm"
                  >
                    {ui.empty_button}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLessons.map((lesson) => {
                  const Icon = mediaIconFor(lesson.media_type);
                  const hasGuide = lesson.teacher_guide || lesson.guide_pdf_url;
                  const showThumb = lesson.thumbnail_url && !brokenThumbs[lesson.id];
                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => {
                        setActiveLesson(lesson);
                        setLessonTab('content');
                      }}
                      className="text-left bg-white border border-slate-200 hover:border-red-300 rounded-2xl overflow-hidden hover:shadow-md transition"
                    >
                      <div className="aspect-video bg-slate-100 flex items-center justify-center relative">
                        {showThumb ? (
                          <img
                            src={lesson.thumbnail_url}
                            alt=""
                            onError={() => setBrokenThumbs((prev) => ({ ...prev, [lesson.id]: true }))}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Icon className="w-10 h-10 text-slate-300" />
                        )}
                        {hasGuide && (
                          <span className="absolute top-2 right-2 bg-red-700 text-white text-[10px] font-bold px-2 py-1 rounded">
                            {ui.card_guide_badge}
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="text-xs font-bold text-red-700 mb-1">
                          {categories.find((c) => c.slug === lesson.category_slug)?.name}
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1">{lesson.title}</h3>
                        <p className="text-sm text-slate-500 line-clamp-2">{lesson.description}</p>
                        <div className="text-xs text-slate-400 mt-3">
                          {ui.meta_level_prefix} {lesson.level} • {ui.meta_grade_prefix} {lesson.grade_level}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            {activeLesson && (
              <div
                className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                onClick={() => setActiveLesson(null)}
              >
                <div
                  className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h3 className="text-xl font-bold text-slate-900">{activeLesson.title}</h3>
                    <div className="flex items-center gap-2">
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => startEditing(activeLesson)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Sererast</span>
                        </button>
                      )}
                      <button
                        type="button"
                        aria-label="Bigire"
                        onClick={() => setActiveLesson(null)}
                        className="p-1 rounded hover:bg-slate-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-4 border-b border-slate-200">
                    {[
                      { id: 'content', label: ui.tab_content },
                      { id: 'guide', label: ui.tab_guide }
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setLessonTab(t.id)}
                        className={`px-4 py-2 text-sm font-bold border-b-2 -mb-px ${
                          lessonTab === t.id
                            ? 'border-red-700 text-red-700'
                            : 'border-transparent text-slate-500'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  {lessonTab === 'content' ? (
                    <div className="space-y-4">
                      {activeLesson.thumbnail_url &&
                        !brokenThumbs[activeLesson.id] &&
                        !getYouTubeEmbedUrl(activeLesson.media_url) && (
                          <img
                            src={activeLesson.thumbnail_url}
                            alt=""
                            onError={() =>
                              setBrokenThumbs((prev) => ({ ...prev, [activeLesson.id]: true }))
                            }
                            className="w-full rounded-xl"
                          />
                        )}
                      <p className="text-slate-700 whitespace-pre-line">{activeLesson.description}</p>
                      <div className="text-xs text-slate-500">
                        {ui.meta_level_prefix} {activeLesson.level} • {ui.meta_grade_prefix}{' '}
                        {activeLesson.grade_level}
                      </div>
                      {renderEmbeddedMedia(activeLesson)}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-red-700" />
                        <span>{ui.guide_heading}</span>
                      </h4>
                      {activeLesson.teacher_guide ? (
                        <p className="text-slate-700 whitespace-pre-line">{activeLesson.teacher_guide}</p>
                      ) : (
                        !activeLesson.guide_pdf_url && (
                          <p className="text-slate-500 text-sm">{ui.guide_empty_text}</p>
                        )
                      )}
                      {activeLesson.guide_pdf_url && (
                        <a
                          href={activeLesson.guide_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-bold px-5 py-2.5 rounded-lg text-sm"
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
          </div>
        )}
        {/* ===================== HÎNBÛN / LÎSTIK ===================== */}
        {viewMode === 'learn' && (
          <div className="max-w-3xl mx-auto">
            {!selectedUnit ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{ui.learn_title}</h1>
                  <p className="text-slate-500">{ui.learn_subtitle}</p>
                </div>
                <div className="flex justify-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold">
                    <Zap className="w-5 h-5 text-red-700" />
                    <span>{xpPoints}</span>
                    <span className="text-xs text-slate-500 font-semibold">{ui.learn_xp_label}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold">
                    <Flame className="w-5 h-5 text-red-600" />
                    <span>{streakDays}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold">
                    <Award className="w-5 h-5 text-red-700" />
                    <span>{completedUnits.length} / {unitList.length} {ui.learn_stage_prefix}</span>
                  </div>
                </div>
                {unitList.length === 0 ? (
                  <div className="text-center text-slate-500 bg-white border border-dashed border-slate-300 rounded-2xl p-8 space-y-4">
                    <p>{ui.learn_empty_units}</p>
                    <button
                      type="button"
                      onClick={() => setViewMode('admin')}
                      className="bg-red-700 hover:bg-red-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition"
                    >
                      + Lîstika Nû Zêde Bike
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {unitList.map((unit, idx) => {
                      const count = effectiveExercises.filter(
                        (ex) => ex.unit_title === unit
                      ).length;
                      const done = completedUnits.includes(unit);
                      return (
                        <button
                          key={unit}
                          type="button"
                          onClick={() => startUnit(unit)}
                          className="w-full flex items-center justify-between gap-4 bg-white border border-slate-200 hover:border-red-300 rounded-2xl p-5 text-left transition"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold ${
                                done ? 'bg-red-700 text-white' : 'bg-red-50 text-red-700'
                              }`}
                            >
                              {done ? <Check className="w-6 h-6" /> : idx + 1}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{unit}</div>
                              <div className="text-xs text-slate-500">
                                {ui.learn_stage_prefix} {idx + 1} • {count} {ui.learn_question_count_suffix}
                              </div>
                            </div>
                          </div>
                          {done && <Award className="w-6 h-6 text-red-700" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : unitCompleted || outOfHearts ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-5">
                {unitCompleted ? (
                  <Award className="w-16 h-16 text-red-700 mx-auto" />
                ) : (
                  <Heart className="w-16 h-16 text-slate-300 mx-auto" />
                )}
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {unitCompleted ? ui.learn_win_title : ui.learn_lose_title}
                </h2>
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => startUnit(selectedUnit)}
                    className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-bold px-5 py-2.5 rounded-xl"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{ui.learn_replay_btn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={closeActiveUnit}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-5 py-2.5 rounded-xl"
                  >
                    {ui.learn_back_units_btn}
                  </button>
                </div>
              </div>
            ) : !currentEx ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4">
                <p className="text-slate-500">{ui.learn_empty_units}</p>
                <button
                  type="button"
                  onClick={closeActiveUnit}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-5 py-2 rounded-xl"
                >
                  {ui.learn_back_units_btn}
                </button>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    aria-label="Derkeve"
                    onClick={closeActiveUnit}
                    className="p-1.5 rounded-lg hover:bg-slate-100"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-700 transition-all"
                      style={{ width: `${(currentExIndex / unitExercises.length) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-1 font-bold text-red-700">
                    <Heart className="w-5 h-5 fill-red-700" />
                    <span>{hearts}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-xs font-bold text-red-700">
                    {{
                      choice: ui.learn_type_choice,
                      sentence: ui.learn_type_sentence,
                      match: ui.learn_type_match,
                      fill_blank: ui.learn_type_fill,
                      image_choice: ui.learn_type_image
                    }[currentEx.exercise_type] || ''}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{currentEx.question_text}</h2>
                  {currentEx.image_url && !brokenExImages[currentEx.id] && (
                    <img
                      src={currentEx.image_url}
                      alt=""
                      onError={() =>
                        setBrokenExImages((prev) => ({ ...prev, [currentEx.id]: true }))
                      }
                      className={`rounded-xl border border-slate-200 mx-auto object-contain ${
                        currentEx.exercise_type === 'image_choice'
                          ? 'max-h-72 w-full bg-slate-50'
                          : 'max-h-56'
                      }`}
                    />
                  )}
                  {currentEx.audio_url && (
                    <button
                      type="button"
                      onClick={() => playCurrentAudio(currentEx.audio_url)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white ${
                        isPlayingAudio ? 'bg-red-500' : 'bg-red-700 hover:bg-red-800'
                      }`}
                    >
                      <Volume2 className="w-5 h-5" />
                      <span>{isPlayingAudio ? '...' : 'Guhdarî Bike'}</span>
                    </button>
                  )}
                </div>
                {(currentEx.exercise_type === 'choice' ||
                  currentEx.exercise_type === 'fill_blank' ||
                  currentEx.exercise_type === 'image_choice') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(currentEx.options || []).map((opt) => {
                      const isSel = selectedOption === opt;
                      const isRight =
                        answerState && opt.toLowerCase() === currentEx.correct_answer.trim().toLowerCase();
                      let cls = 'border-slate-200 hover:border-red-300';
                      if (isSel && !answerState) cls = 'border-red-700 bg-red-50';
                      if (answerState && isRight) cls = 'border-emerald-600 bg-emerald-50';
                      if (answerState === 'wrong' && isSel && !isRight) cls = 'border-red-600 bg-red-50';
                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={Boolean(answerState)}
                          onClick={() => setSelectedOption(opt)}
                          className={`border-2 rounded-xl px-4 py-3 font-semibold text-left transition ${cls}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}
                {currentEx.exercise_type === 'sentence' && (
                  <div className="space-y-4">
                    <div className="min-h-[56px] border-2 border-dashed border-slate-300 rounded-xl p-3 flex flex-wrap gap-2">
                      {builtWords.length === 0 && (
                        <span className="text-slate-400 text-sm">{ui.learn_sentence_placeholder}</span>
                      )}
                      {builtWords.map((w) => (
                        <button
                          key={w.idx}
                          type="button"
                          onClick={() => toggleSentenceWord(w.word, w.idx)}
                          className="bg-red-50 text-red-800 border border-red-200 font-semibold px-3 py-1.5 rounded-lg"
                        >
                          {w.word}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {(currentEx.options || []).map((word, idx) => {
                        const used = builtWords.some((b) => b.idx === idx);
                        return (
                          <button
                            key={`${word}-${idx}`}
                            type="button"
                            disabled={used}
                            onClick={() => toggleSentenceWord(word, idx)}
                            className={`border-2 border-slate-200 font-semibold px-3 py-1.5 rounded-lg transition ${
                              used ? 'opacity-30' : 'hover:border-red-300'
                            }`}
                          >
                            {word}
                          </button>
                        );
                      })}
                      {builtWords.length > 0 && !answerState && (
                        <button
                          type="button"
                          onClick={() => setBuiltWords([])}
                          className="ml-auto text-xs font-bold text-slate-500 hover:text-slate-800 underline"
                        >
                          Ji nû ve rêz bike
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {currentEx.exercise_type === 'match' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      {parsedMatchPairs.map((p) => {
                        const done = matchedPairs.includes(p.id);
                        const sel = matchLeftSelected === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            disabled={done}
                            onClick={() => handleMatchSelect('left', p.id)}
                            className={`w-full min-h-[104px] border-2 rounded-xl px-4 py-3 font-bold text-base text-left transition flex items-center justify-between ${
                              done
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                                : sel
                                ? matchWrongFlash
                                  ? 'border-red-600 bg-red-50'
                                  : 'border-red-700 bg-red-50'
                                : 'border-slate-200 hover:border-red-300 bg-white'
                            }`}
                          >
                            <span>{p.left}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="space-y-3">
                      {shuffledRightOptions.map((p) => {
                        const done = matchedPairs.includes(p.id);
                        const sel = matchRightSelected === p.id;
                        const cropKey = (p.word || p.right || String(p.id)).toLocaleLowerCase('tr');
                        const resolvedSrc = p.image || croppedAlfabeImages[cropKey] || '';
                        const hasRealImage = Boolean(resolvedSrc) && !brokenExImages[`match-${p.id}`];
                        return (
                          <button
                            key={p.id}
                            type="button"
                            disabled={done}
                            onClick={() => handleMatchSelect('right', p.id)}
                            className={`w-full min-h-[104px] border-2 rounded-xl p-2 font-semibold text-sm transition flex items-center justify-center overflow-hidden ${
                              done
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                                : sel
                                ? matchWrongFlash
                                  ? 'border-red-600 bg-red-50'
                                  : 'border-red-700 bg-red-50'
                                : 'border-slate-200 hover:border-red-300 bg-white'
                            }`}
                          >
                            {hasRealImage ? (
                              <img
                                src={resolvedSrc}
                                alt={p.word || p.right || ''}
                                onError={() =>
                                  setBrokenExImages((prev) => ({
                                    ...prev,
                                    [`match-${p.id}`]: true
                                  }))
                                }
                                className="h-24 w-full object-contain rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-24 rounded-lg bg-[#cbe7b8] border border-emerald-200 flex flex-col items-center justify-center text-slate-800 px-2">
                                <ImageIcon className="w-5 h-5 text-red-700 mb-0.5" />
                                <span className="text-xs font-extrabold text-slate-800 truncate max-w-full">
                                  {p.word || p.right}
                                </span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {answerState && (
                  <div
                    className={`rounded-xl p-4 text-sm font-medium ${
                      answerState === 'correct'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {answerState === 'correct' ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>{ui.learn_correct_msg}</span>
                        {comboCount >= 3 && <Flame className="w-4 h-4 text-red-700" />}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        <span>
                          {ui.learn_wrong_prefix} <b>{currentEx.correct_answer}</b>
                        </span>
                      </div>
                    )}
                    {currentEx.explanation && (
                      <p className="mt-2 font-normal">{currentEx.explanation}</p>
                    )}
                  </div>
                )}
                <div className="flex justify-end">
                  {!answerState && currentEx.exercise_type !== 'match' ? (
                    <button
                      type="button"
                      onClick={checkExerciseAnswer}
                      disabled={
                        currentEx.exercise_type === 'sentence'
                          ? builtWords.length === 0
                          : !selectedOption
                      }
                      className="bg-red-700 hover:bg-red-800 disabled:opacity-40 text-white font-bold px-8 py-3 rounded-xl"
                    >
                      {ui.learn_check_btn}
                    </button>
                  ) : answerState ? (
                    <button
                      type="button"
                      onClick={goToNextExercise}
                      className={`text-white font-bold px-8 py-3 rounded-xl ${
                        wrongAnswerLocked
                          ? 'bg-red-700 hover:bg-red-800'
                          : 'bg-slate-900 hover:bg-slate-800'
                      }`}
                    >
                      {ui.learn_next_btn}
                    </button>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        )}
        {/* ===================== FERHENG ===================== */}
        {viewMode === 'ferheng' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center justify-center gap-2">
                <BookA className="w-8 h-8 text-red-700" />
                <span>{ui.nav_ferheng}</span>
              </h1>
              <p className="text-sm text-slate-500">
                {ferhengQuery.trim() || selectedLetter !== 'all'
                  ? filteredDictionary.length
                  : Math.max(totalWordCount, filteredDictionary.length)}{' '}
                peyv
              </p>
            </div>
            <form onSubmit={handleDictionarySearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={ferhengQuery}
                  onChange={(e) => setFerhengQuery(e.target.value)}
                  placeholder={ui.ferheng_search_placeholder}
                  className="w-full border border-slate-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-red-700"
                />
              </div>
              <button
                type="submit"
                className="bg-red-700 hover:bg-red-800 text-white font-bold px-6 rounded-xl"
              >
                {ui.ferheng_search_btn}
              </button>
            </form>
            {(searchHistory.length > 0 || favoriteWords.length > 0) && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {searchHistory.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 text-slate-500 font-bold">
                      <History className="w-3.5 h-3.5" />
                      <span>Dîrok:</span>
                    </span>
                    {searchHistory.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setFerhengQuery(term)}
                        className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                )}
                {favoriteWords.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 text-red-700 font-bold">
                      <Star className="w-3.5 h-3.5 fill-red-700 text-red-700" />
                      <span>Bijare:</span>
                    </span>
                    {favoriteWords.map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setFerhengQuery(w)}
                        className="px-2.5 py-1 rounded-full bg-red-50 hover:bg-red-100 text-red-800 font-semibold border border-red-200"
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedLetter('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                  selectedLetter === 'all'
                    ? 'bg-red-700 text-white'
                    : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                #
              </button>
              {kurdishAlphabet.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setSelectedLetter(l)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                    selectedLetter === l
                      ? 'bg-red-700 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-red-300'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            {searchingDict && <p className="text-xs text-slate-400">...</p>}
            {filteredDictionary.length === 0 ? (
              <p className="text-center text-slate-500 bg-white border border-dashed border-slate-300 rounded-2xl p-8">
                {ui.ferheng_empty_text}
              </p>
            ) : (
              <div className="space-y-2">
                {filteredDictionary.map((item) => {
                  const isFav = favoriteWords.includes(item.word);
                  const displayMeaning = getWordMeaningByLang(item, selectedLang);
                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200 hover:border-red-300 rounded-xl px-4 py-3 flex items-center justify-between gap-3 transition"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedWordDetail(item)}
                        className="flex-1 text-left"
                      >
                        <span className="font-extrabold text-slate-900 mr-2">{item.word}</span>
                        <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded">
                          {item.part_of_speech}
                        </span>
                        <div className="text-sm text-slate-600 mt-0.5">{displayMeaning}</div>
                      </button>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          aria-label="Bijare"
                          onClick={() => toggleFavoriteWord(item.word)}
                          className="p-1.5 rounded-lg hover:bg-slate-100"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              isFav ? 'fill-red-700 text-red-700' : 'text-slate-300'
                            }`}
                          />
                        </button>
                        <button
                          type="button"
                          aria-label="Hûrgulî"
                          onClick={() => setSelectedWordDetail(item)}
                          className="p-1.5 rounded-lg hover:bg-slate-100"
                        >
                          <Eye className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {selectedWordDetail && (
              <div
                className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedWordDetail(null)}
              >
                <div
                  className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-2xl font-extrabold text-slate-900">
                        {selectedWordDetail.word}
                      </h3>
                      <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded">
                        {selectedWordDetail.part_of_speech}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => playDictionaryPronunciation(selectedWordDetail)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Bixwîne</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFavoriteWord(selectedWordDetail.word)}
                        className="p-1.5 rounded-lg hover:bg-slate-100"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            favoriteWords.includes(selectedWordDetail.word)
                              ? 'fill-red-700 text-red-700'
                              : 'text-slate-400'
                          }`}
                        />
                      </button>
                      <button
                        type="button"
                        aria-label="Bigire"
                        onClick={() => setSelectedWordDetail(null)}
                        className="p-1.5 rounded-lg hover:bg-slate-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm space-y-2">
                    {getWordMeaningByLang(selectedWordDetail, selectedLang) && (
                      <p>
                        <b>{selectedLang}:</b> {getWordMeaningByLang(selectedWordDetail, selectedLang)}
                      </p>
                    )}
                    {selectedWordDetail.meaning_tr && (
                      <p><b>TR:</b> {selectedWordDetail.meaning_tr}</p>
                    )}
                    {selectedWordDetail.meaning_en && (
                      <p><b>EN:</b> {selectedWordDetail.meaning_en}</p>
                    )}
                    {selectedWordDetail.meaning_ku && (
                      <p><b>KU:</b> {selectedWordDetail.meaning_ku}</p>
                    )}
                    {Object.entries(selectedWordDetail.meanings_i18n || {})
                      .filter(([code, val]) => val && !['KU', 'TR', 'EN', selectedLang].includes(code))
                      .map(([code, val]) => (
                        <p key={code}><b>{code}:</b> {val}</p>
                      ))}
                    {getWordExampleByLang(selectedWordDetail, selectedLang) && (
                      <p className="italic text-slate-600 border-l-4 border-red-300 pl-3">
                        {getWordExampleByLang(selectedWordDetail, selectedLang)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {/* ===================== RÊVEBER (ADMIN) ===================== */}
        {viewMode === 'admin' && (
          <div>
            {!isAdmin ? (
              <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md border border-slate-200 p-8 mt-8">
                <div className="w-12 h-12 bg-red-50 text-red-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-center text-slate-900 mb-1">
                  Têketina Rêveber (Admin)
                </h2>
                <p className="text-sm text-center text-slate-500 mb-6">
                  Ji bo birêvebirina naveroka KurdiKlass şîfreyê binivîse.
                </p>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Şîfreya Rêveber
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-red-700"
                    />
                  </div>
                  {authError && (
                    <p className="text-xs text-red-700 font-medium">{authError}</p>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-2.5 rounded-lg transition"
                  >
                    Têkeve Panelê
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold">Panela Rêveberiya KurdiKlass</h1>
                    <p className="text-slate-400 text-sm">
                      Ders, PDF, pirsên Hînbûn / Lîstik, peyvên Ferhengê û hemû nivîsên malperê ji vir biguherîne.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-red-700 px-4 py-2 rounded-xl text-sm font-bold">
                      {lessons.length} materyal
                    </span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-sm font-semibold transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Derkeve</span>
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-red-700" />
                      <span>
                        {editingExId
                          ? 'Lîstika Hînbûnê Sererast Bike'
                          : `Hînbûn / Lîstik (${effectiveExercises.length} lîstik)`}
                      </span>
                    </h2>
                    <button
                      type="button"
                      onClick={handleResetGamesSection}
                      className="bg-red-700 hover:bg-red-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                    >
                      Beşa Lîstikan Sifir Bike
                    </button>
                  </div>
                  {exMsg && (
                    <div className="p-3 rounded-xl mb-4 bg-red-50 text-red-800 border border-red-200 text-sm font-medium">
                      {exMsg}
                    </div>
                  )}
                  <form onSubmit={handleSaveExercise} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Navê Beşê / Qonaxê
                      </label>
                      <input
                        type="text"
                        required
                        value={exForm.unit_title}
                        onChange={(e) => setExForm({ ...exForm, unit_title: e.target.value })}
                        placeholder="Mînak: ALFABE"
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-red-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Cureyê Lîstikê
                      </label>
                      <select
                        value={exForm.exercise_type}
                        onChange={(e) => setExForm({ ...exForm, exercise_type: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-red-700"
                      >
                        <option value="choice">Vebijêrka Rast</option>
                        <option value="sentence">Hevokê Saz Bike</option>
                        <option value="match">Peyvan Bighîne Hev</option>
                        <option value="fill_blank">Valahiyê Tije Bike</option>
                        <option value="image_choice">Wêneyê Bibîne, Peyvê Hilbijêre</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Pirs an Rênîşander
                      </label>
                      <input
                        type="text"
                        required
                        value={exForm.question_text}
                        onChange={(e) => setExForm({ ...exForm, question_text: e.target.value })}
                        placeholder="Pirsê binivîse..."
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-red-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Dengê Lîstikê (Vebijarkî)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={exForm.audio_url}
                          onChange={(e) => setExForm({ ...exForm, audio_url: e.target.value })}
                          placeholder="https://... an jî deng bar bike ->"
                          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
                        />
                        <label className="cursor-pointer bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap">
                          <Volume2 className="w-4 h-4" />
                          <span>{uploadingExAudio ? 'Tê barkirin...' : 'Deng Bar Bike'}</span>
                          <input
                            type="file"
                            accept="audio/*"
                            className="hidden"
                            onChange={handleExAudioUpload}
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Wêneyê Lîstikê (Vebijarkî)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={exForm.image_url}
                          onChange={(e) => setExForm({ ...exForm, image_url: e.target.value })}
                          placeholder="https://... an jî wêne bar bike ->"
                          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
                        />
                        <label className="cursor-pointer bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap">
                          <ImageIcon className="w-4 h-4" />
                          <span>{uploadingExImg ? 'Tê barkirin...' : 'Wêne Bar Bike'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleExImageUpload}
                          />
                        </label>
                      </div>
                    </div>
                    <div className={exForm.exercise_type === 'match' ? 'md:col-span-2' : ''}>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        {exForm.exercise_type === 'match'
                          ? 'Cotên Peyv û Wêneyan (Mînak: A — Agir=https://.../agir.png, B — Bilbil=https://.../bilbil.png)'
                          : exForm.exercise_type === 'image_choice'
                          ? 'Vebijêrk (bi bêhnokê veqetandî) — wêne li jor bar bike'
                          : 'Vebijêrk an Peyv (bi bêhnokê veqetandî)'}
                      </label>
                      <input
                        type="text"
                        required
                        value={exForm.options_raw}
                        onChange={(e) => setExForm({ ...exForm, options_raw: e.target.value })}
                        placeholder="A — Agir=https://.../agir.png, B — Bilbil=https://.../bilbil.png"
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      />
                    </div>
                    {exForm.exercise_type !== 'match' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">
                          Bersiva Rast
                        </label>
                        <input
                          type="text"
                          required
                          value={exForm.correct_answer}
                          onChange={(e) => setExForm({ ...exForm, correct_answer: e.target.value })}
                          placeholder="Bersiva rast"
                          className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                        />
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Ravekirin (Vebijarkî)
                      </label>
                      <input
                        type="text"
                        value={exForm.explanation}
                        onChange={(e) => setExForm({ ...exForm, explanation: e.target.value })}
                        placeholder="Ravekirin..."
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm"
                      />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3">
                      <button
                        type="submit"
                        className="bg-red-700 hover:bg-red-800 text-white font-bold px-5 py-2 rounded-lg text-sm transition"
                      >
                        {editingExId ? 'Guhertina Lîstikê Tomar Bike' : '+ Lîstika Nû Zêde Bike'}
                      </button>
                      {editingExId && (
                        <button
                          type="button"
                          onClick={resetExForm}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-4 py-2 rounded-lg text-sm"
                        >
                          Betal Bike
                        </button>
                      )}
                    </div>
                  </form>
                  <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 mb-3">
                    <select
                      value={adminExUnitFilter}
                      onChange={(e) => setAdminExUnitFilter(e.target.value)}
                      className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-red-700"
                    >
                      <option value="all">Hemû Beş / Qonax ({effectiveExercises.length})</option>
                      {allExerciseUnits.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={adminExSearch}
                      onChange={(e) => setAdminExSearch(e.target.value)}
                      placeholder="Di lîstikan de bigere..."
                      className="flex-1 min-w-[180px] border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-red-700"
                    />
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {filteredAdminExercises.map((ex) => {
                      const isBuiltinAlfabe = String(ex.id || '').startsWith('alfabe-match-');
                      return (
                        <div key={ex.id} className="flex items-center justify-between gap-2 bg-slate-50 px-3.5 py-2 rounded-lg text-sm">
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            {ex.audio_url && (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-50 text-red-700 shrink-0">
                                <Volume2 className="w-4 h-4" />
                              </span>
                            )}
                            {ex.image_url && !brokenExImages[ex.id] && (
                              <img
                                src={ex.image_url}
                                alt=""
                                onError={() =>
                                  setBrokenExImages((prev) => ({ ...prev, [ex.id]: true }))
                                }
                                className="w-9 h-9 rounded object-cover shrink-0 border border-slate-200"
                              />
                            )}
                            <div className="truncate">
                              <span className="text-xs font-bold text-red-700 mr-2">[{ex.unit_title}]</span>
                              <span className="font-medium text-slate-800">{ex.question_text}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {!isBuiltinAlfabe && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => startEditingExercise(ex)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 text-xs font-medium"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Sererast</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteExercise(ex.id)}
                                  className="text-red-700 hover:text-red-900 p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-red-700" />
                    <span>{editingId ? 'Dersê Sererast Bike' : 'Materyala Nû Zêde Bike'}</span>
                  </h2>
                  {statusMsg.text && (
                    <div
                      className={`p-3.5 rounded-xl mb-4 flex items-center gap-2 text-sm font-medium ${
                        statusMsg.type === 'error'
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
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
                  <form onSubmit={handleSaveLesson} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Sernavê Dersê *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Mînak: Pergala Rojê û Gerstêrk"
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-red-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Beş (Kategori)
                      </label>
                      <select
                        value={formData.category_slug}
                        onChange={(e) => setFormData({ ...formData, category_slug: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-red-700"
                      >
                        {categories.map((c) => (
                          <option key={c.slug} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Cureyê Materyalê
                      </label>
                      <select
                        value={formData.media_type}
                        onChange={(e) => setFormData({ ...formData, media_type: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-red-700"
                      >
                        {dynamicMediaTypes.map((m) => (
                          <option key={m.id} value={m.id}>{m.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Lînka Materyalê an Pel Bar Bike
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.media_url}
                          onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                          placeholder="https://... an jî pel bar bike ->"
                          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-700"
                        />
                        <label className="cursor-pointer bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap">
                          <Upload className="w-4 h-4" />
                          <span>{uploadingField === 'media_url' ? 'Tê barkirin...' : 'Pel Bar Bike'}</span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'media_url')}
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Wêneyê Bergê
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.thumbnail_url}
                          onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                          placeholder="https://... an jî wêne bar bike ->"
                          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-700"
                        />
                        <label className="cursor-pointer bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap">
                          <Upload className="w-4 h-4" />
                          <span>{uploadingField === 'thumbnail_url' ? 'Tê barkirin...' : 'Wêne Bar Bike'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'thumbnail_url')}
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Ast
                      </label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-red-700"
                      >
                        {dynamicLevels.map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Pola Perwerdehiyê
                      </label>
                      <select
                        value={formData.grade_level}
                        onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-red-700"
                      >
                        {dynamicGrades.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Daxuyanî û Naveroka Dersê
                      </label>
                      <textarea
                        rows="3"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Derbarê vê dersê de agahî binivîse..."
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-red-700"
                      />
                    </div>
                    <div className="md:col-span-2 bg-red-50/40 border border-red-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <label className="text-xs font-extrabold uppercase text-red-900 flex items-center gap-1.5">
                          <ClipboardList className="w-4 h-4 text-red-700" />
                          <span>Rêbera Mamosteyan</span>
                        </label>
                        <label className="cursor-pointer bg-red-700 hover:bg-red-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" />
                          <span>
                            {uploadingField === 'guide_pdf_url'
                              ? 'PDF tê barkirin...'
                              : formData.guide_pdf_url
                              ? 'PDF Hat Barkirin ✓'
                              : 'PDFya Rêberê Bar Bike'}
                          </span>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'guide_pdf_url')}
                          />
                        </label>
                      </div>
                      <textarea
                        rows="3"
                        value={formData.teacher_guide}
                        onChange={(e) => setFormData({ ...formData, teacher_guide: e.target.value })}
                        placeholder="Armancên dersê, çalakiyên polê û notên ji bo mamosteyan..."
                        className="w-full border border-red-200 bg-white rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-red-700"
                      />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3">
                      <button
                        type="submit"
                        className="bg-red-700 hover:bg-red-800 text-white font-bold px-6 py-2.5 rounded-lg transition"
                      >
                        {editingId ? 'Guhertinan Tomar Bike' : 'Li Malperê Zêde Bike'}
                      </button>
                      {editingId && (
                        <button
                          type="button"
                          onClick={resetForm}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-5 py-2.5 rounded-lg transition"
                        >
                          Betal Bike
                        </button>
                      )}
                    </div>
                  </form>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <BookA className="w-5 h-5 text-red-700" />
                      <span>
                        {editingWordId
                          ? 'Peyva Ferhengê Sererast Bike'
                          : `Ferheng — Peyvên Nû Zêde Bike (${Math.max(totalWordCount, filteredDictionary.length)} tomarkirî)`}
                      </span>
                    </h2>
                    <button
                      type="button"
                      onClick={handleBulkImportDictionary}
                      disabled={Boolean(syncingProgress)}
                      className="bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                    >
                      + Peyvên Bingehîn Tomar Bike
                    </button>
                  </div>
                  {syncingProgress && (
                    <div className="p-3 rounded-xl mb-4 bg-red-50 text-red-900 border border-red-200 text-xs font-bold">
                      {syncingProgress}
                    </div>
                  )}
                  {wordMsg && (
                    <div className="p-3 rounded-xl mb-4 bg-red-50 text-red-900 border border-red-200 text-sm font-medium">
                      {wordMsg}
                    </div>
                  )}
                  <form onSubmit={handleSaveWord} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Peyv (Kurmancî) *
                      </label>
                      <input
                        type="text"
                        required
                        value={wordForm.word}
                        onChange={(e) => setWordForm({ ...wordForm, word: e.target.value })}
                        placeholder="Mînak: heval"
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-red-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Cureyê Peyvê
                      </label>
                      <select
                        value={wordForm.part_of_speech}
                        onChange={(e) => setWordForm({ ...wordForm, part_of_speech: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-red-700"
                      >
                        <option value="navdêr">navdêr</option>
                        <option value="lêker">lêker</option>
                        <option value="rengdêr">rengdêr</option>
                        <option value="hoker">hoker</option>
                        <option value="cînavk">cînavk</option>
                        <option value="hejmar">hejmar</option>
                        <option value="baneşan">baneşan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Wateya Peyvê ({selectedLang}) *
                      </label>
                      <input
                        type="text"
                        required
                        value={wordForm.meanings_i18n?.[selectedLang] ?? wordForm.meaning_tr}
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
                        placeholder="Wateya peyvê binivîse..."
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-red-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Ravekirina bi Kurmancî (KU)
                      </label>
                      <input
                        type="text"
                        value={wordForm.meaning_ku}
                        onChange={(e) => setWordForm({ ...wordForm, meaning_ku: e.target.value })}
                        placeholder="Kesê ku mirov pê re dostanî dike."
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-red-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Hevoka Mînak ({selectedLang})
                      </label>
                      <input
                        type="text"
                        value={wordForm.examples_i18n?.[selectedLang] ?? wordForm.example_sentence}
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
                        placeholder="Ew hevalê min ê herî baş e."
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-red-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Dengê Telaffuzê (Vebijarkî)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={wordForm.audio_url}
                          onChange={(e) => setWordForm({ ...wordForm, audio_url: e.target.value })}
                          placeholder="https://... an jî deng bar bike ->"
                          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
                        />
                        <label className="cursor-pointer bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap">
                          <Volume2 className="w-4 h-4" />
                          <span>{uploadingWordAudio ? 'Tê barkirin...' : 'Deng Bar Bike'}</span>
                          <input
                            type="file"
                            accept="audio/*"
                            className="hidden"
                            onChange={handleWordAudioUpload}
                          />
                        </label>
                      </div>
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3">
                      <button
                        type="submit"
                        className="bg-red-700 hover:bg-red-800 text-white font-bold px-5 py-2 rounded-lg text-sm transition"
                      >
                        {editingWordId ? 'Guhertina Peyvê Tomar Bike' : '+ Peyva Nû Zêde Bike'}
                      </button>
                      {editingWordId && (
                        <button
                          type="button"
                          onClick={resetWordForm}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-4 py-2 rounded-lg text-sm"
                        >
                          Betal Bike
                        </button>
                      )}
                    </div>
                  </form>
                  <div className="space-y-2 max-h-60 overflow-y-auto border-t border-slate-100 pt-4">
                    {filteredDictionary.slice(0, 100).map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-2 bg-slate-50 px-3.5 py-2 rounded-lg text-sm">
                        <div className="truncate">
                          <span className="font-bold text-slate-900 mr-2">{item.word}</span>
                          <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded mr-2">
                            {item.part_of_speech}
                          </span>
                          <span className="text-slate-600">— {getWordMeaningByLang(item, selectedLang)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.sourceType === 'db' && (
                            <>
                              <button
                                type="button"
                                onClick={() => startEditingWord(item)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 text-xs font-medium"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Sererast</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteWord(item.id)}
                                className="text-red-700 hover:text-red-900 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">
                    Materyalên Tomarkirî ({lessons.length})
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                          <th className="py-3 px-4">Sernav</th>
                          <th className="py-3 px-4">Beş</th>
                          <th className="py-3 px-4">Ast</th>
                          <th className="py-3 px-4 text-right">Kiryar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {lessons.map((lesson) => (
                          <tr key={lesson.id} className="hover:bg-slate-50">
                            <td className="py-3 px-4 font-semibold text-slate-900">
                              {lesson.title}
                            </td>
                            <td className="py-3 px-4 text-red-700 font-medium">
                              {categories.find((c) => c.slug === lesson.category_slug)?.name}
                            </td>
                            <td className="py-3 px-4 text-slate-600">{lesson.level}</td>
                            <td className="py-3 px-4 text-right space-x-2">
                              <button
                                onClick={() => startEditing(lesson)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-red-50 text-red-700 hover:bg-red-100 font-medium"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Sererast</span>
                              </button>
                              <button
                                onClick={() => handleDeleteLesson(lesson.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-red-50 text-red-800 hover:bg-red-100 font-medium"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Jê Bibe</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FolderEdit className="w-5 h-5 text-red-700" />
                    <span>Beş û Sernavên Sereke Biguherîne</span>
                  </h2>
                  {catMsg && (
                    <div className="p-3 rounded-xl mb-4 bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-medium">
                      {catMsg}
                    </div>
                  )}
                  <div className="space-y-3 mb-6">
                    {categories.map((cat) => (
                      <div key={cat.slug} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={cat.name}
                          onChange={(e) => handleUpdateCategoryName(cat.slug, e.target.value)}
                          className="flex-1 border border-slate-300 rounded-lg px-3.5 py-2 text-sm font-semibold focus:outline-none focus:border-red-700"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.slug)}
                          className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                          title="Beşê Jê Bibe"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleSaveCategories}
                      className="bg-red-700 hover:bg-red-800 text-white font-bold px-5 py-2 rounded-lg text-sm transition"
                    >
                      Navên Beşan Tomar Bike
                    </button>
                  </div>
                  <form onSubmit={handleAddCategory} className="pt-4 border-t border-slate-200 flex flex-wrap gap-3">
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="Navê Beşa Nû"
                      className="flex-1 min-w-[220px] border border-slate-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-red-700"
                    />
                    <button
                      type="submit"
                      className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-5 py-2 rounded-lg text-sm transition"
                    >
                      + Beşa Nû Zêde Bike
                    </button>
                  </form>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-red-700" />
                    <span>Hemû Nivîsên Malperê Biguherîne</span>
                  </h2>
                  {settingsMsg && (
                    <div className="p-3 rounded-xl mb-4 bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-medium">
                      {settingsMsg}
                    </div>
                  )}
                  <form onSubmit={handleSaveAllUiTexts} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {UI_FIELD_LABELS.map((field) => (
                      <div key={field.key}>
                        <label className="block text-xs font-bold text-slate-600 mb-1">
                          {field.label}
                        </label>
                        <input
                          type="text"
                          value={ui[field.key] || ''}
                          onChange={(e) => setRawUi({ ...rawUi, [field.key]: e.target.value })}
                          className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-red-700"
                        />
                      </div>
                    ))}
                    <div className="md:col-span-2 pt-2">
                      <button
                        type="submit"
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-lg transition text-sm"
                      >
                        Hemû Nivîsên Malperê Tomar Bike
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="font-bold text-white text-base">
            {ui.brand_first}<span className="text-red-500">{ui.brand_second}</span>
          </div>
          <p>{ui.footer_text}</p>
        </div>
      </footer>
    </div>
  );
}
