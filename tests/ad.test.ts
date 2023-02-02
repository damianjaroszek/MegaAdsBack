import {AdRecord} from "../records/ad.record";

test('AdRecord returns data from database for one entry.', async () => {
    const ad = await AdRecord.getOne('abc');


    expect(ad).toBeDefined();
    console.log(ad);
    expect(ad.id).toBe('abc');
    expect(ad.name).toBe('Test Name');

});

test('AdRecord returns null from database for unexisting entry.', async () => {
    const ad = await AdRecord.getOne('---');
    expect(ad).toBeNull();
});
