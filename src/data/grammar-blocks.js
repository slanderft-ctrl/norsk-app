
export const grammar_1_1 = {
  topic: "Теперішній час (presens) і порядок слів",
  blocks: [
    {
      heading: "Дієслова в presens закінчуються на -r",
      text: "Майже всі норвезькі дієслова в теперішньому часі закінчуються на -r і не змінюються за особами. Форма однакова для всіх: jeg heter, du heter, han/hun heter, vi heter. Не треба запам'ятовувати окремі закінчення як в українській — одна форма на всіх.",
    },
    {
      heading: "Правило V2 — дієслово на другому місці",
      text: "У розповідному реченні дієслово завжди стоїть на другій позиції. Якщо речення починається з підмета — спочатку підмет, потім дієслово (Jeg bor i Bergen). Якщо речення починається з іншого слова, наприклад обставини часу, дієслово все одно лишається другим, а підмет переходить після нього (Nå bor jeg i Bergen).",
    },
  ],
  examples: [
    { no: "Jeg heter Daria.", ua: "Мене звати Дарія.", hi: "heter" },
    { no: "Hun snakker ukrainsk og litt norsk.", ua: "Вона говорить українською і трохи норвезькою.", hi: "snakker" },
    { no: "Jeg bor i Bergen nå.", ua: "Я живу в Бергені зараз.", hi: "bor" },
  ],
  exercises: [
    { type: "conjugate", task: "Постав дієслово у presens", sentence: "Jeg ___ fra Ukraina. (å komme)", answer: "kommer" },
    { type: "conjugate", task: "Постав дієслово у presens", sentence: "Vi ___ norsk på kurset. (å snakke)", answer: "snakker" },
    { type: "wordorder", task: "Постав слова у правильному порядку", scrambled: ["bor", "Jeg", "i", "Oslo"], answer: "Jeg bor i Oslo" },
    { type: "wordorder", task: "Постав слова у правильному порядку (речення починається з 'Nå')", scrambled: ["Nå", "jeg", "går", "på", "kurs"], answer: "Nå går jeg på kurs" },
  ],
  extra: {
    type: "pronunciation",
    title: "Як це читається",
    intro: "Норвезька вимова часто не збігається з написанням. Ключові слова з тексту:",
    items: [
      { word: "jeg", read: "єй", note: "g не вимовляється" },
      { word: "heter", read: "ге́тер", note: "довге e, наголос на першому складі" },
      { word: "hyggelig", read: "гю́ґелі", note: "остання g тиха" },
      { word: "gøy", read: "ґой", note: "ø — як німецьке ö, губи округлені" },
    ],
  },
}

// 1.2 — Familien min
export const grammar_1_2 = {
  topic: "Присвійні займенники (min / mi / mitt / mine)",
  blocks: [
    {
      heading: "Форма залежить від роду іменника",
      text: "Присвійний займенник «мій» має чотири форми залежно від роду і числа іменника: min (чоловічий рід), mi (жіночий рід), mitt (середній рід), mine (множина). Moren min, søstera mi, huset mitt, foreldrene mine.",
    },
    {
      heading: "Займенник стоїть ПІСЛЯ іменника",
      text: "На відміну від української, присвійний займенник ставиться після іменника, а сам іменник вживається в означеній формі (із закінченням -en/-a/-et). Тому не «min mor», а «moren min» (буквально «мама-та моя»). Це найтиповіша норвезька конструкція присвійності.",
    },
  ],
  examples: [
    { no: "Moren min heter Olena.", ua: "Мою маму звати Олена.", hi: "min" },
    { no: "Søsteren min er snill.", ua: "Моя сестра добра.", hi: "min" },
    { no: "Familien min bor i Ukraina.", ua: "Моя сім'я живе в Україні.", hi: "min" },
  ],
  exercises: [
    { type: "conjugate", task: "Встав правильну форму (min/mi/mitt/mine)", sentence: "Moren ___ heter Lena.", answer: "min" },
    { type: "conjugate", task: "Встав правильну форму (min/mi/mitt/mine)", sentence: "Foreldrene ___ bor i Kharkiv.", answer: "mine" },
    { type: "wordorder", task: "Постав слова у правильному порядку", scrambled: ["min", "Faren", "ingeniør", "er"], answer: "Faren min er ingeniør" },
    { type: "wordorder", task: "Постав слова у правильному порядку", scrambled: ["savner", "Jeg", "dem", "veldig"], answer: "Jeg savner dem veldig" },
  ],
  extra: {
    type: "lexicon",
    title: "Лексика: сім'я",
    intro: "Слово søsken («брати й сестри») не має точного відповідника в українській — це збірне слово для всіх дітей одних батьків.",
    items: [
      { word: "mor → moren", note: "мама → ця мама (означена форма)" },
      { word: "far → faren", note: "тато → цей тато" },
      { word: "søster → søsteren", note: "сестра → ця сестра" },
      { word: "søsken", note: "брати і сестри разом (без однини)" },
    ],
  },
}

