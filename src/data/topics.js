// Поки тільки А1-А2
// Поки теми 1–3, по 5 підтем кожна (15 текстів). Усього має бути 15 тем (75 текстів)
// Формат сумісний з topics.js

export const topics = [
  // ══════════════════════════════════════════════════════
  // ТЕМА 1 — Introduksjon (Знайомство)
  // ══════════════════════════════════════════════════════
  {
    id: 1,
    slug: "introduksjon",
    title: "Introduksjon",
    titleUa: "Знайомство",
    level: "A1",
    status: "active",
    subtopics: [

      // 1.1
      {
        id: "1.1",
        title: "Hei! Jeg heter…",
        titleUa: "Привіт! Мене звати…",
        grammarFocus: ["present tense", "verb 'å hete'", "verb 'å være'", "question words: hva, hvor, hvem"],
        text: `Hei! Jeg heter Daria. Jeg er fra Ukraina. Jeg bor i Bergen nå. Jeg er tjuetre år gammel.

Jeg snakker ukrainsk og litt norsk. Norsk er vanskelig, men det er gøy å lære. Jeg går på norskkurs tre ganger i uken.

– Hei! Hva heter du?
– Jeg heter Marta. Og du?
– Jeg heter Daria. Hvor kommer du fra?
– Jeg kommer fra Polen. Og du?
– Jeg kommer fra Ukraina. Hyggelig å møte deg!
– I like måte!

Marta og Daria er nye venner. De snakker norsk sammen. Det er bra!`,
        vocabulary: [
          { word: "å hete" },
          { word: "å være"},
          { word: "å lære"},
          { word: "vanskelig"},
          { word: "i like måte"},
        ],
        questions: [
          { q: "Hva heter den nye studenten?", a: "Hun heter Daria." },
          { q: "Hvor kommer Daria fra?", a: "Hun kommer fra Ukraina." },
          { q: "Hvor bor Daria nå?", a: "Hun bor i Bergen." },
          { q: "Hvor mange ganger i uken går Daria på norskkurs?", a: "Hun går tre ganger i uken." },
          { q: "Hva heter den andre jenta?", a: "Hun heter Marta." },
        ],
        fillGaps: [
          { sentence: "Jeg ___ Olena. (å hete)", answer: "heter" },
          { sentence: "Hun ___ fra Polen. (å komme)", answer: "kommer" },
          { sentence: "Vi ___ norsk på kurset. (å snakke)", answer: "snakker" },
          { sentence: "Han ___ i Oslo nå. (å bo)", answer: "bor" },
        ],
        translate: [
          { ua: "Мене звати Іван.", no: "Jeg heter Ivan." },
          { ua: "Я з України.", no: "Jeg kommer fra Ukraina." },
          { ua: "Приємно познайомитись!", no: "Hyggelig å møte deg!" },
        ],
      },

      // 1.2
      {
        id: "1.2",
        title: "Familien min",
        titleUa: "Моя сім'я",
        grammarFocus: ["possessive pronouns: min/mi/mitt/mine", "family vocabulary", "present tense"],
        text: `Jeg heter Taras. Jeg er fra Kharkiv i Ukraina. Jeg har en liten familie.

          Moren min heter Olena. Hun er lærer. Faren min heter Mykola. Han er ingeniør. Jeg har én søster. Hun heter Oksana. Hun er nitten år gammel.
          Familien min bor i Ukraina. Jeg bor i Norge nå. Jeg savner dem veldig. Vi snakker på telefonen hver dag.
          Har du søsken? Jeg har én søster, men ingen bror. Søsteren min er snill og morsom. Vi er gode venner.`,
        vocabulary: [
          { word: "en mor" },
          { word: "en far" },
          { word: "en søster" },
          { word: "en bror" },
          { word: "søsken" },
          { word: "å savne" },
          { word: "snill" },
          { word: "morsom" },
          { word: "ingen" },
        ],
        questions: [
          { q: "Hva heter moren til Taras?", a: "Hun heter Olena." },
          { q: "Hva jobber faren til Taras som?", a: "Han er ingeniør." },
          { q: "Har Taras en bror?", a: "Nei, han har ingen bror." },
          { q: "Hvor bor familien til Taras?", a: "De bor i Ukraina." },
          { q: "Hvordan holder Taras kontakt med familien?", a: "De snakker på telefonen hver dag." },
        ],
        fillGaps: [
          { sentence: "Moren ___ heter Lena. (min/mi/mitt)", answer: "min" },
          { sentence: "Jeg ___ familien min veldig. (å savne)", answer: "savner" },
          { sentence: "Søsteren min ___ snill. (å være)", answer: "er" },
          { sentence: "Vi ___ på telefonen hver dag. (å snakke)", answer: "snakker" },
        ],
        translate: [
          { ua: "Моя мама — вчителька.", no: "Moren min er lærer." },
          { ua: "У мене є одна сестра.", no: "Jeg har én søster." },
          { ua: "Я дуже сумую за ними.", no: "Jeg savner dem veldig." },
        ],
      },

      // 1.3
      {
        id: "1.3",
        title: "Mine hobbyer",
        titleUa: "Мої хобі",
        grammarFocus: ["verb 'å like + infinitive'", "hobbies vocabulary", "adverbs of frequency"],
        text: `Jeg heter Sofia. Jeg er tjue år gammel. Jeg har mange hobbyer.

Jeg liker å lese bøker. Jeg leser hver kveld. Favorittboken min er en roman fra Ukraina.

Jeg liker også å spille gitar. Jeg spiller gitar to ganger i uken. Det er gøy!

Om sommeren liker jeg å sykle. Bergen er fin by for sykling. Om vinteren liker jeg å gå på tur i fjellet.

Hva liker du å gjøre? Liker du musikk? Liker du sport? Det er viktig å ha hobbyer. Hobbyer gjør livet morsomt.`,
        vocabulary: [
          { word: "å like" },
          { word: "å lese" },
          { word: "å spille" },
          { word: "å sykle" },
          { word: "å gå på tur" },
          { word: "om sommeren" },
          { word: "viktig" },
          { word: "morsomt" },
        ],
        questions: [
          { q: "Hva liker Sofia å gjøre om kvelden?", a: "Hun liker å lese bøker." },
          { q: "Hvor mange ganger i uken spiller Sofia gitar?", a: "To ganger i uken." },
          { q: "Hva liker Sofia å gjøre om sommeren?", a: "Hun liker å sykle." },
          { q: "Hva liker Sofia å gjøre om vinteren?", a: "Hun liker å gå på tur i fjellet." },
        ],
        fillGaps: [
          { sentence: "Jeg liker å ___ bøker. (å lese)", answer: "lese" },
          { sentence: "Hun ___ gitar to ganger i uken. (å spille)", answer: "spiller" },
          { sentence: "Om sommeren ___ vi i fjellet. (å gå på tur)", answer: "går på tur" },
          { sentence: "Det er ___ å ha hobbyer. (viktig)", answer: "viktig" },
        ],
        translate: [
          { ua: "Мені подобається читати книги.", no: "Jeg liker å lese bøker." },
          { ua: "Що тобі подобається робити?", no: "Hva liker du å gjøre?" },
          { ua: "Взимку я катаюся на лижах.", no: "Om vinteren liker jeg å gå på ski." },
        ],
      },

      // 1.4
      {
        id: "1.4",
        title: "En ny venn",
        titleUa: "Новий друг",
        grammarFocus: ["dialogue structure", "questions with 'hva/hvor/hvordan/hvem'", "adjectives"],
        text: `Det er første dag på norskkurs. Det er mange nye studenter.

– Hei! Jeg heter Andrii. Hva heter du?
– Jeg heter Fatima. Hyggelig!
– Hyggelig! Hvor kommer du fra, Fatima?
– Jeg kommer fra Somalia. Og du?
– Jeg kommer fra Ukraina. Hvor lenge har du bodd i Norge?
– I seks måneder. Og du?
– Jeg har bodd her i tre måneder. Norsk er vanskelig!
– Ja, men læreren er flink og snill.
– Ja, det er bra! Vil du drikke kaffe etter kurset?
– Ja, gjerne! Det er hyggelig.

Andrii og Fatima er nye venner. De drikker kaffe og snakker mye.`,
        vocabulary: [
          { word: "første" },
          { word: "et kurs" },
          { word: "en student" },
          { word: "en måned" },
          { word: "flink" },
          { word: "å ville" },
          { word: "gjerne" },
          { word: "hvor lenge" },
        ],
        questions: [
          { q: "Hvor er Andrii og Fatima?", a: "De er på norskkurs." },
          { q: "Hvor kommer Fatima fra?", a: "Hun kommer fra Somalia." },
          { q: "Hvor lenge har Andrii bodd i Norge?", a: "Han har bodd der i tre måneder." },
          { q: "Hva gjør de etter kurset?", a: "De drikker kaffe og snakker." },
        ],
        fillGaps: [
          { sentence: "Det er ___ dag på kurset. (første)", answer: "første" },
          { sentence: "Vil du ___ kaffe? (å drikke)", answer: "drikke" },
          { sentence: "Jeg ___ bodd her i seks måneder. (har)", answer: "har" },
          { sentence: "Læreren er flink og ___. (snill)", answer: "snill" },
        ],
        translate: [
          { ua: "Звідки ти?", no: "Hvor kommer du fra?" },
          { ua: "Як давно ти живеш у Норвегії?", no: "Hvor lenge har du bodd i Norge?" },
          { ua: "Хочеш випити кави?", no: "Vil du drikke kaffe?" },
        ],
      },

      // 1.5
      {
        id: "1.5",
        title: "På norskkurs",
        titleUa: "На курсі норвезької",
        grammarFocus: ["school/course vocabulary", "present tense", "numbers and time"],
        text: `Jeg går på norskkurs i Bergen. Kurset starter klokka ni om morgenen. Det slutter klokka tolv.

I klassen er det femten studenter. Vi kommer fra mange forskjellige land: Ukraina, Polen, Somalia, Syria og Eritrea.

Læreren heter Ingrid. Hun er fra Bergen. Hun snakker sakte og tydelig. Det er bra for oss!

Vi lærer norske ord, grammatikk og uttale. Vi leser, skriver og snakker norsk. Det er mye å lære, men det er gøy.

Etter kurset drikker vi kaffe og prater. Vi hjelper hverandre med leksene. Norskkurset er viktig for oss.`,
        vocabulary: [
          { word: "å starte" },
          { word: "å slutte" },
          { word: "forskjellig" },
          { word: "sakte" },
          { word: "tydelig" },
          { word: "en uttale" },
        ],
        questions: [
          { q: "Når starter norskkurset?", a: "Det starter klokka ni." },
          { q: "Hvor mange studenter er det i klassen?", a: "Det er femten studenter." },
          { q: "Hva heter læreren?", a: "Hun heter Ingrid." },
          { q: "Hva gjør studentene etter kurset?", a: "De drikker kaffe og hjelper hverandre med leksene." },
        ],
        fillGaps: [
          { sentence: "Kurset ___ klokka ni. (å starte)", answer: "starter" },
          { sentence: "Vi ___ fra mange forskjellige land. (å komme)", answer: "kommer" },
          { sentence: "Hun snakker sakte og ___. (tydelig)", answer: "tydelig" },
          { sentence: "Vi ___ hverandre med leksene. (å hjelpe)", answer: "hjelper" },
        ],
        translate: [
          { ua: "Курс починається о дев'ятій годині.", no: "Kurset starter klokka ni." },
          { ua: "Ми вчимо норвезькі слова і граматику.", no: "Vi lærer norske ord og grammatikk." },
          { ua: "Ми допомагаємо одне одному.", no: "Vi hjelper hverandre." },
        ],
      },

    ],
  },

  // ══════════════════════════════════════════════════════
  // ТЕМА 2 — Hverdagen (Щоденне життя)
  // ══════════════════════════════════════════════════════
  {
    id: 2,
    slug: "hverdagen",
    title: "Hverdagen",
    titleUa: "Щоденне життя",
    level: "A1",
    status: "active",
    subtopics: [

      // 2.1
      {
        id: "2.1",
        title: "En vanlig dag",
        titleUa: "Звичайний день",
        grammarFocus: ["daily routine vocabulary", "time expressions", "present tense sequence"],
        text: `Jeg heter Lena. Dette er en vanlig dag for meg.

Jeg står opp klokka sju. Jeg dusjer og kler på meg. Jeg spiser frokost: brød med ost og en kopp kaffe.

Klokka åtte tar jeg bussen til norskkurset. Turen tar tjue minutter. På kurset lærer jeg norsk fra ni til tolv.

Etter kurset spiser jeg lunsj hjemme. Jeg lager enkel mat: suppe eller en sandwich. Om ettermiddagen leser jeg lekser.

Om kvelden ser jeg på TV eller leser en bok. Klokka elleve legger jeg meg. God natt!`,
        vocabulary: [
          { word: "å stå opp" },
          { word: "å dusje" },
          { word: "å kle på seg" },
          { word: "å spise" },
          { word: "frokost" },
          { word: "lunsj" },
          { word: "å ta bussen" },
          { word: "å lage mat" },
          { word: "å legge seg" },
          { word: "om kvelden" },
          { word: "om ettermiddagen" },
          { word: "vanlig" },
        ],
        questions: [
          { q: "Når står Lena opp?", a: "Hun står opp klokka sju." },
          { q: "Hva spiser hun til frokost?", a: "Hun spiser brød med ost og drikker kaffe." },
          { q: "Hvordan kommer hun til kurset?", a: "Hun tar bussen." },
          { q: "Hva gjør hun om kvelden?", a: "Hun ser på TV eller leser en bok." },
          { q: "Når legger hun seg?", a: "Hun legger seg klokka elleve." },
        ],
        fillGaps: [
          { sentence: "Jeg ___ opp klokka sju. (å stå)", answer: "står" },
          { sentence: "Hun ___ bussen til kurset. (å ta)", answer: "tar" },
          { sentence: "Jeg ___ mat til lunsj. (å lage)", answer: "lager" },
          { sentence: "Klokka elleve ___ jeg meg. (å legge)", answer: "legger" },
        ],
        translate: [
          { ua: "Я встаю о сьомій годині.", no: "Jeg står opp klokka sju." },
          { ua: "Я їду автобусом до роботи.", no: "Jeg tar bussen til jobb." },
          { ua: "Ввечері я читаю книгу.", no: "Om kvelden leser jeg en bok." },
        ],
      },

      // 2.2
      {
        id: "2.2",
        title: "Morgenrutine",
        titleUa: "Ранкова рутина",
        grammarFocus: ["reflexive verbs", "time: klokka + number", "sequence words: først, så, etter det"],
        text: `Morgenrutinen min er alltid den samme.

Først ringer vekkerklokka klokka seks og halvt. Jeg gidder ikke stå opp med en gang. Jeg ligger i sengen fem minutter til.

Så går jeg på badet. Jeg pusser tennene og vasker ansiktet med kaldt vann. Det hjelper!

Etter det dusjer jeg. Jeg kler på meg raske. Jeg tar på meg jeans og en genser.

Til frokost spiser jeg havregrøt med bær. Det er sunt og godt. Jeg drikker en stor kopp kaffe. Uten kaffe klarer jeg meg ikke!

Klokka syv er jeg klar. Jeg tar sekken og går ut.`,
        vocabulary: [
          { word: "en rutine" },
          { word: "en vekkerklokke" },
          { word: "å ringe" },
          { word: "å gidde" },
          { word: "å pusse tennene" },
          { word: "å vaske ansiktet" },
          { word: "havregrøt" },
          { word: "bær" },
          { word: "sunt" },
          { word: "først" },
          { word: "så" },
          { word: "etter det" },
        ],
        questions: [
          { q: "Når ringer vekkerklokka?", a: "Den ringer klokka seks og halvt." },
          { q: "Hva gjør han/hun etter at han/hun våkner?", a: "Han/hun går på badet og pusser tennene." },
          { q: "Hva spiser han/hun til frokost?", a: "Han/hun spiser havregrøt med bær." },
          { q: "Når er han/hun klar til å gå?", a: "Klokka syv." },
        ],
        fillGaps: [
          { sentence: "___ ringer vekkerklokka. (Først)", answer: "Først" },
          { sentence: "Jeg ___ tennene på badet. (å pusse)", answer: "pusser" },
          { sentence: "___ dusjer jeg. (Etter det)", answer: "Etter det" },
          { sentence: "Havregrøt er ___ og godt. (sunt)", answer: "sunt" },
        ],
        translate: [
          { ua: "Спочатку я вмиваюся.", no: "Først vasker jeg ansiktet." },
          { ua: "Потім я приймаю душ.", no: "Så dusjer jeg." },
          { ua: "О сьомій я готовий/готова йти.", no: "Klokka syv er jeg klar." },
        ],
      },

      // 2.3
      {
        id: "2.3",
        title: "Etter jobb",
        titleUa: "Після роботи",
        grammarFocus: ["evening activities", "verb 'å trenge'", "'litt', 'noe', 'ingen'"],
        text: `Jobben slutter klokka fire. Jeg er trøtt etter en lang dag.

Jeg tar bussen hjem. Turen tar femten minutter. På bussen hører jeg på musikk.

Hjemme trenger jeg litt hvile. Jeg setter meg i sofaen og drikker te. Det er deilig!

Etter en halvtime lager jeg middag. I dag lager jeg pasta med tomatssaus. Det er enkelt og godt. Jeg spiser alene, men noen ganger ringer jeg mamma på video.

Etter middag vasker jeg opp. Så ser jeg litt på TV eller scroller på telefonen. Klokka ti slukker jeg lyset og legger meg. I morgen er det en ny dag!`,
        vocabulary: [
          { word: "trøtt" },
          { word: "å trenge" },
          { word: "hvile" },
          { word: "deilig" },
          { word: "en halvtime" },
          { word: "middag" },
          { word: "å vaske opp" },
          { word: "å slukke lyset" },
          { word: "alene" },
          { word: "noen ganger" },
          { word: "enkel" },
          { word: "en ny dag" },
        ],
        questions: [
          { q: "Når slutter jobben?", a: "Den slutter klokka fire." },
          { q: "Hva gjør han/hun på bussen hjem?", a: "Han/hun hører på musikk." },
          { q: "Hva lager han/hun til middag?", a: "Han/hun lager pasta med tomatsaus." },
          { q: "Når legger han/hun seg?", a: "Klokka ti." },
        ],
        fillGaps: [
          { sentence: "Jeg er ___ etter jobben. (trøtt)", answer: "trøtt" },
          { sentence: "Jeg ___ litt hvile. (å trenge)", answer: "trenger" },
          { sentence: "I dag ___ jeg pasta. (å lage)", answer: "lager" },
          { sentence: "Jeg ___ opp etter middag. (å vaske)", answer: "vasker" },
        ],
        translate: [
          { ua: "Я втомлений/втомлена після довгого дня.", no: "Jeg er trøtt etter en lang dag." },
          { ua: "Мені потрібен трохи відпочинку.", no: "Jeg trenger litt hvile." },
          { ua: "Іноді я телефоную мамі.", no: "Noen ganger ringer jeg mamma." },
        ],
      },

      // 2.4
      {
        id: "2.4",
        title: "En travel dag",
        titleUa: "Насичений день",
        grammarFocus: ["modal verb 'å måtte'", "time pressure expressions", "negative form"],
        text: `I dag er det en veldig travel dag for meg.

Klokka åtte må jeg møte opp på kontoret. Klokka ti har jeg et møte. Klokka tolv er det lunsj med en kollega.

Jeg rekker ikke spise frokost hjemme. Jeg kjøper en bolle på bakeriet ved bussen. Det er ikke ideelt, men det går bra.

Møtet varer i to timer. Det er langt, men viktig. Vi snakker om nye planer.

Etter jobben må jeg handle mat. Kjøleskapet er nesten tomt. Jeg kjøper melk, brød, egg og grønnsaker.

Hjemme lager jeg en rask middag. Klokka ni er jeg endelig ferdig. Jeg er veldig trøtt. God natt!`,
        vocabulary: [
          { word: "travel" },
          { word: "å måtte" },
          { word: "å møte opp" },
          { word: "et møte" },
          { word: "å rekke" },
          { word: "et bakeri" },
          { word: "å vare" },
          { word: "å handle" },
          { word: "nesten" },
          { word: "tom" },
          { word: "endelig" },
          { word: "ferdig" },
        ],
        questions: [
          { q: "Når må han/hun møte opp på kontoret?", a: "Klokka åtte." },
          { q: "Hvorfor kjøper han/hun en bolle på bakeriet?", a: "Han/hun rekker ikke spise frokost hjemme." },
          { q: "Hvor lenge varer møtet?", a: "Det varer i to timer." },
          { q: "Hva kjøper han/hun i butikken?", a: "Melk, brød, egg og grønnsaker." },
        ],
        fillGaps: [
          { sentence: "Jeg ___ møte opp klokka åtte. (å måtte)", answer: "må" },
          { sentence: "Jeg ___ ikke spise frokost hjemme. (å rekke)", answer: "rekker" },
          { sentence: "Møtet ___ i to timer. (å vare)", answer: "varer" },
          { sentence: "Kjøleskapet er nesten ___. (tom)", answer: "tomt" },
        ],
        translate: [
          { ua: "Сьогодні дуже насичений день.", no: "I dag er det en veldig travel dag." },
          { ua: "Я мушу бути в офісі о восьмій.", no: "Jeg må møte opp på kontoret klokka åtte." },
          { ua: "Нарешті я вдома!", no: "Endelig er jeg hjemme!" },
        ],
      },

      // 2.5
      {
        id: "2.5",
        title: "Helg hjemme",
        titleUa: "Вихідні вдома",
        grammarFocus: ["weekend vocabulary", "verb 'å ha lyst til'", "contrast: 'men'"],
        text: `I helgen sover jeg lenger. Jeg står ikke opp før klokka ni. Det er deilig!

Jeg har lyst til å slappe av i dag. Jeg drikker kaffe sakte og leser avisen på nett. Ingen stress!

Om formiddagen vasker jeg klær og rydder leiligheten. Det er kjedelig, men nødvendig. Etterpå er alt rent og fint.

Om ettermiddagen ringer venninnen min, Vera. Vi avtaler å møtes. Vi går en tur i parken. Det er fint vær i dag. Vi prater og prater.

Om kvelden bestiller vi pizza. Vi ser på en film på Netflix. Det er den beste delen av helgen. Mandag er det jobb igjen – men nå er jeg klar!`,
        vocabulary: [
          { word: "helg" },
          { word: "å sove" },
          { word: "lenger" },
          { word: "å slappe av" },
          { word: "å ha lyst til" },
          { word: "å vaske klær" },
          { word: "å rydde" },
          { word: "kjedelig" },
          { word: "nødvendig" },
          { word: "å avtale" },
          { word: "å bestille" },
          { word: "etterpå" },
        ],
        questions: [
          { q: "Når står han/hun opp i helgen?", a: "Han/hun står opp klokka ni." },
          { q: "Hva gjør han/hun om formiddagen?", a: "Han/hun vasker klær og rydder leiligheten." },
          { q: "Hva gjør han/hun og Vera i parken?", a: "De går en tur og prater." },
          { q: "Hva gjør de om kvelden?", a: "De bestiller pizza og ser på en film." },
        ],
        fillGaps: [
          { sentence: "Jeg har lyst til å ___ av i dag. (å slappe)", answer: "slappe" },
          { sentence: "Vi ___ å møtes i parken. (å avtale)", answer: "avtaler" },
          { sentence: "Vi ___ pizza om kvelden. (å bestille)", answer: "bestiller" },
          { sentence: "Det er kjedelig, men ___. (nødvendig)", answer: "nødvendig" },
        ],
        translate: [
          { ua: "У вихідні я сплю довше.", no: "I helgen sover jeg lenger." },
          { ua: "Я хочу відпочити сьогодні.", no: "Jeg har lyst til å slappe av i dag." },
          { ua: "Ми домовляємося зустрітися.", no: "Vi avtaler å møtes." },
        ],
      },

    ],
  },

  // ══════════════════════════════════════════════════════
  // ТЕМА 3 — Mat og butikk (Їжа і магазин)
  // ══════════════════════════════════════════════════════
  {
    id: 3,
    slug: "mat-og-butikk",
    title: "Mat og butikk",
    titleUa: "Їжа і магазин",
    level: "A1",
    status: "locked",
    subtopics: [

      // 3.1
      {
        id: "3.1",
        title: "På butikken",
        titleUa: "У магазині",
        grammarFocus: ["shopping vocabulary", "numbers and prices", "dialogue at the store"],
        text: `Jeg trenger å handle mat i dag. Kjøleskapet er tomt!

Jeg går til butikken nær leiligheten. Det er en Rema 1000. Den er åpen fra åtte til tjueto.

Jeg tar en handlevogn og går inn. Jeg trenger melk, brød, egg, ost og epler. Jeg ser på prisene. Melk koster tjuefem kroner. Brød koster tretti kroner.

Ved kassa er det en kort kø. Det er min tur.
– Hei! Det blir tre hundre og femti kroner.
– Her er kortet mitt.
– Takk! Ha en fin dag!
– I like måte!

Jeg putter varene i sekken og går hjem. Nå er kjøleskapet fullt!`,
        vocabulary: [
          { word: "å handle" },
          { word: "en butikk" },
          { word: "en handlevogn" },
          { word: "å koste" },
          { word: "en kasse" },
          { word: "en kø" },
          { word: "et kort" },
          { word: "en vare" },
          { word: "åpen" },
          { word: "full" },
          { word: "tom" },
          { word: "en pris" },
        ],
        questions: [
          { q: "Hvorfor går han/hun til butikken?", a: "Fordi kjøleskapet er tomt." },
          { q: "Hva heter butikken?", a: "Det er en Rema 1000." },
          { q: "Hva koster brødet?", a: "Det koster tretti kroner." },
          { q: "Hvor mye betaler han/hun totalt?", a: "Tre hundre og femti kroner." },
        ],
        fillGaps: [
          { sentence: "Kjøleskapet er ___. (tom)", answer: "tomt" },
          { sentence: "Melk ___ tjuefem kroner. (å koste)", answer: "koster" },
          { sentence: "Det er en kort ___ ved kassa. (kø)", answer: "kø" },
          { sentence: "Nå er kjøleskapet ___. (full)", answer: "fullt" },
        ],
        translate: [
          { ua: "Мені потрібно купити продукти.", no: "Jeg trenger å handle mat." },
          { ua: "Скільки це коштує?", no: "Hva koster det?" },
          { ua: "Ось моя картка.", no: "Her er kortet mitt." },
        ],
      },

      // 3.2
      {
        id: "3.2",
        title: "Jeg lager middag",
        titleUa: "Я готую вечерю",
        grammarFocus: ["cooking verbs", "ingredients vocabulary", "imperative form (recipe style)"],
        text: `I dag lager jeg middag til meg selv. Jeg lager kjøttkaker med poteter og saus. Det er en typisk norsk rett.

Først vasker jeg hendene. Så tar jeg frem kjøttdeig, egg, løk og mel. Jeg blander alt sammen i en bolle. Jeg former små kaker av kjøttdeigen.

Jeg steker kakene i en stekepanne med litt smør. De steker i ti minutter på hver side. Det lukter godt!

Samtidig koker jeg poteter i en kasserolle. Potetene er ferdige etter tjue minutter.

Til slutt lager jeg en enkel brun saus. Maten er klar! Jeg setter meg ved bordet og spiser. Det er virkelig godt. Jeg er stolt av meg selv!`,
        vocabulary: [
          { word: "å lage mat" },
          { word: "kjøttkaker" },
          { word: "kjøttdeig" },
          { word: "poteter" },
          { word: "en saus" },
          { word: "å blande" },
          { word: "å steke" },
          { word: "å koke" },
          { word: "en stekepanne" },
          { word: "smør" },
          { word: "å lukte" },
          { word: "stolt" },
        ],
        questions: [
          { q: "Hva lager han/hun til middag?", a: "Han/hun lager kjøttkaker med poteter og saus." },
          { q: "Hva blander han/hun i bollen?", a: "Kjøttdeig, egg, løk og mel." },
          { q: "Hvor lenge steker kakene på hver side?", a: "Ti minutter." },
          { q: "Hvordan føler han/hun seg etter at maten er klar?", a: "Han/hun er stolt." },
        ],
        fillGaps: [
          { sentence: "Jeg ___ kjøttdeig og egg i en bolle. (å blande)", answer: "blander" },
          { sentence: "Kakene ___ i ti minutter. (å steke)", answer: "steker" },
          { sentence: "Potetene ___ i en kasserolle. (å koke)", answer: "koker" },
          { sentence: "Det ___ veldig godt! (å lukte)", answer: "lukter" },
        ],
        translate: [
          { ua: "Я готую норвезьку страву.", no: "Jeg lager en norsk rett." },
          { ua: "Спочатку я змішую всі інгредієнти.", no: "Først blander jeg alle ingrediensene." },
          { ua: "Я пишаюся собою!", no: "Jeg er stolt av meg selv!" },
        ],
      },

      // 3.3
      {
        id: "3.3",
        title: "Frokost hjemme",
        titleUa: "Сніданок вдома",
        grammarFocus: ["breakfast vocabulary", "verb 'å foretrekke'", "food adjectives"],
        text: `Jeg spiser alltid frokost hjemme. Det er viktig å starte dagen med mat.

Til frokost spiser jeg vanligvis brød. Jeg bruker grovbrød – det er sunt og mettende. Jeg legger på ost, skinke eller syltetøy. Noen ganger legger jeg på begge deler!

Jeg foretrekker te fremfor kaffe om morgenen. Jeg liker grønn te med litt honning. Det er godt og rolig.

En typisk norsk frokost har også appelsin juice, yoghurt og havregrøt. Jeg lager havregrøt av og til. Det holder meg mett lenge.

Jeg spiser frokost mens jeg hører på radio. Det er en god start på dagen!`,
        vocabulary: [
          { word: "frokost" },
          { word: "brød" },
          { word: "grovbrød" },
          { word: "ost" },
          { word: "skinke" },
          { word: "syltetøy" },
          { word: "å foretrekke" },
          { word: "honning" },
          { word: "mettende" },
          { word: "av og til" },
          { word: "å holde mett" },
          { word: "mens" },
        ],
        questions: [
          { q: "Hva slags brød spiser han/hun?", a: "Grovbrød." },
          { q: "Hva foretrekker han/hun å drikke om morgenen?", a: "Han/hun foretrekker te." },
          { q: "Hva legger han/hun på brødet?", a: "Ost, skinke eller syltetøy." },
          { q: "Hva gjør han/hun mens han/hun spiser frokost?", a: "Han/hun hører på radio." },
        ],
        fillGaps: [
          { sentence: "Jeg ___ grovbrød til frokost. (å spise)", answer: "spiser" },
          { sentence: "Jeg ___ te fremfor kaffe. (å foretrekke)", answer: "foretrekker" },
          { sentence: "Av og til ___ jeg havregrøt. (å lage)", answer: "lager" },
          { sentence: "Jeg spiser ___ jeg hører på radio. (mens)", answer: "mens" },
        ],
        translate: [
          { ua: "Я завжди снідаю вдома.", no: "Jeg spiser alltid frokost hjemme." },
          { ua: "Я надаю перевагу чаю над кавою.", no: "Jeg foretrekker te fremfor kaffe." },
          { ua: "Це гарний початок дня!", no: "Det er en god start på dagen!" },
        ],
      },

      // 3.4
      {
        id: "3.4",
        title: "På kafé",
        titleUa: "У кафе",
        grammarFocus: ["ordering at a café", "polite forms: 'jeg vil gjerne'", "food/drink menu vocabulary"],
        text: `Det er lørdag og jeg møter venninnen min Hana på en kafé i sentrum. Kaféen heter «Kaffebrenneriet». Det er koselig der.

Vi setter oss ved vindusbordet. En servitør kommer bort til oss.

– Hei! Hva kan jeg hjelpe dere med?
– Jeg vil gjerne ha en cappuccino og et stykke sjokoladekake.
– Og du?
– Jeg tar en latte og en croissant, takk.
– Selvfølgelig! Det kommer straks.

Vi venter og prater. Det er hyggelig. Kaffen er varm og god. Kaken er søt og deilig.

– Hva koster det?
– Det blir to hundre og tjue kroner til sammen.
– Vi splitter?
– Ja, selvfølgelig!

Vi betaler og går ut. Det var en fin lørdag!`,
        vocabulary: [
          { word: "en kafé" },
          { word: "koselig" },
          { word: "en servitør" },
          { word: "å ville gjerne" },
          { word: "et stykke" },
          { word: "straks" },
          { word: "søt" },
          { word: "å splitte" },
          { word: "til sammen" },
          { word: "selvfølgelig" },
          { word: "et vindusbord" },
          { word: "varm" },
        ],
        questions: [
          { q: "Hvor møtes de to venninnene?", a: "På en kafé som heter Kaffebrenneriet." },
          { q: "Hva bestiller den første jenta?", a: "En cappuccino og et stykke sjokoladekake." },
          { q: "Hva koster det totalt?", a: "To hundre og tjue kroner." },
          { q: "Hvordan betaler de?", a: "De splitter regningen." },
        ],
        fillGaps: [
          { sentence: "Jeg vil ___ ha en cappuccino. (gjerne)", answer: "gjerne" },
          { sentence: "Det ___ straks. (å komme)", answer: "kommer" },
          { sentence: "Kaffen er varm og ___. (god)", answer: "god" },
          { sentence: "Det blir to hundre kroner til ___. (sammen)", answer: "sammen" },
        ],
        translate: [
          { ua: "Я хочу каву, будь ласка.", no: "Jeg vil gjerne ha en kaffe." },
          { ua: "Скільки це коштує?", no: "Hva koster det?" },
          { ua: "Розділимо рахунок?", no: "Vi splitter?" },
        ],
      },

      // 3.5
      {
        id: "3.5",
        title: "Handleliste",
        titleUa: "Список покупок",
        grammarFocus: ["quantities: 'en liter', 'et kilo'", "food categories", "verb 'å trenge'"],
        text: `Før jeg går til butikken, lager jeg alltid en handleliste. Det er smart – da glemmer jeg ingenting!

Denne uken trenger jeg:
– To liter melk
– Et kilo kjøttdeig
– Fem epler
– En pose pasta
– En boks tomater på boks
– Et halvt kilo ost
– To pakker smør
– Brød

Jeg sjekker kjøleskapet og skapet. Jeg har allerede egg og løk, så det trenger jeg ikke kjøpe.

Butikken er ikke langt fra leiligheten. Jeg går dit til fots. Det tar ti minutter.

Jeg finner alt på listen. Prisen er bra – jeg bruker ikke for mye penger. God handel!`,
        vocabulary: [
          { word: "en handleliste" },
          { word: "å glemme" },
          { word: "en liter" },
          { word: "et kilo" },
          { word: "en pose" },
          { word: "en boks" },
          { word: "et skap" },
          { word: "allerede" },
          { word: "til fots" },
          { word: "å finne" },
          { word: "god handel" },
          { word: "å sjekke" },
        ],
        questions: [
          { q: "Hvorfor lager han/hun en handleliste?", a: "For ikke å glemme noe." },
          { q: "Hva trenger han/hun ikke kjøpe?", a: "Egg og løk – det har han/hun allerede." },
          { q: "Hvordan går han/hun til butikken?", a: "Til fots." },
          { q: "Hvor lang tid tar turen til butikken?", a: "Ti minutter." },
        ],
        fillGaps: [
          { sentence: "Jeg lager alltid en ___ før jeg handler. (handleliste)", answer: "handleliste" },
          { sentence: "Jeg ___ to liter melk. (å trenge)", answer: "trenger" },
          { sentence: "Jeg har ___ egg hjemme. (allerede)", answer: "allerede" },
          { sentence: "Jeg går dit til ___. (fots)", answer: "fots" },
        ],
        translate: [
          { ua: "Перш ніж іти в магазин, я роблю список.", no: "Før jeg går til butikken, lager jeg en liste." },
          { ua: "Мені потрібен один кілограм фаршу.", no: "Jeg trenger et kilo kjøttdeig." },
          { ua: "Я вже маю яйця вдома.", no: "Jeg har allerede egg hjemme." },
        ],
      },

    ],
  },
];