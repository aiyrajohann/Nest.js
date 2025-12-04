import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult,ILike, Repository } from "typeorm";
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
    async findAllByTitulo(titulo: string): Promise<Postagem[]> {
        return this.postagemRepository.find({
            where: {
                titulo: ILike(`%${titulo}%`)
            }
        });
    }
    async create (postagem: Postagem): Promise<Postagem> {
        return this.postagemRepository.save(postagem);
    }
    async update (postagem: Postagem): Promise<Postagem> {
        await this.findById(postagem.id);
        return this.postagemRepository.save(postagem);
    }
    async delete (id: number): Promise<DeleteResult> {
        await this.findById(id);
        return this.postagemRepository.delete(id);
    }

        }