// 1.3 — Mine hobbyer
export const grammar_1_3 = {
  topic: "Конструкція «å like + інфінітив»",
  blocks: [
    {
      heading: "liker å + інфінітив = «люблю робити»",
      text: "Щоб сказати, що тобі подобається щось РОБИТИ, використовуй дієслово «å like» у presens (liker) + частку «å» + інфінітив другого дієслова: jeg liker å lese («я люблю читати»). Частку «å» перед другим дієсловом пропускати не можна.",
    },
    {
      heading: "Винесення обставини на початок (інверсія)",
      text: "Коли речення починається з обставини часу (Om sommeren, Om vinteren), спрацьовує правило V2: дієслово лишається другим, підмет переходить після нього. Om sommeren liker jeg å sykle — буквально «Влітку люблю я кататися».",
    },
  ],
  examples: [
    { no: "Jeg liker å lese bøker.", ua: "Я люблю читати книги.", hi: "liker å lese" },
    { no: "Jeg liker også å spille gitar.", ua: "Я також люблю грати на гітарі.", hi: "liker også å spille" },
    { no: "Om sommeren liker jeg å sykle.", ua: "Влітку я люблю кататися на велосипеді.", hi: "liker jeg" },
  ],
  exercises: [
    { type: "conjugate", task: "Встав частку перед інфінітивом", sentence: "Jeg liker ___ lese bøker.", answer: "å" },
    { type: "conjugate", task: "Постав дієслово у presens", sentence: "Hun ___ gitar to ganger i uken. (å spille)", answer: "spiller" },
    { type: "wordorder", task: "Постав слова у правильному порядку", scrambled: ["liker", "Jeg", "å", "sykle"], answer: "Jeg liker å sykle" },
    { type: "wordorder", task: "Постав слова (речення починається з 'Om vinteren')", scrambled: ["Om vinteren", "jeg", "liker", "å", "gå på tur"], answer: "Om vinteren liker jeg å gå på tur" },
  ],
  extra: {
    type: "lexicon",
    title: "Лексика: пори року",
    intro: "Зверни увагу на конструкцію «om + пора року» — вона означає «протягом / коли настає».",
    items: [
      { word: "om sommeren", note: "влітку" },
      { word: "om vinteren", note: "взимку" },
      { word: "om våren", note: "навесні" },
      { word: "om høsten", note: "восени" },
    ],
  },
}

// 1.4 — En ny venn
export const grammar_1_4 = {
  topic: "Питальні слова і будова запитань",
  blocks: [
    {
      heading: "Питальні слова hva / hvor / hvordan / hvem",
      text: "Норвезькі питальні слова починаються на hv-: hva (що), hvor (де / куди), hvem (хто), hvordan (як), hvorfor (чому). Hvor lenge = «як довго». Усі вони ставляться на початок запитання.",
    },
    {
      heading: "Інверсія в запитанні",
      text: "У запитанні з питальним словом порядок такий: питальне слово + дієслово + підмет. Hvor kommer du fra? — спочатку hvor, потім дієслово kommer, потім підмет du. Дієслово знову на другій позиції (V2), як і в розповідному реченні.",
    },
  ],
  examples: [
    { no: "Hva heter du?", ua: "Як тебе звати?", hi: "Hva" },
    { no: "Hvor kommer du fra?", ua: "Звідки ти?", hi: "Hvor" },
    { no: "Hvor lenge har du bodd i Norge?", ua: "Як давно ти живеш у Норвегії?", hi: "Hvor lenge" },
  ],
  exercises: [
    { type: "conjugate", task: "Встав питальне слово", sentence: "___ heter du? (як)", answer: "Hva" },
    { type: "conjugate", task: "Встав питальне слово", sentence: "___ kommer du fra? (звідки)", answer: "Hvor" },
    { type: "wordorder", task: "Склади запитання", scrambled: ["kommer", "Hvor", "du", "fra"], answer: "Hvor kommer du fra" },
    { type: "wordorder", task: "Склади запитання", scrambled: ["heter", "Hva", "du"], answer: "Hva heter du" },
  ],
  extra: {
    type: "pronunciation",
    title: "Як це читається",
    intro: "Буквосполучення hv- на початку питальних слів вимовляється просто як «в»:",
    items: [
      { word: "hva", read: "ва", note: "h не вимовляється" },
      { word: "hvor", read: "вур", note: "h тихе, o → «у»" },
      { word: "hvem", read: "вем", note: "h тихе" },
      { word: "gjerne", read: "є́рне", note: "gj → «й»" },
    ],
  },
}

