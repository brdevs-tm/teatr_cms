
import { Director, Play, Seat, Ticket } from './types';

// Generate 50 Directors
const generateDirectors = (): Director[] => {
  const names = [
    "Otabek Alimov", "Dilshod Karimov", "Shahnoza Yoqubova", "Jamshid Qodirov", "Malika Rasulova",
    "Sherzod Bekmurodov", "Lola Mamatova", "Bahodir Usmonov", "Sevinch To‘xtayeva", "Javlon Sodiqov",
    "Dilorom Yo‘ldosheva", "Rustam Xolmatov", "Nilufar Tursunova", "Habibullo Sobirov", "Umida Mirzayeva",
    "Anvar Jo'rayev", "Ziyoda Orifova", "Farrux Zokirov", "Munisa Rizaeva", "Sardor Rahimxon",
    "Rayhon G'aniyeva", "Ulug'bek Rahmatullayev", "Shohruhxon Yo'ldoshev", "Shahzoda", "Lola Yo'ldosheva",
    "Ozodbek Nazarbekov", "Yulduz Usmonova", "Sherali Jo'rayev", "Gulsanam Mamazoitova", "Alisher Fayz",
    "Zohirshoh Jo'rayev", "Dildora Niyozova", "O'lmas Olloberganov", "Tohir Sodiqov", "DJ Piligrim",
    "Sevara Nazarxon", "Nasiba Abdullayeva", "Kumush Razzoqova", "G'ulomjon Yoqubov", "Mahmud Namozov",
    "Abdurashid Yo'ldoshev", "Botir Qodirov", "Ravshan Komilov", "Xojiakbar Hamidov", "Ozoda Nursaidova",
    "Jasur Umirov", "Shoxruz Abadiya", "Benom Guruhi", "Ummon Guruhi", "Bojalar Guruhi"
  ];
  return names.map((name, i) => ({
    id: i + 1,
    name,
    tajriba_yili: Math.floor(Math.random() * 30) + 5,
    tugilgan_yili: 1960 + Math.floor(Math.random() * 35)
  }));
};

// Generate 50 Plays
const generatePlays = (directorsCount: number): Play[] => {
  const titles = [
    "Sevgi va Sadoqat", "Qorong‘u tunlar", "Yulduzli kechalar", "O‘tkan kunlar", "Qalb armoni",
    "Ozodlik qo‘shig‘i", "Sirdoshim", "Ko‘z yoshim", "Yurak sirlari", "Sevgi qissasi",
    "Jangchi qalbi", "Ona diyor", "Hayot manzaralari", "Meros", "Orzular sari",
    "Tungi kapalaklar", "Bahor kelganda", "Kuzgi sonata", "Qishki ertak", "Yozgi sarguzasht",
    "Taqdir o'yini", "Baxt manzili", "Armonli dunyo", "Oltin devor", "Temir xotin",
    "Kelinlar qo'zg'oloni", "Parvona", "Maysaraning ishi", "Boy ila xizmatchi", "Alpomish",
    "Go'rog'li", "Layli va Majnun", "Farhod va Shirin", "Tohir va Zuhra", "Hamsa",
    "Boburnoma", "O'tgan kunlar (Yangi)", "Mehrobdan chayon", "Sariq devni minib", "Sukunat",
    "Girdob", "Ufq", "Egosh", "Shum bola", "Oltin vodiy",
    "Qora marvarid", "Oq kema", "Qiyomat", "Sohildagi kema", "Ilhaq"
  ];
  const genres = ["Drama", "Komediya", "Tragediya", "Romantika", "Klassika", "Tarixiy", "Psixologik"];
  return titles.map((title, i) => ({
    id: i + 1,
    title,
    janr: genres[Math.floor(Math.random() * genres.length)],
    yil: 2010 + Math.floor(Math.random() * 14),
    rejissyor_id: (i % directorsCount) + 1
  }));
};

// Generate 100 Seats (10x10)
export const INITIAL_SEATS: Seat[] = Array.from({ length: 100 }, (_, i) => {
  const qator = Math.floor(i / 10) + 1;
  const orin = (i % 10) + 1;
  return {
    id: i + 1,
    qator,
    orin,
    narx: 40000 + qator * 10000
  };
});

export const INITIAL_DIRECTORS = generateDirectors();
export const INITIAL_PLAYS = generatePlays(INITIAL_DIRECTORS.length);

// Generate 60 Tickets
const generateTickets = (playsCount: number, seatsCount: number): Ticket[] => {
  const buyers = [
    "Ali Valiyev", "Dilnoza Karimova", "Rustam Xolmatov", "Shahnoza To‘xtayeva", "Bahodir Usmonov",
    "Lola Mamatova", "Javlon Sodiqov", "Umida Mirzayeva", "Sevinch Yoqubova", "Jamshid Qodirov",
    "Sardor Orifov", "Malika Nabieva", "Bobur G'ulomov", "Diyorbek Toshmatov", "Asal Shodieva",
    "Zarina Nizomiddinova", "Alisher Uzoqov", "Adiz Rajabov", "Ulug'bek Qodirov", "Yigitali Mamajonov"
  ];
  const tickets: Ticket[] = [];
  const usedSeats = new Set<number>();

  for (let i = 0; i < 60; i++) {
    let joy_id = Math.floor(Math.random() * seatsCount) + 1;
    while (usedSeats.has(joy_id)) {
      joy_id = Math.floor(Math.random() * seatsCount) + 1;
    }
    usedSeats.add(joy_id);

    tickets.push({
      id: i + 1,
      spektakl_id: Math.floor(Math.random() * playsCount) + 1,
      joy_id,
      xaridor: buyers[Math.floor(Math.random() * buyers.length)],
      sana: `2024-05-${String((i % 28) + 1).padStart(2, '0')}`
    });
  }
  return tickets;
};

export const INITIAL_TICKETS = generateTickets(INITIAL_PLAYS.length, INITIAL_SEATS.length);
