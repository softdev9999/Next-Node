export const ga = (eventName) => {
    if (eventName) {
        console.log("GA EVENT fired: ", eventName);
        window._gaq && window._gaq.push(["_trackEvent", "Sidebar", eventName]);

        //window.dataLayer && window.dataLayer.push('event', eventName, {'event_category':'Sidebar'});
    }
};

export const gtag = (...args) => {
    window.gtag && window.gtag(...args);
};

export const addTracking = (category, action, label, event = "click") => {
    return {
        "ga-on": event,
        "ga-event-category": category,
        "ga-event-action": action,
        "ga-event-label": label
    };
};

export const fbq = (...args) => {
    window._fbq && window._fbq(...args);
};

export const snaptr = (...args) => {
    window._snaptr && window._snaptr(...args);
};

export const twq = (...args) => {
    window._twq && window._twq(...args);
};

export const rdt = (...args) => {
    window._rdt && window._rdt(...args);
};

export const trackEventAll = (eventName) => {
    if (eventName) {
        eventName = eventName.toLowerCase();
        switch (eventName) {
            case "addtocart": {
                fbq("track", "AddToCart");
                snaptr("track", "ADD_CART");
                twq("track", "Download");
                rdt("track", "AddToCart");
                break;
            }
            case "purchase": {
                fbq("track", "Purchase");
                snaptr("track", "PURCHASE");
                twq("track", "Purchase", { value: "0", currency: "USD", num_items: "1" });
                rdt("track", "Purchase");
                break;
            }
            case "startcheckout": {
                fbq("track", "InitiateCheckout");
                snaptr("track", "START_CHECKOUT");
                break;
            }
            case "share": {
                fbq("track", "Lead");
                snaptr("track", "SHARE");
                break;
            }
        }
    }
};

const GA_TRACKING_ID = process.env.STAGE == "prod" ? "UA-106177781-1" : "UA-106177781-2";
export { GA_TRACKING_ID };
