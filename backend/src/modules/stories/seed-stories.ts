export type SeedStory = {
  title: string;
  level: string;
  language: string;
  contentTarget: string;
  contentEnglish: string;
  words: Record<string, string>;
  sentences: Array<{ target: string; english: string }>;
};

export const SEED_STORIES: SeedStory[] = [
  // —— Spanish ——
  {
    title: 'La Cafetería de Sofía',
    level: 'A1',
    language: 'Spanish',
    contentTarget:
      "Sofía va a la cafetería todas las mañanas. Ella compra un café con leche y un cruasán. El camarero le sonríe y le dice: '¡Buenos días!'. Sofía paga cinco euros y se sienta cerca de la ventana. Le gusta leer su libro mientras bebe el café caliente.",
    contentEnglish:
      "Sofía goes to the coffee shop every morning. She buys a coffee with milk and a croissant. The waiter smiles at her and says: 'Good morning!'. Sofía pays five euros and sits near the window. She likes to read her book while drinking the hot coffee.",
    words: {
      cafetería: 'coffee shop',
      mañanas: 'mornings',
      compra: 'buys',
      'café con leche': 'coffee with milk',
      cruasán: 'croissant',
      camarero: 'waiter',
      sonríe: 'smiles',
      paga: 'pays',
      ventana: 'window',
      caliente: 'hot',
    },
    sentences: [
      {
        target: 'Sofía va a la cafetería todas las mañanas.',
        english: 'Sofía goes to the coffee shop every morning.',
      },
      {
        target: 'Ella compra un café con leche y un cruasán.',
        english: 'She buys a coffee with milk and a croissant.',
      },
      {
        target: "El camarero le sonríe y le dice: '¡Buenos días!'",
        english: "The waiter smiles at her and says: 'Good morning!'",
      },
      {
        target: 'Sofía paga cinco euros y se sienta cerca de la ventana.',
        english: 'Sofía pays five euros and sits near the window.',
      },
      {
        target: 'Le gusta leer su libro mientras bebe el café caliente.',
        english:
          'She likes to read her book while drinking the hot coffee.',
      },
    ],
  },
  {
    title: 'Un Viaje en Tren',
    level: 'A2',
    language: 'Spanish',
    contentTarget:
      'Mateo tiene un billete para viajar de Madrid a Barcelona en tren. El tren sale de la estación a las ocho en punto. Durante el viaje, mira por la ventana y ve campos hermosos. A su lado, un hombre lee un periódico en catalán. Mateo llega cansado pero muy emocionado por ver a sus amigos.',
    contentEnglish:
      "Mateo has a ticket to travel from Madrid to Barcelona by train. The train leaves the station at exactly eight o'clock. During the trip, he looks out the window and sees beautiful fields. Next to him, a man reads a newspaper in Catalan. Mateo arrives tired but very excited to see his friends.",
    words: {
      billete: 'ticket',
      viajar: 'to travel',
      sale: 'leaves',
      estación: 'station',
      campos: 'fields',
      hermosos: 'beautiful',
      'al lado': 'next to',
      periódico: 'newspaper',
      cansado: 'tired',
      emocionado: 'excited',
    },
    sentences: [
      {
        target:
          'Mateo tiene un billete para viajar de Madrid a Barcelona en tren.',
        english:
          'Mateo has a ticket to travel from Madrid to Barcelona by train.',
      },
      {
        target: 'El tren sale de la estación a las ocho en punto.',
        english: "The train leaves the station at exactly eight o'clock.",
      },
      {
        target:
          'Durante el viaje, mira por la ventana y ve campos hermosos.',
        english:
          'During the trip, he looks out the window and sees beautiful fields.',
      },
      {
        target: 'A su lado, un hombre lee un periódico en catalán.',
        english: 'Next to him, a man reads a newspaper in Catalan.',
      },
      {
        target:
          'Mateo llega cansado pero muy emocionado por ver a sus amigos.',
        english:
          'Mateo arrives tired but very excited to see his friends.',
      },
    ],
  },
  {
    title: 'El Misterio del Parque',
    level: 'B1',
    language: 'Spanish',
    contentTarget:
      'Ayer por la tarde, Laura caminaba por el parque cuando escuchó un ladrido suave. Detrás de un gran roble, encontró a un pequeño perro de color marrón. El perro parecía asustado y no tenía ningún collar con el nombre de su dueño. Laura decidió llevarlo a una clínica veterinaria cercana para ver si tenía microchip. Afortunadamente, el veterinario encontró la información y llamó a la dueña, quien estaba llorando de alegría.',
    contentEnglish:
      'Yesterday afternoon, Laura was walking through the park when she heard a soft bark. Behind a large oak tree, she found a small brown dog. The dog seemed scared and did not have any collar with his owner\'s name. Laura decided to take him to a nearby veterinary clinic to see if he had a microchip. Fortunately, the veterinarian found the information and called the owner, who was crying with joy.',
    words: {
      caminaba: 'was walking',
      ladrido: 'bark',
      roble: 'oak tree',
      asustado: 'scared',
      collar: 'collar',
      dueño: 'owner',
      llevarlo: 'to take him',
      cercana: 'nearby',
      afortunadamente: 'fortunately',
      llorando: 'crying',
    },
    sentences: [
      {
        target:
          'Ayer por la tarde, Laura caminaba por el parque cuando escuchó un ladrido suave.',
        english:
          'Yesterday afternoon, Laura was walking through the park when she heard a soft bark.',
      },
      {
        target:
          'Detrás de un gran roble, encontró a un pequeño perro de color marrón.',
        english: 'Behind a large oak tree, she found a small brown dog.',
      },
      {
        target:
          'El perro parecía asustado y no tenía ningún collar con el nombre de su dueño.',
        english:
          "The dog seemed scared and did not have any collar with his owner's name.",
      },
      {
        target:
          'Laura decidió llevarlo a una clínica veterinaria cercana para ver si tenía microchip.',
        english:
          'Laura decided to take him to a nearby veterinary clinic to see if he had a microchip.',
      },
      {
        target:
          'Afortunadamente, el veterinario encontró la información y llamó a la dueña, quien estaba llorando de alegría.',
        english:
          'Fortunately, the veterinarian found the information and called the owner, who was crying with joy.',
      },
    ],
  },
  {
    title: 'El Futuro del Planeta',
    level: 'B2',
    language: 'Spanish',
    contentTarget:
      'A pesar de los desafíos ecológicos, el uso de energías renovables ha aumentado considerablemente. Los científicos insisten en que debemos reducir drásticamente nuestra dependencia de los combustibles fósiles. Muchos países están invirtiendo en infraestructura solar y eólica para mitigar el cambio climático. No obstante, la transición ecológica requiere un compromiso tanto político como ciudadano a gran escala. Si no actuamos con urgencia, las futuras generaciones sufrirán las consecuencias de nuestra inacción.',
    contentEnglish:
      'Despite ecological challenges, the use of renewable energy has increased considerably. Scientists insist that we must drastically reduce our dependence on fossil fuels. Many countries are investing in solar and wind infrastructure to mitigate climate change. However, the ecological transition requires both political and citizen commitment on a large scale. If we do not act urgently, future generations will suffer the consequences of our inaction.',
    words: {
      desafíos: 'challenges',
      renovables: 'renewable',
      aumentado: 'increased',
      insisten: 'insist',
      'combustibles fósiles': 'fossil fuels',
      invirtiendo: 'investing',
      eólica: 'wind',
      mitigar: 'mitigate',
      'no obstante': 'however',
      inacción: 'inaction',
    },
    sentences: [
      {
        target:
          'A pesar de los desafíos ecológicos, el uso de energías renovables ha aumentado considerablemente.',
        english:
          'Despite ecological challenges, the use of renewable energy has increased considerably.',
      },
      {
        target:
          'Los científicos insisten en que debemos reducir drásticamente nuestra dependencia de los combustibles fósiles.',
        english:
          'Scientists insist that we must drastically reduce our dependence on fossil fuels.',
      },
      {
        target:
          'Muchos países están invirtiendo en infraestructura solar y eólica para mitigar el cambio climático.',
        english:
          'Many countries are investing in solar and wind infrastructure to mitigate climate change.',
      },
      {
        target:
          'No obstante, la transición ecológica requiere un compromiso tanto político como ciudadano a gran escala.',
        english:
          'However, the ecological transition requires both political and citizen commitment on a large scale.',
      },
      {
        target:
          'Si no actuamos con urgencia, las futuras generaciones sufrirán las consecuencias de nuestra inacción.',
        english:
          'If we do not act urgently, future generations will suffer the consequences of our inaction.',
      },
    ],
  },

  // —— French ——
  {
    title: 'Le Café de Sophie',
    level: 'A1',
    language: 'French',
    contentTarget:
      "Sophie va au café tous les matins. Elle achète un café au lait et un croissant. Le serveur lui sourit et dit : « Bonjour ! ». Sophie paie cinq euros et s'assoit près de la fenêtre. Elle aime lire son livre en buvant le café chaud.",
    contentEnglish:
      'Sophie goes to the café every morning. She buys a coffee with milk and a croissant. The waiter smiles at her and says: "Hello!". Sophie pays five euros and sits near the window. She likes to read her book while drinking the hot coffee.',
    words: {
      café: 'café / coffee',
      matins: 'mornings',
      achète: 'buys',
      'café au lait': 'coffee with milk',
      croissant: 'croissant',
      serveur: 'waiter',
      sourit: 'smiles',
      paie: 'pays',
      fenêtre: 'window',
      chaud: 'hot',
    },
    sentences: [
      {
        target: 'Sophie va au café tous les matins.',
        english: 'Sophie goes to the café every morning.',
      },
      {
        target: 'Elle achète un café au lait et un croissant.',
        english: 'She buys a coffee with milk and a croissant.',
      },
      {
        target: 'Le serveur lui sourit et dit : « Bonjour ! ».',
        english: 'The waiter smiles at her and says: "Hello!".',
      },
      {
        target: "Sophie paie cinq euros et s'assoit près de la fenêtre.",
        english: 'Sophie pays five euros and sits near the window.',
      },
      {
        target: 'Elle aime lire son livre en buvant le café chaud.',
        english:
          'She likes to read her book while drinking the hot coffee.',
      },
    ],
  },
  {
    title: 'Un Voyage en Train',
    level: 'A2',
    language: 'French',
    contentTarget:
      "Marc a un billet pour voyager de Paris à Lyon en train. Le train quitte la gare à huit heures précises. Pendant le voyage, il regarde par la fenêtre et voit de beaux champs. À côté de lui, une femme lit un journal. Marc arrive fatigué mais très content de voir ses amis.",
    contentEnglish:
      'Marc has a ticket to travel from Paris to Lyon by train. The train leaves the station at exactly eight o\'clock. During the trip, he looks out the window and sees beautiful fields. Next to him, a woman reads a newspaper. Marc arrives tired but very happy to see his friends.',
    words: {
      billet: 'ticket',
      voyager: 'to travel',
      quitte: 'leaves',
      gare: 'station',
      champs: 'fields',
      beaux: 'beautiful',
      'à côté': 'next to',
      journal: 'newspaper',
      fatigué: 'tired',
      content: 'happy',
    },
    sentences: [
      {
        target: 'Marc a un billet pour voyager de Paris à Lyon en train.',
        english:
          'Marc has a ticket to travel from Paris to Lyon by train.',
      },
      {
        target: 'Le train quitte la gare à huit heures précises.',
        english: "The train leaves the station at exactly eight o'clock.",
      },
      {
        target:
          'Pendant le voyage, il regarde par la fenêtre et voit de beaux champs.',
        english:
          'During the trip, he looks out the window and sees beautiful fields.',
      },
      {
        target: 'À côté de lui, une femme lit un journal.',
        english: 'Next to him, a woman reads a newspaper.',
      },
      {
        target:
          'Marc arrive fatigué mais très content de voir ses amis.',
        english:
          'Marc arrives tired but very happy to see his friends.',
      },
    ],
  },
  {
    title: 'Le Mystère du Parc',
    level: 'B1',
    language: 'French',
    contentTarget:
      "Hier après-midi, Claire se promenait dans le parc quand elle a entendu un aboiement doux. Derrière un grand chêne, elle a trouvé un petit chien brun. Le chien semblait effrayé et n'avait aucun collier avec le nom de son propriétaire. Claire a décidé de l'emmener dans une clinique vétérinaire proche pour voir s'il avait une puce. Heureusement, le vétérinaire a trouvé les informations et a appelé la propriétaire, qui pleurait de joie.",
    contentEnglish:
      'Yesterday afternoon, Claire was walking in the park when she heard a soft bark. Behind a large oak tree, she found a small brown dog. The dog seemed scared and had no collar with its owner\'s name. Claire decided to take him to a nearby veterinary clinic to see if he had a microchip. Fortunately, the veterinarian found the information and called the owner, who was crying with joy.',
    words: {
      promenait: 'was walking',
      aboiement: 'bark',
      chêne: 'oak tree',
      effrayé: 'scared',
      collier: 'collar',
      propriétaire: 'owner',
      emmener: 'to take',
      proche: 'nearby',
      heureusement: 'fortunately',
      pleurait: 'was crying',
    },
    sentences: [
      {
        target:
          'Hier après-midi, Claire se promenait dans le parc quand elle a entendu un aboiement doux.',
        english:
          'Yesterday afternoon, Claire was walking in the park when she heard a soft bark.',
      },
      {
        target:
          'Derrière un grand chêne, elle a trouvé un petit chien brun.',
        english: 'Behind a large oak tree, she found a small brown dog.',
      },
      {
        target:
          "Le chien semblait effrayé et n'avait aucun collier avec le nom de son propriétaire.",
        english:
          "The dog seemed scared and had no collar with its owner's name.",
      },
      {
        target:
          "Claire a décidé de l'emmener dans une clinique vétérinaire proche pour voir s'il avait une puce.",
        english:
          'Claire decided to take him to a nearby veterinary clinic to see if he had a microchip.',
      },
      {
        target:
          'Heureusement, le vétérinaire a trouvé les informations et a appelé la propriétaire, qui pleurait de joie.',
        english:
          'Fortunately, the veterinarian found the information and called the owner, who was crying with joy.',
      },
    ],
  },
  {
    title: "L'Avenir de la Planète",
    level: 'B2',
    language: 'French',
    contentTarget:
      "Malgré les défis écologiques, l'utilisation des énergies renouvelables a considérablement augmenté. Les scientifiques insistent sur le fait que nous devons réduire drastiquement notre dépendance aux combustibles fossiles. De nombreux pays investissent dans les infrastructures solaires et éoliennes pour atténuer le changement climatique. Néanmoins, la transition écologique exige un engagement politique et citoyen à grande échelle. Si nous n'agissons pas urgemment, les générations futures souffriront des conséquences de notre inaction.",
    contentEnglish:
      'Despite ecological challenges, the use of renewable energy has increased considerably. Scientists insist that we must drastically reduce our dependence on fossil fuels. Many countries are investing in solar and wind infrastructure to mitigate climate change. Nevertheless, the ecological transition requires political and citizen commitment on a large scale. If we do not act urgently, future generations will suffer the consequences of our inaction.',
    words: {
      défis: 'challenges',
      renouvelables: 'renewable',
      augmenté: 'increased',
      insistent: 'insist',
      'combustibles fossiles': 'fossil fuels',
      investissent: 'invest',
      éoliennes: 'wind',
      atténuer: 'mitigate',
      néanmoins: 'nevertheless',
      inaction: 'inaction',
    },
    sentences: [
      {
        target:
          "Malgré les défis écologiques, l'utilisation des énergies renouvelables a considérablement augmenté.",
        english:
          'Despite ecological challenges, the use of renewable energy has increased considerably.',
      },
      {
        target:
          'Les scientifiques insistent sur le fait que nous devons réduire drastiquement notre dépendance aux combustibles fossiles.',
        english:
          'Scientists insist that we must drastically reduce our dependence on fossil fuels.',
      },
      {
        target:
          'De nombreux pays investissent dans les infrastructures solaires et éoliennes pour atténuer le changement climatique.',
        english:
          'Many countries are investing in solar and wind infrastructure to mitigate climate change.',
      },
      {
        target:
          'Néanmoins, la transition écologique exige un engagement politique et citoyen à grande échelle.',
        english:
          'Nevertheless, the ecological transition requires political and citizen commitment on a large scale.',
      },
      {
        target:
          "Si nous n'agissons pas urgemment, les générations futures souffriront des conséquences de notre inaction.",
        english:
          'If we do not act urgently, future generations will suffer the consequences of our inaction.',
      },
    ],
  },

  // —— German ——
  {
    title: 'Sofias Café',
    level: 'A1',
    language: 'German',
    contentTarget:
      'Sofia geht jeden Morgen ins Café. Sie kauft einen Milchkaffee und ein Croissant. Der Kellner lächelt und sagt: „Guten Morgen!“. Sofia bezahlt fünf Euro und setzt sich ans Fenster. Sie liest gerne ihr Buch, während sie den heißen Kaffee trinkt.',
    contentEnglish:
      'Sofia goes to the café every morning. She buys a coffee with milk and a croissant. The waiter smiles and says: "Good morning!". Sofia pays five euros and sits by the window. She likes to read her book while drinking the hot coffee.',
    words: {
      Morgen: 'morning',
      Café: 'café',
      kauft: 'buys',
      Milchkaffee: 'coffee with milk',
      Croissant: 'croissant',
      Kellner: 'waiter',
      lächelt: 'smiles',
      bezahlt: 'pays',
      Fenster: 'window',
      heißen: 'hot',
    },
    sentences: [
      {
        target: 'Sofia geht jeden Morgen ins Café.',
        english: 'Sofia goes to the café every morning.',
      },
      {
        target: 'Sie kauft einen Milchkaffee und ein Croissant.',
        english: 'She buys a coffee with milk and a croissant.',
      },
      {
        target: 'Der Kellner lächelt und sagt: „Guten Morgen!“.',
        english: 'The waiter smiles and says: "Good morning!".',
      },
      {
        target: 'Sofia bezahlt fünf Euro und setzt sich ans Fenster.',
        english: 'Sofia pays five euros and sits by the window.',
      },
      {
        target:
          'Sie liest gerne ihr Buch, während sie den heißen Kaffee trinkt.',
        english:
          'She likes to read her book while drinking the hot coffee.',
      },
    ],
  },
  {
    title: 'Eine Zugreise',
    level: 'A2',
    language: 'German',
    contentTarget:
      'Markus hat ein Ticket für die Fahrt von Berlin nach München. Der Zug fährt pünktlich um acht Uhr ab. Während der Reise schaut er aus dem Fenster und sieht schöne Felder. Neben ihm liest eine Frau eine Zeitung. Markus kommt müde an, ist aber sehr froh, seine Freunde zu sehen.',
    contentEnglish:
      'Markus has a ticket for the trip from Berlin to Munich. The train leaves on time at eight o\'clock. During the journey he looks out the window and sees beautiful fields. Next to him a woman reads a newspaper. Markus arrives tired but is very happy to see his friends.',
    words: {
      Ticket: 'ticket',
      Fahrt: 'trip',
      fährt: 'leaves / drives',
      pünktlich: 'on time',
      Felder: 'fields',
      schöne: 'beautiful',
      'neben ihm': 'next to him',
      Zeitung: 'newspaper',
      müde: 'tired',
      froh: 'happy',
    },
    sentences: [
      {
        target:
          'Markus hat ein Ticket für die Fahrt von Berlin nach München.',
        english:
          'Markus has a ticket for the trip from Berlin to Munich.',
      },
      {
        target: 'Der Zug fährt pünktlich um acht Uhr ab.',
        english: "The train leaves on time at eight o'clock.",
      },
      {
        target:
          'Während der Reise schaut er aus dem Fenster und sieht schöne Felder.',
        english:
          'During the journey he looks out the window and sees beautiful fields.',
      },
      {
        target: 'Neben ihm liest eine Frau eine Zeitung.',
        english: 'Next to him a woman reads a newspaper.',
      },
      {
        target:
          'Markus kommt müde an, ist aber sehr froh, seine Freunde zu sehen.',
        english:
          'Markus arrives tired but is very happy to see his friends.',
      },
    ],
  },
  {
    title: 'Das Geheimnis im Park',
    level: 'B1',
    language: 'German',
    contentTarget:
      'Gestern Nachmittag ging Laura im Park spazieren, als sie ein leises Bellen hörte. Hinter einer großen Eiche fand sie einen kleinen braunen Hund. Der Hund wirkte ängstlich und trug kein Halsband mit dem Namen des Besitzers. Laura brachte ihn zu einer nahegelegenen Tierklinik, um zu prüfen, ob er einen Chip hatte. Glücklicherweise fand der Tierarzt die Informationen und rief die Besitzerin an, die vor Freude weinte.',
    contentEnglish:
      'Yesterday afternoon Laura was walking in the park when she heard a soft bark. Behind a large oak tree she found a small brown dog. The dog seemed scared and had no collar with the owner\'s name. Laura took him to a nearby veterinary clinic to check if he had a microchip. Fortunately the veterinarian found the information and called the owner, who was crying with joy.',
    words: {
      spazieren: 'to walk',
      Bellen: 'bark',
      Eiche: 'oak tree',
      ängstlich: 'scared',
      Halsband: 'collar',
      Besitzer: 'owner',
      nahegelegenen: 'nearby',
      prüfen: 'to check',
      Glücklicherweise: 'fortunately',
      Freude: 'joy',
    },
    sentences: [
      {
        target:
          'Gestern Nachmittag ging Laura im Park spazieren, als sie ein leises Bellen hörte.',
        english:
          'Yesterday afternoon Laura was walking in the park when she heard a soft bark.',
      },
      {
        target:
          'Hinter einer großen Eiche fand sie einen kleinen braunen Hund.',
        english: 'Behind a large oak tree she found a small brown dog.',
      },
      {
        target:
          'Der Hund wirkte ängstlich und trug kein Halsband mit dem Namen des Besitzers.',
        english:
          "The dog seemed scared and had no collar with the owner's name.",
      },
      {
        target:
          'Laura brachte ihn zu einer nahegelegenen Tierklinik, um zu prüfen, ob er einen Chip hatte.',
        english:
          'Laura took him to a nearby veterinary clinic to check if he had a microchip.',
      },
      {
        target:
          'Glücklicherweise fand der Tierarzt die Informationen und rief die Besitzerin an, die vor Freude weinte.',
        english:
          'Fortunately the veterinarian found the information and called the owner, who was crying with joy.',
      },
    ],
  },
  {
    title: 'Die Zukunft des Planeten',
    level: 'B2',
    language: 'German',
    contentTarget:
      'Trotz ökologischer Herausforderungen hat die Nutzung erneuerbarer Energien erheblich zugenommen. Wissenschaftler bestehen darauf, dass wir unsere Abhängigkeit von fossilen Brennstoffen drastisch reduzieren müssen. Viele Länder investieren in Solar- und Windinfrastruktur, um den Klimawandel abzuschwächen. Dennoch erfordert die ökologische Wende ein politisches und gesellschaftliches Engagement im großen Maßstab. Wenn wir nicht dringend handeln, werden künftige Generationen die Folgen unserer Untätigkeit tragen.',
    contentEnglish:
      'Despite ecological challenges, the use of renewable energy has increased considerably. Scientists insist that we must drastically reduce our dependence on fossil fuels. Many countries are investing in solar and wind infrastructure to mitigate climate change. Nevertheless, the ecological transition requires political and social commitment on a large scale. If we do not act urgently, future generations will bear the consequences of our inaction.',
    words: {
      Herausforderungen: 'challenges',
      erneuerbarer: 'renewable',
      zugenommen: 'increased',
      bestehen: 'insist',
      'fossilen Brennstoffen': 'fossil fuels',
      investieren: 'invest',
      abzuschwächen: 'to mitigate',
      Dennoch: 'nevertheless',
      Engagement: 'commitment',
      Untätigkeit: 'inaction',
    },
    sentences: [
      {
        target:
          'Trotz ökologischer Herausforderungen hat die Nutzung erneuerbarer Energien erheblich zugenommen.',
        english:
          'Despite ecological challenges, the use of renewable energy has increased considerably.',
      },
      {
        target:
          'Wissenschaftler bestehen darauf, dass wir unsere Abhängigkeit von fossilen Brennstoffen drastisch reduzieren müssen.',
        english:
          'Scientists insist that we must drastically reduce our dependence on fossil fuels.',
      },
      {
        target:
          'Viele Länder investieren in Solar- und Windinfrastruktur, um den Klimawandel abzuschwächen.',
        english:
          'Many countries are investing in solar and wind infrastructure to mitigate climate change.',
      },
      {
        target:
          'Dennoch erfordert die ökologische Wende ein politisches und gesellschaftliches Engagement im großen Maßstab.',
        english:
          'Nevertheless, the ecological transition requires political and social commitment on a large scale.',
      },
      {
        target:
          'Wenn wir nicht dringend handeln, werden künftige Generationen die Folgen unserer Untätigkeit tragen.',
        english:
          'If we do not act urgently, future generations will bear the consequences of our inaction.',
      },
    ],
  },

  // —— Japanese ——
  {
    title: 'ソフィアのカフェ',
    level: 'A1',
    language: 'Japanese',
    contentTarget:
      'ソフィアは毎朝カフェに行きます。彼女はカフェオレとクロワッサンを買います。店員がほほえんで「おはようございます」と言います。ソフィアは五ユーロを払って窓の近くに座ります。彼女は熱いコーヒーを飲みながら本を読むのが好きです。',
    contentEnglish:
      'Sophia goes to the café every morning. She buys a café au lait and a croissant. The staff member smiles and says "Good morning." Sophia pays five euros and sits near the window. She likes to read a book while drinking hot coffee.',
    words: {
      毎朝: 'every morning',
      カフェ: 'café',
      買います: 'buys',
      カフェオレ: 'café au lait',
      クロワッサン: 'croissant',
      店員: 'staff / clerk',
      ほほえんで: 'smiling',
      払って: 'pays and…',
      窓: 'window',
      熱い: 'hot',
    },
    sentences: [
      {
        target: 'ソフィアは毎朝カフェに行きます。',
        english: 'Sophia goes to the café every morning.',
      },
      {
        target: '彼女はカフェオレとクロワッサンを買います。',
        english: 'She buys a café au lait and a croissant.',
      },
      {
        target: '店員がほほえんで「おはようございます」と言います。',
        english: 'The staff member smiles and says "Good morning."',
      },
      {
        target: 'ソフィアは五ユーロを払って窓の近くに座ります。',
        english: 'Sophia pays five euros and sits near the window.',
      },
      {
        target:
          '彼女は熱いコーヒーを飲みながら本を読むのが好きです。',
        english:
          'She likes to read a book while drinking hot coffee.',
      },
    ],
  },
  {
    title: '電車の旅',
    level: 'A2',
    language: 'Japanese',
    contentTarget:
      'マテオはマドリードからバルセロナへ行く電車の切符を持っています。電車は八時ちょうどに駅を出発します。旅の間、彼は窓の外を見て美しい野原を眺めます。隣では男性が新聞を読んでいます。マテオは疲れていますが、友達に会えるのでとてもうれしいです。',
    contentEnglish:
      'Mateo has a train ticket from Madrid to Barcelona. The train leaves the station at exactly eight o\'clock. During the trip he looks out the window at beautiful fields. Next to him a man is reading a newspaper. Mateo is tired but very happy to see his friends.',
    words: {
      切符: 'ticket',
      電車: 'train',
      出発します: 'departs',
      駅: 'station',
      野原: 'fields',
      美しい: 'beautiful',
      隣: 'next to',
      新聞: 'newspaper',
      疲れています: 'is tired',
      うれしい: 'happy',
    },
    sentences: [
      {
        target:
          'マテオはマドリードからバルセロナへ行く電車の切符を持っています。',
        english: 'Mateo has a train ticket from Madrid to Barcelona.',
      },
      {
        target: '電車は八時ちょうどに駅を出発します。',
        english: "The train leaves the station at exactly eight o'clock.",
      },
      {
        target:
          '旅の間、彼は窓の外を見て美しい野原を眺めます。',
        english:
          'During the trip he looks out the window at beautiful fields.',
      },
      {
        target: '隣では男性が新聞を読んでいます。',
        english: 'Next to him a man is reading a newspaper.',
      },
      {
        target:
          'マテオは疲れていますが、友達に会えるのでとてもうれしいです。',
        english:
          'Mateo is tired but very happy to see his friends.',
      },
    ],
  },
  {
    title: '公園のなぞ',
    level: 'B1',
    language: 'Japanese',
    contentTarget:
      '昨日の午後、ローラが公園を歩いていると、小さなほえ声が聞こえました。大きな樫の木の後ろに、茶色い子犬がいました。犬は怖がっているようで、飼い主の名前が書いてある首輪もありませんでした。ローラは近くの動物病院に連れて行き、マイクロチップがあるか確認しました。幸い、獣医が情報を見つけ、飼い主に電話しました。飼い主は喜んで泣いていました。',
    contentEnglish:
      'Yesterday afternoon, while Laura was walking in the park, she heard a soft bark. Behind a large oak tree was a small brown puppy. The dog seemed scared and had no collar with the owner\'s name. Laura took it to a nearby animal hospital to check for a microchip. Fortunately the vet found the information and called the owner, who cried with joy.',
    words: {
      午後: 'afternoon',
      ほえ声: 'bark',
      樫: 'oak',
      怖がっている: 'scared',
      首輪: 'collar',
      飼い主: 'owner',
      連れて行き: 'take (someone)',
      確認しました: 'confirmed / checked',
      幸い: 'fortunately',
      喜んで: 'happily / with joy',
    },
    sentences: [
      {
        target:
          '昨日の午後、ローラが公園を歩いていると、小さなほえ声が聞こえました。',
        english:
          'Yesterday afternoon, while Laura was walking in the park, she heard a soft bark.',
      },
      {
        target: '大きな樫の木の後ろに、茶色い子犬がいました。',
        english: 'Behind a large oak tree was a small brown puppy.',
      },
      {
        target:
          '犬は怖がっているようで、飼い主の名前が書いてある首輪もありませんでした。',
        english:
          "The dog seemed scared and had no collar with the owner's name.",
      },
      {
        target:
          'ローラは近くの動物病院に連れて行き、マイクロチップがあるか確認しました。',
        english:
          'Laura took it to a nearby animal hospital to check for a microchip.',
      },
      {
        target:
          '幸い、獣医が情報を見つけ、飼い主に電話しました。',
        english:
          'Fortunately the vet found the information and called the owner.',
      },
    ],
  },
  {
    title: '地球の未来',
    level: 'B2',
    language: 'Japanese',
    contentTarget:
      '環境の課題があるにもかかわらず、再生可能エネルギーの利用は大幅に増えています。科学者たちは、化石燃料への依存を大幅に減らさなければならないと主張しています。多くの国が気候変動を緩和するため、太陽光と風力のインフラに投資しています。しかし、環境への移行には政治と市民の大きな規模での取り組みが必要です。急いで行動しなければ、将来の世代が私たちの不作為の結果を負うことになるでしょう。',
    contentEnglish:
      'Despite environmental challenges, the use of renewable energy has increased considerably. Scientists insist that we must drastically reduce dependence on fossil fuels. Many countries are investing in solar and wind infrastructure to mitigate climate change. However, the ecological transition requires large-scale political and citizen commitment. If we do not act urgently, future generations will bear the consequences of our inaction.',
    words: {
      課題: 'challenges',
      再生可能エネルギー: 'renewable energy',
      増えています: 'is increasing',
      主張しています: 'insist / claim',
      化石燃料: 'fossil fuels',
      投資しています: 'are investing',
      緩和する: 'to mitigate',
      移行: 'transition',
      取り組み: 'effort / commitment',
      不作為: 'inaction',
    },
    sentences: [
      {
        target:
          '環境の課題があるにもかかわらず、再生可能エネルギーの利用は大幅に増えています。',
        english:
          'Despite environmental challenges, the use of renewable energy has increased considerably.',
      },
      {
        target:
          '科学者たちは、化石燃料への依存を大幅に減らさなければならないと主張しています。',
        english:
          'Scientists insist that we must drastically reduce dependence on fossil fuels.',
      },
      {
        target:
          '多くの国が気候変動を緩和するため、太陽光と風力のインフラに投資しています。',
        english:
          'Many countries are investing in solar and wind infrastructure to mitigate climate change.',
      },
      {
        target:
          'しかし、環境への移行には政治と市民の大きな規模での取り組みが必要です。',
        english:
          'However, the ecological transition requires large-scale political and citizen commitment.',
      },
      {
        target:
          '急いで行動しなければ、将来の世代が私たちの不作為の結果を負うことになるでしょう。',
        english:
          'If we do not act urgently, future generations will bear the consequences of our inaction.',
      },
    ],
  },
];
