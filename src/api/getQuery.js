import axios from "axios";

export const getQuery = queryObj => {
    const API = "https://scidbtest.scibite.com:9243/";
    const DEFAULT_QUERY = "_search?pretty";

    return axios
        .get(API + DEFAULT_QUERY, {
            auth: {
                username: "candidate",
                password: "ge37X7sYt8"
            },
            headers: {},
            params: {
                source: JSON.stringify(queryObj),
                source_content_type: "application/json"
            },
            body: {
                index: "scidb"
            }
        })
        .then(response => response.data)
        .catch(error => {
            console.log(error);
        });
}