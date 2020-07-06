
import { AbstractDto } from './AbstractDto';

export abstract class AbstractEntity<T extends AbstractDto = AbstractDto> {
   
    id: string;

    createdAt: Date;

    updatedAt: Date;

    abstract dtoClass: new (entity: AbstractEntity, options?: any) => T;

    // toDto(options?: any) {
    //     return UtilsService.toDto(this.dtoClass, this, options);
    // }
}
