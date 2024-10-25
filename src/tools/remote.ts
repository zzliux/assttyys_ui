import { remoteBackendAddr } from '../config';

export const doPost = async (url: string, data: any) => {
    const res = await fetch(`${remoteBackendAddr}${url}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return await res.json();
}

