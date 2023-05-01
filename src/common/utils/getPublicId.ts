import { v4 as uuidv4 } from 'uuid';

export function getPublicId() {
    const publicId = uuidv4();
    return publicId;
}
