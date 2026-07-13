import { User } from '../../entities/user.entity';
import { OnboardUserDto } from './dto/onboard-user.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    get(user: User): Promise<User>;
    updatePreferences(user: User, data: UpdatePreferencesDto): Promise<{
        status: string;
        user: User;
    }>;
    onboard(user: User, data: OnboardUserDto): Promise<{
        status: string;
        user: User;
    }>;
}
