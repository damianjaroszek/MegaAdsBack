import {AdRecord} from "../records/ad.record";
import {pool} from "../utils/db";
import {AdEntity} from "../types";

afterAll(async () => {
    await pool.end();  // po zakończeniu testów zakończ połączenie z bazą danych żeby nie potrzenie nie wisiało połączenie
})

test('AdRecord returns data from database for one entry.', async () => {
    const ad = await AdRecord.getOne('abc');


    expect(ad).toBeDefined();
    console.log(ad);
    expect(ad.id).toBe('abc');
    expect(ad.name).toBe('Test Name');

});


test('AdRecord.getOne returns null from database for unexisting entry.', async () => {
    const ad = await AdRecord.getOne('---');
    expect(ad).toBeNull();
});

/// ------------ TESTY DO WYSZUKIWANIA OGŁOSZEŃ ------------------

test('AdRecord.findAll returns array of found entries.', async () => {
    const ads = await AdRecord.findAll('');
    expect(ads).not.toEqual([]);
    expect(ads[0].id).toBeDefined();

});

test('AdRecord.findAll returns array of when searching entries for "Test".', async () => {
    const ads = await AdRecord.findAll('Test');
    expect(ads).not.toEqual([]);
    expect(ads[0].id).toBeDefined();

});

test('AdRecord.findAll returns array of when searching entries for something that does not exist.', async () => {
    const ads = await AdRecord.findAll('----');
    expect(ads).toStrictEqual([]);

});

// --------- TESTY DO OGRANICZANIA ZWRACANYCH DANYCH W OGŁOSZENIU ----------------
test('AdRecord.findAll returns smaller amount of data.', async () => {
    const ads = await AdRecord.findAll('');
    expect(ads[0].id).toBeDefined();
    // expect(ads[0].price).toBeUndefined(); // w takiej formie już sam TS nam wywali błąd i test się nie wykona
    // expect(ads[0].description).toBeUndefined();

    // ale można to obejść wskazując typ na AdEntity, który zawiera pola price i description
    expect((ads[0] as AdEntity).price).toBeUndefined();
    expect((ads[0] as AdEntity).description).toBeUndefined();

});

// --------- TESTY DODAWANIA OGŁOSZEŃ ----------------

test('AdRecord.inserts returns new UUID.', async () => {

    const ad = new AdRecord({
        name: 'Test Name',
        description: 'Test Description',
        url: 'https://megak.pl',
        price: 0,
        lat: 9,
        lon: 9,
    });

    await ad.insert();

    expect(ad.id).toBeDefined();
    expect(typeof ad.id).toBe('string');

});

test('AdRecord.insert inserts data to database.', async () => {

    const ad = new AdRecord({
        id: 'abc',
        name: 'Test Name',
        description: 'Test Description',
        url: 'https://megak.pl',
        price: 0,
        lat: 9,
        lon: 9,
    });

    const foundAd = await AdRecord.getOne(ad.id);

    expect(foundAd).toBeDefined();
    expect(foundAd).not.toBeNull();
    expect(foundAd.id).toBe(ad.id);


});
