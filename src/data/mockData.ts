import { Alarm, Czlonek, Pojazd, PojazdEV, Sprzet, Dokument, Dyżur, Statystyki, OspNaMapie, Hydrant } from '../types';

// OSP Remiza lokalizacja (przykład: Kraków)
export const REMIZA_LAT = 50.0614;
export const REMIZA_LON = 19.9383;
export const UNIT_NAME = "OSP Kraków-Swoszowice";

export const mockAlarmy: Alarm[] = [
  {
    id: 'a1',
    numer: '2026/0142',
    typ: 'pozar',
    status: 'aktywny',
    adres: 'ul. Zakopiańska 45',
    miejscowosc: 'Kraków',
    opis: 'Pożar budynku mieszkalnego, dym widoczny z daleka. Zagrożone osoby na II piętrze.',
    dataczas: new Date(Date.now() - 12 * 60000).toISOString(),
    lat: 50.0512,
    lon: 19.9201,
    potwierdzenieStatus: 'jade',
    liczbaJadacych: 7,
    liczbaOdrzucajacych: 2,
    czasZadysponowania: 187,
    czasWyjazdu: new Date(Date.now() - 10 * 60000).toISOString(),
    obsada: [
      { id: 'm1', imieNazwisko: 'Jan Kowalski', rola: 'dowodca', status: 'jade', dystans: 0.8, czasReakcji: 145 },
      { id: 'm2', imieNazwisko: 'Marek Nowak', rola: 'kierowca', status: 'jade', dystans: 1.2, czasReakcji: 187 },
      { id: 'm3', imieNazwisko: 'Piotr Wiśniewski', rola: 'ratownik', status: 'jade', dystans: 2.1, czasReakcji: 210 },
    ]
  },
  {
    id: 'a2',
    numer: '2026/0141',
    typ: 'wypadek',
    status: 'zakonczony',
    adres: 'ul. Wielicka 120',
    miejscowosc: 'Kraków',
    opis: 'Wypadek drogowy, kolizja 3 pojazdów. Jedna osoba zakleszczona.',
    dataczas: new Date(Date.now() - 3 * 3600000).toISOString(),
    lat: 50.0421,
    lon: 19.9612,
    potwierdzenieStatus: 'powrot',
    liczbaJadacych: 9,
    liczbaOdrzucajacych: 1,
    czasZadysponowania: 156,
    czasWyjazdu: new Date(Date.now() - 3 * 3600000 + 3 * 60000).toISOString(),
    czasPowrotu: new Date(Date.now() - 1 * 3600000).toISOString(),
    zdjecia: ['photo1.jpg', 'photo2.jpg'],
    notatka: 'Akcja zakończona pomyślnie. Osoba zakleszczona uwolniona i przekazana ZRM.'
  },
  {
    id: 'a3',
    numer: '2026/0140',
    typ: 'techniczne',
    status: 'zakonczony',
    adres: 'al. 29 Listopada 55',
    miejscowosc: 'Kraków',
    opis: 'Usunięcie połamanego drzewa zagrażającego bezpieczeństwu ruchu.',
    dataczas: new Date(Date.now() - 24 * 3600000).toISOString(),
    lat: 50.0891,
    lon: 19.9512,
    potwierdzenieStatus: 'powrot',
    liczbaJadacych: 6,
    liczbaOdrzucajacych: 3,
    czasZadysponowania: 234,
  },
  {
    id: 'a4',
    numer: '2026/0139',
    typ: 'pozar',
    status: 'zakonczony',
    adres: 'ul. Bieżanowska 78',
    miejscowosc: 'Kraków',
    opis: 'Pożar lasu, około 0.5 ha. Wiatr utrudniał działania.',
    dataczas: new Date(Date.now() - 48 * 3600000).toISOString(),
    lat: 50.0302,
    lon: 20.0134,
    potwierdzenieStatus: 'powrot',
    liczbaJadacych: 11,
    liczbaOdrzucajacych: 0,
    czasZadysponowania: 198,
  },
  {
    id: 'a5',
    numer: '2026/0138',
    typ: 'medyczne',
    status: 'zakonczony',
    adres: 'ul. Rybitwy 14',
    miejscowosc: 'Kraków',
    opis: 'Wsparcie ZRM przy reanimacji.',
    dataczas: new Date(Date.now() - 72 * 3600000).toISOString(),
    lat: 50.0187,
    lon: 20.0289,
    potwierdzenieStatus: 'powrot',
    liczbaJadacych: 4,
    liczbaOdrzucajacych: 5,
    czasZadysponowania: 145,
  },
];

