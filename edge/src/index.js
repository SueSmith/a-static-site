/**
 * THIS COMPUTE CODE RUNS ON THE FASTLY EDGE
 *
 * 🚀 🚀 🚀 Make sure you deploy again whenever you make a change here 🚀 🚀 🚀
 *
 * When the visitor makes a request for the deployed site
 *  - Our Compute code runs on a Fastly server
 *  - Grabs the user location from the request IP address
 *  - Makes the request to the origin for the site assets (HTML + CSS files, images)
 *  - Adds a cookie to the response and sends it back to the user
 * User's browser renders the web page and writes info to the page from the cookie
 *
 */

import { getGeolocationForIpAddress } from "fastly:geolocation";
let where = "?";

// We use a function to handle requests to the origin
addEventListener("fetch", (event) => event.respondWith(handleRequest(event)));

async function handleRequest(_event) {
  //The request the user made
  let req = _event.request;
  let url = new URL(req.url);

  //Find out the user location info
  try {
    let ip =
      new URL(_event.request.url).searchParams.get("ip") ||
      _event.client.address;

    /* 
    Info you can get from geo
    https://js-compute-reference-docs.edgecompute.app/docs/fastly:geolocation/getGeolocationForIpAddress
    */
    let geo = getGeolocationForIpAddress(ip);

    // Where is the user
    where =
      geo.city.charAt(0).toUpperCase() +
      geo.city.slice(1).toLowerCase() +
      " " +
      geo.country_code;

    // Set the stylesheet
    let style = "/edge.css";
    
    // 🚧 🚧 🚧 Add the code from Step 4 in the README on the next line 🚧 🚧 🚧
    
    if (url.pathname.indexOf(".css") >= 0) url.pathname = style;

    // Build a new request
    req = new Request(url, req);
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }

  //Get the origin response
  let backendResponse = await fetch(req, {
    backend: "github",
  });

  // We can find out which pop delivered the response
  let pop = backendResponse.headers.get("x-served-by");
  pop = pop.substring(pop.lastIndexOf("-") + 1);

  // Tell the user about how this response was delivered with a cookie
  backendResponse.headers.set(
    "Set-Cookie",
    "location=This reponse was delivered by the Fastly " +
      pop +
      " POP for a request from " +
      where +
      "; SameSite=None; Secure"
  );

  return backendResponse;
}