// 1.5 — På norskkurs
export const grammar_1_5 = {
  topic: "Час доби, числа і дієслова руху/дії",
  blocks: [
    {
      heading: "Klokka + число для позначення часу",
      text: "Щоб сказати, котра година, використовуй «klokka» + число: klokka ni (о дев'ятій), klokka tolv (о дванадцятій). «Klokka» буквально означає «годинник», але в цій конструкції відповідає українському «о … годині».",
    },
    {
      heading: "Дієслова starter / slutter (починатися / закінчуватися)",
      text: "Дієслова å starte (починатися) і å slutte (закінчуватися) у presens мають звичайне закінчення -r: starter, slutter. Вони описують початок і кінець подій у часі: Kurset starter klokka ni og slutter klokka tolv.",
    },
  ],
  examples: [
    { no: "Kurset starter klokka ni.", ua: "Курс починається о дев'ятій.", hi: "starter" },
    { no: "Det slutter klokka tolv.", ua: "Він закінчується о дванадцятій.", hi: "slutter" },
    { no: "Hun snakker sakte og tydelig.", ua: "Вона говорить повільно й чітко.", hi: "snakker" },
  ],
  exercises: [
    { type: "conjugate", task: "Постав дієслово у presens", sentence: "Kurset ___ klokka ni. (å starte)", answer: "starter" },
    { type: "conjugate", task: "Постав дієслово у presens", sentence: "Vi ___ hverandre med leksene. (å hjelpe)", answer: "hjelper" },
    { type: "wordorder", task: "Постав слова у правильному порядку", scrambled: ["starter", "Kurset", "klokka", "ni"], answer: "Kurset starter klokka ni" },
    { type: "wordorder", task: "Постав слова у правильному порядку", scrambled: ["femten", "Det", "er", "studenter"], answer: "Det er femten studenter" },
  ],
  extra: {
    type: "lexicon",
    title: "Лексика: навчання",
    intro: "Корисні слова з теми курсу, які трапляються постійно:",
    items: [
      { word: "en uttale", note: "вимова" },
      { word: "grammatikk", note: "граматика" },
      { word: "lekser", note: "домашнє завдання (завжди множина)" },
      { word: "hverandre", note: "один одного (взаємна дія)" },
    ],
  },
}

// ════════════════════════════════════════════════════════
// ТЕМА 2 — Hverdagen
// ════════════════════════════════════════════════════════

// 2.1 — En vanlig dag
export const grammar_2_1 = {
  topic: "Послідовність дій і час доби",
  blocks: [
    {
      heading: "Дієслова розпорядку дня в presens",
      text: "Опис звичайного дня будується на ланцюжку дій у presens: står opp, dusjer, spiser, tar bussen, leser, legger meg. Усі — у формі на -r. Деякі з них фразові (з прийменником/часткою): å stå opp (вставати), å legge seg (лягати).",
    },
    {
      heading: "Обставина часу на початку → інверсія",
      text: "Коли речення починається з обставини часу (Klokka åtte, Om kvelden, Om ettermiddagen), діє правило V2: дієслово другим, підмет після нього. Om kvelden ser jeg på TV — «Ввечері дивлюся я телевізор».",
    },
  ],
  examples: [
    { no: "Jeg står opp klokka sju.", ua: "Я встаю о сьомій.", hi: "står opp" },
    { no: "Klokka åtte tar jeg bussen.", ua: "О восьмій я їду автобусом.", hi: "tar jeg" },
    { no: "Om kvelden ser jeg på TV.", ua: "Ввечері я дивлюся телевізор.", hi: "ser jeg" },
  ],
  exercises: [
    { type: "conjugate", task: "Постав дієслово у presens", sentence: "Jeg ___ opp klokka sju. (å stå)", answer: "står" },
    { type: "conjugate", task: "Постав дієслово у presens", sentence: "Klokka elleve ___ jeg meg. (å legge)", answer: "legger" },
    { type: "wordorder", task: "Постав слова (починається з 'Klokka åtte')", scrambled: ["Klokka åtte", "jeg", "tar", "bussen"], answer: "Klokka åtte tar jeg bussen" },
    { type: "wordorder", task: "Постав слова (починається з 'Om kvelden')", scrambled: ["Om kvelden", "jeg", "leser", "en bok"], answer: "Om kvelden leser jeg en bok" },
  ],
  extra: {
    type: "lexicon",
    title: "Лексика: час доби",
    intro: "Конструкція «om + частина дня» означає «протягом цього часу доби»:",
    items: [
      { word: "om morgenen", note: "вранці" },
      { word: "om ettermiddagen", note: "після обіду" },
      { word: "om kvelden", note: "ввечері" },
      { word: "om natten", note: "вночі" },
    ],
  },
}

