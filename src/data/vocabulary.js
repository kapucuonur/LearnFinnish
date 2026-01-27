export const VOCABULARY_CATEGORIES = [
    {
        id: 'top_nouns',
        title: 'Top nouns',
        icon: '🌃',
        description: 'Most common nouns in Finnish',
        words: [
            { word: 'Asia', translation: 'Thing / Matter' },
            { word: 'Aika', translation: 'Time' },
            { word: 'Ihminen', translation: 'Human' },
            { word: 'Vuosi', translation: 'Year' },
            { word: 'Päivä', translation: 'Day' },
            { word: 'Elämä', translation: 'Life' },
            { word: 'Ystävä', translation: 'Friend' },
            { word: 'Koti', translation: 'Home' },
            { word: 'Koulu', translation: 'School' },
            { word: 'Työ', translation: 'Work' }
        ]
    },
    {
        id: 'top_verbs',
        title: 'Top verbs',
        icon: '🏃',
        description: 'Essential verbs for communication',
        words: [
            { word: 'Olla', translation: 'To be' },
            { word: 'Tulla', translation: 'To come' },
            { word: 'Mennä', translation: 'To go' },
            { word: 'Tehdä', translation: 'To do / make' },
            { word: 'Nähdä', translation: 'To see' },
            { word: 'Sanoa', translation: 'To say' },
            { word: 'Tietää', translation: 'To know' },
            { word: 'Haluta', translation: 'To want' },
            { word: 'Voida', translation: 'To be able to' },
            { word: 'Antaa', translation: 'To give' }
        ]
    },
    {
        id: 'top_adjectives',
        title: 'Top adjectives',
        icon: '😍',
        description: 'Describing the world around you',
        words: [
            { word: 'Hyvä', translation: 'Good' },
            { word: 'Uusi', translation: 'New' },
            { word: 'Pieni', translation: 'Small' },
            { word: 'Suuri', translation: 'Large' },
            { word: 'Kaunis', translation: 'Beautiful' },
            { word: 'Vanha', translation: 'Old' },
            { word: 'Pitkä', translation: 'Long' },
            { word: 'Nuori', translation: 'Young' },
            { word: 'Tärkeä', translation: 'Important' },
            { word: 'Helppo', translation: 'Easy' }
        ]
    },
    {
        id: 'food_drink',
        title: 'Food & Drink',
        icon: '🥘',
        description: 'Culinary vocabulary',
        words: [
            { word: 'Ruoka', translation: 'Food' },
            { word: 'Vesi', translation: 'Water' },
            { word: 'Leipä', translation: 'Bread' },
            { word: 'Kahvi', translation: 'Coffee' },
            { word: 'Maito', translation: 'Milk' },
            { word: 'Liha', translation: 'Meat' },
            { word: 'Kala', translation: 'Fish' },
            { word: 'Hedelmä', translation: 'Fruit' },
            { word: 'Vihannes', translation: 'Vegetable' },
            { word: 'Ravintola', translation: 'Restaurant' }
        ]
    },
    {
        id: 'animals',
        title: 'Animals',
        icon: '🐕',
        description: 'Common animals',
        words: [
            { word: 'Koira', translation: 'Dog' },
            { word: 'Kissa', translation: 'Cat' },
            { word: 'Lintu', translation: 'Bird' },
            { word: 'Hevonen', translation: 'Horse' },
            { word: 'Lehmä', translation: 'Cow' },
            { word: 'Sika', translation: 'Pig' },
            { word: 'Karhu', translation: 'Bear' },
            { word: 'Hirvi', translation: 'Moose' },
            { word: 'Kala', translation: 'Fish' },
            { word: 'Hyönteinen', translation: 'Insect' }
        ]
    },
    {
        id: 'nature',
        title: 'Nature',
        icon: '🌳',
        description: 'Outdoors and environment',
        words: [
            { word: 'Metsä', translation: 'Forest' },
            { word: 'Järvi', translation: 'Lake' },
            { word: 'Meri', translation: 'Sea' },
            { word: 'Joki', translation: 'River' },
            { word: 'Vuori', translation: 'Mountain' },
            { word: 'Aurinko', translation: 'Sun' },
            { word: 'Kuu', translation: 'Moon' },
            { word: 'Kukka', translation: 'Flower' },
            { word: 'Puu', translation: 'Tree' },
            { word: 'Sade', translation: 'Rain' }
        ]
    },
    {
        id: 'body_health',
        title: 'Body & Health',
        icon: '🩺',
        description: 'Anatomy and health',
        words: [
            { word: 'Pää', translation: 'Head' },
            { word: 'Käsi', translation: 'Hand / Arm' },
            { word: 'Jalka', translation: 'Leg / Foot' },
            { word: 'Silmä', translation: 'Eye' },
            { word: 'Korva', translation: 'Ear' },
            { word: 'Sydän', translation: 'Heart' },
            { word: 'Vatsa', translation: 'Stomach' },
            { word: 'Sairas', translation: 'Sick' },
            { word: 'Terve', translation: 'Healthy' },
            { word: 'Lääkäri', translation: 'Doctor' }
        ]
    },
    {
        id: 'clothes',
        title: 'Clothes',
        icon: '👕',
        description: 'Clothing items',
        words: [
            { word: 'Paita', translation: 'Shirt' },
            { word: 'Housut', translation: 'Pants' },
            { word: 'Mekko', translation: 'Dress' },
            { word: 'Kengät', translation: 'Shoes' },
            { word: 'Takki', translation: 'Jacket' },
            { word: 'Hattu', translation: 'Hat' },
            { word: 'Sukat', translation: 'Socks' },
            { word: 'Huivi', translation: 'Scarf' },
            { word: 'Käsineet', translation: 'Gloves' },
            { word: 'Vyö', translation: 'Belt' }
        ]
    },
    {
        id: 'technology',
        title: 'Technology',
        icon: '💻',
        description: 'Modern tech terms',
        words: [
            { word: 'Tietokone', translation: 'Computer' },
            { word: 'Puhelin', translation: 'Phone' },
            { word: 'Internetti', translation: 'Internet' },
            { word: 'Sovellus', translation: 'Application' },
            { word: 'Näyttö', translation: 'Screen' },
            { word: 'Hiiri', translation: 'Mouse' },
            { word: 'Näppäimistö', translation: 'Keyboard' },
            { word: 'Sähköposti', translation: 'Email' },
            { word: 'Salasana', translation: 'Password' },
            { word: 'Verkko', translation: 'Network' }
        ]
    },
    {
        id: 'time',
        title: 'Time',
        icon: '⏰',
        description: 'Time expression',
        words: [
            { word: 'Aamu', translation: 'Morning' },
            { word: 'Ilta', translation: 'Evening' },
            { word: 'Yö', translation: 'Night' },
            { word: 'Tunti', translation: 'Hour' },
            { word: 'Minuutti', translation: 'Minute' },
            { word: 'Viikko', translation: 'Week' },
            { word: 'Kuukausi', translation: 'Month' },
            { word: 'Tänään', translation: 'Today' },
            { word: 'Huomenna', translation: 'Tomorrow' },
            { word: 'Eilen', translation: 'Yesterday' }
        ]
    },
    {
        id: 'work_study',
        title: 'Work & Study',
        icon: '📖',
        description: 'Office and school terms',
        words: [
            { word: 'Opiskella', translation: 'To study' },
            { word: 'Oppia', translation: 'To learn' },
            { word: 'Kokous', translation: 'Meeting' },
            { word: 'Projekti', translation: 'Project' },
            { word: 'Toimisto', translation: 'Office' },
            { word: 'Kirjasto', translation: 'Library' },
            { word: 'Tentti', translation: 'Exam' },
            { word: 'Tauko', translation: 'Break' },
            { word: 'Palkka', translation: 'Salary' },
            { word: 'Johtaja', translation: 'Manager' }
        ]
    },
    {
        id: 'home_family',
        title: 'Home & Family',
        icon: '👨‍👩‍👧',
        description: 'Household and relations',
        words: [
            { word: 'Perhe', translation: 'Family' },
            { word: 'Äiti', translation: 'Mother' },
            { word: 'Isä', translation: 'Father' },
            { word: 'Lapsi', translation: 'Child' },
            { word: 'Talo', translation: 'House' },
            { word: 'Huone', translation: 'Room' },
            { word: 'Keittiö', translation: 'Kitchen' },
            { word: 'Olohuone', translation: 'Living room' },
            { word: 'Sänky', translation: 'Bed' },
            { word: 'Ovi', translation: 'Door' }
        ]
    }
];
