// ===== TYPY DANYCH aplikacji OSP e-Remiza =====

export type AlarmType = 
  | 'pozar' | 'wypadek' | 'techniczne' | 'medyczne' | 'ekologiczne' | 'inne';

export type AlarmStatus = 'aktywny' | 'zakonczony' | 'anulowany' | 'cwiczenie';

export type ParticipationStatus = 'jade' | 'nie_jade' | 'oczekuje' | 'powrot';

export interface Alarm {
  id: string;
  numer: string;
  typ: AlarmType;
  status: AlarmStatus;
  adres: string;
  miejscowosc: string;
  opis: string;
  dataczas: string;
  lat: number;
  lon: number;
  potwierdzenieStatus: ParticipationStatus;
  liczbaJadacych: number;
  liczbaOdrzucajacych: number;
  czasZadysponowania?: number; // w sekundach
  czasWyjazdu?: string;
  czasPowrotu?: string;
  zdjecia?: string[];
  notatka?: string;
  obsada?: ObsadaOsoba[];
}

export interface ObsadaOsoba {
  id: string;
  imieNazwisko: string;
  rola: 'dowodca' | 'kierowca' | 'ratownik' | 'pomocniczy';
  status: ParticipationStatus;
  dystans?: number;
  czasReakcji?: number;
}

export interface Czlonek {
  id: string;
  imie: string;
  nazwisko: string;
  stopien: string;
  funkcja: string;
  telefon: string;
  email?: string;
  avatar?: string;
  uprawnienia: string[];
  badanieWazne?: string;
  badanieTermin?: string;
  szkolenia: Szkolenie[];
  aktywny: boolean;
  dataWstapienia: string;
  liczbaMisji: number;
  sredniCzasReakcji?: number;
}

export interface Szkolenie {
  id: string;
  nazwa: string;
  data: string;
  waznosc?: string;
  certyfikat?: string;
}

export interface Pojazd {
  id: string;
  typ: 'GBA' | 'GBM' | 'SLKw' | 'SCKw' | 'GCBA' | 'SLRt' | 'inny';
  nazwa: string;
  marka: string;
  model: string;
  rok: number;
  numerRejestracyjny: string;
  numerVIN?: string;
  przegladTermin: string;
  ocTermin: string;
  przebieg: number;
  stacjonarnyGPS?: boolean;
  zdjecie?: string;
  kartaDrogowa?: KartaDrogowa[];
  tankowania?: Tankowanie[];
}

export interface KartaDrogowa {
  id: string;
  data: string;
  kierowca: string;
  trasa: string;
  przebiegStart: number;
  przebiegKoniec: number;
  cel: string;
}

export interface Tankowanie {
  id: string;
  data: string;
  litry: number;
  koszt: number;
  stacja: string;
  przebieg: number;
}

export interface PojazdEV {
  id: string;
  marka: string;
  model: string;
  rok: number;
  wersja: string;
  typNapedu: 'BEV' | 'PHEV' | 'HEV' | 'FCEV';
  mocKW: number;
  pojemnoscBaterii?: number;
  napiecieAkumulatora?: number;
  proceduraBezpieczenstwa: string;
  lokalizacjaOdlaczenia: LokalizacjaOdlaczenia[];
  strefy: StrefaBezpieczenstwa[];
  uwagi: string;
  zrodlo: string;
  zdjecia?: string[];
}

export interface LokalizacjaOdlaczenia {
  nazwa: string;
  lokalizacja: string;
  opis: string;
  krok: number;
  ostrzezenie?: string;
}

export interface StrefaBezpieczenstwa {
  nazwa: string;
  opis: string;
  napiecie?: string;
  kolor: 'czerwony' | 'zolty' | 'zielony';
}

export interface Sprzet {
  id: string;
  nazwa: string;
  typ: string;
  numerSeryjny?: string;
  dataZakupu?: string;
  legalizacjaTermin?: string;
  przegladTermin?: string;
  stan: 'sprawny' | 'naprawa' | 'wycofany';
  lokalizacja: string;
  uwagi?: string;
}

export interface Dokument {
  id: string;
  nazwa: string;
  kategoria: string;
  data: string;
  rozmiar: number;
  typ: string;
  url?: string;
  autor: string;
}

export interface Dyżur {
  id: string;
  typ: 'dyżur' | 'szkolenie' | 'zbiórka' | 'inne';
  tytul: string;
  data: string;
  godzinaStart: string;
  godzinaKoniec?: string;
  miejsce?: string;
  opis?: string;
  osoby?: string[];
  obowiazkowy: boolean;
}

export interface Statystyki {
  roczne: {
    rok: number;
    alarmyRazem: number;
    wgTypu: Record<AlarmType, number>;
    wgMiesiaca: number[];
    sredniCzasZadysponowania: number;
    topDruhowie: TopDruh[];
    calkowityPrzebieg: number;
  };
  miesieczne?: {
    miesiac: number;
    rok: number;
    alarmy: number;
    sredniaZaloga: number;
  }[];
}

export interface TopDruh {
  czlonekId: string;
  imieNazwisko: string;
  liczbaAlarmow: number;
  sredniCzasReakcji: number;
}

export interface OspNaMapie {
  id: string;
  nazwa: string;
  adres: string;
  lat: number;
  lon: number;
  dystans?: number;
  telefon?: string;
  gotowoscBojowa?: boolean;
  kategoriaJRG?: string;
}

export interface Hydrant {
  id: string;
  typ: 'nadziemny' | 'podziemny' | 'suchy';
  adres: string;
  lat: number;
  lon: number;
  srednica?: number;
  wydajnosc?: number;
  sprawny: boolean;
}

export interface UstawieniaUzytkownika {
  jezyk: 'pl';
  motyw: 'ciemny' | 'jasny' | 'systemowy';
  powiadomienia: {
    alarmy: boolean;
    dzwiek: boolean;
    wibracje: boolean;
    syrena: boolean;
  };
  mapa: {
    domyslnyZoom: number;
    pokazInneOSP: boolean;
    pokazHydranty: boolean;
  };
}

export type NavSection = 
  | 'alarmy' | 'mapa' | 'czlonkowie' | 'dyżury' 
  | 'sprzet' | 'pojazdy' | 'pojazdy-ev' | 'dokumenty' 
  | 'statystyki' | 'ustawienia' | 'raport';
