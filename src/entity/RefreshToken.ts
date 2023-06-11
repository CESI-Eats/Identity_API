import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;

    @Column()
    token: string;
    
    @Column({ default: true })
    isValid: boolean;
}