export const mockCzlonkowie: Czlonek[] = [
  {
    id: 'm1',
    imie: 'Jan',
    nazwisko: 'Kowalski',
    stopien: 'st. ogniomistrz',
    funkcja: 'Naczelnik',
    telefon: '+48 601 123 456',
    email: 'j.kowalski@osp.pl',
    uprawnienia: ['KPP', 'Pilarze', 'Highline', 'Kierowca kat C'],
    badanieWazne: '2027-03-15',
    aktywny: true,
    dataWstapienia: '2010-04-01',
    liczbaMisji: 312,
    sredniCzasReakcji: 156,
    szkolenia: [
      { id: 's1', nazwa: 'KPP', data: '2020-05-10', waznosc: '2026-05-10', certyfikat: 'KPP/2020/001' },
      { id: 's2', nazwa: 'Ratownictwo wysokościowe', data: '2022-09-15' },
    ]
  },
  {
    id: 'm2',
    imie: 'Marek',
    nazwisko: 'Nowak',
    stopien: 'ogniomistrz',
    funkcja: 'Zastępca Naczelnika',
    telefon: '+48 602 234 567',
    uprawnienia: ['KPP', 'Kierowca kat C+E'],
    badanieWazne: '2026-08-20',
    aktywny: true,
    dataWstapienia: '2013-06-15',
    liczbaMisji: 245,
    sredniCzasReakcji: 187,
    szkolenia: [
      { id: 's3', nazwa: 'KPP', data: '2021-04-20', waznosc: '2027-04-20' },
    ]
  },
  {
    id: 'm3',
    imie: 'Piotr',
    nazwisko: 'Wiśniewski',
    stopien: 'podoficer',
    funkcja: 'Kierowca',
    telefon: '+48 603 345 678',
    uprawnienia: ['Kierowca kat C', 'Ratownik wodny'],
    badanieWazne: '2027-01-10',
    aktywny: true,
    dataWstapienia: '2015-09-01',
    liczbaMisji: 189,
    sredniCzasReakcji: 210,
    szkolenia: []
  },
  {
    id: 'm4',
    imie: 'Anna',
    nazwisko: 'Zielińska',
    stopien: 'starszy strażak',
    funkcja: 'Ratownik medyczny',
    telefon: '+48 604 456 789',
    uprawnienia: ['KPP', 'Ratownik medyczny', 'Kobiece'],
    badanieWazne: '2025-11-30',
    aktywny: true,
    dataWstapienia: '2018-03-20',
    liczbaMisji: 134,
    sredniCzasReakcji: 198,
    szkolenia: [
      { id: 's4', nazwa: 'Ratownik medyczny', data: '2022-11-01', waznosc: '2025-11-01' },
    ]
  },
  {
    id: 'm5',
    imie: 'Tomasz',
    nazwisko: 'Dąbrowski',
    stopien: 'strażak',
    funkcja: 'Ratownik',
    telefon: '+48 605 567 890',
    uprawnienia: ['Kurs podstawowy'],
    badanieWazne: '2027-06-15',
    aktywny: true,
    dataWstapienia: '2021-01-10',
    liczbaMisji: 67,
    szkolenia: []
  },
  {
    id: 'm6',
    imie: 'Krzysztof',
    nazwisko: 'Lewandowski',
    stopien: 'ogniomistrz',
    funkcja: 'Skarbnik',
    telefon: '+48 606 678 901',
    uprawnienia: ['KPP', 'Pilarze'],
    badanieWazne: '2026-04-22',
    aktywny: false,
    dataWstapienia: '2012-07-05',
    liczbaMisji: 178,
    szkolenia: []
  },
];

