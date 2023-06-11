import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { v4 as uuid } from "uuid";

export enum IdentityType {
    USER = "user",
    DELIVERYMAN = "deliveryman",
    RESTORER = "restorer",
    SALES = "sales",
    TECHNICAL = "technical"
}

@Entity()
export class Identity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    mail: string;

    @Column()
    password: string;

    @Column({
        type: "enum",
        enum: IdentityType
    })
    type: IdentityType;

    constructor() {
        this.id = uuid();
    }
}
