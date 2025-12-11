import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Usuario } from "../entities/usuario.entity";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>
    ) {}

    async findAll(): Promise<Usuario[]> {
        return await this.usuarioRepository.find({
            relations: {
                postagens: true
            }
        });
    }

    async findById(id: number): Promise<Usuario> {
        const usuario = await this.usuarioRepository.findOne({
            where: { id },
            relations: {
                postagens: true
            }
        });

        if (!usuario) {
            throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);
        }

        return usuario;
    }

    async findByUsuario(usuario: string): Promise<Usuario | undefined> {
        const buscaUsuario = await this.usuarioRepository.findOne({
            where: { usuario }
        });
        return buscaUsuario || undefined;
    }

    async create(usuario: Usuario): Promise<Usuario> {
        const buscaUsuario = await this.findByUsuario(usuario.usuario);

        if (buscaUsuario) {
            throw new HttpException('O Usuário já existe!', HttpStatus.BAD_REQUEST);
        }

        usuario.senha = await bcrypt.hash(usuario.senha, 10);
        return await this.usuarioRepository.save(usuario);
    }

    async update(usuario: Usuario): Promise<Usuario> {
        const updateUsuario = await this.findById(usuario.id);
        
        const buscaUsuario = await this.findByUsuario(usuario.usuario);

        if (buscaUsuario && buscaUsuario.id !== usuario.id) {
            throw new HttpException('Usuário já cadastrado!', HttpStatus.BAD_REQUEST);
        }

        usuario.senha = await bcrypt.hash(usuario.senha, 10);
        return await this.usuarioRepository.save(usuario);
    }
}
