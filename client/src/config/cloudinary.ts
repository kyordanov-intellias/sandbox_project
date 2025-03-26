import { Cloudinary } from '@cloudinary/url-gen';
import { env } from './env';

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: env.cloudinary.cloudName
  }
});

export default cloudinary;