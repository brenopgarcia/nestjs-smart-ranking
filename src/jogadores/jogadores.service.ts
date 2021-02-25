import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {
  // private jogadores: Jogador[] = [];

  constructor(
    @InjectModel('Jogador') private readonly jogadorModule: Model<Jogador>,
  ) {}

  private readonly logger = new Logger(JogadoresService.name);

  async createAndUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    const { email } = createPlayerDto;

    // const playerExists = this.jogadores.find(
    //   (jogador) => jogador.email === email,
    // );

    try {
      const playerExists = await this.jogadorModule.findOne({ email }).exec();

      if (playerExists) {
        this.update(createPlayerDto);
      } else {
        this.create(createPlayerDto);
      }
    } catch (error) {
      return error;
    }
  }

  async findPlayers(): Promise<Jogador[]> {
    // return this.jogadores;
    return await this.jogadorModule.find().exec();
  }

  async findByEmail(email: string): Promise<Jogador> {
    // const playerExists = this.jogadores.find(
    //   (jogador) => jogador.email === email,
    // );
    const playerExists = await this.jogadorModule.findOne({ email }).exec();
    if (!playerExists) {
      throw new NotFoundException(`No player found with e-mail ${email}`);
    }
    return playerExists;
  }

  async delete(email: string): Promise<any> {
    // const playerExists = this.jogadores.find(
    //   (jogador) => jogador.email === email,
    // );
    // if (!playerExists) {
    //   throw new NotFoundException(`No player found with e-mail ${email}`);
    // }
    // this.jogadores = this.jogadores.filter(
    //   (jogador) => jogador.email !== playerExists.email,
    // );
    return await this.jogadorModule.remove({ email }).exec();
  }

  private async create(createPlayerDto: CreatePlayerDto): Promise<Jogador> {
    const player = new this.jogadorModule(createPlayerDto);

    await player.save();

    return player;

    // const { nome, telefoneCelular, email } = createPlayerDto;
    // const jogador: Jogador = {
    //   _id: uuid.v4(),
    //   nome,
    //   telefoneCelular,
    //   email,
    //   ranking: null,
    //   posicaoRanking: null,
    //   urlFotoJogador: null,
    // };
    // this.logger.log(`createPlayerDto: ${JSON.stringify(jogador)}`);
    // this.jogadores.push(jogador);
  }

  private async update(createPlayerDto: CreatePlayerDto): Promise<Jogador> {
    // const { nome } = createPlayerDto;
    // playerExists.nome = nome;
    return await this.jogadorModule
      .findOneAndUpdate(
        { email: createPlayerDto.email },
        { $set: createPlayerDto },
      )
      .exec();
  }
}
