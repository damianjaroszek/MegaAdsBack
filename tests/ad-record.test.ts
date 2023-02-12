import {AdRecord} from "../records/ad.record";

const defaultObj = {
    name: 'Test Name',
    description: 'Test Description',
    url: 'https://megak.pl',
    price: 0,
    lat: 9,
    lon: 9,
}

test('Can build AdRecord', () => {
    const ad = new AdRecord(defaultObj);
    expect(ad.name).toBe('Test Name');
    expect(ad.description).toBe('Test Description');
});

test('Validates invalid price', () => {
    expect(() => new AdRecord(new AdRecord({
        ...defaultObj,
        price: -3,
    }))).toThrow('Cena nie może być mniejsza niż 0 lub większa niż 9 999 999.'); // konstruktor zawsze jest synchroniczny
});

//@TODO: CHeck all the validations
