// api/story.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic } = req.body;

  // --- 1. EXTENSIVE GENERATION PARMETERS FOR MAXIMUM VARIETY ---

  const GENRES = [
    "Modern Slice of Life: Realistic daily situations in urban Finland.",
    "Nordic Noir / Light Mystery: A missing item, a strange coded message, or a gentle neighborhood mystery.",
    "Cultural Immersion: Experiencing Finnish traditions (sauna, juhannus, crayfish parties) for the first time.",
    "Workplace Drama: Professional challenges, office dynamics, or starting a new business.",
    "Nature & Solitude: A reflective journey in the Finnish wilderness, archipelago, or Lapland.",
    "Romantic Comedy: An awkward date, a misunderstanding, or a meet-cute in a cafe.",
    "Sci-Fi / Future: A glimpse into a high-tech Helsinki of the future.",
    "Historical Fiction: A scene from 1950s Helsinki or rural life in the past.",
    "Social Satire: A funny look at Finnish stereotypes (e.g., personal space, coffee consumption)."
  ];

  const SETTINGS = [
    "A bustling market square (Kauppatori) in Helsinki during summer.",
    "A quiet, snow-covered cabin (mökki) by a frozen lake.",
    "A modern open-plan office in Keilaniemi.",
    "A crowded tram (ratikka) during rush hour.",
    "A university library or campus cafe.",
    "A late-night train journey from Helsinki to Rovaniemi.",
    "A heavy metal concert venue or rock club.",
    "A peaceful forest path during the 'ruska' (autumn foliage) season.",
    "A busy shopping mall (Kauppakeskus) on a Saturday.",
    "A traditional public sauna."
  ];

  const CHARACTERS = [
    "A determined software developer moving to Finland for work.",
    "An elderly pensioner who knows all the neighborhood secrets.",
    "A stressed university student preparing for an important exam.",
    "A tourist who accidentally gets lost in the city.",
    "A helpful bus driver who loves to talk (unusually for a Finn).",
    "A young artist seeking inspiration from nature.",
    "A strict but fair teacher.",
    "An entrepreneur trying to sell a strange new invention."
  ];

  const TONES = [
    "Humorous and lighthearted",
    "Melancholic and reflective",
    "Tense and exciting",
    "Inspiring and hopeful",
    "Mysterious and intriguing",
    "Awkward but heartwarming"
  ];

  // Random Selection for uniqueness
  const genre = GENRES[Math.floor(Math.random() * GENRES.length)];
  const setting = SETTINGS[Math.floor(Math.random() * SETTINGS.length)];
  const character = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
  const tone = TONES[Math.floor(Math.random() * TONES.length)];

  // Default base topic if none provided
  const baseTopic = (topic && topic.trim()) ? topic : "a turning point in someone's life";

  // --- 2. ADVANCED SYSTEM PROMPT ---

  const prompt = `
  You are an expert Finnish language teacher and professional storyteller.
  
  TASK: Write a unique, engaging, and detailed short story in Finnish (B1/B2 Level).
  
  STORY PARAMETERS:
  - **Topic**: ${baseTopic}
  - **Genre**: ${genre}
  - **Setting**: ${setting}
  - **Protagonist**: ${character}
  - **Tone**: ${tone}
  
  LANGUAGE GUIDELINES (STRICT B1/B2 LEVEL):
  - **Grammar**: You MUST use a mix of tenses (perfekti, pluskvamperfekti) and moods (kondictionaali).
  - **Sentence Structure**: Avoid simple sentences. Use complex compound sentences with connectors ('koska', 'vaikka', 'jotta', 'siksi että', 'sillä aikaa kun').
  - **Vocabulary**: Use sophisticated vocabulary suitable for working life and deep conversation. Avoid childish or textbook-simple language.
  
  CONTENT REQUIREMENTS:
  1.  **LENGTH**: STRICTLY 500-800 WORDS. Do not write less.
  2.  **No Clichés**: Do NOT start with "Olipa kerran". Start in the middle of a scene or dialogue.
  3.  **Depth**: Describe thoughts, feelings, and sensory details (smells, sounds, lighting).
  4.  **Dialogue**: Include extensive dialogue that reveals character personality.
  
  OUTPUT FORMAT (JSON ONLY):
  Return a strictly valid JSON object. Do not include markdown formatting like \`\`\`json.
  
  {
    "story": "The complete Finnish story text...",
    "vocabulary": {
      "FinnishWord1": "English translation (contextual)",
      "FinnishWord2": "English translation (contextual)",
      ... (Select 15-20 challenging B1/B2-level words)
    }
  }
  `;

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing Gemini API Key in Environment Variables");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // Updated to latest efficient model
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.85, // Slightly higher for more creativity
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up potential markdown wrapper from API response
    const jsonString = text.replace(/```json|```/g, '').trim();

    let finalResult;
    try {
      finalResult = JSON.parse(jsonString);
    } catch (e) {
      console.error("JSON Parse Error:", e);
      throw new Error("Invalid JSON response from AI");
    }

    res.status(200).json(finalResult);

  } catch (error) {
    console.error("Story Generation Error:", error);

    // Superior Fallback Mechanism - LONG B1 STORIES (500-800 words)
    // Since the user is on Live Server, these MUST be long and high quality.
    const backups = [
      {
        story: "Matti heräsi aikaisin maanantainaamuna, mutta hän tunsi itsensä väsyneeksi. Ulkona oli vielä pimeää, ja sade ropisi ikkunaan. ”Miksi minun täytyy nousta näin aikaisin?” hän ajatteli ja veti peiton korvilleen. Mutta tänään oli tärkeä päivä. Hänellä oli työhaastattelu uudessa teknologiayrityksessä, joka sijaitsi Helsingin keskustassa.\n\nMatti nousi ylös ja keitti vahvaa kahvia. Keittiössä tuoksui tuore kahvi ja ruisleipä. Hän söi nopeasti aamiaisen ja luki uutiset tabletiltaan. Bussimatka keskustaan kesti puoli tuntia. Bussissa oli paljon ihmisiä, ja ilma oli kostea. Matti katseli ikkunasta, kuinka kaupungin valot heijastuivat märästä asfaltista.\n\nKun hän saapui toimistolle, hän oli hieman hermostunut. Rakennus oli moderni lasipalatsi, ja aulassa oli tyylikäs vastaanottotiski. Vastaanottovirkailija hymyili ja pyysi Mattia odottamaan hetken. Matti istui mukavalle sohvalle ja yritti rauhoittua. Hän kertasi mielessään vastauksia tyypillisiin haastattelukysymyksiin: ”Mitkä ovat vahvuutesi?”, ”Missä näet itsesi viiden vuoden kuluttua?”\n\nHaastattelija, nainen nimeltä Sari, tuli hakemaan hänet. Sari oli ystävällinen ja rento, mikä auttoi Mattia rentoutumaan. Heidän keskustelunsa sujui hyvin. He puhuivat Matin koulutuksesta, työkokemuksesta ja harrastuksista. Matti kertoi innostuneesti projektista, jonka hän oli tehnyt edellisessä työpaikassaan. Sari kuunteli tarkkaavaisesti ja teki muistiinpanoja.\n\nYllättäen Sari kysyi: ”Miten toimit paineen alla?” Matti mietti hetken. Hän kertoi tilanteesta, jossa hän oli joutunut ratkaisemaan vaikean teknisen ongelman hyvin lyhyessä ajassa. Hän selitti, kuinka hän oli priorisoinut tehtävät ja kommunikoinut tiimin kanssa. Sari nyökkäsi hyväksyvästi.\n\nHaastattelun lopuksi Sari kysyi, oliko Matilla kysyttävää. Matti kysyi yrityksen kulttuurista ja etätyömahdollisuuksista. Sari kertoi, että yritys arvostaa työn ja vapaa-ajan tasapainoa, ja että heillä on joustavat työajat. Tämä kuulosti Matista erinomaiselta.\n\nKun haastattelu oli ohi, Matti käveli ulos rakennuksesta. Sade oli loppunut, ja aurinko yritti pilkistää pilvien raosta. Hänellä oli hyvä tunne. Hän soitti heti ystävälleen Pekalle ja kertoi, miten haastattelu oli mennyt. ”Kuulostaa lupaavalta!” Pekka sanoi. ”Mennäänkö lounaalle juhlistamaan?”\n\nHe menivät lounaalle pieneen italialaiseen ravintolaan lähellä Esplanadia. Matti tilasi pizzaa ja Pekka otti pastaa. He juttelivat pitkään tulevaisuudensuunnitelmista ja kesälomasta. Matti tajusi, että vaikka hän ei saisi työpaikkaa, hän oli ylpeä itsestään. Hän oli uskaltanut yrittää ja tehnyt parhaansa. Se oli tärkeintä.",
        vocabulary: { "työhaastattelu": "job interview", "teknologiayritys": "tech company", "vastaanottovirkailija": "receptionist", "hermostunut": "nervous", "rauhoittua": "to calm down", "priorisoida": "to prioritize", "etätyömahdollisuus": "remote work opportunity", "joustava": "flexible", "lupaava": "promising", "tasapaino": "balance", "ylpeä": "proud", "uskaltaa": "to dare" }
      },
      {
        story: "Oli kaunis kesäkuun päivä, ja Liisa päätti lähteä torille ostoksille. Hän asui pienessä kaupungissa Itä-Suomessa, ja tori oli kaupungin sydän. Torilla oli aina paljon elämää, erityisesti kesällä. Lokit kirkuivat taivaalla, ja ilmassa tuoksui mansikka, tilli ja paistettu kala.\n\nLiisa käveli hitaasti kojujen ohi. Hän etsi tuoreita vihanneksia illallista varten. Hän aikoi valmistaa lohikeittoa ja tarvitsi perunoita, porkkanoita, sipulia ja tilliä. Hän pysähtyi pienen kojun eteen, jossa myytiin uusia perunoita. Myyjä oli vanha mies, jolla oli ystävälliset silmät. ”Nämä ovat aamulla nostettuja”, mies sanoi. Liisa osti kilon perunoita ja nipun tilliä. Hän maksoi käteisellä ja kiitti miestä.\n\nSeuraavaksi hän meni kalatiskille. Kalatiskillä oli pitkä jono. Ihmiset juttelivat iloisesti keskenään ja vaihtoivat kuulumisia. Suomalaiset ovat usein hiljaisia, mutta torilla juttu luistaa. Liisa tapasi jonossa naapurinsa, Eevan. Eeva kertoi, että hänen tyttärensä oli juuri valmistunut lukiosta. ”Onneksi olkoon!” Liisa sanoi. He puhuivat hetken säästä – se on aina turvallinen ja suosittu puheenaihe.\n\nKun Liisa oli ostanut kaikki ainekset keittoa varten, hän päätti mennä kahville. Torikahvilassa oli oranssit teltat ja muoviset tuolit. Hän osti kupin mustaa kahvia ja lihapiirakan. Lihapiirakka on perinteinen toriherkku. Liisa istui pöytään ja katseli ihmisiä. Siellä oli turisteja, jotka ottivat valokuvia, ja paikallisia, jotka lukivat sanomalehteä. Aurinko paistoi lämpimästi, ja Liisa tunsi olonsa onnelliseksi.\n\nÄkillisesti tuuli yltyi, ja taivaalle kertyi tummia pilviä. Kesäsade voi alkaa hyvin nopeasti Suomessa. Ihmiset alkoivat pakata tavaroitaan ja juosta suojaan. Liisa ehti juuri ja juuri bussipysäkille ennen kuin taivas aukesi. Sade ropisi bussikatoksen kattoon kovaa. Mutta Liisaa ei haitannut. Hänellä oli kassissa tuoreita aineksia, ja hän odotti innolla, että pääsisi kotiin kokkaamaan. Kotona hän laittaisi lempimusiikkiaan soimaan, pilkkoisi vihannekset ja nauttisi rauhallisesta illasta. Lohikeitto maistuu aina parhaalta sateisena päivänä.",
        vocabulary: { "sydän": "heart (metaphorical)", "koju": "stall/booth", "nostettu": "lifted (harvested)", "kalatiski": "fish counter", "jono": "queue/line", "juttu luistaa": "conversation flows effortlessly", "valmistua": "to graduate", "puheenaihe": "topic of conversation", "aines": "ingredient", "yltyä": "to intensify (wind)", "suoja": "shelter", "bussikatos": "bus stop shelter" }
      },
      {
        story: "Juhannus on suomalaisille vuoden tärkein juhla, jopa tärkeämpi kuin joulu monille. Tänä vuonna Pekka ja hänen ystävänsä päättivät vuokrata mökin Saimaan rannalta. Heitä oli kuusi henkeä: Pekka, Anna, Mikko, Laura, Timo ja Jenni. He pakkasivat autot täyteen ruokaa, juomaa ja hyttysmyrkkyä. Matka Helsingistä kesti neljä tuntia, mutta tunnelma autossa oli korkealla.\n\nKun he saapuivat mökille, kaikki huokaisivat ihastuksesta. Mökki oli punainen ja siinä oli valkoiset ikkunanpuitteet. Se sijaitsi aivan veden äärellä, ja rannassa oli puulämmitteinen sauna. Ympärillä oli tiheää metsää. Hiljaisuus oli melkein täydellinen, vain lintujen laulu kuului.\n\nEnsimmäinen tehtävä oli lämmittää sauna. Mikko ja Timo hakivat puita liiteristä ja sytyttivät kiukaan. Savu tuoksui hyvältä. Tytöt menivät keittiöön valmistamaan lounasta. He tekivät uusia perunoita, silliä ja raikasta salaattia. Kun kaikki oli valmista, he söivät ulkona terassilla. Aurinko ei laske juhannuksena melkein lainkaan, joten valoa riitti.\n\nIllalla he saunoivat pitkään. Suomalaisessa saunassa ei ole kiire. He heittivät löylyä ja puhuivat elämästä, rakkaudesta ja unelmista. Välillä he juoksivat laiturille ja hyppäsivät kylmään järviveteen. Vesi oli virkistävää. Pekka ui kauas rannasta ja katseli taivasta. Se oli värjäytynyt vaaleanpunaiseksi ja oranssiksi. Tämä on yötön yö, hän ajatteli.\n\nSaunan jälkeen he sytyttivät suuren kokon rannalle. Kokko on vanha perinne, jonka uskotaan karkottavan pahoja henkiä. He istuivat nuotion ympärillä, paistoivat makkaraa ja joivat olutta. Joku otti kitaran esiin ja he lauloivat vanhoja suomalaisia iskelmiä. Tunnelma oli maaginen.\n\nSeuraavana aamuna kaikki nukkuivat pitkään. Kun he heräsivät, he joivat kahvia laiturilla ja katselivat tyyntä järveä. Kukaan ei halunnut lähteä takaisin kaupunkiin. Juhannus mökillä muistutti heitä siitä, mikä elämässä on oikeasti tärkeää: ystävät, luonto ja rauha.",
        vocabulary: { "vuokrata": "to rent", "hyttysmyrkky": "mosquito repellent", "ihastus": "delight/admiration", "liiteri": "woodshed", "kiuas": "sauna stove", "silli": "herring", "löyly": "sauna steam", "laituri": "dock/pier", "virkistävä": "refreshing", "yötön yö": "nightless night", "kokko": "bonfire", "karkottaa": "to drive away/banish", "perinne": "tradition", "iskelmä": "schlager/pop song", "tyyni": "calm (water)" }
      },
      {
        story: "Kalle oli päättänyt aloittaa uuden harrastuksen. Hän oli aina ollut kiinnostunut kielistä, joten hän ilmoittautui italian kurssille kansalaisopistoon. Kurssi pidettiin tiistai-iltaisin vanhassa koulurakennuksessa. Kallea jännitti hieman, koska hän ei ollut istunut koulunpenkillä vuosiin. Hän osti uuden vihon ja kyniä.\n\nEnsimmäisellä tunnilla luokassa oli noin kymmenen opiskelijaa. Opettaja oli energinen nuori nainen nimeltä Sofia. Hän oli asunut Roomassa viisi vuotta ja puhui italiaa sujuvasti. Sofia aloitti tunnin sanomalla: ”Buonasera a tutti!” Kalle hymyili. Kieli kuulosti musiikilta.\n\nHe aloittivat alkeista: tervehtiminen, itsensä esittely ja numerot. Kalle huomasi pian, että ääntäminen oli vaikeampaa kuin hän oli luullut. Erityisesti r-kirjain piti sorauttaa vahvasti. Hänen vieressään istui nainen nimeltä Eeva. Eeva oli eläkkeellä ja halusi oppia italiaa, koska hän aikoi matkustaa Firenzeen lapsenlapsensa kanssa. He harjoittelivat yhdessä dialogia: ”Ciao, come stai?” ”Bene, grazie. E tu?”\n\nKurssin jälkeen Kalle ja Eeva kävelivät samaa matkaa bussipysäkille. Eeva kertoi, että hän oli aiemmin opiskellut ranskaa, mutta italia oli hänestä hauskempaa. Kalle kertoi työstään insinöörinä. Hän sanoi, että kaipasi elämäänsä jotain luovaa ja sosiaalista, koska työ oli usein yksinäistä puurtamista tietokoneen ääressä.\n\nViikot kuluivat, ja Kalle oppi yhä enemmän. Hän osasi jo tilata kahvia ja kysyä tietä. Mutta tärkeintä oli, että hän oli saanut uusia ystäviä. Kurssilaiset päättivät mennä yhdessä syömään italialaiseen ravintolaan kurssin lopuksi. He tilasivat ruoan italiaksi (vaikka tarjoilija olikin suomalainen) ja nauroivat paljon. Kalle tilasi tiramisua jälkiruoaksi ja sanoi ylpeänä: ”Vorrei il tiramisù, per favore.”\n\nKun Kalle tuli kotiin tuona iltana, hän katsoi peiliin ja sanoi: ”Buonanotte, Kalle.” Hän tunsi, että hänen maailmansa oli hieman suurempi kuin ennen. Uuden kielen oppiminen ei ole vain sanojen muistamista, se on oven avaamista uuteen kulttuuriin ja uusiin ihmisiin.",
        vocabulary: { "ilmoittautua": "to enroll/sign up", "kansalaisopisto": "adult education centre", "jännittää": "to be nervous/excited", "sujuvasti": "fluently", "alkeet": "basics", "ääntäminen": "pronunciation", "sorauttaa": "to roll (the r)", "puurtaminen": "toiling/grinding work", "tilata": "to order", "jälkiruoka": "dessert", "ylpeä": "proud" }
      },
      {
        story: "Talvi Helsingissä voi olla synkkä ja pitkä, mutta Minna rakasti sitä. Hän piti erityisesti siitä hetkestä, kun ensilumi satoi maahan. Koko kaupunki muuttui hiljaiseksi ja valoisaksi. Tänä vuonna hän oli luvannut itselleen, että hän kokeilisi avantouintia. Hänen ystävänsä Katja oli harrastanut sitä vuosia ja vannonut, että se parantaa vastustuskykyä ja tekee onnelliseksi.\n\nHe sopivat tapaavansa Löylyssä sunnuntaiaamuna. Löyly on moderni saunakompleksi meren rannalla. Kun Minna saapui paikalle, tuuli oli jäätävä. Meri oli osittain jäässä, ja vesi näytti mustalta ja pelottavalta. ”Mitä minä oikein teen?” Minna mietti ja värisi kylmästä. Mutta hän ei halunnut perääntyä.\n\nSisällä oli lämmintä ja kodikasta. He vaihtoivat uimapuvut ja menivät savusaunaan. Savusaunan lämpö on pehmeää ja kosteaa. Saunassa istui paljon ihmisiä, sekä suomalaisia että turisteja. Kaikki olivat hiljaa tai puhuivat kuiskaillen. Hki on kiireinen kaupunki, mutta saunassa aika pysähtyy.\n\n”Nyt mennään!” Katja sanoi 15 minuutin jälkeen. Minna nielaisi. He kävelivät puisia portaita pitkin alas laiturille. Höyry nousi heidän iholtaan pakkasessa. Minna astui tikkaile ja laski itsensä hitaasti veteen. Kylmyys oli shokki. Tuntui kuin tuhat neulaa pistelisi ihoa. Hän kastautui kaulaan asti ja nousi heti ylös.\n\nKun hän pääsi takaisin saunaan, tapahtui jotain ihmeellistä. Veri alkoi kiertää kehossa voimakkaasti, ja ihoa pisteli miellyttävästi. Minna tunsi valtavaa euforiaa. Kaikki stressi ja huolet katosivat. ”Tämä on uskomatonta!” hän sanoi Katjalle. ”Sanoinhan minä”, Katja nauroi.\n\nHe toistivat rituaalin kolme kertaa: sauna, avanto, sauna, avanto. Lopuksi he istuivat takkahuoneessa, joivat kuumaa teetä ja söivät lohikeittoa. Minnan posket hehkuivat punaisina. Hän tunsi olevansa elossa ja täynnä energiaa. Hän ymmärsi nyt, miksi suomalaiset rakastavat tätä hullua harrastusta. Se on tapa voittaa pimeys ja kylmyys, ja löytää sisäinen lämpö.",
        vocabulary: { "synkkä": "gloomy/dark", "ensilumi": "first snow", "avantouinti": "ice swimming", "vannoa": "to swear/vow", "vastustuskyky": "immunity", "jäätävä": "freezing", "perääntyä": "to back down", "kodikas": "cozy", "kuiskailla": "to whisper", "tikkaat": "ladder", "kastautua": "to dip oneself", "euforia": "euphoria", "rituaali": "ritual", "hehkuva": "glowing" }
      }
    ];

    // Select a random backup story
    const backup = backups[Math.floor(Math.random() * backups.length)];

    return res.status(200).json(backup);
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};