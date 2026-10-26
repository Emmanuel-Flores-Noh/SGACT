const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

async function POST(endpoint: string, jsonData: Object): Promise<Response> {
    return fetch(`${API_URL}${endpoint}`, {
        body: JSON.stringify(jsonData),
        headers: {
            "Content-Type": "application/json",
        },
        method: 'POST',
        credentials: 'include'
    });
}

async function GET(endpoint: string): Promise<Response> {
    return fetch(`${API_URL}${endpoint}`,{
        method: 'GET',
        credentials: 'include'
    })
}

export {
    GET,
    POST,
    API_URL
};