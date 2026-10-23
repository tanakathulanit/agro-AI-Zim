/**
 * Official DR&SS Multilingual Agrochemical Technical Application Manuals
 * Certified Technical Directives for Zimbabwe Smallholders & Commercial Growers.
 * Available in:
 * - English (en)
 * - ChiShona (sn)
 * - isiNdebele (nd)
 */

import { RegisteredChemical } from './registeredChemicalsDatabase';

export interface ChemicalManualSection {
  title: string;
  content: string;
  bulletPoints?: string[];
}

export interface ChemicalDetailedManual {
  languageCode: 'en' | 'sn' | 'nd';
  languageName: string;
  chemicalOverview: string;
  knapsackCalibration: ChemicalManualSection;
  fieldApplicationDirectives: ChemicalManualSection;
  safetyAndPpe: ChemicalManualSection;
  firstAidAndEmergency: ChemicalManualSection;
  withholdingAndIntervals: ChemicalManualSection;
  tankMixingCompatibility: ChemicalManualSection;
  storageAndDisposal: ChemicalManualSection;
  environmentalProtection: ChemicalManualSection;
}

/**
 * Generates an exhaustive, production-grade technical manual for any registered chemical in English, Shona, or Ndebele.
 */
export function getChemicalDetailedManual(chem: RegisteredChemical, lang: 'en' | 'sn' | 'nd' = 'en'): ChemicalDetailedManual {
  const isHerbicide = chem.category === 'Herbicide';
  const isFungicide = chem.category === 'Fungicide';
  const isVet = chem.category === 'Veterinary Dip & Health';
  const isInsecticide = chem.category === 'Insecticide';

  if (lang === 'sn') {
    return {
      languageCode: 'sn',
      languageName: 'ChiShona',
      chemicalOverview: `Bhuku rekushandisa zvakakodzera mushonga we ${chem.tradeName} (${chem.activeIngredient}) wakanyoreswa ne DR&SS pasi pemutemo we Pesticides Regulations Act (Chapter 18:12). Mushonga uyu unoshandiswa kuchengetedza zvirimwa zvakaita se ${chem.approvedCrops.slice(0, 4).join(', ')} kubva kuzvipembenene, sora, kana zvirwere.`,
      knapsackCalibration: {
        title: '1. Kugadzirira Nekuyera Knapsack Sprayer',
        content: isVet
          ? `Pakushandisa pakugezesa kana kupfapfaidza zvipfuyo, yerai chiyero chemushonga zvinoenderana nehuwandu hwemvura iri mudhibhi kana mupombi.`
          : `Kuti mushonga ushande nemazvo pasina kupisa mbesa kana kurasa mari, tevedzerai matanho aya ekuyera:`,
        bulletPoints: isVet
          ? [
              'Geza pombi kana dhibhi nemvura yakachena isina tsvina.',
              `Yerai ${chem.applicationRates.knapsack15L} yemushonga mumudziyo wepurasitiki une marita mashanu emvura.`,
              'Zunguzai zvakanyanya kusvika mushonga wanyungudika chose.',
              'Dururirai mudhibhi kana mupombi mezadza nemvura inosvika 15 Litres.',
              'Pfapfaidzai mhuka dzenyu zvakadzama kunyanya nzeve, muhuro, pasi pemuswe, nepakati pemakumbo.'
            ]
          : [
              'Tanga wadira mvura yakachena inosvika hafu ye knapsack (7.5 Litres).',
              `Tora mudziyo wepurasitiki, yera chiyero chemushonga chinosvika ${chem.applicationRates.knapsack15L}.`,
              'Sanganisa mushonga nemvura shoma mubhakedhi usati wadira mu knapsack (slurry method).',
              'Sefa mushonga uchipinda mu knapsack kuti pasava netsvina inovhara kamuti (nozzle).',
              'Zadza knapsack nemvura yakachena kusvika pamutsetse we 15 Litres.',
              isHerbicide 
                ? 'Shandisa kamuti kakapashuka (flat-fan nozzle) uye famba nhanho dzakafanana (1 metre per second).'
                : 'Shandisa kamuti ke cone (hollow-cone nozzle) kuti mushonga upfapfaidze dutu rakatsetseka rinonamatira pasi pemashizha.'
            ]
      },
      fieldApplicationDirectives: {
        title: '2. Zviyero Nemafambisirwo Ebasa Mumunda',
        content: `Chiyero chehuremu hwemunda (hectare): ${chem.applicationRates.perHectare}. Chiyero cheknapsack imwe ye 15L: ${chem.applicationRates.knapsack15L}.`,
        bulletPoints: [
          `Nguva yekupfapfaidza: Mangwanani-ngwanani (06:00 kusvika 09:00) kana masikati ava kupera (16:00 kusvika 18:30). Usambopfapfaidza zuva richipisa kuitira kudzivirira kupiswa kwemashizha.`,
          `Kwakanangana nemushonga: ${chem.agritexFieldAdvisory}`,
          `Zvirwere nezvipembenene zvinofa: ${chem.targetPestsWeedsDiseases.join(', ')}.`,
          `Mhando yemvura: Shandisa mvura yakachena isina dhaka kana munyu unouraya simba remushonga.`
        ]
      },
      safetyAndPpe: {
        title: '3. Zvipfeko Zvekudzivirira (PPE) Nemitemo Yekuzvidzivirira',
        content: `Mushonga uyu uri muchikwata che: ${chem.toxicityClass}. Murimi anofanira kuchengetedza upenyu hwake nehwemhuri yake nguva dzose.`,
        bulletPoints: [
          'Pfeka hembe refu neovhorosi rine maoko marefu uye bhurugwa refu.',
          'Pfeka magiravhusi erabha (nitrile/neoprene) asingapindi mvura. Usamboshandisa magiravhusi edehwe kana emachira.',
          'Fuka chifukidzo chemhuno nemuromo (respirator/mask) kudzivirira kufema hutsi hwemushonga.',
          'Pfeka magogorosi ekudzivirira maziso kubva pamadonhwe anomwayika.',
          'Pfeka magumubhuts erabha. Buritsa bhurugwa pamusoro pebhuts kuti mushonga ukachururuka usaende mutsoka.',
          'Usambodya, kusvuta fodya, kunwa mvura, kana kukwiza maziso uchiri kubata mushonga.',
          'Ukapedza kupfapfaidza, geza muviri wese nesipo nemvura inotonhora wochinja hembe.'
        ]
      },
      firstAidAndEmergency: {
        title: '4. Rubatsiro Rwokutanga Pangozi (First Aid & Emergency)',
        content: `Kana paitika tsaona yemushonga, kurumidzai kupa rubatsiro urwu musati maenda kukiriniki kana chiremba:`,
        bulletPoints: [
          `Mushonga ukamwayika paganda: Bvisa hembe dzese dzakasvibiswa nekukasika. Geza ganda nesipo nemvura inotonhora kwemaminitsi 15. Usakwiza zvine hasha.`,
          `Mushonga ukapinda mumaziso: Vhura maziso uasuke nemvura yakachena inoyerera kwemaminitsi 15 kusvika 20. Usaisa madonhwe emumaziso asina kutenderwa nachiremba.`,
          `Ukafema hutsi hwemushonga: Endesa murwere panzvimbo ine mhepo yakachena inotonhorera. Musunungure bhatani rehembe agone kufema zvakanaka.`,
          `Ukanwa mushonga: USAMBORUTSA murwere kunze kwekuti chiremba arayira kudaro. Kana achiri kuziva, mupe marasha akapwanywa mumvura (activated charcoal). Mhanya naye kukiriniki riine gaba remushonga riine rebhuri (label).`,
          `Cherechedzo yachiremba: ${chem.firstAidAntidote}`
        ]
      },
      withholdingAndIntervals: {
        title: '5. Mazuva Okumirira Usati Wakohwa (PHI) Nenguva Yokupinda Mumunda',
        content: `Kutevedza mazuva ekumirira (Pre-Harvest Interval) kunodzivirira kuti vanhu vasadye zvekudya zvine muchetura:`,
        bulletPoints: [
          `Mazuva Okumirira Usati Wakohwa (PHI): Mazuva ${chem.preHarvestIntervalDays}. Usambokohwa, kudya, kana kutengesa mbesa musati mapedza mazuva ${chem.preHarvestIntervalDays}.`,
          `Nguva Yokupinda Mumunda (Re-Entry Interval): Maawa ${chem.reEntryIntervalHours}. Usatendere vashandi kana vana kupinda mumunda usina hembe dzedziviriro maawa ${chem.reEntryIntervalHours} asati apera.`,
          isVet ? 'Kumirira nyama nemukaka: Mirira mazuva 7 panyama uye mazuva 3 pamukaka usati wadyiwa nevanhu.' : 'Kumirira zvipfuyo: Usatendere zvipfuyo kufura mumunda wakapfapfaidzwa kusvika mushonga waoma uye mazuva 14 apera.'
        ]
      },
      tankMixingCompatibility: {
        title: '6. Kusanganisa Nemimwe Mishonga (Tank Mixing)',
        content: `Kuti mushonga usabatana kuita mapundu kana kukanganisa simba:`,
        bulletPoints: [
          'Kuedza mubhagedhi diki (Jar Test): Tora chirongo chegirazi, isa mvura nemadonhwe mashoma emishonga yaunoda kusanganisa. Mirira maminitsi 15. Kana zvikaita mapundu kana kupisa, usasanganisa.',
          'Maitirwo ekudira: Tanga nehupfu hunonyungudika (WP), wozotevera mvura inobuda madonhwe (SC/CS), wozotevera mafuta (EC), wozopedzisira ne foliar fertilizer kana sticker (Agral 90 / Wetcit).',
          'Usambosanganisa nemishonga ine lime kana sulfur yakasimba inoputsa simba remushonga.'
        ]
      },
      storageAndDisposal: {
        title: '7. Kuchengetedza Nekurasa Magaba Asina Chinhu',
        content: `Kuchengetedza mushonga zvakachengeteka kunodzivirira tsaona kumhuri nezvipfuyo:`,
        bulletPoints: [
          'Kiya mushonga mushedhi kana kabati yakakiyiwa kure nevana, zvekudya, nembeu.',
          'Usambodira mushonga mumagaba echinwiwa (Coke/Fanta) kana emumafuta ekubikisa.',
          'Kusuka gaba katatu (Triple Rinse): Gaba parinopera, dira mvura yeimwe chetatu, zunguza zvakasimba, woidira mu knapsack. Ita izvi katatu.',
          'Kuparadza gaba: Bhoora gaba pasi nemativi kuti risazomboshandisirwa mvura yekunwa, worichera mugomba rakadzika zvinodarika 1 metre kure nematsime.'
        ]
      },
      environmentalProtection: {
        title: '8. Kuchengetedza Zvakatipoteredza, Nyuchi Nemvura',
        content: `Chengetedza zvipuka zvinobatsira mupasi nezvitubu zvemvura:`,
        bulletPoints: [
          'Nyuchi: Pfapfaidza manheru mushure me 17:00 kana nyuchi dzadzokera mumikoko. Usapfapfaidza maruva akavhurika.',
          'Mvura nehove: Mushonga uyu une muchetura unouraya hove. Siya nhambwe inodarika mamita 30 (buffer zone) kubva panzizi, madhamu nematsime.',
          'Usambogezera pombi dzemushonga murwizi kana mudhamu.'
        ]
      }
    };
  }

  if (lang === 'nd') {
    return {
      languageCode: 'nd',
      languageName: 'isiNdebele',
      chemicalOverview: `Incwadi yokusebenzisa ngendlela efaneleyo umuthi we ${chem.tradeName} (${chem.activeIngredient}) obhaliswe ngaphansi kwe DR&SS lomthetho we Pesticides Regulations Act (Chapter 18:12). Lo muthi usetshenziselwa ukuvikela izilimo ezinjenge ${chem.approvedCrops.slice(0, 4).join(', ')} ezinunwini, okhuleni, kumbe emikhuhlaneni.`,
      knapsackCalibration: {
        title: '1. Ukulungiselela Lokulinganisa i-Knapsack Sprayer',
        content: isVet
          ? `Nxa usebenzisa ekucwilisiseni kumbe ekufafazeni izifuyo, linganisa isilinganiso somuthi ngokuqondileyo lamanzi ase-dipholeni kumbe ku-sprayer.`
          : `Ukuze umuthi usebenze kuhle ungatshisi izilimo kumbe ulahle imali, landela lezi zinyathelo zokulinganisa:`,
        bulletPoints: isVet
          ? [
              'Geza i-sprayer kumbe idipho ngamanzi ahlanzekileyo.',
              `Linganisa ${chem.applicationRates.knapsack15L} yomuthi ngebhakede lamalitha amahlanu amanzi.`,
              'Zamazamisa kakhulu kuze kuhlanganiseke ngokupheleleyo.',
              'Thela ku-sprayer ugcwalise ngamanzi afika ku 15 Litres.',
              'Fafaza izifuyo kakhulu endlebeni, emqaleni, ngaphansi kwemsila laphakathi kwemilenze.'
            ]
          : [
              'Qala ngokuthela amanzi ahlanzekileyo afika phakathi kwe-knapsack (7.5 Litres).',
              `Thatha isikali sepulasitiki, ulinganise umuthi ongange ${chem.applicationRates.knapsack15L}.`,
              'Xuba umuthi lamanzi amancane ebhakedeni ungakawutheli ku-knapsack (slurry method).',
              'Sefa umuthi ungena ku-knapsack ukuze kungangeni izibi ezivala inozeli.',
              'Gcwalisa i-knapsack ngamanzi ahlanzekileyo kuze kufike kumdwebo ka 15 Litres.',
              isHerbicide
                ? 'Sebenzisa inozeli ephephukayo (flat-fan nozzle) njalo uhambe ngejubane elilodwa (1 metre ngomzuzwana).'
                : 'Sebenzisa inozeli engumsinga (hollow-cone nozzle) ukuze umuthi wenze amazolo amancane anamathela ngaphansi kwamahlamvu.'
            ]
      },
      fieldApplicationDirectives: {
        title: '2. Izilinganiso Lendlela Yokufafaza Ensini',
        content: `Isilinganiso se-hekithali: ${chem.applicationRates.perHectare}. Isilinganiso se-knapsack eyodwa (15L): ${chem.applicationRates.knapsack15L}.`,
        bulletPoints: [
          `Isikhathi sokufafaza: Ekuseni kakhulu (06:00 kuya ku 09:00) kumbe ntambama (16:00 kuya ku 18:30). Ungaze wafafaza ilanga litshisa ukuze amakhasi angatshi.`,
          `Ukuqondiswa komuthi: ${chem.agritexFieldAdvisory}`,
          `Izinunwana lezifo ezibulawala: ${chem.targetPestsWeedsDiseases.join(', ')}.`,
          `Uhlobo lwamanzi: Sebenzisa amanzi acwebileyo angenadlozi kumbe itswayi elicima amandla omuthi.`
        ]
      },
      safetyAndPpe: {
        title: '3. Izembatho Zokuzivikela (PPE) Lemithetho Yokuphepha',
        content: `Lo muthi usigabeni se: ${chem.toxicityClass}. Umlimi kumele avikele impilo yakhe leyemuli yakhe ngaso sonke isikhathi.`,
        bulletPoints: [
          'Gqoka i-ovhoroli ende elezingalo ezinde lamabhulugwe amade.',
          'Gqoka amagilavu enjoloba (nitrile/neoprene) angangenisi manzi. Ungasebenzisi amagilavu esikhumba kumbe elelembu.',
          'Faka isifonyo sokuvikela amakhala lomlomo (respirator/mask) ukwenqabela ukuhogela umusi womuthi.',
          'Gqoka izibuko zokuvikela amehlo (goggles) emathonsini aphaphayo.',
          'Gqoka amabhuthu enjoloba. Faka amabhulugwe ngaphandle kwamabhuthu ukuze umuthi ungachithekeli ezinyaweni.',
          'Ungadli, unganathi amanzi, ungabhemi, kumbe ukuhlikihla amehlo usebenzisa umuthi.',
          'Nxa usuqedile ukufafaza, geza umzimba wonke ngensipho lamanzi abandayo utshintshe izembatho.'
        ]
      },
      firstAidAndEmergency: {
        title: '4. Usizo Lokuqala Enkingeni (First Aid & Emergency)',
        content: `Nxa kungaba lengozi yomuthi, nika lezi zinsiza ngokuphangisa ungakayi esibhedlela:`,
        bulletPoints: [
          `Nxa umuthi uchithekele esikhunjeni: Khipha impahla zonke ezingcolileyo ngokuphangisa. Geza isikhumba ngensipho lamanzi abandayo okwemizuzu engu 15.`,
          `Nxa umuthi ungene emehlweni: Vula amehlo uwahlambulule ngamanzi ahlanzekileyo agobhozayo okwemizuzu engu 15 kuya ku 20.`,
          `Nxa umuntu ehogele umusi womuthi: Mkhuphele phandle lapho okulomoya omuhle ohlanzekileyo. Thukulula amaqhosha ezembatho agone ukuphefumula.`,
          `Nxa umuntu enathe umuthi: UNGAZE WAMHLIZISA ngaphandle kokulayelwa ngudokotela. Mupe amalahle achotshoziweyo emanzini (activated charcoal). Gijima laye esibhedlela ulelebula lomuthi.`,
          `Umbiko kadokotela: ${chem.firstAidAntidote}`
        ]
      },
      withholdingAndIntervals: {
        title: '5. Izinsuku Zokulinda Ungakavuni (PHI) Lesikhathi Sokungena Ensini',
        content: `Ukulandela izinsuku zokulinda (Pre-Harvest Interval) kuvikela abathengi ezithelweni eziletshefu:`,
        bulletPoints: [
          `Izinsuku Zokulinda Ungakavuni (PHI): Izinsuku ezingu ${chem.preHarvestIntervalDays}. Ungaze wavuna, wadla, kumbe wathengisa izilimo zingakadluli izinsuku ezingu ${chem.preHarvestIntervalDays}.`,
          `Isikhathi Sokungena Ensini (Re-Entry Interval): Amahora angu ${chem.reEntryIntervalHours}. Ungavumeli abasebenzi kumbe abantwana bangene ensini engazange igqoke impahla zokuvikela amahora la engakapheli.`,
          isVet ? 'Ukulinda inyama lochago: Linda izinsuku ezingu 7 enyameni lezinsuku ezingu 3 ochagweni.' : 'Ukulinda izifuyo: Ungavumeli izifuyo zidle ensini efafaziweyo kuze kudlule izinsuku ezingu 14.'
        ]
      },
      tankMixingCompatibility: {
        title: '6. Ukuxutshwa Kwemithi (Tank Mixing & Compatibility)',
        content: `Ukuze umuthi ungahluleki kumbe ujiyane ube ngamahlule:`,
        bulletPoints: [
          'Ukuhlola emgqonyeni omncane (Jar Test): Xuba izilinganiso ezincane emgqonyeni wegilasi ubonisise ngemva kwemizuzu engu 15 nxa kulemitshiso kumbe amahlule.',
          'Ukulandelana kokuthela: Qala ngempuphu ehlanganayo (WP), ulandele nge-suspension (SC/CS), ulandele ngamafutha (EC), ugcine nge-foliar fertilizer kumbe isinamathelisi (Wetcit/Agral).',
          'Ungaze waxuba lemithi ele-lime eqinileyo etshabalalisa amandla omuthi.'
        ]
      },
      storageAndDisposal: {
        title: '7. Ukugcinwa Lokulahlwa Kwamagabha Aphelileyo',
        content: `Ukugcina umuthi ngendlela eqondileyo kuvikela imuli lezifuyo:`,
        bulletPoints: [
          'Khiya umuthi eshedini elikhiyiweyo elikude labantwana, ukudla, lezulu.',
          'Ungaze wathela umuthi emabhodleleni e-Coke kumbe awefutha okupheka.',
          'Ukugeza kathathu (Triple Rinse): Gcwalisa ingxenye yesithathu ngamanzi emagabheni aphelileyo, uzamazamise ubuthele ku-knapsack. Phinda kathathu.',
          'Ukubhubhisa igabha: Bhoboza igabha phezulu laphansi lingaphindi lisebenziselwe amanzi, ulimbela emgodini ojulileyo okungenani i-mita elilodwa kude lemithombo yamanzi.'
        ]
      },
      environmentalProtection: {
        title: '8. Ukuvikelwa Kwemvelo, Inyosi Lamanzi',
        content: `Vikela izidalwa ezincedayo emvelweni lomthombo wamanzi:`,
        bulletPoints: [
          'Inyosi: Fafaza ntambama lapho inyosi sezibuyele ezidlekeni zazo. Ungafafazi izilimo ezilezimbali ezivulekileyo.',
          'Amanzi lenhlanzi: Lo muthi uyingozi enkulu enhlanzini. Tshiya indawo engamamitha angu 30 ungayifafazi eceleni kwemifula lamadamu.',
          'Ungaze wagezela imibhobho yokufafaza emifudlaneni kumbe emadamu.'
        ]
      }
    };
  }

  // Default English (en)
  return {
    languageCode: 'en',
    languageName: 'English',
    chemicalOverview: `Official Standard Operating Technical Manual for ${chem.tradeName} (${chem.activeIngredient}), registered with the Department of Research and Specialist Services (DR&SS) under the Pesticides Regulations Act (Chapter 18:12). Approved for production of ${chem.approvedCrops.slice(0, 4).join(', ')} for control of target pests and pathogens.`,
    knapsackCalibration: {
      title: '1. Knapsack Sprayer Calibration & Tank Preparation',
      content: isVet
        ? `For veterinary dip tank and knapsack application on livestock, calibrate the volume strictly according to head count and water volume.`
        : `To ensure precision active ingredient delivery without scorching crop foliage or wasting inputs, follow the official Agritex calibration procedure:`,
      bulletPoints: isVet
        ? [
            'Clean spray equipment and nozzles with clean water prior to chemical addition.',
            `Measure exactly ${chem.applicationRates.knapsack15L} using an approved measuring cylinder.`,
            'Pre-dilute into 5 litres of clean water in a plastic bucket to ensure complete homogenous dispersion.',
            'Pour through the knapsack filter mesh and top up with clean water to the 15-litre mark.',
            'Direct spray to predilection tick sites: inner ear canals, under tail, escutcheon, brisket, and feet.'
          ]
        : [
            'Partially fill the 15L knapsack sprayer with clean water to approximately half capacity (7.5 Litres).',
            `Measure the exact dosage of ${chem.applicationRates.knapsack15L} using a dedicated chemical measuring cylinder.`,
            'Pre-mix the measured chemical in a plastic bucket with 2 litres of clean water to prepare a uniform slurry.',
            'Pour the slurry into the knapsack tank through the inlet filter basket to trap any particulate matter.',
            'Top up with clean water to the exact 15-litre mark and agitate vigorously with the tank lid secured.',
            isHerbicide
              ? 'Fit an even flat-fan nozzle (e.g. TeeJet 8002/8003). Maintain steady walking speed (1 m/s) and constant boom height (50cm above weed canopy).'
              : 'Fit a hollow-cone nozzle (e.g. D3-25 or ConeJet) delivering a fine swirling mist at 2.5 - 3.0 bar pressure to coat leaf undersides and whorls.'
          ]
    },
    fieldApplicationDirectives: {
      title: '2. Field Application Rates, Timing & Directives',
      content: `Commercial Broadacre Rate: ${chem.applicationRates.perHectare}. Smallholder Knapsack Rate: ${chem.applicationRates.knapsack15L}. Carrier Water Volume: ${chem.applicationRates.waterVolumePerHa}.`,
      bulletPoints: [
        `Optimal Spray Timing: Early morning (06:00 - 09:00) before convective thermal updrafts, or late afternoon (16:00 - 18:30) when relative humidity is higher. Avoid midday spraying above 28°C.`,
        `Target Deposition: ${chem.agritexFieldAdvisory}`,
        `Susceptible Pests / Pathogens: ${chem.targetPestsWeedsDiseases.join(', ')}.`,
        `Water Quality: Use neutral pH (6.0 - 7.0) water. Turbid muddy water deactivates systemic compounds within minutes.`
      ]
    },
    safetyAndPpe: {
      title: '3. Mandatory Personal Protective Equipment (PPE) & Worker Safety',
      content: `Toxicity Classification: ${chem.toxicityClass}. Operators must observe statutory safety guidelines under Zimbabwean agricultural regulations:`,
      bulletPoints: [
        'Wear heavy-duty two-piece cotton overalls with long sleeves buttoned at wrists and ankles.',
        'Wear chemical-resistant unlined nitrile or neoprene gloves (never use leather or porous textile gloves).',
        'Wear a half-face particulate and organic vapor respirator mask with clean serviceable filters.',
        'Wear chemical splash goggles or a polycarbonate face shield to protect eyes against mist drift and spray blowback.',
        'Wear waterproof rubber gumboots with trousers worn outside boot shafts to prevent chemical runoff inside footwear.',
        'Never eat, drink, smoke, chew tobacco, or touch face/eyes while handling or spraying chemicals.',
        'Immediately after application, strip overalls into a laundry bucket, shower with soap and cold water, and dress in clean clothes.'
      ]
    },
    firstAidAndEmergency: {
      title: '4. First Aid Protocol & Emergency Antidote Measures',
      content: `In the event of accidental contamination, administer immediate first aid while arranging urgent transport to the nearest clinic or hospital:`,
      bulletPoints: [
        `Skin Contamination: Immediately strip off all contaminated clothing. Douse skin with large quantities of cold water and mild soap for at least 15 minutes. Do not scrub harshly.`,
        `Eye Splashes: Hold eyelids wide open and gently flush eyes with clean running water or sterile saline for 15 - 20 minutes. Do not administer medicated eye drops without doctor authorization.`,
        `Inhalation / Vapor Exposure: Evacuate victim to fresh uncontaminated open air. Loosen collar, belt, and restrictive clothing. Keep warm, resting, and calm.`,
        `Accidental Ingestion: DO NOT induce vomiting unless explicitly instructed by a qualified physician. Never administer anything by mouth to an unconscious patient. If fully conscious, administer activated charcoal suspension in water.`,
        `Physician / Clinical Note: ${chem.firstAidAntidote} Always carry the original product container with intact label to the medical facility.`
      ]
    },
    withholdingAndIntervals: {
      title: '5. Pre-Harvest Interval (PHI) & Restricted-Entry Intervals (REI)',
      content: `Strict observance of withholding intervals prevents toxic chemical residues in produce, ensuring compliance with national food safety benchmarks:`,
      bulletPoints: [
        `Pre-Harvest Interval (PHI): Mandatory ${chem.preHarvestIntervalDays} days. Crops must not be harvested, grazed, or sold for human consumption before this period has fully elapsed.`,
        `Restricted-Entry Interval (REI): Mandatory ${chem.reEntryIntervalHours} hours. Do not allow field workers, children, or livestock to enter the treated plot without full protective equipment.`,
        isVet 
          ? 'Meat & Milk Withholding: Observe 7-day slaughter withholding for meat and 72-hour discarding of milk from dairy animals.'
          : 'Livestock Grazing: Do not graze cattle, goats, or sheep on treated crop residues until at least 14 days post-application.'
      ]
    },
    tankMixingCompatibility: {
      title: '6. Tank Mixing Procedure & Physical Compatibility',
      content: `Prevent chemical antagonism, nozzle clogging, and precipitation by following proper mixing sequence:`,
      bulletPoints: [
        'Physical Compatibility Jar Test: In a clean 1-litre glass jar, add proportional amounts of water and prospective tank-mix partners. Invert 10 times and inspect after 15 minutes for curdling, separation, gelling, or thermal release.',
        'Correct Mixing Sequence: 1. Water conditioning agents -> 2. Water-soluble packets (WSB) -> 3. Wettable powders (WP) -> 4. Suspension concentrates (SC/CS) -> 5. Emulsifiable concentrates (EC) -> 6. Soluble liquids (SL) -> 7. Adjuvants/Stickers (Agral 90/Wetcit).',
        'Avoid mixing with strongly alkaline materials (such as Lime Sulphur or Bordeaux mixture) which rapidly hydrolyze organophosphates, pyrethroids, and diamides.'
      ]
    },
    storageAndDisposal: {
      title: '7. Safe Storage & Empty Container Disposal Protocol',
      content: `Secure handling prevents accidental domestic poisoning and ground-water contamination:`,
      bulletPoints: [
        'Store strictly in original labeled container in a cool, well-ventilated, padlocked chemical store out of reach of children and livestock.',
        'Never transfer agrochemicals into beverage bottles, cooking oil containers, or food storage vessels.',
        'Triple-Rinsing Procedure: When container empties, add clean water to one-quarter capacity, seal, shake vigorously for 30 seconds, and empty rinsate into knapsack spray tank. Repeat three times.',
        'Container Decommissioning: Puncture or crush the triple-rinsed plastic container so it can never be reused. Bury in an approved on-farm disposal pit located at least 50 metres away from boreholes, streams, and domestic wells.'
      ]
    },
    environmentalProtection: {
      title: '8. Environmental Stewardship, Pollinators & Water Safety',
      content: `Protect beneficial biodiversity, bees, and communal water sources:`,
      bulletPoints: [
        'Pollinator Protection: Highly toxic to foraging honeybees. Avoid spraying crops during peak bloom. Apply strictly late in the afternoon (after 17:00) when foraging bees have returned to hives.',
        'Aquatic Organism Hazard: Extremely toxic to fish, frogs, and aquatic life. Maintain a minimum 30-metre untreated vegetative buffer strip adjacent to natural watercourses, dams, rivers, and boreholes.',
        'Never clean sprayers, rinse containers, or dump unused spray mixture into rivers, irrigation canals, or farm ponds.'
      ]
    }
  };
}