// 2.2 — Morgenrutine
export const grammar_2_2 = {
  topic: "Слова-послідовності та зворотні дієслова",
  blocks: [
    {
      heading: "Først → så → etter det (спочатку → потім → після цього)",
      text: "Щоб описати послідовність дій, норвежці вживають først (спочатку), så (потім), etter det (після цього), til slutt (нарешті). Коли речення починається з такого слова, спрацьовує V2: Så går jeg på badet — дієслово går стоїть одразу після så.",
    },
    {
      heading: "Зворотні дієслова (seg / meg)",
      text: "Деякі дії звернені на самого себе і потребують зворотного займенника: å vaske seg (вмиватися), å kle på seg (одягатися). Для «я» вживається meg: jeg vasker meg, jeg kler på meg.",
    },
  ],
  examples: [
    { no: "Først ringer vekkerklokka.", ua: "Спочатку дзвонить будильник.", hi: "Først ringer" },
    { no: "Så går jeg på badet.", ua: "Потім я йду у ванну.", hi: "Så går" },
    { no: "Jeg vasker ansiktet med kaldt vann.", ua: "Я вмиваю обличчя холодною водою.", hi: "vasker" },
  ],
  exercises: [
    { type: "conjugate", task: "Постав дієслово у presens", sentence: "Jeg ___ tennene på badet. (å pusse)", answer: "pusser" },
    { type: "conjugate", task: "Встав слово-послідовність", sentence: "___ dusjer jeg. (після цього)", answer: "Etter det" },
    { type: "wordorder", task: "Постав слова (починається з 'Først')", scrambled: ["Først", "vekkerklokka", "ringer"], answer: "Først ringer vekkerklokka" },
    { type: "wordorder", task: "Постав слова (починається з 'Så')", scrambled: ["Så", "jeg", "går", "på badet"], answer: "Så går jeg på badet" },
  ],
  extra: {
    type: "pronunciation",
    title: "Як це читається",
    intro: "Кілька слів з тексту з нетиповою вимовою:",
    items: [
      { word: "vekkerklokke", read: "ве́кер-клоке", note: "kk тверде" },
      { word: "ansiktet", read: "а́нсікте", note: "кінцеве t тихе в означеній формі" },
      { word: "havregrøt", read: "га́вре-ґрот", note: "ø округлене" },
      { word: "sju / syv", read: "шю / сюв", note: "«сім» — обидві форми правильні" },
    ],
  },
}

