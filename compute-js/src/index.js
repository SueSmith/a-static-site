
/// <reference types="@fastly/js-compute" />
import { getServer } from '../static-publisher/statics.js';
import { getGeolocationForIpAddress } from "fastly:geolocation";
const staticContentServer = getServer();

// eslint-disable-next-line no-restricted-globals
addEventListener("fetch", (event) => event.respondWith(handleRequest(event)));
async function handleRequest(event) {
  let req = event.request;
  let url = new URL(req.url);
  let ip =
    new URL(event.request.url).searchParams.get("ip") ||
    event.client.address;
  let geo = getGeolocationForIpAddress(ip);
  let where =
    geo.city.charAt(0).toUpperCase() +
    geo.city.slice(1).toLowerCase() +
    " " +
    geo.country_code;


  if (url.pathname.indexOf(".css") >= 0) {
    url.pathname = "edge.css";

    // Build a new request
    req = new Request(url, req);
  }
  const response = await staticContentServer.serveRequest(req);
  if (response != null) {

//    let pop = response.headers.get("x-served-by");
//    if (pop) pop = pop.substring(pop.lastIndexOf("-") + 1);

    // Tell the user about how this response was delivered with a cookie
    response.headers.set(
      "Set-Cookie",
      "location=This reponse was delivered by Fastly " +
//      pop +
      " for a request from " +
      where +
      "; SameSite=None; Secure"
    );
    return response;
  }

  // Do custom things here!
  // Handle API requests, serve non-static responses, etc.



  return new Response('Not found', { status: 404 });
}

