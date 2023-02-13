import {createPool} from "mysql2/promise";
import {config} from "../config/config";

export const pool = createPool({
    host: config.dbHost,
    user: config.dbUser,
    //password: '', // nie udostępniamy swoich haseł na github, warto ten plik dodać do .gitignore --> utils/db.ts
    database: config.dbDatabase,
    namedPlaceholders: true,
    decimalNumbers: true,
});
