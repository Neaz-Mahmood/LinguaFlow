import { User } from '../../entities/user.entity';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    get(user: User): Promise<User>;
    updatePreferences(user: User, data: UpdatePreferencesDto): Promise<{
        status: string;
        user: any;
    }>;
    onboard(user: User, data: any): Promise<{
        status: string;
        user: User;
    }>;
}
