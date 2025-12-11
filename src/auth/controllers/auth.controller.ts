import { Controller, HttpCode, HttpStatus, Post, UseGuards, Request } from "@nestjs/common";
import { LocalAuthGuard } from "../guard/local-auth.guard";
import { AuthService } from "../services/auth.service";

@Controller("/auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('/logar')
    async login(@Request() req: any) {
        return this.authService.login(req.user);
    }
}
