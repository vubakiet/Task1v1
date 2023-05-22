import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Role } from '../enum';
import { ROLE_KEY } from '../decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requireRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLE_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requireRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        const userCreated = await this.userRepository.findOneBy({
            id: user?.userId,
        });

        return requireRoles.some((role) =>
            userCreated.permission?.includes(role),
        );
    }
}
