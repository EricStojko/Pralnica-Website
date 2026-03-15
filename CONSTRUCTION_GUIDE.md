# CONSTRUCTION GUIDE - Pralnica Website

## Instructions
(Waiting for user input...)
Ta dokument združuje vizualne smernice, tehnične podatke o storitvah in poslovna pravila, potrebna za backend in frontend razvoj spletne strani.
1. Vizualna Identiteta in UI (Uporabniški Vmesnik)
Spletna stran mora odražati uradno podobo franšize Speed Queen, ki poudarja čistočo, tehnologijo in vrhunsko kakovost.
Barvna Shema
• Primarna barva (Speed Queen Orange): Izrazita rdeče-oranžna. Uporablja se za gumbe (CTA), poudarke, naslove in ikone,.
• Sekundarna barva (Temno siva/Črna): Uporabljena za ozadja napisov (npr. glava strani, noga) in besedilo za visok kontrast,.
• Barva ozadja (Bela/Svetlo siva): Prevladujoča barva za "čist" videz.
• Materiali (Teksture): Videz nerjavečega jekla (Inox) in ponavljajoči se vzorec belega logotipa "Q" na oranžnem ozadju (za dekorativne elemente ali ozadja sekcij).
Tipografija in Logotipi
• Logotip: Uradni logotip Speed Queen (črna črka "Q" s krono/pikami in rdeče-oranžen napis "Speed Queen").
• Slogani (Copywriting):
    ◦ Glavni naslov: "N°1 Laundry in the World",.
    ◦ Podnaslov: "Reposez-vous sur le Leader Mondial" (slovensko: Zanesite se na vodilnega v svetu / Vaša pralnica dela za vas).
2. Podatki o Podjetju (Footer & Kontakt)
Ti podatki morajo biti trdo kodirani v nogo (footer) ali na stran "Kontakt".
• Ime: Speed Queen Pralni center Koper.
• Lastnik: Zoran Stojković.
• Lokacija: Koper (upoštevati tloris "Koper REV02 Model" za morebitni prikaz lokacije na zemljevidu).
• Partnerji: Prenovljeno v sodelovanju s PB&Co (Nova Gorica) in Alliance International.
• Model: Hibridni model (Samopostrežna pralnica s prisotnostjo osebja – ključna prednost, ki jo je treba izpostaviti na strani "O nas").
3. Tehnični Inventar (Storitve za Spletni Prikaz)
Spletna stran mora vsebovati sekcijo "Oprema" ali "Storitve", kjer so predstavljene kapacitete.
Pralni stroji (Washer-Extractors),
• Mali stroji: Kapaciteta 9 kg (idealo za osebno garderobo).
• Veliki stroji: Kapaciteta 18 kg (ključno za marketing: odeje, kovtri, zavese).
• Lastnosti za ikone/opise:
    ◦ High Spin (visoka centrifuga = manj časa za sušenje).
    ◦ Avtomatsko doziranje detergenta in mehčalca (uporabnik ne rabi svojega).
    ◦ Dezinfekcija stroja po vsakem pranju.
Sušilni stroji (Tumblers),
• Kapaciteta: 14 kg (veliki volumni).
• Lastnosti: Anti-crease (proti mečkanju), visoka učinkovitost.
Dodatna ponudba (Amenities),
• Brezplačen Wi-Fi.
• TV kotiček.
• Avtomat za napitke/prigrizke (Vending machine).
• Udobni sedeži in mize za zlaganje perila.
4. Poslovna Pravila (Business Logic za Razvijalce)
Če boste na spletni strani imeli informativni kalkulator cen ali FAQ sekcijo, upoštevajte naslednja pravila (cene so aproksimacije iz virov regije, potrebno jih je uskladiti z vašim dejanskim cenikom):
Cenovna logika,,
• Valuta: EUR (€).
• Plačilni sistem: Žetoni ali Centralna plačilna enota (Gotovina/Kartice/App).
• Tarifni razredi (Primer):
    ◦ Pranje 9 kg: ~5 €.
    ◦ Pranje 18 kg: ~8 €.
    ◦ Sušenje: ~1 € / interval (npr. 7 minut).
    ◦ Pravilo: Detergent in mehčalec sta vključena v ceno (ni doplačila).
Časovni parametri (za prikaz "Kako dolgo traja?"),
• Pranje: 40–50 minut (odvisno od programa).
• Sušenje: 28 minut za običajno perilo (4 x 7 min), do 50 minut za debelejše kose (odeje).
• Skupaj: Stranka lahko računa, da bo gotova v cca. 1 uri do 1 uri 15 min.
Omejitve in Posebnosti
• Dovoljeno: Odeje, blazine, puhovke (z ustreznim sušenjem), športna oprema.
• Hišni ljubljenčki (Pet Plus): Preverite status: Če imate Pet Plus tehnologijo, to izpostavite kot "Pet Friendly" s posebnim strojem. Če ne, navedite prepoved (kot konkurenca v MB).
5. Struktura Spletne Strani (Sitemap)
Glede na vire in cilje širitve priporočam naslednjo strukturo:
1. Domov (Home): Hero slika (sproščeni ljudje na plaži ali v pralnici), kratek opis "Operi in posuši v 1 uri", CTA gumb "Kje nas najdete".
2. Storitve & Cenik:
    ◦ Pregled strojev (9kg vs 18kg).
    ◦ Sezonske storitve (Puhovke, Odeje).
    ◦ NOVO: B2B sekcija za podjetja (Apartmaji, Hoteli) – poudarek na hitrosti in računu na podjetje,.
3. Kako deluje (Navodila):
    ◦ Korak-po-korak (Kupi žeton -> Izberi program -> Start),.
    ◦ Video navodila (Embed YouTube posnetkov).
4. O Nas: Zgodba o prenovi, lastnik Zoran Stojković, poudarek na osebju in pomoči,.
5. Lokacija & Kontakt: Zemljevid (Google Maps), delovni čas, info o parkirišču (brezplačno?), kontaktni telefon/email.
6. Marketing in SEO (Ključne besede)
Za optimizacijo strani uporabite te fraze, ki izhajajo iz potreb uporabnikov v regiji:
• "Samopostrežna pralnica Koper"
• "Pranje velikih kosov / odej Koper"
• "Pranje puhovk Obala"
• "Hitro pranje in sušenje"
• "Pralnica za apartmaje in turiste"