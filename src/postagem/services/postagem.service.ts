import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Postagem } from "../entities/postagem.entity";

@Injectable()
export class PostagemService {
    constructor(
        @InjectRepository(Postagem)
        private postagemRepository: Repository<Postagem>
    ) {}
    async findAll(): Promise<Postagem[]> {
        return this.postagemRepository.find();
    }
    async findById(id: number): Promise<Postagem> {
        const postagem = await this.postagemRepository.findOne
        ({where: {id}});

        if (!postagem) {
            throw new HttpException('Postagem not found', HttpStatus.NOT_FOUND);
        }
        return postagem;
        }
}