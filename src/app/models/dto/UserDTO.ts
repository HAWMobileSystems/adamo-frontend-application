import { AbstractDto } from "./AbstractDto";
import { RoleType } from "../role-type";

export class UserDto extends AbstractDto {
    firstName: string;

    lastName: string;

    // @ApiPropertyOptional()
    // username: string;

    role: RoleType;

    email: string;

    
    token?: string;
}