// 2.3 — Etter jobb
export const grammar_2_3 = {
  topic: "Дієслово «å trenge» і неозначені слова",
  blocks: [
    {
      heading: "trenger = «потребую / мені потрібно»",
      text: "Дієслово å trenge (потребувати) у presens — trenger. Воно виражає потребу: jeg trenger litt hvile («мені потрібен трохи відпочинку»). Після нього йде іменник або «å + інфінітив»: jeg trenger å hvile.",
    },
    {
      heading: "litt / noe / noen ganger",
      text: "litt = трохи (з незлічуваним: litt hvile, litt te). noen ganger = іноді. Ці слова уточнюють кількість або частоту. Коли noen ganger стоїть на початку речення — діє V2: Noen ganger ringer jeg mamma.",
    },
  ],
  examples: [
    { no: "Hjemme trenger jeg litt hvile.", ua: "Вдома мені потрібен трохи відпочинку.", hi: "trenger" },
    { no: "Noen ganger ringer jeg mamma.", ua: "Іноді я телефоную мамі.", hi: "ringer jeg" },
    { no: "Jeg spiser alene.", ua: "Я їм на самоті.", hi: "alene" },
  ],
  exercises: [
    { type: "conjugate", task: "Постав дієслово у presens", sentence: "Jeg ___ litt hvile. (å trenge)", answer: "trenger" },
    { type: "conjugate", task: "Постав дієслово у presens", sentence: "Jeg ___ opp etter middag. (å vaske)", answer: "vasker" },
    { type: "wordorder", task: "Постав слова (починається з 'Noen ganger')", scrambled: ["Noen ganger", "jeg", "ringer", "mamma"], answer: "Noen ganger ringer jeg mamma" },
    { type: "wordorder", task: "Постав слова у правильному порядку", scrambled: ["er", "Jeg", "trøtt", "etter jobben"], answer: "Jeg er trøtt etter jobben" },
  ],
  extra: {
    type: "lexicon",
    title: "Лексика: вечір вдома",
    intro: "Фразові дієслова й вирази, що описують вечірні справи:",
    items: [
      { word: "å vaske opp", note: "мити посуд (не плутати з å vaske — прати/мити взагалі)" },
      { word: "å slukke lyset", note: "вимикати світло" },
      { word: "å sette seg", note: "сідати (зворотне)" },
      { word: "en halvtime", note: "пів години" },
    ],
  },
}

// 2.4 — En travel dag
export const grammar_2_4 = {
  topic: "Модальне дієслово «å måtte» (мусити)",
  blocks: [
    {
      heading: "må + інфінітив БЕЗ частки å",
      text: "Модальне дієслово å måtte (мусити) у presens має форму må. Після модального дієслова інфінітив іде БЕЗ частки å: jeg må møte opp (не «må å møte»). Це відрізняє модальні дієслова від звичайних на кшталт «å like å …».",
    },
    {
      heading: "Заперечення з «ikke»",
      text: "Заперечна частка ikke ставиться після дієслова: jeg rekker ikke («я не встигаю»). У реченні з модальним дієсловом ikke йде після må: jeg må ikke. Порядок: підмет + дієслово + ikke.",
    },
  ],
  examples: [
    { no: "Klokka åtte må jeg møte opp.", ua: "О восьмій я мушу прийти.", hi: "må jeg møte" },
    { no: "Jeg rekker ikke spise frokost.", ua: "Я не встигаю поснідати.", hi: "ikke" },
    { no: "Etter jobben må jeg handle mat.", ua: "Після роботи я мушу купити їжу.", hi: "må jeg handle" },
  ],
  exercises: [
    { type: "conjugate", task: "Постав модальне дієслово", sentence: "Jeg ___ møte opp klokka åtte. (å måtte)", answer: "må" },
    { type: "conjugate", task: "Постав дієслово у presens", sentence: "Møtet ___ i to timer. (å vare)", answer: "varer" },
    { type: "wordorder", task: "Постав слова (починається з 'Klokka åtte')", scrambled: ["Klokka åtte", "jeg", "må", "møte opp"], answer: "Klokka åtte må jeg møte opp" },
    { type: "wordorder", task: "Постав слова із запереченням", scrambled: ["rekker", "Jeg", "ikke", "spise frokost"], answer: "Jeg rekker ikke spise frokost" },
  ],
  extra: {
    type: "lexicon",
    title: "Лексика: зайнятий день",
    intro: "Слова, що передають поспіх і навантаження:",
    items: [
      { word: "travel", note: "зайнятий, насичений" },
      { word: "å rekke", note: "встигати" },
      { word: "å møte opp", note: "з'явитися, прийти (фразове)" },
      { word: "endelig", note: "нарешті" },
    ],
  },
}

