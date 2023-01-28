import { parseXmlForTesting } from '../src/modules/upload/uploadRoutes.js';

const { parseXml, checkXmlType } = parseXmlForTesting;

describe('parseXml', () => {
  it('should parse xml', async () => {
    const req = { file: { buffer: Buffer.from('<xml>test</xml>') } };

    const callback = jest.fn();

    await parseXml(req, callback);

    expect(callback).toHaveBeenCalledWith(null, { xml: 'test' });
  });

  it('should handle errors', async () => {
    const req = { file: { buffer: Buffer.from('<xml>test') } };

    const callback = jest.fn();

    await parseXml(req, callback);

    expect(callback).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('checkXmlType', () => {
  it('should return an array of objects when given a valid json object', () => {
    const json = {
      ResultList: [],
      StartList: [],
      CourseData: [],
    };

    const expected = [
      { isArray: true, jsonKey: 'ResultList', jsonValue: ['ResultList', []] },
      { isArray: true, jsonKey: 'StartList', jsonValue: ['StartList', []] },
      { isArray: true, jsonKey: 'CourseData', jsonValue: ['CourseData', []] },
    ];

    expect(checkXmlType(json)).toEqual(expected);
  });

  it('should return an empty array when given an invalid json object', () => {
    const json = {};

    expect(checkXmlType(json)).toEqual([]);
  });
});