export const mockPojazdy: Pojazd[] = [
  {
    id: 'p1',
    typ: 'GBA',
    nazwa: 'GBA 2,5/16',
    marka: 'MAN',
    model: 'TGM 18.280',
    rok: 2019,
    numerRejestracyjny: 'KR 12345',
    przegladTermin: '2026-09-15',
    ocTermin: '2026-10-01',
    przebieg: 87432,
    stacjonarnyGPS: true,
  },
  {
    id: 'p2',
    typ: 'GCBA',
    nazwa: 'GCBA 5/32',
    marka: 'Volvo',
    model: 'FL260',
    rok: 2015,
    numerRejestracyjny: 'KR 67890',
    przegladTermin: '2026-07-20',
    ocTermin: '2026-08-01',
    przebieg: 124567,
    stacjonarnyGPS: false,
  },
  {
    id: 'p3',
    typ: 'SLKw',
    nazwa: 'SLKw',
    marka: 'Toyota',
    model: 'Land Cruiser',
    rok: 2021,
    numerRejestracyjny: 'KR 11111',
    przegladTermin: '2027-02-10',
    ocTermin: '2027-03-01',
    przebieg: 45123,
    stacjonarnyGPS: true,
  }
];

export const mockPojazdy_EV: PojazdEV[] = [
  {
    id: 'ev1',
    marka: 'Tesla',
    model: 'Model 3',
    rok: 2023,
    wersja: 'Long Range AWD',
    typNapedu: 'BEV',
    mocKW: 358,
    pojemnoscBaterii: 82,
    napiecieAkumulatora: 400,
    proceduraBezpieczenstwa: `
1. ZATRZYMAJ pojazd i zabezpiecz miejsce zdarzenia
2. ODETNIJ zapłon kluczykiem/aplikacją jeśli możliwe
3. POŁÓŻ pojazd na boku NIE jest zalecane — ryzyko uszkodzenia baterii
4. GŁÓWNY wyłącznik serwisowy: pod tylną kanapą, pomarańczowy przewód 12V
5. NIE przecinaj pomarańczowych przewodów wysokiego napięcia
6. STREFA BEZPIECZNA: min 5m od pojazdu podczas pożaru baterii
7. Pożar baterii: 3000-4000 litrów wody na chłodzenie przez min 20 min
    `,
    lokalizacjaOdlaczenia: [
      {
        krok: 1,
        nazwa: 'Kluczyk / wyłącznik awaryjny',
        lokalizacja: 'Centrum konsoli — wciśnij przycisk stop lub usuń kartę kluczową',
        opis: 'Dezaktywuje system trakcji, choć HV nie jest odłączone',
        ostrzezenie: 'Pojazd może nadal mieć napięcie na magistrali HV'
      },
      {
        krok: 2,
        nazwa: 'Wyłącznik serwisowy 12V',
        lokalizacja: 'Pod tylną kanapą — pomarańczowy wtyczka 12V',
        opis: 'Odłącza akumulator 12V zasilający systemy sterowania BMS',
        ostrzezenie: 'Po odłączeniu poczekaj 5 min na rozładowanie kondensatorów'
      },
      {
        krok: 3,
        nazwa: 'Listwa HV — dostęp serwisowy',
        lokalizacja: 'Podwozie pojazdu — zaślepka serwisowa (wymaga narzędzi)',
        opis: 'Fizyczne odłączenie akumulatora trakcyjnego — TYLKO dla przeszkolonych',
        ostrzezenie: '⚠️ BEZWZGLĘDNIE: gumowe rękawice 1000V, maty izolacyjne!'
      }
    ],
    strefy: [
      { nazwa: 'Strefa czerwona', opis: 'Bezpośrednie otoczenie pojazdu — ryzyko porażenia 400V DC', napiecie: '400V DC', kolor: 'czerwony' },
      { nazwa: 'Strefa żółta', opis: '1-3m od pojazdu — możliwe odpryski elektrolitu', kolor: 'zolty' },
      { nazwa: 'Strefa zielona', opis: 'Powyżej 5m — bezpieczna strefa obserwacji', kolor: 'zielony' }
    ],
    uwagi: 'W przypadku pożaru baterii LFP chłodzenie wodą jest skuteczne. Baterie NMC mogą reaktywować się po ugaszeniu — monitoruj przez 2h!',
    zrodlo: 'NFPA 921, EVRescueSheets.eu, Tesla Emergency Response Guide 2023',
    zdjecia: []
  },
  {
    id: 'ev2',
    marka: 'Toyota',
    model: 'Prius',
    rok: 2022,
    wersja: 'Plug-in Hybrid (PHEV)',
    typNapedu: 'PHEV',
    mocKW: 100,
    pojemnoscBaterii: 8.8,
    napiecieAkumulatora: 300,
    proceduraBezpieczenstwa: `
1. Wyłącz zapłon — tryb READY musi być nieaktywny (brak zielonej kontrolki)
2. Odłącz akumulator 12V (kabel ujemny, pod bagażnikiem w Prius)
3. Wyłącznik serwisowy HV: pod tylnym siedzeniem, pomarańczowy klucz/wtyczka
4. Poczekaj 5 minut na rozładowanie kondensatorów
5. Pomarańczowe przewody wysokiego napięcia — NIE PRZECINAJ
    `,
    lokalizacjaOdlaczenia: [
      {
        krok: 1,
        nazwa: 'Akumulator 12V',
        lokalizacja: 'Bagażnik prawy tylny — pod wykładziną',
        opis: 'Odłącz kabel ujemny (-) klucz 10mm',
        ostrzezenie: 'Spowoduje reset systemów elektronicznych'
      },
      {
        krok: 2,
        nazwa: 'Wyłącznik serwisowy HV',
        lokalizacja: 'Pod tylną kanapą, prawa strona — pomarańczowa wtyczka z zabezpieczeniem',
        opis: 'Pociągnij ku górze i obróć o 90° — fizycznie rozłącza pakiet HV',
        ostrzezenie: '⚠️ Rękawice izolacyjne 1000V! Poczekaj 5 min po odłączeniu.'
      }
    ],
    strefy: [
      { nazwa: 'Strefa czerwona', opis: 'Bezpośrednio przy pakiecie baterii i przewodach HV', napiecie: '300V DC', kolor: 'czerwony' },
      { nazwa: 'Strefa żółta', opis: 'Do 2m od pojazdu', kolor: 'zolty' },
      { nazwa: 'Strefa zielona', opis: 'Powyżej 3m', kolor: 'zielony' }
    ],
    uwagi: 'Hybryda — przy silniku spalinowym ryzyko uruchomienia! Toyota Prius Generation 4. Zawsze weryfikuj czy pojazd jest w trybie OFF (brak podświetlenia panelu).',
    zrodlo: 'Toyota HEV Emergency Response Guide, KMPSP Instrukcja dla OAP EV 2024'
  },
  {
    id: 'ev3',
    marka: 'BMW',
    model: 'i3',
    rok: 2021,
    wersja: '120Ah Pure Electric',
    typNapedu: 'BEV',
    mocKW: 125,
    pojemnoscBaterii: 42.2,
    napiecieAkumulatora: 360,
    proceduraBezpieczenstwa: `
1. Zatrzymaj pojazd — hamulec elektryczny może nadal działać
2. Odetnij zapłon kluczykiem
3. Wyłącznik serwisowy: lewy bok bagażnika — pomarańczowy klucz obrotowy
4. Odłącz akumulator 12V pod maską (brak silnika spalinowego, mała komora)
5. Czekaj 5 minut — kondensatory HV
    `,
    lokalizacjaOdlaczenia: [
      {
        krok: 1,
        nazwa: 'Wyłącznik serwisowy HV',
        lokalizacja: 'Bagażnik, lewa strona — pomarańczowy klucz z tworzywa, obrót 90° w lewo',
        opis: 'Odłącza fizycznie pakiet akumulatora od reszty układu HV',
        ostrzezenie: '⚠️ Izolacja 1kV! Czas rozładowania kondensatorów: min 5 minut'
      },
      {
        krok: 2,
        nazwa: 'Akumulator 12V',
        lokalizacja: 'Komora przednia (nie silnikowa) — po prawej stronie',
        opis: 'Odłącz kabel ujemny',
        ostrzezenie: 'Pojazd nie ma silnika spalinowego — cała komora przednia to przestrzeń bagażowa'
      }
    ],
    strefy: [
      { nazwa: 'Strefa czerwona', opis: 'Podwozie — baterie montowane w podłodze pojazdu', napiecie: '360V DC', kolor: 'czerwony' },
      { nazwa: 'Strefa żółta', opis: '0.5-3m od pojazdu', kolor: 'zolty' },
      { nazwa: 'Strefa zielona', opis: 'Powyżej 5m', kolor: 'zielony' }
    ],
    uwagi: 'Baterie litowo-jonowe montowane w podłodze — przy uszkodzeniu podwozia ryzyko przebicia ogniw! Unikaj wchodzenia pod pojazd.',
    zrodlo: 'BMW Group Emergency Response Guide 2022, EVRescueSheets.eu'
  },
  {
    id: 'ev4',
    marka: 'Hyundai',
    model: 'IONIQ 5',
    rok: 2023,
    wersja: '77.4 kWh AWD',
    typNapedu: 'BEV',
    mocKW: 225,
    pojemnoscBaterii: 77.4,
    napiecieAkumulatora: 800,
    proceduraBezpieczenstwa: `
⚠️ UWAGA: Napięcie 800V DC — SZCZEGÓLNA OSTROŻNOŚĆ!
1. Wyłącz pojazd kluczykiem/aplikacją
2. WYŁĄCZNIK SERWISOWY HV — bagażnik, prawa strona, za wykładziną
3. Odłącz akumulator 12V: komora silnikowa, prawa strona
4. Czekaj MINIMUM 10 minut (system 800V!)
5. NIE PRZECINAJ pomarańczowych kabli — napięcie 800V DC śmiertelne
    `,
    lokalizacjaOdlaczenia: [
      {
        krok: 1,
        nazwa: 'Wyłącznik serwisowy 800V HV',
        lokalizacja: 'Bagażnik — prawa strona, za panelem bocznym. Pomarańczowy element z białym zatrzaskiem.',
        opis: 'Podniesienie zatrzasku + obrót 90° w lewo — odłącza pakiet 800V',
        ostrzezenie: '⚠️⚠️ 800V DC — ŚMIERTELNE NAPIĘCIE! Tylko sprzęt 1kV+ kategoria izolacji!'
      },
      {
        krok: 2,
        nazwa: 'Akumulator 12V',
        lokalizacja: 'Komora silnikowa — prawa strona (napędzona elektrycznie)',
        opis: 'Kabel ujemny, klucz 10mm',
        ostrzezenie: 'Po odłączeniu 12V czekaj MIN 10 minut — kondensatory systemu 800V!'
      }
    ],
    strefy: [
      { nazwa: 'Strefa czerwona', opis: 'Cały pojazd — system 800V DC w podłodze', napiecie: '800V DC', kolor: 'czerwony' },
      { nazwa: 'Strefa żółta', opis: '1-5m — ryzyko wycieku elektrolitu, pary', kolor: 'zolty' },
      { nazwa: 'Strefa zielona', opis: 'Powyżej 10m dla pożaru baterii', kolor: 'zielony' }
    ],
    uwagi: 'System 800V — jeden z najwyższych napięć w pojazdach osobowych! Wymagane rękawice izolacyjne 1kV klasa 0 MINIMUM. Przy pożarze: 5000L+ wody, monitorowanie przez 3h minimum.',
    zrodlo: 'Hyundai Motor Group Emergency Response Guide 2023, NFPA 921 Chapter 27'
  },
  {
    id: 'ev5',
    marka: 'Volkswagen',
    model: 'ID.4',
    rok: 2022,
    wersja: 'Pro Performance AWD',
    typNapedu: 'BEV',
    mocKW: 195,
    pojemnoscBaterii: 77,
    napiecieAkumulatora: 400,
    proceduraBezpieczenstwa: `
1. Wyłącz zapłon — wyjmij kartę/klucz
2. Wyłącznik serwisowy: bagażnik — pod wykładziną, centralnie
3. Odłącz akumulator 12V: komora silnikowa, lewa strona
4. Odczekaj 5 minut
5. Baterie pod podłogą — ryzyko przy uderzeniach w podwozie
    `,
    lokalizacjaOdlaczenia: [
      {
        krok: 1,
        nazwa: 'Wyłącznik serwisowy HV (Manual Service Disconnect)',
        lokalizacja: 'Bagażnik — centralna część podłogi, pod wykładziną. Żółta wtyczka.',
        opis: 'Pociągnij uchwyt do góry i wyjmij moduł MSD',
        ostrzezenie: '⚠️ Rękawice izolacyjne 1kV! Czas rozładowania: 5 minut'
      },
      {
        krok: 2,
        nazwa: 'Akumulator 12V',
        lokalizacja: 'Komora silnikowa — lewa strona, widoczny bezpośrednio',
        opis: 'Klucz ujemny 10mm',
        ostrzezenie: 'Bez 12V systemy bezpieczeństwa wyłączone'
      }
    ],
    strefy: [
      { nazwa: 'Strefa czerwona', opis: 'Baterie w podłodze — cały pojazd', napiecie: '400V DC', kolor: 'czerwony' },
      { nazwa: 'Strefa żółta', opis: '1-3m', kolor: 'zolty' },
      { nazwa: 'Strefa zielona', opis: 'Powyżej 5m', kolor: 'zielony' }
    ],
    uwagi: 'Platforma MEB — VW/Audi/Skoda/SEAT mają podobną budowę. Wyłącznik serwisowy jest taki sam dla ID.3, ID.5, Audi Q4 e-tron, Skoda Enyaq.',
    zrodlo: 'Volkswagen Group Emergency Response Guide 2022, EVRescueSheets.eu'
  },
  {
    id: 'ev6',
    marka: 'Volvo',
    model: 'XC40 Recharge',
    rok: 2022,
    wersja: 'Pure Electric Twin',
    typNapedu: 'BEV',
    mocKW: 300,
    pojemnoscBaterii: 82,
    napiecieAkumulatora: 400,
    proceduraBezpieczenstwa: `
1. Zdalnie wyłącz przez aplikację Volvo Cars (jeśli dostępna)
2. Wyłącz kluczykiem
3. Wyłącznik serwisowy: bagażnik, prawa tylna ściana boczna
4. Akumulator 12V: podwójny zbiornik w komorze silnikowej
    `,
    lokalizacjaOdlaczenia: [
      {
        krok: 1,
        nazwa: 'Wyłącznik serwisowy HV',
        lokalizacja: 'Bagażnik — tylna ściana boczna prawa, panel z napisem "HIGH VOLTAGE"',
        opis: 'Otwórz panel, wyjmij pomarańczową wtyczkę MSD',
        ostrzezenie: '⚠️ 400V DC — izolacja 1kV obowiązkowa'
      }
    ],
    strefy: [
      { nazwa: 'Strefa czerwona', opis: 'Baterie w podłodze', napiecie: '400V DC', kolor: 'czerwony' },
      { nazwa: 'Strefa żółta', opis: '1-4m', kolor: 'zolty' },
      { nazwa: 'Strefa zielona', opis: 'Powyżej 5m', kolor: 'zielony' }
    ],
    uwagi: 'Platforma wspólna z Polestar 2. Volvo i Polestar mają identyczne wyłączniki serwisowe.',
    zrodlo: 'Volvo Cars Emergency Response Guide 2022'
  }
];