// 2.5 — Helg hjemme
export const grammar_2_5 = {
  topic: "Конструкція «å ha lyst til» і протиставлення «men»",
  blocks: [
    {
      heading: "har lyst til å + інфінітив = «хочеться»",
      text: "Щоб сказати «мені хочеться щось зробити», вживають конструкцію «ha lyst til å + інфінітив»: jeg har lyst til å slappe av («мені хочеться відпочити»). Тут частка å обов'язкова, бо ha — не модальне дієслово.",
    },
    {
      heading: "men — протиставлення (але)",
      text: "Сполучник men («але») з'єднує дві частини з протилежним змістом і НЕ викликає інверсії — після нього звичайний порядок підмет + дієслово: Det er kjedelig, men det er nødvendig.",
    },
  ],
  examples: [
    { no: "Jeg har lyst til å slappe av.", ua: "Мені хочеться відпочити.", hi: "har lyst til å" },
    { no: "Det er kjedelig, men nødvendig.", ua: "Це нудно, але необхідно.", hi: "men" },
    { no: "I helgen sover jeg lenger.", ua: "У вихідні я сплю довше.", hi: "sover jeg" },
  ],
  exercises: [
    { type: "conjugate", task: "Встав частку", sentence: "Jeg har lyst til ___ slappe av.", answer: "å" },
    { type: "conjugate", task: "Постав дієслово у presens", sentence: "Vi ___ å møtes i parken. (å avtale)", answer: "avtaler" },
    { type: "wordorder", task: "Постав слова (починається з 'I helgen')", scrambled: ["I helgen", "jeg", "sover", "lenger"], answer: "I helgen sover jeg lenger" },
    { type: "wordorder", task: "З'єднай через 'men'", scrambled: ["Det er kjedelig", "men", "nødvendig"], answer: "Det er kjedelig men nødvendig" },
  ],
  extra: {
    type: "lexicon",
    title: "Лексика: вихідні й дозвілля",
    intro: "Дієслова, що описують відпочинок і домашні справи:",
    items: [
      { word: "å slappe av", note: "відпочивати, розслаблятися" },
      { word: "å rydde", note: "прибирати" },
      { word: "å avtale", note: "домовлятися" },
      { word: "å bestille", note: "замовляти" },
    ],
  },
}

// ════════════════════════════════════════════════════════
// ТЕМА 3 — Mat og butikk
// ════════════════════════════════════════════════════════

// 3.1 — På butikken
export const grammar_3_1 = {
  topic: "Дієслово «å koste», числа і ціни",
  blocks: [
    {
      heading: "koster = «коштує»",
      text: "Дієслово å koste (коштувати) у presens — koster. Конструкція ціни: іменник + koster + число + kroner. Melk koster tjuefem kroner. Питання про ціну: Hva koster det? («Скільки це коштує?»).",
    },
    {
      heading: "Det blir … — підсумкова сума",
      text: "Коли касир називає загальну суму, вживається безособове «Det blir …»: Det blir tre hundre kroner («Виходить триста крон»). Дослівно «це стає», але відповідає українському «з вас …» або «разом …».",
    },
  ],
  examples: [
    { no: "Melk koster tjuefem kroner.", ua: "Молоко коштує двадцять п'ять крон.", hi: "koster" },
    { no: "Det blir tre hundre og femti kroner.", ua: "Виходить триста п'ятдесят крон.", hi: "Det blir" },
    { no: "Jeg trenger melk, brød og egg.", ua: "Мені потрібні молоко, хліб і яйця.", hi: "trenger" },
  ],
  exercises: [
    { type: "conjugate", task: "Постав дієслово у presens", sentence: "Melk ___ tjuefem kroner. (å koste)", answer: "koster" },
    { type: "conjugate", task: "Постав дієслово у presens", sentence: "Butikken ___ fra åtte til tjueto. (å være — форма 'er')", answer: "er" },
    { type: "wordorder", task: "Склади запитання про ціну", scrambled: ["koster", "Hva", "det"], answer: "Hva koster det" },
    { type: "wordorder", task: "Постав слова у правильному порядку", scrambled: ["koster", "Brød", "tretti", "kroner"], answer: "Brød koster tretti kroner" },
  ],
  extra: {
    type: "lexicon",
    title: "Лексика: магазин",
    intro: "Слова, без яких не обійтися в норвезькому супермаркеті:",
    items: [
      { word: "en handlevogn", note: "візок для покупок" },
      { word: "en kasse", note: "каса" },
      { word: "en kø", note: "черга" },
      { word: "en vare", note: "товар" },
    ],
  },
}

