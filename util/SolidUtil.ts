
import {
    createSolidDataset,
    getIntegerAll,
    getSolidDataset,
    getStringNoLocaleAll,
    getThing,
    getUrl,
    getUrlAll,
    removeInteger,
    removeStringNoLocale,
    saveSolidDatasetAt,
    Thing,
    Url
} from "@inrupt/solid-client";

import { Session } from "@inrupt/solid-client-authn-browser";


const NS = {
    STORAGE: "http://www.w3.org/ns/pim/space#storage",
    TEXT: "https://schema.org/text",
    CREATED: "http://www.w3.org/2002/12/cal/ical#created",
    TYPE: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    HABIT: "http://www.w3.org/2002/12/cal/ical#Vtodo"
};

async function getPodUri(session: Session) : Promise<string> {
    const profileDataset = await getSolidDataset(session.info.webId, {fetch: session.fetch});
    const profile = getThing(profileDataset, session.info.webId);
    const podUrls = getUrlAll(profile, NS.STORAGE);

    return podUrls[0];
}

function deleteAllInts(thing: Thing, param: string | Url){
    getIntegerAll(thing, param).forEach((val) => {
        thing = removeInteger(thing, param, val);
    });
    
    return thing;
}

function deleteAllStrings(thing: Thing, param: string | Url){
    getStringNoLocaleAll(thing, param).forEach((val) => {
        thing = removeStringNoLocale(thing, param, val);
    });
    
    return thing;
}

async function getOrCreateDataset(indexUrl: string, opts) {
    try {
        // Attempt to grab the dataset
        const habitDataset = await getSolidDataset(indexUrl, opts);
        return habitDataset;
    } catch (error) {
        // If we errored, that means we failed to retrieve the dataset.
        // This likely means it's missing
        if(error.statusCode == 404 || error.statusCode == 403){
            // Attempt to generate a new one
            const habitDataset = await saveSolidDatasetAt(indexUrl, createSolidDataset(), opts);
            return habitDataset;
        }else{
            // Something else happened, TODO: handle
            throw error;
        }
    }
}

export { getPodUri, NS, deleteAllInts, deleteAllStrings, getOrCreateDataset }