export const mockSprzet: Sprzet[] = [
  { id: 's1', nazwa: 'Agregat prądotwórczy Honda EU65is', typ: 'Agregat', numerSeryjny: 'HP2019001', dataZakupu: '2019-05-15', legalizacjaTermin: '2026-05-15', stan: 'sprawny', lokalizacja: 'Garaż-magazyn', uwagi: 'Ostatni przegląd 2025-11-01' },
  { id: 's2', nazwa: 'Piła łańcuchowa Husqvarna 572XP', typ: 'Piła', numerSeryjny: 'HV2020045', stan: 'sprawny', lokalizacja: 'Magazyn-P1', przegladTermin: '2026-09-01' },
  { id: 's3', nazwa: 'Defibrylator AED Lifepak CR2', typ: 'Medyczny', numerSeryjny: 'LP2021789', dataZakupu: '2021-03-20', legalizacjaTermin: '2026-03-20', stan: 'sprawny', lokalizacja: 'Pojazd GBA' },
  { id: 's4', nazwa: 'Rozcinarka hydrauliczna Holmatro', typ: 'Hydrauliczny', numerSeryjny: 'HM2018321', przegladTermin: '2026-06-30', stan: 'naprawa', lokalizacja: 'Serwis', uwagi: 'Awaria węża hydraulicznego' },
  { id: 's5', nazwa: 'Aparat ochrony układu oddechowego MSA G1', typ: 'SCBA', numerSeryjny: 'MSA2022001', legalizacjaTermin: '2026-10-15', stan: 'sprawny', lokalizacja: 'Magazyn-SCBA' },
  { id: 's6', nazwa: 'Motopompa M8/8 Rosenbauer', typ: 'Pompa', numerSeryjny: 'RB2017555', przegladTermin: '2026-08-20', stan: 'sprawny', lokalizacja: 'Pojazd GCBA' },
];

