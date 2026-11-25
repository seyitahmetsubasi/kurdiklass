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
const ALFABE_IMAGE_URLS = {
  a: '',
  b: '',
  c: '',
  ç: '',
  d: '',
  e: '',
  ê: '',
  f: '',
  g: '',
  h: '',
  i: '',
  î: '',
  j: '',
  k: '',
  l: '',
  m: '',
  n: '',
  o: '',
  p: '',
  q: '',
  r: '',
  s: '',
  ş: '',
  t: '',
  u: '',
  û: '',
  v: '',
  w: '',
  x: '',
  y: '',
  z: ''
};
const ALFABE_CELL_META_MAP = {
  agir: { row: 0, col: 0 },
  a: { row: 0, col: 0 },
  bilbil: { row: 0, col: 1 },
  b: { row: 0, col: 1 },
  cotkar: { row: 0, col: 2 },
  c: { row: 0, col: 2 },
  çay: { row: 0, col: 3 },
  ç: { row: 0, col: 3 },
  dar: { row: 0, col: 4 },
  d: { row: 0, col: 4 },
  ewr: { row: 0, col: 5 },
  e: { row: 0, col: 5 },
  êvar: { row: 1, col: 0 },
  ê: { row: 1, col: 0 },
  firok: { row: 1, col: 1 },
  f: { row: 1, col: 1 },
  gul: { row: 1, col: 2 },
  g: { row: 1, col: 2 },
  hêvî: { row: 1, col: 3 },
  h: { row: 1, col: 3 },
  îşev: { row: 1, col: 4 },
  î: { row: 1, col: 4 },
  jîr: { row: 1, col: 5 },
  j: { row: 1, col: 5 },
  karton: { row: 2, col: 0 },
  k: { row: 2, col: 0 },
  lîmon: { row: 2, col: 1 },
  l: { row: 2, col: 1 },
  masî: { row: 2, col: 2 },
  m: { row: 2, col: 2 },
  nan: { row: 2, col: 3 },
  n: { row: 2, col: 3 },
  otobûs: { row: 2, col: 4 },
  o: { row: 2, col: 4 },
  pirtûk: { row: 2, col: 5 },
  p: { row: 2, col: 5 },
  qelem: { row: 3, col: 0 },
  q: { row: 3, col: 0 },
  roj: { row: 3, col: 1 },
  r: { row: 3, col: 1 },
  stêrk: { row: 3, col: 2 },
  s: { row: 3, col: 2 },
  şev: { row: 3, col: 3 },
  ş: { row: 3, col: 3 },
  top: { row: 3, col: 4 },
  t: { row: 3, col: 4 },
  uf: { row: 3, col: 5 },
  u: { row: 3, col: 5 },
  ûd: { row: 4, col: 0 },
  û: { row: 4, col: 0 },
  valîz: { row: 4, col: 1 },
  v: { row: 4, col: 1 },
  wêne: { row: 4, col: 2 },
  w: { row: 4, col: 2 },
  xew: { row: 4, col: 3 },
  x: { row: 4, col: 3 },
  yoyo: { row: 4, col: 4 },
  y: { row: 4, col: 4 },
  zebeş: { row: 4, col: 5 },
  z: { row: 4, col: 5 }
};
const ALFABE_WORD_IMAGE_MAP = {
  agir: ALFABE_IMAGE_URLS.a,
  a: ALFABE_IMAGE_URLS.a,
  bilbil: ALFABE_IMAGE_URLS.b,
  b: ALFABE_IMAGE_URLS.b,
  cotkar: ALFABE_IMAGE_URLS.c,
  c: ALFABE_IMAGE_URLS.c,
  çay: ALFABE_IMAGE_URLS.ç,
  ç: ALFABE_IMAGE_URLS.ç,
  dar: ALFABE_IMAGE_URLS.d,
  d: ALFABE_IMAGE_URLS.d,
  ewr: ALFABE_IMAGE_URLS.e,
  e: ALFABE_IMAGE_URLS.e,
  êvar: ALFABE_IMAGE_URLS.ê,
  ê: ALFABE_IMAGE_URLS.ê,
  firok: ALFABE_IMAGE_URLS.f,
  f: ALFABE_IMAGE_URLS.f,
  gul: ALFABE_IMAGE_URLS.g,
  g: ALFABE_IMAGE_URLS.g,
  hêvî: ALFABE_IMAGE_URLS.h,
  h: ALFABE_IMAGE_URLS.h,
  îşev: ALFABE_IMAGE_URLS.î,
  î: ALFABE_IMAGE_URLS.î,
  jîr: ALFABE_IMAGE_URLS.j,
  j: ALFABE_IMAGE_URLS.j,
  karton: ALFABE_IMAGE_URLS.k,
  k: ALFABE_IMAGE_URLS.k,
  lîmon: ALFABE_IMAGE_URLS.l,
  l: ALFABE_IMAGE_URLS.l,
  masî: ALFABE_IMAGE_URLS.m,
  m: ALFABE_IMAGE_URLS.m,
  nan: ALFABE_IMAGE_URLS.n,
  n: ALFABE_IMAGE_URLS.n,
  otobûs: ALFABE_IMAGE_URLS.o,
  o: ALFABE_IMAGE_URLS.o,
  pirtûk: ALFABE_IMAGE_URLS.p,
  p: ALFABE_IMAGE_URLS.p,
  qelem: ALFABE_IMAGE_URLS.q,
  q: ALFABE_IMAGE_URLS.q,
  roj: ALFABE_IMAGE_URLS.r,
  r: ALFABE_IMAGE_URLS.r,
  stêrk: ALFABE_IMAGE_URLS.s,
  s: ALFABE_IMAGE_URLS.s,
  şev: ALFABE_IMAGE_URLS.ş,
  ş: ALFABE_IMAGE_URLS.ş,
  top: ALFABE_IMAGE_URLS.t,
  t: ALFABE_IMAGE_URLS.t,
  uf: ALFABE_IMAGE_URLS.u,
  u: ALFABE_IMAGE_URLS.u,
  ûd: ALFABE_IMAGE_URLS.û,
  û: ALFABE_IMAGE_URLS.û,
  valîz: ALFABE_IMAGE_URLS.v,
  v: ALFABE_IMAGE_URLS.v,
  wêne: ALFABE_IMAGE_URLS.w,
  w: ALFABE_IMAGE_URLS.w,
  xew: ALFABE_IMAGE_URLS.x,
  x: ALFABE_IMAGE_URLS.x,
  yoyo: ALFABE_IMAGE_URLS.y,
  y: ALFABE_IMAGE_URLS.y,
  zebeş: ALFABE_IMAGE_URLS.z,
  z: ALFABE_IMAGE_URLS.z
};
const cropAlfabeCellFromSheet = async (cellMeta) => {
  if (!cellMeta || typeof document === 'undefined') return '';
  const sheetUrl =
    (typeof ALFABE_SHEET_IMAGE_URL !== 'undefined' && ALFABE_SHEET_IMAGE_URL) ||
    ALFABE_IMAGE_URLS.a ||
    '';
  if (!sheetUrl) return '';
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = sheetUrl;
    });
    const cols = 6;
    const rows = 5;
    const cellW = img.naturalWidth / cols;
    const cellH = img.naturalHeight / rows;
    const sx = cellMeta.col * cellW + cellW * 0.06;
    const sy = cellMeta.row * cellH + cellH * 0.24;
    const sw = cellW * 0.88;
    const sh = cellH * 0.56;
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(sw));
    canvas.height = Math.max(1, Math.round(sh));
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  } catch {
    return '';
  }
};
const BUILTIN_EXERCISES = [
  {
    id: 'alfabe-match-1',
    unit_title: 'ALFABE',
    exercise_type: 'match',
    question_text: 'Her tîp û peyvê bi wêneyê wê/wî re bighîne hev (1/5)',
    options: [
      'A — Agir=agir',
      'B — Bilbil=bilbil',
      'C — Cotkar=cotkar',
      'Ç — Çay=çay',
      'D — Dar=dar',
      'E — Ewr=ewr'
    ],
    correct_answer: '6',
    explanation: 'A: Agir, B: Bilbil, C: Cotkar, Ç: Çay, D: Dar, E: Ewr',
    sort_order: 1
  },
  {
    id: 'alfabe-match-2',
    unit_title: 'ALFABE',
    exercise_type: 'match',
    question_text: 'Her tîp û peyvê bi wêneyê wê/wî re bighîne hev (2/5)',
    options: [
      'Ê — Êvar=êvar',
      'F — Firok=firok',
      'G — Gul=gul',
      'H — Hêvî=hêvî',
      'Î — Îşev=îşev',
      'J — Jîr=jîr'
    ],
    correct_answer: '6',
    explanation: 'Ê: Êvar, F: Firok, G: Gul, H: Hêvî, Î: Îşev, J: Jîr',
    sort_order: 2
  },
  {
    id: 'alfabe-match-3',
    unit_title: 'ALFABE',
    exercise_type: 'match',
    question_text: 'Her tîp û peyvê bi wêneyê wê/wî re bighîne hev (3/5)',
    options: [
      'K — Karton=karton',
      'L — Lîmon=lîmon',
      'M — Masî=masî',
      'N — Nan=nan',
      'O — Otobûs=otobûs',
      'P — Pirtûk=pirtûk'
    ],
    correct_answer: '6',
    explanation: 'K: Karton, L: Lîmon, M: Masî, N: Nan, O: Otobûs, P: Pirtûk',
    sort_order: 3
  },
  {
    id: 'alfabe-match-4',
    unit_title: 'ALFABE',
    exercise_type: 'match',
    question_text: 'Her tîp û peyvê bi wêneyê wê/wî re bighîne hev (4/5)',
    options: [
      'Q — Qelem=qelem',
      'R — Roj=roj',
      'S — Stêrk=stêrk',
      'Ş — Şev=şev',
      'T — Top=top',
      'U — Uf=uf'
    ],
    correct_answer: '6',
    explanation: 'Q: Qelem, R: Roj, S: Stêrk, Ş: Şev, T: Top, U: Uf',
    sort_order: 4
  },
  {
    id: 'alfabe-match-5',
    unit_title: 'ALFABE',
    exercise_type: 'match',
    question_text: 'Her tîp û peyvê bi wêneyê wê/wî re bighîne hev (5/5)',
    options: [
      'Û — Ûd=ûd',
      'V — Valîz=valîz',
      'W — Wêne=wêne',
      'X — Xew=xew',
      'Y — Yoyo=yoyo',
      'Z — Zebeş=zebeş'
    ],
    correct_answer: '6',
    explanation: 'Û: Ûd, V: Valîz, W: Wêne, X: Xew, Y: Yoyo, Z: Zebeş',
    sort_order: 5
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
  const [selectedLang, setSelectedLang] = useState(() => {
    try {
      const saved = localStorage.getItem('kk_lang');
      return saved && LANGUAGE_OPTIONS.some((l) => l.code === saved) ? saved : 'KU';
    } catch {
      return 'KU';
    }
  });
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langDropdownRef = useRef(null);
  const [viewMode, setViewMode] = useState('student');
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('kk_admin') === 'true');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [categories, setCategories] = useState(defaultCategories);
  const [newCatName, setNewCatName] = useState('');
  const [catMsg, setCatMsg] = useState('');
  const [dynamicLevels, setDynamicLevels] = useState(defaultLevels);
  const [dynamicGrades, setDynamicGrades] = useState(defaultGrades);
  const [dynamicMediaTypes, setDynamicMediaTypes] = useState(defaultMediaTypes);
  const [rawUi, setRawUi] = useState(DEFAULT_UI_TEXTS);
  const [settingsMsg, setSettingsMsg] = useState('');
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
  const [editingId, setEditingId] = useState(null);
  const [uploadingField, setUploadingField] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    title: '',
    category_slug: 'zarok',
    media_type: 'video',
    media_url: '',
    thumbnail_url: '',
    level: defaultLevels[0],
    grade_level: defaultGrades[0],
    description: '',
    teacher_guide: '',
    guide_pdf_url: ''
  });
  const [exercises, setExercises] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [builtWords, setBuiltWords] = useState([]);
  const [answerState, setAnswerState] = useState(null);
  const [unitCompleted, setUnitCompleted] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [comboCount, setComboCount] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioPlayerRef = useRef(null);
  const [matchLeftSelected, setMatchLeftSelected] = useState(null);
  const [matchRightSelected, setMatchRightSelected] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [shuffledRightOptions, setShuffledRightOptions] = useState([]);
  const [matchWrongFlash, setMatchWrongFlash] = useState(false);
  const [xpPoints, setXpPoints] = useState(() => Number(localStorage.getItem('kk_xp') || 0));
  const [streakDays, setStreakDays] = useState(() => Number(localStorage.getItem('kk_streak') || 0));
  const [completedUnits, setCompletedUnits] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kk_completed_units') || '[]');
    } catch {
      return [];
    }
  });
  const [editingExId, setEditingExId] = useState(null);
  const [uploadingExImg, setUploadingExImg] = useState(false);
  const [uploadingExAudio, setUploadingExAudio] = useState(false);
  const [adminExUnitFilter, setAdminExUnitFilter] = useState('all');
  const [adminExSearch, setAdminExSearch] = useState('');
  const [alfabeReset, setAlfabeReset] = useState(false);
  const [exMsg, setExMsg] = useState('');
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
  const [dictionaryWords, setDictionaryWords] = useState([]);
  const [totalWordCount, setTotalWordCount] = useState(0);
  const [ferhengQuery, setFerhengQuery] = useState('');
  const [wiktionaryMatches, setWiktionaryMatches] = useState([]);
  const [searchingDict, setSearchingDict] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState('all');
  const [selectedWordDetail, setSelectedWordDetail] = useState(null);
  const [editingWordId, setEditingWordId] = useState(null);
  const [uploadingWordAudio, setUploadingWordAudio] = useState(false);
  const [syncingProgress, setSyncingProgress] = useState('');
  const [wordMsg, setWordMsg] = useState('');
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
  const ui = (() => {
    const langPrefix = `${selectedLang.toLowerCase()}_`;
    const merged = { ...DEFAULT_UI_TEXTS };
    Object.keys(DEFAULT_UI_TEXTS).forEach((k) => {
      if (rawUi[langPrefix + k]) {
        merged[k] = rawUi[langPrefix + k];
      } else if (rawUi[k]) {
        merged[k] = rawUi[k];
      }
    });
    return merged;
  })();
  const handleSelectLanguage = async (langCode) => {
    setSelectedLang(langCode);
    setLangMenuOpen(false);
    try {
      localStorage.setItem('kk_lang', langCode);
    } catch {
      // ignore storage errors
    }
    try {
      await supabase
        .from('site_settings')
        .upsert([{ key: 'active_ui_language', value: langCode }], { onConflict: 'key' });
    } catch {
      // ignore network errors
    }
  };
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangMenuOpen(false);
      }
    };
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        setLangMenuOpen(false);
        setActiveLesson(null);
        setSelectedWordDetail(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);
  const persistProgressSnapshot = async (nextXp, nextStreak, nextUnits) => {
    try {
      localStorage.setItem('kk_xp', String(nextXp));
      localStorage.setItem('kk_streak', String(nextStreak));
      localStorage.setItem('kk_completed_units', JSON.stringify(nextUnits));
    } catch {
      // ignore storage quota errors
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
      // ignore network sync errors
    }
  };
  const fetchAllData = async () => {
    setLoading(true);
    const { data: lessonsData } = await supabase
      .from('lessons')
      .select('*')
      .order('created_at', { ascending: false });
    if (lessonsData) setLessons(lessonsData);
    const { data: exData } = await supabase
      .from('kurmanci_exercises')
      .select('*')
      .order('sort_order', { ascending: true });
    if (exData) setExercises(exData);
    const { count: dictCount } = await supabase
      .from('dictionary')
      .select('*', { count: 'exact', head: true });
    const { data: dictData } = await supabase
      .from('dictionary')
      .select('*')
      .order('word', { ascending: true })
      .range(0, 999);
    const dbRows = dictData || [];
    setDictionaryWords(dbRows);
    setTotalWordCount(
      Math.max(Number(dictCount || 0), dbRows.length, BUILTIN_DICTIONARY.length)
    );
    const { data: settingsData } = await supabase.from('site_settings').select('*');
    if (settingsData) {
      const uiMap = { ...DEFAULT_UI_TEXTS };
      let remoteXp = null;
      let remoteStreak = null;
      let remoteUnits = null;
      settingsData.forEach((row) => {
        if (row.key === 'categories_json' && row.value) {
          try {
            const parsed = JSON.parse(row.value);
            if (Array.isArray(parsed) && parsed.length > 0) setCategories(parsed);
          } catch {
            // ignore malformed JSON
          }
        } else if (row.key === 'levels_json' && row.value) {
          try {
            const parsed = JSON.parse(row.value);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setDynamicLevels(parsed);
              setFormData((prev) => ({
                ...prev,
                level: parsed.includes(prev.level) ? prev.level : parsed[0]
              }));
            }
          } catch {
            // ignore
          }
        } else if (row.key === 'grades_json' && row.value) {
          try {
            const parsed = JSON.parse(row.value);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setDynamicGrades(parsed);
              setFormData((prev) => ({
                ...prev,
                grade_level: parsed.includes(prev.grade_level) ? prev.grade_level : parsed[0]
              }));
            }
          } catch {
            // ignore
          }
        } else if (row.key === 'media_types_json' && row.value) {
          try {
            const parsed = JSON.parse(row.value);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const iconMap = {
                video: Video,
                document: FileText,
                audio: Headphones,
                book: BookOpen
              };
              const hydrated = parsed.map((m) => ({
                ...m,
                icon: iconMap[m.id] || BookOpen
              }));
              setDynamicMediaTypes(hydrated);
              setFormData((prev) => ({
                ...prev,
                media_type: hydrated.some((m) => m.id === prev.media_type)
                  ? prev.media_type
                  : hydrated[0].id
              }));
            }
          } catch {
            // ignore
          }
        } else if (row.key === 'learner_xp_remote' && row.value !== null) {
          remoteXp = Number(row.value) || 0;
        } else if (row.key === 'learner_streak_remote' && row.value !== null) {
          remoteStreak = Number(row.value) || 0;
        } else if (row.key === 'learner_units_remote' && row.value) {
          try {
            const parsedUnits = JSON.parse(row.value);
            if (Array.isArray(parsedUnits)) remoteUnits = parsedUnits;
          } catch {
            // ignore
          }
        } else if (row.key && row.key !== 'active_ui_language') {
          uiMap[row.key] = row.value;
        }
      });
      setRawUi(uiMap);
      const localXp = Number(localStorage.getItem('kk_xp') || 0);
      if (remoteXp !== null && remoteXp > localXp) {
        setXpPoints(remoteXp);
        localStorage.setItem('kk_xp', String(remoteXp));
      }
      const localStreak = Number(localStorage.getItem('kk_streak') || 0);
      if (remoteStreak !== null && remoteStreak > localStreak) {
        setStreakDays(remoteStreak);
        localStorage.setItem('kk_streak', String(remoteStreak));
      }
      if (Array.isArray(remoteUnits) && remoteUnits.length > 0) {
        setCompletedUnits((prev) => {
          const mergedUnits = [...new Set([...prev, ...remoteUnits])];
          localStorage.setItem('kk_completed_units', JSON.stringify(mergedUnits));
          return mergedUnits;
        });
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchAllData();
  }, []);
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (passwordInput.trim() === ADMIN_PASSCODE) {
      setIsAdmin(true);
      sessionStorage.setItem('kk_admin', 'true');
      setAuthError('');
      setPasswordInput('');
    } else {
      setAuthError('Şîfre şaş e! Ji kerema xwe dîsa biceribîne.');
    }
  };
  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('kk_admin');
    setEditingId(null);
    setEditingWordId(null);
    setEditingExId(null);
  };
  const handleFileUpload = async (e, targetField) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(targetField);
    setStatusMsg({ type: '', text: '' });
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from('materyal')
      .upload(filePath, file);
    if (uploadError) {
      setStatusMsg({
        type: 'error',
        text: 'Barkirina pelê têk çû: ' + uploadError.message
      });
    } else {
      const { data: publicUrlData } = supabase.storage
        .from('materyal')
        .getPublicUrl(filePath);
      if (publicUrlData?.publicUrl) {
        setFormData((prev) => ({ ...prev, [targetField]: publicUrlData.publicUrl }));
        if (targetField === 'thumbnail_url') {
          setBrokenThumbs({});
        }
        setStatusMsg({
          type: 'success',
          text: 'Pel bi serkeftî hat barkirin û lînk hat bicîkirin!'
        });
      }
    }
    setUploadingField(null);
    e.target.value = '';
  };
  const handleSaveLesson = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });
    if (!formData.title.trim()) {
      setStatusMsg({ type: 'error', text: 'Ji kerema xwe sernavê dersê binivîse.' });
      return;
    }
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
        setEditingId(null);
        resetForm();
        fetchAllData();
      }
    } else {
      const { error } = await supabase.from('lessons').insert([payload]);
      if (error) {
        setStatusMsg({ type: 'error', text: 'Çewtî çêbû: ' + error.message });
      } else {
        setStatusMsg({ type: 'success', text: 'Materyala nû bi serkeftî hat zêdekirin!' });
        resetForm();
        fetchAllData();
      }
    }
  };
  const resetForm = () => {
    setFormData({
      title: '',
      category_slug: categories[0]?.slug || 'zarok',
      media_type: dynamicMediaTypes[0]?.id || 'video',
      media_url: '',
      thumbnail_url: '',
      level: dynamicLevels[0] || defaultLevels[0],
      grade_level: dynamicGrades[0] || defaultGrades[0],
      description: '',
      teacher_guide: '',
      guide_pdf_url: ''
    });
    setEditingId(null);
  };
  const startEditing = (lesson) => {
    setActiveLesson(null);
    setEditingId(lesson.id);
    setFormData({
      title: lesson.title || '',
      category_slug: lesson.category_slug || 'zarok',
      media_type: lesson.media_type || 'video',
      media_url: lesson.media_url || '',
      thumbnail_url: lesson.thumbnail_url || '',
      level: lesson.level || dynamicLevels[0] || defaultLevels[0],
      grade_level: lesson.grade_level || dynamicGrades[0] || defaultGrades[0],
      description: lesson.description || '',
      teacher_guide: lesson.teacher_guide || '',
      guide_pdf_url: lesson.guide_pdf_url || ''
    });
    setViewMode('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleDeleteLesson = async (id) => {
    if (!window.confirm('Tu piştrast î ku dixwazî vê materyalê jê bibî?')) return;
    const { error } = await supabase.from('lessons').delete().eq('id', id);
    if (!error) {
      fetchAllData();
    }
  };
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
  const handleUpdateCategoryName = (slug, newName) => {
    setCategories((prev) =>
      prev.map((c) => (c.slug === slug ? { ...c, name: newName } : c))
    );
  };
  const handleAddCategory = async (e) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    const baseSlug = trimmed
      .toLowerCase()
      .replace(/[^a-z0-9çğıöşü\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    const slug = `${baseSlug || 'bes'}-${Date.now().toString().slice(-4)}`;
    const updated = [...categories, { slug, name: trimmed }];
    setCategories(updated);
    setNewCatName('');
    const { error } = await supabase
      .from('site_settings')
      .upsert([{ key: 'categories_json', value: JSON.stringify(updated) }], {
        onConflict: 'key'
      });
    setCatMsg(error ? 'Çewtî: ' + error.message : 'Beşa nû hat zêdekirin û tomarkirin!');
    setTimeout(() => setCatMsg(''), 3500);
  };
  const handleDeleteCategory = async (slug) => {
    if (categories.length <= 1) {
      setCatMsg('Divê herî kêm beşek bimîne.');
      return;
    }
    const updated = categories.filter((c) => c.slug !== slug);
    setCategories(updated);
    const { error } = await supabase
      .from('site_settings')
      .upsert([{ key: 'categories_json', value: JSON.stringify(updated) }], {
        onConflict: 'key'
      });
    setCatMsg(error ? 'Çewtî: ' + error.message : 'Beş hat jêbirin.');
    setTimeout(() => setCatMsg(''), 3500);
  };
  const handleSaveCategories = async () => {
    const { error } = await supabase
      .from('site_settings')
      .upsert([{ key: 'categories_json', value: JSON.stringify(categories) }], {
        onConflict: 'key'
      });
    setCatMsg(error ? 'Çewtî: ' + error.message : 'Navên beşan hatin tomarkirin!');
    setTimeout(() => setCatMsg(''), 3500);
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
    const hasCustomAlfabe = exercises.some(
      (ex) => (ex.unit_title || '').trim().toUpperCase() === 'ALFABE'
    );
    const base =
      alfabeReset || hasCustomAlfabe
        ? exercises
        : [...BUILTIN_EXERCISES, ...exercises];
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
    const isUrl = /^(https?:\/\/|data:image\/)/i.test(cleanedRight);
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
                            className={`w-full min-h-[112px] border-2 rounded-xl px-4 py-3 font-bold text-base text-left transition flex items-center justify-between ${
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
                            className={`w-full min-h-[112px] border-2 rounded-xl p-2 font-semibold text-sm transition flex items-center justify-center overflow-hidden ${
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
