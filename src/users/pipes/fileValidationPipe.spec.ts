import { BadRequestException } from '@nestjs/common';
import { Readable } from 'stream';
import { ValidateFile } from './fileValidation.pipe';

const fakeImageFile: Express.Multer.File = {
  fieldname: 'fake',
  originalname: 'fake',
  encoding: 'fake',
  mimetype: 'image/jpg',
  destination: 'fake',
  filename: 'fake',
  path: 'fake',
  size: 0,
  buffer: Buffer.from('fake'),
  stream: new Readable(),
};

const fakeNoImageFile: Express.Multer.File = {
  fieldname: 'fake',
  originalname: 'fake',
  encoding: 'fake',
  mimetype: 'fake',
  destination: 'fake',
  filename: 'fake',
  path: 'fake',
  size: 0,
  buffer: Buffer.from('fake'),
  stream: new Readable(),
};

describe('ValidateFile', () => {
  let validateFile: ValidateFile;

  beforeAll(async () => {
    validateFile = new ValidateFile();
  });

  it('should be defined', () => {
    expect(validateFile).toBeDefined();
  });

  describe('transform', () => {
    it('should throw an error if no file is provided', async () => {
      try {
        validateFile.transform(undefined, undefined);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should throw an error if the file is not an image', async () => {
      try {
        validateFile.transform(fakeNoImageFile, undefined);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should return the file if it is an image', async () => {
      const file = validateFile.transform(fakeImageFile, undefined);

      expect(file).toEqual(fakeImageFile);
    });
  });
});
