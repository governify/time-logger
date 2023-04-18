import { redisClient as client } from "../server.js";

export async function addLog(req, res) {
    const {timestamp, url, id} = res.locals.oas.body;
    client.set(timestamp, JSON.stringify({url, id})).then(() => {
        res.status(201).send();
    }).catch((err) => {
        res.status(500).send({message: err.message});
    });
}

export function getLogs(req, res) {
    const { from, to, sort, search } = res.locals.oas.params;
    client.keys('*').then((keys) => {
        const promises = keys
            .filter((key) => (!from || new Date(key) >= new Date(from)) && (!to || new Date(key) <= new Date(to)))
            .sort((a,b) => (new Date(a) - new Date(b)) * (sort === 'asc' ? 1 : -1))
            .map((key) => client.get(key).then(v => ({timestamp: key, ...JSON.parse(v)})));
        Promise.all(promises).then((values) => {
            res.send(values.filter(v => (!search || new RegExp(search).test(v.url))));
        }).catch((err) => {
            res.status(500).send({message: err.message});
        });
    }).catch((err) => {
        res.status(500).send({message: err.message});
    });
}