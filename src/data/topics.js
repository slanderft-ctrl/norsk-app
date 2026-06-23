
import {
  grammar_1_1, grammar_1_2, grammar_1_3, grammar_1_4, grammar_1_5,
  grammar_2_1, grammar_2_2, grammar_2_3, grammar_2_4, grammar_2_5,
  grammar_3_1, grammar_3_2, grammar_3_3, grammar_3_4, grammar_3_5,
  grammar_4_1, grammar_4_2, grammar_4_3, grammar_4_4, grammar_4_5,
  grammar_5_1, grammar_5_2, grammar_5_3, grammar_5_4, grammar_5_5,
} from "./grammar-blocks"

export const topics = [
  {
    id: 1,
    slug: "introduksjon",
    title: "Introduksjon",
    titleUa: "Знайомство",
    level: "A1",
    status: "active",
    subtopics: [

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
        grammar: grammar_1_1,
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
        grammar: grammar_1_2,
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
        grammar: grammar_1_3,
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
        grammar: grammar_1_4,
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
        grammar: grammar_1_5,
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

  {
    id: 2,
    slug: "hverdagen",
    title: "Hverdagen",
    titleUa: "Щоденне життя",
    level: "A1",
    status: "active",
    subtopics: [

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
        grammar: grammar_2_1,
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
        grammar: grammar_2_2,
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
        grammar: grammar_2_3,
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
        grammar: grammar_2_4,
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
        grammar: grammar_2_5,
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

  {
    id: 3,
    slug: "mat-og-butikk",
    title: "Mat og butikk",
    titleUa: "Їжа і магазин",
    level: "A1",
    status: "locked",
    subtopics: [

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
        grammar: grammar_3_1,
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
        grammar: grammar_3_2,
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
        grammar: grammar_3_3,
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
        grammar: grammar_3_4,
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
        grammar: grammar_3_5,
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

  {
    id: 4,
    slug: "hvordan-gar-det",
    title: "Hvordan går det?",
    titleUa: "Як справи?",
    level: "A1",
    status: "locked",
    subtopics: [

      {
        id: "4.1",
        title: "Hei! Hvordan går det?",
        titleUa: "Привіт! Як справи?",
        grammarFocus: ["object pronouns: meg, deg, ham, henne", "SVO word order", "greeting phrases"],
        text: `Det er mandag morgen. Lena møter naboen sin, Ivan, i gangen.

– Hei, Ivan! Hvordan går det med deg?
– Hei, Lena! Det går bra, takk. Og med deg?
– Fint, takk! Er du trøtt? Du ser litt trøtt ut.
– Ja, litt. Jeg sov dårlig i natt. Og du – hva gjør du i dag?
– Jeg går på norskkurs klokka ti. Etterpå skal jeg handle.
– Akkurat det samme! Vi kan gå sammen?
– Ja, gjerne! Vent på meg – jeg tar sekken.

De går til busstoppen sammen. Det er hyggelig å ha en god nabo!`,
        vocabulary: [
          { word: "en nabo" },
          { word: "en gang" },
          { word: "å se ut" },
          { word: "dårlig" },
          { word: "i natt" },
          { word: "å vente" },
          { word: "akkurat" },
          { word: "et busstop" },
        ],
        grammar: grammar_4_1,
        questions: [
          { q: "Hva gjør Lena i dag?", a: "Hun går på norskkurs og handler etterpå." },
          { q: "Hvorfor er Ivan trøtt?", a: "Han sov dårlig i natt." },
          { q: "Hva gjør de til slutt?", a: "De går til busstoppen sammen." },
          { q: "Hva sier Lena når Ivan vil gå?", a: "Vent på meg – jeg tar sekken." },
        ],
        fillGaps: [
          { sentence: "Hvordan går det med ___? (deg)", answer: "deg" },
          { sentence: "Vent på ___! (meg)", answer: "meg" },
          { sentence: "Jeg sov dårlig i ___. (natt)", answer: "natt" },
          { sentence: "Det er hyggelig å ha en god ___. (nabo)", answer: "nabo" },
        ],
        translate: [
          { ua: "Як справи?", no: "Hvordan går det med deg?" },
          { ua: "Чекай на мене!", no: "Vent på meg!" },
          { ua: "Приємно мати гарного сусіда!", no: "Det er hyggelig å ha en god nabo!" },
        ],
      },

      {
        id: "4.2",
        title: "Alder og fødselsdato",
        titleUa: "Вік і дата народження",
        grammarFocus: ["question words: når, hvor gammel", "numbers 1–100", "months and years"],
        text: `Marta er på kommunekontoret. Hun skal registrere seg. En vennlig dame hjelper henne.

– Hva heter du?
– Jeg heter Marta Kovalenko.
– Hva er fødselsdatoen din?
– Jeg er født den syttende mars, nitten nittisju.
– Så du er tjueåtte år gammel?
– Ja, det stemmer. Jeg fyller tjueni i mars.
– Og hva er telefonnummeret ditt?
– Det er null fire sju – to to – tre tre – null åtte.
– Takk. Når kom du til Norge?
– Jeg kom i januar, to tusen og tjuetre.
– Bra! Snakker du allerede litt norsk?
– Ja, litt! Jeg lærer!

Damen smiler. Marta er fornøyd.`,
        vocabulary: [
          { word: "et kommunekontor" },
          { word: "å registrere seg" },
          { word: "å være født" },
          { word: "å fylle år" },
          { word: "en fødselsdato" },
          { word: "siden" },
          { word: "fornøyd" },
          { word: "å stemme" },
        ],
        grammar: grammar_4_2,
        questions: [
          { q: "Når er Marta født?", a: "Den syttende mars, 1997." },
          { q: "Hvor gammel er hun?", a: "Hun er tjueåtte år gammel." },
          { q: "Når kom hun til Norge?", a: "I januar 2023." },
          { q: "Hva gjør hun på kommunekontoret?", a: "Hun registrerer seg." },
        ],
        fillGaps: [
          { sentence: "Jeg er ___ den syttende mars. (å være født)", answer: "født" },
          { sentence: "Jeg ___ tjueni i mars. (å fylle år)", answer: "fyller" },
          { sentence: "Ja, det ___! (å stemme)", answer: "stemmer" },
          { sentence: "Marta er ___. (fornøyd)", answer: "fornøyd" },
        ],
        translate: [
          { ua: "Коли ти народився/народилася?", no: "Når er du født?" },
          { ua: "Мені двадцять п'ять років.", no: "Jeg er tjuefem år gammel." },
          { ua: "Я приїхала до Норвегії у вересні.", no: "Jeg kom til Norge i september." },
        ],
      },

      {
        id: "4.3",
        title: "Telefon og adresse",
        titleUa: "Телефон і адреса",
        grammarFocus: ["prepositions i / på for location", "phone number format", "SVO sentences"],
        text: `Kurset er slutt. Nadia og Oksana snakker utenfor bygningen.

– Nadia, kan jeg få telefonnummeret ditt?
– Ja, selvfølgelig! Det er null fire to – femti tre – tjueto – sekstini.
– Og hvor bor du?
– Jeg bor i Bergen, på Danmarksplass. Og du?
– Jeg bor i Åsane, i en liten leilighet. Har du det bra der?
– Ja, det er fint! Naboene er snille. Og det er en butikk i gata.
– Bra! Bor du alene?
– Nei, jeg bor med en venninne fra Ukraina. Det er koselig.
– Hyggelig! Vi kan ses igjen neste uke?
– Gjerne! Jeg sender deg en melding.

De vinker og går hver sin vei.`,
        vocabulary: [
          { word: "utenfor" },
          { word: "en bygning" },
          { word: "å få" },
          { word: "en adresse" },
          { word: "en gate" },
          { word: "en melding" },
          { word: "å vinke" },
          { word: "å sende" },
          { word: "neste" },
        ],
        grammar: grammar_4_3,
        questions: [
          { q: "Hva ber Oksana om?", a: "Telefonnummeret til Nadia." },
          { q: "Hvor bor Nadia?", a: "I Bergen, på Danmarksplass." },
          { q: "Hvem bor Nadia med?", a: "Med en venninne fra Ukraina." },
          { q: "Hva gjør de til slutt?", a: "De vinker og går. Nadia sender en melding neste uke." },
        ],
        fillGaps: [
          { sentence: "Jeg bor ___ Bergen. (i/på)", answer: "i" },
          { sentence: "Jeg bor ___ Danmarksplass. (i/på)", answer: "på" },
          { sentence: "Det er en butikk ___ gata. (i/på)", answer: "i" },
          { sentence: "Jeg ___ deg en melding. (å sende)", answer: "sender" },
        ],
        translate: [
          { ua: "Де ти живеш?", no: "Hvor bor du?" },
          { ua: "Я живу в Осло, на Стурґата.", no: "Jeg bor i Oslo, på Storgata." },
          { ua: "Надішлю тобі повідомлення.", no: "Jeg sender deg en melding." },
        ],
      },

      {
        id: "4.4",
        title: "Venner og sivilstatus",
        titleUa: "Друзі і сімейний стан",
        grammarFocus: ["noun gender: en/et", "plural forms: -er / unchanged", "civil status vocabulary"],
        text: `Lena og Fatima drikker te etter kurset. De snakker om livet i Norge.

– Lena, er du gift?
– Nei, jeg er ikke gift. Jeg er enslig. Og du?
– Jeg er samboer med en mann fra Somalia. Vi har to barn.
– To barn! Hvor gamle er de?
– Sønnen min er fem år. Datteren min er tre år. Og du – har du kjæreste?
– Nei, ikke nå. Men jeg har mange venner her, det er det viktigste!
– Jeg er enig! Venner er viktige. Hva gjør du i helgen?
– Jeg vet ikke ennå. Kanskje en tur i fjellet?
– Det høres bra ut! Kan vi bli med?
– Ja, selvfølgelig! Jo flere, jo bedre!

De ler og avtaler en tur på lørdag.`,
        vocabulary: [
          { word: "gift" },
          { word: "enslig" },
          { word: "samboer" },
          { word: "et barn" },
          { word: "en sønn" },
          { word: "en datter" },
          { word: "en kjæreste" },
          { word: "enig" },
          { word: "ennå" },
          { word: "å høres ut" },
        ],
        grammar: grammar_4_4,
        questions: [
          { q: "Er Lena gift?", a: "Nei, hun er enslig." },
          { q: "Hvem er Fatima samboer med?", a: "Med en mann fra Somalia." },
          { q: "Hvor mange barn har Fatima?", a: "To barn." },
          { q: "Hva avtaler de til slutt?", a: "En tur i fjellet på lørdag." },
        ],
        fillGaps: [
          { sentence: "Jeg er ___ med en mann fra Somalia. (samboer)", answer: "samboer" },
          { sentence: "Sønnen min er fem ___. (år)", answer: "år" },
          { sentence: "Jo ___, jo bedre! (fler)", answer: "flere" },
          { sentence: "Vi ___ en tur på lørdag. (å avtale)", answer: "avtaler" },
        ],
        translate: [
          { ua: "Ти одружений/одружена?", no: "Er du gift?" },
          { ua: "Я живу разом з партнером.", no: "Jeg er samboer." },
          { ua: "Чим більше, тим краще!", no: "Jo flere, jo bedre!" },
        ],
      },

      {
        id: "4.5",
        title: "Når kom du til Norge?",
        titleUa: "Коли ти приїхав до Норвегії?",
        grammarFocus: ["inversion with time expressions", "pronunciation: e / i / y", "past: kom"],
        text: `Det er et møte i frivillighetssentralen. Folk fra mange land er der. En norsk frivillig, Kristian, snakker med deltakerne.

– Hei! Jeg heter Kristian. Velkommen! Når kom dere til Norge?
– Jeg kom i august to tusen og tjueto, sier Bohdan.
– Og jeg kom i februar i år, sier Amira.
– Hva gjør dere nå?
– Nå går jeg på norskkurs og ser etter jobb, sier Bohdan.
– Jeg passer barna hjemme foreløpig. Men jeg vil også lære norsk, sier Amira.
– Det er bra! Norsk er nøkkelen. Hvordan er det å bo her?
– Det er annerledes, men folk er hjelpsomme, sier Bohdan.
– Ja! Naboene hjelper oss mye, sier Amira.
– Det er typisk norsk! Dugnadsånden er sterk her.

Alle ler. Det er en god start!`,
        vocabulary: [
          { word: "en frivillighetssentral" },
          { word: "frivillig" },
          { word: "en deltaker" },
          { word: "å se etter" },
          { word: "å passe barn" },
          { word: "foreløpig" },
          { word: "en nøkkel" },
          { word: "annerledes" },
          { word: "hjelpsomme" },
          { word: "dugnadsånd" },
        ],
        grammar: grammar_4_5,
        questions: [
          { q: "Når kom Bohdan til Norge?", a: "I august 2022." },
          { q: "Hva gjør Bohdan nå?", a: "Han går på norskkurs og ser etter jobb." },
          { q: "Hva gjør Amira foreløpig?", a: "Hun passer barna hjemme." },
          { q: "Hva er «dugnadsånden»?", a: "Den norske ånden om å hjelpe hverandre." },
        ],
        fillGaps: [
          { sentence: "Jeg ___ til Norge i august. (å komme)", answer: "kom" },
          { sentence: "Nå ___ jeg etter jobb. (å se)", answer: "ser" },
          { sentence: "Folk er veldig ___. (hjelpsomme)", answer: "hjelpsomme" },
          { sentence: "Norsk er ___ til et godt liv her. (nøkkelen)", answer: "nøkkelen" },
        ],
        translate: [
          { ua: "Коли ти приїхав/приїхала до Норвегії?", no: "Når kom du til Norge?" },
          { ua: "Зараз я шукаю роботу.", no: "Nå ser jeg etter jobb." },
          { ua: "Люди тут дуже готові допомогти.", no: "Folk er veldig hjelpsomme her." },
        ],
      },

    ],
  },

  {
    id: 5,
    slug: "familie-og-fritid",
    title: "Familie og fritid",
    titleUa: "Сім'я і дозвілля",
    level: "A1",
    status: "locked",
    subtopics: [

      {
        id: "5.1",
        title: "Familien vår",
        titleUa: "Наша сім'я",
        grammarFocus: ["bestemt form: -en/-et/-ene", "family vocabulary extended", "possessive after noun"],
        text: `Hei! Jeg heter Oksana. Jeg vil fortelle om familien min.

Mannen min heter Vasyl. Han er ingeniør. Vi har to barn – en sønn og en datter. Sønnen heter Mykola og er åtte år. Datteren heter Sofia og er fem år.

Broren min bor i Polen nå. Han er gift med en polsk dame. De har ett barn – en liten gutt på to år.

Familien til Vasyl er stor. Foreldrene hans bor i Lviv. Søsteren til Vasyl bor i Kyiv med mannen sin og tre barn.

Vi bor langt fra familien vår, men vi ringer hverandre hver uke. Familien er det viktigste vi har.`,
        vocabulary: [
          { word: "å fortelle" },
          { word: "en mann" },
          { word: "en sønn" },
          { word: "en datter" },
          { word: "en gutt" },
          { word: "foreldre" },
          { word: "langt fra" },
          { word: "det viktigste" },
        ],
        grammar: grammar_5_1,
        questions: [
          { q: "Hva heter mannen til Oksana?", a: "Han heter Vasyl." },
          { q: "Hvor mange barn har Oksana og Vasyl?", a: "De har to barn." },
          { q: "Hvor bor broren til Oksana?", a: "Han bor i Polen." },
          { q: "Hvordan holder de kontakt med familien?", a: "De ringer hverandre hver uke." },
        ],
        fillGaps: [
          { sentence: "Sønnen ___ heter Mykola. (min)", answer: "min" },
          { sentence: "Familien ___ Vasyl er stor. (til)", answer: "til" },
          { sentence: "Broren ___ er gift. (min)", answer: "min" },
          { sentence: "___ er det viktigste vi har. (Familien)", answer: "Familien" },
        ],
        translate: [
          { ua: "Мій чоловік — інженер.", no: "Mannen min er ingeniør." },
          { ua: "Ми живемо далеко від сім'ї.", no: "Vi bor langt fra familien vår." },
          { ua: "Сім'я — найважливіше, що в нас є.", no: "Familien er det viktigste vi har." },
        ],
      },

      {
        id: "5.2",
        title: "Husarbeid og hvem gjør hva",
        titleUa: "Хатня робота: хто що робить",
        grammarFocus: ["eieforhold med 'til'", "present tense of household verbs", "spørreord: hvem"],
        text: `I familien vår deler vi husarbeidet. Det er viktig at alle hjelper til.

Mannen min støvsuger og vasker gulvet. Han gjør det alltid på lørdag. Jeg lager mat og tar oppvasken. Barna hjelper til med enkle ting.

Sønnen min rydder rommet sitt. Datteren min setter bordet. De gjør det uten klaging – det er bra!

Noen ganger bytter vi oppgaver. Da lager mannen middag og jeg vasker klær. Det er rettferdig.

Husarbeid er ikke morsomt, men det er nødvendig. Vi gjør det raskt og sammen – da er det lettere!`,
        vocabulary: [
          { word: "husarbeid" },
          { word: "å dele" },
          { word: "å støvsuge" },
          { word: "å vaske gulvet" },
          { word: "å ta oppvasken" },
          { word: "å rydde rommet" },
          { word: "å sette bordet" },
          { word: "rettferdig" },
          { word: "klaging" },
          { word: "å bytte" },
        ],
        grammar: grammar_5_2,
        questions: [
          { q: "Hva gjør mannen til Oksana på lørdag?", a: "Han støvsuger og vasker gulvet." },
          { q: "Hva gjør sønnen?", a: "Han rydder rommet sitt." },
          { q: "Hva gjør datteren?", a: "Hun setter bordet." },
          { q: "Hva skjer når de bytter oppgaver?", a: "Da lager mannen middag og hun vasker klær." },
        ],
        fillGaps: [
          { sentence: "Mannen ___ støvsuger på lørdag. (min)", answer: "min" },
          { sentence: "Rommet ___ sønnen er ryddig. (til)", answer: "til" },
          { sentence: "Vi ___ husarbeidet. (å dele)", answer: "deler" },
          { sentence: "Det er ___. (rettferdig)", answer: "rettferdig" },
        ],
        translate: [
          { ua: "Ми ділимо хатню роботу.", no: "Vi deler husarbeidet." },
          { ua: "Кімната сина охайна.", no: "Rommet til sønnen er ryddig." },
          { ua: "Разом це легше!", no: "Sammen er det lettere!" },
        ],
      },

      {
        id: "5.3",
        title: "Fritidsinteresser",
        titleUa: "Захоплення і дозвілля",
        grammarFocus: ["modal verbs: skal, vil, kan, må", "infinitive without å after modal", "leisure vocabulary"],
        text: `Jeg liker å ha en aktiv fritid. Det er viktig å gjøre noe man liker.

Om mandagen skal jeg på yoga. Det er bra for kroppen og hodet. Om onsdagen kan jeg svømme i bassenget. Det koster ikke mye og er veldig avslappende.

I helgene vil jeg helst tilbringe tid med familien. Vi kan gå på tur, dra til stranda eller besøke venner. Barna liker å leke ute.

Mannen min liker å spille sjakk og lese bøker. Han må alltid ha en bok ved siden av sofaen!

Vi har ikke alltid mye tid, men vi prøver å gjøre noe hyggelig minst én gang i uken.`,
        vocabulary: [
          { word: "fritid" },
          { word: "aktiv" },
          { word: "å svømme" },
          { word: "et basseng" },
          { word: "avslappende" },
          { word: "å tilbringe" },
          { word: "å leke" },
          { word: "sjakk" },
          { word: "minst" },
          { word: "helst" },
        ],
        grammar: grammar_5_3,
        questions: [
          { q: "Hva gjør hun om mandagen?", a: "Hun skal på yoga." },
          { q: "Hva liker barna å gjøre?", a: "De liker å leke ute." },
          { q: "Hva er hobbyen til mannen?", a: "Han liker å spille sjakk og lese bøker." },
          { q: "Hva prøver de å gjøre minst én gang i uken?", a: "Noe hyggelig — tur, strand eller besøk." },
        ],
        fillGaps: [
          { sentence: "Om mandagen ___ jeg på yoga. (skal)", answer: "skal" },
          { sentence: "Jeg ___ svømme om onsdagen. (kan)", answer: "kan" },
          { sentence: "Han ___ alltid ha en bok. (må)", answer: "må" },
          { sentence: "Vi ___ tilbringe tid med familien. (vil)", answer: "vil" },
        ],
        translate: [
          { ua: "У понеділок я займаюся йогою.", no: "Om mandagen skal jeg på yoga." },
          { ua: "Ти можеш плавати в басейні.", no: "Du kan svømme i bassenget." },
          { ua: "Ми хочемо проводити час разом.", no: "Vi vil tilbringe tid sammen." },
        ],
      },

      {
        id: "5.4",
        title: "Hjemme og ute",
        titleUa: "Вдома і надворі",
        grammarFocus: ["stedsadverb: hjem/hjemme, ute/ut, inne/inn", "motion vs. position verbs", "daily schedule"],
        text: `Det er fredag ettermiddag. Alle i familien er hjemme tidlig i dag.

Barna er ute og leker i hagen. Sønnen min har med seg en venn fra skolen. De leker ute i over en time.

Jeg er inne og lager middag. Mannen min kommer hjem klokka fem. Han går rett inn og setter seg i sofaen. Han er trøtt etter jobben.

– Vil barna komme inn nå? Det er snart middag.
– Ja, jeg henter dem. Kom inn, barn! Middag er klar!

Barna løper inn. Vi spiser middag sammen. Etterpå går vi en liten tur ute – det er fint vær. Klokka ni går alle hjem til sengs.`,
        vocabulary: [
          { word: "en hage" },
          { word: "å hente" },
          { word: "å løpe" },
          { word: "tidlig" },
          { word: "snart" },
          { word: "rett" },
          { word: "til sengs" },
          { word: "over" },
        ],
        grammar: grammar_5_4,
        questions: [
          { q: "Hva gjør barna om ettermiddagen?", a: "De leker ute i hagen." },
          { q: "Hva gjør mannen når han kommer hjem?", a: "Han går rett inn og setter seg i sofaen." },
          { q: "Hva gjør familien etter middag?", a: "De går en liten tur ute." },
          { q: "Når går alle til sengs?", a: "Klokka ni." },
        ],
        fillGaps: [
          { sentence: "Barna er ___ og leker. (ute/ut)", answer: "ute" },
          { sentence: "Mannen kommer ___ klokka fem. (hjem/hjemme)", answer: "hjem" },
          { sentence: "Jeg er ___ og lager middag. (inne/inn)", answer: "inne" },
          { sentence: "Kom ___, barn! (inne/inn)", answer: "inn" },
        ],
        translate: [
          { ua: "Діти граються надворі.", no: "Barna leker ute." },
          { ua: "Заходь!", no: "Kom inn!" },
          { ua: "Чоловік повертається додому о п'ятій.", no: "Mannen kommer hjem klokka fem." },
        ],
      },

      {
        id: "5.5",
        title: "Sende SMS og gjøre avtaler",
        titleUa: "Надсилати SMS і домовлятися",
        grammarFocus: ["spørreord: hvor mange", "modal: kan vi møtes?", "SMS language and expressions"],
        text: `Oksana og venninnen Hana sender meldinger til hverandre.

Oksana: Hei! Har du planer i helgen?
Hana: Hei! Nei, ikke noe spesielt. Hva tenker du?
Oksana: Kanskje vi kan møtes? Jeg vil gjerne drikke kaffe og prate litt.
Hana: Ja, det høres bra ut! Lørdag eller søndag?
Oksana: Lørdag passer best for meg. Klokka tolv?
Hana: Passer fint! Hvor mange barn tar du med?
Oksana: Bare Sofia. Mykola er hos bestefar den dagen.
Hana: OK! Sees på lørdag. Ha det!
Oksana: Ha det bra! 😊

På lørdag møtes de på den lille kaféen i sentrum. De prater i to timer. Det er akkurat det de trenger!`,
        vocabulary: [
          { word: "en plan" },
          { word: "spesielt" },
          { word: "å tenke" },
          { word: "å passe" },
          { word: "en bestefar" },
          { word: "å møtes" },
          { word: "å sees" },
          { word: "bare" },
        ],
        grammar: grammar_5_5,
        questions: [
          { q: "Hva vil Oksana gjøre i helgen?", a: "Hun vil møte Hana og drikke kaffe." },
          { q: "Hvilken dag avtaler de?", a: "Lørdag." },
          { q: "Hvor mange barn tar Oksana med?", a: "Bare én – Sofia." },
          { q: "Hvor er Mykola den dagen?", a: "Hos bestefar." },
        ],
        fillGaps: [
          { sentence: "Kanskje vi ___ møtes? (kan)", answer: "kan" },
          { sentence: "Lørdag ___ best for meg. (å passe)", answer: "passer" },
          { sentence: "Hvor mange barn ___ du med? (å ta)", answer: "tar" },
          { sentence: "___ på lørdag! (å sees)", answer: "Sees" },
        ],
        translate: [
          { ua: "Може, ми зустрінемося?", no: "Kanskje vi kan møtes?" },
          { ua: "Субота мені найкраще підходить.", no: "Lørdag passer best for meg." },
          { ua: "Побачимося в суботу!", no: "Sees på lørdag!" },
        ],
      },

    ],
  },

];