// 3.2 — Jeg lager middag
export const grammar_3_2 = {
  topic: "Дієслова приготування і послідовність кроків",
  blocks: [
    {
      heading: "Дієслова кухні в presens",
      text: "Рецепт описується через дії в presens: blander (змішую), former (формую), steker (смажу), koker (варю). Усі на -r. Зверни увагу: å steke — смажити на сковорідці, å koke — варити у воді. Це різні дієслова, які в українській обидва часто звуть «готувати».",
    },
    {
      heading: "Маркери послідовності в рецепті",
      text: "Кроки рецепта поєднуються словами: Først (спочатку), Så (потім), Samtidig (одночасно), Til slutt (нарешті). На початку речення вони викликають інверсію: Til slutt lager jeg sausen.",
    },
  ],
  examples: [
    { no: "Jeg blander alt sammen i en bolle.", ua: "Я змішую все разом у мисці.", hi: "blander" },
    { no: "Jeg steker kakene i en stekepanne.", ua: "Я смажу котлети на сковорідці.", hi: "steker" },
    { no: "Samtidig koker jeg poteter.", ua: "Одночасно я варю картоплю.", hi: "koker jeg" },
  ],
  exercises: [
    { type: "conjugate", task: "Постав дієслово у presens", sentence: "Jeg ___ kjøttdeig og egg. (å blande)", answer: "blander" },
    { type: "conjugate", task: "Постав правильне дієслово (варити у воді)", sentence: "Jeg ___ poteter i en kasserolle. (å koke)", answer: "koker" },
    { type: "wordorder", task: "Постав слова (починається з 'Først')", scrambled: ["Først", "jeg", "vasker", "hendene"], answer: "Først vasker jeg hendene" },
    { type: "wordorder", task: "Постав слова (починається з 'Samtidig')", scrambled: ["Samtidig", "jeg", "koker", "poteter"], answer: "Samtidig koker jeg poteter" },
  ],
  extra: {
    type: "lexicon",
    title: "Лексика: смажити чи варити?",
    intro: "Норвезька чітко розрізняє способи приготування — запам'ятай пару:",
    items: [
      { word: "å steke", note: "смажити (на сковорідці, в олії/маслі)" },
      { word: "å koke", note: "варити (у киплячій воді)" },
      { word: "å blande", note: "змішувати" },
      { word: "en stekepanne", note: "сковорідка" },
    ],
  },
}

// 3.3 — Frokost hjemme
export const grammar_3_3 = {
  topic: "Дієслово «å foretrekke» і прислівники частоти",
  blocks: [
    {
      heading: "foretrekker … fremfor … (надаю перевагу … над …)",
      text: "Дієслово å foretrekke (надавати перевагу) у presens — foretrekker. Конструкція порівняння: foretrekker X fremfor Y («віддаю перевагу X над Y»). Jeg foretrekker te fremfor kaffe.",
    },
    {
      heading: "Прислівники частоти: alltid, vanligvis, av og til",
      text: "alltid (завжди), vanligvis (зазвичай), av og til (час від часу) показують, як часто відбувається дія. У звичайному реченні вони стоять після дієслова: Jeg spiser alltid frokost. На початку речення викликають інверсію: Av og til lager jeg havregrøt.",
    },
  ],
  examples: [
    { no: "Jeg foretrekker te fremfor kaffe.", ua: "Я віддаю перевагу чаю над кавою.", hi: "foretrekker" },
    { no: "Jeg spiser alltid frokost hjemme.", ua: "Я завжди снідаю вдома.", hi: "alltid" },
    { no: "Av og til lager jeg havregrøt.", ua: "Час від часу я готую вівсянку.", hi: "lager jeg" },
  ],
  exercises: [
    { type: "conjugate", task: "Постав дієслово у presens", sentence: "Jeg ___ te fremfor kaffe. (å foretrekke)", answer: "foretrekker" },
    { type: "conjugate", task: "Встав прислівник частоти", sentence: "Jeg spiser ___ frokost hjemme. (завжди)", answer: "alltid" },
    { type: "wordorder", task: "Постав слова (починається з 'Av og til')", scrambled: ["Av og til", "jeg", "lager", "havregrøt"], answer: "Av og til lager jeg havregrøt" },
    { type: "wordorder", task: "Постав слова у правильному порядку", scrambled: ["spiser", "Jeg", "alltid", "frokost"], answer: "Jeg spiser alltid frokost" },
  ],
  extra: {
    type: "lexicon",
    title: "Лексика: сніданок",
    intro: "Типові складники норвезького сніданку:",
    items: [
      { word: "grovbrød", note: "хліб грубого помелу (дуже популярний)" },
      { word: "syltetøy", note: "варення, джем" },
      { word: "havregrøt", note: "вівсяна каша" },
      { word: "skinke", note: "шинка" },
    ],
  },
}

