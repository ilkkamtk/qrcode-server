import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import QRCode from 'qrcode';
import {User} from '../../interfaces/User';
import getDistance from 'geolib/es/getDistance';

const ids: string[] = ['12345', '67890', 'abcde', 'fghij'];
const location = {
  type: 'Point',
  coordinates: [24.7454183, 60.240817],
};

const getCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const codes = {
      courseId: '12asdf34',
      ids,
    };

    // create QR code
    const code = await QRCode.toDataURL(JSON.stringify(codes));

    res.json(code);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const updateCode = (data: User) => {
  // remove id from ids array
  console.log(data);
  const distance = getDistance(
    {
      latitude: data.location.coordinates[1],
      longitude: data.location.coordinates[0],
    },
    {latitude: location.coordinates[1], longitude: location.coordinates[0]}
  );
  console.log(distance);
  const index = ids.indexOf(data.id);
  if (index > -1 && distance < 200) {
    ids.splice(index, 1);
    return true;
  }
  return false;
};

export {getCode, updateCode};
