import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UsuarioService } from "../../usuario/services/usuario.service";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private usuarioService: UsuarioService,
        private jwtService: JwtService
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const buscaUsuario = await this.usuarioService.findByUsuario(username);

        if (!buscaUsuario) {
            throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);
        }

        const match = await bcrypt.compare(password, buscaUsuario.senha);

        if (buscaUsuario && match) {
            const { senha, ...result } = buscaUsuario;
            return result;
        }

        return null;
    }

    async login(usuarioLogin: any) {
        const payload = { sub: usuarioLogin.id, username: usuarioLogin.usuario };

        return {
            id: usuarioLogin.id,
            nome: usuarioLogin.nome,
            usuario: usuarioLogin.usuario,
            foto: usuarioLogin.foto,
            token: `Bearer ${this.jwtService.sign(payload)}`
        };
    }
}