// 3.4 — På kafé
export const grammar_3_4 = {
  topic: "Ввічливе замовлення: «jeg vil gjerne ha»",
  blocks: [
    {
      heading: "vil gjerne ha = «я б хотів(-ла)»",
      text: "Ввічлива форма замовлення: jeg vil gjerne ha + іменник («я б охоче взяв(-ла) …»). vil — модальне дієслово (хотіти), тому ha йде без частки å. Слово gjerne («охоче») робить прохання ввічливим. Альтернатива: jeg tar … («я візьму …»).",
    },
    {
      heading: "Прохання й відповіді у діалозі",
      text: "У сфері обслуговування корисні сталі вирази: Hva kan jeg hjelpe deg med? (Чим можу допомогти?), Det kommer straks (Зараз буде), Selvfølgelig (Звісно). Вони вживаються як готові блоки.",
    },
  ],
  examples: [
    { no: "Jeg vil gjerne ha en cappuccino.", ua: "Я б хотів капучино.", hi: "vil gjerne ha" },
    { no: "Jeg tar en latte og en croissant.", ua: "Я візьму лате й круасан.", hi: "tar" },
    { no: "Det kommer straks.", ua: "Зараз буде.", hi: "straks" },
  ],
  exercises: [
    { type: "conjugate", task: "Встав ввічливе слово", sentence: "Jeg vil ___ ha en kaffe. (охоче)", answer: "gjerne" },
    { type: "conjugate", task: "Постав дієслово у presens", sentence: "Det ___ straks. (å komme)", answer: "kommer" },
    { type: "wordorder", task: "Склади ввічливе замовлення", scrambled: ["vil", "Jeg", "gjerne", "ha", "en latte"], answer: "Jeg vil gjerne ha en latte" },
    { type: "wordorder", task: "Постав слова у правильному порядку", scrambled: ["tar", "Jeg", "en croissant"], answer: "Jeg tar en croissant" },
  ],
  extra: {
    type: "lexicon",
    title: "Лексика: у кафе",
    intro: "Слова й вирази для замовлення та оплати:",
    items: [
      { word: "en servitør", note: "офіціант" },
      { word: "et stykke kake", note: "шматок торта" },
      { word: "å splitte", note: "ділити рахунок навпіл" },
      { word: "til sammen", note: "разом, загалом" },
    ],
  },
}

// 3.5 — Handleliste
export const grammar_3_5 = {
  topic: "Одиниці кількості й конструкція «å trenge»",
  blocks: [
    {
      heading: "Одиниці виміру: en liter, et kilo, en pose, en boks",
      text: "Кількість продуктів вимірюється одиницями: to liter melk (два літри молока), et kilo kjøttdeig (кілограм фаршу), en pose pasta (пачка макаронів), en boks tomater (банка помідорів). Після одиниці іменник іде в неозначеній формі без прийменника: et kilo ost.",
    },
    {
      heading: "trenger (ikke) å + інфінітив",
      text: "trenger виражає потребу, а trenger ikke — її відсутність: Jeg trenger ikke kjøpe egg («мені не треба купувати яйця»). Заперечення ikke йде одразу після дієслова.",
    },
  ],
  examples: [
    { no: "Jeg trenger to liter melk.", ua: "Мені потрібно два літри молока.", hi: "trenger" },
    { no: "Jeg trenger ikke kjøpe egg.", ua: "Мені не треба купувати яйця.", hi: "trenger ikke" },
    { no: "Jeg har allerede egg og løk.", ua: "У мене вже є яйця й цибуля.", hi: "allerede" },
  ],
  exercises: [
    { type: "conjugate", task: "Постав дієслово у presens", sentence: "Jeg ___ to liter melk. (å trenge)", answer: "trenger" },
    { type: "conjugate", task: "Встав слово", sentence: "Jeg har ___ egg hjemme. (вже)", answer: "allerede" },
    { type: "wordorder", task: "Постав слова із запереченням", scrambled: ["trenger", "Jeg", "ikke", "kjøpe egg"], answer: "Jeg trenger ikke kjøpe egg" },
    { type: "wordorder", task: "Постав слова у правильному порядку", scrambled: ["går", "Jeg", "til fots", "dit"], answer: "Jeg går dit til fots" },
  ],
  extra: {
    type: "lexicon",
    title: "Лексика: міри й кількість",
    intro: "Одиниці, якими рахують продукти в магазині:",
    items: [
      { word: "en liter", note: "літр (рідини)" },
      { word: "et kilo", note: "кілограм" },
      { word: "en pose", note: "пакет, мішок" },
      { word: "en boks", note: "банка, бляшанка" },
    ],
  },
}