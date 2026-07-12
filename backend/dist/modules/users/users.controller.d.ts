import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    get(): Promise<import("../../entities/user.entity").User>;
    onboard(data: any): Promise<{
        status: string;
        user: import("../../entities/user.entity").User;
    }>;
}
