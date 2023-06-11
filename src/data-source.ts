import "reflect-metadata"
import { DataSource } from "typeorm"
import { Identity } from "./entity/Identity"
import { RefreshToken } from "./entity/RefreshToken"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 3001,
    username: "root",
    password: "password",
    database: "identity_dev",
    synchronize: true,
    logging: false,
    entities: [Identity, RefreshToken],
    migrations: [],
    subscribers: [],
})