export const mockDokumenty: Dokument[] = [
  { id: 'd1', nazwa: 'Plan ratowniczo-gaśniczy gminy 2026', kategoria: 'Plany', data: '2026-01-15', rozmiar: 2048576, typ: 'pdf', autor: 'KM PSP' },
  { id: 'd2', nazwa: 'Statut OSP 2024', kategoria: 'Dokumenty formalne', data: '2024-03-20', rozmiar: 512000, typ: 'pdf', autor: 'Zarząd OSP' },
  { id: 'd3', nazwa: 'Instrukcja obsługi GBA MAN 2019', kategoria: 'Pojazdy', data: '2019-06-01', rozmiar: 10485760, typ: 'pdf', autor: 'MAN Group' },
  { id: 'd4', nazwa: 'Protokół zebrania 2025-12-15', kategoria: 'Zebrania', data: '2025-12-15', rozmiar: 102400, typ: 'docx', autor: 'Sekretarz' },
  { id: 'd5', nazwa: 'Harmonogram dyżurów Q1 2026', kategoria: 'Grafiki', data: '2026-01-02', rozmiar: 204800, typ: 'xlsx', autor: 'Z-ca Naczelnika' },
];

export const mockDyzury: Dyżur[] = [
  { id: 'dyz1', typ: 'dyżur', tytul: 'Dyżur weekendowy', data: '2026-06-14', godzinaStart: '08:00', godzinaKoniec: '20:00', miejsce: 'Remiza', opis: 'Dyżur sobotni', osoby: ['m1', 'm2', 'm3'], obowiazkowy: false },
  { id: 'dyz2', typ: 'szkolenie', tytul: 'Szkolenie z ratownictwa drogowego', data: '2026-06-18', godzinaStart: '09:00', godzinaKoniec: '15:00', miejsce: 'Remiza + plac manewrowy', opis: 'Szkolenie z użyciem narzędzi hydraulicznych', obowiazkowy: true },
  { id: 'dyz3', typ: 'zbiórka', tytul: 'Zebranie miesięczne', data: '2026-06-20', godzinaStart: '19:00', godzinaKoniec: '21:00', miejsce: 'Świetlica OSP', obowiazkowy: true },
  { id: 'dyz4', typ: 'dyżur', tytul: 'Dyżur weekendowy', data: '2026-06-21', godzinaStart: '08:00', godzinaKoniec: '20:00', miejsce: 'Remiza', osoby: ['m3', 'm4', 'm5'], obowiazkowy: false },
  { id: 'dyz5', typ: 'inne', tytul: 'Zawody sportowo-pożarnicze', data: '2026-06-28', godzinaStart: '10:00', miejsce: 'Stadiom Miejski', obowiazkowy: false },
];

