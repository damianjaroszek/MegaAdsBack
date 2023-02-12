import {Router} from "express";
import {AdRecord} from "../records/ad.record";
import {AdEntity, SimpleAdEntity} from "../types";

export const adRouter = Router();

adRouter
    .get('/search/:name?', async (req, res) => {
        const ads: SimpleAdEntity[] = await AdRecord.findAll(req.params.name ?? ''); // jeżeli brak name to wstaw pusty string wtedy wylistuje wszystko z bazy
        res.json(ads);
    })

    .get('/:id', async (req, res) => {
        const ad: AdEntity = await AdRecord.getOne(req.params.id);
        res.json(ad);
    })

    .post('/', async (req, res) => {
        const ad = new AdRecord(req.body);
        await ad.insert();
        res.json(ad);

    });
