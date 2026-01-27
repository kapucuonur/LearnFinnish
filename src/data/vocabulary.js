export const VOCABULARY_CATEGORIES = [
    {
        id: 'top_nouns',
        title: 'Top nouns',
        icon: '🌃',
        description: 'Most common nouns in Finnish',
        words: [
            { word: 'Asia', translation: 'Thing / Matter', example: 'Tämä ei ole vakava asia.', exampleTranslation: 'This is not a serious matter.' },
            { word: 'Aika', translation: 'Time', example: 'Minulla ei ole aikaa.', exampleTranslation: 'I do not have time.' },
            { word: 'Ihminen', translation: 'Human', example: 'Jokainen ihminen on tärkeä.', exampleTranslation: 'Every human is important.' },
            { word: 'Vuosi', translation: 'Year', example: 'Hyvää uutta vuotta!', exampleTranslation: 'Happy New Year!' },
            { word: 'Päivä', translation: 'Day', example: 'Tänään on kaunis päivä.', exampleTranslation: 'Today is a beautiful day.' },
            { word: 'Elämä', translation: 'Life', example: 'Elämä on ihanaa.', exampleTranslation: 'Life is wonderful.' },
            { word: 'Ystävä', translation: 'Friend', example: 'Hän on paras ystäväni.', exampleTranslation: 'He/She is my best friend.' },
            { word: 'Koti', translation: 'Home', example: 'Viihdyn hyvin kotona.', exampleTranslation: 'I enjoy being at home.' },
            { word: 'Koulu', translation: 'School', example: 'Lapset menevät kouluun.', exampleTranslation: 'The children go to school.' },
            { word: 'Työ', translation: 'Work', example: 'Työ alkaa kello kahdeksan.', exampleTranslation: 'Work starts at eight o\'clock.' }
        ]
    },
    {
        id: 'top_verbs',
        title: 'Top verbs',
        icon: '🏃',
        description: 'Essential verbs for communication',
        words: [
            { word: 'Olla', translation: 'To be', example: 'Minä olen suomalainen.', exampleTranslation: 'I am Finnish.' },
            { word: 'Tulla', translation: 'To come', example: 'Milloin sinä tulet kotiin?', exampleTranslation: 'When are you coming home?' },
            { word: 'Mennä', translation: 'To go', example: 'Me menemme elokuviin.', exampleTranslation: 'We are going to the movies.' },
            { word: 'Tehdä', translation: 'To do / make', example: 'Mitä sinä teet?', exampleTranslation: 'What are you doing?' },
            { word: 'Nähdä', translation: 'To see', example: 'Nähdään huomenna!', exampleTranslation: 'See you tomorrow!' },
            { word: 'Sanoa', translation: 'To say', example: 'Mitä hän sanoi?', exampleTranslation: 'What did he/she say?' },
            { word: 'Tietää', translation: 'To know', example: 'En tiedä vastausta.', exampleTranslation: 'I do not know the answer.' },
            { word: 'Haluta', translation: 'To want', example: 'Haluaisin kahvia.', exampleTranslation: 'I would like some coffee.' },
            { word: 'Voida', translation: 'To be able to', example: 'Voitko auttaa minua?', exampleTranslation: 'Can you help me?' },
            { word: 'Antaa', translation: 'To give', example: 'Voitko antaa minulle kynän?', exampleTranslation: 'Can you give me a pen?' }
        ]
    },
    {
        id: 'top_adjectives',
        title: 'Top adjectives',
        icon: '😍',
        description: 'Describing the world around you',
        words: [
            { word: 'Hyvä', translation: 'Good', example: 'Tämä on hyvä idea.', exampleTranslation: 'This is a good idea.' },
            { word: 'Uusi', translation: 'New', example: 'Ostin uuden auton.', exampleTranslation: 'I bought a new car.' },
            { word: 'Pieni', translation: 'Small', example: 'Asun pienessä asunnossa.', exampleTranslation: 'I live in a small apartment.' },
            { word: 'Suuri', translation: 'Large', example: 'Helsinki on suuri kaupunki.', exampleTranslation: 'Helsinki is a large city.' },
            { word: 'Kaunis', translation: 'Beautiful', example: 'Sinulla on kaunis hymy.', exampleTranslation: 'You have a beautiful smile.' },
            { word: 'Vanha', translation: 'Old', example: 'Tämä talo on hyvin vanha.', exampleTranslation: 'This house is very old.' },
            { word: 'Pitkä', translation: 'Long', example: 'Matka oli pitkä.', exampleTranslation: 'The journey was long.' },
            { word: 'Nuori', translation: 'Young', example: 'Hän on vielä nuori.', exampleTranslation: 'He/She is still young.' },
            { word: 'Tärkeä', translation: 'Important', example: 'Tämä on tärkeä asia.', exampleTranslation: 'This is an important matter.' },
            { word: 'Helppo', translation: 'Easy', example: 'Suomen kieli ei ole helppoa.', exampleTranslation: 'The Finnish language is not easy.' }
        ]
    },
    {
        id: 'food_drink',
        title: 'Food & Drink',
        icon: '🥘',
        description: 'Culinary vocabulary',
        words: [
            { word: 'Ruoka', translation: 'Food', example: 'Ruoka on valmista.', exampleTranslation: 'The food is ready.' },
            { word: 'Vesi', translation: 'Water', example: 'Haluaisin lasin vettä.', exampleTranslation: 'I would like a glass of water.' },
            { word: 'Leipä', translation: 'Bread', example: 'Syön leipää aamiaisella.', exampleTranslation: 'I eat bread for breakfast.' },
            { word: 'Kahvi', translation: 'Coffee', example: 'Juon kahvia joka aamu.', exampleTranslation: 'I drink coffee every morning.' },
            { word: 'Maito', translation: 'Milk', example: 'Maito on jääkaapissa.', exampleTranslation: 'The milk is in the fridge.' },
            { word: 'Liha', translation: 'Meat', example: 'En syö lihaa.', exampleTranslation: 'I do not eat meat.' },
            { word: 'Kala', translation: 'Fish', example: 'Lohi on hyvää kalaa.', exampleTranslation: 'Salmon is good fish.' },
            { word: 'Hedelmä', translation: 'Fruit', example: 'Syön paljon hedelmiä.', exampleTranslation: 'I eat a lot of fruits.' },
            { word: 'Vihannes', translation: 'Vegetable', example: 'Porkkana on vihannes.', exampleTranslation: 'Carrot is a vegetable.' },
            { word: 'Ravintola', translation: 'Restaurant', example: 'Mennäänkö ravintolaan?', exampleTranslation: 'Shall we go to a restaurant?' }
        ]
    },
    {
        id: 'animals',
        title: 'Animals',
        icon: '🐕',
        description: 'Common animals',
        words: [
            { word: 'Koira', translation: 'Dog', example: 'Koira haukkuu.', exampleTranslation: 'The dog is barking.' },
            { word: 'Kissa', translation: 'Cat', example: 'Kissa nukkuu sohvalla.', exampleTranslation: 'The cat is sleeping on the sofa.' },
            { word: 'Lintu', translation: 'Bird', example: 'Lintu laulaa puussa.', exampleTranslation: 'The bird is singing in the tree.' },
            { word: 'Hevonen', translation: 'Horse', example: 'Hevonen juoksee pellolla.', exampleTranslation: 'The horse is running in the field.' },
            { word: 'Lehmä', translation: 'Cow', example: 'Lehmä antaa maitoa.', exampleTranslation: 'The cow gives milk.' },
            { word: 'Sika', translation: 'Pig', example: 'Sika on vaaleanpunainen.', exampleTranslation: 'The pig is pink.' },
            { word: 'Karhu', translation: 'Bear', example: 'Karhu nukkuu talviunta.', exampleTranslation: 'The bear is hibernating.' },
            { word: 'Hirvi', translation: 'Moose', example: 'Näin hirven metsässä.', exampleTranslation: 'I saw a moose in the forest.' },
            { word: 'Kala', translation: 'Fish', example: 'Kala ui vedessä.', exampleTranslation: 'The fish swims in the water.' },
            { word: 'Hyönteinen', translation: 'Insect', example: 'Hyttynen on ärsyttävä hyönteinen.', exampleTranslation: 'The mosquito is an annoying insect.' }
        ]
    },
    {
        id: 'nature',
        title: 'Nature',
        icon: '🌳',
        description: 'Outdoors and environment',
        words: [
            { word: 'Metsä', translation: 'Forest', example: 'Suomessa on paljon metsää.', exampleTranslation: 'There is a lot of forest in Finland.' },
            { word: 'Järvi', translation: 'Lake', example: 'Järvi on jäässä.', exampleTranslation: 'The lake is frozen.' },
            { word: 'Meri', translation: 'Sea', example: 'Meri on sininen.', exampleTranslation: 'The sea is blue.' },
            { word: 'Joki', translation: 'River', example: 'Joki virtaa nopeasti.', exampleTranslation: 'The river flows fast.' },
            { word: 'Vuori', translation: 'Mountain', example: 'Kiipeämme vuorelle.', exampleTranslation: 'We are climbing the mountain.' },
            { word: 'Aurinko', translation: 'Sun', example: 'Aurinko paistaa tänään.', exampleTranslation: 'The sun is shining today.' },
            { word: 'Kuu', translation: 'Moon', example: 'Kuu loistaa yöllä.', exampleTranslation: 'The moon shines at night.' },
            { word: 'Kukka', translation: 'Flower', example: 'Tämä kukka tuoksuu hyvältä.', exampleTranslation: 'This flower smells good.' },
            { word: 'Puu', translation: 'Tree', example: 'Tuo on vanha puu.', exampleTranslation: 'That is an old tree.' },
            { word: 'Sade', translation: 'Rain', example: 'Sade kastelee maan.', exampleTranslation: 'The rain wets the ground.' }
        ]
    },
    {
        id: 'body_health',
        title: 'Body & Health',
        icon: '🩺',
        description: 'Anatomy and health',
        words: [
            { word: 'Pää', translation: 'Head', example: 'Päähän sattuu.', exampleTranslation: 'My head hurts.' },
            { word: 'Käsi', translation: 'Hand / Arm', example: 'Pese kätesi.', exampleTranslation: 'Wash your hands.' },
            { word: 'Jalka', translation: 'Leg / Foot', example: 'Jalkani on kipeä.', exampleTranslation: 'My leg is sore.' },
            { word: 'Silmä', translation: 'Eye', example: 'Hänellä on siniset silmät.', exampleTranslation: 'He/She has blue eyes.' },
            { word: 'Korva', translation: 'Ear', example: 'Kuuletko korvillasi?', exampleTranslation: 'Can you hear with your ears?' },
            { word: 'Sydän', translation: 'Heart', example: 'Sydän lyö nopeasti.', exampleTranslation: 'The heart beats fast.' },
            { word: 'Vatsa', translation: 'Stomach', example: 'Minulla on nälkä.', exampleTranslation: 'I am hungry. (Lit: I have hunger)' },
            { word: 'Sairas', translation: 'Sick', example: 'Olen tänään sairas.', exampleTranslation: 'I am sick today.' },
            { word: 'Terve', translation: 'Healthy', example: 'Syö terveellisesti.', exampleTranslation: 'Eat healthily.' },
            { word: 'Lääkäri', translation: 'Doctor', example: 'Lääkäri määräsi lääkettä.', exampleTranslation: 'The doctor prescribed medicine.' }
        ]
    },
    {
        id: 'clothes',
        title: 'Clothes',
        icon: '👕',
        description: 'Clothing items',
        words: [
            { word: 'Paita', translation: 'Shirt', example: 'Paita on likainen.', exampleTranslation: 'The shirt is dirty.' },
            { word: 'Housut', translation: 'Pants', example: 'Nämä housut ovat liian isot.', exampleTranslation: 'These pants are too big.' },
            { word: 'Mekko', translation: 'Dress', example: 'Hänellä on kaunis mekko.', exampleTranslation: 'She has a beautiful dress.' },
            { word: 'Kengät', translation: 'Shoes', example: 'Otan kengät pois.', exampleTranslation: 'I take off words.' },
            { word: 'Takki', translation: 'Jacket', example: 'Laita takki päälle.', exampleTranslation: 'Put the jacket on.' },
            { word: 'Hattu', translation: 'Hat', example: 'Hattu suojaa auringolta.', exampleTranslation: 'The hat protects from the sun.' },
            { word: 'Sukat', translation: 'Socks', example: 'Sukat ovat lattialla.', exampleTranslation: 'The socks are on the floor.' },
            { word: 'Huivi', translation: 'Scarf', example: 'Talvella tarvitaan huivi.', exampleTranslation: 'A scarf is needed in winter.' },
            { word: 'Käsineet', translation: 'Gloves', example: 'Käsineet pitävät kädet lämpiminä.', exampleTranslation: 'Gloves keep hands warm.' },
            { word: 'Vyö', translation: 'Belt', example: 'Vyö on nahkaa.', exampleTranslation: 'The belt is made of leather.' }
        ]
    },
    {
        id: 'technology',
        title: 'Technology',
        icon: '💻',
        description: 'Modern tech terms',
        words: [
            { word: 'Tietokone', translation: 'Computer', example: 'Käytän tietokonetta työssä.', exampleTranslation: 'I use a computer at work.' },
            { word: 'Puhelin', translation: 'Phone', example: 'Puhelin soi.', exampleTranslation: 'The phone is ringing.' },
            { word: 'Internetti', translation: 'Internet', example: 'Internetti on hidas.', exampleTranslation: 'The internet is slow.' },
            { word: 'Sovellus', translation: 'Application', example: 'Tämä on hyödyllinen sovellus.', exampleTranslation: 'This is a useful application.' },
            { word: 'Näyttö', translation: 'Screen', example: 'Näyttö on rikki.', exampleTranslation: 'The screen is broken.' },
            { word: 'Hiiri', translation: 'Mouse', example: 'Hiiri ei toimi.', exampleTranslation: 'The mouse is not working.' },
            { word: 'Näppäimistö', translation: 'Keyboard', example: 'Kirjoitan näppäimistöllä.', exampleTranslation: 'I write with the keyboard.' },
            { word: 'Sähköposti', translation: 'Email', example: 'Lähetin sinulle sähköpostia.', exampleTranslation: 'I sent you an email.' },
            { word: 'Salasana', translation: 'Password', example: 'Unohdin salasanani.', exampleTranslation: 'I forgot my password.' },
            { word: 'Verkko', translation: 'Network', example: 'Verkko ei löydy.', exampleTranslation: 'The network is not found.' }
        ]
    },
    {
        id: 'time',
        title: 'Time',
        icon: '⏰',
        description: 'Time expression',
        words: [
            { word: 'Aamu', translation: 'Morning', example: 'Hyvää huomenta!', exampleTranslation: 'Good morning!' },
            { word: 'Ilta', translation: 'Evening', example: 'Illalla katson televisiota.', exampleTranslation: 'In the evening I watch TV.' },
            { word: 'Yö', translation: 'Night', example: 'Yöllä on pimeää.', exampleTranslation: 'It is dark at night.' },
            { word: 'Tunti', translation: 'Hour', example: 'Juna myöhästyi tunnin.', exampleTranslation: 'The train was late for an hour.' },
            { word: 'Minuutti', translation: 'Minute', example: 'Odota hetki, vain minuutti.', exampleTranslation: 'Wait a moment, just a minute.' },
            { word: 'Viikko', translation: 'Week', example: 'Viikossa on seitsemän päivää.', exampleTranslation: 'There are seven days in a week.' },
            { word: 'Kuukausi', translation: 'Month', example: 'Toukokuu on kaunis kuukausi.', exampleTranslation: 'May is a beautiful month.' },
            { word: 'Tänään', translation: 'Today', example: 'Mitä teemme tänään?', exampleTranslation: 'What are we doing today?' },
            { word: 'Huomenna', translation: 'Tomorrow', example: 'Huomenna on vapaapäivä.', exampleTranslation: 'Tomorrow is a day off.' },
            { word: 'Eilen', translation: 'Yesterday', example: 'Eilen satoi vettä.', exampleTranslation: 'Yesterday it rained.' }
        ]
    },
    {
        id: 'work_study',
        title: 'Work & Study',
        icon: '📖',
        description: 'Office and school terms',
        words: [
            { word: 'Opiskella', translation: 'To study', example: 'Opiskelen suomea.', exampleTranslation: 'I am studying Finnish.' },
            { word: 'Oppia', translation: 'To learn', example: 'Haluan oppia uusia asioita.', exampleTranslation: 'I want to learn new things.' },
            { word: 'Kokous', translation: 'Meeting', example: 'Kokous alkaa pian.', exampleTranslation: 'The meeting starts soon.' },
            { word: 'Projekti', translation: 'Project', example: 'Projekti on valmis.', exampleTranslation: 'The project is ready.' },
            { word: 'Toimisto', translation: 'Office', example: 'Toimisto on keskustassa.', exampleTranslation: 'The office is in the center.' },
            { word: 'Kirjasto', translation: 'Library', example: 'Lainaan kirjan kirjastosta.', exampleTranslation: 'I borrow a book from the library.' },
            { word: 'Tentti', translation: 'Exam', example: 'Minulla on huomenna tentti.', exampleTranslation: 'I have an exam tomorrow.' },
            { word: 'Tauko', translation: 'Break', example: 'Pidetään tauko.', exampleTranslation: 'Let\'s have a break.' },
            { word: 'Palkka', translation: 'Salary', example: 'Milloin palkka maksetaan?', exampleTranslation: 'When is the salary paid?' },
            { word: 'Johtaja', translation: 'Manager', example: 'Hän on meidän johtaja.', exampleTranslation: 'He/She is our manager.' }
        ]
    },
    {
        id: 'home_family',
        title: 'Home & Family',
        icon: '👨‍👩‍👧',
        description: 'Household and relations',
        words: [
            { word: 'Perhe', translation: 'Family', example: 'Perheeni on iso.', exampleTranslation: 'My family is big.' },
            { word: 'Äiti', translation: 'Mother', example: 'Äiti tekee ruokaa.', exampleTranslation: 'Mother is cooking.' },
            { word: 'Isä', translation: 'Father', example: 'Isä on töissä.', exampleTranslation: 'Father is at work.' },
            { word: 'Lapsi', translation: 'Child', example: 'Lapsi leikkii pihalla.', exampleTranslation: 'The child plays in the yard.' },
            { word: 'Talo', translation: 'House', example: 'Asumme omakotitalossa.', exampleTranslation: 'We live in a detached house.' },
            { word: 'Huone', translation: 'Room', example: 'Tämä on minun huoneeni.', exampleTranslation: 'This is my room.' },
            { word: 'Keittiö', translation: 'Kitchen', example: 'Keittiö on siisti.', exampleTranslation: 'The kitchen is clean.' },
            { word: 'Olohuone', translation: 'Living room', example: 'Katsomme televisiota olohuoneessa.', exampleTranslation: 'We watch TV in the living room.' },
            { word: 'Sänky', translation: 'Bed', example: 'Sänky on mukava.', exampleTranslation: 'The bed is comfortable.' },
            { word: 'Ovi', translation: 'Door', example: 'Voitko avata oven?', exampleTranslation: 'Can you open the door?' }
        ]
    }
];
