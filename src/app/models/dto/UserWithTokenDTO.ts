import { UserDto } from "./UserDTO";

export class UserWithTokenDto {
    user: UserDto;
    token: Object;
}