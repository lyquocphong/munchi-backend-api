import { v4 as uuidv4 } from 'uuid';

export function generateUuid() {
    const publicId = uuidv4();
    return publicId;
}
