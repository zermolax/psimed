export interface Problem {
	slug: string;
	title: string;
	subtitle: string;
	category: 'copii' | 'adulti';
	icon: string;
	shortDescription: string;
	heroDescription: string;
	symptoms: string[];
	whenToSeekHelp: string[];
	treatments: Array<{ name: string; description: string }>;
	specialists: string[];
	relatedProblems: Array<{ title: string; href: string }>;
	specialtyParam: string;
}

export const problems: Problem[] = [
	// === COPII ===
	{
		slug: 'autism-tsa',
		title: 'Autism / TSA',
		subtitle: 'Tulburarea din Spectrul Autist',
		category: 'copii',
		icon: 'brain',
		shortDescription: 'Evaluare și intervenție timpurie pentru tulburările din spectrul autist.',
		heroDescription:
			'Tulburarea din Spectrul Autist (TSA) este o condiție de neurodezvoltare care afectează comunicarea, interacțiunea socială și comportamentul. Diagnosticul precoce și intervenția timpurie pot face o diferență semnificativă în dezvoltarea copilului. La clinica noastră, oferim evaluări complete și planuri de intervenție personalizate.',
		symptoms: [
			'Dificultăți în stabilirea contactului vizual sau în menținerea acestuia',
			'Întârziere în dezvoltarea limbajului sau lipsa comunicării verbale',
			'Preferință pentru jocul solitar și dificultăți în interacțiunile sociale',
			'Comportamente repetitive (mișcări stereotipe, aliniere de obiecte)',
			'Interese intense și specifice pentru anumite subiecte sau obiecte',
			'Sensibilitate crescută sau scăzută la stimuli senzoriali (sunete, lumini, texturi)',
			'Dificultăți în adaptarea la schimbări sau tranziții',
			'Răspunsuri neobișnuite la mediul înconjurător'
		],
		whenToSeekHelp: [
			'Copilul nu răspunde la nume până la vârsta de 12 luni',
			'Nu indică obiectele de interes până la 14 luni',
			'Nu se angajează în jocuri de tip "pretend" până la 18 luni',
			'Pierderea unor abilități dobândite anterior',
			'Lipsa gesturilor comunicative (fluturatul mâinii, indicatul)',
			'Dificultăți majore în interacțiunea cu alți copii'
		],
		treatments: [
			{
				name: 'Terapie ABA',
				description:
					'Analiza Comportamentală Aplicată - metodă bazată pe dovezi pentru dezvoltarea abilităților și reducerea comportamentelor problematice.'
			},
			{
				name: 'Terapie logopedică',
				description:
					'Dezvoltarea abilităților de comunicare verbală și non-verbală, inclusiv utilizarea sistemelor augmentative.'
			},
			{
				name: 'Terapie ocupațională',
				description:
					'Dezvoltarea abilităților motorii fine, procesării senzoriale și autonomiei în activitățile zilnice.'
			},
			{
				name: 'Intervenție psihoeducațională',
				description:
					'Suport pentru părinți și educatori în înțelegerea și gestionarea nevoilor copilului.'
			}
		],
		specialists: ['Psihiatru pediatric', 'Psiholog clinician', 'Logoped', 'Terapeut ABA'],
		relatedProblems: [
			{ title: 'ADHD', href: '/ce-tratam/adhd' },
			{ title: 'Întârzieri în dezvoltare', href: '/ce-tratam/intarzieri-dezvoltare' },
			{ title: 'Dificultăți de învățare', href: '/ce-tratam/dificultati-invatare' }
		],
		specialtyParam: 'psihiatrie-pediatrica'
	},
	{
		slug: 'adhd',
		title: 'ADHD',
		subtitle: 'Deficitul de Atenție și Hiperactivitate',
		category: 'copii',
		icon: 'brain',
		shortDescription: 'Diagnostic și tratament pentru deficitul de atenție și hiperactivitate.',
		heroDescription:
			'ADHD (Tulburarea Hiperkinetică cu Deficit de Atenție) este una dintre cele mai frecvente tulburări de neurodezvoltare la copii. Se manifestă prin dificultăți de concentrare, hiperactivitate și impulsivitate care afectează performanța școlară și relațiile sociale. Cu tratamentul adecvat, copiii cu ADHD pot avea succes în toate aspectele vieții.',
		symptoms: [
			'Dificultăți în menținerea atenției la sarcini sau activități',
			'Pare că nu ascultă când i se vorbește direct',
			'Nu reușește să finalizeze sarcinile școlare sau de acasă',
			'Dificultăți în organizarea activităților',
			'Evită sarcinile care necesită efort mental susținut',
			'Pierde frecvent obiectele necesare pentru activități',
			'Se agită sau se foiește constant pe scaun',
			'Vorbește excesiv și întrerupe frecvent',
			'Are dificultăți în a-și aștepta rândul'
		],
		whenToSeekHelp: [
			'Simptomele sunt prezente de cel puțin 6 luni',
			'Comportamentele afectează performanța școlară',
			'Dificultăți în relațiile cu colegii sau familia',
			'Simptomele sunt prezente în mai multe contexte (acasă, școală)',
			'Profesorii raportează probleme de atenție sau comportament',
			'Copilul are o stimă de sine scăzută din cauza eșecurilor repetate'
		],
		treatments: [
			{
				name: 'Tratament medicamentos',
				description:
					'Medicația stimulantă sau non-stimulantă poate îmbunătăți semnificativ concentrarea și controlul impulsurilor.'
			},
			{
				name: 'Terapie comportamentală',
				description:
					'Tehnici pentru gestionarea comportamentului, îmbunătățirea abilităților sociale și organizatorice.'
			},
			{
				name: 'Neurofeedback',
				description:
					'Antrenament cerebral non-invaziv care ajută la îmbunătățirea atenției și autocontrolului.'
			},
			{
				name: 'Coaching parental',
				description:
					'Instruirea părinților în tehnici eficiente de management comportamental și comunicare.'
			}
		],
		specialists: ['Psihiatru pediatric', 'Psiholog clinician', 'Terapeut neurofeedback'],
		relatedProblems: [
			{ title: 'Dificultăți de învățare', href: '/ce-tratam/dificultati-invatare' },
			{ title: 'Anxietate la copii', href: '/ce-tratam/anxietate-copii' },
			{ title: 'Probleme de comportament', href: '/ce-tratam/probleme-comportament' }
		],
		specialtyParam: 'psihiatrie-pediatrica'
	},
	{
		slug: 'anxietate-copii',
		title: 'Anxietatea la Copii',
		subtitle: 'Frici, Griji și Tulburări Anxioase',
		category: 'copii',
		icon: 'heart',
		shortDescription: 'Ajutor pentru copiii care se confruntă cu frici, griji și anxietate.',
		heroDescription:
			'Anxietatea este o emoție normală, dar când devine excesivă și interferează cu viața de zi cu zi a copilului, poate fi vorba de o tulburare anxioasă. Copiii cu anxietate pot evita activități, pot avea probleme la școală sau pot dezvolta simptome fizice. Terapia poate ajuta copiii să învețe să-și gestioneze temerile și să trăiască o viață plină.',
		symptoms: [
			'Griji excesive despre evenimente viitoare sau performanță',
			'Frica intensă de separare de părinți',
			'Evitarea situațiilor sociale sau a locurilor noi',
			'Plâns frecvent sau accese de furie înainte de evenimente',
			'Dificultăți de somn sau coșmaruri',
			'Dureri de stomac sau de cap fără cauză medicală',
			'Refuzul de a merge la școală',
			'Perfecționism excesiv și teamă de greșeală',
			'Nevoia constantă de reasigurare'
		],
		whenToSeekHelp: [
			'Anxietatea interferează cu activitățile zilnice',
			'Copilul refuză să meargă la școală',
			'Simptomele fizice recurente fără cauză medicală',
			'Evitare persistentă a situațiilor normale pentru vârstă',
			'Anxietatea afectează relațiile cu familia sau prietenii',
			'Copilul pare constant îngrijorat sau tensionat'
		],
		treatments: [
			{
				name: 'Terapie cognitiv-comportamentală',
				description:
					'Ajută copiii să identifice gândurile anxioase și să dezvolte strategii de coping eficiente.'
			},
			{
				name: 'Terapie prin joc',
				description:
					'Metodă adaptată vârstei care permite copiilor să-și exprime și proceseze emoțiile.'
			},
			{
				name: 'Tehnici de relaxare',
				description:
					'Respirație profundă, mindfulness și alte tehnici pentru gestionarea simptomelor fizice ale anxietății.'
			},
			{
				name: 'Terapie familială',
				description:
					'Implicarea familiei în tratament pentru a crea un mediu suportiv și a reduce întărirea involuntară a anxietății.'
			}
		],
		specialists: ['Psiholog clinician', 'Psihoterapeut copii', 'Psihiatru pediatric'],
		relatedProblems: [
			{ title: 'ADHD', href: '/ce-tratam/adhd' },
			{ title: 'Probleme de comportament', href: '/ce-tratam/probleme-comportament' },
			{ title: 'Dificultăți de învățare', href: '/ce-tratam/dificultati-invatare' }
		],
		specialtyParam: 'psihologie-clinica'
	},
	{
		slug: 'intarzieri-dezvoltare',
		title: 'Întârzieri în Dezvoltare',
		subtitle: 'Evaluare și Intervenție Timpurie',
		category: 'copii',
		icon: 'brain',
		shortDescription:
			'Evaluare specializată pentru copiii cu întârzieri în dezvoltarea motorie, cognitivă sau de limbaj.',
		heroDescription:
			'Întârzierile în dezvoltare pot afecta unul sau mai multe domenii: motor, cognitiv, limbaj, social-emoțional. Identificarea timpurie și intervenția adecvată sunt esențiale pentru a maximiza potențialul de dezvoltare al copilului. Oferim evaluări complete și planuri de intervenție personalizate pentru fiecare copil.',
		symptoms: [
			'Întârziere în atingerea reperelor de dezvoltare (mersul, vorbitul)',
			'Dificultăți în înțelegerea sau urmarea instrucțiunilor simple',
			'Limbaj limitat pentru vârstă sau lipsa comunicării',
			'Dificultăți în coordonarea motorie (fină sau grosieră)',
			'Probleme în interacțiunea cu alți copii de aceeași vârstă',
			'Dificultăți în jocul imaginativ sau simbolic',
			'Răspunsuri neobișnuite la stimuli senzoriali',
			'Probleme în autoservire (îmbrăcat, mâncat)'
		],
		whenToSeekHelp: [
			'Nu gângurește sau nu face sunete la 4 luni',
			'Nu se întoarce spre sunete la 6 luni',
			'Nu stă în șezut fără sprijin la 9 luni',
			'Nu spune cuvinte simple la 16 luni',
			'Nu merge independent la 18 luni',
			'Nu combină cuvinte la 24 luni',
			'Orice pierdere a abilităților dobândite'
		],
		treatments: [
			{
				name: 'Terapie logopedică',
				description:
					'Stimularea dezvoltării limbajului și comunicării prin tehnici specializate adaptate vârstei.'
			},
			{
				name: 'Kinetoterapie',
				description:
					'Exerciții pentru dezvoltarea motricității grosiere, echilibrului și coordonării.'
			},
			{
				name: 'Terapie ocupațională',
				description:
					'Dezvoltarea motricității fine, abilităților de autoservire și procesării senzoriale.'
			},
			{
				name: 'Stimulare cognitivă',
				description:
					'Activități structurate pentru dezvoltarea abilităților cognitive și de învățare.'
			}
		],
		specialists: ['Psiholog clinician', 'Logoped', 'Kinetoterapie', 'Psihiatru pediatric'],
		relatedProblems: [
			{ title: 'Autism / TSA', href: '/ce-tratam/autism-tsa' },
			{ title: 'Dificultăți de învățare', href: '/ce-tratam/dificultati-invatare' },
			{ title: 'ADHD', href: '/ce-tratam/adhd' }
		],
		specialtyParam: 'psihologie-clinica'
	},
	{
		slug: 'probleme-comportament',
		title: 'Probleme de Comportament',
		subtitle: 'Agresivitate, Opoziție și Dificultăți de Reglare',
		category: 'copii',
		icon: 'heart',
		shortDescription:
			'Suport pentru copiii cu comportamente dificile, agresivitate sau tulburări de conduită.',
		heroDescription:
			'Problemele de comportament la copii pot lua forme diverse: agresivitate, opoziție față de adulți, crize de furie sau încălcarea regulilor. Aceste comportamente sunt adesea un mod al copilului de a comunica o nevoie nesatisfăcută sau o dificultate în gestionarea emoțiilor. Cu abordarea terapeutică potrivită, copiii pot învăța modalități sănătoase de exprimare.',
		symptoms: [
			'Crize de furie frecvente și intense pentru vârstă',
			'Agresivitate fizică sau verbală față de alții',
			'Refuz persistent de a urma regulile sau instrucțiunile',
			'Comportament provocator sau sfidător față de adulți',
			'Distrugerea intenționată a obiectelor',
			'Minciuni frecvente sau furt',
			'Dificultăți în gestionarea frustrării',
			'Comportament răzbunător sau ranchiunos'
		],
		whenToSeekHelp: [
			'Comportamentele sunt mai severe decât la copiii de aceeași vârstă',
			'Problemele persistă de peste 6 luni',
			'Copilul are dificultăți la școală din cauza comportamentului',
			'Relațiile cu familia sau colegii sunt afectate',
			'Comportamentul pune în pericol siguranța copilului sau a altora',
			'Strategiile obișnuite de disciplină nu funcționează'
		],
		treatments: [
			{
				name: 'Terapie comportamentală',
				description:
					'Identificarea factorilor declanșatori și dezvoltarea strategiilor de gestionare a comportamentului.'
			},
			{
				name: 'Training parental',
				description:
					'Instruirea părinților în tehnici eficiente de disciplină pozitivă și comunicare.'
			},
			{
				name: 'Terapie de reglare emoțională',
				description:
					'Ajută copiii să recunoască și să gestioneze emoțiile intense într-un mod sănătos.'
			},
			{
				name: 'Terapie familială',
				description:
					'Îmbunătățirea dinamicii familiale și a comunicării pentru a reduce conflictele.'
			}
		],
		specialists: ['Psiholog clinician', 'Psihoterapeut copii', 'Psihiatru pediatric'],
		relatedProblems: [
			{ title: 'ADHD', href: '/ce-tratam/adhd' },
			{ title: 'Anxietate la copii', href: '/ce-tratam/anxietate-copii' },
			{ title: 'Dificultăți de învățare', href: '/ce-tratam/dificultati-invatare' }
		],
		specialtyParam: 'psihologie-clinica'
	},
	{
		slug: 'dificultati-invatare',
		title: 'Dificultăți de Învățare',
		subtitle: 'Dislexie, Discalculie și Alte Tulburări',
		category: 'copii',
		icon: 'brain',
		shortDescription:
			'Evaluare și suport pentru copiii cu dificultăți specifice de învățare.',
		heroDescription:
			'Dificultățile de învățare sunt tulburări neurologice care afectează modul în care creierul procesează informația. Copiii cu aceste dificultăți au o inteligență normală, dar se confruntă cu provocări în citit, scris, matematică sau alte abilități academice. Cu suportul adecvat, pot avea succes școlar și profesional.',
		symptoms: [
			'Dificultăți persistente în citit, scris sau calcul matematic',
			'Confuzie între litere sau cifre similare',
			'Dificultăți în înțelegerea textelor citite',
			'Scris dezordonat sau cu multe greșeli',
			'Probleme în memorarea faptelor matematice de bază',
			'Dificultăți în organizarea gândurilor în scris',
			'Evitarea sarcinilor școlare sau a cititului',
			'Discrepanță între inteligență și performanța școlară'
		],
		whenToSeekHelp: [
			'Dificultăți persistente în ciuda eforturilor și suportului',
			'Copilul rămâne semnificativ în urma colegilor la anumite materii',
			'Frustrare sau anxietate legată de școală',
			'Evitarea sarcinilor școlare sau a cititului',
			'Profesorii observă un decalaj între potențial și performanță',
			'Probleme de stimă de sine legate de performanța școlară'
		],
		treatments: [
			{
				name: 'Evaluare psihologică completă',
				description:
					'Testare standardizată pentru identificarea tipului specific de dificultate și a punctelor forte.'
			},
			{
				name: 'Terapie logopedică',
				description:
					'Pentru dislexie - tehnici specializate de remediere a cititului și scrisului.'
			},
			{
				name: 'Intervenție educațională',
				description:
					'Strategii personalizate de învățare și adaptări școlare recomandate.'
			},
			{
				name: 'Suport psihologic',
				description:
					'Gestionarea frustrării și construirea stimei de sine afectate de dificultăți.'
			}
		],
		specialists: ['Psiholog clinician', 'Logoped', 'Psihopedagog'],
		relatedProblems: [
			{ title: 'ADHD', href: '/ce-tratam/adhd' },
			{ title: 'Anxietate la copii', href: '/ce-tratam/anxietate-copii' },
			{ title: 'Întârzieri în dezvoltare', href: '/ce-tratam/intarzieri-dezvoltare' }
		],
		specialtyParam: 'psihologie-clinica'
	},

	// === ADULȚI ===
	{
		slug: 'depresie',
		title: 'Depresia',
		subtitle: 'Tulburări Depresive și de Dispoziție',
		category: 'adulti',
		icon: 'heart',
		shortDescription: 'Tratament complet pentru depresie și tulburări de dispoziție.',
		heroDescription:
			'Depresia este mai mult decât tristețe - este o condiție medicală serioasă care afectează modul în care te simți, gândești și funcționezi zilnic. Vestea bună este că depresia este foarte tratabilă. Cu combinația potrivită de terapie și, dacă este necesar, medicație, majoritatea oamenilor își recapătă bucuria de viață.',
		symptoms: [
			'Tristețe persistentă sau senzație de gol',
			'Pierderea interesului pentru activități plăcute anterior',
			'Modificări ale apetitului și greutății',
			'Probleme de somn (insomnie sau hipersomnie)',
			'Oboseală și lipsă de energie',
			'Sentimente de vinovăție sau inutilitate',
			'Dificultăți de concentrare și luare a deciziilor',
			'Gânduri recurente despre moarte sau suicid'
		],
		whenToSeekHelp: [
			'Simptomele persistă mai mult de două săptămâni',
			'Dificultăți în îndeplinirea sarcinilor zilnice',
			'Relațiile personale sau profesionale sunt afectate',
			'Gânduri de automutilare sau suicid',
			'Folosești alcool sau substanțe pentru a face față',
			'Simptomele fizice nu au explicație medicală'
		],
		treatments: [
			{
				name: 'Psihoterapie',
				description:
					'Terapia cognitiv-comportamentală și alte forme de terapie sunt foarte eficiente în tratarea depresiei.'
			},
			{
				name: 'Tratament medicamentos',
				description:
					'Antidepresivele pot ajuta la echilibrarea chimiei cerebrale și ameliorarea simptomelor.'
			},
			{
				name: 'Terapie combinată',
				description:
					'Combinația dintre psihoterapie și medicație oferă cele mai bune rezultate pentru mulți pacienți.'
			},
			{
				name: 'Modificări ale stilului de viață',
				description:
					'Exercițiul fizic, somnul regulat și alimentația sănătoasă susțin tratamentul.'
			}
		],
		specialists: ['Psihiatru', 'Psiholog clinician', 'Psihoterapeut'],
		relatedProblems: [
			{ title: 'Anxietate', href: '/ce-tratam/anxietate' },
			{ title: 'Tulburări de somn', href: '/ce-tratam/tulburari-somn' },
			{ title: 'Stres și Burnout', href: '/ce-tratam/stres-burnout' }
		],
		specialtyParam: 'psihiatrie-adulti'
	},
	{
		slug: 'anxietate',
		title: 'Anxietatea',
		subtitle: 'Tulburări Anxioase și Atacuri de Panică',
		category: 'adulti',
		icon: 'heart',
		shortDescription: 'Terapie pentru anxietate, atacuri de panică și fobii.',
		heroDescription:
			'Anxietatea este răspunsul natural al corpului la stres, dar când devine copleșitoare și interferează cu viața de zi cu zi, poate fi vorba de o tulburare anxioasă. Fie că te confrunți cu anxietate generalizată, atacuri de panică sau fobii specifice, tratamentul poate aduce o ameliorare semnificativă.',
		symptoms: [
			'Griji excesive și greu de controlat',
			'Neliniște sau senzație de tensiune',
			'Oboseală și dificultăți de concentrare',
			'Iritabilitate',
			'Tensiune musculară',
			'Probleme de somn',
			'Atacuri de panică (palpitații, transpirație, tremur)',
			'Evitarea situațiilor care provoacă anxietate'
		],
		whenToSeekHelp: [
			'Anxietatea interferează cu munca sau relațiile',
			'Experimentezi atacuri de panică',
			'Eviți situații normale din cauza fricii',
			'Simptomele fizice sunt frecvente (palpitații, amețeli)',
			'Folosești alcool sau substanțe pentru a te calma',
			'Te simți constant copleșit sau în pericol'
		],
		treatments: [
			{
				name: 'Terapie cognitiv-comportamentală',
				description:
					'Considerată standardul de aur pentru tratarea anxietății - te ajută să identifici și să schimbi patterns de gândire.'
			},
			{
				name: 'Tehnici de relaxare',
				description:
					'Respirație, mindfulness și relaxare musculară progresivă pentru gestionarea simptomelor.'
			},
			{
				name: 'Terapie de expunere',
				description:
					'Confruntarea treptată și controlată cu situațiile temute pentru a reduce reacțiile de anxietate.'
			},
			{
				name: 'Medicație anxiolitică',
				description:
					'Când este necesară, medicația poate oferi ameliorare pe termen scurt sau lung.'
			}
		],
		specialists: ['Psihiatru', 'Psiholog clinician', 'Psihoterapeut'],
		relatedProblems: [
			{ title: 'Depresie', href: '/ce-tratam/depresie' },
			{ title: 'Tulburări de somn', href: '/ce-tratam/tulburari-somn' },
			{ title: 'Stres și Burnout', href: '/ce-tratam/stres-burnout' }
		],
		specialtyParam: 'psihiatrie-adulti'
	},
	{
		slug: 'dependente',
		title: 'Dependențe',
		subtitle: 'Adicții și Comportamente Compulsive',
		category: 'adulti',
		icon: 'heart',
		shortDescription: 'Tratament pentru dependențe de substanțe și comportamente adictive.',
		heroDescription:
			'Dependența este o condiție complexă care afectează creierul și comportamentul. Fie că este vorba de alcool, substanțe sau comportamente compulsive (jocuri de noroc, internet), recuperarea este posibilă cu tratamentul adecvat. Oferim o abordare completă, fără judecată, axată pe recuperare și prevenirea recăderilor.',
		symptoms: [
			'Nevoia de cantități crescute pentru același efect (toleranță)',
			'Simptome de sevraj când întrerupi consumul',
			'Încercări nereușite de a reduce sau opri consumul',
			'Timp semnificativ petrecut obținând, folosind sau recuperându-te',
			'Neglijarea responsabilităților importante',
			'Continuarea consumului în ciuda consecințelor negative',
			'Renunțarea la activități plăcute din cauza consumului',
			'Ascunderea consumului de familie și prieteni'
		],
		whenToSeekHelp: [
			'Ai încercat să oprești singur, dar nu ai reușit',
			'Consumul afectează relațiile sau locul de muncă',
			'Experimentezi probleme de sănătate legate de consum',
			'Ai nevoie de substanță pentru a funcționa normal',
			'Familia sau prietenii își exprimă îngrijorarea',
			'Te confrunți cu probleme legale din cauza consumului'
		],
		treatments: [
			{
				name: 'Dezintoxicare supravegheată',
				description:
					'Gestionarea medicală a simptomelor de sevraj într-un mediu sigur și suportiv.'
			},
			{
				name: 'Terapie individuală',
				description:
					'Abordarea cauzelor profunde ale dependenței și dezvoltarea strategiilor de coping.'
			},
			{
				name: 'Prevenirea recăderilor',
				description:
					'Identificarea factorilor de risc și dezvoltarea unui plan de menținere a recuperării.'
			},
			{
				name: 'Suport farmacologic',
				description:
					'Medicație pentru reducerea poftei și gestionarea simptomelor de sevraj.'
			}
		],
		specialists: ['Psihiatru', 'Psiholog clinician', 'Psihoterapeut'],
		relatedProblems: [
			{ title: 'Depresie', href: '/ce-tratam/depresie' },
			{ title: 'Anxietate', href: '/ce-tratam/anxietate' },
			{ title: 'Stres și Burnout', href: '/ce-tratam/stres-burnout' }
		],
		specialtyParam: 'psihiatrie-adulti'
	},
	{
		slug: 'tulburari-somn',
		title: 'Tulburări de Somn',
		subtitle: 'Insomnie și Probleme de Somn',
		category: 'adulti',
		icon: 'brain',
		shortDescription: 'Soluții pentru insomnie și alte probleme de somn.',
		heroDescription:
			'Somnul de calitate este esențial pentru sănătatea fizică și mentală. Tulburările de somn pot avea cauze diverse - de la stres și anxietate la obiceiuri nesănătoase sau condiții medicale. Oferim evaluare completă și tratamente eficiente pentru a te ajuta să dormi din nou liniștit.',
		symptoms: [
			'Dificultăți în adormire (peste 30 minute)',
			'Treziri frecvente în timpul nopții',
			'Trezire prea devreme dimineața',
			'Somnolență excesivă în timpul zilei',
			'Oboseală persistentă în ciuda orelor suficiente de somn',
			'Iritabilitate și dificultăți de concentrare',
			'Anxietate legată de somn',
			'Dependență de somnifere'
		],
		whenToSeekHelp: [
			'Problemele de somn persistă mai mult de 3 săptămâni',
			'Calitatea vieții este afectată de lipsa somnului',
			'Ai dificultăți la muncă din cauza oboselii',
			'Te bazezi pe alcool sau medicamente pentru a dormi',
			'Ai simptome de anxietate sau depresie asociate',
			'Sforăitul sau pauzele în respirație în somn'
		],
		treatments: [
			{
				name: 'Terapie cognitiv-comportamentală pentru insomnie',
				description:
					'Considerată tratamentul de primă linie - abordează gândurile și comportamentele care mențin insomnia.'
			},
			{
				name: 'Igienă a somnului',
				description:
					'Stabilirea unor obiceiuri și a unui mediu favorabil somnului de calitate.'
			},
			{
				name: 'Tehnici de relaxare',
				description:
					'Metode pentru reducerea tensiunii și pregătirea corpului pentru somn.'
			},
			{
				name: 'Tratament medicamentos',
				description:
					'Când este necesar, pe termen scurt, pentru restabilirea pattern-ului de somn.'
			}
		],
		specialists: ['Psihiatru', 'Psiholog clinician'],
		relatedProblems: [
			{ title: 'Anxietate', href: '/ce-tratam/anxietate' },
			{ title: 'Depresie', href: '/ce-tratam/depresie' },
			{ title: 'Stres și Burnout', href: '/ce-tratam/stres-burnout' }
		],
		specialtyParam: 'psihiatrie-adulti'
	},
	{
		slug: 'stres-burnout',
		title: 'Stres și Burnout',
		subtitle: 'Epuizare Profesională și Suprasolicitare',
		category: 'adulti',
		icon: 'heart',
		shortDescription: 'Recuperare din burnout și gestionarea stresului cronic.',
		heroDescription:
			'Burnout-ul este o stare de epuizare fizică, emoțională și mentală cauzată de stres prelungit. Nu este doar "oboseală" - este o condiție serioasă care necesită atenție. Cu suportul potrivit, poți să-ți recapeți energia, motivația și bucuria în viață și muncă.',
		symptoms: [
			'Epuizare fizică și emoțională persistentă',
			'Cinism sau detașare față de muncă',
			'Scăderea performanței profesionale',
			'Senzația că eforturile tale nu contează',
			'Dificultăți de concentrare și memorie',
			'Probleme de somn',
			'Simptome fizice (dureri de cap, tensiune musculară)',
			'Izolare socială și iritabilitate'
		],
		whenToSeekHelp: [
			'Epuizarea nu dispare nici după odihnă',
			'Performanța la muncă scade semnificativ',
			'Relațiile personale sunt afectate',
			'Ai simptome de anxietate sau depresie',
			'Folosești alcool sau alte substanțe pentru a face față',
			'Te simți prins într-o situație fără ieșire'
		],
		treatments: [
			{
				name: 'Psihoterapie',
				description:
					'Identificarea factorilor care au dus la burnout și dezvoltarea strategiilor de recuperare.'
			},
			{
				name: 'Coaching pentru echilibru',
				description:
					'Stabilirea priorităților, limitelor și a unui stil de viață sustenabil.'
			},
			{
				name: 'Tehnici de management al stresului',
				description:
					'Instrumente practice pentru gestionarea presiunii și prevenirea recidivei.'
			},
			{
				name: 'Suport pentru reintegrare',
				description:
					'Planificarea revenirii la muncă într-un mod sănătos și sustenabil.'
			}
		],
		specialists: ['Psiholog clinician', 'Psihoterapeut', 'Psihiatru'],
		relatedProblems: [
			{ title: 'Depresie', href: '/ce-tratam/depresie' },
			{ title: 'Anxietate', href: '/ce-tratam/anxietate' },
			{ title: 'Tulburări de somn', href: '/ce-tratam/tulburari-somn' }
		],
		specialtyParam: 'psihologie-clinica'
	}
];

export function getProblemBySlug(slug: string): Problem | undefined {
	return problems.find((p) => p.slug === slug);
}

export function getProblemsByCategory(category: 'copii' | 'adulti'): Problem[] {
	return problems.filter((p) => p.category === category);
}
