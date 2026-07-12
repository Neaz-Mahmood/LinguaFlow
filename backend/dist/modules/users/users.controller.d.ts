import { User } from '../../entities/user.entity';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    get(user: User): Promise<User>;
    onboard(user: User, data: any): Promise<{
        status: string;
        user: User;
    }>;
}
