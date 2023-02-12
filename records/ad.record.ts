import {AdEntity, NewAdEntity, SimpleAdEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {v4 as uuid} from 'uuid';

type AdRecordResult = [AdEntity[], FieldPacket[]];

export class AdRecord implements AdEntity {


    id: string;
    name: string;
    description: string;
    price: number;
    url: string;
    lat: number;
    lon: number;

    constructor(obj: NewAdEntity) {
        if (!obj.name || obj.name.length > 100) {
            throw new ValidationError('Nazwa ogłoszenia nie może być pusta ani przekraczać 100 znaków.');
        }

        if (obj.description.length > 1000) {
            throw new ValidationError('Treść ogłoszenie nie może przekraczać 1000 znaków.');
        }

        if (obj.price < 0 || obj.price > 9999999) {
            throw new ValidationError('Cena nie może być mniejsza niż 0 lub większa niż 9 999 999.');
        }

        if (!obj.url || obj.url.length > 100) {
            throw new ValidationError('Link ogłoszenia nie może być pusty ani przekraczać 100 znaków.');
        }
        //@TODO Check if url is valid!

        if (typeof obj.lat !== 'number' || typeof obj.lon !== 'number') {
            throw new ValidationError('Nie można zlokalizować ogłoszenia.');
        }

        this.id = obj.id;
        this.name = obj.name;
        this.description = obj.description;
        this.price = obj.price;
        this.url = obj.url;
        this.lat = obj.lat;
        this.lon = obj.lon;

    }

    static async getOne(id: string): Promise<AdRecord | null> {
        if (!id) {
            throw new ValidationError('Id can not be an empty string');
        }

        const [results] = await pool.execute('SELECT * FROM `ads` WHERE `id`=:id', {
            id: id,
        }) as AdRecordResult;

        return results.length === 0 ? null : new AdRecord(results[0]);

    }


    // ------------- MODYFIKACJA FUNKCJI FIND ALL - ZWRACANA OKROJONA ILOŚĆ DANYCH ---------------- //
    static async findAll(name: string): Promise<SimpleAdEntity[]> {
        const [results] = await pool.execute('SELECT * FROM `ads` WHERE `name` LIKE :search', {
            search: `%${name}%`, // LIKE w placeholders
        }) as AdRecordResult;
        return results.map(result => {
            const {id, lat, lon} = result;  // okrajamy zwracane wyniki do id, lat, lon
            return {
                id,
                lat,
                lon,
            }
        });
    }

    // ---- IMPLEMENTACJA FUNKCJI INSERT --------------------
    async insert(): Promise<void> {
        if (!this.id) {
            this.id = uuid();
        } else {
            throw new ValidationError('Cannot insert something that is already inserted');
        }


        await pool.execute('INSERT INTO `ads` (`id`, `name`, `description`, `price`, `url`, `lat`, `lon`) VALUES (:id, :name, :description, :price, :url, :lat, :lon)', this
            // { // zamiast przypisania możemy przekazać całyu obiekt this, który zawiera te wszystkie pola
            //     id: this.id,
            //     name: this.name,
            //     description: this.description,
            //     price: this.price,
            //     url: this.url,
            //     lat: this.lat,
            //     lon: this.lon,
            // } as AdEntity

        );

    }
}