export const mockStatystyki: Statystyki = {
  roczne: {
    rok: 2026,
    alarmyRazem: 142,
    wgTypu: {
      pozar: 48,
      wypadek: 31,
      techniczne: 35,
      medyczne: 18,
      ekologiczne: 7,
      inne: 3,
    },
    wgMiesiaca: [18, 12, 14, 11, 16, 9, 0, 0, 0, 0, 0, 0],
    sredniCzasZadysponowania: 187,
    topDruhowie: [
      { czlonekId: 'm1', imieNazwisko: 'Jan Kowalski', liczbaAlarmow: 89, sredniCzasReakcji: 156 },
      { czlonekId: 'm2', imieNazwisko: 'Marek Nowak', liczbaAlarmow: 76, sredniCzasReakcji: 187 },
      { czlonekId: 'm3', imieNazwisko: 'Piotr Wiśniewski', liczbaAlarmow: 71, sredniCzasReakcji: 210 },
    ],
    calkowityPrzebieg: 12456,
  }
};

export const mockOspNaMapie: OspNaMapie[] = [
  { id: 'osp1', nazwa: 'JRG 5 Kraków', adres: 'ul. Rzemieślnicza 10', lat: 50.0314, lon: 19.9832, telefon: '998', gotowoscBojowa: true, kategoriaJRG: 'JRG' },
  { id: 'osp2', nazwa: 'OSP Swoszowice', adres: 'ul. Swoszowicka 5', lat: 50.0551, lon: 19.9201, telefon: '+48 604 xxx xxx', gotowoscBojowa: true, kategoriaJRG: 'KSRG' },
  { id: 'osp3', nazwa: 'OSP Bieżanów', adres: 'ul. Bieżanowska 12', lat: 50.0298, lon: 20.0112, telefon: '+48 603 xxx xxx', gotowoscBojowa: false, kategoriaJRG: 'OSP' },
  { id: 'osp4', nazwa: 'OSP Podgórze', adres: 'ul. Zamenhoffa 7', lat: 50.0412, lon: 19.9501, telefon: '+48 602 xxx xxx', gotowoscBojowa: true, kategoriaJRG: 'KSRG' },
];

export const mockHydranty: Hydrant[] = [
  { id: 'h1', typ: 'nadziemny', adres: 'ul. Zakopiańska 40', lat: 50.0520, lon: 19.9195, srednica: 80, wydajnosc: 20, sprawny: true },
  { id: 'h2', typ: 'podziemny', adres: 'ul. Wielicka 115', lat: 50.0425, lon: 19.9608, srednica: 100, sprawny: true },
  { id: 'h3', typ: 'nadziemny', adres: 'al. 29 Listopada 60', lat: 50.0885, lon: 19.9515, srednica: 80, wydajnosc: 15, sprawny: false },
  { id: 'h4', typ: 'podziemny', adres: 'ul. Rybitwy 20', lat: 50.0190, lon: 20.0285, srednica: 150, wydajnosc: 30, sprawny: true },
];
