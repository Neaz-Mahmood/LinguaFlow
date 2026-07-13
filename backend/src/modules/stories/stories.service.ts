import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Story } from '../../entities/story.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class StoriesService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedDatabase();
  }

  async seedDatabase() {
    const count = await this.storiesRepository.count();
    if (count > 0) {
      console.log('Database already contains stories. Skipping seed.');
      return;
    }

    console.log('Seeding initial stories into PostgreSQL...');
    const storiesData = [
      {
        title: 'La Cafetería de Sofía',
        level: 'A1',
        contentTarget: 'Sofía va a la cafetería todas las mañanas. Ella compra un café con leche y un cruasán. El camarero le sonríe y le dice: \'¡Buenos días!\'. Sofía paga cinco euros y se sienta cerca de la ventana. Le gusta leer su libro mientras bebe el café caliente.',
        contentEnglish: 'Sofía goes to the coffee shop every morning. She buys a coffee with milk and a croissant. The waiter smiles at her and says: \'Good morning!\'. Sofía pays five euros and sits near the window. She likes to read her book while drinking the hot coffee.',
        wordsJson: JSON.stringify({
          cafetería: 'coffee shop',
          mañanas: 'mornings',
          compra: 'buys',
          'café con leche': 'coffee with milk',
          cruasán: 'croissant',
          camarero: 'waiter',
          sonríe: 'smiles',
          paga: 'pays',
          ventana: 'window',
          caliente: 'hot'
        }),
        sentencesJson: JSON.stringify([
          { target: 'Sofía va a la cafetería todas las mañanas.', english: 'Sofía goes to the coffee shop every morning.' },
          { target: 'Ella compra un café con leche y un cruasán.', english: 'She buys a coffee with milk and a croissant.' },
          { target: 'El camarero le sonríe y le dice: \'¡Buenos días!\'', english: 'The waiter smiles at her and says: \'Good morning!\'' },
          { target: 'Sofía paga cinco euros y se sienta cerca de la ventana.', english: 'Sofía pays five euros and sits near the window.' },
          { target: 'Le gusta leer su libro mientras bebe el café caliente.', english: 'She likes to read her book while drinking the hot coffee.' }
        ])
      },
      {
        title: 'Un Viaje en Tren',
        level: 'A2',
        contentTarget: 'Mateo tiene un billete para viajar de Madrid a Barcelona en tren. El tren sale de la estación a las ocho en punto. Durante el viaje, mira por la ventana y ve campos hermosos. A su lado, un hombre lee un periódico en catalán. Mateo llega cansado pero muy emocionado por ver a sus amigos.',
        contentEnglish: 'Mateo has a ticket to travel from Madrid to Barcelona by train. The train leaves the station at exactly eight o\'clock. During the trip, he looks out the window and sees beautiful fields. Next to him, a man reads a newspaper in Catalan. Mateo arrives tired but very excited to see his friends.',
        wordsJson: JSON.stringify({
          billete: 'ticket',
          viajar: 'to travel',
          sale: 'leaves',
          estación: 'station',
          campos: 'fields',
          hermosos: 'beautiful',
          'al lado': 'next to',
          periódico: 'newspaper',
          cansado: 'tired',
          emocionado: 'excited'
        }),
        sentencesJson: JSON.stringify([
          { target: 'Mateo tiene un billete para viajar de Madrid a Barcelona en tren.', english: 'Mateo has a ticket to travel from Madrid to Barcelona by train.' },
          { target: 'El tren sale de la estación a las ocho en punto.', english: 'The train leaves the station at exactly eight o\'clock.' },
          { target: 'Durante el viaje, mira por la ventana y ve campos hermosos.', english: 'During the trip, he looks out the window and sees beautiful fields.' },
          { target: 'A su lado, un hombre lee un periódico en catalán.', english: 'Next to him, a man reads a newspaper in Catalan.' },
          { target: 'Mateo llega cansado pero muy emocionado por ver a sus amigos.', english: 'Mateo arrives tired but very excited to see his friends.' }
        ])
      },
      {
        title: 'El Misterio del Parque',
        level: 'B1',
        contentTarget: 'Ayer por la tarde, Laura caminaba por el parque cuando escuchó un ladrido suave. Detrás de un gran roble, encontró a un pequeño perro de color marrón. El perro parecía asustado y no tenía ningún collar con el nombre de su dueño. Laura decidió llevarlo a una clínica veterinaria cercana para ver si tenía microchip. Afortunadamente, el veterinario encontró la información y llamó a la dueña, quien estaba llorando de alegría.',
        contentEnglish: 'Yesterday afternoon, Laura was walking through the park when she heard a soft bark. Behind a large oak tree, she found a small brown dog. The dog seemed scared and did not have any collar with his owner\'s name. Laura decided to take him to a nearby veterinary clinic to see if he had a microchip. Fortunately, the veterinarian found the information and called the owner, who was crying with joy.',
        wordsJson: JSON.stringify({
          caminaba: 'was walking',
          ladrido: 'bark',
          roble: 'oak tree',
          asustado: 'scared',
          collar: 'collar',
          dueño: 'owner',
          llevarlo: 'to take him',
          cercana: 'nearby',
          afortunadamente: 'fortunately',
          llorando: 'crying'
        }),
        sentencesJson: JSON.stringify([
          { target: 'Ayer por la tarde, Laura caminaba por el parque cuando escuchó un ladrido suave.', english: 'Yesterday afternoon, Laura was walking through the park when she heard a soft bark.' },
          { target: 'Detrás de un gran roble, encontró a un pequeño perro de color marrón.', english: 'Behind a large oak tree, she found a small brown dog.' },
          { target: 'El perro parecía asustado y no tenía ningún collar con el nombre de su dueño.', english: 'The dog seemed scared and did not have any collar with his owner\'s name.' },
          { target: 'Laura decidió llevarlo a una clínica veterinaria cercana para ver si tenía microchip.', english: 'Laura decided to take him to a nearby veterinary clinic to see if he had a microchip.' },
          { target: 'Afortunadamente, el veterinario encontró la información y llamó a la dueña, quien estaba llorando de alegría.', english: 'Fortunately, the veterinarian found the information and called the owner, who was crying with joy.' }
        ])
      },
      {
        title: 'El Futuro del Planeta',
        level: 'B2',
        contentTarget: 'A pesar de los desafíos ecológicos, el uso de energías renovables ha aumentado considerablemente. Los científicos insisten en que debemos reducir drásticamente nuestra dependencia de los combustibles fósiles. Muchos países están invirtiendo en infraestructura solar y eólica para mitigar el cambio climático. No obstante, la transición ecológica requiere un compromiso tanto político como ciudadano a gran escala. Si no actuamos con urgencia, las futuras generaciones sufrirán las consecuencias de nuestra inacción.',
        contentEnglish: 'Despite ecological challenges, the use of renewable energy has increased considerably. Scientists insist that we must drastically reduce our dependence on fossil fuels. Many countries are investing in solar and wind infrastructure to mitigate climate change. However, the ecological transition requires both political and citizen commitment on a large scale. If we do not act urgently, future generations will suffer the consequences of our inacción.',
        wordsJson: JSON.stringify({
          desafíos: 'challenges',
          renovables: 'renewable',
          aumentado: 'increased',
          insisten: 'insist',
          'combustibles fósiles': 'fossil fuels',
          invirtiendo: 'investing',
          eólica: 'wind',
          mitigar: 'mitigate',
          'no obstante': 'however',
          inacción: 'inaction'
        }),
        sentencesJson: JSON.stringify([
          { target: 'A pesar de los desafíos ecológicos, el uso de energías renovables ha aumentado considerablemente.', english: 'Despite ecological challenges, the use of renewable energy has increased considerably.' },
          { target: 'Los científicos insisten en que debemos reducir drásticamente nuestra dependencia de los combustibles fósiles.', english: 'Scientists insist that we must drastically reduce our dependence on fossil fuels.' },
          { target: 'Muchos países están invirtiendo en infraestructura solar y eólica para mitigar el cambio climático.', english: 'Many countries are investing in solar and wind infrastructure to mitigate climate change.' },
          { target: 'No obstante, la transición ecológica requiere un compromiso tanto político como ciudadano a gran escala.', english: 'However, the ecological transition requires both political and citizen commitment on a large scale.' },
          { target: 'Si no actuamos con urgencia, las futuras generaciones sufrirán las consecuencias de nuestra inacción.', english: 'If we do not act urgently, future generations will suffer the consequences of our inaction.' }
        ])
      }
    ];

    for (const data of storiesData) {
      const story = this.storiesRepository.create(data);
      await this.storiesRepository.save(story);
    }
    console.log('PostgreSQL database successfully seeded with stories.');
  }

  async getStoriesForUser(userId: number): Promise<any[]> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const level = user ? user.currentLevel : 'A1';

    const stories = await this.storiesRepository.find({
      where: { level },
    });

    return stories.map((s) => ({
      id: s.id,
      title: s.title,
      level: s.level,
      content_target: s.contentTarget,
      content_english: s.contentEnglish,
      words: s.wordsJson ? JSON.parse(s.wordsJson) : {},
      sentences: s.sentencesJson ? JSON.parse(s.sentencesJson) : [],
    }));
  }
}
