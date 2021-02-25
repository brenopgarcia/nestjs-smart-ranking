import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/criar-jogador.dto';
import { JogadoresService } from './jogadores.service';
import { Jogador } from './interfaces/jogador.interface';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Post()
  createAndUpdatePlayer(@Body() createPlayerDto: CreatePlayerDto): void {
    this.jogadoresService.createAndUpdatePlayer(createPlayerDto);
  }

  @Get()
  findPlayer(@Query('email') email: string): Promise<Jogador> {
    return this.jogadoresService.findByEmail(email);
  }
  findPlayers(): Promise<Jogador[]> {
    return this.jogadoresService.findPlayers();
  }

  @Delete()
  deletePlayer(@Query('email') email: string): void {
    this.jogadoresService.delete(email);
  }
}
